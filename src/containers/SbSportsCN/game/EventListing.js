
import { EventChangeType, SortWays, SpecialUpdateType, VendorMarkets } from "../lib/vendor/data/VendorConsts";
import reactUpdate from "immutability-helper";
import Header from "./Header/index";
import Nav from "./Header/nav";
import Betting from "./Betting/index";
import moment from "moment";
import { PushLayout } from "../containers/Layout";
import React, { Component, PropTypes } from "react";
import Guide from "../containers/Guide";
import BetCartPopup from "./Betting/BetCartPopup";
import Skeleton from "./Skeleton/Skeleton";
import {
    StyleSheet,

    Text,
    NativeModules,
    FlatList,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
} from "react-native";
import MiniEvent from "./Betting/MiniEvent";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import EventData from "./../lib/vendor/data/EventData";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import GoTopIcon from "$Components/GoTopIcon";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

const EventPerPageCount = 10; //分頁展示，默認每頁(每次展示)多少筆
class EventListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMiniGamesActiveGame: true,
            MiniGamesBanners: "",
            SportDatas: [],
            EventDatas: [],
            OddsUpData: { Events: {}, Lines: {}, Selections: {} } /* 上升赔率 */,
            OddsDownData: { Events: {}, Lines: {}, Selections: {} } /* 下降赔率 */,
            Loading: false,
            layoutHeaderHeight: 0,
            firstloade: true,
            init: EventPerPageCount,
            //從詳情頁過來的 縮小的比分框
            showMiniEvent: false,
            miniEventId: null,
            miniSportId: 1,
            miniLeagueId: null,
            miniShowType: 0,
            showPush: false,
            BetType: "",
            navTop: false,
            isMores: true,
            hasMore: true,
            GuideTop: 0,
            GuideLeft: 0,
            BannerDatas: [],
            showCorrectScore: false, //展示全場波膽
            PageNumber: 1,
            MaxPageCount: -1,
            TotalCount: -1
        };

        //用來標記是否需要用緩存服務器數據
        this.SportDatasHasSet = false;
        this.EventDatasHasSet = false;
        this.BannerDatasHasSet = false;
        this.SportDatasUseCache = false;
        this.EventDatasUseCache = false;
        this.BannerDatasUseCache = false;

        this.dataIsFullLoaded = false; //數據已經完整取回(可以正確計算 上滑獲取數據 是否已經到底)

        this.isDidUnmount = null; //紀錄是否已unmount，判斷異步動作是否還要執行
    }

    //默認查詢
    getDefaultQueryParams() {
        const theDayAfterTenDays = moment().add(10, "days").format("YYYY-MM-DD");
        const theDaytoday = moment().format("YYYY-MM-DD");
        const type = {
            SportId: this.props.SportId || 1 /* 体育类型 不分Vendor 1 都是默認足球 */,
            MarketId: VendorMarkets.RUNNING /* 市场类型 */, //默認今天
            SortWay: SortWays.LeagueName /* 排序 */, //默認聯賽排序
            StartDate: theDaytoday /* 开始时间 */,
            EndDate: theDayAfterTenDays /* 结束时间 */
        };
        this.setState({
            BetType: type
        });
        return type;
    }

    async componentDidMount() {
        this.isDidUnmount = false;
        const { Vendor } = this.props;

        //優先使用緩存服務器數據
        const VendorName = Vendor.configs.VendorName;

        if (window.initialCache[VendorName] && (window.initialCache[VendorName].isUsed !== true)) {
            const handleInitialCache = (cacheData) => {
                if (this.isDidUnmount) return;

                if (cacheData && (window.initialCache[VendorName].isUsed !== true)) {
                    let newState = {};
                    if (!this.SportDatasHasSet) { //確定沒數據才用
                        console.log("=======USE API CACHE for COUNT=======");
                        if (this.state.firstloade === true) { //避免整頁刷新
                            newState.firstloade = false;
                        }
                        newState.SportDatas = cacheData.count;
                        this.SportDatasUseCache = true;
                        Vendor.storeInitialCacheToPollingCache(cacheData, "count"); //API緩存也加入polling數據緩存機制
                    }
                    if (!this.EventDatasHasSet) { //確定沒數據才用
                        console.log("=======USE API CACHE for EVENTS=======");
                        if (this.state.firstloade === true) { //避免整頁刷新
                            newState.firstloade = false;
                        }
                        if (this.state.Loading === true) {
                            newState.Loading = false;
                        }
                        newState.EventDatas = cacheData.list;
                        this.EventDatasUseCache = Vendor.configs.VL ? false : true;
                        Vendor.storeInitialCacheToPollingCache(cacheData, "event"); //API緩存也加入polling數據緩存機制
                    }
                    if (JSON.stringify(newState) !== "{}") {
                        this.setState(newState);
                    }
                    window.initialCache[VendorName].isUsed = true; //標記為已使用
                } else {
                    console.log("=======ABORT USE API CACHE=======");
                }
            };

            if (ApiPort.UserLogin !== true) {
                //優化Performance:未登入，優先等待並使用 initialCache
                let cacheData = await window.initialCache[VendorName].cachePromise;
                handleInitialCache(cacheData);
            } else {
                //已登入則按原方式 initialCache 和 正常獲取 競速，先拿到的先用
                window.initialCache[VendorName].cachePromise.then(handleInitialCache);
            }
        } else {
            console.log("=======NO API CACHE for " + VendorName + "=======");
        }

        //輪詢 體育計數
        this.sportsPollingKey = Vendor.getSportsPollingGlobal("eventListing", (PollingResult) => {
            if (this.isDidUnmount) return;
            //console.log('===update Sports', PollingResult);

            this.SportDatasHasSet = true;

            if (this.SportDatasUseCache) {
                this.SportDatasUseCache = false; //跳過第一次更新
                return;
            }

            let newState = { SportDatas: PollingResult.NewData };

            if (this.state.firstloade === true) { //避免整頁刷新
                newState.firstloade = false;
            }
            this.setState(newState);
        });

        //強制更新 體育計數 for 關注比賽移除 使用
        const updateSportsCount = (thisVendorName) => {
            if (Vendor.configs.VendorName === thisVendorName) { //同vendor才適用
                let getSportsFunc = Vendor.configs.VL ? Vendor.getSportsNew() : Vendor.getSports();
                getSportsFunc.then((PollingResult) => {
                    //console.log('===eventListing_updateSportsCount');
                    this.setState({ SportDatas: PollingResult.NewData });
                });
            }
        };
        if (typeof window !== "undefined") { //綁定到window上 全局可用
            window.eventListing_updateSportsCount = updateSportsCount.bind(this);
        }
        //沒有查詢參數，就傳默認的
        const defaultQuery = this.getDefaultQueryParams();
        this.GetEvents(defaultQuery, false, false, true); //默認參數不用更新網址鏈接
        /* 默认足球 */
        //this.getBannerData(1);

        // const { query } = this.props.router; //從鏈接獲取要加載的參數
        // console.log('queryqueryqueryquery',query)
        // //沒有查詢參數，就傳默認的
        // const defaultQuery = this.getDefaultQueryParams();
        // if (JSON.stringify(query) === '{}' || !query) {
        // 	//console.log('===DidMount load default',JSON.parse(JSON.stringify(query)))
        // 	this.GetEvents(defaultQuery, false); //默認參數不用更新網址鏈接
        // } else {
        // 	//有傳入參數
        // 	const thisQuery = Object.assign({}, defaultQuery, query);
        // 	//處理一下數據格式，要用int型態
        // 	if (thisQuery.SportId) {
        // 		thisQuery.SportId = parseInt(thisQuery.SportId);
        // 	}
        // 	if (thisQuery.MarketId) {
        // 		thisQuery.MarketId = parseInt(thisQuery.MarketId);
        // 	}
        // 	if (thisQuery.SortWay) {
        // 		thisQuery.SortWay = parseInt(thisQuery.SortWay);
        // 	}

        // 	//console.log('===DidMount load from query',JSON.parse(JSON.stringify(query)))

        // 	this.GetEvents(thisQuery);

        // 	if (thisQuery.miniEventId) {
        // 		this.setState({
        // 			showMiniEvent: true,
        // 			miniEventId: thisQuery.miniEventId,
        // 			miniSportId: thisQuery.miniSportId,
        // 			miniLeagueId: thisQuery.miniLeagueId,
        // 			miniShowType: thisQuery.miniShowType,
        // 		});
        // 	}
        // }

        if (!window.passHome) {
            this.getBannerFeature();
        }
    }

    componentWillUnmount() {
        this.isDidUnmount = true;
        const { Vendor } = this.props;
        Vendor.deletePolling(this.sportsPollingKey);
        Vendor.deletePolling(this.eventPollingKey);
        Vendor.deletePolling(this.bannerPollingKey);

        //強制更新 體育計數 for 關注比賽移除 使用
        if (typeof window !== "undefined") {
            window.eventListing_updateSportsCount = null;
        }
    }

    /* 获取游戏列表数据 */
    GetEvents = (type, updateUrl = true, pagePullA = false, reset = false) => {
        console.log("===GetEvents", JSON.stringify(type), updateUrl);
        console.log("pagePullA ", pagePullA);
        let pagePull = pagePullA;
        const { Vendor } = this.props;
        if (updateUrl === true) {
            //this.GetEventsCalled = true; //APP沒有延遲執行，不用處理這個參數
            this.EventDatasUseCache = false; //已經切換了tab 就不能用緩存了
        }
        //分頁功能 在APP 是在EventListing實現
        // if (this.BettingRef) {
        // 	this.BettingRef.setDataIsFullLoaded(false); //更換查詢項目 重設為 未加載完畢
        // }
        this.dataIsFullLoaded = false; //更換查詢項目 重設為 未加載完畢
        //輪詢 比賽數據
        let newState = {
            Loading: pagePullA ? false : !this.EventDatasUseCache, //緩存就不用loading 直接現地切換,
            BetType: type,
        };

        if (!pagePullA) {
            //數據刷新，需要把hasMore和init復原
            newState.hasMore = true;
            newState.isMores = true;
            newState.init = EventPerPageCount;
        }
        // 重置 清空Cache，頁數從1開始
        if (reset) {
            Vendor._NewDataCache = {};
            newState.PageNumber = 1;
        }
        this.setState(newState);
        let that = this;
        if (!pagePullA) {
            this._flatList && this._flatList.scrollToOffset({ animated: false, offset: 0 });
        }
        this.eventPollingKey = Vendor.getEventsPollingGlobal("eventListing",
            async (PollingResult) => {
                if (this.isDidUnmount) return;
                //console.log('===update Events', JSON.parse(JSON.stringify(PollingResult)));

                console.log("===getEventsPollingGlobal: IsFullLoaded:", PollingResult.IsFullLoaded, ",Count:", PollingResult.NewData ? PollingResult.NewData.length : 0, ",QUERY:", JSON.stringify(type));

                this.EventDatasHasSet = true;

                if (this.EventDatasUseCache) {
                    this.EventDatasUseCache = false;

                    //如果沒有關注比賽，才跳過第一次更新(API緩存 拿不到關注比賽，所以第一次更新不能跳過，不然會出現的很慢)
                    const favEvents = await Vendor.getFavouriteEvents();
                    const currentFavEventsForThisSport = favEvents.filter(item => item.SportId === type.SportId);
                    if (!currentFavEventsForThisSport || currentFavEventsForThisSport.length <= 0) {
                        //console.log('===update Events EventDatasUseCache');
                        return;
                    }
                }

                //處理 數據變化
                let OddsUpData = { Events: {}, Lines: {}, Selections: {} };
                let OddsDownData = { Events: {}, Lines: {}, Selections: {} };
                PollingResult.Changes.map((changeData) => {
                    //類型：更新
                    if (changeData.ChangeType === EventChangeType.Update) {
                        changeData.SpecialUpdates.map((sUpdateData) => {
                            const thisEventId = changeData.EventId; //比賽ID
                            // 處理賠率上升動畫
                            if (sUpdateData.UpdateType === SpecialUpdateType.OddsUp) {
                                const thisLineId = sUpdateData.LineId; //投注線ID
                                const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
                                const lineKey = thisEventId + "|||" + thisLineId;
                                const selectionKey = thisEventId + "|||" + thisLineId + "|||" + thisSelectionId;
                                OddsUpData.Events[thisEventId] = true;
                                OddsUpData.Lines[lineKey] = true;
                                OddsUpData.Selections[selectionKey] = true;
                            }
                            // 處理賠率下降動畫
                            if (sUpdateData.UpdateType === SpecialUpdateType.OddsDown) {
                                const thisLineId = sUpdateData.LineId; //投注線ID
                                const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
                                const lineKey = thisEventId + "|||" + thisLineId;
                                const selectionKey = thisEventId + "|||" + thisLineId + "|||" + thisSelectionId;
                                OddsDownData.Events[thisEventId] = true;
                                OddsDownData.Lines[lineKey] = true;
                                OddsDownData.Selections[selectionKey] = true;
                            }
                        });
                    }
                });

                //整理一次setState 避免多次刷新
                let extraConfigs = PollingResult.extraConfigs;
                let newState = {
                    Loading: false,
                    EventDatas: PollingResult.NewData,
                    OddsUpData,
                    OddsDownData,
                    MaxPageCount: extraConfigs?.MaxPageCount,
                    PageNumber: extraConfigs?.PageNumber,
                    TotalCount: extraConfigs?.TotalCount,
                };

                if (this.state.firstloade === true) { //避免整頁刷新
                    newState.firstloade = false;
                }
                this.setState(newState, () => {
                    //分頁功能 在APP 是在EventListing實現
                    // if (this.BettingRef && PollingResult.IsFullLoaded) {
                    // 	this.BettingRef.setDataIsFullLoaded(true); //通知已加載完畢
                    // }
                    if (PollingResult.IsFullLoaded) {
                        that.dataIsFullLoaded = true;
                    }
                });
            },
            type.SportId,
            type.MarketId,
            type.SortWay,
            type.StartDate,
            type.EndDate,
            {
                getViewScope: () => { //IM專用 早盤-全場波膽 只獲取需要展示的部分
                    //分頁功能 在APP 是在EventListing實現
                    // if (that.BettingRef && that.BettingRef.getViewScopeDataCount) {
                    // 	return { startIndex:0, endIndex: (that.BettingRef.getViewScopeDataCount() - 1) }
                    // }
                    // return {startIndex:0, endIndex:30}
                    return { startIndex: 0, endIndex: this.state.init + EventPerPageCount * 6 }; //當前數量+6頁緩衝
                },
                // this.state.PageNumber 的值都會在每次下拉加載時得到更新(啟動新的輪詢)
                // 輪詢期間，值不會改變
                // pagePull在首次下拉加載前，會是false
                page: pagePull ? this.state.PageNumber + 1 : 1,
                countsPerPage: 30,
                pagePull
            }
        ); // <==查詢參數


        //分頁功能 在APP 是在EventListing實現(已經做在上面進入函數時的setSate)
        //通知數據更新
        // if (this.BettingRef) {
        // 	this.BettingRef.onEventsRefresh();
        // }
    };

    /* 獲取banner數據 */
    // getBannerData = (ID) => {
    // 	//console.log('====init getBannerData SPORTID',ID);
    // 	this.bannerPollingKey = this.props.Vendor.getBannerDataPollingGlobal('banner', (eventDatas) => {
    // 		//console.log('====callback getBannerData SPORTID',ID,JSON.parse(JSON.stringify(eventDatas)));
    //
    // 		this.BannerDatasHasSet = true;
    //
    // 		if (this.BannerDatasUseCache) {
    // 			//console.log('====callback getBannerData bypass first update SPORTID',ID)
    // 			this.BannerDatasUseCache = false;  //跳過第一次更新
    // 			return
    // 		}
    //
    // 		let newState = { BannerDatas: eventDatas };
    //
    // 		if (this.state.firstloade === true) {  //避免整頁刷新
    // 			newState.firstloade = false;
    // 		}
    //
    // 		this.setState(newState);
    // 	}, ID);
    // }

    //切換關注比賽
    toggleFavourite = async (event) => {
        const { Vendor } = this.props;
        if (!event.IsFavourite) {
            await Vendor.addFavouriteEvent(event);
        } else {
            await Vendor.removeFavouriteEvent(event.EventId);
        }
        //更新count
        const funcName = Vendor.configs.VL ? Vendor.getSportsNew() : Vendor.getSports();
        const newCount = funcName.then((PollingResult) => {
            this.setState({ SportDatas: PollingResult.NewData });
        });

        //更新賽事列表
        //切換 星號 展示
        let targetIndexes = []; //因為增加展示 關注比賽，相同EventId會出現兩個
        this.state.EventDatas.map((item, index) => {
            if (item.EventId === event.EventId) {
                targetIndexes.push(index);
            }
        });
        if (targetIndexes.length > 0) {
            let updates = {};
            targetIndexes.map(targetIndex => {
                updates[targetIndex] = { IsFavourite: { $set: !event.IsFavourite } };
            });
            this.setState({ EventDatas: reactUpdate(this.state.EventDatas, updates) }, () => {
                //星號切換完 才處理數據
                if (this.state.BetType && this.state.BetType.MarketId === VendorMarkets.TODAY) {
                    if (!event.IsFavourite) {
                        //加入關注比賽
                        const cloneEvents = this.state.EventDatas.filter(ev => ev.EventId == event.EventId).map(ev => EventData.clone(ev));
                        if (cloneEvents.length > 0) {
                            let cloneEvent = cloneEvents[0];
                            cloneEvent.MarketIdForListing = VendorMarkets.FAVOURITE; //手動設定
                            //找出全部關注比賽
                            let favEvents = [cloneEvent]; //新的這個也加進去
                            for (let i = 0; i < this.state.EventDatas.length; i++) {
                                const thisEv = this.state.EventDatas[i];
                                if (thisEv.MarketIdForListing !== VendorMarkets.FAVOURITE) {
                                    break;
                                } else {
                                    favEvents.push(thisEv);
                                }
                            }
                            //重新排序
                            EventData.sortEvents(favEvents, this.state.BetType.SortWay);
                            //重新插入關注比賽
                            this.setState({ EventDatas: reactUpdate(this.state.EventDatas, { $splice: [[0, favEvents.length - 1, ...favEvents]] }) });
                        }
                    } else {
                        //刪除關注比賽
                        const targetIndex = this.state.EventDatas.findIndex(ev => ev.EventId == event.EventId);
                        if (targetIndex > -1) {
                            this.setState({ EventDatas: reactUpdate(this.state.EventDatas, { $splice: [[targetIndex, 1]] }) });
                        }
                    }
                }
            });
        }
    };

    toggleShowCorrectScore = (showCorrectScore) => {
        this.setState({ showCorrectScore });
    };

    _renderFooter = () => {
        const { hasMore, isMores } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {
                    isMores && hasMore &&
                    <View style={styles.moreLodin}>
                        <ActivityIndicator color="#00A6FF" />
                        <Text style={{ color: "#999", fontSize: 12 }}>加载更多...</Text>
                    </View>
                }
                {
                    isMores && !hasMore &&
                    <View>
                        <Text style={{ color: "#999", fontSize: 12, lineHeight: 50, textAlign: "center" }}>没有更多了</Text>
                    </View>
                }
            </View>
        );
    };
    _onEndReached = () => {
        const { Vendor } = this.props;
        const { BetType } = this.state;

        if (Vendor.configs.VL && BetType.MarketId !== VendorMarkets.FAVOURITE) {
            // 加載完，才能繼續載
            if (Vendor.configs.VL && !this.dataIsFullLoaded) {
                return;
            }
            this.handleLoadMoreVL();
        } else {
            setTimeout(() => {
                if (!this.hasMoreData()) {
                    this.setState({
                        hasMore: false
                    });
                } else {
                    //已全部加載完，或者 當前還有未展示數據，才可以往上加
                    if (this.dataIsFullLoaded || (this.state.init < this.state.EventDatas.length)) {
                        this.setState({
                            init: this.state.init + EventPerPageCount
                        });
                    }
                }
            }, 1500);
        }
    };

    handleLoadMoreVL = async () => {
        if (this.state.MaxPageCount !== -1 && (this.state.PageNumber >= this.state.MaxPageCount)) {
            this.setState({ hasMore: false });
        } else {
            this.setState({ hasMore: true }, () => {
                setTimeout(async () => {
                    this.pagePlus();
                }, 1000);
                // const newState = {
                // 	init: this.state.init + EventPerPageCount,
                // };
                // this.setState(newState);
            });
        }
    };

    hasMoreData = () => {
        if (!this.dataIsFullLoaded) return true; //數據沒有完整取回前，都視為還沒取完
        return (this.state.EventDatas) ? this.state.init < this.state.EventDatas.length : false;
    };
    isMore = () => {
        this.setState({ isMores: false });
    };

    getGuide = (e) => {
        const { nativeEvent } = e;
        if (nativeEvent && nativeEvent.layout && nativeEvent.layout.y !== undefined) {
            this.setState({
                GuideTop: nativeEvent.layout.y,
                GuideLeft: nativeEvent.layout.x + 30
            });
        }
    };
    //引导下一步
    GuideChange = (key) => {
        if (key == 1) {
            this.setState({
                GuideLeft: width - 200,
            });
        } else if (key == 2) {
            if (this.NavRef) {
                this.setState({
                    GuideTop: this.NavRef.state.GuideTop + 48,
                    GuideLeft: this.NavRef.state.GuideLeft,
                });
            }
        } else if (key == 3) {
            this.setState({
                GuideLeft: width - 200,
            });
        }
    };

    _onLayoutHeader = (event) => {
        let { width, height } = event.nativeEvent.layout;
        this.setState({ layoutHeaderHeight: height });
    };


    _renderContent = () => {
        const {
            SportDatas,
            EventDatas,
            OddsUpData,
            OddsDownData,
            Loading,
            firstloade,
            BetType,
            init,
            GuideTop,
            GuideLeft,
            navTop,
            BannerDatas,
            showCorrectScore,
            PageNumber,
            MaxPageCount,
            TotalCount
        } = this.state;
        const { Vendor } = this.props;
        return (
            <View>
                <View onLayout={this._onLayoutHeader}>
                    <Header
                        Vendor={Vendor}
                        BannerDatas={BannerDatas}
                        HeaderRef={(ref) => { this.HeaderRef = ref; }}
                    />
                </View>
                {
                    !navTop &&
                    <View>
                        <Nav
                            NavRef={(ref) => { this.NavRef = ref; }}
                            MenuChange={(ID) => {
                                //this.getBannerData(ID);
                            }}
                            onToggleButtonClicked={expandAll => {
                                //菜單 點擊全展開/全收起按鈕=>賽事列表展開/收起
                                if (this.BettingRef) {
                                    this.BettingRef.toggleAll(expandAll);
                                }
                            }}
                            Vendor={Vendor}
                            SportDatas={SportDatas}
                            GetEvents={(a, b, c, d) => {
                                this.GetEvents(a, b, c, d);
                            }}
                            Loading={Loading}
                            BetType={BetType}
                            navTop={false}
                            ShowCorrectScore={showCorrectScore}
                            ToggleShowCorrectScore={this.toggleShowCorrectScore}
                        />
                    </View>
                }
                <Betting
                    BettingRef={(ref) => { this.BettingRef = ref; }}
                    onAllLeaguesToggled={isExpandAll => {
                        //賽事列表 全展開 或 全收起=> 菜單的 全展開/全收起按鈕 要一起變化
                        if (this.NavRef) {
                            this.NavRef.changeToggleButtonStatus(isExpandAll);
                        }
                    }}
                    Vendor={Vendor}
                    ToggleFavourite={this.toggleFavourite}
                    OddsUpData={OddsUpData} /* 上升赔率 */
                    OddsDownData={OddsDownData} /* 下降赔率 */
                    SportDatas={SportDatas} /* 游戏类型 和游戏数据计数 */
                    EventDatas={Vendor.configs.VL ? EventDatas : EventDatas.slice(0, init)} /* 当前进行的所有赛事 */
                    GetEvents={(e) => this.GetEvents(e)}
                    Loading={Loading}
                    BetType={BetType}
                    isMore={this.isMore}
                    ShowCorrectScore={([1, 2022].indexOf(parseInt(BetType.SportId)) !== -1) && showCorrectScore} /* 足球和世界杯才有全場波膽，其他沒有 */
                />
            </View>
        );
    };

    getBannerFeature() {
        const login = ApiPort.UserLogin ? "after" : "before";
        fetch(`${Strapi_Domain + ApiPort.CMS_BannerFeature}?login=${login}&displaying_webp`, {
            method: "GET",
            headers: {
                token: window.CMS_token,
            },
        })
            .then(response => response.json())
            .then((data) => {
                if (data) {
                    const haveLabor = data.some(v => v.action && v.action.actionId == 28 && v.action.url.indexOf("Labor") !== -1);
                    this.props.checkLabor(haveLabor);
                    this.props.laborToggle(haveLabor);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    pagePlus = async () => {
        console.log("pagePlus ");
        const { BetType } = this.state; //從鏈接獲取要加載的參數
        //沒有查詢參數，就傳默認的
        const defaultQuery = this.getDefaultQueryParams();
        //有傳入參數
        const thisQuery = Object.assign({}, defaultQuery);
        //處理一下數據格式，要用int型態
        if (BetType.SportId) {
            thisQuery.SportId = parseInt(BetType.SportId);
        }
        if (BetType.MarketId) {
            thisQuery.MarketId = parseInt(BetType.MarketId);
        }
        if (BetType.SortWay) {
            thisQuery.SortWay = parseInt(BetType.SortWay);
        }
        if (BetType.StartDate) {
            thisQuery.StartDate = BetType.StartDate;
        }
        if (BetType.EndDate) {
            thisQuery.EndDate = BetType.EndDate;
        }
        return this.GetEvents(thisQuery, false, true);
    };

    getQuery = async () => {
        this.isDidUnmount = false;
        const { query, pathname } = this.props.router; //從鏈接獲取要加載的參數
        let initDelay = Vendor.configs.VL ? 0 : 10 * 1000;
        let result = {};
        //沒有查詢參數，就傳默認的
        const defaultQuery = this.getDefaultQueryParams();
        if (JSON.stringify(query) === "{}" || !query || (!query.SportId && !query.miniSportId)) {
            this.initDelayTimer2 = setTimeout(() => {
                if (this.isDidUnmount) return Promise.resolve();
                if (initDelay > 0 && this.GetEventsCalled) {
                    console.log(pathname, "=====Performance:Events:bypass", initDelay);
                    return Promise.resolve(); //有延遲執行的話，需要檢查 如果用戶已經有操作切換(call GetEvents()) 就不用再跑這裡，不然用戶先前的操作會被蓋掉
                }
                console.log(pathname, "=====Performance:Events:called", initDelay);
                return Promise.resolve(defaultQuery);
            }, initDelay);
        } else {
            //有傳入參數
            const thisQuery = Object.assign({}, defaultQuery, query);
            //處理一下數據格式，要用int型態
            if (thisQuery.SportId) {
                thisQuery.SportId = parseInt(thisQuery.SportId);
            }
            if (thisQuery.MarketId) {
                thisQuery.MarketId = parseInt(thisQuery.MarketId);
            }
            if (thisQuery.SortWay) {
                thisQuery.SortWay = parseInt(thisQuery.SortWay);
            }
            if (thisQuery.StartDate) {
                thisQuery.StartDate = thisQuery.StartDate;
            }
            if (thisQuery.EndDate) {
                thisQuery.EndDate = thisQuery.EndDate;
            }
            result = thisQuery;
        }
        return Promise.resolve(defaultQuery);
    };
    render() {
        window.MiniEventShow = (showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType) => {
            this.setState({
                showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType
            });
        };

        const {
            isMiniGamesActiveGame,
            MiniGamesBanners,
            SportDatas,
            EventDatas,
            OddsUpData,
            OddsDownData,
            Loading,
            firstloade,
            BetType,
            init,
            GuideTop,
            GuideLeft,
            navTop,
            layoutHeaderHeight,
            showCorrectScore,
            PageNumber,
            MaxPageCount,
            TotalCount
        } = this.state;
        const { Vendor, fixedFloatIconHorizonPosition = false } = this.props;

        window.showPushHome = (showPush) => {
            this.setState({ showPush });
        };

        window.MiniGamesBanners = () => {
            this.setState({ isMiniGamesActiveGame: true });
        };

        return (
            <View style={{ flex: 1, zIndex: 1 }} onLayout={(e) => this.getGuide(e)}>
                {/* 推送提示 */}
                <PushLayout showPush={this.state.showPush} />
                {
                    navTop &&
                    <View>
                        <Nav
                            NavRef={(ref) => { this.NavRef = ref; }}
                            MenuChange={(ID) => {
                                //菜單 體育項目變化=>刷新banner數據
                                // if (this.HeaderRef) {
                                // 	this.HeaderRef.getBannerData(ID);
                                // }
                            }}
                            onToggleButtonClicked={expandAll => {
                                //菜單 點擊全展開/全收起按鈕=>賽事列表展開/收起
                                if (this.BettingRef) {
                                    this.BettingRef.toggleAll(expandAll);
                                    this._flatList && this._flatList.scrollToOffset({ animated: false, offset: 0 });
                                }
                            }}
                            Vendor={Vendor}
                            SportDatas={SportDatas}
                            GetEvents={(a, b, c, d) => {
                                this.GetEvents(a, b, c, d);
                            }}
                            Loading={Loading}
                            BetType={BetType}
                            navTop={true}
                            ShowCorrectScore={showCorrectScore}
                            ToggleShowCorrectScore={this.toggleShowCorrectScore}
                        />
                    </View>
                }
                {
                    firstloade ?
                        <Skeleton />
                        :
                        <FlatList
                            onScroll={(e) => {
                                let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
                                let offsetH = layoutHeaderHeight;
                                if (offsetY > offsetH - 15 && !navTop) {
                                    this.setState({ navTop: true });
                                }
                                if (offsetY < offsetH + 15 && navTop) {
                                    this.setState({ navTop: false });
                                }
                            }}
                            showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                            showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                            automaticallyAdjustContentInsets={false}
                            numColumns={1} //每行显示2个
                            ref={flatList => (this._flatList = flatList)}
                            renderItem={this._renderContent}
                            enableEmptySections={true} //数据可以为空
                            onEndReachedThreshold={0.05} //执行上啦的时候1%执行
                            onEndReached={this._onEndReached}
                            ListFooterComponent={this._renderFooter}//尾巴
                            keyExtractor={(item, index) => (item.key = (index + ""))} //key需要為string格式
                            onRefresh={this.onRefresh}
                            data={[1]}
                            extraData={[1]}

                            windowSize={3}
                            removeClippedSubviews={Platform.OS === "android"}
                            maxToRenderPerBatch={10}
                            updateCellsBatchingPeriod={50}
                        />
                }
                {/* 投注购物车浮窗 */}
                <View style={{ position: "absolute", bottom: 30 }}>
                    <BetCartPopup
                        Vendor={this.props.Vendor}
                        ShowBottomSheet={(t) => { this.BettingRef.ShowBottomSheet(t); PiwikEventDataHandle("SbSportsCN_MainPageBetcart"); }}
                    />
                </View>
                <GoTopIcon
                    visible={navTop}
                    onPress={() => {
                        this._flatList && this._flatList.scrollToOffset({ x: 0, y: 0 });
                        this.setState({ navTop: false });
                    }}>
                </GoTopIcon>

                {this.state.showMiniEvent ? (
                    <MiniEvent
                        Vendor={Vendor}
                        EventId={this.state.miniEventId}
                        SportId={this.state.miniSportId}
                        LeagueId={this.state.miniLeagueId}
                        ShowType={this.state.miniShowType}
                        CloseMini={() => {
                            this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1, miniLeagueId: null, miniShowType: 0 });
                        }}
                    />
                ) : null}
                {
                    this.NavRef &&
                    this.NavRef.state.GuideTop != 0 &&
                    <Guide
                        GuideTop={GuideTop}
                        GuideLeft={GuideLeft}
                        GuideChange={this.GuideChange}
                    />
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(EventListing);


const styles = StyleSheet.create({
    moreLodin: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        height: 50,
    },
});