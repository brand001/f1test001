import React from "react";
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
    Settings,
    SafeAreaView
} from "react-native";
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
import { Toasts } from "$Toasts";
import {
    ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetSABA
} from "../lib/redux/actions/MaintainStatusAction";
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from "$LIB/redux/actions/UserInfoAction";
import { ACTION_UserSetting_Update } from "../lib/redux/actions/UserSettingAction";
import VendorBTI from "../lib/vendor/bti/VendorBTI";
import VendorIM from "../lib/vendor/im/VendorIM";
import VendorSABA from "../lib/vendor/saba/VendorSABA";
import { getAllVendorToken } from "../lib/js/util";
import { ApiPortSB } from "../lib/SPORTAPI";
const newSelsctDate3 = [1, 2, 3, 4, 5];
import { SearchIcon } from "$Components/icons/index";
import DeviceInfo from "react-native-device-info";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
const IphoneXMax = ["iPhone 5", "iPhone 5s", "iPhone 6", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus", "iPhone SE"];
const getModel = DeviceInfo.getModel();
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === "ios";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
let gameDBs = [
    {
        id: "IM",
        name: "IM",
        count: null,
        sort: 1,
        sbType: "IPSB",
        width: !ApiPort.UserLogin ? 44 : 38
    },
    {
        id: "SABA",
        name: "SABA",
        count: null,
        sort: 0,
        sbType: "OWS",
        width: !ApiPort.UserLogin ? 62 : 60,
    },
    {
        id: "BTI",
        name: "BTi",
        count: null,
        sort: 2,
        sbType: "SBT",
        width: !ApiPort.UserLogin ? 44 : 40
    },
];

import actions from "@/lib/redux/actions/index.js";
import WalletNavRight from "$Components/Nav/GameNav/WalletNavRight.js";
import NavBack from "$Components/Nav/NavBack";
import { ImagesUrl } from "@/images/index";
import StorageUtil from "$Utils/Storage";

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
            balanceInfor: [],
            walletInfor: {
                localizedName: "",
                balance: 0
            },
            walletCode: "SB",
            arrowFlag: false,
            isShowWalletModal: false,
            Toasts: "",
            ToastsMsg: "1",
            isCallServingPreBonus: true
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
        // this.checkCount('IM')
        this.checkCount(lowerV);
        // this.openDraws()
        if (ApiPort.UserLogin == true) {
            this.props.userInfo_getBalance();
            this.props.userInfo_getBalanceSB(true);
            getAllVendorToken();
            this.getMemberNotificationSetting().catch((e) => console.log(e));
        }
        this.changeGameType();
        //餘額
        const { allBalance } = this.props.userInfo;
        if (Array.isArray(allBalance) && allBalance.length) {
            let balanceInfor = allBalance;

            this.setState({
                balanceInfor
            }, () => {
                const { balanceInfor, walletCode } = this.state;
                let walletInfor = balanceInfor.find(v => v.name == walletCode) || {
                    localizedName: "",
                    balance: 0
                };

                this.setState({
                    walletInfor
                });
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && Array.isArray(nextProps.userInfo.allBalance) && nextProps.userInfo.allBalance.length) {
            let balanceInfor = nextProps.userInfo.allBalance;
            this.setState({
                balanceInfor
            }, () => {
                const { balanceInfor, walletCode } = this.state;
                let walletInfor = balanceInfor.find(v => v.name == walletCode) || {
                    localizedName: "",
                    balance: 0
                };

                this.setState({
                    walletInfor
                });
            });
        }
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
            // CXFUN88-4323: 改用febff，apiVersion=8.0 && 8.0 xbffKey
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

                this.props.maintainStatus_setBTI(BTISportStatus === true);
                this.props.maintainStatus_setIM(IMSportStatus === true);
                this.props.maintainStatus_setSABA(SABASportStatus === true);

                //和token獲取狀態一起判斷
                BTISportStatus = this.checkMaintenanceStatus("bti");
                IMSportStatus = this.checkMaintenanceStatus("im");
                SABASportStatus = this.checkMaintenanceStatus("saba");

                // 都在維修
                if (BTISportStatus && IMSportStatus && SABASportStatus) {
                    this.setState(
                        {
                            maintenancePopup: true,
                            allMaintenance: true,
                        },
                        () => {}
                    );

                    this.jump2homeTimeoutHandler = setTimeout(() => {
                        //5秒回home
                        // Actions.pop();
                        Actions.Home();
                        this.setState(
                            {
                                maintenancePopup: false,
                            }
                        );
                        this.props.playGame({
                            providerCode: "CML",
                            gameId: null,
                            categoryCode: "Sportsbook"
                        });
                        //goToVenderGame('CMD');
                    }, 8000);
                    // Actions.RestrictPage({ from: 'maintenance' })
                    // return
                }

                const maintenanceInfoMap = {
                    "BTI": {
                        sport: "BTI",
                        gameName: "BTi",
                        name: "Thể Thao BTi",
                        isMaintenance: BTISportStatus,
                    },
                    "IM": {
                        sport: "IM",
                        gameName: "IM",
                        name: "Thể Thao IM",
                        isMaintenance: IMSportStatus,
                    },
                    "SABA": {
                        sport: "SABA",
                        gameName: "SABA",
                        name: "Thể Thao SABA", //沙巴体育
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
                        // Actions.RestrictPage({ from: 'maintenance' })
                        // return
                        this.setState(
                            {
                                maintenancePopup: true,
                                allMaintenance: true,
                            },
                            () => {}
                        );
                    } else {
                        this.setState(
                            {
                                allMaintenance: false,
                                maintenanceSport: minfo.name,
                                jumpToSport: targetGame.name,
                            },
                            () => {
                                this.setState({ maintenancePopup: true });
                            }
                        );
                        this.jump2homeTimeoutHandler = setTimeout(() => {
                            //5秒回home
                            // Actions.pop();


                            window.changeGame(targetGame.sport);
                            this.setState({
                                maintenancePopup: false,
                                gameDB: [...gameDBs].sort((a, b) => a.sort - b.sort),
                                nowGame: targetGame.sport,
                                nowGameName: targetGame.gameName,
                            });
                        }, 8000);
                        // clearTimeout(this.timer);
                        // this.timer = setTimeout(() => {
                        // 	window.changeGame(targetGame.sport)
                        // 	this.setState({
                        // 		maintenancePopup: false,
                        // 		gameDB:  [...gameDBs].sort((a, b) => a.sort - b.sort),
                        // 		nowGame: targetGame.sport,
                        // 		nowGameName: targetGame.gameName,
                        // 	})
                        // }, 8000)
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
        if (item.id == "IM") {
            PiwikEventDataHandle("SbSportsVN_IMTopNav");
        } else if (item.id == "BTI") {
            PiwikEventDataHandle("SbSportsVN_BTiTopNav");
        } else if (item.id == "SABA") {
            PiwikEventDataHandle("SbSportsVN_OWTopNav");
        }

        this.setState({
            nowGame: item ? item.id : this.state.nowGame,
            nowGameName: item ? item.name : this.state.nowGameName,
            gameMenuState: euro ? false : !this.state.gameMenuState
        });
        window.clickWC && window.clickWC();
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
        console.log(key, "kkkkks");
        if (!ApiPort.UserLogin && key != "search") {
            Actions.Login({ types: "login", from: "sbhome" });
            return;
        }
        Actions[key]({ Vendor: window.VendorData });
    }
    getBtnPos = (e) => {
        NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
            this.setState({
                BtnPosTop: py,
                BtnPosLeft: px,
            });
            console.log("pypypypypypypy", py);
        });
    };

    chnageModal(isShowModal) {
        this.setState({
            isShowModal
        });


        //Actions.pop()
    }

    //箭頭展開
    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        });
    }

    activeToPage(type) {
        window.isGamePageToFiance = true;
        this.setState({
            isShowSbTip: false,
            isShowKenoTip: false,
            isShowWalletModal: false
        });
        const { walletCode } = this.state;
        this.modalDropdown && this.modalDropdown.hide();
        this.changeArrowStatus(false);
        // window.checkMemberStatus(type, true, '', walletCode)
        Actions[type]();

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
        //自我锁定弹窗
        // window.GetSelfExclusionRestriction = (key) => {
        // 	return false
        // }

        window.KeyBoardHeaderToast = (Toasts, ToastsMsg) => {
            //组件Toast在modal下面处理
            this.setState({ Toasts, ToastsMsg });
            setTimeout(() => {
                this.setState({
                    Toasts: "",
                    ToastsMsg: "",
                });
            }, 3000);
        };


        const gameHeaderPaddingTop = (isIphoneMax ? 45 : 25);

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
            jumpToSport,
            allMaintenance,
            balanceInfor,
            walletInfor,
            arrowFlag,
            isShowWalletModal,
            Toasts, ToastsMsg,
            tranferLoading
        } = this.state;
        const { allBalance } = this.props.userInfo;
        const GameWrapComponent = (DeviceInfoIos ? SafeAreaView : View);
        return <View>
            <View style={{ paddingTop: Platform.OS == "ios" ? (DeviceInfoIos ? (window.isDynamicIslandIOS ? 40 + 20 : 40) : 20) : 0, backgroundColor: "#00a6ff", }}></View>
            {/* 錢包顯示Modal */}
            <RowCenterBetween style={styles.headerWrap}>
                {/*左邊遊戲切換*/}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NavBack
                        onPress={() => {
                            this.props.changeOnClickPopup({ flag: false });
                            Actions.Home({});
                        }}
                    />
                    <View style={{ flexDirection: "row", marginLeft: -10 }}>
                        {gameDB.map((item, index) => {
                            let selected = item.name == nowGameName;
                            return (
                                <Touch onPress={() => {
                                    this.props.changeOnClickPopup({ flag: false });
                                    this.GameMenu(item);
                                }}
                                    style={[styles.gameList, { borderBottomWidth: selected ? 3 : 0 }]}>
                                    <Text style={[styles.GameMenuText,
                                    {
                                        fontWeight: selected ? "bold" : "400",
                                        fontSize: selected ? 16 : 14
                                    }]}
                                    >{item.name}</Text>
                                    {
                                        this.checkMaintenanceStatus(item.id.toLowerCase()) && <View style={[styles.maintenance, { position: "absolute", right: -3, top: -3 }]}>
                                            <Text style={{ color: "#363636", fontSize: 9 }}>Bảo Trì</Text>
                                        </View>

                                    }
                                </Touch>
                            );
                        })}
                    </View>
                </View>

                {/*左邊遊戲切換*/}
                <WalletNavRight
                    walletCode='SB'
                >
                    <SearchIcon
                        onPress={() => {
                            this.props.changeOnClickPopup({ flag: false });
                            this.Jump("search");
                            PiwikEventDataHandle("SbSportsVN_SearchTopNav");
                        }}
                        fill={"#fff"}
                        wrapStyle={{ marginHorizontal: ApiPort.UserLogin && Platform.OS == "android" ? 6 : 8 }}></SearchIcon>
                </WalletNavRight>
            </RowCenterBetween>

            {/* 维护 */}
            <Modal
                animationType="none"
                transparent={true}
                visible={maintenancePopup}
                onRequestClose={() => {}}
            >
                <View style={styles.modals}>
                    <View style={[styles.modalView, { width: width * 0.85 }]}>
                        <Image resizeMode='stretch' source={ImagesUrl.maintenance} style={{ width: 65, height: 65 }} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", lineHeight: 50 }}>Thông Báo Bảo Trì</Text>
                        <Text style={{ color: "#666666", fontSize: 13, textAlign: "center", paddingBottom: 10, lineHeight: 18 }}>
                            {`Chào Bạn, ${"\n"} ${nowGameName == "IM" ? "Thể Thao IM" : nowGameName == "SABA" ? "Thể Thao SABA" : "Thể Thao BTi"} đang bảo trì, vui lòng quay lại sau. Chúng tôi sẽ chuyển bạn qua ${allMaintenance ? "Thể Thao CMD" : jumpToSport} sau 8 giây để tiếp tục cược. Cảm ơn!`}
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>;
    }
}


const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = (dispatch) => ({
    userInfo_login: userName => ACTION_UserInfo_login(userName),
    userInfo_getBalanceSB: (forceUpdate = false) => dispatch(ACTION_UserInfo_getBalanceSB(forceUpdate)),
    maintainStatus_setBTI: (isMaintenance) => dispatch(ACTION_MaintainStatus_SetBTI(isMaintenance)),
    maintainStatus_setIM: (isMaintenance) => dispatch(ACTION_MaintainStatus_SetIM(isMaintenance)),
    maintainStatus_setSABA: (isMaintenance) => dispatch(ACTION_MaintainStatus_SetSABA(isMaintenance)),
    userSetting_updateListDisplayType: (currentType) => dispatch(ACTION_UserSetting_Update({ ListDisplayType: currentType })),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
    playGame: (data) => dispatch(actions.ACTION_PlayGame(data)),
    changeOnClickPopup: (flag) => {
        dispatch(actions.ACTION_ONECLICKPOPUP(flag));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);

const styles = StyleSheet.create({
    leftIcon: {
        width: 26,
        height: 26
    },
    homeLeftWrap: {
        justifyContent: "center",
        alignItems: "center",
    },
    selfExclusionBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        width: width * 0.9 - 30,
        backgroundColor: "#00A6FF",
        borderRadius: 8,
    },
    selfExclusionTitle: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        backgroundColor: "#00A6FF",
        width: width * 0.9,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    selfExclusionMsg: {
        padding: 15,
        paddingBottom: 25,
        paddingTop: 25,
        lineHeight: 18,
        color: "#000",
        fontSize: 13,
    },
    selfExclusion: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingBottom: 20,
    },
    maintenance: {
        borderColor: "#FFEDA6",
        borderWidth: 1,
        // padding: 3,
        borderRadius: 5,
        backgroundColor: "#FFEDA6",
    },
    modalMark: {
        width: width,
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
    },
    gameList: {
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "#fff",
        paddingHorizontal: ApiPort.UserLogin ? (Platform.OS == "android" ? 3 : 10) : 12,
    },
    gameListDown: {
        width: 90,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    gameMenuModals: {
        flex: 1,
        width: width,
    },
    GameMenu: {
    },
    GameMenuText: {
        lineHeight: 30,
        color: "#fff",
        fontSize: 16,
    },
    GameMenuTextB: {
        lineHeight: 35,
        color: "#000",
        // fontSize: 16,
    },
    GameMenuTextC: {
        lineHeight: 35,
        color: "#00A6FF",
        fontSize: 16,
    },
    Gamedropdown: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: 100,
        backgroundColor: "#fff",
        borderRadius: 8,
        position: "absolute",
        zIndex: 99,
    },
    arrow: {
        top: 9,
        left: 8,
        width: 0,
        height: 0,
        borderTopWidth: 9,
        borderTopColor: "#fff",
        borderRightWidth: 6,
        borderRightColor: "transparent",
        borderLeftWidth: 6,
        borderLeftColor: "transparent",
        borderBottomWidth: 7,
        borderBottomColor: "transparent",
    },
    MoneyBG: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // flex: 1,
        alignSelf: "center",
        // left: 25,
        // marginRight:10
    },
    dropdown_D_text1: {
        paddingBottom: 3,
        fontSize: 15,
        color: "#00A6FF",
        textAlignVertical: "center",
        lineHeight: 30,
        textAlign: "center",
    },
    dropdown_D_text2: {
        paddingBottom: 3,
        fontSize: 15,
        color: "#fff",
        textAlignVertical: "center",
        lineHeight: 30,
        textAlign: "center",
    },
    dropdown_DX_dropdown: {
        height: 40 * 2,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        elevation: 4,
        backgroundColor: "#fff"
    },
    selectShow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#fff",
        width: 100,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    selectHide: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: 100,
    },
    modalViewContainer: {
        width,
        height,
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100000,
    },
    WalletModalDropdownList: {
        height: 35,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    walletSbIconBox: {
        marginLeft: 6
    },

    walletSbIcon: {
        width: 18,
        height: 18
    },
    moneyTranferBox: {
        flexDirection: "row",
        alignItems: "center"
    },
    tranferBtnBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
        paddingBottom: 15,
    },
    tranferBtn: {
        height: 40,
        width: (width - 20) * .45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        borderColor: "#26A9E1",
        borderWidth: 2
    },
    tranferBtnText: {
        fontSize: 13
    },
    walletSbTipbox: {
        backgroundColor: "#FFF4D0",
        borderWidth: 1,
        borderColor: "#EDE473",
        position: "absolute",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        left: ((width - 10) * .1) / 2,
        top: -60,
        borderRadius: 4,
        zIndex: 10,
        width: (width - 10) * .9,
        shadowColor: "#0000001A",
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
    },
    walletSbTipboxText: {
        color: "#676767",
        fontSize: 12,
        flexWrap: "wrap",
        width: (width - 10) * .9 - 40,
        lineHeight: 18
    },
    walletSbTipboxBtn: {
        marginLeft: 8
    },
    walletSbTipboxBtnText: {
        color: "#676767",
        fontSize: 16
    },
    walletSbTipArrow: {
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: 8,
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#FFF4D0",
        position: "absolute",
        left: width * .38,
        bottom: -15,
        shadowColor: "#0000001A",
        shadowRadius: 8,
        shadowOpacity: .1,
        shadowOffset: { width: 2, height: 2 },
        elevation: 10
    },
    formatbalanceInfortBoxImg: {
        width: 22,
        height: 22,
    },
    formatbalanceInfortBox: {
        marginLeft: 14
    },
    tranferBtnText: {
        fontSize: 13
    },
    walletBox: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        justifyContent: "center",
        height: 40,
        overflow: "hidden",
        borderRadius: 6,
        overflow: "hidden",
    },
    walletLeftBox: {
        alignItems: "flex-end",
        marginRight: 10
    },
    walletRightBoxText1: {
        color: "#58585B",
        fontWeight: "bold",
        fontSize: 13
    },
    walletLeftBoxText2: {
        color: "#58585B",
        fontSize: 10,
        marginBottom: 2
    },
    balanceLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    balanceLeftCircle: {
        width: 8,
        height: 8,
        borderRadius: 100,
        marginRight: 8
    },
    walletContent: {
        flexDirection: "row",
        backgroundColor: "#FCFEFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 120,
        paddingLeft: 5,
        paddingRight: 3,
        paddingVertical: 3,
    },
    boxView: {
        height: height * 0.9,
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
    },
    toastView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 99,
        left: 0,
    },
    toastErr: {
        backgroundColor: "#ffdada",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        zIndex: 10000,
        top: "30%",
        maxWidth: width * 0.9,
        alignSelf: "center"

    },
    toastSuccess: {
        backgroundColor: "#daffe3",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        zIndex: 10000,
        top: "30%",
        maxWidth: width * 0.9,
        alignSelf: "center"
    },
    toastLoading: {
        backgroundColor: "#4D4E59",
        padding: 15,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 10000,
        top: "30%",
        maxWidth: width * 0.9,
        alignSelf: "center"
    },
    topNav: {
        width: width,
        height: Platform.OS === "ios" ? 44 : 50,
        // paddingTop: 80,
        zIndex: 100,
        position: "relative",
        backgroundColor: "#00a6ff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
});
