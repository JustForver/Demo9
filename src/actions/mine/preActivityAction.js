/**
 * Created by osx on 2017/6/27.
 */

import * as types from '../actionTypes';
import Util from '../../common/utils';
import config from "../../common/configuration"
import {addErrorAction} from "../errorAction";
import {fetchUserInfo} from "./userAction";
import {loadingAction, refreshList} from "../loadingAction";


/**
 * 获取活动详情
 * @returns {function(*)}
 */
//广告Action
export let fetchAdvert = () => {
    let URL = config.host + 'tempActive/getActive';
    return dispatch => {
        dispatch(loadingAction());
        Util.get(URL, (response) => {
            dispatch(AdvertAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchAdvert());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
        });
    }
};

/**
 * 获取活动详情
 * @returns {function(*)}
 */
export let refreshAdvert = () => {
    let URL = config.host + 'tempActive/getActive';
    return dispatch => {
        dispatch(refreshList());
        dispatch(loadingAction());
        Util.get(URL, (response) => {
            dispatch(AdvertAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshAdvert());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
        });
    }
};

/**
 * 广告action
 * @function AdvertAction
 * @param date 广告信息
 * @returns {object}
 * @constructor
 */
let AdvertAction = (date)=> {
    return {
        type: types.FETCH_ADVERT,
        data:date
    }
};

/**
 *  报名参加活动
 * @function fetchActivityLD
 * @returns {function(*)}
 */

export let fetchActivityLD = ()=> {
    let URL = config.host + "tempActive/activeLD";
    return dispatch => {
        Util.post(URL, (response) => {
            dispatch(activityLDAction(response));
            if(response.result === 'success'){
                Util.toast(response.content);
            }
        }, (error) => {
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            }
            else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        });
    }
};


let activityLDAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_ACTIVITY_LD},
        {data}
    );
    return temp
};

/**
 * 红包功能
 * @returns {function(*)}
 */
//红包Action
export let fetchRedEnvelope = () => {
    let URL = config.host + 'user/RedEnvelope';
    return dispatch => {
        Util.get(URL, (response) => {
            dispatch(RedEnvelopeAction(response));
            dispatch(fetchUserInfo());
        }, (error) => {
            if (typeof error.detail.content !== "undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
        });
    }
};

let RedEnvelopeAction = (date)=> {
    return Object.assign({
        type: types.FETCH_RED_ENVELOPE
    }, date)
};
