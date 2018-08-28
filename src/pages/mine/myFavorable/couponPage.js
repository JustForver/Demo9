/**
 * Created by osx on 2017/6/12.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    ListView,
    Image,
    RefreshControl
}from 'react-native';
import constants from "../../../common/constants"
import LoadMoreFooter from '../../../common/LoadMoreFooter';
import {fetchCouponList,refreshCouponList} from '../../../actions/mine/couponAction'
import {connect} from "react-redux";

class UnexpiredCoupon extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount() {
        const {CouponReducer} = this.props;
        this.props.dispatch(fetchCouponList(CouponReducer.page+1));

    }

    //下拉刷新
    _onRefresh() {
        this.props.dispatch(refreshCouponList());
    }

    //加载更多
    _loadMoreData() {
        const {CouponReducer} = this.props;
        if (CouponReducer.hasMore) {
            this.props.dispatch(fetchCouponList(++CouponReducer.page));
        }
    }

    _renderFooter() {
        const {CouponReducer} = this.props;
        return <LoadMoreFooter
            networkError={CouponReducer.networkError}
            isLoading={CouponReducer.isLoading}
            hasMore={CouponReducer.hasMore}
            isEmpty={CouponReducer.isEmpty}
        />

    }
    /**
     * 渲染一条数据
     * @param rowData
     * @return {XML}
     * @private
     */
    _renderRow(rowData){
        let year = new Date(rowData.endTime).getFullYear();
        let month = new Date(rowData.endTime).getMonth() + 1;
        let day = new Date(rowData.endTime).getDate();
        if(month < 10){
            month = '0'+month
        }
        if(day < 10){
            day = '0'+day
        }

        if(rowData.state===0){
            return (
                <Image source={require('../../../image/mine/myTicket/ticketItemBg.png')}
                       style={{
                           marginTop: constants.window.width *348/1050 * 0.05,
                           backgroundColor:'rgba(0,0,0,0)',
                           width: constants.window.width,
                           height: constants.window.width *348/1050,
                       }}>

                    <View style={{flex:1,height: constants.window.width *348/1050,width: constants.window.width,justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center',marginLeft:24}}>
                                <Text style={{fontSize:25,color:'#1CC0CE',}}>{rowData.denomination}<Text style={{fontSize:12,color:'#1CC0CE'}}>积分</Text></Text>
                                <Text style={{fontSize:15,color:'#1CC0CE',marginTop:2}}>抵用券</Text>
                            </View>

                            <View style={{borderLeftWidth:0.8,borderColor:'#e0e0e0',height:constants.window.width *0.25,marginLeft:24,marginTop:5}}/>

                            <View style={{flex:2 ,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:18,}}>{rowData.name}</Text>
                                <Text style={{fontSize:13,color:'#D4C73C',marginTop:2}}>有效期至：{year}-{month}-{day}</Text>
                            </View>
                        </View>
                    </View>
                </Image>
               )}
        else if(rowData.state===1){
            return(
                <Image source={require('../../../image/mine/myTicket/ticketItemBg.png')}
                       style={{
                           marginTop: constants.window.width *348/1050 * 0.05,
                           backgroundColor:'rgba(0,0,0,0)',
                           width: constants.window.width,
                           height: constants.window.width *348/1050,
                       }}>

                    <View style={{flex:1,height: constants.window.width *348/1050,width: constants.window.width,justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center',marginLeft:24}}>
                                <Text style={{fontSize:25,color:'#D1D1D1'}}>{rowData.denomination}<Text style={{fontSize:12,color:'#D1D1D1'}}>积分</Text></Text>
                                <Text style={{fontSize:15,color:'#D1D1D1',marginTop:2}}>抵用券</Text>
                            </View>

                            <View style={{borderLeftWidth:0.8,borderColor:'#D1D1D1',height:constants.window.width *0.25,marginLeft:24,marginTop:5}}/>


                            <View style={{flex:2 ,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:18,color:'#D1D1D1'}}>已使用</Text>
                                <Text style={{fontSize:13,color:'#D1D1D1',marginTop:2}}>有效期至：{year}-{month}-{day}</Text>
                            </View>
                        </View>
                    </View>
                </Image>
            )}
        else if(rowData.state===2){
            return(
                <Image source={require('../../../image/mine/myTicket/ticketItemBg.png')}
                       style={{
                           marginTop: constants.window.width *348/1050 * 0.05,
                           backgroundColor:'rgba(0,0,0,0)',
                           width: constants.window.width,
                           height: constants.window.width *348/1050,
                       }}>

                    <View style={{flex:1,height: constants.window.width *348/1050,width: constants.window.width,justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center',marginLeft:24}}>
                                <Text style={{fontSize:25,color:'#D1D1D1'}}>{rowData.denomination}<Text style={{fontSize:12,color:'#D1D1D1'}}>积分</Text></Text>
                                <Text style={{fontSize:15,color:'#D1D1D1',marginTop:2}}>抵用券</Text>
                            </View>

                            <View style={{borderLeftWidth:0.8,borderColor:'#D1D1D1',height:constants.window.width *0.25,marginLeft:24,marginTop:5}}/>



                            <View style={{flex:2 ,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:18,color:'#D1D1D1'}}>已过期</Text>
                                <Text style={{fontSize:13,color:'#D1D1D1',marginTop:2}}>有效期至：{year}-{month}-{day}</Text>
                            </View>
                        </View>
                    </View>
                </Image>
            )}
    }


    render() {
        const {CouponReducer} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5'}}>
                {
                    (() => {
                        if (CouponReducer.count > 0 || CouponReducer.isLoading) {
                            return (
                                <ListView dataSource={CouponReducer.dataSource} //绑定数据源
                                          initialListSize={6} //初次加载显示的条数,次条数必须小于每次拿的条数。
                                    //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                                          removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                                          renderRow={this._renderRow.bind(this)} //返回一个条目
                                          onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                                          onEndReachedThreshold={20} //调用onEndReached的临界值，单位是像素
                                          renderFooter={ this._renderFooter.bind(this) }//页脚会永远在列表的最底部，页头会在最顶部
                                          enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                                          refreshControl={ //添加下拉刷新的功能
                                              <RefreshControl  //下拉刷新
                                                  refreshing={false} //是否在刷新时显示指示器
                                                  onRefresh={ ()=> {this._onRefresh()}}  //开始刷新时调用
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
                                        }}>您还没有优惠券记录哦~</Text>
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
export default connect(
    (state)=>({
        CouponReducer:state.CouponReducer
    })
)(UnexpiredCoupon)


