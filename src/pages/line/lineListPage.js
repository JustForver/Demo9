import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
} from 'react-native';

import LoadMoreFooter from '../../common/LoadMoreFooter';

import LineBasic from './lineBasicPage'
import config from "../../common/configuration";
import constants from "../../common/constants"
import {connect} from "react-redux";

import {fetchPropLineList,refreshPropLineList} from '../../actions/line/lineAction';

class LineList extends Component{
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
     * 将获取的线路信息取出来
     * @param rowData
     * @return {XML}
     * @private
     */
    _renderRow(rowData) {
        let img = config.host + "upload/" + rowData.img;
        return (
            <LineBasic
                {...this.props}
                id={rowData.id}
                name={rowData.name}
                img={img}
                synopsis={rowData.synopsis}
            />
        );
    }

    /**
     * 下拉刷新
     * @function _onRefresh
     * @private
     */
    _onRefresh() {

        this.props.dispatch(refreshPropLineList(this.props.type));
    }

    /**
     * 加载更多
     * @function _loadMoreData
     * @private
     */
    _loadMoreData() {
        const {LineListReducer} = this.props;
        if (LineListReducer.hasMore) {
            this.props.dispatch(fetchPropLineList(this.props.type,++LineListReducer.page));
        }
    }

    /**
     * 渲染list页脚
     * @function _renderFooter
     * @return {XML}
     * @private
     */
    _renderFooter() {
        const {LineListReducer} = this.props;
        return <LoadMoreFooter
            networkError={LineListReducer.networkError}
            isLoading={this.props.loading ? this.props.loading:LineListReducer.isLoading}
            hasMore={LineListReducer.hasMore}
            isEmpty={LineListReducer.isEmpty}
        />
    }
    render() {
        const {LineListReducer} = this.props;
        return (
            <View style={{flex:1}}>
                {
                    (() => {
                        if (LineListReducer.count > 0 || LineListReducer.isLoading || this.props.loading) {
                            return (
                                <ListView dataSource={LineListReducer.dataSource} //绑定数据源
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
                                    <Image source={require('../../image/ticket/ticket.png')}
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
                                        }}>线路筹备中，敬请期待</Text>
                                    </View>
                                </View>
                            )
                        }
                    })()
                }
            </View>
        );
    }
}



export default connect(
    (state) => ({
        LineListReducer: state.LineListReducer
    }),
)(LineList)


