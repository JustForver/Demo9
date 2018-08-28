import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Platform,
    TouchableWithoutFeedback,
    RefreshControl,
    Alert,
    Modal,
    ActivityIndicator,
    ImageBackground
} from 'react-native';

import constants from '../common/constants'
import HeadPage from '../common/headImagePage'
import ProgressiveImage from '../components/progressiveImage'

import LoadMoreFooter from "../common/LoadMoreFooter"

import config from "../common/configuration"
import {connect} from "react-redux";

import SelectActivity from './activity/selectActivityPage'

import {refreshActivityList,activityList,fetchActivityTypeList} from '../actions/activityAction'
import {fetchActivityLD,fetchRedEnvelope} from '../actions/mine/preActivityAction'

class Activity extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            activity: false,
        }
    }

    //下拉刷新
    _onRefresh() {
        const {ActivityReducer} = this.props;
        this.props.dispatch(refreshActivityList(ActivityReducer.genre));
    }

    //上拉加载更多
    _loadMoreData() {
        const {ActivityReducer} = this.props;
        if(ActivityReducer.hasMore){
            this.props.dispatch(activityList(++ActivityReducer.page,ActivityReducer.genre));
        }
    }

    componentWillMount() {
        const {ActivityReducer} = this.props;
        this.props.dispatch(activityList(++ActivityReducer.page,ActivityReducer.genre));
        this.props.dispatch(fetchActivityTypeList());

    }
    /**
     * 关闭model框
     * @function close
     */
    close() {
        this.setState({activity: false});
    }

    /**
     * 打开model框
     * @function open
     */
    open(){
        this.setState({activity: true});
    }

    /**
     * 跳转到活动详情
     * @param id
     */
    activityDetails(id,type,url){
        const {ActivityReducer} = this.props;
        if (type === 2){
            ActivityReducer.detailLoading = true;
            this.props.navigation.navigate('activityDetail',{
                id:id,
                type:ActivityReducer.genre
            });
        }else if(type === 3){         //返回状态为3 点击图片进入webView页面
            this.props.navigation.navigate('webView',{
                url:url
            });
        }else{
            this.open();
        }
    }

    /**
     * 跳转到活动界面
     * @function active
     */
    active(id,type) {
        const {UserReducer} = this.props;
        if(UserReducer.isLogin){
            if(type === 4){          //返回状态为4 判断为活动 点击活动触发活动的接口
                this.props.dispatch(fetchActivityLD());
            }else{                     //返回状态为1 判断为红包 点击红包触发获取积分的接口
                this.props.dispatch(fetchRedEnvelope());
            }
        }else{
            Alert.alert('',
                '请先登录',
                [
                    {text: '取消', onPress: () => {}},
                    {text: '确定', onPress: () => {
                            this.close();
                            this.props.navigation.navigate('phoneLogin',{
                                props:{...this.props}
                            });
                        }},
                ]
            )
        }
    }

    /**
     * 渲染一条数据
     * @param data
     * @return {XML}
     * @private
     */
    _renderRow(data) {
        let img = config.host + "upload/" + data.img;
        if (data.img !== undefined) {
            var arr = data.img.split('.');
        }
        return (
            <View>
                <TouchableWithoutFeedback onPress={() => {this.activityDetails(data.id,data.type,data.detail)}}>
                    <View style={styles.tabView}>
                        <ProgressiveImage
                            thumbnailSource={{ uri: config.host + "upload/" + arr[0]+'_thumb.'+arr[1]}}
                            imageSource={{uri: img}}
                            style={{width: constants.window.width - 20, height: constants.window.height * 0.2}}
                        />
                    </View>
                </TouchableWithoutFeedback>

                <Modal animationType='fade' transparent={true} visible={this.state.activity} onRequestClose={()=> {}}>
                    <TouchableWithoutFeedback onPress={()=> {this.close()}}>
                        <View style={styles.modelView}>
                            <View style = {{position:'absolute',top:30,right:20}}>
                                <Text style = {{color:'#fff',fontSize:18}}>关闭</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=> {this.setState({activity:true})}}>
                                <ImageBackground source={{uri:config.host + "upload/" + data.detail_img}} style={styles.adv} resizeMode='contain'>
                                    <TouchableWithoutFeedback onPress={()=> {this.active(data.id,data.type)}}>
                                        <View style = {{width: constants.window.width - 70, height: 66,position:'absolute',bottom:16}}/>
                                    </TouchableWithoutFeedback>
                                </ImageBackground>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }

    _renderFooter() {
        const {ActivityReducer} = this.props;
        return <LoadMoreFooter
            isLoading={ActivityReducer.isLoading}
            hasMore={ActivityReducer.hasMore}
            networkError={ActivityReducer.networkError}
            isEmpty={ActivityReducer.isEmpty}
        />

    }


    render() {
        const {ActivityReducer} = this.props;
        return (
            <View style={{flex:1,backgroundColor: '#f5f5f5'}}>
                <HeadPage/>
                <SelectActivity/>
                {(()=> {
                    // 城市选择滚动条的loading
                    if (ActivityReducer.isLoading) {
                        return (
                            <View style={{height: 50, alignItems: 'center', justifyContent: 'center',marginTop:-50,backgroundColor: '#00c6ad'}}>
                                <ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color="#fff"
                                    {...this.props}
                                />
                            </View>
                        )
                    }
                })()}
                {
                    (() => {
                        if (ActivityReducer.count > 0 || ActivityReducer.isLoading) {
                            return (
                                <ListView dataSource={ActivityReducer.dataSource} //绑定数据源
                                          initialListSize={5}
                                    //这是一个应用在长列表上极其重要的优化。Android上，overflow值总是hidden的，所以你不必担心没有设置它。而在iOS上，你需要确保在行容器上设置了overflow: hidden
                                          removeClippedSubviews={false}     //用于提升大列表的滚动性能,默认为true
                                          renderRow={this._renderRow.bind(this) } //返回一个条目
                                          onEndReached={this._loadMoreData.bind(this)}  //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                                          onEndReachedThreshold={40} //调用onEndReached的临界值，单位是像素
                                          renderFooter={ this._renderFooter.bind(this) }//页脚会永远在列表的最底部，页头会在最顶部
                                          enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                                          pageSize={5}
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
                                    <Image source={require('../image/ticket/ticket.png')}
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
                                        }}>活动筹备中，敬请期待</Text>
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
const styles=StyleSheet.create({
    tabView:{
        flex:1,
        paddingTop:8,
        alignItems: 'center',
        justifyContent:'center',
    },
    modelView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: constants.window.width,
        height: constants.window.height,
        alignItems: 'center',
    },
    adv: {
        width: constants.window.width - 60,
        height: constants.window.height * 0.6,
        marginTop: (Platform.OS === 'ios') ? 120 : 100,
    },
});
export default connect(
    (state)=>({
        ActivityReducer:state.ActivityReducer,
        UserReducer:state.UserReducer,
    })
)(Activity)

