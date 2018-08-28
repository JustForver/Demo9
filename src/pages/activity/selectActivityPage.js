import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Platform
} from 'react-native';
import constants from '../../common/constants'
import {refreshActivityList} from '../../actions/activityAction'

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
            genre:'',
        }
    }

    componentWillMount(){
        const {ActivityReducer} = this.props;
        if(!ActivityReducer.list.length==0){
            this._onRefresh(ActivityReducer.list[0].name);
        }
    }

    //刷新
    _onRefresh(genre) {
        this.setState({genre:genre});
        this.props.dispatch(refreshActivityList(genre));
    }

    render() {
        const {ActivityReducer} = this.props;
        return (
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

                        {ActivityReducer.list.map((list) => {
                            return (
                                <TouchableOpacity key={list.id} activeOpacity={0.75} onPress={()=> {this._onRefresh(list.name)}} >
                                    {(() => {
                                        if (this.state.genre === list.name) {
                                            return (
                                                <View style={[styles.town, styles.border]}>
                                                    <Text
                                                        style={[styles.townName]}>{list.name}</Text>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <View style={styles.town}>
                                                    <Text style={styles.townName}>{list.name}</Text>
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
    (state)=>({
        ActivityReducer:state.ActivityReducer,
    })
)(SelectActivity)
