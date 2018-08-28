/**
 * WebView 组件
 * @class
 */
import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    WebView,
} from 'react-native';

import Head from '../../common/head'
import constants from '../../common/constants';
import config from '../../common/configuration'

import Loading from '../../common/loading';


export default class ChargingWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    renderError(){
        return (
            <View style={{
                backgroundColor: '#f5f5f5',
                paddingTop: 100,
                height: constants.window.height
            }}>
                <Image source={require('../../image/ticket/ticket.png')}
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
                }}>出错了！请稍后再请求</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={{flex:1}}>
                <Head title={"附近充电桩"} click={()=>this.props.navigation.goBack()}/>
                <WebView
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    domStorageEnabled={true}
                    renderError={this.renderError.bind(this)}
                    renderLoading={() => <Loading/>}
                    source={{uri:config.host+"map/chargingPile.html"}}/>
            </View>
        );
    }
}

