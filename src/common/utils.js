
import Toast from '../components/toast/Toast';
import {ERROR_TYPE, UserError} from './error'
import config from '../common/configuration'


function padding(request){
    if(config.debug){
        console.info("%c"+request.url,"color:blue;font-weight:800")
    }
    if (request.status < 400) {
        return request.text()
    } else {
        throw new UserError(ERROR_TYPE.REQUEST_ERROR, '请求异常', request);
    }
}

function reslove(response,successCallback){
    if(config.debug){
        console.log(response)
    }
    try {
        let json = JSON.parse(response);
        switch (json.result) {
            case "success":
                successCallback(json);
                break;
            case "failure":
                throw new UserError(ERROR_TYPE.DATA_ERROR, '数据异常', json);
                break;
            case "error":
                throw new UserError(ERROR_TYPE.OTHER_ERROR, '未知异常', json);
                break;
            default:
                successCallback(json);
        }
    } catch (e) {
        throw e;
    }
}

function reject(err,failCallback){
    console.log(err);
    if (err.name && err.name == "TypeError"){
        let error = new UserError(ERROR_TYPE.NETWORK_ERROR, "网络异常", err);
        failCallback(error);
    }
    else if (err instanceof UserError){
        failCallback(err);
    }
    else{
        failCallback(new UserError(ERROR_TYPE.OTHER_ERROR, '未知异常', err));
    }
}

let Util = {
    /*
     * fetch简单封装
     * url: 请求的URL
     * successCallback: 请求成功回调
     * failCallback: 请求失败回调
     * */
    get: (url, successCallback, failCallback, data = {}) => {
        url += "?";
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                url += i + '=' + data[i] + "&";
            }
        }
        url = url.substr(0, url.length - 1);//去掉末尾多余的?或&符号美化url
        fetch(url, {
            method: "GET"
        })
        .then(padding)
        .then((response)=>{reslove(response,successCallback)})
        .catch((err)=>{reject(err,failCallback)});
    },
    post: (url, successCallback, failCallback, data = {})=> {
        fetch(url,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            .then(padding)
            .then((response)=>{reslove(response,successCallback)})
            .catch((err)=>{reject(err,failCallback)});
    },

    postAlipay:(url, successCallback, failCallback, data)=> {
        fetch(url,
            {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: data
            })
            .then(padding)
            .then((response)=>{reslove(response,successCallback)})
            .catch((err)=>{reject(err,failCallback)});
    },


    postImg: (url, successCallback, failCallback, data) => {
        let formdata = new FormData();

        formdata.append("file", {uri: data, name: 'image.jpg', type: 'multipart/form-data'});

        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formdata
        })
        .then(padding)
        .then((response)=>{reslove(response,successCallback)})
        .catch((err)=>{reject(err,failCallback)});
    },

    put: (url, successCallback, failCallback, data = {})=> {
        fetch(url, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(padding)
        .then((response)=>{reslove(response,successCallback)})
        .catch((err)=>{reject(err,failCallback)});
    },
    toast: (message)=> {
        Toast.show(message, {
            duration: Toast.durations.sort, // toast显示时长
            position: -80, // toast位置
            shadow: true, // toast是否出现阴影
            animatiosn: true, // toast显示/隐藏的时候是否需要使用动画过渡
            hideOnPress: true // 是否可以通过点击事件对toast进行隐藏
        });
    }
};

export default Util;