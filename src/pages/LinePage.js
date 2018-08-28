import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import constants from '../common/constants'
import HeadPage from '../common/headImagePage'

import RentBus from './line/rentFirstPage'
import LineList from './line/lineListPage'

import db, {key} from "../common/db";

import {fetchLineTypeList,refreshPropLineList} from '../actions/line/lineAction';
import {fetchActivityTypeList} from '../actions/activityAction';

import {connect} from "react-redux";

class SelectActivity extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            type:'',
            loading:true
        };
        this.status = true;
        this.userTag = '';
    }
    componentWillMount(){

        //获取线路类型
        this.props.dispatch(fetchLineTypeList());
        //触发版本更新Action
        //actions.fetchVersionUpdate(Platform.OS);
        //获取活动类型
        this.props.dispatch(fetchActivityTypeList());
        //获取包车页面车辆信息
        //actions.fetchRentInfo();

        /*db.loadById(key.ACCOUNT, "wxId",(ret)=> {
                if (ret.wxUnionId !== null || ret.wxUnionId !== '') {
                    this.userTag = ret.wxUnionId;
                }
            }, (error)=> {

            }
        );
        db.loadById(key.ACCOUNT, "phone",(ret)=> {
                if (ret.phone !== null || ret.phone !== '') {
                    this.userTag = ret.phone;
                }
            }, (error)=> {

            }
        );
        db.loadById(key.ACCOUNT, "token",(ret)=> {
                if (ret.token !== null || ret.token !== '') {
                    actions.fetchAutoLogin(this.userTag, ret.token);
                }
            }, (error)=> {

            }
        );*/
    }

    componentDidUpdate(){
        const {LineReducer} = this.props;
        if(LineReducer.flag){
            this._onRefresh(LineReducer.list[0].typename);
            this.setState({loading:false});
            LineReducer.flag = false;
        }
    }

    //刷新
    _onRefresh(type) {
        const {LineReducer} = this.props;
        this.setState({type:type});
        if(LineReducer.list.length<1){
            this.props.dispatch(fetchLineTypeList())

        }
        this.props.dispatch(refreshPropLineList(type));
    }

    render() {
        //得到app当前的版本号,并转换成3位长度的数组,如["1", "0", "0"] 分别对应主版本号、次版本号、修订版
        //const nowVersion = packageVersion.split('.');
        //const minVersion = LineReducer.minimum_version ? LineReducer.minimum_version.split('.') : null; //得到最低要求的版本号,并转换成3位长度的数组
        //const newVersion = LineReducer.current_version ? LineReducer.current_version.split('.') : null; //得到最新要求的版本号,并转换成3位长度的数组
        //const offVersion = LineReducer.off_versions; //得到所有需要下线的版本号的数组
        //const updateUrls = LineReducer.update_urls ? LineReducer.update_urls[0].full_url : null;//得到最新版本的下载地址

        /*const ifMinVersion = ()=> { //当前版本号是否低于最低版本号
            if (nowVersion[0] < minVersion[0]) { //如果当前版本的主版本号小于最低要求版本的主版本号就返回true
                return true;
            } else if (nowVersion[0] === minVersion[0]) {
                if (nowVersion[1] < minVersion[1]) { //如果当前版本的次版本号小于最低要求版本的次版本号就返回true
                    return true;
                } else if (nowVersion[1] === minVersion[1]) {
                    if (nowVersion[2] < minVersion[2]) { //如果当前版本的修订版本号小于最低要求版本的修订版本号就返回true
                        return true;
                    } else if (nowVersion[2] === minVersion[2]) {
                        return false;
                    } else if (nowVersion[2] > minVersion[2]) {//如果当前版本的修订版本号大于最低要求版本的修订版本号就返回false
                        return false;
                    }
                } else if (nowVersion[1] > minVersion[1]) {//如果当前版本的次版本号大于最低要求版本的次版本号就返回false
                    return false;
                }
            } else if (nowVersion[0] > minVersion[0]) {//如果当前版本的主版本号大于最低要求版本的主版本号就返回false
                return false;
            }
        };*/
        /*const ifOffVersion = ()=> { //当前版本号是否是需要下线的版本
            for (let i = 0; i < offVersion.length; i++) {
                if (packageVersion === offVersion[i]) {
                    return true;
                }
            }
            return false; //for函数执行完成之后才会执行这句话。
        };
        const ifNewVersion = ()=> { //当前版本号是否大于等于最新版本号
            if (nowVersion[0] > newVersion[0]) { //如果当前版本的主版本号大于最新版本的主版本号就返回true
                return true;
            } else if (nowVersion[0] === newVersion[0]) {
                if (nowVersion[1] > newVersion[1]) { //如果当前版本的次版本号大于最新版本的次版本号就返回true
                    return true;
                } else if (nowVersion[1] === newVersion[1]) {
                    if (nowVersion[2] > newVersion[2]) { //如果当前版本的修订版本号大于最新版本的修订版本号就返回true
                        return true;
                    } else if (nowVersion[2] === newVersion[2]) {
                        return true;
                    } else if (nowVersion[2] < newVersion[2]) {//如果当前版本的修订版本号小于最新版本的修订版本号就返回false
                        return false;
                    }
                } else if (nowVersion[1] < newVersion[1]) {//如果当前版本的次版本号小于最新版本的次版本号就返回false
                    return false;
                }
            } else if (nowVersion[0] < newVersion[0]) {//如果当前版本的主版本号小于最新版本的主版本号就返回false
                return false;
            }
        };
        if (updateUrls && this.status) { //当请求成功时判断
            this.status = false;
            if (ifMinVersion() || ifOffVersion()) { //如果当前版本低于最低要求版本或者是要回退的版本
                //强制更新
                Alert.alert(
                    '',
                    '请更新您的APP',
                    [{
                        text: '确定', onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL(updateUrls);
                            } else {
                                WebIntent.open(updateUrls);
                            }
                        }
                    }]
                );
            } else if (ifNewVersion()) {
            } else {
                //提示更新
                Alert.alert(
                    '',
                    '检测到新版本',
                    [
                        {
                            text: '暂不更新', onPress: () => {
                            }
                        },
                        {
                            text: '立即更新', onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL(updateUrls);
                                } else {
                                    WebIntent.open(updateUrls);
                                }
                            }
                        }
                    ]
                );
            }
        }*/

        const {LineListReducer,LineReducer} = this.props;
        console.log(LineReducer.list);
        return (
            <View style={{flex:1,backgroundColor: '#f5f5f5'} }>
                <HeadPage/>
                <View style={{width: constants.window.width, backgroundColor: '#00c6ad'}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        iosbounces={false}
                    >
                        <View
                            style={{
                                height: 50,
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>

                            {LineReducer.list.map((list,i) => {
                                return (
                                    <TouchableOpacity key={i} activeOpacity={0.75} onPress={()=> {this._onRefresh(list.typename)}} >
                                        {(() => {
                                            if (this.state.type === list.typename) {
                                                return (
                                                    <View style={[styles.town, styles.border]}>
                                                        <Text
                                                            style={[styles.townName]}>{list.typename}</Text>
                                                    </View>
                                                )
                                            } else {
                                                return (
                                                    <View style={styles.town}>
                                                        <Text style={styles.townName}>{list.typename}</Text>
                                                    </View>
                                                )
                                            }
                                        })()}
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                    </ScrollView>
                </View>
                {(()=> {
                    // 城市选择滚动条的loading
                    if (this.state.loading) {
                        return (
                            <View style={{ height: 50, alignItems: 'center', justifyContent: 'center',marginTop:-50,backgroundColor: '#00c6ad'}}>
                                <ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color="#fff"
                                    {...this.props}
                                />
                            </View>
                        )
                    }
                })()}
                {(()=>{
                    if(this.state.type === '包车'){
                        return <RentBus {...this.props}/>
                    }else{
                        return <LineList type={this.state.type} loading = {this.state.loading} {...this.props}/>
                    }
                })()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    town: {
        backgroundColor: '#00c6ad',
        paddingTop: (Platform.OS === 'ios') ? 3 : 4,
        paddingBottom: (Platform.OS === 'ios') ? 3 : 4,
        paddingLeft: 11,
        paddingRight: 11,
        marginLeft: 11,
        marginRight: 11,
        marginTop:2,
        marginBottom:2
    },
    border: {
        backgroundColor: '#11d7be',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0.5,
            height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3
    },
    townName: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight:'normal',
    },
});


export default connect(
    (state) => ({
        LineListReducer:state.LineListReducer,
        LineReducer:state.LineReducer
    }),
)(SelectActivity)