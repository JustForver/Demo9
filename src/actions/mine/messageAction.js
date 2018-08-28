
/****************************
 *   获得我的消息页面数据    *
 ****************************/

import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import db, {key} from '../../common/db'
/**
 * 获取信息
 * @function fetchMessage
 * @returns {function(*)}
 */
export let fetchMessage = () =>{
    let URL = config.host + 'message/all';

    return dispatch => {
        Util.get(URL,(response) => {
            dispatch(getMessageAction(response));
        },(error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchMessage());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
        },{page:1,limit:config.limit})
    }
};

let getMessageAction = (response) => {
    return (
        Object.assign(
            {type:types.MY_MESSAGE},
            response
        )
    )
};