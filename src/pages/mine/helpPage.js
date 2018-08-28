import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView
} from 'react-native';

import constants from '../../common/constants'
import Head from '../../common/head'

const answers = [
    '如何使用？',
    '  下载追风巴士app，注册登录之后，拥有积分就可以乘坐我们的车哟',
    '二维码是干什么的？',
    '  您的专属二维码，我们车上会有相关设备，用其扫码就可以上车哟',
    '可以自己定制活动？',
    '  可以联系我们定制属于你们的专属活动，想去哪里和我们说，我们有14坐、17坐、49坐等300台新能源大巴，接你们自由行',
    '充值有什么用？',
    '  积分不够？无法乘车？可以去充值里面充值积分，充的越多优惠越多哟'
];

export default class Help extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            massege : null
        };
    }

    render() {

        return (
            <View style={{backgroundColor: "#f5f5f5",flex:1}}>
                <Head title={"帮助"} click={()=>this.props.navigation.goBack()}/>
                <ScrollView>
                    {
                        (() => {
                            var str = [];
                            var info = answers;
                            for (let i = 0; i < info.length; i += 1) {
                                str.push(
                                    <View key={i}>
                                        {
                                            (()=>{
                                                if(i % 2 === 0){
                                                    return (
                                                        <View style={{marginTop:20,flexDirection:'row'}}>
                                                            <Image source={require('../../image/mine/message/man.png')} style={styles.man} />
                                                            <View style={styles.box} >
                                                                <Text>{info[i]}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }else{
                                                    return <View style={{marginTop:20,flexDirection:'row'}}>
                                                        <View style={[styles.box,{marginLeft:24}]} >
                                                            <Text>{info[i]}</Text>
                                                        </View>
                                                        <Image source={require('../../image/mine/message/woman.png')} style={[styles.man,{ marginLeft: 5}]} />
                                                    </View>
                                                }
                                            })()
                                        }
                                    </View>
                                )
                            }
                            return str;
                        })()
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    man: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginLeft: 15
    },
    box: {
        width: constants.window.width*0.8,
        backgroundColor:'#fff',
        borderRadius:10,
        overflow:'hidden',
        marginLeft:5,
        padding:10
    }
});

