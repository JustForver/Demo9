import * as types from '../actionTypes';
import Util from '../../common/utils';
import config from '../../common/configuration'
import db, {key} from '../../common/db'
import {addErrorAction} from '../errorAction'
import  {buttonAction} from '../buttonAction'
import {refreshList} from './orderAction'
import {fetchMessage} from './messageAction'
import {refreshCouponList} from "./couponAction";
/**************************************
 *              用户操作处理            *
 **************************************/
/**
 * 用户登录
 * @function fetchUserLogin
 * @param {string}userName
 * @param {string} password
 * @returns {function(*)}
 */
export let fetchUserLogin = (userName, password)=> {
    let URL = config.host + "user/login";
    return dispatch => {
        Util.post(URL, (response) => {
            dispatch(userLoginAction(response, userName));
            //登录成功之后获取用户信息(积分,手机号,照片)
            dispatch(fetchUserInfo());
            //登录成功后获取用户消息
            dispatch(fetchMessage());
            db.save(key.ACCOUNT, {
                phone: userName,
                password: password
            }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchUserLogin(userName, password));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
            dispatch(buttonAction("loginButton"));
        }, {
            phone: userName,
            password: password
        });
    }
};
/**
 * 用户登录的Action
 * @function userLoginAction
 * @param {json} response
 * @returns {object}
 */
let userLoginAction = (response)=> {
    return Object.assign({
        type: types.USER_LOGIN
    }, response)
};

/**
 * 用户绑定手机号登录
 * @function fetchBindPhoneLogin
 * @param {string}phone
 * @param {string} code
 * @returns {function(*)}
 */
export let fetchBindPhoneLogin = (phone,code,info)=> {
    let URL = config.host + "user/wxRegister";
    return dispatch => {
        Util.post(URL, (response) => {
            dispatch(bindPhoneLoginAction(response));
            //登录成功之后获取用户信息(积分,手机号,照片)
            dispatch(fetchUserInfo());
            //登录成功后获取用户消息
            dispatch(fetchMessage());
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchBindPhoneLogin(phone,code,info));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {
            phone: phone,
            code: code,
            info:info
        });
    }
};
/**
 * 用户绑定手机号登录的Action
 * @function bindPhoneLoginAction
 * @param {json} response
 * @returns {object}
 */
let bindPhoneLoginAction = (response)=> {
    return Object.assign({
        type: types.BIND_PHONE_LOGIN
    }, response)
};

/**
 * 手机号动态登录
 * @function fetchPhoneDynamicLogin
 * @param {string}phone
 * @param {string} code
 * @returns {function(*)}
 */
export let fetchPhoneDynamicLogin = (phone,code)=> {
    let URL = config.host + "user/dynamic/login";
    return dispatch => {
        Util.post(URL, (response) => {
            if(response.result === 'success'){
                db.saveById(key.ACCOUNT,"token",{
                    token: response.token,
                }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)

                db.saveById(key.ACCOUNT,"phone",{
                    phone: phone,
                }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)

                dispatch(phoneDynamicLoginAction(response));
                //登录成功之后获取用户信息(积分,手机号,照片)
                dispatch(fetchUserInfo());
                //登录成功后获取用户消息
                dispatch(fetchMessage());
            }
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchPhoneDynamicLogin(phone,code));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {
            phone: phone,
            code: code,
        });
    }
};
/**
 * 手机号动态登录的Action
 * @function phoneDynamicLoginAction
 * @param {json} response
 * @returns {object}
 */
let phoneDynamicLoginAction = (response)=> {
    return Object.assign({
        type: types.DYNAMIC_PHONE_LOGIN
    }, response)
};

/**
 * 退出登录
 * @function fetchLogout
 * @returns {function(*)}
 */
export let fetchLogout = () => {
    let URL = config.host + "user/logout";
    return dispatch => {
        Util.post(URL, (response) => {
            if (response && response.result) {
                dispatch(refreshList()); //清除当前用户的交易记录
                dispatch(logoutAction(response));
                db.save(key.ACCOUNT, {
                    phone: null,
                    password: null,
                }, 0);
                db.saveById(key.ACCOUNT, "token",{
                    token: null,
                }, 0);
                db.saveById(key.ACCOUNT, "wxId",{
                    wxUnionId: null
                }, 0);
                db.saveById(key.ACCOUNT, "phone",{
                    phone: null
                }, 0);
            }
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchLogout());
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            }
            else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {});
    }
};
/**
 * 退出登录的action
 * @function logoutAction
 * @param {json} response
 * @returns {*}
 */
let logoutAction = (response)=> {
    return Object.assign({
        type: types.LOGOUT
    }, response)
};

/**
 * 上传头像
 * @function fetchUploadPicture
 * @param {json} data
 * @returns {function(*)}
 */
export let fetchUploadPicture = (data)=> {
    let URL = config.host + "user/upload";
    return dispatch => {
        Util.postImg(URL, (response) => {
            dispatch(uploadPictureAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchUploadPicture(data));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            }
            else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, data);
    }
};
/**
 * 上传头像的action
 * @function uploadPictureAction
 * @param response
 * @returns {*}
 */
let uploadPictureAction = (response)=> {
    return Object.assign({
        type: types.UP_LOAD_PICTURE
    }, response)
};


/**************************************
 *          修改用户信息处理            *
 **************************************/
/**
 * 发送验证码
 * @function fetchSendSMS
 * @param phone 手机号
 * @returns {function(*)}
 */
export let fetchSendSMS = (phone)=> {
    let URL = config.host + "user/sms";
    return dispatch => {
        Util.post(URL, (response) => {
            if (response.result === 'success') {
                Util.toast('发送成功!');
                dispatch(sendSMSAction(response));
            }
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchSendSMS(phone));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined")
                Util.toast(error.detail.content);
            else
                Util.toast(error.toString());
            dispatch(addErrorAction(error));

        }, {
            phone: phone,
            password: '',
            code: '',
            name: ''
        });

    }
};
/**
 * 发送验证码的action
 * @function sendSMSAction
 * @param response
 * @returns {*}
 */

let sendSMSAction = (response)=> {
    return Object.assign(
        {type: types.SEND_SMS},
        response,
    )
};
/**
 * 修改手机号action
 * @function fetchModifyPhone
 * @param phone 手机号
 * @param new_phone 新手机号
 * @param identifyingCode 验证码
 * @returns {function(*)}
 */

export let fetchModifyPhone = (phone, new_phone, identifyingCode)=> {

    let URL = config.host + "user/modify/phone";
    return dispatch=> {
        Util.put(URL, (response)=> {
            if (response.result === 'success') {
                Util.toast('修改成功!');
                dispatch(modifyPhoneAction(response));
                dispatch(fetchLogout());
            }
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchModifyPhone(phone, new_phone, identifyingCode));
                        ++i
                    }, 1000)
                }
            }
            if (typeof error.detail.content !== "undefined") {
                Util.toast(error.detail.content);
            }
            else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
            dispatch(buttonAction("updatePhoneNumberButton"));
        }, {
            phone: phone,
            new_phone: new_phone,
            code: identifyingCode,
            password: '',
            new_password: ''
        })
    }
};
let modifyPhoneAction = (response)=> {
    return Object.assign(
        {type: types.PHONE_MODIFY},
        response,
    )
};

/**
 * 获取用户信息
 * @function fetchUserInfo
 * @returns {function(*=)}
 */

export let fetchUserInfo = ()=> {
    let URL = config.host + "user/getinfo";
    return dispatch => {
        Util.get(URL, (response) => {
            dispatch(userInfoAction(response));
            //获取用户信息的时候刷新又优惠券
            dispatch(refreshCouponList());
            db.saveById(key.ACCOUNT,"wxId",{
                wxUnionId: response.wxUnionId,
            }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)
        }, (error) => {

            dispatch(addErrorAction(error));

            if (error.message === "未知异常") {
                let i = 0;
                let wxUnionId = '';
                if (i < 3) {
                    setTimeout(() => {
                        fetchUserInfo();
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
        });
    }
};

let userInfoAction = (data)=> {
    return Object.assign({
        type: types.FETCH_USER_INFO
    }, data)
};

/**
 * 实名认证
 * @function fetchCertification
 * @param name 姓名
 * @param id_card 身份证号
 * @returns {function(*)}
 */
export let fetchCertification = (name, id_card) => {
    let URL = config.host + "user/certification";

    return (dispatch) => {
        Util.post(URL, (response) => {
            if (response.result === 'success') {
                dispatch(getCertificationAction(response));
                dispatch(fetchUserInfo());
                Util.toast('恭喜认证成功!');
            }

        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        fetchCertification(name, id_card);
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(buttonAction("certificationButton"));
            dispatch(addErrorAction(error));
        }, {realName: name, idCard: id_card})
    }
};

let getCertificationAction = (response) => {
    let temp = Object.assign(
        {type: types.CERTIFICATION},
        {response},
    );
    return temp
};

/**************************************
 *              自动登录                *
 **************************************/
/**
 * 自动登录
 * @function fetchAutoLogin
 * @param userTag 用户标识
 * @param token 自动登录令牌
 * @returns {function(*)}
 */
export let fetchAutoLogin = (userTag, token) => {
    let URL = config.host + "weixin/autoLogin";
    return (dispatch) => {
        Util.post(URL, (response) => {
            if (response.result === 'success') {
                dispatch(AutoLoginAction(response));
                db.saveById(key.ACCOUNT,"token",{
                    token: response.token,
                }, 1000 * 3600 * 24 * 15);//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)

                //登录成功后获取用户信息
                dispatch(fetchUserInfo());
                //登录成功后获取消息
                dispatch(fetchMessage());
            }
        }, (error) => {
            dispatch(addErrorAction(error));
        }, {userTag: userTag, token: token,})
    }
};

let AutoLoginAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_AUTO_LOGIN},
        {data},
    );
    return temp
};