import * as types from '../actionTypes';
import Util from '../../common/utils';
import config from '../../common/configuration'

let i = 0;
//去服务器获取当前时间
export let fetchTime = ()=> {
    let URL = config.host + "terminal/time";
    return dispatch=> {
        Util.get(URL, (response) => {
            dispatch(refreshTimeAction(response));
        }, (error) => {
            if (i < 5) {
                setTimeout(() => {
                    dispatch(fetchTime());
                    ++i
                }, 500)
            } else {
                dispatch(refreshTimeAction({error: 'Network request failed'}));
            }
        }, {});
    }
};

let refreshTimeAction = (response)=> {
    return Object.assign({
        type: types.UP_TIME
    }, response)
};