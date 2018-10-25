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
        //获取活动类型
        this.props.dispatch(fetchActivityTypeList());
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
