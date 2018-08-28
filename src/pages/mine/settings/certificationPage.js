/**
 * Created by sky on 16/7/11.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Keyboard,
} from 'react-native';
import Head from '../../../common/head';
import {fetchCertification} from '../../../actions/mine/userAction'
import Utils from '../../../common/utils'
import constants from "../../../common/constants";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AwesomeButton from '../../../components/button/awesomeBotton';
import Fumi from '../../../components/textInput/Fumi'

import {connect} from "react-redux";

class Certification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState: 'idle'
        };
        this.trueName = null;
        this.idCard = null;
        this.move = false;  //是否移动界面
    }

    //约束姓名的正则
    nameRegExp = /^([\u4e00-\u9fa5\·]{2,8})$/;

    //约束15位和18位身份证的正则
    idCardRegExp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //提交表单
    from() {
        this.setState({buttonState: 'busy'});
        this.props.dispatch(fetchCertification(this.trueName, this.idCard));
    }

    /**
     * 提交表单
     * @function
     */
    submit() {
        this.refs.name.refs.input.blur();
        this.refs.idCode.refs.input.blur();

        this.refs.scroll.scrollTo({y: 0, x: 0, animated: true});

        if (!this.nameRegExp.test(this.trueName)) {
            Utils.toast('请输入真实姓名!')
        } else if (!this.idCardRegExp.test(this.idCard)) {
            Utils.toast('请输入正确的身份证号码!');
        } else if (this.idCard.length === 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //前17位号码加权因子
            var idCardWiSum = 0; //用来保存前17位各自乘以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += this.idCard.substring(i, i + 1) * idCardWi[i];
            }
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //验证码数组
            var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
            var idCardLast = this.idCard.substring(17);//得到最后一位身份证号码(身份证校验码),

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast === "X" || idCardLast === "x") {
                    //验证通过
                    this.from();
                } else {
                    Utils.toast('请输入正确的身份证号码!');
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    //验证通过
                    this.from();
                } else {
                    Utils.toast('请输入正确的身份证号码!');
                }
            }
        } else {
            //15位身份证无法直接校验
            this.from();
        }
    };

    componentDidUpdate() {
        const {UserReducer, navigation}=this.props;
        if (UserReducer.isJump) {
            navigation.goBack();
            UserReducer.isJump = false;
        }
        if (UserReducer.buttonStatus === 'certificationButton') {
            this.setState({buttonState: 'failed'});
            UserReducer.buttonStatus = ''
        }
    }

    componentDidMount() {
        //添加一个键盘事件,在键盘显示时执行
        this.keyboardShow = Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this));
    }

    componentWillUnmount() {
        this.keyboardShow.remove();  //移除监听事件
    }

    updateKeyboardSpace(frames) {
        if (!frames.endCoordinates) {
            return;
        }
        this.keyboardHeight = frames.endCoordinates.height; //获取键盘高度
        if ((this.headHeight + this.keyboardHeight + this.scrollContentHeight) >= constants.window.height && this.move) {
            let height = (this.headHeight + this.keyboardHeight + this.scrollContentHeight) - constants.window.height + 10;
            this.refs.scroll.scrollTo({y: height, x: 0, animated: true});
        } else {
            this.refs.scroll.scrollTo({y: 0, x: 0, animated: true});
        }
        this.move = false;
    }

    render() {
        return (
            <View delegate={this} style={{backgroundColor: '#f5f5f5',flex:1}}>
                <View style={{flex: 1}}>
                    <View onLayout={({nativeEvent: {layout: {x, y, width, height}}})=> {
                        this.headHeight = height
                    }}>
                        <Head title={"实名认证"} click={()=>{this.props.navigation.goBack()}}/>
                    </View>
                    <ScrollView
                        ref='scroll'
                        keyboardShouldPersistTaps={'always'}
                        onContentSizeChange={(contentWidth, contentHeight)=> {
                            this.scrollContentHeight = contentHeight
                        }}
                    >
                        <View>
                            <View style={styles.img_view}>
                                <Image
                                    source={require('../../../image/mine/settings/accountSecure/certification/idcard.png')}
                                    style={styles.img}
                                />
                            </View>
                            <View style={styles.view_text1}>
                                <Text style={styles.text1}>提交真实身份信息,便于您的账号安全和出行安全</Text>
                            </View>
                            <View style={{padding: 10}}>
                                <Fumi
                                    ref = 'name'
                                    onChangeText={(text) => this.trueName = text}
                                    label={'真实姓名'}
                                    inputStyle={{height: 40}}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'user'}
                                    iconColor={'#e7642c'}
                                />

                                <Fumi
                                    ref = 'idCode'
                                    onChangeText={(text) => this.idCard = text}
                                    style={{marginTop: 4}}
                                    label={'身份证号'}
                                    inputStyle={{height: 40}}
                                    maxLength={18}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'credit-card'}
                                    iconColor={'#e7642c'}
                                    onFocus={()=>{this.move = true}}
                                    onSubmitEditing={this.submit.bind(this)}
                                />
                            </View>
                            <View style={styles.container}>
                                <AwesomeButton
                                    backgroundStyle={ styles.loginButtonBackground }
                                    labelStyle={ styles.loginButtonLabel }
                                    transitionDuration={ 200 }
                                    states={{
                                        idle: {
                                            text: '提交审核',
                                            onPress: this.submit.bind(this),
                                            backgroundColor: '#00c6ad',
                                        },
                                        busy: {
                                            text: '审核中',
                                            backgroundColor: '#00c6ad',
                                            spinner: true,
                                        },
                                        failed: {
                                            text: '重新审核',
                                            onPress: this.submit.bind(this),
                                            backgroundColor: '#aa0000'
                                        }
                                    }}
                                    buttonState={this.state.buttonState}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
    },
    loginButtonBackground: {
        flex: 1,
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        width: constants.window.width - 20,
    },
    loginButtonLabel: {
        color: 'white',
        fontSize: 18
    },
    img_view: {
        justifyContent: 'center',
        marginTop: 25,
        flexDirection: 'row',
    },
    img: {
        width: 60,
        height: 40,
        resizeMode: "contain"
    },
    view_text1: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    text1: {
        textAlign: 'center',
    },
});

export default connect(
    (state) => ({
        UserReducer:state.UserReducer
    }),
)(Certification)