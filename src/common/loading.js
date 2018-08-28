import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Image,
} from 'react-native';

export default class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.loadingView}>
                <Image source={require('../image/load.gif')} style={{width:200,height:200}} resizeMode='contain'/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#f5f5f5'
    },
});



