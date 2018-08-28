/**
 * Created by sky on 16/10/13.
 */
import * as types from './actionTypes';
/**
 * 加载中
 * @function loadingAction
 * @returns {{type}}
 */

export let loadingAction = () => {
    return {
        type: types.LOADING
    }
};

/**
 * 正在刷新
 * @function refreshList
 * @returns {{type}}
 */
export let refreshList = ()=> {
    return {
        type: types.REFRESH
    }
};