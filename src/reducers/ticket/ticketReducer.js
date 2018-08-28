/**
 * 用户车票的reducer
 * @module ticketReducer
 */

import * as types from '../../actions/actionTypes';

/**
 * ticketReducer的初始化状态
 * @type {json}
 */
const initialState = {};

/**
 * 更新ticketReducer的状态
 * @function ticketReducer
 * @param {json} state ticketReducer的初始化状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let ticketReducer = (state = initialState, action)=> {
    switch (action.type) {
        case types.UP_TIME:
            return Object.assign({}, state, action);
        default:
            return state
    }
};

export default ticketReducer;