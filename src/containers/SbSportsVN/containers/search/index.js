import { recommendSearchKeywords } from "../../lib/js/recommendSearchKeywords";
// import LazyImageForLeague from "../LazyLoad/LazyImageForLeague";
import React from "react";
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
import { Actions } from "react-native-router-flux";
import ImageForLeague from "../../game/RNImage/ImageForLeague";
import { Toasts } from "$Toasts";
import NavBack from "$Components/Nav/NavBack";
import { ArrowIcon, ClearIcon, CloseIcon, SearchIcon, DeleteIcon } from "$Components/icons/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";


import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { RowCenterBetween, RowCenterCenter, RowCenterStart, RowStartCenter } from "$Components/CustomView";
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
        this.renderInputSearch();
        // if (this.props.router.query.keyword) {
        // 	this.doSearch({ target: { value: this.props.router.query.keyword } });
        // }
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
                        placeholder={"Nhập từ khóa"}
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
                                        <Text style={styles.btnText}>Tìm Kiếm</Text>
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
        PiwikEventDataHandle("SbSportsVN_SearchSubmit");
        Toasts.loading("Đang tìm, vui lòng đợi...", 20); //搜索中,请稍候...
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
                    Toasts.error("Tìm kiếm thất bại, vui lòng thử lại sau");//搜索失败，请稍候重试
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
        PiwikEventDataHandle("SbSportsVN_SearchMatchLaunch");
        Actions.pop();
        Actions.Betting_detail({ dataList, Vendor: this.props.Vendor });
    }
    render() {
        const { Vendor } = this.props;
        const { searchVal, currentSearchVal, hasSearch, searchSportDatas, selectedSportIndex } = this.state;

        const vendorProp = Vendor.configs.VendorName.toLowerCase(); //獲取推薦搜索 使用

        const selectedSportData = searchSportDatas[selectedSportIndex];

        return (
            <View style={{ backgroundColor: isBlue ? "#05a6ff" : "#222222" }}>
                <View style={{ backgroundColor: isBlue ? "#EFEFF4" : "#2C2C2E", height: height - 40 }}>
                    {/* 頭部 */}
                    {/* 內容 */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* 搜索结果 */}
                        {(hasSearch && searchSportDatas.length > 0) ?
                            <View>
                                {/* 搜索結果 體育tab */}
                                <View style={[styles.tabView, { backgroundColor: isBlue ? "#00a6ff" : "#222222" }]}>
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
                                            <Text style={{ color: selectedSportIndex == index ? (isBlue ? "#fff" : "#1CA6FC") : "#CCCCCC", fontSize: 12, lineHeight: 30, textAlign: "center", paddingRight: 15, paddingLeft: 15 }}>{sport.SportName}</Text>
                                            {
                                                selectedSportIndex == index &&
                                                <View style={[styles.tabBottom, {
                                                    backgroundColor: isBlue ? "#fff" : "#1CA6FC"
                                                }]} />
                                            }
                                        </Touch>;
                                    })}
                                </View>
                                {/* 搜索結果 聯賽和賽事 */}
                                <View style={{ backgroundColor: isBlue ? "#fff" : "transparent", }}>
                                    {
                                        selectedSportData ?
                                            selectedSportData.Leagues.map(league => {
                                                return <View key={league.LeagueId}>
                                                    <View style={[styles.selectedHeader, { backgroundColor: isBlue ? "#EFEFF6" : "transparent" }]}>
                                                        <ImageForLeague LeagueId={league.LeagueId} Vendor={Vendor} />
                                                        {/* <div className="search-league-name"
														dangerouslySetInnerHTML={{
															__html: league.getHighlightLeagueName(currentSearchVal)
														}}
													/> */}
                                                        <Text style={{ paddingLeft: 5, color: isBlue ? "#222222" : "#999999" }}>
                                                            {
                                                                currentSearchVal != "" &&
                                                                league.getHighlightLeagueName(currentSearchVal) &&
                                                                this.txtReturn(league.getHighlightLeagueName(currentSearchVal)) || ""
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        {
                                                            league.Events.map(event => {
                                                                return <Touch
                                                                    key={event.EventId}
                                                                    onPress={() => {
                                                                        this.Jump(event.SportId, event.EventId, event.LeagueId);
                                                                        // Router.push(this.props.Vendor.configs.VendorPage + "/detail/?sid=" + event.SportId + "&eid=" + event.EventId + "&lid=" + event.LeagueId + '&from=search@' + currentSearchVal)
                                                                    }}
                                                                    style={[styles.selectedList, { backgroundColor: isBlue ? "transparent" : "#3A3A3C" }]}
                                                                >
                                                                    <View>
                                                                        <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontSize: 12, fontWeight: "bold", width: width - 80, lineHeight: 20 }} numberOfLines={1}>
                                                                            {
                                                                                currentSearchVal &&
                                                                                (
                                                                                    this.txtReturn(event.getHighlightHomeTeamName(currentSearchVal)) + " vs " + this.txtReturn(event.getHighlightAwayTeamName(currentSearchVal))
                                                                                )

                                                                            }
                                                                        </Text>
                                                                        <Text style={{ color: "#999", fontSize: 12, lineHeight: 20 }}>
                                                                            {event.getEventDateMoment().format("YYYY/MM/DD  hh:mmA")}
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
                        {(hasSearch && searchSportDatas.length <= 0) ? <View style={[styles.nohasSearch, { backgroundColor: isBlue ? "#EFEFF4" : "#2C2C2E" }]}>
                            <Image resizeMode='stretch' source={ImagesUrl.nodataVn} style={{ width: width * .8, height: width * .8 * .55 }} />
                            {/* <Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 30 }}>无数据</Text> */}
                            <Text style={{ color: isBlue ? "#666666" : "#999999", }}>Không có kết quả, hãy thử từ khóa khác</Text>
                            {/* 无搜索结果，请尝试其它关键词 */}
                        </View> : null}
                        {/* 搜索历史列表 */}
                        {!hasSearch ? <>
                            {
                                this.state.historyList && this.state.historyList.length > 0 ?
                                    <View style={[styles.historyView, { backgroundColor: isBlue ? "#fff" : "#222222" }]}>
                                        <View style={styles.historyTitle}>
                                            <Text style={{ color: "#999999" }}>Lịch Sử Tìm Kiếm</Text>
                                            {/* 历史搜索 */}
                                            <DeleteIcon
                                                onPress={() => { this.clearAllHistory(); }}
                                                fill={"#B0B0B0"}
                                                width={20}
                                                height={20}></DeleteIcon>
                                        </View>
                                        <View>
                                            {this.state.historyList.length ? this.state.historyList.map((val, index) => {
                                                return (
                                                    index < 3 && <RowCenterBetween key={index} style={[styles.historyItem, { borderColor: isBlue ? "#EDEDED" : "#2E2E2E", borderTopWidth: 1 }]}>
                                                        <Touch
                                                            onPress={() => {
                                                                this.doSearch(val);
                                                            }}
                                                            style={[styles.historyBtn]}
                                                        >
                                                            <Text style={{ color: isBlue ? "#222222" : "#999" }}>{val}</Text>
                                                        </Touch>



                                                        <CloseIcon
                                                            width={20}
                                                            height={20}
                                                            onPress={() => { this.clearOneHistory(val); }}
                                                            fill="#ccc"></CloseIcon>
                                                    </RowCenterBetween>
                                                );
                                            }) : <View className="center"><Text style={{ color: "#000" }}>Không có kết quả, hãy thử từ khóa khác</Text></View>}
                                            {/* 暂无记录 */}
                                        </View>
                                    </View>
                                    : null
                            }
                            <View style={[styles.recommendation, { backgroundColor: isBlue ? "#fff" : "#222222" }]}>
                                <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontWeight: "bold" }}>Gợi Ý Tìm Kiếm</Text>
                                {/* 推荐搜索 */}
                                <View style={styles.recommendationList}>
                                    {
                                        recommendSearchKeywords.map((item, index) => {
                                            return <Touch
                                                key={index}
                                                onPress={() => {
                                                    this.doSearch(item[vendorProp]);
                                                }}
                                                style={[styles.recommendationItem, { backgroundColor: isBlue ? "#F4F4F4" : "#545457" }]}
                                            >
                                                <Text style={{ color: isBlue ? "#666666" : "#CCCCCC", fontSize: 12 }}>{item.keyword}</Text>
                                            </Touch>;
                                        })
                                    }
                                </View>
                            </View>
                        </> : null}
                    </ScrollView>
                </View>
            </View>
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
        // paddingBottom: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        // width: width - 40,
        // paddingRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // borderTopWidth:1,
        borderColor: "#EBEBEB"
    },
    selectedHeader: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        height: 35,
        paddingLeft: 20,
    },
    tabBottom: {
        width: "100%",
        height: 4,
        bottom: 0,
    },
    tabView: {
        width: width,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    historyBtn: {

    },
    historyItem: {

        width: width - 40,
        marginBottom: 10,
        paddingVertical: 10
    },
    historyTitle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        width: width - 40,
        marginBottom: 10,
    },
    historyView: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: width,
        marginBottom: 10,
    },
    headerView: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        //paddingLeft: 15,
        height: 50,
    },
    searchInput: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 50,
        height: 34,
        borderRadius: 60,
        paddingLeft: 10,
        paddingRight: 3,
    },
    searchBtn: {
        backgroundColor: "#00a6ff",
        width: 80,
        borderRadius: 60,
        height: 30,
        justifyContent: "center"
    },
    recommendation: {
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
        height: height - 160
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
