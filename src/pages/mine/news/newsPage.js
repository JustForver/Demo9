import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    Platform,
    RefreshControl,
    ImageBackground
} from 'react-native';
import {connect} from 'react-redux'; // 引入connect函数
import Head from '../../../common/head';
import constants from '../../../common/constants';
import Swiper from 'react-native-swiper';
import LoadMoreFooter from '../../../common/LoadMoreFooter';
import config from '../../../common/configuration';


import {fetchBanners, refreshNewsList, loadNewsList} from '../../../actions/mine/newsAction';


class News extends Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);

        this.state = {
            dataSource: new ListView.DataSource({
                getRowData: (data, sectionID, rowID) => {
                    return data[sectionID][rowID];
                },
                getSectionHeaderData: (data, sectionID) => {
                    return data[sectionID];
                },
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
            })
        }
    }


    componentWillMount() {
        const {page} = this.props;
        this.props.dispatch(loadNewsList(page + 1));
        this.props.dispatch(fetchBanners());

    }

    /**
     * 下拉刷新
     * @private
     */
    _onRefresh() {
        this.props.dispatch(refreshNewsList());
    }

    /**
     * 上拉加载更多
     * @private
     */
    _loadMoreData() {
        const {page} = this.props;
        if (page.hasMore) {
            this.props.dispatch(loadNewsList(++this.props.page));
        }
    }

    _renderFooter() {
        const {isLoading,hasMore,networkError,isEmpty} = this.props;
        return (
            <View>
                <View style={{width: constants.window.width}}/>
                <LoadMoreFooter
                    isLoading={isLoading}
                    hasMore={hasMore}
                    networkError={networkError}
                    isEmpty={isEmpty}
                />

            </View>
        )
    }

    /**
     * 新闻详情
     * @param id
     * @param title
     * @param img
     * @param url
     */
    newsDetails(id, title, img, url) {
        this.props.detailLoading = true;
        this.props.navigation.navigate('newsDetails',{
            id: id,
            title: title,
            img: img,
            url: url
        });
    }

    /**
     * 渲染一条数据
     * @param rowData
     * @param sectionID
     * @param rowID
     * @return {XML}
     * @private
     */
    _renderRow(rowData, sectionID, rowID) {
        const {NewsReducer} = this.props;

        if (sectionID == 'banner') {
            let bannerList = rowData;
            return (
                <Swiper height={constants.window.height * 0.3}
                        autoplay={true}
                        loop={true}
                        paginationStyle={{bottom: 10, left: null, right: 15}}
                        removeClippedSubviews={false}
                        dot={<View style={{
                            backgroundColor: '#666',
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}/>}
                        activeDot={<View style={{
                            backgroundColor: '#fff',
                            width: 5,
                            height: 5,
                            borderRadius: 3,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}/>}
                >

                    {bannerList.map((banner) => {
                        return (
                            <TouchableOpacity key={banner.id} activeOpacity={0.75} onPress={() => {
                                this.newsDetails(banner.id, banner.newsName, banner.image, banner.url)
                            }}>
                                <ImageBackground
                                    style={{height: constants.window.height * 0.3, width: constants.window.width}}
                                    source={{uri: config.host + "upload/" + banner.image}}
                                >
                                    <Text style = {{position:'absolute', left:10, bottom:(Platform.OS === 'ios')? 6: 8, color:'#fff', width: constants.window.width - 70}} numberOfLines = {1}>
                                        {banner.newsName}
                                    </Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                    })}
                </Swiper>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={0.75} onPress={() => {
                    this.newsDetails(rowData.id, rowData.title, rowData.img, rowData.url)
                }}>
                    <NewsList
                        {...this.props}
                        title={rowData.title}
                        type={rowData.type}
                        img={(config.host + "upload/" + rowData.img)}
                    />
                </TouchableOpacity>
            );
        }
    }

    render() {
        const {bannerList, rawData,isLoading} = this.props;
        let sourceData = {'banner': [bannerList], 'row': rawData};
        let sectionIDs = ['banner', 'row'];

        let rowIDs = [[0]];

        let row = [];
        for (let i = 0; i < rawData.length; i++) {
            row.push(i);
        }
        rowIDs.push(row);
        return (
            <View style={{flex:1,backgroundColor: "#fff"}}>
                <Head title={"新闻中心"} click={()=>this.props.navigation.goBack()}/>
                {
                    isLoading ?
                        <View style={styles.footer}>
                            <Image source={require('../../../image/load.gif')} style={{width: 200, height: 200}}
                                   resizeMode='contain'/>
                        </View>
                        :
                        <ListView
                            //这是一个应用在长列表上极其重要的优化。
                            //Android上，overflow值总是hidden的，所以你不必担心没有设置它。
                            //而在iOS上，你需要确保在行容器上设置了overflow: hidden
                            removeClippedSubviews={false}     ////用于提升大列表的滚动性能,默认为true
                            //绑定数据源
                            dataSource={this.state.dataSource.cloneWithRowsAndSections(sourceData, sectionIDs, rowIDs)}
                            initialListSize={6}
                            //返回一个条目
                            renderRow={this._renderRow.bind(this)}
                            //滚动到距离屏幕底部不足onEndReachedThreshold个像素时执行的函数
                            onEndReached={this._loadMoreData.bind(this)}
                            onEndReachedThreshold={20} //调用onEndReached的临界值，单位是像素
                            renderFooter={this._renderFooter.bind(this)}//页脚会永远在列表的最底部，页头会在最顶部
                            enableEmptySections={true} //必须属性,防止升级rn的版本后,run-android的时候报错
                            pageSize={6}
                            refreshControl={ //添加下拉刷新的功能
                                <RefreshControl  //下拉刷新
                                    refreshing={false} //是否在刷新时显示指示器
                                    onRefresh={() => {
                                        this._onRefresh()
                                    }}  //开始刷新时调用
                                    colors={['#FFF']} //(安卓)指定至少一种颜色用来绘制刷新指示器
                                    progressBackgroundColor="#00c6ad"/> //指定刷新指示器的背景色
                            }
                        />
                }
            </View>
        )
    }
}

export class NewsList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.tabView}>
                <Image source={{uri: this.props.img}}
                       style={{width: 90, height: 68, resizeMode: 'contain', marginRight: 10}}
                />
                <View style={{flexDirection: 'column', width: constants.window.width - 110, marginTop: 5}}>
                    <Text numberOfLines={2}>标题：{this.props.title}</Text>
                    <Text style={{color: '#666', position: 'absolute', top: 40}}>{this.props.type}</Text>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    tabView: {
        paddingTop: 8,
        paddingLeft: 8,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        flexDirection: 'row',
    },
    customDot: {
        backgroundColor: '#ccc',
        height: 1.5,
        width: 15,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
    },
    customActiveDot: {
        backgroundColor: 'white',
        height: 1.5,
        width: 15,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 200
    },
    footerTitle: {
        marginLeft: (Platform.OS === 'ios') ? 10 : 2,
        fontSize: 15,
        color: '#939393',
    }

});

export default connect(
    (state) => ({
        isLoading: state.NewsReducer.isLoading,
        networkError: state.NewsReducer.networkError,
        detailLoading: state.NewsReducer.detailLoading,
        rawData: state.NewsReducer.rawData,
        bannerList: state.NewsReducer.bannerList,
        page: state.NewsReducer.page,
        hasMore: state.NewsReducer.hasMore,
        isEmpty: state.NewsReducer.isEmpty,
        count: state.NewsReducer.count
    }),
)(News)
