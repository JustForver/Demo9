import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';

import constants from '../../../common/constants'
import Head from '../../../common/head'
import LoadMoreFooter from '../../../common/LoadMoreFooter'
import config from '../../../common/configuration'
import Util from '../../../common/utils';
import {Card} from '../../../components/card/cardView';

import {refreshMallList, loadMallList} from '../../../actions/mine/mallAction';
import {connect} from "react-redux";


class Mall extends Component {
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
        this.props.dispatch(refreshMallList());
    }

    /**
     * 上拉加载更多
     * @private
     */
    _loadMoreData() {
        const {MallReducer} = this.props;
        if (MallReducer.hasMore) {
            this.props.dispatch(loadMallList(++MallReducer.page));
        }
    }

    componentDidMount() {
        const {MallReducer} = this.props;
        this.props.dispatch(loadMallList(MallReducer.page + 1));
    }

    _renderFooter() {
        const {MallReducer} = this.props;
        return (
            <View>
                <View style={{width: constants.window.width}}/>
                <LoadMoreFooter
                    isLoading={MallReducer.isLoading}
                    hasMore={MallReducer.hasMore}
                    networkError={MallReducer.networkError}
                    isEmpty={MallReducer.isEmpty}
                />

            </View>
        )
    }

    _renderRow(rowData) {//渲染
        return (
            <Goods
                {...this.props}
                head={rowData.name}
                details={rowData.depict}
                price={rowData.price}
                id={rowData.id}
                itemImg={rowData.img}
            />
        );
    }

    /**
     * 跳转到交易记录界面
     * @function
     */
    order() {
        const {UserReducer} = this.props;
        if (UserReducer.isLogin) {
            this.props.navigation.navigate('order');
        } else {
            Util.toast("请先登录");
        }
    }

    render() {
        const {MallReducer} = this.props;
        let right = (
            <TouchableWithoutFeedback onPress={this.order.bind(this)}>
                <View style={{alignItems: 'center', width: 80, height: 50, justifyContent: 'center'}}>
                    <Text style={{color: '#fff'}}>交易记录</Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View style={{backgroundColor: "#f5f5f5", flex: 1}}>
                <Head title={"充值"} click={() => {this.props.navigation.goBack()}} right={right}/>
                <ListView contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                    //horizontal={true}
                    //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                          removeClippedSubviews={false}     ////用于提升大列表的滚动性能,默认为true
                          dataSource={MallReducer.dataSource} //绑定数据源
                          initialListSize={10}
                          renderRow={this._renderRow.bind(this)} //返回一个条目
                          onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                          onEndReachedThreshold={20} //调用onEndReached的临界值，单位是像素
                          renderFooter={this._renderFooter.bind(this)}//页脚会永远在列表的最底部，页头会在最顶部
                          enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                          pageSize={10}
                          refreshControl={ //添加下拉刷新的功能
                              <RefreshControl  //下拉刷新
                                  refreshing={false} //是否在刷新时显示指示器
                                  onRefresh={this._onRefresh.bind(this)}  //开始刷新时调用
                                  colors={['#FFF']} //(安卓)指定至少一种颜色用来绘制刷新指示器
                                  progressBackgroundColor="#00c6ad"/> //指定刷新指示器的背景色
                          }
                />

            </View>
        )
    }
}

export class Goods extends Component {
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
     * 跳转到商品详情
     * @param id
     * @param img
     */
    detail(id, img, price,details) {
        this.props.detailLoading = true;
        this.props.navigation.navigate('mallDetail',
            {
                id: id,
                img: img,
                price:price,
                details:details
            }
        )

    }

    render() {
        let itemImg = config.host + "upload/" + this.props.itemImg;
        const card = {card: {width: constants.window.width / 2 - 10, height: constants.window.height * 0.21,}};
        return (
            <Card styles={card}>
                <TouchableOpacity onPress={() => {
                    this.detail(this.props.id, itemImg,this.props.price,this.props.details)
                }}>
                    <Image source={{uri: itemImg}} style={styles.picture}/>
                    <View style={{flexDirection: 'row', marginLeft: 5, marginRight: 5, marginTop: 8}}>
                        <Text style={styles.txt_1}>￥{this.props.price}</Text>
                        <View style={{flex: 1}}/>
                        <View>
                            <Text style={styles.txt_3}>充值</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Card>
        );

    }
}

const styles = StyleSheet.create({
    tabView: {
        width: constants.window.width / 2 - 10,
        height: constants.window.height * 0.21,
        backgroundColor: '#FFF',
        margin: 5,
        alignItems: 'center',
    },
    txt_1: {
        marginLeft: 10,
        fontSize: 14,
        paddingTop: 2,
    },
    border: {
        borderWidth: 1,
        borderColor: 'red',
        width: 70,
        height: 16,
        marginLeft: 10
    },
    txt_2: {
        color: 'red',
        fontSize: 8,
        textAlign: 'center',
        marginTop: 2
    },
    picture: {
        width: constants.window.width / 2 - 20,
        height: constants.window.height * 0.15,
        marginTop: 3,
        resizeMode: 'contain'
    },
    txt_3: {
        color: '#e1625d',
        textAlign: 'center',
        fontSize: 14,
        paddingTop: 1,
        paddingBottom: 1,
    }
});
export default connect(
    (state) => ({
        MallReducer: state.MallReducer,
    }),
)(Mall)