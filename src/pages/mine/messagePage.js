/**
 * Created by sky on 16/9/22.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView
} from 'react-native';

import Head from '../../common/head'
import constants from '../../common/constants'
import {connect} from "react-redux";

class Message extends Component {
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

    line = ()=>{
        if(this.state.massege){
            return(Math.ceil(this.state.massege.length/27)*30)
        }else{
            return 30
        }
    };

    render() {
        const {MessageReducer} = this.props;
        return (
            <View style={{backgroundColor: "#f5f5f5",flex:1}}>
                <Head title={"消息中心"} click={()=>{this.props.navigation.goBack()}}/>
                {
                    (() => {
                        if (MessageReducer.count > 0) {
                            return (
                                <ScrollView>
                                    {
                                        (() => {
                                            var str = [];
                                            var info = MessageReducer.message;
                                            for (let i = 0; i < info.length; i += 1) {
                                                str.push(
                                                    <View key={i} style={{marginTop:20,flexDirection:'row'}}>
                                                        {
                                                            (()=>{
                                                                if(info[i].id % 2 === 0){
                                                                    return <Image source={require('../../image/mine/message/man.png')} style={styles.man} />
                                                                }else{
                                                                    return <Image source={require('../../image/mine/message/woman.png')} style={styles.man} />
                                                                }
                                                            })()
                                                        }
                                                        <View style={styles.box} >
                                                            <Text>{info[i].content}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            return str;
                                        })()
                                    }
                                </ScrollView>)
                        } else {
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
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#AAAAAA',
                                            fontSize: 17,
                                            marginTop: 40
                                        }}>暂时还没有消息哦~</Text>
                                    </View>
                                </View>
                            )
                        }
                    })()
                }
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

export default connect(
    (state) => ({
        MessageReducer:state.MessageReducer,
    }),
)(Message)
