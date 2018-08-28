/**
 * Created by osx on 2017/5/10.
 */
import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'
/*import * as WechatAPI from 'react-native-wx'*/
/*import Alipay from '../../components/alipay';*/
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Platform,
    Alert,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native';
import {fetchUserInfo} from "../mine/userAction";

//获取车辆信息
export let fetchRentInfo=()=>{
    let URL=config.host2+"/commodity/getCommodityList";
    return despath => {
        Util.get(URL,(response)=>{
            if(response.result=== 'success'){
                despath(rentInfo(response));
            }
        },(error)=>{
            if(typeof error.detail.content!=="undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
        },{
        })

    }
};
let rentInfo=(data)=>{
    let temp=Object.assign(
        {type:types.FETCH_RENT_INFO},
        {data}
    )
    return temp;
}
//预约信息确认
export let rentAffirm = (name,phone,begin,end,carId,number,date1,date2) => {
    let URL=config.host2 + "/order/createOrder";
    return dispatch => {
        Util.post(URL,(response)=>{
            if (response.result === 'success') {
                Util.toast('预约成功!');
                dispatch(rentAffirmAction(response));
            }
        },(error)=>{
            if (typeof error.detail.content !== "undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
        },{
            name:name,
            phone:phone,
            start:begin,
            end:end,
            startingTime:date1,
            endTime:date2,
            commodityId:carId,
            amount:number,
            type:'0',
        })
    }
};

let rentAffirmAction = () => {
    return Object.assign(
        {type:types.RENT_AFFIRM},
    )
};


//查询预约信息
export let rentSearch = (phone,page)=> {
    let URL=config.host2 + "/order/userAllOrder";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(rentSearchMessage(response));
        }, (error) => {
            if (typeof error.detail.content !== "undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
            dispatch(addErrorAction(error));
        }, {
            phone:phone,page:page,limit: config.limit
        });
    }
};
/**
 * 根据手机号刷新包车记录列表
 * @function refreshRentList
 * @param phone 手机号
 * @returns {function(*)}
 */
export let refreshRentList = (phone)=> {
    let URL=config.host2 + "/order/userAllOrder";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(rentSearchMessage(response));
        }, (error) => {
            if (typeof error.detail.content !== "undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
            dispatch(addErrorAction(error));
        }, {
            phone:phone,page:1,limit: config.limit
        });
    }
};
let rentSearchMessage = (data) => {
    let temp = Object.assign(
        {type:types.RENT_LIST},
        {data}
    );
    return temp
};

export let refreshListAction = ()=> {
    return {
        type: types.REFRESH_RENT_LIST
    }
};

let loadingListAction = ()=> {
    return {type: types.LOADING_RENT_LIST}
};

/**
 * 获取支付宝签名
 * @function fetchAlipaySign
 * @param id
 * @param amount
 * @returns {function(*=)}
 */
export  let rentAlipayPay = (tradeNo)=>{
    let URL=config.host2 + "/pay/pay";
    return dispatch =>{
        Util.post(URL,(response)=>{
            //得到签名后的订单信息,调用支付接口
            if(response.result === 'success'){
                Alipay.pay(response.payinfo.sign)
                    .then(
                        function(data){
                            let value;
                            if(Platform.OS === 'ios'){
                                value = data[0].result;
                            }else{
                                value = data.substring(36,data.length-1);
                            }
                            dispatch(fetchAlipayResult(value))
                        },
                        function (err) {
                        }
                    )
            }
        },(error)=>{
            Util.toast(error.toString());
        },{
            payType:1,
            tradeNo:tradeNo
        })
    }
};


/**
 * 支付宝同步校验
 * @function fetchAlipayResult
 * @param data
 * @returns {function(*)}
 */
let fetchAlipayResult = (data)=>{
    let URL=config.host2 + "/alipay/ret";
    return dispatch =>{
        Util.postAlipay(URL,(response)=>{
            if(response.result === 'success'){
                dispatch(fetchUserInfo());
                dispatch(rentPaySuccessAction());
                Alert.alert('',
                    '交易成功',
                    [
                        {text: '确定', onPress: () => {}},
                    ]
                )
            }
        },(error)=>{
            Util.toast(error.toString());
        },data.substring(data))
    }
};
/**
 * 微信支付
 * @function rentWxPay
 * @param tradeNo 订单号
 * @returns {function(*=)}
 */
export let rentWxPay = (tradeNo) => {
    let URL=config.host2 + "/pay/pay";
    return dispatch => {
        Util.post(URL,(response)=>{
            var data ={
                partnerId: response.payinfo.partnerId,  //商户id
                prepayId: response.payinfo.prepayId,   //预支付订单
                nonceStr: response.payinfo.nonceStr,   //随机串，防重发
                timeStamp: response.payinfo.timeStamp.toString(),  //时间戳，防重发
                package: response.payinfo.wxPackage,    //商家根据文档填写的数据和签名
                sign: response.payinfo.sign,       //商家根据微信开放平台文档对数据做的签名
            };
            WechatAPI.pay(data
            ).then( (result)=> {
                Util.toast('支付成功');
                dispatch(rentPaySuccessAction());
                dispatch(fetchUserInfo());
            },  (fail) => {
                Util.toast(fail.toString());
            }).catch( (e) => {
                Alert.alert(e.message);
                Util.toast('支付失败,捕获到错误==' + e.message);
            });
        },(error)=>{
            Util.toast(error.toString());
        },{
            payType:2,
            tradeNo:tradeNo
        })
    }
};

let rentPaySuccessAction = ()=> {
    return {type: types.RENT_PAY_SUCCESS}
};