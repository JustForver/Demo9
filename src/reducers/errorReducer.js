/**
 * 错误的reducer
 * @module errorReducer
 */

import * as types from '../actions/actionTypes';

/**
 * 更新errorReducer的状态
 * @function errorReducer
 * @param {json} state errorReducer的初始化状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let errorReducer = (state = [], action)=> {
    switch (action.type) {
        case types.ADDERROR:
            return state.concat(action.error);
        case types.REMOVEERROR:
            return state.filter((error)=>{
                return error.name !== action.error.name;
            });
        default:
            return state
    }
};

export default errorReducer;