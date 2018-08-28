/**
 * 优惠券的reducer
 * @module couponReducer
 */
import * as types from '../../actions/actionTypes'
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from "../../common/error"

/**
 * 优惠券
 * @type {json}
 * @property {boolean} networkError             -是否网络错误
 * @property {DataSource} dataSource            -线路数据源
 * @property {array} rawData                    -原始数据列表
 * @property {number} page                      -当前页数
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 * @property {boolean} isLoading                -是否加载(true为空,false为不为空)
 */

const initialState = {
    networkError: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    rawData: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
    isLoading: false,
    count:0,
};

/**
 * 预约线路车票的reducer
 * @function lineTicketReducer
 * @param {json} state  lineTicketReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let couponReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_COUPON_LIST:
            state.rawData = state.rawData.concat(action.data.list);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.rawData),
                rawData: state.rawData,
                page: action.data.page,
                count:action.data.total,
                hasMore: action.data.total > action.data.page * 5,
                isLoading: false,
                networkError: false,
                isEmpty: !(action.data.list.length != 0 || state.dataSource.getRowCount() != 0),
            });

        //加载数据
        case types.LOADING_COUPON_LIST:
            return Object.assign({}, state, {
                isLoading: true,
            });
        //刷新数据
        case types.REFRESH_COUPON_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                rawData: [],
                page: 0,
                hasMore: false,
                isEmpty: true,
            });
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

export default couponReducer;