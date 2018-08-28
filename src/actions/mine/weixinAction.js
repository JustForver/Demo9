/****************************
 *       微信相关action      *
 ****************************/
import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'
import {fetchUserInfo} from "./userAction";
//import * as WechatAPI from 'react-native-wx'
import db, {key} from "../../common/db";
import {fetchMessage} from "./messageAction";

/**
 * 微信登录
 * @function fetchWxLogin
 * @param result
 * @returns {function(*)}
 */
export let fetchWxLogin = (result)=>{
    let URL=config.host + "weixin/wxLogin";
    return dispatch =>{
        Util.post(URL,(response)=>{
            dispatch(wxLoginAction(response));
            if(response.result === 'success'){
                Util.toast("登录成功");
                //登录成功之后获取用户信息(积分,手机号,照片)
                dispatch(fetchUserInfo());
                //登录成功后获取用户消息
                dispatch(fetchMessage());
                db.saveById(key.ACCOUNT, "token",{
                    token: response.token,
                }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)
            }
        },(error)=>{
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchWxLogin(result));
                        ++i
                    }, 1000)
                }
            }
            if (error.detail.content === "用户未注册") {
                dispatch(wxBindPhoneAction(error.detail.info));
            } else {
                Util.toast(error.toString());
            }

            dispatch(addErrorAction(error));
        },{code:result,order_type:2});
    }
};

let wxLoginAction = (data) => {
    return Object.assign(
        {type:types.FETCH_WX_LOGIN},
        data)
};
let wxBindPhoneAction = (data) => {
    return {
        type:types.FETCH_WX_BIND_PHONE,
        info:data
    }

};
/**
 * 微信商品支付
 * @function fetchWxPay
 * @param id
 * @param amount
 * @returns {function(*=)}
 */

export let fetchWxPay = (id,amount) => {
    let URL=config.host + "commodity/buy";
    return dispatch => {
        Util.post(URL,(response)=>{
            dispatch(wxPayAction(response));
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
                dispatch(fetchUserInfo());
            },  (fail) => {
                Util.toast(fail.toString());
            }).catch( (e) => {
                Util.toast('支付失败,捕获到错误==' + e.message);

            });

        },(error)=>{
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }

        },{
            id:id,
            amount:amount,
            order_type:2
        })
    }
};

let wxPayAction = (data) => {
    return Object.assign(
        {type:types.FETCH_WX_PAY},
        data)
};

/**
 * 参加活动微信支付
 * @function fetchActivityWxPay
 * @param id
 * @returns {function(*=)}
 */
export let fetchActivityWxPay = (id) => {
    let URL=config.host + "activity/join";
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
                dispatch(fetchUserInfo());
            },  (fail) => {
                Util.toast(fail.toString());
            }).catch( (e) => {
                Util.toast('支付失败,捕获到错误==' + e.message);

            });
        },(error)=>{
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchActivityWxPay(id));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }

        },{
            id:id,
            order_type:2
        })
    }
};

/**
 * 微信绑定
 * @param result
 * @returns {function(*)}
 */

export  let fetchWxBind = (result)=>{
    let URL=config.host + "weixin/bind";
    return dispatch =>{
        Util.post(URL,(response)=>{
            dispatch(wxBindAction(response));
            if(response.result === 'success'){
                Util.toast("绑定成功");
                //登录成功之后获取用户信息(积分,手机号,照片)
                dispatch(fetchUserInfo());
            }
        },(error)=>{
            if (error.message === "未知异常") {
                dispatch(fetchWxLogin(result))
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        },{code:result,order_type:2});
    }
};

let wxBindAction = (data) => {
    return Object.assign(
        {type:types.FETCH_WX_BIND_PHONE},
        data)
};


