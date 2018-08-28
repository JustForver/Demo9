import * as types from '../actionTypes'
import config from '../../common/configuration'
import Util from '../../common/utils'
import {addErrorAction} from '../errorAction'

/**
 * 请求轮播数据
 * @function fetchBanners
 * @returns {function(*)}
 */
export let fetchBanners = ()=> {
    let URL = config.host + "news/list/allCarousel";

    return dispatch => {
        return Util.get(URL, (response) => {
            dispatch(receiveBannerList(response.newsItems))
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(fetchBanners());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(receiveBannerList([]));
        });
    }
};

let receiveBannerList = (bannerList) => {
    return {
        type: types.RECEIVE_BANNER_LIST,
        bannerList: bannerList,
    }
};

/**
 * 刷新新闻列表数据
 * @function refreshNewsList
 * @returns {function(*)}
 */

export let refreshNewsList = ()=> {
    let URL = config.host + "news/list/all";
    return dispatch => {
        dispatch(refreshListAction());
        dispatch(loadingListAction());
        Util.get(URL, (response) => {
            dispatch(newsListAction(response));
        }, (error) => {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(refreshNewsList());
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error)); //错误处理将会在errorReducer和各个页面的Reducer处理
        }, {page: 1, limit: config.limit});
    }
};

//加载新闻列表数据
export let loadNewsList = (page)=> {
    let URL = config.host + "news/list/all";
    return dispatch => {
        dispatch(loadingListAction());
        Util.get(URL, (response)=> {
            dispatch(newsListAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(loadNewsList(page));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {page: page, limit: config.limit})
    }
};

let newsListAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_NEWS_LIST},
        {data}
    );
    return temp
};

/**
 * 加载新闻详情数据
 * @function newsDetailList
 * @param id
 * @returns {function(*)}
 */

export let newsDetailList = (id)=> {
    let URL = config.host + "news/detail";
    return dispatch => {
        Util.get(URL, (response)=> {
            dispatch(newsDetailAction(response));
        }, (error)=> {
            if (error.message === "未知异常") {
                let i = 0;
                if (i < 3) {
                    setTimeout(() => {
                        dispatch(newsDetailList(id));
                        ++i
                    }, 1000)
                }
            } else {
                Util.toast(error.toString());
            }
            dispatch(addErrorAction(error));
        }, {id: id})
    }
};
/**
 * 加载新闻数据的action
 * @param data
 * @returns {*}
 */
let newsDetailAction = (data) => {
    let temp = Object.assign(
        {type: types.FETCH_NEWS_DETAIL},
        {data}
    );
    return temp
};
/**
 * 刷新活动列表
 * @function refreshListAction
 * @returns {{type}}
 */
export let refreshListAction = ()=> {
    return {
        type: types.REFRESH_NEWS_LIST
    }
};

let loadingListAction = ()=> {
    return {type: types.LOADING_NEWS_LIST}
};