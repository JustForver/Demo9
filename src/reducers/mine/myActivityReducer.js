/**
 * 我的活动的reducer
 * @module myActivityReducer
 */
import * as types from '../../actions/actionTypes';
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from '../../common/error'

/**
 * 我的界面,我的活动界面更新更新state
 * @type {json}
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
 * 我的活动界面Reducer
 * @function myActivityReducer
 * @param {json} state  myActivityReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let myActivityReducer = (state = initialState, action)=> {
    switch (action.type) {
        case types.LOADING:
            return Object.assign({},state,{
                isLoading:true
            });
        //获取车票列表数据
        case types.MY_ACTIVITY_LIST:
            state.rawData = state.rawData.concat(action.data.activity);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.rawData),
                rawData: state.rawData,
                page: action.data.page,
                count: action.data.total_count,
                hasMore: action.data.total_count > action.data.page * config.limit,
                networkError: false,
                isLoading:false,
                isEmpty: !(action.data.activity.length != 0 || state.dataSource.getRowCount() != 0)
            });
        case types.REFRESH:
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

export default myActivityReducer;

