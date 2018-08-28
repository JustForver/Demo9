import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';

import constants from '../common/constants';
import QRCode from 'react-native-qrcode';
import HeadPage from '../common/headImagePage';
import AwesomeButton from '../components/button/awesomeBotton';
import {PayCode} from '../common/paycode'
import Util from '../common/utils';

import {connect} from "react-redux";

import {fetchUserInfo} from '../actions/mine/userAction'
import {fetchTime} from '../actions/ticket/ticketAction'

class Ticket extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.time = null;
        this.status = true;
        this.status2 = false;
        this.number = 0;
        this.state = {
            data: null,
            buttonState: 'idle'
        };
        this.interval = null;
    }

    /**
     * 刷新二维码
     * @function refreshQr
     */
    refreshQr() {
        //手动刷新二维码时,刷新积分
        this.props.dispatch(fetchUserInfo());
        //手动刷新二维码时清除自动刷新定时器
        this.clear();
        //初始化time的值
        this.time = null;
        let otp = new PayCode("a1™¡¢∞§hjg",this.props.UserReducer.id,1);
        this.setState({data: otp.next()})
    }

    /**
     * 跳转到login页面
     * @function login
     */
    login() {
        // WechatAPI.isWXAppInstalled()
        // .then((isInstalled) => {
        //     if(isInstalled){
        //         getNavigator().push({
        //             component: MyLogin,
        //             props: Object.assign({}, this.props)
        //         })
        //     }else {
        //         getNavigator().push({
        //             component: PhoneLogin,
        //             props: {...this.props}
        //         })
        //     }
        // });
        this.props.navigation.navigate('phoneLogin',{
            props:{...this.props}
        });
    }

    /**
     * 设置定时器,定时刷新
     * @function QRInterval
     */
    QRInterval() {
        this.interval = setInterval(() => {
            //每过30秒,刷新积分
            this.props.dispatch(fetchUserInfo());
            let otp = new PayCode("a1™¡¢∞§hjg",this.props.UserReducer.id,1);
            this.setState({data: otp.next()})
        }, 30 * 1000)
    }

    /**
     * 清除定时器
     * @function clear
     */
    clear() {
        if (this.interval != null) {
            clearInterval(this.interval);
            //在定时器被清除时将this.status的值初始化
            this.status = true;
        }
    }

    /**
     * 生命周期的componentDidUpdate方法
     * @function componentDidUpdate
     */
    componentDidUpdate() {
        const {TicketReducer} = this.props;
        if (this.status2) {
            if (TicketReducer.content) {
                const timeError = Math.abs(TicketReducer.content - (new Date()).getTime());
                if (timeError < 5000) {
                    //如果服务器的时间和本地时间的差值小于5秒则认为本地时间是标准时间
                } else {
                    //认为服务器时间是标准时间
                    this.time = parseInt(TicketReducer.content/1000);
                }
                //当取到TicketReducer.content的值时,改变status2值防止重复执行
                this.status2 = false;
            }
        }
    }

    /**
     * 跳转到预约记录界面
     * @function
     */
    booking() {
        const {UserReducer} = this.props;
        if (UserReducer.isLogin) {
            this.props.navigation.navigate('myRecord');
        } else {
            Util.toast("请先登录");
        }
    }


    /**
     * 渲染组件的render方法
     * @function render
     * @return {XML}
     */
    render() {
        const {UserReducer} = this.props;
        //在退出登录时清除定时器
        if (UserReducer.isLogin === false) {
            this.clear();
            this.number = 0;
        }
        let otp = new PayCode("a1™¡¢∞§hjg",this.props.UserReducer.id,1);
        let right = (
            <TouchableWithoutFeedback onPress={() => {this.booking()}} >
                <View style={{alignItems: 'center',width:80,height:50,justifyContent:'center'}}>
                    <Text style={{color:'#fff'}}>我的订单</Text>
                </View>
            </TouchableWithoutFeedback>
        );
        return (
            <View>
                <HeadPage right={right}/>
                <ImageBackground source={require('../image/ticket/background.png')} style={styles.background}>
                    {
                        (()=> {
                            if (UserReducer.isLogin && (UserReducer.userPoints > 0 || UserReducer.userPoints == 0)) {
                                //第一次进入二维码界面开始获取服务器时间,之后每刷新界面10次再次去服务器获取时间
                                if (this.number % 10 === 0) {
                                    this.props.dispatch(fetchTime());
                                }

                                //actions.fetchTime()之后,当取到时间时,页面会刷新,在这次刷新中将this.status2改为true
                                if (this.number % 10 === 1) {
                                    //当请求时间后,改变status2值为true
                                    this.status2 = true;
                                }

                                //第一次进入二维码界面启动定时器
                                if (this.status) {
                                    this.QRInterval();
                                    this.status = false
                                }

                                //每次自动刷新二维码时,将计数器加1
                                ++this.number;

                                return (
                                    <View style = {{flex:1}}>
                                        <View style={styles.borderView}>
                                            <Text style={styles.topTxt}>上车时请出示您的二维码</Text>
                                            <TouchableOpacity onPress={this.refreshQr.bind(this)}>
                                                <QRCode
                                                    value={this.state.data === null ? otp.next() : this.state.data}
                                                    size={constants.window.width - 100}
                                                    bgcolor='#000'
                                                    fgColor='#fff'
                                                >
                                                </QRCode>

                                            </TouchableOpacity>
                                            <View style={{flexDirection: 'row'}}>
                                                <Image source={require('../image/ticket/warn.png')}
                                                       style={styles.refresh}/>
                                                <Text style={styles.bottomTxt}>请对准扫描仪,距离扫描仪3厘米</Text>
                                            </View>
                                        </View>


                                        <View style={{alignItems: 'center', marginTop: 34}}>
                                            <Image source={require('../image/ticket/scan.png')}
                                                   style={{
                                                       height: constants.window.height * 0.177
                                                   }}
                                                   resizeMode='contain'
                                            />
                                        </View>
                                    </View>

                                )
                            } else if (UserReducer.isLogin === true && UserReducer.userPoints < 0 ) {
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
                                            }}>您的积分不足</Text>
                                            <TouchableWithoutFeedback onPress={this.text.bind(this)}>
                                                <View>
                                                    <Text style={{
                                                        textAlign: 'center',
                                                        color: '#Ed5842',
                                                        fontSize: 17,
                                                        marginTop: 40
                                                    }}>点击这里</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <Text style={{
                                                textAlign: 'center',
                                                color: '#AAAAAA',
                                                fontSize: 17,
                                                marginTop: 40
                                            }}>获取积分</Text>
                                        </View>
                                    </View>
                                )
                            } else if (UserReducer.isLogin === false) {
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
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#AAAAAA',
                                            fontSize: 14,
                                            marginTop: 30
                                        }}>登录后才可以乘车哦！</Text>
                                        <View style={styles.container}>
                                            <AwesomeButton  backgroundStyle={ styles.loginButtonBackground }
                                                            labelStyle={ styles.loginButtonLabel }
                                                            transitionDuration={ 200 }
                                                            states={{
                                                                idle: {
                                                                    text: '去登录',
                                                                    onPress: this.login.bind(this),
                                                                    backgroundColor: '#00c6ad',
                                                                },
                                                            }}
                                                            buttonState={this.state.buttonState}
                                            />
                                        </View>
                                    </View>
                                )
                            }
                        })()
                    }
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding:20
    },
    loginButtonBackground: {
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        width:constants.window.width-40,
    },
    loginButtonLabel: {
        color: 'white',
        fontSize:18
    },
    background: {
        width: constants.window.width,
        height: constants.window.height
    },
    borderView: {
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginLeft: 30,
        marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    topTxt: {
        color: '#ff6363',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 10
    },
    bottomTxt: {
        color: '#bbb9b9',
        marginTop: 10,
        marginBottom: 25
    },
    refresh: {
        marginTop: 10,
        marginRight: 5,
        width: 16,
        height: 16
    }
});
export default connect(
    (state)=>({
        TicketReducer:state.TicketReducer,
        UserReducer:state.UserReducer
    })
)(Ticket)
