'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';

export default class CheckBox extends Component{
    //属性类型：
    static propTypes = {
        text: PropTypes.string,
        textStyle: PropTypes.object,
        textAtBehind: PropTypes.bool,
        checked: PropTypes.bool,
        onClick: PropTypes.func
    };

    //默认属性(框在后，字在前，未选中,无点击事件)
    static defaultProps={
        text: '选项1',
        textAtBehind: false,
        checked: false

    };

    //点击选择框的事件
    onClick(){
        if (this.props.onClick) {
            this.props.onClick(!this.props.checked);
        }
    }


    render(){
        //选择框的图片
        var imgSource;
        if (this.props.checked) {
            imgSource = require('../image/mine/mall/commodityDetailed/red_confirm.png');
        } else {
            imgSource = require('../image/mine/mall/commodityDetailed/confirm.png');
        }

        //文字跟可选框位置
        var container;
        if (this.props.textAtBehind) {
            container = (
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={imgSource}/>
                    <Text style={[this.props.textStyle, styles.text]}>{this.props.text}</Text>
                </View>
            );
        } else {
            container = (
                <View style={styles.container}>
                    <Image source={this.props.icon}
                           style={styles.payIcon}/>
                    <Text style={[this.props.textStyle, styles.text]}>{this.props.text}</Text>
                    <View style={{flex: 1}}/>
                    <Image source={imgSource}
                           style={styles.image}
                        />
                </View>
            );
        }

        return (
            <TouchableWithoutFeedback
                onPress={this.onClick.bind(this)}
                underlayColor='#FFFFFF'>
                {container}
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 18,
        height: 18,
    },
    text: {
        fontSize: 16,
        marginLeft: 10,
        color:'#666666'
    },
    payIcon: {
        width: 36,
        height: 36,
    },
});
