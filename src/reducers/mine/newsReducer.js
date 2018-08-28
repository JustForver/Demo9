'use strict';


/**
 * 新闻的reducer
 * @module newsReducer
 */
import * as types from '../../actions/actionTypes';
import config from '../../common/configuration'
import {ERROR_TYPE} from '../../common/error'
import {ListView} from 'react-native'

/**
 * 新闻
 * @type {json}
 * @property {boolean} detailLoading            -是否详情页加载
 * @property {boolean} networkError             -是否网络错误
 * @property {DataSource} dataSource            -新闻数据源
 * @property {array} rawData                    -原始数据列表
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 * @property {number} page                      -当前页数
 * @property {number} count                     -总条数
 */

const initialState = {
    isLoading: false,
    networkError: false,
    detailLoading: true,
    rawData: [],
    bannerList: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
    count: 0,
};

/**
 * 新闻
 * @function newsReducer
 * @param {json} state  newsReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */

let newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_NEWS_LIST:
            state.rawData = state.rawData.concat(action.data.news);
            return Object.assign({}, state, {
                rawData: state.rawData,
                page: action.data.page,
                count: action.data.total_count,
                hasMore: action.data.total_count > action.data.page * config.limit,
                networkError: false,
                isLoading: false,
                isEmpty: (action.data.news.length == 0 && action.data.page ==1 )
            });
        case types.LOADING_NEWS_LIST:
            return Object.assign({}, state, {
                isLoading: true
            });
        case types.REFRESH_NEWS_LIST:
            return Object.assign({}, state, {
                rawData: [],
                page: 0,
                hasMore: false,
                isEmpty: true
            });
        case types.RECEIVE_BANNER_LIST:
            return Object.assign({}, state, {
                bannerList: action.bannerList,
            });
        case types.ADDERROR:
            if (action.error.name === ERROR_TYPE.NETWORK_ERROR) {
                return Object.assign({}, state, {
                    networkError: true
                })
            }
            return state;
        case types.FETCH_NEWS_DETAIL:
            return Object.assign({}, state, action.data,{detailLoading:false});
        default:
            return state
    }
};

export default newsReducer;