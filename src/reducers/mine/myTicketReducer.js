/**
 * 我的车票的reducer
 * @module myTicketReducer
 */
import * as types from '../../actions/actionTypes';
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from '../../common/error'

/**
 * 我的界面,我的车票界面更新更新state
 * @type {json}
 * @property {boolean} detailLoading            -是否详情页加载
 * @property {boolean} networkError             -是否网络错误
 * @property {DataSource} dataSource            -线路数据源
 * @property {array} rawData                    -原始数据列表
 * @property {boolean} hasMore                  -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty                  -是否列表为空(true为空,false为不为空)
 * @property {number} page                      -当前页数
 * @property {number} count                     -总页数
 */
const initialState = {
    networkError: false,
    isLoading:false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    rawData: [],
    page: 0,
    hasMore: false,
    isEmpty: true,
    count: 0
};
/**
 * 我的车票
 * @function myTicketReducer
 * @param {json} state  myTicketReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let myTicketReducer = (state = initialState, action)=> {
    switch (action.type) {
        case types.LOADING_MYTICKET_LIST:
            return Object.assign({},state,{
                isLoading:true
            });
        //获取车票列表数据
        case types.FETCH_TICKET_LIST:
            state.rawData = state.rawData.concat(action.data.tickets);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.rawData),
                rawData: state.rawData,
                page: action.data.page,
                count: action.data.total_count,
                hasMore: action.data.total_count > action.data.page * config.limit,
                networkError: false,
                isLoading:false,
                isEmpty: !(action.data.tickets.length != 0 || state.dataSource.getRowCount() != 0)
            });
        case types.REFRESH_TICKET_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                rawData: [],
                page: 0,
                hasMore: false,
                isEmpty: true
            });
        case types.ADDERROR:
            if(action.error.name === ERROR_TYPE.NETWORK_ERROR){
                return Object.assign({}, state, {
                    networkError:true
                })
            }
            return state;
        case types.LOGOUT:
            return Object.assign({}, state, {
                networkError: false,
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                rawData: [],
                page: 0,
                hasMore: true,
                isEmpty: true,
                count: 0
            });
        default:
            return state
    }
};

export default myTicketReducer;

