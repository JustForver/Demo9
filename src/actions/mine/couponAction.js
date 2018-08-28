/**
 * Created by osx on 2017/6/13.
 */
import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'

/**
 * 获取优惠券的信息
 * @function activityList
 * @param page 页数
 * @returns {function(*)}
 */
export let fetchCouponList = (page)=> {
    let URL = config.host + "myCoupon/userCoupon";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response)=> {
            dispatch(couponAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchCouponList(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {page: page,limit: 5})
    }
};
/**
 * 刷新优惠券列表
 * @function refreshCouponList
 * @returns {function(*)}
 */

export let refreshCouponList = ()=> {
    let URL = config.host + "myCoupon/userCoupon";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(couponAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshCouponList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        }, {page: 1, limit: 5});
    }
};


export let couponAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_COUPON_LIST},
        {data}
    );
    return temp
};

/**
 *
 * 刷新列表的action
 * @returns {{type}}
 */
export let refreshListAction = ()=> {
    return {
        type: types.REFRESH_COUPON_LIST
    }
};
/**
 * 加载列表
 * @returns {{type}}
 */
export let loadingListAction = ()=> {
    return {
        type: types.LOADING_COUPON_LIST
    }
};


