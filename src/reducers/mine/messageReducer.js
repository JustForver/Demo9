/**
 * 消息的reducer
 * @module messageReducer
 */
import * as types from '../../actions/actionTypes';
import {ERROR_TYPE} from '../../common/error'
import db, {key} from '../../common/db'
/**
 * 消息
 * @type {json}
 * @property {boolean} isRefreshing             -是否刷新
 * @property {String}  message                  -消息数组
 */

const initialState = {
    message:[],
    flag : false,
    count:0
};

/**
 * 我的消息
 * @function messageReducer
 * @param {json} state  messageReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */

let messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.MY_MESSAGE:
            state.message = action.message;
            state.count = action.total_count;
            //取出上次存到db中的消息的条数
            db.loadById(key.ACCOUNT,'totalCount',(ret)=> {
                if(action.total_count > ret.totalCount){//条数有增加
                    state.flag = true
                }
            }, ()=> {  //第一次请求时,ret.totalCount不存在,会报错
                if(action.message.length > 0){
                    state.flag = true
                }
            });

            //将本次请求的条数存到db中
            db.saveById(key.ACCOUNT,'totalCount',{
                totalCount:action.total_count,
            }, 1000 * 3600 * 24 * 15 );//保存15天1000毫秒*3600秒*24小时*15天(60秒一分钟60分钟一小时一小时就是3600秒)

        default:
            return state
    }
};
export default messageReducer;