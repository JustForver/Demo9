import * as types from './actionTypes';

/**
 * 控制按钮的状态
 * @module buttonAction
 * @param {string} buttonStatus  按钮的状态
 * @return {{type, buttonStatus: *}}
 */
export let buttonAction = (buttonStatus)=>{
    return {
        type:types.BUTTON,
        buttonStatus:buttonStatus

    }
};