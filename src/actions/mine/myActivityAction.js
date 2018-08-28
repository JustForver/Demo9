/**
 * Created by sky on 16/10/24.
 */

import * as types from '../actionTypes'
import Util from '../../common/utils'
import config from '../../common/configuration'
import {addErrorAction} from '../errorAction'
import {loadingAction,refreshList} from '../loadingAction'

/**
 * 加载我的活动列表
 * @param page 页数
 * @returns {function(*)}
 */
export let loadingMyActivityList = (page) => {
    let URL = config.host + "activity/list/mine";
    return dispatch => {
        dispatch(loadingAction());
        Util.get(URL,(response) => {
            dispatch(MyActivityAction(response))
        },(error)=>{
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(loadingMyActivityList(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        },{
            page:page,
            limit:config.limit
        })
    }
};

/**
 * 刷新我的活动列表
 * @function refreshMyActivityList
 * @returns {function(*)}
 */
export let refreshMyActivityList = () => {
    let URL = config.host + "activity/list/mine";

    return dispatch => {
        dispatch(loadingAction());
        dispatch(refreshList());
        Util.get(URL,(response) => {
            dispatch(MyActivityAction(response))
        },(error)=>{
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshMyActivityList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        },{
            page:1,
            limit:config.limit
        })
    }
};

/**
 * 获取我的活动的信息
 * @param data
 * @returns {*}
 * @constructor
 */
let MyActivityAction = (data)=> {
    let temp = Object.assign(
        {type: types.MY_ACTIVITY_LIST},
        {data}
    );
    return temp
};
