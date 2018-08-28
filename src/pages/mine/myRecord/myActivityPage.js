import React,{Component} from 'react'

import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    RefreshControl,
    ListView,
} from 'react-native';

import constants from '../../../common/constants'
import LoadMoreFooter from '../../../common/LoadMoreFooter'
import config from '../../../common/configuration'
import {connect} from "react-redux";

import {refreshMyActivityList,loadingMyActivityList} from '../../../actions/mine/myActivityAction'

class MyActivity extends Component{
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props){
        super(props);
        this.state={
        }
    }

    /**
     * 渲染一条数据
     * @param rowData
     * @return {XML}
     * @private
     */
    _renderRow(rowData){
        var Timestamp = new Date(rowData.paytime);
        if(Timestamp.getMinutes() < 10){
            minutes1 = '0'+Timestamp.getMinutes()
        }else{
            minutes1 = Timestamp.getMinutes()
        }
        var time = (Timestamp.getMonth() +1 ) + '-' + Timestamp.getDate() + ' '+'  '+Timestamp.getHours()+': '+minutes1;
        return(
            <View style={{justifyContent:'center', backgroundColor:'#fff'}}>
                <MyActivityItem
                    img={rowData.detail_img}
                    title={rowData.title}
                    remain={rowData.remain}
                    detail={rowData.detail}
                    paytime={time}
                    upper_limit={rowData.upper_limit}
                    number_of_people={rowData.number_of_people}

                />
                <View style = {{
                    borderBottomWidth:1,
                    borderColor:'#d7d7d7',
                    width:constants.window.width-20,
                    marginLeft:10,
                    }}/>
            </View>
        )
    }


    /**
     * 下拉刷新
     * @function
     * @private
     */
    _onRefresh() {

        this.props.dispatch(refreshMyActivityList());
    }

    /**
     * 上拉加载更多
     * @function
     * @private
     */
    _loadMoreData() {
        const {MyActivityReducer} = this.props;
        if(MyActivityReducer.hasMore){
            this.props.dispatch(loadingMyActivityList(++MyActivityReducer.page));

        }
    }

    componentDidMount() {
        const {MyActivityReducer} = this.props;
        this.props.dispatch(loadingMyActivityList(MyActivityReducer.page+1));
    }

    /**
     * 渲染页脚
     * @function
     * @return {XML}
     * @private
     */
    _renderFooter() {
        const {MyActivityReducer} = this.props;
        return <LoadMoreFooter
            isLoading={MyActivityReducer.isLoading}
            hasMore={MyActivityReducer.hasMore}
            networkError={MyActivityReducer.networkError}
            isEmpty={MyActivityReducer.isEmpty}
        />
    }

    render(){
        const {MyActivityReducer} = this.props;
        return(
            <View style={styles.entirePage}>

                {
                    (() => {
                        if (MyActivityReducer.count > 0 || MyActivityReducer.isLoading) {
                            return (
                                <ListView dataSource={MyActivityReducer.dataSource} //绑定数据源
                                          initialListSize={10}
                                    //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                                          removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                                          renderRow={this._renderRow.bind(this) } //返回一个条目
                                          onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                                          onEndReachedThreshold={40} //调用onEndReached的临界值，单位是像素
                                          renderFooter={ this._renderFooter.bind(this) }//页脚会永远在列表的最底部，页头会在最顶部
                                          enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                                          pageSize={10}
                                          refreshControl={ //添加下拉刷新的功能
                                              <RefreshControl  //下拉刷新
                                                  refreshing={false} //是否在刷新时显示指示器
                                                  onRefresh={()=> {this._onRefresh()}}  //开始刷新时调用
                                                  colors={['#FFF']} //(安卓)指定至少一种颜色用来绘制刷新指示器
                                                  progressBackgroundColor="#00c6ad"/> //指定刷新指示器的背景色
                                          }
                                />)
                        } else {
                            return (
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
                                        }}>您还没有参加活动哦~</Text>
                                    </View>
                                </View>
                            )
                        }
                    })()
                }
            </View>
        )
    }
}

export class MyActivityItem extends Component{
    constructor(props){
        super(props);
        this.state={}
    }

    render(){
        //截取字符串

        var str2 = this.props.title;
        if(str2 !== undefined){
            var arr2 = str2.split(' ');
        }
        var str = this.props.detail;
        if(str !== undefined){
            var arr = str.split(' ');
        }
        return(
            <View style = {styles.tabView}>
                <View style = {{flexDirection:'row'}}>
                    <Image source={{uri:config.host + "upload/" + this.props.img}} style={styles.imgView}>
                        {(()=>{
                            if(this.props.remain>=0){
                                return (
                                    <Image source={require('../../../image/mine/myActivity/countdown.png')} style={styles.countdown}>
                                        <Text style={styles.count}>倒计时{this.props.remain}天</Text>
                                    </Image>)
                            }else{
                                return (
                                    <Image source={require('../../../image/mine/myActivity/countdown2.png')} style={styles.countdown}>
                                        <Text style={styles.count}>已失效</Text>
                                    </Image>)
                            }
                        })()}
                    </Image>

                    <View style = {styles.txtView}>
                        <Text style={{color:'#343434',fontSize:16}}>{arr2[1]}</Text>
                        <Text style={{color:'#a3a3a3',marginTop:(Platform.OS === 'ios')?5:10,fontSize:15}} numberOfLines={3}>{arr[0]}</Text>
                    </View>
                </View>

                <View style = {{flexDirection:'row',paddingTop:10}}>
                    <Image source={require('../../../image/mine/myActivity/clock.png')} style={styles.icon}/>
                    <Text style={styles.timeView}>{this.props.paytime}</Text>
                    <Image source={require('../../../image/mine/myActivity/men.png')} style={[styles.icon,{marginLeft:30}]}/>
                    <Text style={styles.timeView}>{this.props.number_of_people}/{this.props.upper_limit}</Text>
                    <View style={{flex:1}}/>
                    <Text style={[styles.timeView,{color:'#ff9131'}]}>报名成功</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    entirePage: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    tabView: {
        width:constants.window.width,
        padding:10
    },
    imgView: {
        width:120,
        height:93,
        borderRadius:6,
        overflow:'hidden',
    },
    countdown: {
        width:103,
        height:25,
        resizeMode:'contain',
        marginTop:64,
        marginLeft:-3,
        alignItems:'center'
    },
    count: {
        color:'#fff',
        fontSize:16,
        backgroundColor:'rgba(0,0,0,0)',
        marginTop:(Platform.OS === 'android')? 2: 0
    },
    txtView:{
        flexDirection:'column',
        marginLeft:8,
        width:constants.window.width-140
    },
    timeView: {
        color:'#00c6ad',
        fontSize:16,
        marginTop:-2,
        marginLeft:5
    },
    icon:{
        width:16,
        height:16,
        resizeMode:'contain'
    }


});
export default connect(
    (state)=>({
        MyActivityReducer:state.MyActivityReducer,
    })
)(MyActivity)
