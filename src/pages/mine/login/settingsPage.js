import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, Platform, TouchableHighlight} from 'react-native';
import Head from '../../../common/head'
import Quit from '../../../pages/mine/settings/quitPage'
import constants from "../../../common/constants";
import config from '../../../common/configuration';
import Util from '../../../common/utils';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import {connect} from "react-redux";
import Utils from '../../../common/utils';
import {fetchUserInfo} from "../../../actions/mine/userAction";


class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null
        }
    }

    componentWillMount(){
        this.props.dispatch(fetchUserInfo);
    }

    /**
     * 实名认证
     * @function
     */
    certificator() {
        const {UserReducer} = this.props;
        if (UserReducer.isCertification) {
            Utils.toast('您已认证!')
        } else {
            this.props.navigation.navigate('certification', {
                props: {}
            });
        }
    };

    /**
     * 修改手机号
     */
    phone() {
        this.props.navigation.navigate('phonenumber',
            {
                mid: this.props.UserReducer.mid,
                num1: this.num1,
                num2: this.num2,
                phoneNumber: this.props.UserReducer.phoneNumber
            })
    };

    selectPhotoTapped() {
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
                Util.toast('您点击了取消');
            } else if (response.error) {
                if(response.error === 'Photo library permissions not granted')
                    Util.toast('您设置了权限，无法调用图片库或者摄像头');
                console.log('ImagePicker 出错: ', response.error);
            }
            else {
                let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                if (Platform.OS === 'ios') {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    source = {uri: response.uri, isStatic: true};
                }
                this.setState({
                    imageSource: source
                });
                this.props.UserReducer.imageSource = this.state.imageSource;
                console.log(this.props.UserReducer.imageSource);

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };


            }
        });
    }

    render() {
        const {UserReducer} = this.props;
        console.log(UserReducer.imageSource);
        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1}}>
                <Head title={"个人信息"} click={() => {
                    this.props.navigation.goBack()
                }}/>
                <TouchableHighlight onPress={this.selectPhotoTapped.bind(this)} underlayColor={'#DDDDDD'}>
                    <View style={[styles.unified, {height: (constants.window.height) * 0.12}]}>
                        <Text style={{fontSize: 15, color: '#333333'}}>头像</Text>
                        <View style={{flex: 1}}/>
                        {(() => {
                            if (UserReducer.imageSource === null) {
                                if (UserReducer.photo !== null && UserReducer.photo !== "default" && UserReducer.photo !== '') {
                                    let img = config.host + "upload/" + UserReducer.photo;
                                    return <Image source={{uri: img}} style={styles.avatar}/>
                                } else return <Image source={require('../../../image/mine/head.png')}
                                                  style={{
                                                      height: constants.window.width * 0.14,
                                                      width: constants.window.width * 0.14,
                                                      alignSelf: 'center'
                                                  }} resizeMode='contain'/>
                            } else {
                                return <Image style={styles.avatar} source={UserReducer.imageSource}/>
                            }
                        })()}
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21}
                                         style={{marginRight: 10, marginLeft: 5}}/>
                    </View>
                </TouchableHighlight>

                <View style={{backgroundColor: '#FFFFFF'}}>
                    <Image source={require('../../../image/mine/mall/commodityDetailed/point.png')}
                           style={{height: 1, width: constants.window.width - 30, marginLeft: 15}}/>
                </View>


                <TouchableHighlight onPress={this.certificator.bind(this)}
                                    underlayColor={'#DDDDDD'}>
                    <View style={styles.unified}>
                        <Text style={{fontSize: 14, color: '#333333'}}>实名认证</Text>
                        <View style={{flex: 1}}/>
                        <Text
                            style={{fontSize: 14, color: '#FF0000', marginRight: 5}}>{UserReducer.authentication}</Text>
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>

                    </View>
                </TouchableHighlight>

                <View style={{backgroundColor: '#FFFFFF'}}>
                    <Image source={require('../../../image/mine/mall/commodityDetailed/point.png')}
                           style={{height: 1, width: constants.window.width - 30, marginLeft: 15}}/>
                </View>

                <TouchableHighlight onPress={this.phone.bind(this)} underlayColor={'#DDDDDD'}>
                    <View style={styles.unified}>
                        <Text style={{fontSize: 14, color: '#333333'}}>手机号码</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{
                            fontSize: 14,
                            color: '#333333',
                            marginRight: 5,
                        }}>{this.num1}{UserReducer.mid}{this.num2}</Text>
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 10}}/>
                    </View>
                </TouchableHighlight>
                <View style={{flex: 1}}/>

                <Quit {...this.props}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    unified: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 5
    },
    sound_effect: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        height: 42
    },
    avatar: {
        borderRadius: constants.window.width * 0.07,
        width: constants.window.width * 0.14,
        height: constants.window.width * 0.14,
        overflow: 'hidden'
    },
});

export default connect(
    (state) => ({
        UserReducer: state.UserReducer
    }),
)(Setting)