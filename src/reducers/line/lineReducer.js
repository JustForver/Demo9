/**
 * @module lineReducer
 */

import * as types from '../../actions/actionTypes'
import {ListView}  from "react-native";
import {ERROR_TYPE} from "../../common/error";
import config from "../../common/configuration";

/**
 * @type {json}
 * @property {boolean} networkError             -是否网络错误
 * @property {array} list_stations              -站点列表
 * @property {DataSource} dataSource            -线路数据源
 * @property {array} data                       -原始数据列表
 * @property {number} page                      -当前页数
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 * @property {array} list                       -线路属性列表
 * @property {boolean} flag                     -线路属性列表是否加载完成(true为success,false为failure)
 */
const initialState = {
    isLoading: false,
    networkError: false,
    list_stations: [],
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    data: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
    list:[],
    flag:false
};
/**
 * 线路的reducer
 * @function lineReducer
 * @param {json} state  lineReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let lineReducer = (state = initialState, action) => {
    switch (action.type) {
        //获取路线
        case types.FETCH_DETAIL_LINE_LIST:
            state.data = state.data.concat(action.data.list);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.data),
                data: state.data,
                page: action.data.page,
                hasMore: action.data.total > action.data.page * config.limit,
                isLoading: false,
                networkError: false,
                isEmpty: !(action.data.list.length !== 0 || state.dataSource.getRowCount() !== 0),
            });
        //加载数据
        case types.LOADING_DETAIL_LINE_LIST:
            return Object.assign({}, state, {
                isLoading: true,
            });
        //刷新数据
        case types.REFRESH_DETAIL_LINE_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                data: [],
                page: 0,
                hasMore: false,
                isEmpty: true,
            });
        //网络错误
        case types.ADDERROR:
            if (action.error.name === ERROR_TYPE.NETWORK_ERROR) {
                return Object.assign({}, state, {
                    detailLoading: false,
                    networkError: true
                })
            }
            return state;
        //版本更新
        case types.VERSION_UPDATE:
            return  Object.assign({}, state, {...action});
        case types.FETCH_LINE_TYPE:
            action.data.content.push({typename:'包车'});
            return Object.assign({}, state, {
                list:action.data.content,
                flag:true
            });
        default:
            return state;
    }
};

export default lineReducer;