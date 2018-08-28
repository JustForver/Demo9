/**************************************
 *            刷新与加载              *
 **************************************/
export const LOADING = 'LOADING';     //加载
export const REFRESH = 'REFRESH';     //刷新

/**************************************
 *            站点界面处理              *
 **************************************/
export const FETCH_ADVERT ='FETCH_ADVERT';                          //获取广告
export const FETCH_RED_ENVELOPE ='FETCH_RED_ENVELOPE';              //红包


/**************************************
 *              用户操作               *
 **************************************/
export const USER_LOGIN = 'USER_LOGIN';     //用户登录action
export const BIND_PHONE_LOGIN = 'BIND_PHONE_LOGIN';     //用户绑定手机号登录action
export const UP_LOAD_PICTURE = 'UP_LOAD_PICTURE';   //用户上传头像action
export const LOGOUT = 'LOGOUT';     //用户注销action
export const FETCH_USER_INFO = 'FETCH_USER_INFO';   // 获取用户信息(获取积分和手机号)
export const CERTIFICATION = 'CERTIFICATION';       //实名认证
export const DYNAMIC_PHONE_LOGIN = 'DYNAMIC_PHONE_LOGIN';     //手机号动态登录


/**************************************
 *             微信处理            *
 **************************************/

export const FETCH_WX_LOGIN = 'FETCH_WX_LOGIN';     //微信登录
export const FETCH_WX_PAY = 'FETCH_WX_PAY';         //微信支付
export const FETCH_WX_BIND_PHONE = 'FETCH_WX_BIND_PHONE';        //微信绑定手机号
export const FETCH_AUTO_LOGIN = 'FETCH_AUTO_LOGIN';        //自动登录


/**************************************
 *              我的车票处理            *
 **************************************/
export const FETCH_TICKET_LIST = 'FETCH_TICKET_LIST';   //我的车票action
export const REFRESH_TICKET_LIST = 'REFRESH_TICKET_LIST';   //我的车票下拉刷新action
export const LOADING_MYTICKET_LIST = 'LOADING_MYTICKET_LIST';     //我的车票加载中


/**************************************
 *              我的物品处理            *
 **************************************/
export const ORDER_LIST = 'ORDER_LIST';     //我的界面我的物品action


/**************************************
 *            商城界面处理              *
 **************************************/
export const FETCH_MALL_LIST = 'FETCH_MALL_LIST';     //商城界面action
export const REFRESH_MALL_LIST = 'REFRESH_MALL_LIST';   //商城下拉刷新action
export const LOADING_MALL_LIST = 'LOADING_MALL_LIST';     //商城加载中
export const FETCH_MALL_DETAIL = 'FETCH_MALL_DETAIL';     //获取商品详情



/**************************************
 *            新闻界面处理              *
 **************************************/
export const FETCH_NEWS_LIST='FETCH_NEWS_LIST'  ;//新闻界面action
export const REFRESH_NEWS_LIST='REFRESH_NEWS_LIST'; //新闻下拉刷新action
export const LOADING_NEWS_LIST='LOADING_NEWS_LIST'; //新闻加载中
export const FETCH_NEWS_DETAIL = 'FETCH_NEWS_DETAIL';//新闻详情
export const RECEIVE_BANNER_LIST = 'RECEIVE_BANNER_LIST'; //请求轮播图数据



/**************************************
 *            活动中心界面处理              *
 **************************************/
export const FETCH_ACTIVITY_LIST='FETCH_ACTIVITY_LIST';     //活动中心界面
export const REFRESH_ACTIVITY_LIST='REFRESH_ACTIVITY_LIST'; //活动列表下拉刷新action
export const LOADING_ACTIVITY_LIST='LOADING_ACTIVITY_LIST'; //活动加载中
export const FETCH_ACTIVITY_DETAIL='FETCH_ACTIVITY_DETAIL'; //活动详情界面
export const MY_ACTIVITY_LIST='MY_ACTIVITY_LIST';           //我的活动
export const FETCH_ACTIVITY_LD='FETCH_ACTIVITY_LD';           //首页参加活动
export const FETCH_ACTIVITY_TYPE='FETCH_ACTIVITY_TYPE';           //活动类型


/**************************************
 *             手机号处理              *
 **************************************/
export const PHONE_MODIFY = 'PHONE_MODIFY';     //手机验证、修改手机号
export const SEND_SMS = 'SEND_SMS';         //发送短信


/**************************************
 *              线路详情列表处理            *
 **************************************/
export const FETCH_DETAIL_LINE_LIST = 'FETCH_DETAIL_LINE_LIST';               //线路详情列表
export const REFRESH_DETAIL_LINE_LIST = 'REFRESH_DETAIL_LINE_LIST';                    //线路详情列表下拉刷新
export const LOADING_DETAIL_LINE_LIST = 'LOADING_DETAIL_LINE_LIST';                   //线路详情列表上拉加载


/**************************************
 *             线路列表处理            *
 **************************************/
export const FETCH_LINE_LIST ='FETCH_LINE_LIST';               //线路列表
export const REFRESH_LINE_LIST = 'REFRESH_LINE_LIST';          //线路列表下拉刷新
export const LOADING_LINE_LIST = 'LOADING_LINE_LIST';         //线路列表上拉加载
export const FETCH_LINE_TYPE = 'FETCH_LINE_TYPE';           //活动类型

/**************************************
 *          车票界面二维码处理           *
 **************************************/
export const UP_TIME = 'UP_TIME';       //车票界面生成二维码获取服务器时间

/**************************************
 *              app版本更新            *
 **************************************/
export const VERSION_UPDATE = 'VERSION_UPDATE'; // app版本更新

/**************************************
 *              错误处理               *
 **************************************/
export const ADDERROR = 'ADDERROR';//添加错误
export const REMOVEERROR = 'REMOVEERROR';//移除错误

/**************************************
 *              帮助与反馈             *
 **************************************/

export const HELP_FEEDBACK = 'HELP_FEEDBACK';   //帮助与反馈

/**************************************
 *              我的消息             *
 **************************************/

export const MY_MESSAGE = 'MY_MESSAGE';           //我的消息


/**************************************
 *           提交按钮的状态        *
 **************************************/
export const BUTTON ='BUTTON';

/**************************************
 *                 包车               *
 **************************************/
export const RENT_AFFIRM='RENT_AFFIRM';
export const RENT_LIST='RENT_LIST';
export const REFRESH_RENT_LIST='REFRESH_RENT_LIST';
export const LOADING_RENT_LIST='LOADING_RENT_LIST';
export const RENT_PAY_SUCCESS='RENT_PAY_SUCCESS';
export const FETCH_RENT_INFO='FETCH_RENT_INFO';


/**************************************
 *          优惠券        *
 **************************************/
export const FETCH_COUPON_LIST='FETCH_COUPON_LIST';
export const LOADING_COUPON_LIST='LOADING_COUPON_LIST';
export const REFRESH_COUPON_LIST='REFRESH_COUPON_LIST';


/**************************************
 *          兑换码        *
 **************************************/
export const USE_CONVERSION='USE_CONVERSION';
export const FETCH_CONVERSION_LIST='FETCH_CONVERSION_LIST';
export const REFRESH_CONVERSION_LIST='REFRESH_CONVERSION_LIST';
export const LOADING_CONVERSION_LIST='LOADING_CONVERSION_LIST';



