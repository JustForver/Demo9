/**
 * Created by sky on 16/8/24.
 */

import * as types from './actionTypes';
/**
 * 错误信息
 * @param error
 * @returns {{type, error: *}}
 */

export let addErrorAction = (error)=>{
    return {
        type:types.ADDERROR,
        error:error
    }
};

