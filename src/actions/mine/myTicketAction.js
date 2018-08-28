/**
 * Created by sky on 16/7/2.
 */

import * as types from '../actionTypes';
import Util from '../../common/utils';
import config from '../../common/configuration';
import {addErrorAction} from '../errorAction';
import {fetchUserInfo} from './userAction'

/**
 * 记载乘车记录
 * @function fetchTicketList
 * @param page
 * @returns {function(*)}
 */
export let fetchTicketList = (page)=> {
    let URL = config.host + "ticket/list";
    return dispatch => {
        dispatch(loadingMyTicketList());
        Util.get(URL, (response)=> {
            dispatch(myTicketAction(response));
            dispatch(fetchUserInfo());
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchTicketList(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {page: page, limit: config.limit})
    }
};
//获取乘车记录数据action
let myTicketAction = (data)=> {
    let temp = Object.assign(
        {type: types.FETCH_TICKET_LIST},
        {data}
    );
    return temp
};

/**
 * 刷新乘车记录
 * @function refreshListCreator
 * @returns {function(*)}
 */
//刷新乘车记录数据
export let refreshListCreator = ()=>{
    let URL = config.host + "ticket/list";
    return dispatch => {
        dispatch(refreshList());
        dispatch(loadingMyTicketList());
        Util.get(URL, (response)=> {
            dispatch(myTicketAction(response));
            dispatch(fetchUserInfo());
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshListCreator());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {page: 1, limit: config.limit})
    }
};

export let refreshList = ()=> {
    return {
        type: types.REFRESH_TICKET_LIST
    }
};

let loadingMyTicketList = ()=>{
    return {type: types.LOADING_MYTICKET_LIST}
};