import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ListView,
    RefreshControl,
} from 'react-native';

import Head from '../../../common/head'
import LoadMoreFooter from '../../../common/LoadMoreFooter';
import config from '../../../common/configuration'
import constants from '../../../common/constants'
import {connect} from "react-redux";
import {refreshOrder,fetchOrder} from '../../../actions/mine/orderAction'

export class Content extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Image source={require('../../../image/mine/article/rectangle.png')} style={styles.order}>

                <Image source={{uri:this.props.commodityImg}} style={{width: constants.window.width / 2 -20,
                    height: constants.window.height*0.15,marginLeft:10}} resizeMode='contain'/>


                <View style={{marginLeft:20,flex:1,backgroundColor:'rgba(0,0,0,0)',marginTop:-8}}>
                    <Text style={{textAlign:'right',color:'#ff6c33',fontSize:12,marginRight:12}}>已付款</Text>

                    <View style={{flexDirection:'row',paddingTop:3}}>
                        <Text style={{fontSize:16}}>{this.props.commodityName}  {this.props.count ? "x"+this.props.count:''}</Text>
                        <View style={{flex:1}} />
                        <Text style={{textAlign:'right',fontSize:16,marginRight:12}}>￥{this.props.commodityPrice}</Text>
                    </View>



                    <View style={{flexDirection:'row',marginTop:(Platform.OS === 'ios')? 5: 8}}>
                        <Text style={{color:'#999999',fontSize:12}}>购买时间: </Text>
                        <Text style={{color:'#999999',fontSize:12,marginTop:(Platform.OS === 'ios')? 1.6: 0}}>{this.props.time}</Text>
                    </View>
                </View>
            </Image>
        );
    }
}

class Order extends Component {
    constructor(props) {
        super(props);
        this.page = 1
    }

    //获取一条记录所需的信息
    _renderRow(rowData) {
        var formatDate = function (time) {
            var data = new Date(time);
            var year = data.getFullYear();
            var month = (data.getMonth() < 10) ? '0' + (data.getMonth() + 1) : data.getMonth() + 1;
            var day = (data.getDate() < 10) ? '0' + data.getDate() : data.getDate();
            // var hours = data.getHours();
            // var minutes = (data.getMinutes() < 10) ? '0'+ data.getMinutes() : data.getMinutes();
            return year + '-' + month + '-' + day;
        };

        return (
            <Content
                {...this.props}
                commodityImg={(config.host + "upload/" + rowData.img)} //商品的图片
                commodityName={rowData.name} //商品名称
                commodityPrice={rowData.total} //商品价格
                time={formatDate(rowData.payTime)} //购买时间
                count={rowData.amount} //购买数量
            />
        );
    }

    componentWillMount() {
        this.props.dispatch(refreshOrder());
    }

    componentWillUnmount(){
        this.page = 1
    }

    //上拉加载
    _loadMoreData() {
        const {OrderReducer} = this.props;
        if (OrderReducer.hasMore) {
            this.props.dispatch(fetchOrder(++this.page));
        }
    }

    //页眉页脚
    _renderFooter() {
        const {OrderReducer} = this.props;
        return <LoadMoreFooter
            networkError={OrderReducer.networkError}  //是否提示网络错误
            isLoading={OrderReducer.isLoading}    //是否显示一个圆形的loading提示符
            hasMore={OrderReducer.hasMore}  //后台是否还有记录没取到
        />
    }

    //下拉刷新
    _onRefresh() {
        this.props.dispatch(refreshOrder());
        this.page = 1
    }


    render() {
        const {OrderReducer} = this.props;
            if(OrderReducer.isEmpty){
                return (
                    <View style={{backgroundColor:"#f5f5f5",flex: 1}}>
                        <Head title={"交易记录"} click={()=>this.props.navigation.goBack()}/>
                        <View style={{
                            backgroundColor: '#f5f5f5',
                            paddingTop: 100,
                            height: constants.window.height
                        }}>
                            <Image source={require('../../../image/ticket/ticket.png')}
                                   style={{
                                       height: constants.window.height * 0.155,
                                       width: constants.window.width
                                   }}
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: '#AAAAAA',
                                    fontSize: 17,
                                    marginTop: 40
                                }}>您还没有交易记录哦~</Text>
                            </View>
                        </View>
                    </View>
                );
            }else {
                return (
                    <View style={{backgroundColor:"#f5f5f5",flex: 1}}>
                        <Head title={"交易记录"} click={()=>this.props.navigation.goBack()}/>
                        <ListView
                            removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                            dataSource={(new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows(OrderReducer.data)} //绑定数据源
                            initialListSize={6} //指定在组件刚挂载的时候渲染多少行数据。
                            renderRow={this._renderRow.bind(this)} //返回一个条目
                            enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                            pageSize={6}  //每次事件循环（每帧）渲染的行数。
                            onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                            onEndReachedThreshold={5}  //调用onEndReached的临界值，单位是像素
                            renderFooter={ this._renderFooter.bind(this) }  //页脚会永远在列表的最底部，页头会在最顶部
                            refreshControl={ //添加下拉刷新的功能
                                <RefreshControl  //下拉刷新功能
                                    refreshing={false} //是否在刷新时显示指示器
                                    onRefresh={ ()=> {this._onRefresh()} }  //下拉时,调用刷新
                                    colors={['#FFF']}  //(安卓)指定至少一种颜色用来绘制刷新指示器
                                    progressBackgroundColor="#00c6ad"  //指定刷新指示器的背景色
                                />
                            }

                        />
                    </View>
                );
            }
        }
}


const styles = StyleSheet.create({
    order:{
        flexDirection:'row',
        width:constants.window.width,
        height:constants.window.height*0.2,
        resizeMode:'contain',
        alignItems:'center',
        marginTop:-15
    },
});

export default connect(
    (state)=>({
        OrderReducer:state.OrderReducer
    })
)(Order)
