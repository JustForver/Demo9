import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Image,
    ScrollView
} from 'react-native';
import constants from '../common/constants';
import HeadPage from '../common/headImagePage';
import Util from '../common/utils';
import config from '../common/configuration';
import {connect} from "react-redux";

import ImagePicker from 'react-native-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

class Mine extends Component {
    constructor(props) {
        super(props);
        this.text = '';
        this.head = '';
        this.state = {
            isLoading: false,
            avatarSource: null,
            waiting:false
        }
    }

    /*/!**
    * 更换头像
    * *!/
    _changeAvatar() {
        this.setState({
            isLoading: true
        });
        const photoOptions = {
            title: '选择图像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            allowsEditing: true,
            storageOptions: {
                skipBackup: true,
            }
        };
        ImagePicker.launchImageLibrary(photoOptions, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });
    }*/
    /**
     * 登录/注册
     */
    _login() {
        if (!this.props.UserReducer.isLogin) {
            this.login();
        } else {
            this.settings();
        }
    }

    /**
     * 跳转到登录界面
     * @function login
     */

    login(){
        this.props.navigation.navigate('phoneLogin');
    }
    /**
     * 跳转到设置界面
     * @function settings
     */
    settings() {
        this.props.navigation.navigate('setting', {
            props: {...this.props}
        })
    }

    /**
     * 跳转到我的消息界面
     * @function message
     */
    message() {
        const {UserReducer,MessageReducer,navigation} = this.props;
        if (UserReducer.isLogin) {
            navigation.navigate('message');
        } else {
            Util.toast("请先登录");
        }
        MessageReducer.flag = false;
        this.setState({tab : false});
    }

    /**
     * 跳转到我的优惠页面
     */
    _myPromotionCode() {
        const {UserReducer}=this.props;
        if (UserReducer.isLogin){
            this.props.navigation.navigate('myFavorable',{
                props:{}
            })
        }else {
            Util.toast("请先登录");
        }
    }

    /**
     * 跳转到我的订单页面
     */
    order() {
        const {UserReducer,navigation}=this.props;
        if (UserReducer.isLogin){
            navigation.navigate('myRecord',{
                props:{}
            });
        }else {
            Util.toast("请先登录");
        }
    }

    /**
     * 跳转到商城界面
     * @function mall
     */
    mall() {
        this.props.navigation.navigate('mall');
    }

    /**
     * 跳转到新闻页面
     * @function news
     */
    news() {
        this.props.navigation.navigate('news');
    }

    /**
     * 附近充电桩
     */
    nearChargingPile() {
        this.props.navigation.navigate('chargingPile');
    }

    /**
     * 跳转到帮助与反馈界面
     * @function help
     */
    help() {
        this.props.navigation.navigate('help');
    }

    /**
     * 更多信息
     */
    moreInfo() {
        const navigate = this.props.navigation.navigate;
        navigate('moreInfo');
    }

    /**
     * 用户vip显示
     * @function loginAfter
     */
    loginAfter() {
        const {UserReducer} = this.props;
        console.log(UserReducer.imageSource);
        //初始头像显示
        this.head = (
            <View>
                <View style={styles.avatarContainer}>
                    {
                        UserReducer.imageSource === null ?
                            (() => {
                                if (UserReducer.photo !== null && UserReducer.photo !== "default" && UserReducer.photo !== '') {
                                    let img = config.host + "upload/" + UserReducer.photo;
                                    return (
                                        <View>
                                            <Image source={{uri: img}} style={styles.avatar}/>
                                        </View>
                                    )
                                } else if (UserReducer.photo && UserReducer.photo === "default") {

                                    let img = (
                                        <Image source={require('../image/mine/head.png')}
                                               style={{
                                                   height: constants.window.width * 0.14,
                                                   width: constants.window.width * 0.14,
                                                   alignSelf: 'center'
                                               }} resizeMode='contain'>
                                        </Image>);
                                    return img
                                }

                            })() :
                            (<View>
                                <Image style={[styles.avatar]} source={UserReducer.imageSource}/>
                            </View>)
                    }
                </View>
            </View>
        );

        /*if (UserReducer.vip === "common") {
            this.text = '积分：' + UserReducer.userPoints;

            //普通用户替换头像显示
            this.head = (
                <View style={styles.avatarContainer}>
                    {
                        UserReducer.imageSource === null ?
                            (() => {

                                if (UserReducer.photo !== null && UserReducer.photo !== "default" && UserReducer.photo !== '') {
                                    let img = config.host + "upload/" + UserReducer.photo;
                                    return <Image source={{uri: img}}
                                                  style={styles.avatar}/>

                                } else if (UserReducer.photo && UserReducer.photo === "default") {
                                    let img = (<Image source={require('../image/mine/head.png')}
                                                      style={{
                                                          height: constants.window.width * 0.14,
                                                          width: constants.window.width * 0.14,
                                                          alignSelf: 'center'
                                                      }} resizeMode='contain'/>);
                                    return img

                                }

                            })() :
                            <Image style={styles.avatar}
                                   source={UserReducer.imageSource}/>
                    }
                </View>
            )
        }*/
    }

    render() {
        const {UserReducer} = this.props;
        if (UserReducer.isLogin) {
            this.loginAfter();
        } else {
            this.text = '登陆/注册';
            this.head = (
                <Image source={require('../image/mine/head.png')}
                       style={{
                           height: constants.window.width * 0.14,
                           width: constants.window.width * 0.14,
                           alignSelf: 'center'
                       }} resizeMode='contain'/>
            )
        }
        return (
            <View style={styles.entirePage}>
                <ScrollView style={styles.entirePage} showsVerticalScrollIndicator={false}>
                    <HeadPage/>
                    <View style={{height: (constants.window.height) * 0.03}}/>
                    <TouchableHighlight underlayColor={'#DDDDDD'} onPress={this._login.bind(this)}>
                        <View style={styles.login}>
                            {this.head}
                            <View style={{alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#333333',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    marginLeft: 18,
                                }}>{this.text}</Text>
                            </View>
                            <View style={{flex: 1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{height: (constants.window.height) * 0.03}}/>

                    <TouchableHighlight onPress={this.message.bind(this)}  underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/message.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>我的消息</Text>
                            {/*{ (()=> {
                                if (MessageReducer.flag && this.state.tab && UserReducer.isLogin) {
                                    return <Image source={require('../image/mine/tidings_dot.png')}
                                                  style={{width: 9, height: 9, marginLeft: 5}}/>
                                }
                            })()}*/}
                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>

                    <TouchableHighlight onPress={this.order.bind(this)}  underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/order.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>我的订单</Text>
                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>

                    <TouchableHighlight onPress={this._myPromotionCode.bind(this)} underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/promotion.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>我的优惠</Text>
                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>


                    <View style={{height: (constants.window.height) * 0.03}}/>

                    <TouchableHighlight onPress={this.mall.bind(this)} underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/point.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>积分充值</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>


                    <TouchableHighlight onPress={this.news.bind(this)}  underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/news.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>新闻资讯</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>


                    <TouchableHighlight  underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/invitation.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>邀请好友</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>

                    <TouchableHighlight onPress={this.nearChargingPile.bind(this)} underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/chargingPile.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>附近充电桩</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{height: (constants.window.height) * 0.03}}/>


                    <TouchableHighlight onPress={this.help.bind(this)}  underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/help.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>帮助</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>

                    <View style={{backgroundColor: '#FFFFFF', height: 2, marginTop: -1}}>
                        <Image source={require('../image/mine/mall/commodityDetailed/point.png')}
                               style={{height: 1, width: constants.window.width - 40, marginLeft: 20}}/>
                    </View>

                    <TouchableHighlight onPress={this.moreInfo.bind(this)} underlayColor={'#DDDDDD'}>
                        <View style={styles.item}>
                            <Image source={require('../image/mine/more.png')} style={styles.item_img}/>
                            <Text style={styles.item_Text}>更多</Text>

                            <View style={{flex:1}}/>
                            <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    entirePage: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    unified: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 5
    },
    avatar: {
        borderRadius: constants.window.width * 0.14 / 2,
        width: constants.window.width * 0.14,
        height: constants.window.width * 0.14,
        overflow: 'hidden'
    },
    login: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    item_img: {
        width: 18,
        height: 18,
        marginLeft: 10,
        marginRight: 10,
        resizeMode: 'contain'
    },
    item_Text: {
        fontSize: 15,
        color: '#333333',
    },
    item: {
        flexDirection: 'row',
        height: (constants.window.height) * 0.066,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default connect(
    (state) => ({
        MessageReducer:state.MessageReducer,
        UserReducer: state.UserReducer
    }),
)(Mine)