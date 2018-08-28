/**
 * Created by osx on 2017/7/11.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ListView,
    Image,
    StyleSheet,
    TextInput,
    RefreshControl
}from 'react-native';

import constants from "../../../common/constants"
import LoadMoreFooter from '../../../common/LoadMoreFooter';
import Util from "../../../common/utils";
import {fetchConversionList,refreshConversionList,useConversion} from '../../../actions/mine/promotionCodeAction'
import {connect} from "react-redux";

class PromotionCode extends Component{
    constructor(props){
        super(props);
        this.state={
            code:'',
        };
    }

    componentDidMount() {
        const {PromotionCodeReducer} = this.props;
        this.props.dispatch(fetchConversionList(PromotionCodeReducer.page+1,PromotionCodeReducer.limit))
    }

    _renderFooter() {
        const {PromotionCodeReducer} = this.props;
        return <LoadMoreFooter
            isLoading={PromotionCodeReducer.isLoading}
            hasMore={PromotionCodeReducer.hasMore}
            networkError={PromotionCodeReducer.networkError}
            isEmpty={PromotionCodeReducer.isEmpty}
        />
    }

    //下拉刷新
    _onRefresh() {
        this.props.dispatch(refreshConversionList());
    }

    //上拉加载更多
    _loadMoreData() {
        const {PromotionCodeReducer} = this.props;
        if (PromotionCodeReducer.hasMore) {
            this.props.dispatch(fetchConversionList(++PromotionCodeReducer.page,PromotionCodeReducer.limit));
        }
    }
    //兑换
    _convert(){
       const {actions} = this.props;
        if (this.state.code === '') {
            Util.toast('请输入兑换码')
        }else{
            this.props.dispatch(useConversion(this.state.code));
        }
    }

    /**
     * 渲染一条数据
     * @param rowData
     * @return {XML}
     * @private
     */
    _renderRow(rowData){
        //时间转换
        var Timestamp = new Date(rowData.time);
        if(Timestamp.getMinutes() < 10){
            minutes = '0'+Timestamp.getMinutes()
        }else{
            minutes = Timestamp.getMinutes()
        }
        var time = (Timestamp.getMonth() +1 ) + '月' + Timestamp.getDate() + '日'+'  '+Timestamp.getHours()+': '+minutes;
        return (
            <View style={{flexDirection:'row',alignItems:'center',width:constants.window.width*0.95,borderBottomWidth:1,borderColor:'#cacaca',padding:5}}>
                <View style={{justifyContent:'center'}}>
                    <View>
                        <Text style={{fontSize:14,color:'#646464'}}>{rowData.remark}</Text>
                    </View>
                    <View style={{marginTop:5}}>
                        <Text style={{fontSize:14,color:'#979797'}}>{time}</Text>
                    </View>
                </View>
                <View style={{flex:1}}/>
                <View>
                    <Text style={{fontSize:14,color:'#64cad7'}}>+{rowData.points}</Text>
                </View>
            </View>
        )
    }

    render() {
        const {PromotionCodeReducer} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF'}}>
                <View style={{alignItems:"center",margin:constants.window.width*0.025,flex:1}}>
                    <TextInput  onChangeText={(text) => this.setState({code:text})}
                                placeholder="请输入兑换码"
                                placeholderTextColor="#cacaca"
                                underlineColorAndroid='rgba(0,0,0,0)'
                                style={{height:constants.window.width*0.14,
                                        width:constants.window.width*0.95,
                                        borderWidth:1,borderColor:'#f25b46',
                                        textAlign:'center',
                                        fontSize:16,
                                        marginTop:constants.window.width*0.025,
                    }}/>
                    <View style={{height:constants.window.width*0.05}}/>
                    <TouchableOpacity onPress={this._convert.bind(this)}>
                        <View style={this.state.code ===''? styles.buttonState0 : styles.buttonState1}>
                            <Text style={{fontSize:16,color:'#fff'}}>兑换</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height:constants.window.width*0.05}}/>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:5}}>
                        <View style={{borderWidth:0.5,borderColor:'#cacaca',marginRight:5,flex:1,height:0.5}}/>
                        <Text style={{color:'#cacaca',fontSize:12}}>兑换明细</Text>
                        <View style={{borderWidth:0.5,borderColor:'#cacaca',marginLeft:5,flex:1,height:0.5}}/>
                    </View>

                    {
                        (() => {
                            if (PromotionCodeReducer.count > 0 || PromotionCodeReducer.isLoading){
                                return(
                                    <ListView dataSource={PromotionCodeReducer.dataSource} //绑定数据源
                                              initialListSize={10}
                                              style={{marginBottom:-constants.window.width*0.025}}
                                        //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                                              removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                                              renderRow={this._renderRow.bind(this) } //返回一个条目
                                              onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                                              onEndReachedThreshold={40} //调用onEndReached的临界值，单位是像素
                                              renderFooter={ this._renderFooter.bind(this) }//页脚会永远在列表的最底部，页头会在最顶部
                                              enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                                              pageSize={10}
                                              showsVerticalScrollIndicator={false}
                                              refreshControl={ //添加下拉刷新的功能
                                                  <RefreshControl  //下拉刷新
                                                      refreshing={false} //是否在刷新时显示指示器
                                                      onRefresh={()=> {this._onRefresh()}}  //开始刷新时调用
                                                      colors={['#FFF']} //(安卓)指定至少一种颜色用来绘制刷新指示器
                                                      progressBackgroundColor="#00c6ad"/> //指定刷新指示器的背景色
                                              }
                                    />
                                )
                            } else {
                                return (
                                    <View style={{
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
                                            }}>您没有兑换记录哦~</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })()
                    }
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    buttonState0:{
        backgroundColor:'#c6c6c6',
        height:constants.window.width*0.14,
        width:constants.window.width*0.95,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonState1:{
        backgroundColor:'#00c6ad',
        height:constants.window.width*0.14,
        width:constants.window.width*0.95,
        justifyContent:'center',
        alignItems:'center'
    }
    }
);
export default connect(
    (state)=>({
        PromotionCodeReducer:state.PromotionCodeReducer,
    })
)(PromotionCode)


