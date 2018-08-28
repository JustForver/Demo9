import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Keyboard
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import constants from "../../../common/constants";
import util from '../../../common/utils'
import * as Agreement from '../../../pages/mine/moreInfo/agreementPage'
import Head from "../../../common/head";
import {connect} from "react-redux";

import {fetchBindPhoneLogin,fetchSendSMS} from '../../../actions/mine/userAction';
//绑定手机号界面
class BindPhone extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            timeRemain: '发送验证码',
            proving: this.proving,
        };
        this.flag = true;
        this.phone = '';
        this.verificationCode = '';
    }

    componentDidUpdate() {
        const {UserReducer, navigation} = this.props;
        if (UserReducer.isJump) {
            navigation.popToTop();
            UserReducer.isJump = false
        }
    }

    componentDidMount() {
        //添加一个键盘事件,在键盘显示时执行
        this.keyboardShow = Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace.bind(this));
    }

    updateKeyboardSpace(frames) {
        if (!frames.endCoordinates) {
            return;
        }
        this.keyboardHeight = frames.endCoordinates.height; //获取键盘高度
        if ((this.headHeight + this.keyboardHeight + this.scrollContentHeight) >= constants.window.height && this.move) {
            let height = (this.headHeight + this.keyboardHeight + this.scrollContentHeight) - constants.window.height + constants.window.height*0.25;
            this.refs.scroll.scrollTo({y: height * 0.3, x: 0, animated: true});
        } else {
            let height = (this.headHeight + this.keyboardHeight + this.scrollContentHeight) - constants.window.height + constants.window.height*0.25;
            this.refs.scroll.scrollTo({y: height * 0.3, x: 0, animated: true});
        }
        this.move = false;
    }

    /**
     * 跳转到软件服务及购票协议界面
     * @function
     */
    click() {
        this.props.navigation.navigate('agreement',{
            props:{...this.props}
        });
    }

    //恢复页面移动
    restore() {
        this.refs.phone.blur();
        this.refs.code.blur();
        this.refs.scroll.scrollTo({y: 0, x: 0, animated: true});
    }

    /**
     * 绑定手机号后的登录
     * @function
     */
    login() {
        this.restore();
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.phone))) {
            util.toast('请输入正确的手机号');
            return;
        }
        const {WeiXinReducer} = this.props;
        this.props.dispatch(fetchBindPhoneLogin(this.phone, this.verificationCode, WeiXinReducer.info));
    }

    /**
     * 输入校验
     * @function
     */
    proving() {
        this.restore();
        //限制手机号
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.phone))) {
            util.toast('请输入正确的手机号')
        } else if (this.flag) {
            this.flag = false;
            let timeRemain = 60;
            this.interval = setInterval(() => {
                this.setState({timeRemain: '倒计时' + timeRemain + '秒'});
                this.setState({
                    proving: () => {
                    }
                });
                if (--timeRemain < 0) {
                    this.flag = true;
                    this.setState({timeRemain: '重发验证码', proving: this.proving});
                    clearInterval(this.interval);
                    this.status = true;
                }
            }, 1000);
            this.props.dispatch(fetchSendSMS(this.phone));
        }
    }

    componentWillUnmount() {
        //卸载
        if (this.interval !== null && this.interval > 0) {
            clearInterval(this.interval);
        }
        this.keyboardShow.remove();  //移除监听事件
    }

    render() {
        return (
            <Image style={styles.background} source={require('../../../image/backgroundImage.jpg')}>
                <View onLayout={({nativeEvent: {layout: {x, y, width, height}}}) => {
                    this.headHeight = height
                }}>
                    <Head title={"绑定手机号"} click={()=>this.props.navigation.goBack()} head={{backgroundColor: 'rgba(0,0,0,0)'}}/>
                </View>
                <ScrollView
                    ref='scroll'
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.scrollContentHeight = contentHeight;
                    }}>
                    <View
                        style={styles.background}>
                        <View style={{marginTop: constants.window.height * 0.08}}>
                            <Image source={require('../../../image/navbarlogo.png')} style={{width: 153, height: 58}}/>
                        </View>
                        <View style={{marginTop: constants.window.height * 0.05}}><Text style={{color: '#fff'}}>为方便乘车及包车，请绑定您的手机号</Text></View>

                        <View style={styles.phone}>
                            <FontAwesomeIcon name="phone" color="#fff" size={20} style={styles.icon}/>
                            <TextInput
                                ref='phone'
                                style={styles.textInput}
                                onChangeText={(text) => this.phone = text}
                                placeholder="  请输入手机号"
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={11}
                                onFocus={() => {
                                    this.move = true
                                }}
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                onSubmitEditing={this.restore.bind(this)}
                            />
                        </View>
                        <View style={styles.underLine}/>

                        <View style={styles.proving}>
                            <FontAwesomeIcon name="sign-in" color="#fff" size={20} style={styles.icon}/>

                            <TextInput
                                ref='code'
                                style={styles.textInput}
                                onChangeText={(text) => this.verificationCode = text}
                                placeholder="  请输入验证码"
                                placeholderTextColor="#aaa"
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={6}
                                onFocus={() => {
                                    this.move = true
                                }}
                                underlineColorAndroid="transparent"
                                onSubmitEditing={this.restore.bind(this)}
                            />

                            <TouchableWithoutFeedback onPress={this.proving.bind(this)}>
                                <View style={styles.code}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#FFFFFF',
                                        padding: 6
                                    }}>{this.state.timeRemain}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.underLine}/>

                        <TouchableWithoutFeedback onPress={this.login.bind(this)}>
                            <View style={styles.button}>
                                <Text style={{fontSize: 20, color: '#FFFFFF'}}>确定</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
                <View style={{flex: 1}}/>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <View style={{flex: 1}}/>
                    <Text style={{color: '#fff', fontSize: 10}}>登录即同意</Text>
                    <TouchableOpacity onPress={this.click.bind(this)} activeOpacity={0.6}>
                        <View style={{borderBottomWidth: 0.8, borderColor: '#fff'}}>
                            <Text style={{color: '#fff', fontSize: 10}}>《追风巴士使用协议》</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View>
            </Image>
        );
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        width: constants.window.width,
        height: constants.window.height
    },
    phone: {
        marginTop: 20,
        flexDirection: 'row',
        padding: 20,
        paddingLeft: 22,
        paddingRight: 30,
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    proving: {
        flexDirection: 'row',
        padding: 20,
        paddingLeft: 22,
        paddingRight: 30,
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        marginRight: 8,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    underLine: {
        borderBottomWidth: 1,
        borderColor: '#999',
        width: constants.window.width * 0.76,
        marginLeft: constants.window.width * 0.05
    },
    textInput: {
        height: 30,
        padding: 0,
        width: 210,
        flex: 5,
        fontSize: 20,
        color: '#fff'
    },
    code: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00c6ad',
        borderRadius: 20,
        overflow: 'hidden',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00c6ad',
        borderRadius: 30,
        overflow: 'hidden',
        width: constants.window.width * 0.7,
        height: 40,
        marginTop: 30
    }
});

export default connect(
    (state) => ({
        UserReducer: state.UserReducer,
        WeiXinReducer: state.WeiXinReducer,
    }),
)(BindPhone)