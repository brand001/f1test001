import * as Sentry from "@sentry/react-native";
import React, { useState, useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect, useSelector } from "react-redux";
import { Toasts } from "$Toasts";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import actions from "@/lib/redux/actions/index";
import { GetSuperDoor } from "$Utils";
import StorageUtil from "$Utils/Storage";
import IconList from "$Components/icons/IconList";
import HomeGame from "./HomeGame";
import HomeHeader from "./HomeHeader";
import HomeHeaderTop from "./HomeHeaderTop";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import CustomScrollView from "$Components/CustomScrollView";
import GameTab from "./GameTab";

import TestFunctions from "./../TestFunctions";
import { _ALLSHARED_recentPlayed_Slot } from "@/actions/Reg";
import { useGame, usePromotion, useBanner } from "$Hooks";


const Home = (props) => {
    const { updateGameBanner } = useBanner();
    const { updateGameSequences } = useGame();
    const { updatePromotionData } = usePromotion();
    const [refreshKey, setRefreshKey] = useState(0);
    // 新增游戏序列和tab状态管理
    const [gameSequences, setGameSequences] = useState([]);
    const [gameTabsKey, setGameTabsKey] = useState(0);
    const [curGameCatCode, setCurGameCatCode] = useState("Sportsbook");
    const [sprHotGame, setSprHotGame] = useState([]);
    const [specialSprCode, setSpecialSprCode] = useState(null);
    const specialSprCodeRef = useRef(null); // 用於存儲即時值
    const [hasEnteredSlot, setHasEnteredSlot] = useState(false); // 新增状态管理
    // 简化：只用一个状态控制粘性导航显示
    const [showStickyNav, setShowStickyNav] = useState(false);
    // 使用 ref 存储位置信息，避免频繁状态更新
    const gameTabPositionRef = useRef(0);
    const homeHeaderHeightRef = useRef(0);

    // 使用 useRef 管理引用
    const transactionRef = useRef(null);
    const scrollViewRef = useRef(null);
    const prevCurGameCatCodeRef = useRef("Sportsbook"); // 追蹤之前的 curGameCatCode
    const isMountedRef = useRef(true); // 追踪组件挂载状态
    const { useCentralPayment, depositStepTwoDetails } = useSelector((state) => state?.centralPayment);

    // 使用 useEffect 替代 componentDidMount
    useEffect(() => {
        isMountedRef.current = true;
        homeInit();
        return () => {
            // 组件卸载时标记
            isMountedRef.current = false;
        };
    }, []);


    // 處理 tab 切換後的滾動操作
    useEffect(() => {
        if (gameTabsKey >= 0 && gameSequences.length > 0) {
            const currentCategory = gameSequences[gameTabsKey];
            if (!currentCategory) return;

            // 延遲執行滾動操作，確保狀態更新完成
            const timer = setTimeout(() => {
                // 只有从Slot切换到其他类别时才滚动到顶部
                const wasInSlot = prevCurGameCatCodeRef.current === "Slot";
                const isNowInOtherCategory = currentCategory.code !== "Slot";
                if (wasInSlot && isNowInOtherCategory && scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true
                    });
                }

                // 更新之前的狀態
                prevCurGameCatCodeRef.current = currentCategory.code;
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [gameTabsKey, curGameCatCode]);


    // 获取游戏序列
    const getSequence = (_flag) => {
        StorageUtil.load("GameSequence")
            .then(gameSequences => {
                if (gameSequences.length) {
                    setGameSequences(gameSequences);
                    setGameTabsKey(0);
                    setCurGameCatCode(gameSequences[0]?.code || "Sportsbook");
                }
            });

        fetchRequestCMS(Strapi_Domain + ApiPort.CMS_Sequence, "GET")
            .then(res => {
                Toasts.removeAll();
                if (res.result && res.result.length) {
                    setGameSequences(res.result);
                    setGameTabsKey(0);
                    setCurGameCatCode(res.result[0]?.code || "Sportsbook");

                    getSprGames(); // 單獨獲取spr hot game
                    res.result.forEach((item, i) => {
                        //getGameStatus(null, item.code); // 針對home page 的 tab bar 的label 狀態
                        if (i == 0 && window.LANGUAGE != "TH") {
                            item.subProviders.forEach(v => {
                                if (v.code == "SB2") {
                                    //CXFUN88-4323: 改用febff，apiVersion=8.0 && 8.0 xbffKey
                                    fetchRequest(`${ApiPort.GetProvidersMaintenanceStatus}providerCode=${v.code == "SB2" ? "OWS" : v.code}&`).then(res => {
                                        v.isMaintenanceSB = res?.result;
                                    });
                                }
                            });
                        }
                    });

                    StorageUtil.save({ key: "GameSequence", data: res.result });
                    updateGameSequences(res.result);

                    if (ApiPort.UserLogin) {
                        StorageUtil.load("tutorialCompleted" + window.memberCode)
                            .then((data) => {
                                if (!data) {
                                    props.startTutorial(0, false);
                                }
                            });
                    }
                }
            })
            .catch(() => {
                Toasts.removeAll();
            });
    };

    // 获取 SPR 游戏
    const getSprGames = () => {
        const param = {
            gameType: "InstantGames", // gameCatCode
            providers: "SPR", // providerCode
            category: "AllGames",
            keyword: "Aviator",
            isHot: false,
            isNew: false,
        };

        const fetchurl = `${Strapi_Domain}${ApiPort.CMS_GetGame}gameType=${param.gameType}&gameSortingType=Default&platform=app`;

        fetchRequestCMS(fetchurl, "GET").then(res => {
            let tempGame = gameSequences.find(v => v.code.toLocaleLowerCase() == "instantgames")?.subProviders;
            let launchGameCode = "AVIATOR";
            if (Array.isArray(tempGame) && tempGame.length >= 2) {
                launchGameCode = tempGame[tempGame.length - 1]?.code;
                param.gameName = launchGameCode;
                // phae 2
                // param.isHot = tempGame[1].isHot
                // param.isNew = tempGame[1].isNew
            }
            const upperLaunchGameCode = launchGameCode.toLocaleUpperCase();
            setSpecialSprCode(upperLaunchGameCode);
            specialSprCodeRef.current = upperLaunchGameCode; // 同時更新 ref
            // console.log('res', res)
            if (res.isSuccess && res.result && res.result.gameDetails) {
                // CXFUN88-6335: ST && SL 不是 isLive 全顯示，Prod 只顯示 isLive = true
                const isSL = window.isStaging === "SL"; // 宣告個變數方便閱讀
                let gameDetails = window.isStaging === "ST" ? res.result.gameDetails : isSL ? res.result.gameDetails : res.result.gameDetails.filter(v => v.isLive);
                // 存起來，方便體育內此遊戲的使用
                let specialSpr = gameDetails.find(v => v.launchGameCode.toLocaleLowerCase() == launchGameCode.toLocaleLowerCase()) || gameDetails[0];
                props.saveAviator(specialSpr);

                setSprHotGame(specialSpr);
                getGameStatus(param, launchGameCode); // 直接調用，使用 ref 中的即時值
            }
        });
    };

    // 获取游戏状态
    const getGameStatus = (data, keyword) => {
        fetchRequest(ApiPort.GameMaintenanceStatus + `providerCode=${keyword}&`, "GET").then(res => {
            if (res.isSuccess && res.result) {
                const result = res.result;

                // 使用 ref 中的即時值進行比較
                if (keyword.toLocaleUpperCase() == specialSprCodeRef.current) {
                    const param = {
                        gameType: data.gameType,
                        providers: data.providers,
                        gameName: result.providerCode,
                        ...result,
                    };
                    props.getGameMaintainStatus(param);
                }
            }
        });
    };

    // 处理 tab 切换
    const handleTabChange = (index, category) => {
        // 检查是否进入Slot，如果是则标记hasEnteredSlot为true（只在第一次进入时设置）
        const newHasEnteredSlot = category.code === "Slot" ? true : hasEnteredSlot;

        if (category.code === "Slot") {
            getSlotRecentPlayed();
        }

        // 如果切换到非Slot类别，重置所有滚动相关状态
        const shouldResetScrollState = category.code !== "Slot";

        // 更新状态 - 使用原來的邏輯
        setGameTabsKey(index);
        setCurGameCatCode(category.code);
        setHasEnteredSlot(newHasEnteredSlot);

        // 重置滚动状态
        if (shouldResetScrollState) {
            setShowStickyNav(false);
        }

        // 在状态更新后执行滚动操作 - 使用 useEffect 替代 setTimeout
        // 這個邏輯將在 useEffect 中處理
    };

    const getSlotRecentPlayed = async () => {
        if (!ApiPort.UserLogin) return;
        const data = await StorageUtil.load(_ALLSHARED_recentPlayed_Slot);
        localStorage.setItem(_ALLSHARED_recentPlayed_Slot, data);
    };

    const homeInit = async () => {
        getSequence();
        if (ApiPort.UserLogin) {
            props.userInfo_getBalance();
            window.LANGUAGE == "CN" && GetSuperDoor();
            getSlotRecentPlayed();
            window.ReloadToken();
        }
        transactionRef.current = Sentry.startTransaction({
            name: "Home",
            op: "navigation",
        });
        transactionRef.current && transactionRef.current.finish && transactionRef.current.finish();
        updateGameBanner();
        props.getCmsMainsiteStatus();
        updatePromotionData();
    };


    const handleRefresh = async () => {
        await homeInit();
        setRefreshKey(prev => prev + 1);
    };

    // 简化：处理ScrollView滚动事件
    const showStickyNavRef = useRef(false); // 用 ref 追踪当前状态，避免闭包问题

    const handleScrollViewScroll = (() => {
        let lastInvoke = 0;
        const THROTTLE_MS = 50; // 降低频率，减少计算

        return (event) => {
            // 安全检查
            if (!isMountedRef.current || !event?.nativeEvent?.contentOffset) {
                return;
            }

            // 节流
            const now = Date.now();
            if (now - lastInvoke < THROTTLE_MS) return;
            lastInvoke = now;

            const offsetY = event.nativeEvent.contentOffset.y;

            // 只在Slot tab时处理
            if (curGameCatCode !== "Slot") {
                return;
            }

            // 简化判断：直接比较滚动位置
            const shouldShow = offsetY >= gameTabPositionRef.current;

            // 只在状态需要改变时更新
            if (shouldShow !== showStickyNavRef.current) {
                showStickyNavRef.current = shouldShow;
                setShowStickyNav(shouldShow);
            }
        };
    })();

    // 同步 ref 和 state
    useEffect(() => {
        showStickyNavRef.current = showStickyNav;
    }, [showStickyNav]);

    // 简化：处理布局变化，只更新 ref
    const handleHomeHeaderLayout = (event) => {
        homeHeaderHeightRef.current = event.nativeEvent.layout.height;
    };

    const handleGameTabLayout = (event) => {
        gameTabPositionRef.current = event.nativeEvent.layout.y;
    };

    return (
        <View
            style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* HomeHeaderTop placed outside CustomScrollView */}
            <HomeHeaderTop
                NavRightEl={(
                    <GamePageNavRight
                        type="money"
                        categoryCode="ALL"
                        showCs={true}
                        showRefresh={false}
                        wrapStyle={{ marginRight: 0 }}
                        loginCallBack={() => { PiwikEventDataHandle("HomePage8"); }}
                        registCallBack={() => { PiwikEventDataHandle("HomePage9"); }}
                        depositCallBack={() => {
                            Actions.DepositCenter();
                            PiwikEventDataHandle("HomePage10");
                        }}
                        amount={props?.userInfo?.balanceTotal}
                        showVip={true}
                        showOngoingDeposit={useCentralPayment && ["TH", "VN"].includes(window.LANGUAGE) && depositStepTwoDetails?.ongoingDeposit}
                    />
                )}
                onFinishTutorial={() => props.startTutorial(1, false)}
            />

            {/* 外部粘性GameTab */}
            {curGameCatCode === "Slot" && showStickyNav && gameSequences.length > 0 && (
                <View style={styles.gameTabContainer}>
                    <GameTab
                        gameSequences={gameSequences}
                        activeTab={gameTabsKey}
                        onTabChange={handleTabChange}
                    />
                </View>
            )}
            <CustomScrollView
                ref={scrollViewRef}
                //onRefresh={handleRefresh}
                onScroll={handleScrollViewScroll}
            >
                {/* HomeHeader - 简化显示逻辑 */}
                <View
                    style={{
                        opacity: showStickyNav ? 0 : 1,
                        height: showStickyNav ? 0 : undefined,
                    }}
                    pointerEvents={showStickyNav ? "none" : "auto"}
                    collapsable={false}
                    onLayout={handleHomeHeaderLayout}
                >
                    <HomeHeader
                        key={`homeHeader-${refreshKey}`}
                        hideHomeHeader={showStickyNav}
                    />
                </View>

                {/* 占位符 - 保持布局稳定 */}
                {showStickyNav && (
                    <View style={{ height: homeHeaderHeightRef.current }} />
                )}


                {/* 内部GameTab - 只在粘性导航隐藏时显示 */}
                {!showStickyNav && gameSequences.length > 0 && (
                    <View onLayout={handleGameTabLayout}>
                        <GameTab
                            gameSequences={gameSequences}
                            activeTab={gameTabsKey}
                            onTabChange={handleTabChange}
                        />
                    </View>
                )}

                <HomeGame
                    key={`homeGame-${refreshKey}`}
                    gameSequences={gameSequences}
                    gameTabsKey={gameTabsKey}
                    curGameCatCode={curGameCatCode}
                    sprHotGame={sprHotGame}
                    onTabChange={handleTabChange}
                    specialSprCode={specialSprCode}
                    hasEnteredSlot={hasEnteredSlot}
                />


                {/*線上環境不顯示*/}
                <TestFunctions />

            </CustomScrollView>
        </View>
    );
};

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting,
    gameMaintainStatus: state.gameInfo.maintainStatus,
    game: state.game,
});
const mapDispatchToProps = dispatch => ({
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
    getGameMaintainStatus: code => dispatch(actions.ACTION_GameIsMaintain(code)),
    getCmsMainsiteStatus: () => dispatch(actions.ACTION_CMSMAINSITESTATUS()),
    startTutorial: (index, hasCache) => dispatch(actions.ACTION_TutorialManagerIndex(index, hasCache)),
    saveAviator: data => dispatch(actions.ACTION_AviatorGameData(data)),
});

const styles = StyleSheet.create({
    gameTabContainer: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f0f0f0",
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

