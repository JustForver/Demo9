
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import Head from '../../../common/head'

export default class AboutUs extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <View style={{backgroundColor: '#f5f5f5',flex:1}}>

                <Head title={"关于我们"} click={()=>{this.props.navigation.goBack()}}/>

                <View style={{flex:1}}>
                    <View style={styles.view}>
                        <Image source={require('../../../image/mine/settings/map2.png')}
                               style={{width:162,height:162,marginTop:25}}
                        />
                    </View>

                    <View>
                        <Text style={styles.text2}>武汉亚投新能科技有限公司</Text>

                        <View style={{flexDirection:'row', justifyContent: 'center'}}>
                            <View style={{flex:1}}/>

                            <View style={{marginLeft:10}}>
                                <Text style={styles.text3}>邮箱:<Text style={styles.text_color}>wuxian@ev178.com</Text></Text>
                                <Text style={styles.text4}>电话:<Text style={styles.text_color}>02765388748</Text></Text>
                                <Text style={styles.text4}>网址:<Text style={styles.text_color}>www.178bus.com</Text></Text>
                                <Text style={styles.text4}>地址:<Text style={styles.text_color}>武汉市洪山区珞喻路8号</Text></Text>
                            </View>

                            <View style={{flex:1}}/>
                        </View>
                    </View>

                    <View style={{flex:1}}/>

                    <View style={{flexDirection:'row', justifyContent: 'center',marginBottom:20}}>
                        <Image
                            source={require('../../../image/mine/settings/car.png')}
                            style={{width:30,height:30}}
                        />
                    </View>
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center'
    },
    text1: {
        color: '#a1a1a1',
        fontSize: 18,
        marginTop: 20
    },
    text2: {
        marginTop: 30,
        textAlign: 'center'
    },
    text3: {
        marginTop: 20
    },
    text4: {
        marginTop: 6
    },
    text_color: {
        color: '#ff0000'
    }
});

