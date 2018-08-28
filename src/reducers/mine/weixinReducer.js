/**
 * WeiXinReducer
 * @module WeiXinReducer
 */

import * as types from '../../actions/actionTypes';

/**
 * 用户Reducer初始状态
 * @type {json}
 */
const initialState = {
    bindPhone:false,
};

/**
 * 更新weiXinReducer的状态
 * @function weiXinReducer
 * @param {json} state weiXinReducer的初始化状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let weiXinReducer = (state = initialState, action)=> {
    switch (action.type) {
        //用户的登录
        case types.FETCH_WX_LOGIN:
            return Object.assign({}, state , action);
        case types.FETCH_WX_PAY:
            return Object.assign({}, state , action);
        case types.FETCH_WX_BIND_PHONE:
            return Object.assign({}, state , {
                bindPhone:true,
                info:action.info
            });
        default:
            return state
    }
};

export default weiXinReducer;
