import React, { Component } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View, Platform, Linking, LogBox } from "react-native";
import Orientation from "react-native-orientation-locker";
Orientation.lockToPortrait();
import DeviceInfo from "react-native-device-info";
if (__DEV__) {
    // 1. 屏蔽指定警告
    LogBox.ignoreLogs([
        "Possible Unhandled Promise Rejection",
    ]);

    // 2. 或完全屏蔽全部警告（不推荐）
    LogBox.ignoreAllLogs(true);

}

import { Provider, connect } from "react-redux";
import CodePush from "react-native-code-push";
import Service from "./actions/Service"; //請求
import ServiceSB from "./actions/ServiceSB"; //SB請求
import Config, { lives } from "../android/config";
import "../domain";
import * as Sentry from "@sentry/react-native";
import { AppProvider } from "./contexts/AppContext";
import { GlobalModalProvider } from "./contexts/GlobalModalContext";
import GlobalModalWrapper from "./components/GlobalModal/GlobalModalWrapper";
import Api, { SentryVersion } from "./actions/Api"; //api
import localStorage from "./actions/localStorage";
import { timeout_fetch } from "$Utils/SportRequest";
import { NotificationDevice } from "./actions/NotificationDevice";
import { SafeAreaProvider } from "react-native-safe-area-context";
const { androidForceVersion, iosForceVersion } = require("./actions/Api.json");


import Main from "./containers/Main";
import { Provider as ToastProvider } from "@ant-design/react-native";
import { Toasts, ToastRoot } from "$Toasts";
import SplashScreen from "react-native-splash-screen";
import store, { resetReducer, clearAllReduxData } from "./lib/redux/store/index";
import { ACTION_MaintainStatus_NoTokenBTI, ACTION_MaintainStatus_NoTokenIM, ACTION_MaintainStatus_NoTokenSABA, } from "./lib/redux/actions/MaintainStatusAction";
import OnboardingCarousel from "$Components/SplashScreen/OnboardingCarousel";
import LaunchAdCarousel from "$Components/SplashScreen/LaunchAdCarousel";
import { Actions } from "react-native-router-flux";
import actions from "./lib/redux/actions";
import { SeonReactNativeMobileWrapper as Seon } from "@seontechnologies/seon-react-native-mobile-wrapper";
import FirebasePush from "./actions/FirebasePush";
import { translate, SetDefaultConfig } from "$locales/translate";
import { GameLockToast, LogoutUtil, GetDownloadUrl, CheckLogin } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { PiwikInit } from "@/actions/PiwikEventData";
import FilledButton from "$Components/FilledButton";
import JPushConfig from "./actions/JPush";
import { GetCopyData, GetLanguage } from "./actions/GetCopyCode";

import AIGame from "$ALLSHARED/contexts/ParentContext";
import { PLATFORM } from "$ALLSHARED_CONSTANTS";
import GameCard from "$Components/GameCard";
import { useGame } from "$Hooks";


import {
    EventData,
    HostConfig,
    VendorIM,
    VendorSABA,
    VendorBTI
} from "$Utils/SbSportsBridge";
window.DeviceLanguage = "CN";


//codepush key線上
const IosLive = "";
const AndroidLive = "";
import { RootSiblingParent, RootSiblingPortal } from "react-native-root-siblings";
import { ColumnCenterCenter } from "$Components/CustomView";
import Color from "$Components/Color";
const { width, height } = Dimensions.get("window");

if (window.isStaging == "LIVE") {
    //只做prod
    const SentryKey =
        Platform.OS === "android"
            ? "https://e460351d645649b4818ea5b75905f00d@o4505089682112512.ingest.us.sentry.io/4505089683030016"
            : "https://de5592466dfe45a2a88fa3941e5b478d@o4504796223832064.ingest.us.sentry.io/4504868850302976";
    Sentry.init({
        release: SentryVersion,
        dist: SentryVersion,
        dsn: SentryKey,
        tracesSampleRate: 1,
        attachScreenshot: true,
        beforeSend(event, hint) {
            if (event.exception && event.exception.values) {
                for (const exception of event.exception.values) {
                    if (exception.mechanism && exception.mechanism.type === "onerror") {
                        // 保留onerror机制类型的错误
                        return event;
                    }
                }
            }
            return null;
        },
    });
}


// AppContent component contains all the main logic
class AppContent extends Component {
    constructor() {
        super();
        this.state = {
            progress: "",
            restartAllowed: true,
            updataTexe: "",
            CodeKey: Platform.OS === "android" ? CodePushKeyAndroid : CodePushKeyIOS,
            isMandatory: false,
            percent: 0,
            percentDone: false,
            isRollback: false,
            CloseVersion: false,
            androidVersion: Rb88Version,
            userCheckBtnClick: "",
            CheckUptate: true,
            codepushUpDate: false,
            mainLoading: 0,
            showProgress: false,
            updataMsg: translate("优化用户体验"),
        };
        this.appInitUrl = null;
        this.preGetAppInitUrlPromise = this.preGetAppInitUrl();
        this.checkVersionTime = null;
    }

    async componentWillMount(flag = true) {
        Orientation.lockToPortrait();
        await GetCopyData();
        CodePush.disallowRestart(); //禁止重启
        if (flag) {
            await GetLanguage();
        }

        await this.getSplashScreenHide();
        store.dispatch(actions.ACTION_CMSMAINSITESTATUS()); // 判定strapi smartIcon開啟狀態
        this.initSB();
    }

    componentDidMount() {
        Orientation.lockToPortrait();

        CodePush.allowRestart(); //在加载完了，允许重启
        this.CloseVersion(true);
        // 优化轮询：降低频率到60秒，添加清理机制
        this.versionCheckInterval = setInterval(() => {
            this.CloseVersion();
        }, 60000);
        this.codepushReset();
        //app未開啟情況下，被scheme喚醒處理
        this.callAppInitialUrl();
        //APP已開啟情況下，在背景中被scheme喚醒(監聽)
        Linking.addEventListener("url", this.callAppEventHandler);
        this.getSeon();
        NotificationDevice();

        if (Platform.OS === "android" && window.DeviceLanguage == "CN") {
            JPushConfig.init();
        }
    }


    initSB() {
        if (window.LANGUAGE == "TH") return;

        // 初始化SB Service
        ServiceSB();

        const defaultCachePromise = new Promise(resolve => resolve(null));

        window.initialCache = {};
        ["IM", "SABA", "BTI"].map(s => {
            window.initialCache[s] = {
                isUsed: false,
                isUsedForHeader: false,
                cachePromise: defaultCachePromise,
            };
        });

        //獲取初始緩存數據
        window.getInitialCache = VendorName => {
            window.initialCache[VendorName].cachePromise = timeout_fetch(
                fetch(HostConfig.Config.CacheApi + "/cache/v4/" + VendorName.toLowerCase()),
                3000, //最多查3秒，超過放棄
            )
                .then(response => response.json())
                .then(jsonData => {
                    let newData = {};
                    newData.trCount = jsonData.trCount;
                    newData.count = jsonData.count;
                    newData.list = jsonData.list.map(ev => EventData.clone(ev)); //需要轉換一下

                    return newData;
                })
                .catch(e => {
                    window.initialCache[VendorName].isUsed = true; //報錯 就標記為已使用
                });
            return window.initialCache[VendorName].cachePromise;
        };

        //獲取首屏緩存服務器數據(IM)
        window.getInitialCache("IM").finally(() => {
            //等IM獲取到，才獲取其他Vendor
            ["SABA", "BTI"].map(VendorName => {
                window.getInitialCache(VendorName);
            });
        });

        //獲取歐洲杯聯賽id
        // timeout_fetch(
        //   fetch(HostConfig.Config.CacheApi + "/ec2021leagues"),
        //   3000 //最多查3秒，超過放棄
        // )
        //   .then((response) => response.json())
        //   .then((jsonData) => {
        //     window.EuroCup2021LeagueIds = jsonData.data;
        //   })
        //   .catch((e) => {
        //   });

        //全局綁定維護狀態切換函數
        global.maintainStatus_noTokenBTI = isNoToken => store.dispatch(ACTION_MaintainStatus_NoTokenBTI(isNoToken));
        global.maintainStatus_noTokenIM = isNoToken => store.dispatch(ACTION_MaintainStatus_NoTokenIM(isNoToken));
        global.maintainStatus_noTokenSABA = isNoToken => store.dispatch(ACTION_MaintainStatus_NoTokenSABA(isNoToken));
    }

    getSeon = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            Seon.setSessionId("c78c9f6f-5878-6e4b-36f9-d43e42f0c786");
            PiwikInit();

            // 檢查是否為真機，模擬器不執行 SEON fingerprint
            const isEmulator = await DeviceInfo.isEmulator();

            if (isEmulator) {
                console.log("Running on simulator, skipping SEON fingerprint");
                return;
            }
            try {
                const fingerprint = await Seon.getFingerprintBase64();
                StorageUtil.save({ key: "seonFingerprint", data: fingerprint });
            } catch (error) {
                console.log("SEON initialization failed:", error);
            }
        } catch (e) {
        }
    };

    getSplashScreenHide = async () => {
        // 1 首次进入  2 倒计时  3 取消倒计时，进入main
        try {
            const res = await StorageUtil.load("homeHomeStatus");
            if (res) {
                this.setState({
                    mainLoading: 2,
                });
            } else {
                this.setState({
                    mainLoading: 1,
                });
            }
        } catch (error) {
            this.setState({
                mainLoading: 1,
            });
        }
        Orientation.lockToPortrait();
        await new Promise(resolve => setTimeout(resolve, 400));
        SplashScreen.hide();
        Orientation.lockToPortrait();
    };

    componentWillUnmount() {
        Linking.removeEventListener && Linking.removeEventListener("url", this.callAppEventHandler);
        // 清理版本检查轮询
        if (this.versionCheckInterval) {
            clearInterval(this.versionCheckInterval);
            this.versionCheckInterval = null;
        }
        this.clearCheckVersionTime();
    }


    //app已開啟，在背景被scheme喚醒 處理函數
    callAppEventHandler = event => {
        this.handleCallAppUrl(event.url, "event");
    };

    //APP未開啟，scheme喚醒APP判斷
    callAppInitialUrl = async () => {
        await this.preGetAppInitUrlPromise;
        this.handleCallAppUrl(this.appInitUrl, "init");
    };

    getPromotionContent(promotionId = null) {
        Toasts.loading(translate("加载中,请稍候..."), 10);
        const pid = promotionId ? `?id=${promotionId}` : "";
        fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_Promotion}${pid}`, "GET")
            .then(data => {
                Toasts.removeAll();
                if (GameLockToast()) return;

                Actions.SbSports({
                    sbType: "IPSB",
                });
                Actions.promotionSBWrap();
                Actions.PromotionsDetail({ Detail: data });
            })
            .catch(error => {
            });
    }

    //喚醒app url公用處理函數
    handleCallAppUrl = (url, source) => {
        if (url) {
            if (source === "init") {
                //初始url只用一次，拿到就可以清理掉了，這個函數裡面的url參數是by value，不會被影響
                this.appInitUrl = null;
            }
            //F1APP://sb20?type=wcp&deeplink=news&nid=8767 世界杯新聞
            //F1APP://sb20?deeplink=im&sid=2&eid=45678&lid=89012  sb2.0專用
            //F1APP://sb20?deeplink=promo&pid=8833 //sb優惠
            const urlData = url?.split("//")[1];
            const urlArray = urlData?.split("?");
            const linkType = urlArray[0];

            //只先支持 sb2.0
            if (linkType === "sb20") {
                const queryStrings = urlArray[1];

                let list = {};
                queryStrings &&
                    queryStrings?.split("&").forEach((item, i) => {
                        list[item?.split("=")[0]] = item?.split("=")[1] || "";
                    });

                //處理代理號，存入storage
                if (list.aff && list.aff.length > 0) {
                    StorageUtil.save({
                        key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
                        data: list.aff,
                    });
                }

                if (list.token && list.rtoken) {
                    // window.isMobileOpen = true;
                } else {

                    // 跳轉sb優惠
                    if (list.deeplink === "promo" && list.pid) {
                        this.checkModalStatus(this.getPromotionContent, list.pid);
                        return;
                    }

                    // sb體育詳情頁
                    if (list.deeplink && list.sid && list.eid && list.lid) {
                        this.checkModalStatus(window.openSB20Detail, list.deeplink, list.sid, list.eid, list.lid);
                    }
                }
            }
        }
    };

    //檢查是否剛好開啟Modal，是的話先關閉
    checkModalStatus = (callback, ...callbackArgs) => {
        if (this.state.mainLoading == 1 || this.state.mainLoading == 2) {
            this.setState({ mainLoading: 3 }, () => {
                callback && callback(...callbackArgs);
            });
        } else {
            callback && callback(...callbackArgs);
        }
    };

    //獲取並存下喚醒Url => 用來判斷是否展示全屏倒數廣告頁
    preGetAppInitUrl = () => {
        return Linking.getInitialURL()
            .then(url => {
                this.appInitUrl = url;
                return url;
            })
            .catch(err => {
                return null;
            });
    };


    closeOnboardingModal() {
        this.setState({
            mainLoading: 3,
        });
        StorageUtil.save({
            key: "homeHomeStatus",
            data: true,
        });
    }

    closeLaunchAdModal() {
        this.setState({
            mainLoading: 3,
        });
    }

    CloseVersion = (isCodePush = false) => {
        if (__DEV__) return;
        fetchRequestCMS(`${Strapi_Domain + ApiPort.downloadApp}`, "GET")
            .then(res => {
                if (window.AppForceUpdate) {
                    //采用m1判断版本号
                    const data = res || {};
                    if (data.androidForceUpdate && Platform.OS === "android") {
                        //开启强更新时候，检查Android本地version和androidVersion是否相同，不同可能是codepush没吃到，要提示重新安装
                        this.setState({ androidVersion: data.androidVersion });
                    }

                    if (Platform.OS === "ios") {
                        //iOS强更新
                        if (data.iosForceUpdate && data.iosForceVersion != iosForceVersion) {
                            this.setState({ CloseVersion: true });
                        }
                    }

                    if (Platform.OS === "android") {
                        //Android强更新
                        if (data.androidForceUpdate && data.androidForceVersion != androidForceVersion) {
                            this.setState({ CloseVersion: true });
                        }
                    }
                }
            })
            .catch(error => {

            });

        setTimeout(() => {
            isCodePush && this.CheckUptate();
        }, 6000);
    };

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ syncMessage: "检查更新" }); //检查更新
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ syncMessage: "下载中" }); //下载中
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ syncMessage: "正在安装更新" }); //正在安装更新
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        let percent = parseInt((progress.receivedBytes / progress.totalBytes) * 100);
        // percent进度百分比
        this.setState({ percent });
        if (percent >= 100) {
            setTimeout(() => {
                //延迟2秒，确保全部更新完毕
                if (this.state.isMandatory == false) {
                    const userCheckBtnClick = this.state.userCheckBtnClick ? "upDateDone" : "";
                    this.setState({ userCheckBtnClick, codepushUpDate: true });
                } else {
                    this.setState({ percentDone: true });
                }
            }, 2000);
        }
    }

    syncImmediate = async () => {
        if (this.state.isMandatory == true) {
            this.setState({ showProgress: true, codepushUpDate: true });
            setTimeout(() => {
                //30s后进度条为0且未更新完成，可能出现rollback，去重新下载安装，1111
                if (this.state.codepushUpDate && this.state.percent == 0) {
                    this.setState({
                        CloseVersion: true,
                        isRollback: "codepush",
                    });
                }
            }, 30 * 1000);
            await CodePush.sync({
                deploymentKey: this.state.CodeKey,
                installMode: CodePush.InstallMode.ON_NEXT_RESTART,
                mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
            },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgress.bind(this)
            );
            return;
        }

        await CodePush.sync({
            deploymentKey: this.state.CodeKey,
            installMode: CodePush.InstallMode.ON_NEXT_RESUME
        },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    };

    //codepush更新失败或是timeout，20s后切换可以再次更新
    codepushReset = () => {
        setTimeout(() => {
            if (!this.state.CheckUptate) {
                this.setState({ CheckUptate: true });
            }
        }, 20000);
    };
    clearCheckVersionTime = () => {
        if (this.checkVersionTime) {
            clearTimeout(this.checkVersionTime);
            this.checkVersionTime = null;
        }

    };
    checkVersionCode = () => {
        //没有codepush和强更新，检查versionCode是否相同，不同要提示重新下载安装
        this.clearCheckVersionTime();
        this.checkVersionTime = setTimeout(() => {
            const { androidVersion, codepushUpDate, CloseVersion } = this.state;
            if (androidVersion != Rb88Version && !codepushUpDate && !CloseVersion) {
                this.setState({ CloseVersion: true, isRollback: "version" });
            }
        }, 5 * 60 * 1000);
    };
    //檢測版本更新
    CheckUptate() {
        if (!this.state.CheckUptate || this.state.CloseVersion) {
            return;
        }
        this.setState({ CheckUptate: false });
        this.checkVersionCode();
        this.codepushReset();
        CodePush.checkForUpdate(this.state.CodeKey).then(update => {
            if (update) {
                // 有可用的更新
                let updataMsg = (update.description && update.description) || translate("优化用户体验");
                this.setState({ isMandatory: update.isMandatory, updataMsg }, () => {
                    this.syncImmediate();
                    //isMandatory = true需要登录后才更新
                    // !update.isMandatory && this.syncImmediate()
                });
            } else {
                //无版本更新
                this.setState({
                    CheckUptate: true,
                    userCheckBtnClick: this.state.userCheckBtnClick ? "upDateNull" : "",
                });
            }
        });
    }

    UpdataApp() {
        GetDownloadUrl();
        if (this.state.isRollback) {
            CodePush.clearUpdates();
            CodePush.restartApp();
        }
    }

    immediatelyUpdate() {
        if (!this.state.codepushBtn) return;
        setTimeout(() => CodePush.restartApp(), 500);
    }

    render() {
        const { userInfo } = this.props;
        const { percent, CloseVersion, isRollback, userCheckBtnClick, codepushUpDate, updataMsg, mainLoading, showProgress, percentDone } = this.state;

        //SB2.0 deeplink 開啟特定賽事 (原為 window.openApp 已改名)
        window.openSB20Detail = (vendor, sid, eid, lid) => {
            let dataList = { eid, sid, lid };

            if (vendor.toLowerCase() == "im") {
                Actions.Betting_detail_Stack({
                    dataList,
                    from: "deeplink",
                    Vendor: VendorIM,
                });
            } else if (vendor.toLowerCase() == "bti") {
                Actions.Betting_detail_Stack({
                    dataList,
                    from: "deeplink",
                    Vendor: VendorBTI,
                });
            } else if (vendor.toLowerCase() == "saba") {
                Actions.Betting_detail_Stack({
                    dataList,
                    from: "deeplink",
                    Vendor: VendorSABA,
                });
            }
        };

        window.CheckUptateGlobe = (userCheckBtnClick = false) => {
            //userCheckBtnUpDate我的->点击版本更新提示
            this.setState({
                userCheckBtnClick: userCheckBtnClick ? "upDateLoadin" : "",
            });
            setTimeout(() => {
                this.CheckUptate();
            }, 1200);
        };


        window.ChangeLanguag = async (res) => {
            window.LANGUAGE = res;
            ApiPort.UserLogin && LogoutUtil();
            ApiPort.Token = "";
            ApiPort.UserLogin = false;
            await SetDefaultConfig(res);
            // 清除所有 Redux 数据
            clearAllReduxData();
            await resetReducer();
            await this.componentWillMount(false);
            await this.componentDidMount();
        };

        const parentToShared = {
            locale: window.LANGUAGE,
            brand: "F1",
            platform: PLATFORM.APP,
            imageSupportFormats: true,
            naviToHomepage: () => {
                Actions.Home();
            },
            memberCode: ApiPort.UserLogin ? userInfo?.memberInfo?.memberCode : null,
            apiHost: {
                strapi: window.Strapi_Domain
            },
            mainsiteUI: {
                // GameCard: (props) => {
                //     return <GameCard
                //         {...props}
                //         onLaunchGame={() => {
                //             let playGameFun = () => {
                //                 this.props.loginAfterCallBack({
                //                     callBack: () => {
                //                         this.props.playGame({
                //                             ...data,
                //                             providerCode: data?.provider,
                //                             gameId: data?.gameId,
                //                             categoryCode: 'slot',
                //                             launchGameCode: data?.launchGameCode || "",
                //                             gameName: data?.gameName,

                //                         })
                //                     },
                //                 });
                //             }
                //             if (CheckLogin()) {
                //                 playGameFun()
                //                 return
                //             }
                //             playGameFun()
                //         }}
                //         loginAfterCallBack={() => {

                //         }}

                //     />
                // }
            },
            Toasts,
            onLaunchGame: (data) => {
                let categoryCode = this.props.getCategoryCode(data?.provider);
                const gameData = {
                    ...data,
                    providerCode: data?.provider,
                    gameId: data?.gameId,
                    categoryCode,
                    launchGameCode: data?.launchGameCode || "",
                    gameName: data?.gameName,
                };


                if (CheckLogin() && categoryCode == "Slot") {
                    this.props.loginAfterCallBack({
                        callBack: () => {
                            Actions.GameInforPage({
                                categoryCode,
                                productGamePageInfor: gameData
                            });
                            this.props.playGame(gameData);
                        },
                    });
                } else {
                    this.props.playGame(gameData);
                }

                return Promise.resolve();
            },
            maxSearchGamesByTextHistory: 5,
        };

        return (
            <AIGame {...parentToShared}>
                <Provider store={store} key={window.LANGUAGE + "_" + (window.isStaging + "")}>
                    <SafeAreaProvider>
                        <View style={{ flex: 1 }}>
                            <ToastProvider>
                                <View style={{ flex: 1 }}>
                                    <StatusBar barStyle="light-content" backgroundColor={Color.theme} />
                                    {/* 推送 */}
                                    {
                                        Platform.OS === "android" && window.DeviceLanguage != "CN" &&
                                        <FirebasePush />
                                    }
                                    {/* 首次進入APP */}
                                    {
                                        !codepushUpDate && !ApiPort.UserLogin && mainLoading == 1 &&
                                        <OnboardingCarousel key={window.LANGUAGE} closeAppCarousel={this.closeOnboardingModal.bind(this)} />
                                    }

                                    {/* 不是首次進入APP */}
                                    <RootSiblingParent>
                                        {
                                            !codepushUpDate && mainLoading == 2 &&
                                            <LaunchAdCarousel key={window.LANGUAGE} closeAppCarousel={this.closeLaunchAdModal.bind(this)} />
                                        }

                                        {
                                            mainLoading > 0 &&
                                            //Boolean(window.bffsc_url) &&
                                            <Main />
                                        }
                                        <RootSiblingPortal>
                                            <View style={{ position: "absolute", zIndex: 10000, left: 0, right: 0 }}>
                                                <ToastRoot />
                                            </View>
                                        </RootSiblingPortal>
                                    </RootSiblingParent>
                                    {
                                        //我的页面点击版本更新提示
                                        !CloseVersion && userCheckBtnClick != "" &&
                                        <ColumnCenterCenter style={styles.modalBg}>
                                            <View style={styles.modalContainer}>
                                                <View style={[styles.modalHeader]}>
                                                    <Text style={[styles.modalHeaderText]}>
                                                        {translate("版本更新1")}
                                                    </Text>
                                                </View>


                                                <View style={styles.modalBody}>
                                                    <Text style={styles.modalBodyText}>
                                                        {userCheckBtnClick == "upDateLoadin"
                                                            ? translate("版本检查中……")
                                                            : userCheckBtnClick == "upDateDone"
                                                                ? translate("有新版本可以更新")
                                                                : translate("您的 App 版本已是最新。")}
                                                    </Text>
                                                </View>

                                                <FilledButton
                                                    text={userCheckBtnClick == "upDateLoadin" ? translate("退出") : userCheckBtnClick == "upDateDone" ? translate("立即更新") : translate("确认2")}
                                                    type="medium"
                                                    textStyle={styles.btnText}
                                                    onPress={() => {
                                                        userCheckBtnClick == "upDateDone" && CodePush.restartApp(); //立即更新
                                                        this.setState({
                                                            userCheckBtnClick: "",
                                                        });
                                                    }}
                                                    outlined={userCheckBtnClick == "upDateLoadin"}
                                                />
                                            </View>
                                        </ColumnCenterCenter>

                                    }

                                    {
                                        //codepush更新提示
                                        !CloseVersion && codepushUpDate &&
                                        <ColumnCenterCenter style={styles.modalBg}>
                                            <View style={styles.modalContainer}>
                                                <View style={[styles.modalHeader]}>
                                                    <Text style={[styles.modalHeaderText]}>
                                                        {translate("版本更新2")}
                                                    </Text>
                                                </View>

                                                <View style={[styles.modalBody, { marginBottom: showProgress ? 0 : 20 }]}>
                                                    {
                                                        updataMsg != "" &&
                                                        updataMsg?.split("-").map((item, index) => {
                                                            return updataMsg?.split("-").length == 1 ? (
                                                                <Text key={index} style={styles.modalBodyText}>
                                                                    {item}
                                                                </Text>
                                                            ) : (
                                                                <Text
                                                                    key={index}
                                                                    style={[
                                                                        styles.modalBodyText,
                                                                        {
                                                                            textAlign: "left",
                                                                        },
                                                                    ]}>
                                                                    {index + 1}. {item}
                                                                </Text>
                                                            );
                                                        })
                                                    }

                                                    {
                                                        showProgress &&
                                                        <>
                                                            <View style={[styles.progressBar]}>
                                                                <View
                                                                    style={[
                                                                        styles.progressBarItem,
                                                                        {
                                                                            width: ((width * 0.8 - 60) * percent) / 100,
                                                                        },
                                                                    ]}
                                                                />
                                                            </View>
                                                            <Text style={styles.modalBodyText}>
                                                                {percent} % {translate("更新中，请勿关闭APP")}
                                                            </Text>
                                                        </>
                                                    }
                                                </View>

                                                {
                                                    (!showProgress || percentDone) &&
                                                    <FilledButton
                                                        wrapStyle={{ marginTop: 15 }}
                                                        text={translate("立即更新")}
                                                        type="medium"
                                                        textStyle={styles.btnText}
                                                        onPress={() => {
                                                            CodePush.restartApp();
                                                        }} />
                                                }
                                            </View>
                                        </ColumnCenterCenter>
                                    }


                                    {
                                        CloseVersion == true && !__DEV__ &&
                                        <ColumnCenterCenter style={styles.modalBg}>
                                            <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                    <Text style={styles.modalHeaderText}>
                                                        {translate("版本升级提示")}
                                                    </Text>
                                                </View>

                                                <View style={styles.modalBody}>
                                                    <Text style={[styles.modalBodyText, { marginBottom: 10 }]}>
                                                        {translate("亲爱的会员，")} {isRollback == "version" ? translate("有新更新，") : isRollback == "codepush" ? translate("更新失败，") : translate("此版本已停止使用。")}
                                                    </Text>
                                                    <Text style={styles.modalBodyText}>{translate("请下载最新APP以继续游戏，请先删除旧版APP再安装。")}</Text>
                                                </View>


                                                <FilledButton
                                                    text={translate("立即下载")}
                                                    type="medium"
                                                    textStyle={styles.btnText}
                                                    onPress={() => {
                                                        this.UpdataApp();
                                                    }} />
                                            </View>
                                        </ColumnCenterCenter>
                                    }
                                </View>
                            </ToastProvider>
                        </View>
                    </SafeAreaProvider>
                </Provider>
            </AIGame>
        );
    }
}

const styles = StyleSheet.create({
    modalBg: {
        width: width,
        height: height,
        backgroundColor: "rgba(0, 0,0, .6)",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 999999,
    },
    modalContainer: {
        width: width * .8,
        backgroundColor: "#fff",
        paddingTop: 24,
        paddingBottom: 20,
        borderRadius: 6,
        overflow: "hidden",
        paddingHorizontal: 20
    },

    modalHeader: {

    },
    modalHeaderText: {
        textAlign: "center",
        color: "#222",
        fontSize: 16,
        fontWeight: "600",
    },
    modalBody: {
        paddingHorizontal: 10,
        marginTop: 16,
        marginBottom: 20
    },
    modalBodyText: {
        textAlign: "center",
        color: "#666",
        fontWeight: "400",
        fontSize: 14
    },
    progressBar: {
        width: width * 0.8 - 60,
        height: 6,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#BCBEC3",
    },
    progressBarItem: {
        height: 6,
        backgroundColor: Color.theme,
        borderRadius: 10,
    },
});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */


let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

const mapStateToProps = (state) => ({
    userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
    loginAfterCallBack: data => dispatch(actions.ACTION_LoginAfterCallBack(data)),
});

const ConnectedAppContent = connect(mapStateToProps, mapDispatchToProps)(AppContent);

// Root App component provides context
function App() {
    return (
        <GlobalModalProvider>
            <AppProvider>
                <AppWithProvider />
            </AppProvider>
        </GlobalModalProvider>
    );
}

// Internal component that uses the hook
function AppWithProvider() {
    const { getCategoryCode } = useGame();

    React.useEffect(() => {
        // GlobalModal 現在自動設置，無需手動 ref
    }, []);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ConnectedAppContent getCategoryCode={getCategoryCode} />
                <GlobalModalWrapper />
            </SafeAreaProvider>
        </Provider>
    );
}

const AppWithCodePush = CodePush(codePushOptions)(Sentry.wrap(App));

export default AppWithCodePush;