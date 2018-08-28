/**
 * WebView 组件
 * @class
 */
import React, {Component} from 'react';
import {
    View,
    WebView
} from 'react-native';

import Head from '../../common/head'

import Loading from '../../common/loading'


export default class ActWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {url} = this.props;
        return (
            <View style={{flex:1}}>
                <Head title={"活动"} click={()=>{this.props.navigation.goBack()}}/>
                <WebView
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    renderLoading={() => <Loading/>}
                    source={{uri:url}}/>
            </View>
        );
    }
}

