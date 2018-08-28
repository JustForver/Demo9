/**
 * Created by sky on 16/10/11.
 */

import * as types from './actionTypes'
import config from '../common/configuration'
import Util from '../common/utils'
import {addErrorAction} from './errorAction'
/*import Alipay from '../components/alipay';*/
import {Alert} from 'react-native';
import {fetchUserInfo} from './mine/userAction'

/*import * as Mall from '../pages/mine/mall/mallPage'*/


/**
 * 获取活动的信息
 * @function activityList
 * @param page 页数
 * @returns {function(*)}
 */
export let activityList = (page,genre)=> {
    let URL = config.host + "activity/genre";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response)=> {
            dispatch(activityAction(response,genre));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(activityList(page,genre));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {genre:genre,page: page,limit: 4})
    }
};

/**
 * 刷新活动信息列表
 * @function refreshActivityList
 * @returns {function(*)}
 */

export let refreshActivityList = (genre)=> {
    let URL = config.host + "activity/genre";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(activityAction(response,genre));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshActivityList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        }, {genre:genre,page: 1, limit: 4});
    }
};


let activityAction = (data,genre) => {
    let temp = Object.assign(
        {type: types.FETCH_ACTIVITY_LIST},
        {data},
        {genre:genre}
    );
    return temp
};

/**
 *
 * 刷新活动列表的action
 * @returns {{type}}
 */
export let refreshListAction = ()=> {
    return {
        type: types.REFRESH_ACTIVITY_LIST
    }
};
/**
 * 加载活动列表
 * @returns {{type}}
 */
let loadingListAction = ()=> {
    return {type: types.LOADING_ACTIVITY_LIST}
};


/**
 * 活动详情
 * @function fetchActivityDetail
 * @param id 活动id
 * @returns {function(*)}
 */

export let fetchActivityDetail = (id)=> {
    let URL = config.host + "activity/detail";
    return dispatch => {
        Util.get(URL, (response)=> {
            dispatch(activityDetailAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchActivityDetail(id));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            Util.toast(error.toString());
            dispatch(addErrorAction(error));
        }, {id:id})
    }
};
/**
 * 活动详情页面的action
 * @function activityDetailAction
 * @param data
 * @returns {*}
 */
let activityDetailAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_ACTIVITY_DETAIL},
        {data}
    );
    return temp
};

/**
 * 积分支付
 * @function fetchActivityIntegralPay
 * @param id
 * @returns {function(*)}
 */
export let fetchActivityIntegralPay = (id) => {
    let URL=config.host + "activity/join";
    return dispatch => {
        Util.post(URL,(response)=>{
            if(response.result==='success'){
                Util.toast(response.payinfo.result);
            }
            //登录成功之后获取用户信息(积分,手机号,照片)
            dispatch(fetchUserInfo());
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchActivityIntegralPay(id));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
                if(error.detail.content === "积分不足,请充值!"){
                    setTimeout(()=>{
                        getNavigator().push({
                            component: Mall,
                            props: {}
                        })
                    },1000);
                }
            } else {
                Util.toast(error.toString());
            }
        },{
            id:id,
            order_type:3
        })
    }
};
/**
 * 获取支付宝签名
 * @function fetchActivityAlipaySign
 * @param id
 * @returns {function(*=)}
 */

export  let fetchActivityAlipaySign = (id)=>{
    let URL=config.host + "activity/join";
    return dispatch =>{
        Util.post(URL,(response)=>{
            //得到签名后的订单信息,调用支付接口
            if(response.result === 'success'){
                Alipay.pay(response.payinfo.sign)
                    .then(
                        function(data){
                            dispatch(fetchAlipayResult(data))
                        },
                        function (err) {
                        }
                    )
            }
        },(error)=>{
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchActivityAlipaySign(id));
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
        },data.substring(36,data.length-1))
    }
};

/**
 * 活动获取分类列表
 * @function fetchActivityTypeList
 * @returns {function(*)}
 */

export let fetchActivityTypeList = ()=> {
    let URL = config.host + "activity/getActivityTypeList";
    return dispatch => {
        Util.get(URL, (response)=> {
            dispatch(activityTypeListAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchActivityTypeList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            Util.toast(error.toString());
            dispatch(addErrorAction(error));
        })
    }
};
/**
 * 分类列表的action
 * @function activityTypeListAction
 * @param data
 * @returns {*}
 */
let activityTypeListAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_ACTIVITY_TYPE},
        {data}
    );
    return temp
};

