import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    Modal,
    TouchableOpacity,
} from 'react-native';

import constants from "../../common/constants";
import Fumi from "../../components/textInput/Fumi"
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

import Util from '../../common/utils'
import config from '../../common/configuration'
import AwesomeButton from "../../components/button/awesomeBotton";
import {connect} from "react-redux";

class FirstStep extends Component {
    /**
     * 构造器
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            name: "",
            begin: "",
            end: "",
            number: 1,//租车数量
            car: "",
            swiper: false,
            isModal0: false,
            isModal1: false,
            isModal2: false,
            isModal3: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({swiper: true})
        }, 0)
    }

    /**
     * 车型选择
     * @param carId
     */
    carCheck(carId) {
        switch (carId) {
            case 0:
                this.state.car = "14座D11";
                break;
            case 1:
                this.state.car = "17座D12";
                break;
            case 2:
                this.state.car = "49座NJL6118BEV";
                break;
            case 3:
                this.state.car = "旅游车";
                break;
        }
    }

    /*_login(){
        WechatAPI.isWXAppInstalled()
        .then((isInstalled) => {
            if(isInstalled){
                getNavigator().push({
                    component: MyLogin,
                    props: Object.assign({}, this.props)
                })
            }else {
                getNavigator().push({
                    component: PhoneLogin,
                    props: {...this.props}
                })
            }
        });
    }*/

    /**
     * 跳转到软件服务及购票协议界面
     * @function
     */
    click() {
        this.props.navigation.navigate('agreement');
        /*getNavigator().push({
            component: Agreement,
            props: {...this.props}
        })*/
    }

    _next() {
        if (this.state.begin === "" || this.state.end === "") {
            Util.toast("请输入完整信息!");
        } else {
            const {RentReducer} = this.props;
            this.carCheck(RentReducer.activeIndex);
            this.props.navigation.navigate('rentNext', {
                begin: this.state.begin,
                end: this.state.end,
                car: this.state.car,
                number: this.state.number,
            });
            /* getNavigator().push({
                 component: RentNext,
                 params: {
                     begin:this.state.begin,
                     end: this.state.end,
                     car:this.state.car,
                     number:this.state.number,
                 }
             })*/
        }
    }

    carDetail() {
        this.setState({isModal: true});
        const {RentReducer} = this.props;
        switch (RentReducer.activeIndex) {
            case 0:
                this.setState({isModal0: true});
                break;
            case 1:
                this.setState({isModal1: true});
                break;
            case 2:
                this.setState({isModal2: true});
                break;
            case 3:
                this.setState({isModal3: true});
                break;
        }
        // alert(RentReducer.activeIndex);
    }

    renderImg() {
        const {RentReducer} = this.props;
        let imageViews = [];
        let image;
        let car;
        let passenger;
        let price30;
        let price80;
        let price120;
        let text;
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    image = {uri: config.host2 + '/image/' + RentReducer.rentInfo[0].img};
                    car = "D11";
                    passenger = 13;
                    price80 = RentReducer.rentInfo[0].kmPrice80;
                    price120 = RentReducer.rentInfo[0].kmPrice120;
                    text = (
                        <View style={styles.swiperText}>
                            <Text style={{flexDirection: 'row'}}>南京金龙<Text style={{
                                fontSize: constants.window.width * 0.06,
                                color: '#F0A000'
                            }}>￥{price80 - 50}</Text></Text>
                            <Text style={{
                                color: "#797979",
                                fontSize: constants.window.width * 0.045
                            }}>可乘坐{passenger}人</Text>
                            <Modal
                                animationType='slide'           // 从底部滑入
                                transparent={true}
                                visible={this.state.isModal0}    // 根据isModal决定是否显示
                                onRequestClose={() => {
                                    this.onRequestClose()
                                }}  // android必须实现
                            >
                                <View style={styles.modalViewStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            {
                                                this.setState({
                                                    isModal0: false
                                                })
                                            }
                                        }}
                                    >
                                        <View style={{
                                            height: constants.window.height * 0.58,
                                            width: constants.window.width * 0.77,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            margin: constants.window.width * 0.005,
                                            alignItems: 'center',
                                        }}>
                                            <Image source={image} style={{
                                                width: constants.window.width * 0.6,
                                                height: constants.window.height * 0.3 * 0.7 * 0.75,
                                                marginTop: constants.window.width * 0.05
                                            }}
                                                   resizeMode="contain"/>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: constants.window.width * 0.045,
                                                    marginTop: constants.window.width * 0.04,
                                                    fontWeight: 'bold',
                                                }}>南京金龙{car}</Text>
                                                <Text style={{
                                                    color: "#595959",
                                                    fontSize: constants.window.width * 0.037,
                                                    marginTop: constants.window.width * 0.01
                                                }}>可乘坐{passenger}人</Text>
                                                <Text style={{
                                                    color: "#ff0000",
                                                    fontSize: constants.window.width * 0.035,
                                                    marginTop: constants.window.width * 0.01
                                                }}>里程超出面议，价格当日有效</Text>
                                                <View style={{flex: 1, backgroundColor: '#000'}}/>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{height: 0.5, width: constants.window.width * 0.77}}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>首次租用立减</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥50</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>80公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥{price80}</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    marginBottom: constants.window.width * 0.21 + constants.window.width * 0.15,
                                                    alignSelf: 'flex-start',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        marginTop: constants.window.width * 0.029,
                                                        marginLeft: constants.window.width * 0.04,
                                                        fontWeight: 'normal'
                                                    }}>120公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000',
                                                    marginRight: constants.window.width * 0.026,
                                                    marginTop: constants.window.width * 0.026
                                                }}>￥{price120}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>
                    );
                    break;
                case 1:
                    image = {uri: config.host2 + '/image/' + RentReducer.rentInfo[1].img};
                    car = "D12";
                    passenger = 16;
                    price80 = RentReducer.rentInfo[1].kmPrice80;
                    price120 = RentReducer.rentInfo[1].kmPrice120;
                    text = (
                        <View style={styles.swiperText}>
                            <Text style={{flexDirection: 'row'}}>南京金龙<Text style={{
                                fontSize: constants.window.width * 0.06,
                                color: '#F0A000'
                            }}>￥{price80 - 50}</Text></Text>
                            <Text style={{
                                color: "#797979",
                                fontSize: constants.window.width * 0.045
                            }}>可乘坐{passenger}人</Text>
                            <Modal
                                animationType='slide'           // 从底部滑入
                                transparent={true}
                                visible={this.state.isModal1}    // 根据isModal决定是否显示
                                onRequestClose={() => {
                                    this.onRequestClose()
                                }}  // android必须实现
                            >
                                <View style={styles.modalViewStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            {
                                                this.setState({
                                                    isModal1: false
                                                })
                                            }
                                        }}
                                    >
                                        <View style={{
                                            height: constants.window.height * 0.58,
                                            width: constants.window.width * 0.77,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            margin: constants.window.width * 0.005,
                                            alignItems: 'center',
                                        }}>
                                            <Image source={image} style={{
                                                width: constants.window.width * 0.6,
                                                height: constants.window.height * 0.3 * 0.7 * 0.75,
                                                marginTop: constants.window.width * 0.05
                                            }}
                                                   resizeMode="contain"/>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: constants.window.width * 0.045,
                                                    marginTop: constants.window.width * 0.04,
                                                    fontWeight: 'bold',
                                                }}>南京金龙{car}</Text>
                                                <Text style={{
                                                    color: "#595959",
                                                    fontSize: constants.window.width * 0.037,
                                                    marginTop: constants.window.width * 0.01
                                                }}>可乘坐{passenger}人</Text>
                                                <Text style={{
                                                    color: "#ff0000",
                                                    fontSize: constants.window.width * 0.035,
                                                    marginTop: constants.window.width * 0.01
                                                }}>里程超出面议，价格当日有效</Text>
                                                <View style={{flex: 1, backgroundColor: '#000'}}/>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{height: 0.5, width: constants.window.width * 0.77}}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>首次租用立减</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥50</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>80公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥{price80}</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    marginBottom: constants.window.width * 0.21 + constants.window.width * 0.15,
                                                    alignSelf: 'flex-start',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        marginTop: constants.window.width * 0.029,
                                                        marginLeft: constants.window.width * 0.04,
                                                        fontWeight: 'normal'
                                                    }}>120公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000',
                                                    marginRight: constants.window.width * 0.026,
                                                    marginTop: constants.window.width * 0.026
                                                }}>￥{price120}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>);
                    break;
                case 2:
                    image = {uri: config.host2 + '/image/' + RentReducer.rentInfo[2].img};
                    car = "NJL6118BEV";
                    passenger = 49;
                    price30 = RentReducer.rentInfo[2].kmPrice30;
                    price80 = RentReducer.rentInfo[2].kmPrice80;
                    price120 = RentReducer.rentInfo[2].kmPrice120;
                    text = (
                        <View style={styles.swiperText}>
                            <Text style={{flexDirection: 'row'}}>南京金龙<Text style={{
                                fontSize: constants.window.width * 0.06,
                                color: '#F0A000'
                            }}>￥{price80 - 50}</Text></Text>
                            <Text style={{
                                color: "#797979",
                                fontSize: constants.window.width * 0.045
                            }}>可乘坐{passenger}人</Text>
                            <Modal
                                animationType='slide'           // 从底部滑入
                                transparent={true}
                                visible={this.state.isModal2}    // 根据isModal决定是否显示
                                onRequestClose={() => {
                                    this.onRequestClose()
                                }}  // android必须实现
                            >
                                <View style={styles.modalViewStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            {
                                                this.setState({
                                                    isModal2: false
                                                })
                                            }
                                        }}
                                    >
                                        <View style={{
                                            height: constants.window.height * 0.65,
                                            width: constants.window.width * 0.77,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            margin: constants.window.width * 0.005,
                                            alignItems: 'center',
                                        }}>
                                            <Image source={image} style={{
                                                width: constants.window.width * 0.6,
                                                height: constants.window.height * 0.3 * 0.7 * 0.75,
                                                marginTop: constants.window.width * 0.05
                                            }}
                                                   resizeMode="contain"/>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: constants.window.width * 0.045,
                                                    marginTop: constants.window.width * 0.04,
                                                    fontWeight: 'bold',
                                                }}>南京金龙{car}</Text>
                                                <Text style={{
                                                    color: "#595959",
                                                    fontSize: constants.window.width * 0.037,
                                                    marginTop: constants.window.width * 0.01
                                                }}>可乘坐{passenger}人</Text>
                                                <Text style={{
                                                    color: "#ff0000",
                                                    fontSize: constants.window.width * 0.035,
                                                    marginTop: constants.window.width * 0.01
                                                }}>里程超出面议，价格当日有效</Text>
                                                <View style={{flex: 1, backgroundColor: '#000'}}/>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{height: 0.5, width: constants.window.width * 0.77}}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>首次租用立减</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥50</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>30公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥{price30}</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>80公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥{price80}</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    marginBottom: constants.window.width * 0.21 + constants.window.width * 0.15,
                                                    alignSelf: 'flex-start',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        marginTop: constants.window.width * 0.029,
                                                        marginLeft: constants.window.width * 0.04,
                                                        fontWeight: 'normal'
                                                    }}>120公里以内</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000',
                                                    marginRight: constants.window.width * 0.026,
                                                    marginTop: constants.window.width * 0.026
                                                }}>￥{price120}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>);
                    break;
                case 3:
                    image = {uri: config.host2 + '/image/' + RentReducer.rentInfo[3].img};
                    car = "touristbus";
                    text = (
                        <View style={styles.swiperText}>
                            <Text style={{
                                flexDirection: 'row',
                                color: "#000",
                                fontSize: constants.window.width * 0.05
                            }}>旅游车</Text>
                            <Text style={{
                                color: "#797979",
                                fontSize: constants.window.width * 0.045
                            }}>可乘坐{passenger}人</Text>
                            <Modal
                                animationType='slide'           // 从底部滑入
                                transparent={true}
                                visible={this.state.isModal3}    // 根据isModal决定是否显示
                                onRequestClose={() => {
                                    this.onRequestClose()
                                }}  // android必须实现
                            >
                                <View style={styles.modalViewStyle}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            {
                                                this.setState({
                                                    isModal3: false
                                                })
                                            }
                                        }}
                                    >
                                        <View style={{
                                            height: constants.window.height * 0.48,
                                            width: constants.window.width * 0.77,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            margin: constants.window.width * 0.005,
                                            alignItems: 'center',
                                        }}>
                                            <Image source={image} style={{
                                                width: constants.window.width * 0.6,
                                                height: constants.window.height * 0.3 * 0.7 * 0.75,
                                                marginTop: constants.window.width * 0.05
                                            }}
                                                   resizeMode="contain"/>
                                            {/*<View style={{flex:1}}></View>*/}
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: constants.window.width * 0.045,
                                                    marginTop: constants.window.width * 0.05,
                                                    fontWeight: 'bold',
                                                }}>旅游车</Text>
                                                <Text style={{
                                                    color: "#595959",
                                                    fontSize: constants.window.width * 0.037,
                                                    marginTop: constants.window.width * 0.03
                                                }}>可乘坐{passenger}人</Text>
                                                <View style={{flex: 1, backgroundColor: '#000'}}/>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{height: 0.5, width: constants.window.width * 0.77}}/>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: constants.window.width * 0.026,
                                                    alignItems: 'center',
                                                    marginLeft: constants.window.width * 0.04
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        fontWeight: 'normal'
                                                    }}>首次租用立减</Text><View style={{flex: 1}}/><Text style={{
                                                    fontSize: constants.window.width * 0.06,
                                                    color: '#F0A000'
                                                }}>￥50</Text>
                                                </View>
                                                <View style={{
                                                    height: 1,
                                                    backgroundColor: '#c9c9c9',
                                                    width: constants.window * 0.77
                                                }}>
                                                    <Image source={require('../../image/rent/rentHr.png')}
                                                           style={{
                                                               height: 0.5,
                                                               width: constants.window.width * 0.77,
                                                           }}/>
                                                </View>
                                                <View style={{
                                                    marginBottom: constants.window.width * 0.27 + constants.window.width * 0.096,
                                                    alignSelf: 'flex-start'
                                                }}>
                                                    <Text style={{
                                                        fontSize: constants.window.width * 0.040,
                                                        marginTop: constants.window.width * 0.033,
                                                        marginLeft: constants.window.width * 0.04,
                                                        fontWeight: 'normal'
                                                    }}>价格面议</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>);
                    passenger = 49;
            }
            imageViews.push(
                <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff', padding: 10}} key={i}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.carDetail()
                    }}>
                        <Image
                            style={{
                                width: constants.window.width * 0.6,
                                height: constants.window.height * 0.3 * 0.7 * 0.75
                            }}
                            resizeMode="contain"
                            source={image}
                        />
                    </TouchableWithoutFeedback>
                    {text}
                </View>
            );
        }
        return imageViews
    }

    render() {
        const {UserReducer, RentReducer} = this.props;
        if (UserReducer.isLogin === false) {
            return (
                <View style={{
                    paddingTop: 100,
                    height: constants.window.height
                }}>
                    <Image source={require('../../image/ticket/ticket.png')}
                           style={{
                               height: constants.window.height * 0.155,
                               width: constants.window.width
                           }}
                    />
                    <Text style={{
                        textAlign: 'center',
                        color: '#AAAAAA',
                        fontSize: 14,
                        marginTop: 30
                    }}>请登录后进行预约包车</Text>
                    <View style={styles.container}>
                        <AwesomeButton backgroundStyle={styles.loginButtonBackground}
                                       labelStyle={styles.loginButtonLabel}
                                       transitionDuration={200}
                                       states={{
                                           idle: {
                                               text: '去登录',
                                               /*onPress: this._login.bind(this),*/
                                               backgroundColor: '#00c6ad',
                                           },
                                       }}
                                       buttonState={this.state.buttonState}
                        />
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{
                            width: constants.window.width,
                            flex: 1,
                        }}>
                            <View style={{
                                width: constants.window.width,
                                backgroundColor: "#fff",
                                flex: 1,
                                paddingLeft: constants.window.width * 0.03,
                            }}>
                                <Fumi
                                    ref=""
                                    onChangeText={(text) => this.state.begin = text}
                                    label={'起点'}
                                    inputStyle={{height: 40}}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'car'}
                                    iconColor={'#e7642c'}
                                    maxLength={32}
                                    iconSize={18}
                                    initIconColor={'rgba(214,214,214,0.9)'}
                                />


                                <View style={{backgroundColor: '#FFFFFF', height: 2,}}>
                                    <Image source={require('../../image/rent/rentHr.png')}
                                           style={{height: 1, width: constants.window.width - 50, marginLeft: 10}}/>
                                </View>

                                <Fumi
                                    ref=""
                                    onChangeText={(text) => this.state.end = text}
                                    label={'终点'}
                                    labelStyle={{fontSize: 5}}
                                    inputStyle={{height: 40}}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'car'}
                                    iconColor={'#e7642c'}
                                    maxLength={32}
                                    iconSize={18}
                                    initIconColor={'rgba(214,214,214,0.9)'}
                                />
                                <View style={{backgroundColor: '#FFFFFF', height: 2,}}>
                                    <Image source={require('../../image/rent/rentHr.png')}
                                           style={{height: 1, width: constants.window.width - 50, marginLeft: 10}}/>
                                </View>
                                <View style={[styles.inputView, {
                                    height: constants.window.height * 0.04,
                                    marginBottom: 15,
                                    marginLeft: 5
                                }, {flexDirection: 'row', alignItems: 'center'}]}>
                                    <FontAwesomeIcon name="calculator" color="rgba(214,214,214,0.9)" size={20}
                                                     style={{
                                                         marginRight: 10,
                                                         backgroundColor: 'rgba(0,0,0,0)',
                                                         left: 5
                                                     }}/>
                                    <Text style={{fontSize: 15, color: '#696969', left: 15}}>数量</Text>
                                    <View style={{flex: 1}}/>
                                    <TouchableWithoutFeedback onPress={() => {
                                        if (this.state.number === 1) {
                                            return null
                                        } else {
                                            return this.setState({number: --this.state.number})
                                        }
                                    }}>
                                        <View style={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: 1
                                        }}>
                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: 'rgba(0,0,0,0.5)'
                                            }}>-</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{
                                        width: 40,
                                        height: 30,
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 1
                                    }}>
                                        <Text
                                            style={{fontSize: 18, color: 'rgba(0,0,0,0.5)'}}>{this.state.number}</Text>

                                    </View>
                                    <TouchableWithoutFeedback onPress={() => {
                                        this.setState({count: ++this.state.number})
                                    }}>
                                        <View style={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: 1,
                                            marginRight: 10
                                        }}>
                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: 'rgba(0,0,0,0.5)'
                                            }}>+</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                {/*<View style={{backgroundColor: '#FFFFFF', height: 2,}}>*/}
                                {/*<Image source={require('../../image/rent/rentHr.png')}*/}
                                {/*style={{height: 1, width: constants.window.width - 50, marginLeft: 10}}/>*/}
                                {/*</View>*/}
                            </View>

                            <View style={{
                                backgroundColor: '#fff',
                                height: constants.window.height * 0.4,
                                marginTop: 10
                            }}>
                                <Text style={{left: 10, marginTop: 10, marginBottom: 10}}>*选择车型</Text>
                                {/*{(() => {
                                    if (this.state.swiper) {
                                        return (

                                            <Swiper
                                                height={constants.window.height * 0.4}
                                                index={0}
                                                showsButtons={true}
                                                horizontal={true}
                                                autoplay={false}
                                                // style={{borderRadius: 4,}}
                                                loop={true}
                                                showsPagination={false}
                                                removeClippedSubviews={false}
                                                buttonWrapperStyle={{
                                                    position: 'absolute',
                                                    top: 50,
                                                    alignItems: 'flex-start'
                                                }}
                                                nextButton={<Text style={{fontSize: 60, color: '#c9c9c9'}}>›</Text>}
                                                prevButton={<Text style={{fontSize: 60, color: '#c9c9c9'}}>‹</Text>}
                                            >
                                                {()=>this.renderImg()}
                                            </Swiper>

                                        )
                                    } else {
                                        return null
                                    }
                                })()}*/}
                            </View>

                            <View style={{backgroundColor: '#fff',}}>
                                <TouchableOpacity activeOpacity={0.7}
                                                  style={{
                                                      backgroundColor: '#fff',
                                                      height: constants.window.height * 0.06,
                                                      width: constants.window.width * 0.9,
                                                      marginTop: constants.window.height * 0.01,
                                                      marginLeft: constants.window.width * 0.05,
                                                  }}
                                                  onPress={this._next.bind(this)}
                                                  underlayColor={'#000'}>
                                    <View style={{
                                        height: constants.window.height * 0.06,
                                        width: constants.window.width * 0.9,
                                        backgroundColor: "#00c6ad",
                                        borderRadius: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{color: "#ffffff", fontSize: 24}}>下一步</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                height: constants.window.height * 0.03,
                                backgroundColor: "#fff",
                                marginTop: -1
                            }}/>
                        </View>

                    </ScrollView>
                </View>
            )

        }
    }
}

const styles = StyleSheet.create({
    img: {
        marginRight: 10,
        height: 18,
        width: 18,
    },
    inputView: {
        width: constants.window.width * 0.9,
        borderRadius: 3,
        alignItems: 'center',
        flexDirection: 'row',
        height: constants.window.height * 0.055,
        marginTop: 12,
        paddingLeft: 5
    },
    label: {
        color: 'gray',
        fontSize: 13,
    },
    textInput: {
        backgroundColor: '#fff',
        color: '#505050',
        fontSize: 13,
        width: constants.window.width * 0.7,
        margin: 1,
        marginLeft: 10
    },
    button: {
        height: constants.window.height * 0.07,
        backgroundColor: "#00c6ad",
        borderRadius: 4
    },
    datePickerContainer: {
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    container: {
        flexDirection: 'row',
        padding: 20
    },
    loginButtonBackground: {
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        width: constants.window.width - 40,
    },
    loginButtonLabel: {
        color: 'white',
        fontSize: 18
    },
    swiperText: {
        alignItems: 'center',
        marginTop: 10,
    },
    modalViewStyle: {
        backgroundColor: 'rgba(100,100,100,0.8)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default connect(
    (state) => ({
        RentReducer: state.RentReducer,
        UserReducer: state.UserReducer,
    }),
)(FirstStep)
