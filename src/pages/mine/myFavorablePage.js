import React,{Component} from 'react'
import {
    View
} from 'react-native';

import Head from '../../common/head'
import ScrollableTabView,{DefaultTabBar,}from 'react-native-scrollable-tab-view'
import Coupon from '../../pages/mine/myFavorable/couponPage'
import PromotionCode from '../../pages/mine/myFavorable/promotionCodePage'

export default class MyFavorable extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor: '#f5f5f5'} }>
                <Head title="我的优惠" click={()=>{this.props.navigation.goBack()}}/>

                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar/>}
                    tabBarUnderlineStyle={{width:0.1,height:0.1}}
                    tabBarUnderlineColor='#00c6ad'
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor="#000"
                    tabBarInactiveTextColor="#999"
                    tabBarTextStyle={{fontSize:15,textAlign:'center'}}
                >
                    <PromotionCode tabLabel="兑换码" {...this.props}/>
                    <Coupon tabLabel="抵用券" {...this.props}/>

                </ScrollableTabView>


            </View>
        )
    }
}

