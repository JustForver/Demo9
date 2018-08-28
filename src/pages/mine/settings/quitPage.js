/**
 * Created by osx on 2017/3/30.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import {fetchLogout} from '../../../actions/mine/userAction'
import {connect} from "react-redux";

class Quit extends Component {

    /**
     * 退出登录
     * @function
     */
    quit() {

        this.props.dispatch(fetchLogout());
        this.props.navigation.goBack();
    };


    render() {
        if (this.props.UserReducer.isLogin) {
            return (
                <TouchableHighlight onPress={this.quit.bind(this)} underlayColor={'#DDDDDD'}>
                    <View style={styles.quit}>
                        <Text
                            style={{fontSize:18,color:'#FFFFFF',textAlign: 'center',}}>
                            退 出 登 录</Text>
                    </View>
                </TouchableHighlight>
            )
        } else {
            return (null)
        }
    }
}


const styles = StyleSheet.create({
    quit: {
        backgroundColor: '#ED5555',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default connect(
    (state) => ({
        UserReducer:state.UserReducer
    }),
)(Quit)