
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Linking

} from 'react-native';

import Head from '../../common/head'
import constants from "../../common/constants";

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class moreInfoPage extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    /**
     * 用户协议页面
     */
    agreement(){
        this.props.navigation.navigate('agreement');
    }

    /**
     * 跳转到AboutUs界面
     * @function
     */
    aboutUs(){
        this.props.navigation.navigate('aboutUs');
    }
    render (){
        return(
            <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Head title="更多" click={()=>this.props.navigation.goBack()}/>
                <TouchableHighlight onPress={this.agreement.bind(this)} underlayColor={'#DDDDDD'}>
                    <View style={styles.unified}>
                        <Text style={{fontSize: 14, color: '#333333'}}>使用协议</Text>
                        <View style={{flex:1}}/>
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 15}}/>
                    </View>
                </TouchableHighlight>

                <View style={{backgroundColor: '#FFFFFF'}}>
                    <Image source={require('../../image/mine/mall/commodityDetailed/point.png')}
                           style={{height: 1, width: constants.window.width - 30, marginLeft: 15}}/>
                </View>

                <TouchableHighlight onPress={()=>{this.aboutUs()}} underlayColor={'#dddddd'}>
                    <View style={styles.unified}>
                        <Text style={{fontSize: 14, color: '#333333'}}>关于我们</Text>
                        <View style={{flex:1}}/>
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 15}}/>
                    </View>
                </TouchableHighlight>

                <View style={{backgroundColor: '#FFFFFF'}}>
                    <Image source={require('../../image/mine/mall/commodityDetailed/point.png')}
                           style={{height: 1, width: constants.window.width - 30, marginLeft: 15}}/>
                </View>

                <TouchableHighlight onPress={()=> {
                    return Linking.openURL('tel:027-65388748')
                }}>
                    <View style={styles.unified}>
                        <Text style={{fontSize: 14, color: '#333333'}}>客服热线</Text>
                        <View style={{flex:1}}/>
                        <Text style={{fontSize: 14, color: '#333333'}}>027-65388748</Text>
                        <FontAwesomeIcon name="angle-right" color="#aaa" size={21} style={{marginRight: 15,marginLeft:5}}/>
                    </View>
                </TouchableHighlight>




            </View>
        )
    }
}
const styles = StyleSheet.create({
    unified: {
        flexDirection: 'row',
        // height: (constants.window.height) * 0.074,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 5
    },
});
