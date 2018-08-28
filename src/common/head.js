import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';

import constants from '../common/constants';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


export default class Head extends Component {

    render() {
        return (
            <View style={[styles.view,this.props.head]}>
                <View style={{width:80}}>
                    <TouchableWithoutFeedback onPress={this.props.click}>
                        <View style={{width:80,height: 50,justifyContent:'center',marginTop:(Platform.OS === 'ios')? 6: 0}}>
                            <FontAwesomeIcon name="angle-left" color="#fff" size={36} style={{marginTop:(Platform.OS === 'ios')?3:0, marginLeft:18}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{alignItems:'center',flex:1,marginTop:(Platform.OS === 'ios')?13:3}}>
                    <Text style={{fontSize:18,color:"white"}}>
                        {this.props.title}
                    </Text>
                </View>

                <TouchableWithoutFeedback onPress={this.props.rightClick }>
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
        flexDirection:'row',
        alignItems:'center',
    }
});