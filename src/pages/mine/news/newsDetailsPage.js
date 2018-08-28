import React, {Component} from 'react';
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';

import Head from '../../../common/head';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import constants from '../../../common/constants';
import  Util from '../../../common/utils';
import {newsDetailList} from '../../../actions/mine/newsAction';
import Loading from '../../../common/loading';
import {connect} from "react-redux";


export class NewsDetails extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        this.props.dispatch(newsDetailList(id));
    }

    /**
     * 分享给微信朋友
     * @function
     */


    /**
     * 分享给微信朋友圈
     * @function
     */


    shareOpen() {
        this.setState({show: true})
    }

    close() {
        this.setState({show: false})
    }

    render() {
        const { navigation } = this.props;
        const url = navigation.getParam('url');
        let right = (
            <TouchableOpacity onPress={() => {this.shareOpen()}} >
                <View style={{alignItems: 'center',width:80,height:50,justifyContent:'center'}}>
                    <FontAwesomeIcon name="share-square-o" color="#fff" size={20} style={{marginLeft:20}}/>
                </View>
            </TouchableOpacity>
        );

        return (
            <View style={{backgroundColor: "#fff",flex:1}}>
                <Head title={"新闻详情"} click={()=>this.props.navigation.goBack()} right={right}/>

                <Modal animationType='fade' transparent={true} visible={this.state.show} onRequestClose={()=> {}}>
                    <TouchableWithoutFeedback onPress={()=> {this.close()}}>
                        <View  style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}>
                            <TouchableWithoutFeedback onPress={()=> {this.shareOpen()}}>
                                <View style={styles.modal}>
                                    <Text style={[styles.spinnerTitle, { fontSize: 20, color: 'black' }]}>
                                        分享到
                                    </Text>
                                    <View style={styles.shareParent}>
                                        <TouchableOpacity onPress={() => {}} style={styles.content}>
                                            <View style={styles.shareContent}>
                                                <Image source={require('../../../image/mine/activity/weixin.png')}
                                                       style={{ width: 44, height: 44}}
                                                       resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>微信</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {}} style={styles.content}>
                                            <View style={styles.shareContent}>
                                                <Image source={require('../../../image/mine/activity/share_icon_moments.png')}
                                                       style={{ width: 44, height: 44}}
                                                       resizeMode='contain'/>
                                                <Text style={styles.spinnerTitle}>朋友圈</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <WebView
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    renderLoading={() => <Loading/>}
                    source={{uri:url}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        width: constants.window.width * (7 / 10),
        height: constants.window.width * (7 / 10) * 0.68,
        backgroundColor: '#fcfcfc',
        padding: 20,
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent:'center'
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 20,
    },
    spinnerTitle: {
        fontSize: 18,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex:1
    },
});

export default connect(
    (state) => ({
        isLoading: state.NewsReducer.isLoading,
        networkError: state.NewsReducer.networkError,
        detailLoading: state.NewsReducer.detailLoading,
        rawData: state.NewsReducer.rawData,
        bannerList: state.NewsReducer.bannerList,
        page: state.NewsReducer.page,
        hasMore: state.NewsReducer.hasMore,
        isEmpty: state.NewsReducer.isEmpty,
        count: state.NewsReducer.count,
    }),
)(NewsDetails)

