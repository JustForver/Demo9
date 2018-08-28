/** created by sky on 16/7/7  ... */

import * as types from '../actionTypes';
import Util from '../../common/utils';
import {addErrorAction} from '../errorAction';
import config from '../../common/configuration'
import {loadingAction} from '../loadingAction'
/**
 *  查询交易记录
 *  @function fetchOrder
 * @param page 页数
 * @returns {function(*)}
 */
//查询交易记录的action
export let fetchOrder = (page) => {
    let URL = config.host + "commodity/order";
    return dispatch => {
        dispatch(loadingAction());  //触发正在加载
        Util.get(URL, (response) => {
            dispatch(orderAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchOrder(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {
            page: page, limit: config.limit
        });
    }
};

let orderAction = (response) => {
    return Object.assign(
        {type: types.ORDER_LIST},
        response,
    );
};
/**
 * 刷新交易记录
 * @function refreshOrder
 * @returns {function(*)}
 */

export let refreshOrder = () => {
    let URL = config.host + "commodity/order";
    return dispatch => {
        dispatch(loadingAction());  //触发正在加载
        dispatch(refreshList());  //  触发清空数据数组
        Util.get(URL, (response) => {
            dispatch(orderAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshOrder());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {
            page: 1, limit: config.limit
        });
    }
};

//清除当前用户的交易记录
export let refreshList = ()=> {    
    return {
        type: types.REFRESH_TICKET_LIST
    }
};
