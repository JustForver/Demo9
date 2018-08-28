import {combineReducers} from 'redux'
import NewsReducer from './mine/newsReducer';
import UserReducer from './mine/userReducer';
import MallReducer from './mine/mallReducer';
import WeiXinReducer from './mine/weixinReducer';
import MyActivityReducer from './mine/myActivityReducer';
import CouponReducer from './mine/couponReducer';
import MessageReducer from './mine/messageReducer';
import MyTicketReducer from './mine/myTicketReducer';
import PromotionCodeReducer from './mine/promotionCodeReducer';

import LineReducer from './line/lineReducer';
import RentReducer from './line/rentReducer';
import LineListReducer from './line/lineListReducer';

import TicketReducer from './ticket/ticketReducer';

import ActivityReducer from './activityReducer'
import ErrorReducer from './errorReducer'

export default rootReducer = combineReducers({
    NewsReducer,
    UserReducer,
    MallReducer,
    LineReducer,
    LineListReducer,
    RentReducer,
    WeiXinReducer,
    MessageReducer,
    MyActivityReducer,
    CouponReducer,
    MyTicketReducer,
    PromotionCodeReducer,
    TicketReducer,
    ActivityReducer,
    ErrorReducer
});