import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableWithoutFeedback,
    InteractionManager,
    ScrollView
} from 'react-native';

import constants from "../../../common/constants";
import CheckBox from '../../../components/checkbox';
import Head from '../../../common/head';
import config from '../../../common/configuration';

import  Loading from '../../../common/loading';

import {fetchMallDetail,fetchAlipaySign} from '../../../actions/mine/mallAction';
import {fetchWxPay} from '../../../actions/mine/weixinAction';
import {connect} from "react-redux";

class CommodityDetailed extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            alipay: true,
            weixin: false,
            count:1
        };
    }

    componentWillMount() {
        const {navigation} = this.props;
        const id = navigation.getParam('id');
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchMallDetail(id));
        });
    }

    /**
     * 支付宝支付
     * @function
     */
    pay() {
        const {UserReducer} = this.props;
        if (UserReducer.isLogin) {
            this.props.dispatch(fetchAlipaySign(this.props.id.toString(),this.state.count));
        } else {
            Alert.alert('',
                '请先登录',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        }
    }

    /**
     * 微信支付
     * @function
     */
    weChatPay() {
        const { UserReducer} = this.props;
        if (UserReducer.isLogin) {
            this.props.dispatch(fetchWxPay(this.props.id,this.state.count));
        } else {
            Alert.alert('',
                '请先登录',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        }
    }

    render() {
        const {MallReducer} = this.props;
        let img = config.host + "upload/" + MallReducer.img;
        return (
            <View style={{backgroundColor: '#FFFFFF',flex:1}}>

                <Head title={"商品详情"} click={()=>this.props.navigation.goBack()}/>
                {
                    MallReducer.detailLoading ?
                        <Loading style={{marginTop: 100}}/> :
                        <ScrollView style={{backgroundColor: '#f5f5f5'}}>

                            <View style={{paddingLeft: 8,paddingRight:8,paddingTop:2,paddingBottom:2}}>
                                <Image source={{uri:img}}
                                       style={styles.headImg}
                                       resizeMode="contain"
                                />
                            </View>

                            <View style={{padding: 12, backgroundColor: '#FFFFFF'}}>

                                <View style={styles.priceText}>
                                    <Text style={{color: '#555555', paddingRight: 10}}>商品价格</Text>
                                    <Text>￥</Text>
                                    <Text style={{fontSize: 24, color: '#666666'}}>{MallReducer.price}</Text>
                                </View>

                                <View style={styles.descriptionText}>
                                    <View style={{height: 70, paddingRight: 10}}>
                                        <Text style={{color: '#555555'}}>商品简介</Text>
                                    </View>

                                    <View style={{height: 70}}>
                                        <Text numberOfLines={3} style={{color: '#555555'}}>{MallReducer.depict}</Text>
                                    </View>

                                </View>
                            </View>

                            <View style = {{flexDirection:'row',marginTop:10,backgroundColor:'#ffffff',height: 50,alignItems:'center'}}>
                                <Text style = {{fontSize:16,color:'rgba(0,0,0,0.5)',marginLeft:10}}>请选择购买商品的数量</Text>

                                <View style = {{flex:1}}/>

                                <TouchableWithoutFeedback onPress = {() => {
                                    if(this.state.count === 1){
                                        return null
                                    }else{
                                        return this.setState({count:--this.state.count})
                                    }
                                }}>
                                    <View style = {{width:30,height:30,backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center',justifyContent:'center',margin:1}}>
                                        <Text style = {{fontSize:20, fontWeight:'bold',color:'rgba(0,0,0,0.5)'}}>-</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style = {{width:40,height:30, backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center',justifyContent:'center',margin:1}}>
                                    <Text style = {{fontSize:18,color:'rgba(0,0,0,0.5)'}}>{this.state.count}</Text>

                                </View>
                                <TouchableWithoutFeedback onPress = {() => {
                                    this.setState({count:++this.state.count})
                                }}>
                                    <View style = {{width:30,height:30, backgroundColor:'rgba(0,0,0,0.1)',alignItems:'center',justifyContent:'center',margin:1,marginRight:10}}>
                                        <Text style = {{fontSize:20, fontWeight:'bold',color:'rgba(0,0,0,0.5)'}}>+</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>

                            <View style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 10,
                                marginTop: 10,
                                backgroundColor: '#FFFFFF',
                            }}>

                                <View>
                                    <CheckBox
                                        text='微信支付'
                                        icon={require('../../../image/mine/mall/commodityDetailed/weixin.png')}
                                        checked={this.state.weixin}
                                        onClick={(checked) => {
                                            this.setState({
                                                alipay: false,
                                                weixin: checked,
                                            })
                                        }}/>

                                    <View style={{marginTop: 10, marginBottom: 10,}}>
                                        <Image source={require('../../../image/mine/mall/commodityDetailed/point.png')}
                                               style={styles.underLine}/>
                                    </View>

                                    <CheckBox
                                        text='支付宝支付'
                                        icon={require('../../../image/mine/mall/commodityDetailed/zhifubao.png')}
                                        checked={this.state.alipay}
                                        onClick={(checked) => {
                                            this.setState({
                                                alipay: checked,
                                                weixin: false,
                                            })
                                        }}/>

                                    <View style={{marginTop: 10}}>

                                    </View>
                                </View>
                            </View>

                            <View style={{
                                marginTop: 30,
                                marginBottom: 20,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TouchableWithoutFeedback
                                    onPress={()=> {
                                        if (this.state.weixin) {
                                            return this.weChatPay()
                                        } else {
                                            return this.pay()
                                        }
                                    }}>
                                    <View style={styles.buy}>
                                        <Text style={{color: '#FFFFFF', fontSize: 16}}>确 认 支 付</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </ScrollView>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headImg: {
        height: (constants.window.height) * 0.24,
        resizeMode: 'contain'
    },
    points: {
        color: '#00c6ad',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 20
    },
    payment: {
        color: '#AAAAAA',
        fontSize: 15,
        textAlign: 'center'
    },

    underLine: {
        width: constants.window.width,
        height: 1,
        position: 'absolute'
    },
    buy: {
        backgroundColor: '#00c6ad',
        borderRadius: 20,
        overflow: 'hidden',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 80,
        paddingRight: 80
    },
    priceText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
    },

    descriptionText: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
    },

    remarksText: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});

export default connect(
    (state) => ({
        MallReducer: state.MallReducer,
        UserReducer:state.UserReducer
    }),
)(CommodityDetailed)