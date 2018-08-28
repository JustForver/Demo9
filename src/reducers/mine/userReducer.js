/**
 * 用户的reducer
 * @module userReducer
 */

import * as types from '../../actions/actionTypes';
import {ERROR_TYPE} from "../../common/error"


/**
 * 用户Reducer初始状态
 * @property {number} id                    -用户id
 * @property {string} phoneNumber           -手机号
 * @property {boolean} firstLoading         -默认为true，拿到用户信息数据后变为false,显示vip时间用到
 * @property {boolean}  isLogin             -是否登录
 * @property {string}   mid                 -分隔手机号132****9986
 * @property {boolean} isJump               -是否跳转界面
 * @property {string} vip                   -用户vip
 * @property {string} time                  -用户vip到期时间
 * @property {number} userPoints            -用户积分
 * @property {array} record                 -签到记录
 * @property {boolean}  wxLogin             -是否微信登录
 * @property {boolean} isWxBind             -是否微信绑定
 * @property {boolean} isCertification      -是否实名认证
 * @property {string} unbounded             -微信绑定显示的初始值
 * @property {string} authentication        -实名认证显示的初始值
 * @property {string} recommend_phone       -邀请码（即手机号）
 */
const initialState = {
    id:0,
    firstLoading:true,
    isLogin: false,
    mid: '',
    phoneNumber: '',
    userPoints: null,
    record: [],
    isJump: false,
    vip:'',                                  //用户vip
    time:'',                              //vip到期时间
    photo:null,
    imageSource:null,
    isWxBind:false ,                         //是否微信绑定
    unbounded:'未绑定',
    isCertification:false ,                   //是否实名认证
    authentication:'未认证',
    recommend_phone:''      //邀请码（即手机号）
 };

/**
 * 预约
 * @function userReducer
 * @param {json} state  userReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let userReducer = (state = initialState, action)=> {
    switch (action.type) {
        //用户的登录
        case types.USER_LOGIN:
            if (action.result === 'success') {
                return Object.assign({}, state, {
                    isLogin: true,
                    isJump: true,
                    firstLoading:true,
                })
            } else {
                return Object.assign({}, state)
            }
        //用户绑定手机号登录
        case types.BIND_PHONE_LOGIN:
            if (action.result === 'success') {
                return Object.assign({}, state, {
                    isLogin: true,
                    isJump: true,
                    firstLoading:true,
                })
            } else {
                return Object.assign({}, state)
            }
        //手机号动态登录
        case types.DYNAMIC_PHONE_LOGIN:
            if (action.result === 'success') {
                return Object.assign({}, state, {
                    isLogin: true,
                    isJump: true,
                    firstLoading:true,
                })
            } else {
                return Object.assign({}, state)
            }
        //微信登录
        case types.FETCH_WX_LOGIN:
            if (action.result === 'success') {
                return Object.assign({}, state, {
                    isLogin: true,
                    isJump: true,
                    firstLoading:true,
                })
            } else {
                return Object.assign({}, state)
            }
        //用户上传头像
        case types.UP_LOAD_PICTURE:
            return Object.assign({}, state, {...action});
        //自动登录
        case types.FETCH_AUTO_LOGIN:
            if (action.data.result === 'success') {
                return Object.assign({}, state, {
                    isLogin: true,
                    isJump: true,
                    firstLoading:true,
                })
            } else {
                return Object.assign({}, state)
            }
        //获取用户信息
        case  types.FETCH_USER_INFO:
            return Object.assign({}, state, {
                id:action.id,
                mid: action.phone ? '****' :'',
                phoneNumber: action.phone,
                userPoints: action.points,
                vip:action.vip_type,
                time:action.expiry_date,
                firstLoading:false,
                photo:action.photo,
                isCertification:action.certification,
                authentication:action.certification ? '已认证':'未认证',  //通过用户认证状态确定authentication的值
                isWxBind:action.wxBind,
                unbounded:action.wxBind ? '已绑定':'未绑定',            //通过用户绑定状态确定unbounded的值
                recommend_phone:action.recommendPhone,
            });
        //短信验证
        case types.SEND_SMS:
            return Object.assign({}, state);
        //注销账号
        case types.LOGOUT:
            return Object.assign({}, state, {
                isLogin: false,
                ...action,
                mid: '',
                phoneNumber: '',
                userPoints: 0,
                vip:'',
                time:'',
                photo:null,
                imageSource:null,
                firstLoading:true
            });
        //修改手机号
        case types.PHONE_MODIFY:
            return (
                Object.assign({}, state, {
                    isJump: true
                })
            );
        //用户实名认证
        case types.CERTIFICATION:
            return Object.assign({}, state ,{
                isJump: true,
            });

        case types.ADDERROR:
            return Object.assign({}, state,{...action});

        case types.BUTTON:
            return Object.assign({}, state, action);

        default:
            return state
    }
};

export default userReducer;
