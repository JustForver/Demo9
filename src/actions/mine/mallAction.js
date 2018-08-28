/****************************
*       获得商城页面数据      *
 ****************************/
import React, {Component} from 'react';
import {Alert,
        Platform,
}from 'react-native';
import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'
/*import Alipay from '../../components/alipay';*/
import {fetchUserInfo} from './userAction'

/**
 * 获取支付宝签名
 * @function fetchAlipaySign
 * @param id
 * @param amount
 * @returns {function(*=)}
 */
export  let fetchAlipaySign = (id,amount)=>{
    let URL=config.host + "commodity/buy";
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
                            console.log(err);
                        }
                    )
            }
        },(error)=>{
            Util.toast(error.toString());
        },{
            id:id,
            amount:amount,
            order_type:1
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
    let URL=config.host + "alipay/ret";
    return dispatch =>{
        Util.postAlipay(URL,(response)=>{
            if(response.result === 'success'){
                dispatch(fetchUserInfo());
                Alert.alert('',
                    '交易成功',
                    [
                        {text: '确定', onPress: () => {}},
                    ]
                )
            }
        },(error)=>{
            Util.toast(error.toString());
        },data)
    }
};

/**
 * 刷新商城列表
 * @function refreshMallList
 * @returns {function(*)}
 */
export let refreshMallList = ()=>{
    let URL = config.host + "commodity/list/all";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL,(response) => {
            dispatch(mallListAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshMallList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        },{page: 1, limit: config.limit});
    }
};
/**
 *
 * 加载商城列表、
 * @function loadMallList
 * @param page 页数
 * @returns {function(*)}
 */
export let loadMallList = (page)=> {
    let URL = config.host + "commodity/list/all";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response)=> {
            dispatch(mallListAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(loadMallList(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {page: page, limit: config.limit})
    }
};

let mallListAction = (data) =>{
    let temp = Object.assign(
        {type:types.FETCH_MALL_LIST},
        {data}
    );
    return temp
};

export let refreshListAction = ()=> {
    return {
        type: types.REFRESH_MALL_LIST
    }
};

let loadingListAction = ()=>{
    return {type: types.LOADING_MALL_LIST}
};
/**
 * 获取商品信息详情
 * @function fetchMallDetail
 * @param id 商品id
 * @returns {function(*)}
 */
export let fetchMallDetail = (id) => {
    let URL = config.host + "commodity/detail";
    return dispatch => {

        Util.get(URL, (response)=> {
            dispatch(mallDetailAction(response));
        },(error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchMallDetail(id));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        },{id:id})
    }
};

let mallDetailAction = (data) => {
    let temp = Object.assign({
        type:types.FETCH_MALL_DETAIL,
        data
    });
    return temp
};