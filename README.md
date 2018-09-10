# Demo9 
下载后直接react-native run-ios或者android就可以运行。  
app简要说明:  
-手机登录部分没有连接到短信服务，所以只有页面，无实际功能；  
-"路线"部分：包车模块需要登录，其余线路页面都能完美显示；  
-"车票"部分：需要登录方能显示，此处在learn中也单独写了一个生成二维码的小demo（二维码输出为扫码瞬间的时间戳）；  
-"活动"部分：页面显示均正常，支付处没有appid，所以未实现支付功能（项目中的支付功能和微信登录功能均由公司前辈所写）；  
-"我的"部分：登录、我的消息、我的订单、我的优惠及邀请好友五个模块需要登录，有登录后的页面（若需要查看，可以更改userReducer中的初始state中的isLogin改为true，id改为不为零的整数，userPoints改为不为零的整数，此时便能查看车票的二维码和需要登录的模块的页面展示和功能），其他页面功能均已实现。  
1.底部导航栏使用第三方react-navigation组件中的{createBottomTabNavigator}实现，页面导航由{createStackNavigator}实现；  
2.路线模块中的专线由ScrollView实现x轴滑动，数据通过fetch获取后端接口并将数据更新到state中，再由map将数据遍历显示出来；其中的线路由state中的数据源绑定到ListView中的dataSource中实现；  
3.车票模块的二维码由QRCode实现（此模块为公司前辈所写，本人只会简单的使用）；  
4.活动模块和路线模块大致相同，实现模式大同小异； 
5.我的模块的功能选项由ScrollView+TouchableHighlight实现最基本的页面显示，需要登录的部分由state中的isLogin控制；  
6.页面导航均由this.props.navigation.navigate('your page name')或this.props.navigation.navigate('your page name'，{state:state})控制跳转。 


