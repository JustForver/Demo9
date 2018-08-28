import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import constants from '../../common/constants';

/**
 * 此组件返回的是一条线路的简介信息
 */
export default class LineBasic extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {}
    }
    jump(id){
        this.props.navigation.navigate('newDetail',{
            id:id
        })

    }
    render() {
        return (
            <TouchableOpacity onPress={()=> {this.jump(this.props.id)}}
                              activeOpacity={0.5}>
                <View  style={styles.background}>
                    <Image source={{uri:this.props.img}} style={styles.img}/>
                    <View style={styles.txt_view}>
                        <Text style={{fontSize:17}}>{this.props.name}</Text>
                        <Text style={{fontSize:13,color:'#a1a1a1',marginTop:2}}>{this.props.name}/{this.props.synopsis}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    background:{
        flex:1,
        alignItems:'center',
        flexDirection:'row',
        marginTop:8,
        backgroundColor:'#ffffff',
        padding:12
    },
    img:{
        width:60,
        height:60
    },
    txt_view:{
        width:constants.window.width*0.6,
        marginLeft:20
    }
});



