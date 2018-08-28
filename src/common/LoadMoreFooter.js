import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image
} from 'react-native';

class LoadMoreFooter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {networkError,isEmpty, hasMore,isLoading} = this.props;
        if(networkError){
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        网络错误
                        下拉刷新
                    </Text>
                </View>
            )
        }else if(isLoading){
            return(
                <View style={styles.footer}>
                    <Image source={require('../image/load.gif')} style={{width:200,height:200}} resizeMode='contain'/>
                </View>
            )
        }else if (isEmpty) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>没有数据哦!</Text>
                </View>
            )
        }else if (hasMore) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>上拉加载</Text>
                </View>
            )
        }else if (!hasMore) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>加载完毕</Text>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTitle: {
        marginLeft: (Platform.OS === 'ios') ? 10 : 2,
        fontSize: 15,
        color: '#939393',
        marginTop: 20,
        marginBottom: 5
    }
});

export default LoadMoreFooter