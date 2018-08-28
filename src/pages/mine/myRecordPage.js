/**
 * Created by osx on 2017/6/22.
 */
import React,{Component} from 'react'
import {
    View
} from 'react-native';

import Head from '../../common/head'
import ScrollableTabView,{DefaultTabBar,}from 'react-native-scrollable-tab-view'
import MyActivity from './myRecord/myActivityPage'
import MyTicket from './myRecord/myTicketPage'
import RentRecord from './myRecord/RentRecordPage'

export default class MyRecord extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
        <View style={{flex:1,backgroundColor: '#f5f5f5'} }>
            <Head title="我的订单" click={()=>{this.props.navigation.goBack()}}/>

                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar/>}
                    tabBarUnderlineStyle={{width:0.1,height:0.1}}
                    tabBarUnderlineColor='#00c6ad'
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor="#000"
                    tabBarInactiveTextColor="#999"
                    tabBarTextStyle={{fontSize:15,textAlign:'center'}}
                >
                    <MyTicket tabLabel="乘车记录" {...this.props}/>
                    <MyActivity tabLabel="活动记录" {...this.props}/>
                    <RentRecord tabLabel="包车记录" {...this.props}/>

                </ScrollableTabView>


        </View>
        )
    }
}

