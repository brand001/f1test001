import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Modal,
    Platform,
    NativeModules,
    TextInput,
    KeyboardAvoidingView,
    TouchableHighlight,
    Settings
} from "react-native";
import LiveChat from "$Components/LiveChat";
import NavBack from "$Components/Nav/NavBack";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import {
    Carousel,
    WhiteSpace,
    WingBlank,
    Flex,

    InputItem,
    ActivityIndicator,
    List,
    Picker
} from "@ant-design/react-native";
const { width, height } = Dimensions.get("window");
import { connect } from "react-redux";
import reactUpdate from "immutability-helper";
import ModalDropdown from "react-native-modal-dropdown";
import {
    ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetSABA
} from "$LIB/redux/actions/MaintainStatusAction";
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from "$LIB/redux/actions/UserInfoAction";
import { ACTION_UserSetting_Update } from "$LIB/redux/actions/UserSettingAction";
import VendorBTI from "./../lib/vendor/bti/VendorBTI";
import VendorIM from "./../lib/vendor/im/VendorIM";
import VendorSABA from "./../lib/vendor/saba/VendorSABA";
import { getAllVendorToken } from "./../lib/js/util";
import WalletNavRight from "$Components/Nav/GameNav/WalletNavRight.js";
import { ApiPortSB } from "./../lib/SPORTAPI";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
const newSelsctDate3 = [1, 2, 3, 4, 5];
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
const IphoneXMax = ["iPhone 5", "iPhone 5s", "iPhone 6", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus", "iPhone SE"];
const getModel = DeviceInfo.getModel();
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === "ios";
let gameDBs = [
    {
        id: "IM",
        name: "IM",
        count: null,
        sort: 0,
        sbType: "IPSB"
    },
    {
        id: "SABA",
        name: "沙巴",
        count: null,
        sort: 2,
        sbType: "OWS"
    },
    {
        id: "BTI",
        name: "BTI",
        count: null,
        sort: 1,
        sbType: "SBT"
    },
];
import { RabbitLegacy } from "crypto-js";
import actions from "@/lib/redux/actions/index";
import { getMoneyFormat, LiveChatOpenGlobe } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import { SearchIcon } from "$Components/icons/index";
import { ImagesUrl } from "@/images/index";
class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BtnPosTop: 0,
            BtnPosLeft: 0,
            gameDB: [...gameDBs],
            nowGame: "IM",
            nowGameName: "IM",
            gameMenuState: false,
            balance: "",
            maintenancePopup: false,
            eye: true,
            selfExclusionRestrictionModal: false,
            selfExclusion: "",
            isShowModal: false,
            sbType: this.props.sbType,
        };
        this.IMCountPollingKey = null;
        this.BTICountPollingKey = null;
        this.SABACountPollingKey = null;

        this.timer = null;
        this.isDidUnmount = null; //紀錄是否已unmount，判斷異步動作是否還要執行
        this.trCountDataHasSet = false;
    }
    componentWillMount(props) {
        this.getMaintenanceStatus();
    }
    componentDidMount() {
        this.isDidUnmount = false;
        this.checkCount("IM");
        // this.openDraws()
        if (ApiPort.UserLogin == true) {
            getAllVendorToken();
            this.getMemberNotificationSetting().catch((e) => console.log(e));
            this.props.userInfo_getBalanceSB(true);
        }
        this.changeGameType();
    }

    componentWillUnmount() {
        this.isDidUnmount = true;
        //刪除數量輪詢key
        VendorBTI.deletePolling(this.BTICountPollingKey);
        VendorIM.deletePolling(this.IMCountPollingKey);
        VendorSABA.deletePolling(this.SABACountPollingKey);
        clearTimeout(this.timer);
    }


    changeGameType() {
        const { sbType } = this.state;
        console.log("===sbType", sbType);
        const index = gameDBs.findIndex(v => sbType === v.sbType);
        if (index >= 0) {
            this.GameMenu(this.state.gameDB[index], true, true); //didmount時call 要忽略維護狀態，這樣才能正常展示維護中彈窗
        }

    }

    async openDraws() {
        const drawerOpenData = await StorageUtil.load("drawerOpen");
        if (!drawerOpenData) {
            setTimeout(() => { Actions.drawerOpen(); }, 1000);
            StorageUtil.save({
                key: "drawerOpen",
                data: "drawerOpen",
                expires: 24 * 60 * 60 * 1000
            });
        }
    }

    getMemberNotificationSetting = () => {
        let that = this;
        return new Promise((resolve, reject) => {
            window.fetchRequest(ApiPortSB.GetMemberNotificationSetting, "GET")
                .then((res) => {
                    if (res && res.result && res.result.memberCode && res.result.notificationSetting) {
                        //緩存
                        localStorage.setItem(
                            "NotificationSetting-" + res.result.memberCode,
                            JSON.stringify(res.result.notificationSetting)
                        );

                        //加載 盤口展示方式
                        const savedListDisplayType = res.result.notificationSetting["listDisplayType"];
                        let listDisplayType = 1;
                        if (parseInt(savedListDisplayType) === 2) {
                            listDisplayType = 2;
                        }
                        that.props.userSetting_updateListDisplayType(listDisplayType);

                        resolve(res.result.notificationSetting);
                    } else {
                        reject("GetMemberNotificationSetting no data??" + JSON.stringify(res));
                    }
                })
                .catch((e) => reject("GetMemberNotificationSetting failed" + JSON.stringify(e)));
        });
    };

    // 獲取維護資訊
    getMaintenanceStatus = () => {
        const providers = ["SBT", "IPSB", "OWS"]; // BTI, IM, SABA
        let processed = [];

        providers.forEach(function(provider) {
            processed.push(fetchRequest(`${ApiPortSB.GetProvidersMaintenanceStatus}providerCode=${provider}&`));
        });

        Promise.all(processed).then((res) => {
            let BTISportStatus;
            let IMSportStatus;
            let SABASportStatus;

            if (res) {
                BTISportStatus = res[0].isSuccess ? res[0].result : false;
                IMSportStatus = res[1].isSuccess ? res[1].result : false;
                SABASportStatus = res[2].isSuccess ? res[2].result : false;


                // BTISportStatus = true

                this.props.maintainStatus_setBTI(BTISportStatus === true);
                this.props.maintainStatus_setIM(IMSportStatus === true);
                this.props.maintainStatus_setSABA(SABASportStatus === true);

                //和token獲取狀態一起判斷
                BTISportStatus = this.checkMaintenanceStatus("bti");
                IMSportStatus = this.checkMaintenanceStatus("im");
                SABASportStatus = this.checkMaintenanceStatus("saba");

                // 都在維修
                if (BTISportStatus && IMSportStatus && SABASportStatus) {
                    Actions.RestrictPage({ from: "maintenance" });
                    return;
                }

                const maintenanceInfoMap = {
                    "BTI": {
                        sport: "BTI",
                        gameName: "BTI",
                        name: "BTI体育",
                        isMaintenance: BTISportStatus,
                    },
                    "IM": {
                        sport: "IM",
                        gameName: "IM",
                        name: "IM体育",
                        isMaintenance: IMSportStatus,
                    },
                    "SABA": {
                        sport: "SABA",
                        gameName: "沙巴",
                        name: "沙巴体育",
                        isMaintenance: SABASportStatus,
                    },
                };
                //如果有維修 按優先順序選擇 (直接復用上面的數據)
                const sportPriority = [
                    maintenanceInfoMap["IM"],
                    maintenanceInfoMap["SABA"],
                    maintenanceInfoMap["BTI"],
                ];
                const minfo = maintenanceInfoMap[lowerV];

                //當前遊戲正在維修
                if (minfo && minfo.isMaintenance) {
                    let targetGame = null;
                    //按優先順序 找一個 沒在維護中的遊戲
                    for (let spinfo of sportPriority) {
                        if (!spinfo.isMaintenance) {
                            targetGame = spinfo;
                            break;
                        }
                    }
                    if (targetGame === null) { //都在維護(理論上不可能跑到這，前面已經先檢查過了)
                        Actions.RestrictPage({ from: "maintenance" });
                        return;
                    } else {
                        this.setState(
                            {
                                maintenancePopup: true,
                                maintenanceSport: minfo.name,
                                jumpToSport: targetGame.name,
                            },
                            () => {}
                        );

                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            window.changeGame(targetGame.sport);
                            this.setState({
                                maintenancePopup: false,
                                gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort),
                                nowGame: targetGame.sport,
                                nowGameName: targetGame.gameName,
                            });
                        }, 8000);
                    }
                }
            }
        });
    };

    checkMaintenanceStatus = (name) => {
        const { isBTI, isIM, isSABA, noTokenBTI, noTokenIM, noTokenSABA } = this.props.maintainStatus;
        const { isLogin } = this.props.userInfo; //有登入才額外判斷 token獲取狀態
        switch (name) {
            case "bti":
                return isBTI || (isLogin && noTokenBTI);
            case "im":
                return isIM || (isLogin && noTokenIM);
            case "saba":
                return isSABA || (isLogin && noTokenSABA);
            default:
                return false;
        }
    };

    GameMenu(item, euro = false, ignoreMaintenance = false) {
        if (item && !ignoreMaintenance && this.checkMaintenanceStatus(item.id.toLowerCase())) { return; }
        if (this.state.nowGame == item.id) { return; }
        this.setState({
            nowGame: item ? item.id : this.state.nowGame,
            nowGameName: item ? item.name : this.state.nowGameName,
            gameMenuState: euro ? false : !this.state.gameMenuState
        });
        window.changeGame && window.changeGame(item.id);
        this.checkCount(item.id);
    }

    checkCount = async (id) => {

        //更新滾球數量
        const updateCount = (targetId) => {
            return (pollingResult) => {
                if (this.isDidUnmount) return;
                const SportDatas = pollingResult.NewData;
                let totalRunningCount = 0;
                SportDatas.map((sport) => {
                    const runningMarkets = sport.Markets.filter((m) => m.MarketId === 3); //3滾球
                    if (runningMarkets && runningMarkets.length > 0) {
                        totalRunningCount = totalRunningCount + runningMarkets[0].Count;
                    }
                });
                console.log("totalRunningCount", totalRunningCount);
                let targetIndex = -1;
                gameDBs.map((item, index) => {
                    if (item.id === targetId) {
                        targetIndex = index;
                    }
                });
                if (targetIndex > -1) {
                    gameDBs[targetIndex].count = totalRunningCount;
                    this.setState({ gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort) }, () => {
                        if (!this.trCountDataHasSet && this.state.gameDB.some(o => o.count !== null)) {
                            this.trCountDataHasSet = true;
                        }
                    });
                }
            };
        };

        const handleInitialCache = (cacheData) => {
            if (this.isDidUnmount) return;

            if (cacheData && (window.initialCache[id].isUsedForHeader !== true)) {
                if (!this.trCountDataHasSet) { //確定沒數據才用
                    console.log("=======Header USE API CACHE for trCount=======");
                    gameDBs.map((item) => {
                        item.count = cacheData.trCount[item.id];
                    });
                    this.setState({ gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort) }, () => {
                        this.trCountDataHasSet = true;
                    });
                }
                window.initialCache[id].isUsedForHeader = true; //標記為已使用
            } else {
                console.log("=======Header ABORT USE API CACHE=======");
            }
        };

        if (ApiPort.UserLogin !== true) {
            //優化Performance:未登入，優先等待並使用 initialCache
            let cacheData = await window.initialCache[id].cachePromise;
            handleInitialCache(cacheData);
        } else {
            //已登入則按原方式 initialCache 和 正常獲取 競速，先拿到的先用
            window.initialCache[id].cachePromise.then(handleInitialCache);
        }

        if (id === "IM") {
            //選中IM 只刷新BTI/SABA Count
            VendorIM.deletePolling(this.IMCountPollingKey);
            this.BTICountPollingKey = VendorBTI.getSportsPollingGlobal("headerCount", updateCount("BTI"));
            this.SABACountPollingKey = VendorSABA.getSportsPollingGlobal("headerCount", updateCount("SABA"));
        } else if (id === "BTI") {
            //選中BTI 刷新IM/SABA Count
            VendorBTI.deletePolling(this.BTICountPollingKey);
            this.IMCountPollingKey = VendorIM.getSportsPollingGlobal("headerCount", updateCount("IM"));
            this.SABACountPollingKey = VendorSABA.getSportsPollingGlobal("headerCount", updateCount("SABA"));
        } else if (id === "SABA") {
            //選中SABA 只刷新IM/BTI Count
            VendorSABA.deletePolling(this.SABACountPollingKey);
            this.IMCountPollingKey = VendorIM.getSportsPollingGlobal("headerCount", updateCount("IM"));
            this.BTICountPollingKey = VendorBTI.getSportsPollingGlobal("headerCount", updateCount("BTI"));
        }
    };


    Jump(key) {
        if (!ApiPort.UserLogin && key != "search") {
            Actions.Login({ from: "HomeHeader" });
            return;
        }
        Actions[key]({ Vendor: window.VendorData });
    }
    getBtnPos = (e) => {
        const { nativeEvent } = e;
        if (nativeEvent && nativeEvent.layout && nativeEvent.layout.y !== undefined) {
            this.setState({
                BtnPosTop: nativeEvent.layout.y,
                BtnPosLeft: nativeEvent.layout.x
            });
        }
    };

    chnageModal(isShowModal) {
        this.setState({
            isShowModal
        });


        //Actions.pop()
    }

    render() {
        //用于点击欧冠切换im
        window.GameMenus = (key) => {
            this.GameMenu(this.state.gameDB[key], true);
        };
        //header和home一起切換
        window.changeGameFullPage = (vendorName) => {
            let targetItem = null;
            this.state.gameDB.map(item => {
                if (item.id == vendorName) {
                    targetItem = item;
                }
            });
            if (targetItem) {
                this.GameMenu(targetItem, true); //euro = true表示不展示體育vendor下拉菜單
            }
        };
        const {
            nowGame,
            nowGameName,
            gameDB,
            gameMenuState,
            balance,
            eye,
            BtnPosTop,
            BtnPosLeft,
            maintenancePopup,
            selfExclusionRestrictionModal,
            selfExclusion,
            isShowModal,
        } = this.state;


        return (
            <View style={{ paddingTop: Platform.OS == "ios" ? (DeviceInfoIos ? (window.isDynamicIslandIOS ? 40 + 20 : 40) : 20) : 0, backgroundColor: "#05a6ff" }}>
                <RowCenterBetween style={styles.headerWrap}>

                    {/* 维护 */}
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={maintenancePopup}
                        onRequestClose={() => {}}
                    >
                        <View style={styles.modals}>
                            <View style={styles.modalView}>
                                <Image resizeMode='stretch' source={ImagesUrl.maintenance} style={{ width: 76, height: 76 }} />
                                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>平台维护通知</Text>
                                <Text style={{ color: "#999", lineHeight: 22 }}>亲爱的会员，{this.state.maintenanceSport}正在维护，</Text>
                                <Text style={{ color: "#999" }}>请稍后回来。我们将在8秒内带您前往{this.state.jumpToSport}。</Text>
                            </View>
                        </View>
                    </Modal>


                    {/*左邊遊戲切換*/}
                    <RowCenterCenter>
                        <NavBack
                            onPress={() => Actions.Home({})}
                        />

                        <RowCenterCenter style={{ marginLeft: 0 }}>
                            {gameDB.map((v, i) => {
                                const active = nowGameName === v.name;
                                const isLast = gameDB.length === i + 1;
                                return (
                                    <TouchableOpacity key={v.id} style={{ marginRight: isLast ? 0 : 15, position: "relative", justifyContent: "center" }} onPress={() => {
                                        this.GameMenu(v);
                                    }}>
                                        <View style={{ borderBottomColor: active ? "#fff" : "transparent", borderBottomWidth: 3, }}>
                                            <Text style={{ color: "#fff", fontSize: active ? 20 : 16 }}>{v.name}</Text>
                                        </View>
                                        {
                                            this.checkMaintenanceStatus(v.id.toLowerCase()) && <View style={styles.maintenance}><Text style={{ color: "#704708", fontSize: 10 }}>维修</Text></View>
                                        }
                                    </TouchableOpacity>
                                );
                            })}
                        </RowCenterCenter>
                    </RowCenterCenter>
                    {/*左邊遊戲切換*/}

                    {/*右邊按鈕*/}
                    <WalletNavRight
                        walletCode='SB'
                    >
                        <SearchIcon
                            onPress={() => {
                                this.props.changeOnClickPopup({ flag: false });
                                this.Jump("search");
                                PiwikEventDataHandle("SbSportsCN_SearchTopNav");
                            }}
                            fill={"#fff"}
                            wrapStyle={{ marginHorizontal: 8 }}></SearchIcon>
                    </WalletNavRight>

                </RowCenterBetween>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting,
});
const mapDispatchToProps = dispatch => ({
    userInfo_login: userName => dispatch(ACTION_UserInfo_login(userName)),
    userInfo_getBalanceSB: (forceUpdate = false) => dispatch(ACTION_UserInfo_getBalanceSB(forceUpdate)),
    maintainStatus_setBTI: isMaintenance => dispatch(ACTION_MaintainStatus_SetBTI(isMaintenance)),
    maintainStatus_setIM: isMaintenance => dispatch(ACTION_MaintainStatus_SetIM(isMaintenance)),
    maintainStatus_setSABA: isMaintenance => dispatch(ACTION_MaintainStatus_SetSABA(isMaintenance)),
    userSetting_updateListDisplayType: currentType =>
        dispatch(ACTION_UserSetting_Update({ ListDisplayType: currentType })),
    changeOnClickPopup: flag => dispatch(actions.ACTION_ONECLICKPOPUP(flag)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);

const styles = StyleSheet.create({
    maintenance: {
        borderColor: "#FFEDA6",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#FFEDA6",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: 26,
        height: 16,
        top: -13,
        right: -5
    },

    headerWrap: {
        height: 40,
        width: width,
        backgroundColor: "#00a6ff",
        zIndex: 50,
    },
    modalView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    modals: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});
