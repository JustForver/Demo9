/**
 * @module lineAction
 */

import * as types from '../actionTypes';
import Util from '../../common/utils';
import config from "../../common/configuration"
import {addErrorAction} from "../errorAction";

/**************************************
 *           线路获取分类列表           *
 **************************************/

/**
 * 线路获取分类列表
 * @function fetchLineTypeList
 * @returns {function(*)}
 */

export let fetchLineTypeList = ()=> {
    let URL = config.host + "line/getLineSelectTypeList";
    return dispatch => {
        Util.get(URL, (response)=> {
            dispatch(lineTypeListAction(response));
            console.log(response)
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchLineTypeList());
                        ++i
                    }, 1000)
                }
            }
            Util.toast(error.toString());
            dispatch(addErrorAction(error));
        })
    }
};
/**
 * 分类列表的action
 * @function activityTypeListAction
 * @param data
 * @returns {*}
 */
let lineTypeListAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_LINE_TYPE},
        {data}
    );
    return temp
};


/**************************************
 *              线路类型列表            *
 **************************************/

/**
 * 根据专线属性加载线路数据
 * @function fetchPropLineList
 * @param {string} type 区间类型(学区线路\社区线路)
 * @param {number} page 页面
 * @returns {function(*)}
 */

export let fetchPropLineList = (type, page) => {
    let URL = config.host + "lineType/lineTypeList";
    return dispatch => {
        dispatch(loadingLineListAction());
        Util.get(URL, (response)=> {
            dispatch(propNewLineAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchPropLineList(type, page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {type: type, page: page, limit: config.limit})
    }
};
/**
 * 刷新专线属性线路数据
 * @function refreshPropLineList
 * @param {string} type 区间类型
 * @returns {function(*)}
 */

export let refreshPropLineList = (type) => {
    let URL = config.host + "lineType/lineTypeList";
    return dispatch => {
        dispatch(refreshLineListAction());
        dispatch(loadingLineListAction());
        Util.get(URL, (response) => {
            dispatch(propNewLineAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshPropLineList(type));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {type: type, page: 1, limit: config.limit})
    }
};
/**
 * 获取线路全部数据action
 * @function propNewLineAction
 * @param {json} data 将response赋值给data
 * @returns {object}
 */

export let propNewLineAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_LINE_LIST},
        {data},
    );
    return temp
};


/**
 * 加载线路列表
 * @function loadingLineListAction
 * @returns {object}
 */

export let loadingLineListAction = () => {
    return {
        type: types.LOADING_LINE_LIST
    }
};
/**
 * 刷新线路列表
 * @function refreshLineListAction
 * @returns {object}
 */

export let refreshLineListAction = () => {
    return {
        type: types.REFRESH_LINE_LIST
    }
};


/**************************************
 *              线路列表详情            *
 **************************************/

/**
 * 获取线路列表详情
 * @function fetchDetailLineList
 * @param {string} id 线路类型id
 * @param {number} page 页面
 * @returns {function(*)}
 */
export let fetchDetailLineList = (id, page) => {
    let URL = config.host + "line/typeLine";

    return dispatch => {
        dispatch(loadingDetailLineListAction());
        Util.get(URL, (response)=> {
            dispatch(detailLineListAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchDetailLineList(id, page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {lineTypeId: id, page: page, limit: config.limit})
    }
};
/**
 * 刷新线路列表详情
 * @function refreshDetailLineList
 * @param {string} id 线路类型id
 * @returns {function(*)}
 */

export let refreshDetailLineList = (id) => {
    let URL = config.host + "line/typeLine";
    return dispatch => {
        dispatch(refreshDetailLineListAction());
        dispatch(loadingDetailLineListAction());
        Util.get(URL, (response) => {
            dispatch(detailLineListAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshDetailLineList(id));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));//错误处理将会在errorReducer和各个页面的Reducer处理
        }, {lineTypeId: id, page: 1, limit: config.limit})
    }
};
/**
 * 获取线路列表详情action
 * @function detailLineListAction
 * @param {json} data 将response赋值给data
 * @returns {object}
 */

export let detailLineListAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_DETAIL_LINE_LIST},
        {data},
    );
    return temp
};
/**
 * 加载线路列表详情
 * @function loadingDetailLineListAction
 * @returns {object}
 */

export let loadingDetailLineListAction = () => {
    return {
        type: types.LOADING_DETAIL_LINE_LIST
    }
};
/**
 * 刷新线路列表详情
 * @function refreshDetailLineListAction
 * @returns {object}
 */

export let refreshDetailLineListAction = () => {
    return {
        type: types.REFRESH_DETAIL_LINE_LIST
    }
};

/**************************************
 *              获取版本信息            *
 **************************************/

/**
 * 版本更新
 * @function fetchVersionUpdate
 * @param {string} platform  平台ios|android
 * @returns {function(*)}
 */

export let fetchVersionUpdate = (platform) => {
    let URL = config.host + 'sys/version';
    return dispatch => {
        Util.get(URL, (response) => {
            dispatch(versionUpdate(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchVersionUpdate(platform));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
        }, {
            platform:platform,
            app:1
        });
    }
};
/**
 * 版本更新
 * @function versionUpdate
 * @param {object} response 应用版本信息
 * @returns {object}
 *
 */
let versionUpdate = (response)=> {
    return Object.assign({
        type: types.VERSION_UPDATE
    }, response)
};