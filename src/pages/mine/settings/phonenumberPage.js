import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import util from '../../../common/utils';
import constants from '../../../common/constants';
import Head from '../../../common/head'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Fumi from '../../../components/textInput/Fumi'
import AwesomeButton from '../../../components/button/awesomeBotton';

import {fetchSendSMS,fetchModifyPhone} from '../../../actions/mine/userAction';
import {connect} from "react-redux";
class PhoneNumber extends Component {
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
        this.new_phone = null;
        this.identifyingCode = null;
        this.flag = true;   //使验证码按钮在倒计时时点击无效
        this.move = false;  //是否移动界面
        this.click = true; //是否点击获取验证码按钮
    }


    componentDidUpdate() {
        const {UserReducer, navigator, actions}=this.props;
        if (UserReducer.isJump) {
            navigator.popToTop();
            UserReducer.isJump=false
        }

        if (UserReducer.buttonStatus === 'updatePhoneNumberButton') {
            this.setState({buttonState: 'failed'});
            UserReducer.buttonStatus = '';
        }
    }


    /**
     * 检查用户输入
     * @function
     */
    proving() {
        this.click = false;
        this.refs.phone.refs.input.blur();
        this.refs.code.refs.input.blur();
        this.refs.scroll.scrollTo({y:0,x:0,animated:true});
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.new_phone))) {
            util.toast('请输入正确的手机号!')
        } else if (this.flag) {
            this.flag = false;
            let timeRemain = 59;
            this.interval = setInterval(()=> {
                this.setState({timeRemain: '倒计时' + timeRemain + '秒'});
                if (--timeRemain < 0) {
                    this.flag = true;
                    this.setState({timeRemain: '重新发送', proving: this.proving});
                    clearInterval(this.interval);
                }
            }, 1000);

            this.props.dispatch(fetchSendSMS(this.new_phone));
        }
    }

    componentWillUnmount() {
        //卸载
        if (this.interval != null && this.interval > 0) {
            clearInterval(this.interval);
        }
        this.keyboardShow.remove();  //移除监听事件
    }

    componentDidMount(){
        //添加一个键盘事件,在键盘显示时执行
        this.keyboardShow = Keyboard.addListener('keyboardDidShow',this.updateKeyboardSpace.bind(this));
    }

    updateKeyboardSpace(frames) {
        if(!frames.endCoordinates) {
            return;
        }
        this.keyboardHeight = frames.endCoordinates.height; //获取键盘高度
        if((this.headHeight + this.keyboardHeight + this.scrollContentHeight) >= constants.window.height && this.move){
            let height = (this.headHeight + this.keyboardHeight + this.scrollContentHeight) - constants.window.height + 10;
            this.refs.scroll.scrollTo({y:height,x:0,animated:true});
        }else{
            this.refs.scroll.scrollTo({y:0,x:0,animated:true});
        }
        this.move = false;
    }

    /**
     * 检查手机号
     */
    change() {
        this.refs.phone.refs.input.blur();
        this.refs.code.refs.input.blur();
        this.refs.scroll.scrollTo({y:0,x:0,animated:true});
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.new_phone))) {
            util.toast('请输入正确的手机号')
        } else if (this.click) {
            util.toast('请获取验证码')
        } else if (!(/^\d{6}$/.test(this.identifyingCode))) {
            util.toast('请输入6位数字验证码')
        }else {
            this.props.dispatch(fetchModifyPhone(this.props.phoneNumber, this.new_phone, this.identifyingCode));
            this.setState({buttonState: 'busy'});
        }
    }


    render() {
        return (
            <View style={{flex:1,backgroundColor: '#f5f5f5'}}>
                <View onLayout={({nativeEvent: { layout: {x, y, width, height}}})=>{this.headHeight = height}}>
                    <Head title={"修改手机号"} click={()=>this.props.navigation.goBack()}/>
                </View>
                <ScrollView
                    ref='scroll'
                    keyboardShouldPersistTaps={'always'}
                    onContentSizeChange = {(contentWidth, contentHeight)=>{
                        this.scrollContentHeight = contentHeight
                    }}
                >
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{width:constants.window.width}}>
                            <View style={styles.view_img}>
                                <Image source={require('../../../image/mine/settings/accountSecure/phone/phone.png')}
                                       style={styles.image}
                                />
                            </View>
                            <View style={styles.view_img}>
                                <Text
                                    style={{fontSize:18,}}>您当前的手机号为{this.props.num1}{this.props.mid}{this.props.num2}</Text>
                            </View>
                            <View style={styles.view_text}>
                                <Text style={styles.text}>更换后手机号后,下次可以使用新手机号登录</Text>
                            </View>
                            <View style={{padding:10}}>
                                <Fumi
                                    ref = 'phone'
                                    onChangeText={(text) => this.new_phone = text}
                                    label={'请输入新的手机号'}
                                    inputStyle={{ height:40 }}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'phone'}
                                    iconColor={'#e7642c'}
                                    maxLength={11}
                                />

                                <TouchableWithoutFeedback onPress={()=>{this.proving()}}>
                                    <View style={styles.view_text_sendagain}>
                                        <Text ref="yzm" style={{fontSize:15,color:'#FFFFFF'}}>{this.state.timeRemain}</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                                <Fumi
                                    ref="code"
                                    onChangeText={(text) => this.identifyingCode = text}
                                    style={{marginTop: 4}}
                                    label={'请输入验证码'}
                                    inputStyle={{ height:40 }}
                                    maxLength={6}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'sign-in'}
                                    iconColor={'#e7642c'}
                                    onFocus={()=>{this.move = true}}
                                    onSubmitEditing={this.change.bind(this)}
                                />
                            </View>
                        </View>
                        <View style={styles.container}>
                            <AwesomeButton  backgroundStyle={ styles.loginButtonBackground }
                                            labelStyle={ styles.loginButtonLabel }
                                            transitionDuration={ 200 }
                                            states={{
                                                idle: {
                                                    text: '更换手机号',
                                                    onPress: this.change.bind(this),
                                                    backgroundColor: '#00c6ad',
                                                },
                                                busy: {
                                                    text: '请稍后',
                                                    backgroundColor: '#00c6ad',
                                                    spinner: true,
                                                },
                                                failed: {
                                                    text: '更换失败',
                                                    onPress: this.change.bind(this),
                                                    backgroundColor: '#aa0000'
                                                }
                                            }}
                                            buttonState={this.state.buttonState}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10
    },
    loginButtonBackground: {
        height: 40,
        borderRadius: 5,
        width:constants.window.width-20,
    },
    loginButtonLabel: {
        color: 'white',
        fontSize:18
    },
    view_img: {
        justifyContent: 'center',
        marginTop: constants.window.height * 0.04,
        flexDirection: 'row',
        flex: 1,
        height: 37
    },
    image: {
        width: 37,
        height: 37
    },
    view_text: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: constants.window.height * 0.015,
        alignItems: 'center'
    },
    text: {
        color: '#858585',
        fontSize: 15,
    },
    view_text_sendagain: {
        width: 90,
        height: constants.window.height * 0.057,
        backgroundColor: '#00c6ad',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        position:'absolute',
        top:20,
        right:16
    }
});

export default connect(
    (state) => ({
        UserReducer:state.UserReducer
    }),
)(PhoneNumber)
