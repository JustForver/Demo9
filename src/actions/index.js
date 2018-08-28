import * as newsAction from './mine/newsAction';
import * as mallAction from './mine/mallAction';
import * as weixinAction from './mine/weixinAction';
import * as lineAction from './line/lineAction';
import * as rentAction from './line/rentAction';
import * as messageAction from './mine/messageAction';
import * as userAction from './mine/userAction';

export default {
    ...newsAction,
    ...mallAction,
    ...rentAction,
    ...lineAction,
    ...weixinAction,
    ...userAction,
    ...messageAction
}