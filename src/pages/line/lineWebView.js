/**
 * WebView 组件
 * @class
 */
import React, {Component} from 'react';
import {
    View,
    WebView,
} from 'react-native';

import Head from '../../common/head'
import config from "../../common/configuration";

import Loading from '../../common/loading';


export default class LineWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const id = this.props.navigation.getParam('id');
        return (
            <View style={{flex:1}}>
                <Head title={"线路详情"} click={()=>this.props.navigation.goBack()}/>
                <WebView
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    renderLoading={() => <Loading/>}
                    source={{uri:config.host+'map/index.html'+'?id='+id}}/>
            </View>
        );
    }
}

