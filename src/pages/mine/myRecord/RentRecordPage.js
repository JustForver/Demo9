import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ListView,
    RefreshControl,
    Modal
} from 'react-native';
import constants from "../../../common/constants";
import LoadMoreFooter from '../../../common/LoadMoreFooter'
import {refreshRentList,rentSearch} from '../../../actions/line/rentAction'
import {connect} from "react-redux";

class RentRecord extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            check: 0,
            pay: false,
            tradeNo: "",
        };
    }

    componentDidMount() {
        this.inquire();
    }

    renderRow(rowData) {
        let img;
        switch (rowData.commodityName) {
            case "14座":
                img = require('../../../image/rent/car14.png');
                break;
            case "17座":
                img = require('../../../image/rent/car17.png');
                break;
            case "49座":
                img = require('../../../image/rent/car49.png');
                break;
            case "旅游":
                img = require('../../../image/rent/tourism.png');
                break;
        }
        let state1;
        let state2;
        switch (rowData.orderState) {
            case 0:
                state1 = "预约已提交正在审核";
                state2 = "审核中";
                break;
            case 1:
                state1 = "审核已通过等待付款";
                state2 = "1";
                break;
            case 2:
                state1 = "已付款欢迎使用";
                state2 = "已付款";
                break;
            case 3:
                state1 = "欢迎使用亚投新能包车服务";
                state2 = "已退款";
                break;
            case 4:
                state1 = "欢迎使用亚投新能包车服务";
                state2 = "已过期";
                break;
            case 5:
                state1 = "预约审核未通过";
                state2 = "未通过";
                break;
        }
        return (
            <View>
                <View style={styles.list_view}>
                    <View>
                        <Image source={img} resizeMode="contain" style={{width: constants.window.width * 0.25}}/>
                    </View>
                    <View style={{width: constants.window.width * 0.5, marginLeft: 10}}>
                        <Text style={{fontSize: 16}}>出行直通车</Text>
                        <Text style={{color: '#feb729', fontSize: 16}}>{rowData.commodityName}</Text>
                        <Text style={{marginTop: 5, fontSize: 12, color: "#BABABA"}}>{state1}</Text>
                    </View>
                    {(() => {
                        if (state2 === "1")
                            return (
                                <View style={{
                                    left: -15,
                                    width: constants.window.width * 0.2,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{fontSize: 20, color: "#cc6859"}}>¥{rowData.price}</Text>
                                    <TouchableWithoutFeedback onPress={() => {
                                        this.state.tradeNo = rowData.tradeNo;
                                        this.payOpen()
                                    }}>
                                        <View style={{
                                            height: constants.window.height * 0.06,
                                            width: constants.window.width * 0.2,
                                            backgroundColor: "#63B8FF",
                                            borderRadius: 4,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text>付款</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            );
                        else if (state2 === "1" && rowData.commodityId === "旅游车")
                            return (
                                <View style={{width: constants.window.width * 0.2}}>
                                    <Text style={{left: -15, fontSize: 20, color: "#BABABA"}}>价格面议</Text>
                                </View>
                            );
                        else
                            return (
                                <View style={{width: constants.window.width * 0.2}}>
                                    <Text style={{left: -15, fontSize: 20, color: "#BABABA"}}>{state2}</Text>
                                </View>
                            )
                    })()}
                </View>
                <View style={{backgroundColor: '#FFFFFF', height: 2, marginBottom: 10}}>
                    <Image source={require('../../../image/rent/rentHr.png')}
                           style={{height: 1, width: constants.window.width - 20, marginLeft: 10}}/>
                </View>
            </View>
        );
    }

    inquire() {
        this.setState({check: 1});
        const {RentReducer, UserReducer} = this.props;
        RentReducer.page = 0;
        this.props.dispatch(refreshRentList(UserReducer.phoneNumber));
    }

    _renderFooter() {
        const {RentReducer} = this.props;
        return <LoadMoreFooter
            isLoading={RentReducer.isLoading}
            hasMore={RentReducer.hasMore}
            networkError={RentReducer.networkError}
            isEmpty={RentReducer.isEmpty}
        />
    }

    //下拉刷新
    _onRefresh() {
        const { UserReducer} = this.props;
        this.props.dispatch(refreshRentList(UserReducer.phoneNumber));
    }

    //上拉加载更多
    _loadMoreData() {
        const {RentReducer, actions, UserReducer} = this.props;
        if (RentReducer.hasMore) {
            this.props.dispatch(rentSearch(UserReducer.phoneNumber, ++RentReducer.page));
        }
    }

    payOpen() {
        this.setState({pay: true});
    }

    close() {
        this.setState({pay: false});
    }

   /* //支付宝支付
    alipay() {
        const {actions, RentReducer} = this.props;
        actions.rentAlipayPay(this.state.tradeNo);
        this.close();
        if (RentReducer.paySuccess) {
            this._onRefresh();
            RentReducer.paySuccess = false;
        }
    }

    //微信支付
    weChatPay() {
        const {actions, RentReducer} = this.props;
        actions.rentWxPay(this.state.tradeNo);
        this.close();
        if (RentReducer.paySuccess) {
            this._onRefresh();
            RentReducer.paySuccess = false;
        }
    }*/

    render() {
        const {RentReducer} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: "#FFF"}}>

                {
                    (() => {
                        if (RentReducer.count > 0 || RentReducer.isLoading) {
                            return (
                                <ListView
                                    dataSource={RentReducer.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                    initialListSize={5}
                                    //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                                    removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                                    onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                                    onEndReachedThreshold={40} //调用onEndReached的临界值，单位是像素
                                    renderFooter={ this._renderFooter.bind(this) }//页脚会永远在列表的最底部，页头会在最顶部
                                    enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                                    pageSize={5}
                                    refreshControl={ //添加下拉刷新的功能
                                        <RefreshControl  //下拉刷新
                                            refreshing={false} //是否在刷新时显示指示器
                                            onRefresh={ () => {
                                                this._onRefresh()
                                            }}  //开始刷新时调用
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
                                        }}>您还没有包车记录哦~</Text>
                                    </View>
                                </View>
                            )
                        }
                    })()
                }

                <Modal animationType='fade' transparent={true} visible={this.state.pay} onRequestClose={() => {
                }}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.close()
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}>
                            <TouchableWithoutFeedback onPress={() => {
                            }}>
                                <View style={styles.modal}>
                                    <Text style={[styles.spinnerTitle, {fontSize: 20, color: 'black'}]}>
                                        选择支付方式
                                    </Text>
                                    <View style={styles.shareParent}>
                                        <TouchableOpacity onPress={() => {
                                            this.alipay()
                                        }} style={styles.content}>
                                            <View style={styles.shareContent}>
                                                <Image
                                                    source={require('../../../image/mine/mall/commodityDetailed/zhifubao.png')}
                                                    style={{width: 44, height: 44}}
                                                    resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>支付宝</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            this.weChatPay()
                                        }} style={styles.content}>
                                            <View style={styles.shareContent}>
                                                <Image
                                                    source={require('../../../image/mine/mall/commodityDetailed/weixin.png')}
                                                    style={{width: 46, height: 46}}
                                                    resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>微信</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    head: {
        width: constants.window.width,
        height: (Platform.OS === 'ios') ? 60 : 50,
        backgroundColor: '#00c6ad',
        flexDirection: 'row',
        alignItems: 'center',
    },
    list_view: {
        paddingTop: 10,
        paddingLeft: 10,
        height: constants.window.height * 0.13,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15,
    },
    modal: {
        width: constants.window.width * (7 / 10),
        height: constants.window.width * (7 / 10) * 0.68,
        backgroundColor: '#fcfcfc',
        padding: 20,
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 20,
    },
    spinnerTitle: {
        fontSize: 18,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        marginTop: (Platform.OS === 'android') ? 3 : 0,
    },
});

export default connect(
    (state)=>({
        RentReducer: state.RentReducer,
        UserReducer: state.UserReducer,
    })
)(RentRecord)
