import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';
import Head from '../../common/head'
import constants from '../../common/constants'
import config from '../../common/configuration'

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Util from "../../common/utils";
import Loading from '../../common/loading'

import {connect} from "react-redux";
import {fetchActivityDetail,fetchActivityAlipaySign,fetchActivityIntegralPay} from '../../actions/activityAction'

class ActivityDetails extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            pay: false,
            show: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        this.props.dispatch(fetchActivityDetail(id));
    }

    /**
     * 分享给微信朋友
     * @function
     */
    /*weChatShareToSession() {
        this.close();
        var data = {
            type: 'news',
            title: this.props.ActivityReducer.title,//标题
            //description: this.props.ActivityReducer.title,//描述
            webpageUrl: config.host + 'activity/ActivityDetail.html' + '?id=' + this.props.ActivityReducer.id,
            imageUrl: config.host + "upload/" + this.props.ActivityReducer.detail_img,
        };
        WechatAPI.shareToSession(data
        ).then((result) => {
            Util.toast('分享成功');
        }, (fail) => {
            Util.toast(fail.toString());
        }).catch((e) => {
            Util.toast('分享失败,捕获到错误==' + e.message);
        });
    }*/

    /**
     * 分享给微信朋友圈
     * @function
     */
   /* weChatShareToTimeline() {
        this.close();
        var data = {
            type: 'news',
            title: this.props.ActivityReducer.title,//标题
            //description: this.props.ActivityReducer.title,//描述
            webpageUrl: config.host + 'activity/ActivityDetail.html' + '?id=' + this.props.ActivityReducer.id,
            imageUrl: config.host + "upload/" + this.props.ActivityReducer.detail_img,
        };
        WechatAPI.shareToTimeline(data
        ).then((result) => {
            Util.toast('分享成功');
        }, (fail) => {
            Util.toast(fail.toString());
        }).catch((e) => {
            Util.toast('分享失败,捕获到错误==' + e.message);
        });
    }*/

    shareOpen() {
        this.setState({show: true})
    }

    payOpen() {
        this.setState({pay: true})
    }

    close() {
        this.setState({pay: false, show: false})
    }

    /**
     * 支付宝支付
     * @function
     */
    alipay() {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        this.props.dispatch(fetchActivityAlipaySign(id));
        this.close();
    }

    /**
     * 微信支付
     * @function
     */
    /*weChatPay() {
        const {actions} = this.props;
        actions.fetchActivityWxPay(this.props.id);
        this.close();
    }*/

    /**
     * 参加活动
     * @function
     */
    join() {
        const {UserReducer, ActivityReducer} = this.props;
        if (UserReducer.isLogin) {
            if (ActivityReducer.remain < 0) {
                Alert.alert('',
                    '活动已过期，下一期更精彩~',
                    [
                        {
                            text: '确定', onPress: () => {
                        }
                        },
                    ]
                )
            } else if (ActivityReducer.pay_status === '敬请期待') {
                Alert.alert('',
                    '敬请期待',
                    [
                        {
                            text: '确定', onPress: () => {
                        }
                        },
                        {
                            text: '取消', onPress: () => {
                        }
                        }
                    ]
                )
            } else if (ActivityReducer.pay_type === 1) {
                Alert.alert('',
                    '需要支付' + ActivityReducer.integral + '积分',
                    [
                        {
                            text: '确定', onPress: () => {
                            this.props.dispatch(fetchActivityIntegralPay(this.props.id));
                        }
                        },
                        {
                            text: '取消', onPress: () => {
                        }
                        }
                    ]
                )
            } else {
                this.setState({pay: true});
            }
        } else {
            Alert.alert('',
                '请先登录',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        }
    }

    render() {
        const {ActivityReducer} = this.props;
        //截取字符串
        var str = ActivityReducer.activityDetail;
        if (str !== undefined) {
            var arr = str.split(' ');

            var rule = (arr[2]+'').split(',');
        }

        let img = config.host + "upload/" + ActivityReducer.detail_img;

        let right = (
            <TouchableOpacity onPress={() => {
                this.shareOpen()
            }}>
                <View style={{alignItems: 'center', width: 80, height: 50, justifyContent: 'center'}}>
                    <FontAwesomeIcon name="share-square-o" color="#fff" size={20} style={{marginLeft: 20}}/>
                </View>
            </TouchableOpacity>
        );

        /*WechatAPI.isWXAppInstalled()
        .then((isInstalled) => {
            this.isInstalled = isInstalled
        });
        if(!this.isInstalled){
            right = null
        }*/

        return (
            <View style={{backgroundColor: "#fff", flex: 1}}>
                <Head title={"活动详情"} click={()=>{this.props.navigation.goBack()}} />

                <Modal animationType='fade' transparent={true} visible={this.state.show} onRequestClose={() => {
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
                                this.shareOpen()
                            }}>
                                <View style={styles.modal}>
                                    <Text style={[styles.spinnerTitle, {fontSize: 20, color: 'black'}]}>
                                        分享到
                                    </Text>
                                    <View style={styles.shareParent}>
                                        <TouchableOpacity onPress={() => {
                                            /*this.weChatShareToSession()*/
                                        }} style={{flex:1}}>
                                            <View style={styles.shareContent}>
                                                <Image source={require('../../image/mine/activity/weixin.png')}
                                                       style={{width: 44, height: 44}}
                                                       resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>微信</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            /*this.weChatShareToTimeline()*/
                                        }} style={{flex:1}}>
                                            <View style={styles.shareContent}>
                                                <Image
                                                    source={require('../../image/mine/activity/share_icon_moments.png')}
                                                    style={{width: 44, height: 44}}
                                                    resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>朋友圈</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

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
                                this.payOpen()
                            }}>
                                <View style={styles.modal}>
                                    <Text style={[styles.spinnerTitle, {fontSize: 20, color: 'black'}]}>
                                        选择支付方式
                                    </Text>
                                    <View style={styles.shareParent}>
                                        <TouchableOpacity onPress={() => {
                                            this.alipay()
                                        }} style={{flex:1}}>
                                            <View style={styles.shareContent}>
                                                <Image
                                                    source={require('../../image/mine/mall/commodityDetailed/zhifubao.png')}
                                                    style={{width: 44, height: 44}}
                                                    resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>支付宝</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            this.weChatPay()
                                        }} style={{flex:1}}>
                                            <View style={styles.shareContent}>
                                                <Image
                                                    source={require('../../image/mine/mall/commodityDetailed/weixin.png')}
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

                {
                    ActivityReducer.detailLoading ?
                        <Loading />:
                        <View style={{flex: 1}}>
                            <ScrollView style={{flex: 1}}>
                                <Image source={{uri: img}}
                                       style={{width: constants.window.width, height: constants.window.height * 0.31}}>
                                </Image>
                                <View style={{flexDirection:'row', marginTop: 10}}>
                                    <View style={[styles.distance,{paddingLeft: 12, paddingRight: 8}]}>
                                        <Text style={styles.title}>{this.props.type}</Text>
                                    </View>

                                    <View style={{height:16,width:1.2,backgroundColor:'#000'}}/>

                                    <View style={[styles.distance,{paddingLeft: 8}]}>
                                        <Text style={styles.title}>{ActivityReducer.title}</Text>
                                    </View>
                                </View>
                                <View style={{height:10,backgroundColor:'#f5f5f5'}}/>

                                <View style={{paddingLeft: 12, paddingRight: 12, marginTop: 10}}>

                                    <View style={styles.distance}>
                                        <View style={styles.titleView}/>
                                        <Text style={styles.title}>活动简介</Text>
                                    </View>

                                    <View style={styles.contentView}>
                                        <Text style={styles.content}>{arr[0]}</Text>
                                    </View>

                                    <View style={[styles.distance,{marginTop:10}]}>
                                        <View style={styles.titleView}/>
                                        <Text style={styles.title}>活动时间与地址</Text>
                                    </View>

                                    <View style={styles.contentView}>
                                        {(()=>{
                                            if(ActivityReducer.start_time === '敬请期待'){
                                                return  <Text style={styles.content}>{ActivityReducer.start_time}</Text>
                                            }else{
                                                return (<View>
                                                            <Text style={styles.content}>{ActivityReducer.start_time}到{ActivityReducer.end_time}</Text>
                                                            <Text style={styles.content}>{arr[1]}</Text>
                                                        </View>
                                                )
                                            }
                                        })()}

                                    </View>

                                    <View style={[styles.distance,{marginTop:10}]}>
                                        <View style={styles.titleView}/>
                                        <Text style={styles.title}>活动规则</Text>
                                    </View>

                                    <View style={styles.contentView}>
                                        {(()=>{
                                            let temp=[];
                                            for(let i=0;i<rule.length;i++)
                                                temp.push(<Text style={styles.content} key={i}>{i+1}、{rule[i]}</Text>)
                                            return temp;
                                        })()}
                                    </View>

                                    <View style={[styles.distance,{marginTop:10}]}>
                                        <View style={styles.titleView}/>
                                        <Text style={styles.title}>退改规则</Text>
                                    </View>

                                    <View style={styles.contentView}>
                                        <Text style={styles.content}>{arr[3]}</Text>
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={styles.footerView}>
                                <View style={styles.footer}>
                                    <Text style={{color: 'red', fontSize: 20}}>{ActivityReducer.pay_status}</Text>
                                </View>

                                <TouchableOpacity onPress={() => {this.join()}} style={[styles.footer,{backgroundColor:'#00c6ad'}]}>
                                    <View>
                                        <Text style={{color: '#FFFFFF', fontSize: 20}}>我要报名</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
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
    distance: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    titleView: {
        height: 16,
        width: 5,
        backgroundColor: '#00c6ad',
        marginRight: 10
    },
    title: {
        fontSize: 16,
        marginTop: -3,
        fontWeight: '900',
        color:'#000'
    },
    contentView: {
        marginBottom: 10
    },
    content: {
        color: 'gray'
    },
    footerView:{
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0.5,
            height: 1
        },
        shadowOpacity: 0.6,
        backgroundColor: '#fff',
        elevation: 5
    },
    footer:{
        flex: 1,
        padding:14,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default connect(
    (state)=>({
        ActivityReducer: state.ActivityReducer,
        UserReducer: state.UserReducer,
    })
)(ActivityDetails)