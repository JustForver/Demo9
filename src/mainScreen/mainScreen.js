import React from 'react';
import {
    createBottomTabNavigator,
    createStackNavigator,
} from 'react-navigation';
import {Image, StyleSheet} from 'react-native';
import constants from "../common/constants";
import LinePage from '../pages/LinePage';
import TicketPage from '../pages/TicketPage';
import ActivityPage from '../pages/ActivityPage';
import MinePage from '../pages/MinePage';

import lineBasicPage from '../pages/line/lineBasicPage';
import lineListPage from '../pages/line/lineListPage';
import lineWebView from '../pages/line/lineWebView';
import newDetailPage from '../pages/line/newDetailPage';
import rentFirstPage from '../pages/line/rentFirstPage';

import activityDetailsPage from '../pages/activity/activityDetailsPage';
import selectActivityPage from '../pages/activity/selectActivityPage';
import webView from '../pages/activity/webView';

import moreInfoPage from "../pages/mine/moreInfoPage";
import aboutUsPage from "../pages/mine/moreInfo/aboutUsPage";
import agreementPage from "../pages/mine/moreInfo/agreementPage";

import helpPage from '../pages/mine/helpPage';
import chargingPilePage from '../pages/mine/chargingPilePage';
import myRecordPage from "../pages/mine/myRecordPage";
import myFavorablePage from "../pages/mine/myFavorablePage";
import messagePage from "../pages/mine/messagePage";

import newsPage from '../pages/mine/news/newsPage';
import newsDetailsPage from '../pages/mine/news/newsDetailsPage';

import mallPage from '../pages/mine/mall/mallPage';
import mallDetailPage from '../pages/mine/mall/mallDetailPage';
import orderPage from '../pages/mine/mall/orderPage';

import phoneLoginPage from '../pages/mine/login/phoneLoginPage';
import bindPhonePage from '../pages/mine/login/bindPhonePage';
import settingsPage from '../pages/mine/login/settingsPage';

const tabScreen = createBottomTabNavigator(
    {
        Line: {
            screen: LinePage,
            navigationOptions: {
                tabBarLabel: '线路',
                showLabel: false,       //跳转后隐藏底部标签栏
                tabBarIcon: ({focused}) => (
                    <Image source={focused ? require('../image/main/line5.png') : require('../image/main/line3.png')}
                           style={styles.footImage} resizeMode={'contain'}/>
                )
            }
        },
        Ticket: {
            screen: TicketPage,
            navigationOptions: {
                tabBarLabel: '车票',
                showLabel: false,
                tabBarIcon: ({focused}) => (
                    <Image
                        source={focused ? require('../image/main/ticket5.png') : require('../image/main/ticket3.png')}
                        style={styles.footImage} resizeMode={'contain'}/>
                )
            }
        },
        Activity: {
            screen: ActivityPage,
            navigationOptions: {
                tabBarLabel: '活动',
                showLabel: false,
                tabBarIcon: ({focused}) => (
                    <Image
                        source={focused ? require('../image/main/active_2.png') : require('../image/main/active.png')}
                        style={styles.footImage} resizeMode={'contain'}/>
                )
            }
        },
        Mine: {
            screen: MinePage,
            navigationOptions: {
                tabBarLabel: '我的',
                showLabel: false,
                tabBarIcon: ({focused}) => (
                    <Image source={focused ? require('../image/main/my5.png') : require('../image/main/my3.png')}
                           style={styles.footImage} resizeMode={'contain'}/>
                )
            }
        }
    },
    {
        tabBarOptions: {
            labelStyle: {
                alignItems: 'center',
                marginBottom: 5
            },
            activeTintColor: '#00c6ad',
            inactiveTintColor: 'gray',
        },
        backBehavior: false            //返回不回到默认路由
    }
);

const mainScreen = createStackNavigator({
        tab: {screen: tabScreen},
        lineBasic: {screen: lineBasicPage},
        lineList: {screen: lineListPage},
        lineWebView: {screen: lineWebView},
        newDetail: {screen: newDetailPage},
        rentFirst: {screen: rentFirstPage},
        activityDetail: {screen: activityDetailsPage},
        selectActivity: {screen: selectActivityPage},
        webView: {screen: webView},
        moreInfo: {screen: moreInfoPage},
        aboutUs: {screen: aboutUsPage},
        agreement: {screen: agreementPage},
        help: {screen: helpPage},
        chargingPile: {screen: chargingPilePage},
        news: {screen: newsPage},
        newsDetails: {screen: newsDetailsPage},
        mall: {screen: mallPage},
        mallDetail: {screen: mallDetailPage},
        order: {screen: orderPage},
        myRecord: {screen: myRecordPage},
        myFavorable: {screen: myFavorablePage},
        message: {screen: messagePage},
        phoneLogin: {screen: phoneLoginPage},
        bindPhone: {screen: bindPhonePage},
        setting: {screen: settingsPage},
    },
    {
        navigationOptions: {
            header: null
        }
    }
);

const styles = StyleSheet.create({
    footImage: {
        width: constants.window.width * 0.05,
        marginBottom: -3,
    }
});
export default mainScreen;