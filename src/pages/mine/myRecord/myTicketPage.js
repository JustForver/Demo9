import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    RefreshControl,
    ListView
} from 'react-native';

import constants from '../../../common/constants';
import LoadMoreFooter from '../../../common/LoadMoreFooter'
import {connect} from "react-redux";

import {refreshListCreator,fetchTicketList} from '../../../actions/mine/myTicketAction'
/**
 *ticketHead 表头
 *startStation 起始站点
 * endStation 结束站点
 * line 线路
 * purchaseTime 购票时间
 */

class MyTicket extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 下拉刷新
     * @private
     */
    _onRefresh() {
        this.props.dispatch(refreshListCreator());
    }

    /**
     * 上拉加载更多
     * @private
     */
    _loadMoreData() {
        const {MyTicketReducer} = this.props;
        if(MyTicketReducer.hasMore){
            this.props.dispatch(fetchTicketList(++MyTicketReducer.page));
        }
    }

    componentDidMount() {
        const {MyTicketReducer} = this.props;
        this.props.dispatch(fetchTicketList(MyTicketReducer.page+1));
    }

    render() {
        const {MyTicketReducer} = this.props;
        return (
            <View style={{flex: 1,backgroundColor: '#f5f5f5'}}>
                {
                    (() => {
                        if (MyTicketReducer.count > 0 || MyTicketReducer.isLoading) {
                            return (
                                <ListView dataSource={MyTicketReducer.dataSource} //绑定数据源
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
                                        }}>您还没有乘车记录哦~</Text>
                                    </View>
                                </View>
                            )
                        }
                    })()
                }
            </View>

        );
    }

    _renderRow(rowData) {//渲染
        //时间转换
        var Timestamp = new Date(rowData.time);
        if(Timestamp.getMinutes() < 10){
            minutes = '0'+Timestamp.getMinutes()
        }else{
            minutes = Timestamp.getMinutes()
        }
        var time = (Timestamp.getMonth() +1 ) + '月' + Timestamp.getDate() + '日'+'  '+Timestamp.getHours()+': '+minutes;

        let priceFormat;
        if(rowData.price===0){
            priceFormat= 0
        }else {
            priceFormat=('-'+Math.abs(rowData.price))}
        return (
            <TicketItem
                startStation={rowData.start_station}
                endStation={rowData.end_station}
                line={rowData.lineName}
                purchaseTime={"乘车时间: "+ time}
                integral={priceFormat}
            />
        );

    }


    _renderFooter() {
        const {MyTicketReducer} = this.props;
        return <LoadMoreFooter
            isLoading={MyTicketReducer.isLoading}
            hasMore={MyTicketReducer.hasMore}
            networkError={MyTicketReducer.networkError}
            isEmpty={MyTicketReducer.isEmpty}
        />
    }
}

export class TicketItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loopsRemaining: 3
        };
    }

    render() {
        return (
            <Image style={styles.ticketWItemBg} source={require("../../../image/mine/myTicket/ticketItemBg.png")}>
                <View style={{flexDirection:'column',marginLeft:32}}>
                    <View style={styles.round}>
                        <Text style={styles.number}>{this.props.line}</Text>
                    </View>
                    <Text style={styles.integral}>积分：{this.props.integral}</Text>
                </View>

                <View style={{borderLeftWidth:0.8,borderColor:'#e0e0e0',height:constants.window.height*0.12,marginLeft:24,marginTop:-2}}/>

                <View style={{marginLeft:constants.window.width * 0.05}}>
                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                        <Image source={require('../../../image/line/point3.png')} style={styles.point} resizeMode='contain'/>
                        <View style={{flexDirection: 'column', width:constants.window.width*0.5}} >
                            <Text style={styles.startStation} numberOfLines={1}>{this.props.startStation}</Text>
                            <Text style={[styles.startStation,styles.endStation]} numberOfLines={1}>{this.props.endStation}</Text>
                        </View>
                    </View>

                    <View style={{borderBottomWidth:0.8,borderColor:'#e0e0e0',width:constants.window.width*0.52,marginTop:10}}/>
                    <Text style={styles.purchaseTime}>{this.props.purchaseTime}</Text>
                </View>
            </Image>
        );

    }
}

const styles = StyleSheet.create({
    ticketWItemBg: {
        width: constants.window.width,
        height: constants.window.height * 0.19,
        flexDirection: "row",
        alignItems:'center',
    },
    round: {
        borderRadius: constants.window.height * 0.075/2,
        width: constants.window.height * 0.075,
        height: constants.window.height * 0.075,
        overflow: 'hidden',
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00c6ad'
    },
    number: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        backgroundColor: 'transparent'
    },
    integral: {
        backgroundColor:'rgba(0,0,0,0)',
        color:'#333333',
        marginTop:10,
        marginLeft:2,
        fontSize:constants.window.width * 0.04
    },
    point: {
        height: 38,
        width: 17,
        resizeMode: 'contain',
    },
    startStation: {
        fontSize: constants.window.width * 0.04,
        marginLeft: 8,
        backgroundColor: 'transparent',
        color:'#333333'
    },
    endStation: {
        marginTop: (Platform.OS === 'ios') ? 4 : 8,
    },
    purchaseTime:{
        color:'#999999',
        fontSize:constants.window.width * 0.03,
        marginTop:8,
        backgroundColor:'rgba(0,0,0,0)',
    }
});
export default connect(
    (state) => ({
        MyTicketReducer:state.MyTicketReducer,
        UserReducer:state.UserReducer
    }),
)(MyTicket)
