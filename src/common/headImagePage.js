import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';

import constants from './constants';


export default class HeadPage extends Component {
    render() {
        return (
            <View style={styles.view}>
                <TouchableWithoutFeedback >
                    <View style={{width:80,height:50,marginTop:(Platform.OS === 'ios')?18:3}}>
                        <View>{this.props.left}</View>
                    </View>
                </TouchableWithoutFeedback>

                <View style={{flex:1, alignItems: 'center',justifyContent: 'center'}}>
                    <Image source={require('../image/navbarlogo.png')} style={{width:94, height:35,marginTop:(Platform.OS === 'ios')? 12: 0}}  />
                </View>

                <TouchableWithoutFeedback >
                    <View style={{width:80,height:50,marginTop:(Platform.OS === 'ios')?20:3,alignItems:'center',justifyContent:'center'}}>
                        <View>{this.props.right}</View>
                    </View>
                </TouchableWithoutFeedback>

            </View>

        );
    }

}

const styles = StyleSheet.create({
    view: {
        width: constants.window.width,
        height: (Platform.OS === 'ios') ? 60 : 50,
        backgroundColor: '#00c6ad',
        flexDirection: 'row'
    },

    image: {
        marginTop: (Platform.OS === 'ios') ? 13 : 6,
        width: 97,
        height: 21

    }
});
