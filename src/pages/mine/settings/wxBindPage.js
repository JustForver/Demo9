/**
 * Created by osx on 2017/7/14.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import Head from '../../../common/head'
import constants from '../../../common/constants'
//import * as WechatAPI from 'react-native-wx'
import  Util from '../../../common/utils'
import {connect} from "react-redux";

import {fetchWxLogin} from '../../../actions/mine/weixinAction';
class WXBind extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        const {UserReducer, navigation}=this.props;
        if (UserReducer.isJump) {
            navigation.goBack();
            UserReducer.isJump = false;
        }
    }
    /**
     * 微信绑定
     * @function
     */
   /* binding() {
        const {actions} = this.props;
        WechatAPI.login({
            scope: 'snsapi_userinfo',
            state: 'wechat_sdk_ibus'
        }).then( (result)=> {
            this.props.dispatch(fetchWxLogin(result.code));
        },  (fail) => {
            Util.toast(fail.toString());
        }).catch( (e) => {
            Util.toast('绑定失败');
        });
    }*/
    render() {
        return (
            <View style={{backgroundColor:'#f3f3f3',flex:1}}>

                <Head title={"绑定账号"} click={()=>this.props.navigation.goBack()}/>

                <View style={styles.item}>
                    <Text style={{fontSize:14,color:'#333333',flexGrow:1,}}>微信</Text>

                    <TouchableHighlight onPress={this.binding.bind(this)} underlayColor={'#DDDDDD'}>
                        <View style={styles.binding}>
                            <Text style={{fontSize:14,color:'#FFFFFF',paddingTop:3,paddingBottom:3,paddingLeft:5,paddingRight:5}}>绑 定</Text>
                        </View>
                    </TouchableHighlight>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    item: {
        height: (constants.window.height) * 0.074,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: 7,
        flexDirection: 'row'
    },
    binding: {
        padding: 2,
        backgroundColor: '#64CAD7',
        borderRadius: 4,
        overflow: 'hidden',
    }
});

export default connect(
    (state) => ({
        UserReducer:state.UserReducer
    }),
)(WXBind)
