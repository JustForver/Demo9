/**
 * Created by osx on 2017/7/11.
 */
import * as types from '../../actions/actionTypes';
import {ListView} from 'react-native'
import config from '../../common/configuration'
import {ERROR_TYPE} from '../../common/error'

const initialState = {
    networkError: false,
    isLoading: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    rawData: [],
    page:0,
    hasMore: false,
    isEmpty: true,
    count: 0,
    limit:10,
}

let promotionCodeReducer = (state = initialState, action)=> {
    switch (action.type) {
        case types.USE_CONVERSION:
            return  Object.assign({}, state, {});
        case types.FETCH_CONVERSION_LIST:
            state.rawData = state.rawData.concat(action.data.list);
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(state.rawData),
                rawData: state.rawData,
                page: action.data.page,
                count: action.data.total_count,
                isLoading: false,
                hasMore: action.data.total_count > action.data.page * config.limit,
                isEmpty: !(action.data.list.length != 0 || state.dataSource.getRowCount() != 0)
            });
        //加载包车列表
        case types.LOADING_CONVERSION_LIST:
            return Object.assign({}, state, {
                isLoading: true
            });
        //刷新包车列表
        case types.REFRESH_CONVERSION_LIST:
            return Object.assign({}, state, {
                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                rawData: [],
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
        default:
            return state;
    }
};
export default promotionCodeReducer;