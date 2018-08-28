/**
 * Created by osx on 2017/6/26.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    ListView,
    Image,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import constants from "../../common/constants";
import LoadMoreFooter from '../../common/LoadMoreFooter';
import Head from '../../common/head';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";

import {refreshDetailLineList,fetchDetailLineList} from '../../actions/line/lineAction';
class All extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    /* startStation 起始站点
     * endStation 结束站点
     * line 线路
     * busTime 班车时间
     * price 价格
     */
    jump(id) {
        this.props.navigation.navigate('lineWebView',{
            id:id
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={()=> {this.jump(this.props.id)}}
                              activeOpacity={0.5}>
                <View  style={{flex:1,alignItems:'center',flexDirection:'row',marginTop:8,backgroundColor:'#ffffff',padding:12}}>
                    <Image source={require('../../image/line/point3.png')}
                           style={{
                               height: 38*1.2,
                               width: 17*1.2,
                               marginLeft: constants.window.width * 0.04,
                               resizeMode: 'contain',}}/>
                    <View style={{width:constants.window.width*0.6,marginLeft:10}}>
                        <Text style={{fontSize:15}}>{this.props.startStation}</Text>
                        <Text style={{fontSize:15,marginTop:12}}>{this.props.endStation}</Text>
                    </View>

                    <View style={{marginLeft:20,marginRight:20,flexDirection:'row'}}>
                        <FontAwesomeIcon name="database" color="#ff6c33" size={20}/>
                        <Text style={{fontSize:20,color:'red',marginLeft:5}}>{this.props.price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class NewDetailPage extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const id = this.props.navigation.getParam('id');
        const {LineReducer} = this.props;
        this.props.dispatch(refreshDetailLineList(id));
    }


    _renderRow(rowData) {
        return (
            <All
                {...this.props}
                startStation={rowData.start}
                id={rowData.id}
                endStation={rowData.end}
                price={rowData.price}
            />
        );
    }

    /**
     * 下拉刷新
     * @function _onRefresh
     * @private
     */
    _onRefresh() {
        this.props.dispatch(refreshDetailLineList(this.props.id));

    }

    /**
     * 加载更多
     * @function _loadMoreData
     * @private
     */
    _loadMoreData() {
        const {LineReducer} = this.props;
        if (LineReducer.hasMore) {
            this.props.dispatch(fetchDetailLineList(this.props.id,++LineReducer.page));
        }
    }

    /**
     * 渲染list页脚
     * @function _renderFooter
     * @return {XML}
     * @private
     */
    _renderFooter() {
        const {LineReducer} = this.props;
        return <LoadMoreFooter
            networkError={LineReducer.networkError}
            isLoading={LineReducer.isLoading}
            hasMore={LineReducer.hasMore}
            isEmpty={LineReducer.isEmpty}
        />
    }


    render() {
        const {LineReducer} = this.props;
        return (
            <View style={{backgroundColor: "#f5f5f5", flex: 1}}>
                <Head title={"线路列表"} click={()=>this.props.navigation.goBack()}/>
                <ListView dataSource={LineReducer.dataSource} //绑定数据源
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
                />
            </View>
        );
    }
}

export default connect(
    (state) => ({
        LineReducer:state.LineReducer
    }),
)(NewDetailPage)


