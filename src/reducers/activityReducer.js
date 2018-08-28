/**
 * 活动的reducer
 * @module activityReducer
 */


import * as types from '../actions/actionTypes';
import config from '../common/configuration'
import {ERROR_TYPE} from '../common/error'
import {ListView} from 'react-native'

/**
 * 活动
 * @type {json}
 * @property {boolean} detailLoading            -是否详情页加载
 * @property {boolean} networkError             -是否网络错误
 * @property {DataSource} dataSource            -活动数据源
 * @property {array} data                    -原始数据列表
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 * @property {number} page                      -当前页数
 * @property {number} count                     -总条数
 * @property {String} activityDetail            -活动详情内容初始值
 * @property {String} genre                     -活动类型初始值
 * @property {String} list                      -活动类型列表初始值
 */
const initialState = {
    isLoading: false,
    networkError: false,
    detailLoading: true,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    data: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
    count: 0,
    activityDetail:'',
    genre:'',
    list:[]
};

/**
 * 活动
 * @function activityReducer
 * @param {json} state  activityReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */

let activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_ACTIVITY_LIST:
            state.data = state.data.concat(action.data.activity);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.data),
                data: state.data,
                page: action.data.page,
                count: action.data.total_count,
                hasMore: action.data.total_count > action.data.page * 4,
                networkError: false,
                isLoading: false,
                isEmpty: !(action.data.activity.length !== 0 || state.dataSource.getRowCount() !== 0),
                genre:action.genre
            });
        case types.LOADING_ACTIVITY_LIST:
            return Object.assign({}, state, {
                isLoading: true
            });
        case types.REFRESH_ACTIVITY_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                data: [],
                page: 0,
                hasMore: false,
                isEmpty: true,
                genre:action.genre
            });
        case types.ADDERROR:
            if (action.error.name === ERROR_TYPE.NETWORK_ERROR) {
                return Object.assign({}, state, {
                    networkError: true
                })
            }
            return state;
        case types.FETCH_ACTIVITY_DETAIL:
            return Object.assign({}, state, action.data,{
                detailLoading:false,
                activityDetail:action.data.detail
            });
        case types.FETCH_ACTIVITY_TYPE:
            return Object.assign({}, state, action.data,{
                list:action.data.content
            });
        default:
            return state
    }
};

export default activityReducer;