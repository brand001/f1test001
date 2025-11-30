import { recommendSearchKeywords } from "../../lib/js/recommendSearchKeywords";
// import LazyImageForLeague from "../LazyLoad/LazyImageForLeague";
import React, { Component } from "react";
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    TextInput,
    View,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Linking,
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import { ImagesUrl } from "@/images/index";
const { width, height } = Dimensions.get("window");
import { Toasts } from "$Toasts";
import { Actions } from "react-native-router-flux";
import ImageForLeague from "../../game/RNImage/ImageForLeague";
import { isSafeAreaViewOrView, WrapView, isIphoneX } from "$Utils";
import NavBack from "$Components/Nav/NavBack";
import { ArrowIcon, ClearIcon, SearchIcon } from "$Components/icons/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";


import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { RowCenterCenter, RowCenterStart, RowStartCenter } from "$Components/CustomView";
import Color from "$Components/Color";

class Search extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: "", //搜尋框文字
            currentSearchVal: "", //當前搜索文字
            searchSportDatas: [],
            selectedSportIndex: 0,
            hasSearch: false, //是否有執行搜索 用來決定展示 歷史+推薦 還是 搜索結果
            historyList: []
        };
        this.doSearch = this.doSearch.bind(this);
        this.addToHistory = this.addToHistory.bind(this);
        this.clearOneHistory = this.clearOneHistory.bind(this);
        this.clearAllHistory = this.clearAllHistory.bind(this);
        this.clickBack = this.clickBack.bind(this);
    }

    componentDidMount() {
        const storageKey = this.getHistoryStorageKey();
        const historyDataJSON = localStorage.getItem(storageKey);
        const historyData = JSON.parse(historyDataJSON);
        historyData && this.setState({ historyList: historyData });

        // if (this.props.router.query.keyword) {
        // 	this.doSearch({ target: { value: this.props.router.query.keyword } });
        // }

        this.renderInputSearch();
    }

    renderInputSearch() {
        this.props.navigation.setParams({
            leftButton: () => {
                return <RowCenterStart style={{ width }}>
                    <NavBack />

                    <CustomTextInput
                        leftIconName={"search"}
                        leftIconFill={Color.placeholderGray}

                        returnKeyType="next"
                        underlineColorAndroid="transparent"
                        value={this.state.searchVal}
                        placeholder={"请输入关键字"}
                        placeholderTextColor="#BCBEC3"
                        maxLength={20}
                        textContentType="username"
                        onChangeText={(v) => {
                            let newState = { searchVal: v };
                            if (!v || v.length <= 0) {
                                newState["hasSearch"] = false; //清空搜索文字時也清空搜索結果
                            }
                            this.setState(newState, () => {

                                this.renderInputSearch();
                            });
                        }}
                        wrapStyle={{
                            borderRadius: 9999,
                            borderColor: Color.transparent,
                            height: 34,
                            width: width * .8
                        }}
                        containerStyle={{
                            marginVertical: 0
                        }}
                        inputStyle={{ paddingLeft: 5 }}

                        renderRight={() => {
                            return (
                                <RowCenterCenter>
                                    {
                                        Boolean(this.state.searchVal) &&
                                        <ClearIcon
                                            onPress={() => {
                                                this.setState({
                                                    searchVal: "",
                                                    hasSearch: false
                                                }, () => {
                                                    this.renderInputSearch();
                                                });
                                            }
                                            } />
                                    }
                                    <FilledButton
                                        onPress={() => {
                                            this.state.searchVal && this.doSearch(this.state.searchVal);
                                        }}
                                        type="small"
                                        wrapStyle={styles.screeningBtn}>
                                        <Text style={styles.btnText}>搜索</Text>
                                    </FilledButton>
                                </RowCenterCenter>
                            );
                        }}
                    />
                </RowCenterStart>;
            }
        });
    }

    //分vendor和用戶名 儲存
    getHistoryStorageKey() {
        const { Vendor } = this.props;
        const loginInfo = Vendor._getLoginInfo();
        let memberCode = "";
        if (loginInfo) {
            memberCode = loginInfo.memberCode;
        }
        return "HISTORY-" + memberCode + "-" + Vendor.configs.VendorName;
    }

    doSearch(v) {
        PiwikEventDataHandle("SbSportsCN_SearchSubmit");
        Toasts.loading("搜索中,请稍候...", 20);
        this.props.Vendor.search(v)
            .then(datas => {
                this.setState({
                    searchVal: v,
                    currentSearchVal: v,
                    searchSportDatas: datas,
                    selectedSportIndex: 0,
                    hasSearch: true,
                }, () => {
                    Toasts.removeAll();
                    this.addToHistory(this.state.searchVal);

                    this.renderInputSearch();
                });
            })
            .catch(err => {
                Toasts.removeAll();
                if (err === "请输入不少于3个字") { //特別處理bti
                    Toasts.error(err);
                } else {
                    console.log("===search err", err);
                    Toasts.error("搜索失败，请稍候重试");
                }
            });
    }

    addToHistory(v) {
        const storageKey = this.getHistoryStorageKey();
        const currentHistoryDataJSON = localStorage.getItem(storageKey);
        const currentHistoryDataParsed = currentHistoryDataJSON ? JSON.parse(currentHistoryDataJSON) : [];
        const currentHistoryData = (currentHistoryDataParsed && Array.isArray(currentHistoryDataParsed)) ? currentHistoryDataParsed : [];
        currentHistoryData.unshift(v); //用unshift把新的堆在最上面
        //去重複
        let uniqueHistoryData = currentHistoryData.filter((item, index) => currentHistoryData.indexOf(item) === index);
        //最多5個
        if (uniqueHistoryData && uniqueHistoryData.length > 5) {
            uniqueHistoryData = uniqueHistoryData.filter((data, index) => index < 5);
        }
        localStorage.setItem(storageKey, JSON.stringify(uniqueHistoryData));
        this.setState({ historyList: uniqueHistoryData });
    }

    clearOneHistory(v) {
        const storageKey = this.getHistoryStorageKey();
        const currentHistoryDataJSON = localStorage.getItem(storageKey);
        const currentHistoryDataParsed = currentHistoryDataJSON ? JSON.parse(currentHistoryDataJSON) : [];
        const currentHistoryData = (currentHistoryDataParsed && Array.isArray(currentHistoryDataParsed)) ? currentHistoryDataParsed : [];
        const newHistoryData = currentHistoryData.filter(d => d !== v);
        //去重複
        const uniqueHistoryData = newHistoryData.filter((item, index) => newHistoryData.indexOf(item) === index);
        localStorage.setItem(storageKey, JSON.stringify(uniqueHistoryData));
        this.setState({ historyList: uniqueHistoryData });
    }

    clearAllHistory() {
        const storageKey = this.getHistoryStorageKey();
        localStorage.removeItem(storageKey);
        this.setState({ historyList: [] });
    }

    //點擊返回
    clickBack() {
        // const { hasSearch } = this.state;

        // if (hasSearch) { //如果在搜索結果頁點返回，是返回歷史+推薦
        // 	this.setState({ hasSearch: false });
        // } else { //在歷史+推薦頁 點返回，回到主頁
        // 	//默認使用routerFilter存下的主頁面查詢參數
        // 	const { Vendor, routerLog } = this.props;
        // 	let query = null;
        // 	let log = routerLog[Vendor.configs.VendorPage];
        // 	if (log && log.query) {
        // 		query = log.query;
        // 	}

        // 	// Router.push({
        // 	// 	pathname: Vendor.configs.VendorPage,
        // 	// 	query: query
        // 	// });
        // }
    }
    txtReturn(data) {
        let ass = data.replace(/<[^<>]+>/g, "");
        return ass;
    }
    Jump(SportId, EventId, LeagueId) {
        // 跳轉到投注詳情處理
        let dataList = {
            eid: EventId,
            sid: SportId,
            lid: LeagueId,
            OE: "",
        };
        PiwikEventDataHandle("SbSportsCN_SearchMatchLaunch");
        Actions.pop();
        Actions.Betting_detail({ dataList, Vendor: this.props.Vendor });
    }
    render() {
        const { Vendor } = this.props;
        const { searchVal, currentSearchVal, hasSearch, searchSportDatas, selectedSportIndex } = this.state;

        const vendorProp = Vendor.configs.VendorName.toLowerCase(); //獲取推薦搜索 使用

        const selectedSportData = searchSportDatas[selectedSportIndex];

        return (
            <WrapView style={{ flex: 1, backgroundColor: "#00a6ff" }}>
                <View style={{ flex: 1, backgroundColor: "#efeff4" }}>
                    {/* 頭部 */}
                    {/* 內容 */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
                        {/* 搜索结果 */}
                        {(hasSearch && searchSportDatas.length > 0) ?
                            <View>
                                {/* 搜索結果 體育tab */}
                                <View style={styles.tabView}>
                                    {searchSportDatas.map((sport, index) => {
                                        return <Touch
                                            className={"search-sport-tab" + (selectedSportIndex === index ? " selected" : "")}
                                            key={sport.SportId}
                                            onPress={() => {
                                                if (this.state.selectedSportIndex !== index) {
                                                    this.setState({ selectedSportIndex: index });
                                                }
                                            }}
                                        >
                                            <Text style={{ color: selectedSportIndex == index ? "#fff" : "#b4e4fe", fontSize: 12, lineHeight: 30, textAlign: "center", paddingRight: 15, paddingLeft: 15 }}>{sport.SportName}</Text>
                                            {
                                                selectedSportIndex == index &&
                                                <View style={styles.tabBottom} />
                                            }
                                        </Touch>;
                                    })}
                                </View>
                                {/* 搜索結果 聯賽和賽事 */}
                                <View style={{ backgroundColor: "#fff", }}>
                                    {
                                        selectedSportData ?
                                            selectedSportData.Leagues.map(league => {
                                                return <View key={league.LeagueId}>
                                                    <View style={styles.selectedHeader}>
                                                        <ImageForLeague LeagueId={league.LeagueId} Vendor={Vendor} />
                                                        {/* <div className="search-league-name"
														dangerouslySetInnerHTML={{
															__html: league.getHighlightLeagueName(currentSearchVal)
														}}
													/> */}
                                                        <Text style={{ paddingLeft: 5, color: "#00a6ff" }}>
                                                            {
                                                                currentSearchVal != "" &&
                                                                league.getHighlightLeagueName(currentSearchVal) &&
                                                                this.txtReturn(league.getHighlightLeagueName(currentSearchVal)) || ""
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style={{ padding: 20, }}>
                                                        {
                                                            league.Events.map(event => {
                                                                return <Touch
                                                                    key={event.EventId}
                                                                    onPress={() => {
                                                                        this.Jump(event.SportId, event.EventId, event.LeagueId);
                                                                        // Router.push(this.props.Vendor.configs.VendorPage + "/detail/?sid=" + event.SportId + "&eid=" + event.EventId + "&lid=" + event.LeagueId + '&from=search@' + currentSearchVal)
                                                                    }}
                                                                    style={styles.selectedList}
                                                                >
                                                                    <View>
                                                                        <Text style={{ color: "#000", fontSize: 12, fontWeight: "bold", width: width - 80, }} numberOfLines={1}>
                                                                            {
                                                                                currentSearchVal &&
                                                                                (
                                                                                    this.txtReturn(event.getHighlightHomeTeamName(currentSearchVal)) + "vs" + this.txtReturn(event.getHighlightAwayTeamName(currentSearchVal))
                                                                                )

                                                                            }
                                                                        </Text>
                                                                        <Text style={{ color: "#999", fontSize: 12, lineHeight: 20 }}>
                                                                            {event.getEventDateMoment().format("YYYY/MM/DD hh:mmA")}
                                                                        </Text>
                                                                    </View>
                                                                    <ArrowIcon fill={"#999"} width={12} height={12} direction="right" />
                                                                </Touch>;
                                                            })
                                                        }
                                                    </View>
                                                </View>;
                                            })
                                            : null
                                    }
                                </View>
                            </View>
                            : null}
                        {/* 无搜索结果 */}
                        {(hasSearch && searchSportDatas.length <= 0) ? <View style={styles.nohasSearch}>
                            <Image resizeMode='stretch' source={ImagesUrl.nodataCn} style={{ width: 90, height: 59 }} />
                            <Text style={{ color: "#000", fontWeight: "bold", lineHeight: 30 }}>无数据</Text>
                            <Text style={{ color: "#000", }}>无搜索结果，请尝试其它关键词</Text>
                        </View> : null}
                        {/* 搜索历史列表 */}
                        {!hasSearch ? <>
                            {
                                this.state.historyList && this.state.historyList.length > 0 ?
                                    <View style={styles.historyView}>
                                        <View style={styles.historyTitle}>
                                            <Text style={{ color: "#000", fontWeight: "bold" }}>历史搜索</Text>
                                            <Touch onPress={() => { this.clearAllHistory(); }}>
                                                <Text style={{ color: "#00a6ff", fontSize: 12 }}>
                                                    清除历史
                                                </Text>
                                            </Touch>
                                        </View>
                                        <View>
                                            {this.state.historyList.length ? this.state.historyList.map((val, index) => {
                                                return (
                                                    <View key={index} style={styles.historyItem}>
                                                        <Touch
                                                            onPress={() => {
                                                                this.doSearch(val);
                                                            }}
                                                            style={styles.historyBtn}
                                                        >
                                                            <SearchIcon fill={"#999"} />
                                                            <Text style={{ color: "#999", marginLeft: 15, }}>{val}</Text>
                                                        </Touch>
                                                        <Touch onPress={() => { this.clearOneHistory(val); }} style={{ position: "absolute", right: 15, }}>
                                                            <Text style={{ color: "#ccc", fontSize: 25 }}>×</Text>
                                                        </Touch>
                                                    </View>
                                                );
                                            }) : <View className="center"><Text>暂无记录</Text></View>}
                                        </View>
                                    </View>
                                    : null
                            }
                            <View style={styles.recommendation}>
                                <Text style={{ color: "#000", fontWeight: "bold" }}>推荐搜索</Text>
                                <View style={styles.recommendationList}>
                                    {
                                        recommendSearchKeywords.map((item, index) => {
                                            return <Touch
                                                key={index}
                                                onPress={() => {
                                                    this.doSearch(item[vendorProp]);
                                                }}
                                                style={styles.recommendationItem}
                                            >
                                                <Text style={{ color: "#666666", fontSize: 12 }}>{item.keyword}</Text>
                                            </Touch>;
                                        })
                                    }
                                </View>
                            </View>
                        </> : null}
                    </ScrollView>
                </View>
            </WrapView>
        );
    }
}

const mapStateToProps = state => ({
    // routerLog: state.routerLog
});

export default connect(
    mapStateToProps,
    null,
)(Search);

const styles = StyleSheet.create({
    selectedList: {
        paddingBottom: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 40,
        paddingRight: 10,
    },
    selectedHeader: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        height: 35,
        backgroundColor: "#EFEFF6",
        paddingLeft: 20,
    },
    tabBottom: {
        width: "100%",
        backgroundColor: "#fff",
        height: 4,
        bottom: 0,
    },
    tabView: {
        width: width,
        backgroundColor: "#00a6ff",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    historyBtn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: width - 40,
    },
    historyItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width - 40,
        marginBottom: 15,
    },
    historyTitle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        width: width - 40,
        marginBottom: 20,
    },
    historyView: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        padding: 20,
        width: width,
        marginBottom: 10,
    },
    headerView: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        height: 50,
        backgroundColor: "#00a6ff"
    },
    searchInput: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 70,
        height: 40,
        borderRadius: 60,
        backgroundColor: "#fff",
        paddingLeft: 10,
        paddingRight: 3,
    },
    searchBtn: {
        backgroundColor: "#00a6ff",
        width: 60,
        borderRadius: 60,
    },
    recommendation: {
        backgroundColor: "#fff",
        width: width,
        padding: 20,
    },
    recommendationList: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
    },
    recommendationItem: {
        backgroundColor: "#F4F4F4",
        borderRadius: 4,
        padding: 15,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    nohasSearch: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width,
        marginTop: 40,
    },
    closeBtn: {
        backgroundColor: "#efeff4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 18,
        height: 18,
        borderRadius: 30,
        marginRight: 10,
    },





    screeningBtn: {
        borderRadius: 50,
        paddingHorizontal: 10,
        marginRight: 4,
        marginLeft: 2
    },
    btnText: {
        fontSize: 14,
        color: Color.white,
        fontWeight: "bold",
    },
});
