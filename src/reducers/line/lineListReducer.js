/**
 * @module LineListReducer
 */

import * as types from '../../actions/actionTypes'
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from "../../common/error"

/**
 * @type {json}
 * @property {boolean} isLoading                -是否加载
 * @property {boolean} networkError             -是否网络错误
 * @property {number} count                     -该专线线路的总条数
 * @property {DataSource} dataSource            -线路数据源
 * @property {array} data                    -原始数据列表
 * @property {number} page                      -当前页数
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 */
const initialState = {
    isLoading: false,
    networkError: false,
    count:0,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    data: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
};

/**
 * 线路的reducer
 * @function LineListReducer
 * @param {json} state  LineListReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let LineListReducer = (state = initialState, action) => {
    switch (action.type) {
        //获取社区路线
        case types.FETCH_LINE_LIST:
            state.data = state.data.concat(action.data.list);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.data),
                data: state.data,
                page: action.data.page,
                count:action.data.total,
                hasMore: action.data.total > action.data.page * config.limit,
                isLoading: false,
                networkError: false,
                isEmpty: !(action.data.list.length !== 0 || state.dataSource.getRowCount() !== 0),
            });
        //加载数据
        case types.LOADING_LINE_LIST:
            return Object.assign({}, state, {
                isLoading: true,
            });
        //刷新数据
        case types.REFRESH_LINE_LIST:
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
                    networkError: true
                })
            }
            return state;
        default:
            return state;
    }
};

export default LineListReducer;