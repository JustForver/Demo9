/**
 *
 * 包车的reducer
 * @module rentReducer
 */

import * as types from '../../actions/actionTypes';
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from '../../common/error'
import Util from '../../common/utils'


/**
 * 包车Reducer初始状态
 * @property {number} activeIndex            -活跃的索引
 * @property {number} payMoney               -付钱
 * @property {DataSource} dataSource         -数据源
 * @property {array}  data                   -单行数据
 * @property {boolean} hasMore               -是否有更多数据(true代表有更多,false代表没有更多)
 * @property {boolean} isEmpty               -是否列表为空(true为空,false为不为空)
 * @property {number} page                   -当前页数
 * @property {number} count                  -总条数
 * @property {boolean} paySuccess            -是否支付成功
 * @property {array}  rentInfo               -车辆信息
 */
const initialState = {
    activeIndex:0,
    payMoney:0,
    isLoading: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    data: [],
    page:0,
    hasMore: false,
    isEmpty: true,
    count: 0,
    paySuccess:false,
    rentInfo:[],
};
/**
 * 包车
 * @function rentReducer
 * @param {json} state  rentReducer的初始状态
 * @param {json} action 更新的状态
 * @return {json}
 */
let rentReducer = (state = initialState, action)=> {
    switch (action.type) {
        case types.RENT_AFFIRM:
            return  Object.assign({}, state, {});
        case types.RENT_LIST:
            state.data = state.data.concat(action.data.list);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.data),
                data: state.data,
                page: action.data.page,
                count: action.data.total_count,
                isLoading: false,
                hasMore: action.data.total_count > action.data.page * config.limit,
                isEmpty: !(action.data.list.length != 0 || state.dataSource.getRowCount() != 0)
            });
            //加载包车列表
        case types.LOADING_RENT_LIST:
            return Object.assign({}, state, {
                isLoading: true
            });
            //刷新包车列表
        case types.REFRESH_RENT_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                data: [],
                page: 0,
                hasMore: false,
                isEmpty: true
            });
            //地址错误
        case types.ADDERROR:
            if(action.error.name === ERROR_TYPE.NETWORK_ERROR){
                return Object.assign({}, state, {
                    networkError:true
                })
            }
            return state;
            //支付成功
        case types.RENT_PAY_SUCCESS:
            return Object.assign({}, state, {
                paySuccess: true
            });
            //获取包车信息
        case types.FETCH_RENT_INFO:
            return Object.assign({},state,{
                rentInfo: action.data.content
            });
        default:
            return state;
    }
};
export default rentReducer;