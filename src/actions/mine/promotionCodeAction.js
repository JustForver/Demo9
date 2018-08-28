/**
 * Created by osx on 2017/7/11.
 */
import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'

export let useConversion = (code) => {
    let URL = config.host + "conversion/use";
    return dispatch => {
        Util.post(URL, (response) => {
            if (response.result === 'success') {
                Util.toast('兑换成功');
                dispatch(useConversionAction(response));
            }
        }, (error) => {
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }
        }, {code:code})
    }
};

let useConversionAction = () => {
    return Object.assign(
        {type: types.USE_CONVERSION},
    )
};

export let fetchConversionList = (page,limit) => {
    let URL = config.host + "conversion/record";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(conversionAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchConversionList(page));
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
/**
 * 刷新优惠券列表
 * @function refreshCouponList
 * @returns {function(*)}
 */

export let refreshConversionList = () => {
    let URL = config.host + "conversion/record";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(conversionAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchConversionList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        }, {page: 1, limit: config.limit});
    }
};


export let conversionAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_CONVERSION_LIST},
        {data}
    );
    return temp
};

/**
 *
 * 刷新列表的action
 * @returns {{type}}
 */
export let refreshListAction = () => {
    return {
        type: types.REFRESH_CONVERSION_LIST
    }
};
/**
 * 加载列表
 * @returns {{type}}
 */
export let loadingListAction = () => {
    return {
        type: types.LOADING_CONVERSION_LIST
    }
};

export let submitRecommendCode = (recommendCode) => {
    let URL = config.host + "conversion/recommend/phone";
    return dispatch => {
        Util.post(URL, (response) => {
            if (response.result === 'success') {
                Util.toast('兑换成功');
            }
        }, (error) => {
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }
        }, {code:recommendCode})
    }

}


