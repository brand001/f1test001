import React, { memo, useState, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
const { width } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import CornerLabel from "$Components/CornerLabel";
import { RowCenterCenter, RowStartCenter } from "$Components/CustomView";
import LoadingBone from "$Components/LoadingBone";
import { Toasts } from "$Toasts";
import { CheckLogin, CheckYBSGame, GameLockToast, GetAnnouncementPopup, GetSelfExclusionPopup, OpenSbSports } from "$Utils";
import { ParentContext } from "$ALLSHARED/contexts/ParentContext";
import actions from "@/lib/redux/actions/index";
import { ProductGameDetailGameMap, LaunchGameMap, ProductGamePageGameMap } from "@/lib/data/game";
import { getAllVendorToken } from "$Utils/SbSportsBridge";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { ImagesUrl } from "@/images/index";

import AIGameTabInHome from "$ALLSHARED/APP/components/AIGameTabInHome/index.js";
import NetworkImage from "$Components/NetworkImage";
import { useGame } from "$Hooks";

const borderRadius = 8;
const SLOT_GAME_CAT_CODE = "Slot";

// 單個遊戲卡片，避免不必要重渲染
const GameCardItem = memo(function GameCardItem({ item, category, index, onPress }) {
    const { name = "", description = "", code = "" } = item || {};
    const handlePress = () => {
        onPress(category, item);
    };

    return (
        <Touch
            key={item?.code || index}
            style={styles.gameContetnItem}
            onPress={handlePress}>
            <View style={styles.gameImageContainer}>
                <CornerLabel
                    gradient={true}
                    cornerRadius={54}
                    type={item?.isNew ? "NEW" : item?.isHot && "HOT"} />
                <NetworkImage
                    defaultSource={ImagesUrl.loadinglight}
                    source={{ uri: item.providerHomepageImage }}
                    resizeMode="stretch"
                    style={styles.gameContentImg}
                />

                <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.4)"]}
                    style={styles.linearGradient}>
                    <Text style={[styles.gameContentTitle, {
                        fontSize: window.LANGUAGE == "VN" && code == "SB2" ? 14 : 16
                    }]}>{name}</Text>
                </LinearGradient>
            </View>
            {!!description && <Text style={styles.gameSubtitle}>{description}</Text>}
        </Touch>
    );
});

const Home = (props) => {
    const { getSubProviders, getSubProvidersMap } = useGame();
    const [showYbs, setShowYbs] = useState(true);

    useEffect(() => {
        const initializeComponent = async () => {
            let isYbs = await CheckYBSGame();
            setShowYbs(isYbs);
        };

        initializeComponent();
    }, []);

    const handleSB = async () => {
        //樂體育不用彈窗
        if (ApiPort.UserLogin) {
            if (GameLockToast()) return;

            // 自我限制檢查
            let isSelfExclusionPopup = await GetSelfExclusionPopup();
            if (isSelfExclusionPopup) return;

            GetAnnouncementPopup({
                type: "vendorsportsbook",
            });

            //已登入 先獲取token後跳轉
            Toasts.loading(translate("加载中,请稍候..."));
            getAllVendorToken().finally(() => {
                //不管成功或失敗都跳轉
                Toasts.removeAll();
                OpenSbSports();
            });
        } else {
            //未登入 直接跳轉
            OpenSbSports();
        }
    };

    /**
     * @param {number} item 游戏类型
     * @param {string} item2 細節
     */
    const onGameItemPress = async (item, item2) => {
        let { sprHotGame, specialSprCode, curGameCatCode } = props;
        let providerCode = item2?.code?.toLocaleUpperCase();
        piwikSubProviders(item2?.code, item?.code);

        let curGameCatCodeUpperCase = curGameCatCode?.toLocaleUpperCase();

        if (LaunchGameMap[window.LANGUAGE].includes(curGameCatCodeUpperCase)) {
            if (providerCode == "SB2") {
                handleSB();
                return;
            }
            props.playGame({
                providerCode: providerCode,
                gameId: null,
                categoryCode: curGameCatCode,
                gameName: item2?.name
            });
            props.clearGame();
            return;
        } else if (ProductGameDetailGameMap[window.LANGUAGE]?.indexOf(curGameCatCodeUpperCase) > -1) {
            if (providerCode == specialSprCode) {
                if (sprHotGame && sprHotGame.gameId) {
                    props.playGame({
                        providerCode: sprHotGame.provider,
                        gameId: sprHotGame.gameId,
                        categoryCode: curGameCatCode,
                        gameName: props?.game?.sprHotGame?.gameName
                    });
                }
            } else {
                Actions.GameFilterPage({
                    categoryCode: props.curGameCatCode,
                    providerCode: providerCode,
                    presetConditionConfig: {
                        routeType: "provider",
                        presetCondition: providerCode
                    }
                });
                return;
            }
        }
    };

    const openAviatorGame = (from) => {
        const { sprHotGame } = props;

        if (CheckLogin()) return;

        if (sprHotGame && sprHotGame.gameId) {
            props.playGame({
                ...sprHotGame,
                providerCode: sprHotGame.provider,
                gameId: sprHotGame.gameId,
                categoryCode: "InstantGames",
                from,
                gameName: props?.game?.sprHotGame?.gameName
            });
        }
    };


    const renderGameItem = (item, category, i) => {
        const { code = "" } = item || {};
        const showGame = code === "YBS" ? showYbs : true;
        if (!showGame) return null;
        return (
            <GameCardItem
                key={item?.code || i}
                item={item}
                category={category}
                index={i}
                onPress={onGameItemPress}
            />
        );
    };

    const renderLearnMore = (category, isCNStan) => {
        if (isCNStan) return null;

        return (
            <Touch
                onPress={() => onGameIntroPress(category.subProviders, category)}
                style={styles.gameIntroItem}>
                {category.name && category.description && (
                    <>
                        <Text style={styles.gameIntroTitle}>{category.name}</Text>
                        <Text style={styles.gameIntroSubTitle}>{category.description}</Text>
                    </>
                )}
                <Text style={styles.gameIntroBtn}>{translate("了解更多")}</Text>
            </Touch>
        );
    };

    const gameTabContent = () => {
        const { gameSequences, gameTabsKey } = props;
        if (gameSequences.length === 0) return null;

        // 获取当前选中的类别
        const currentCategory = gameSequences[gameTabsKey];
        if (!currentCategory) return null;

        const isCNStan = currentCategory.code?.toLocaleUpperCase() == "INSTANTGAMES" && window.LANGUAGE == "CN";

        return (
            <ScrollView
                key={`gameInnerScrollView-${gameTabsKey}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.gameInnerScrollView}
                // Android 平台优化
                scrollEventThrottle={16}
                decelerationRate={Platform.OS === "android" ? 0.9 : "normal"}
                scrollEnabled={true}
                // 移除可能影响 Android 滑动的属性
                removeClippedSubviews={Platform.OS === "ios"}
                maxToRenderPerBatch={10}
                windowSize={10}
                // Android 触摸优化
                bounces={Platform.OS === "ios"}
                overScrollMode={Platform.OS === "android" ? "auto" : undefined}>
                <RowStartCenter>
                    {currentCategory.subProviders.map((item, i) => renderGameItem(item, currentCategory, i))}
                    {renderLearnMore(currentCategory, isCNStan)}
                </RowStartCenter>
            </ScrollView>
        );
    };

    // 跳转相关方法 - 添加错误处理
    const onGameIntroPress = (item, category) => {
        try {
            let { gameSequences, gameTabsKey } = props;
            let categoryCode = category?.code;

            // 埋点 - 添加错误处理
            try {
                PiwikEventDataHandle({
                    category: "Home",
                    action: `Go to ${categoryCode} Lobby`,
                    name: `Home_C_${categoryCode}`,
                    path: "home",
                    title: "Home",
                });
            } catch (error) {
                console.warn("Piwik tracking failed:", error);
            }

            if (categoryCode == "InstantGames" && category?.subProviders.length <= 2 && window.LANGUAGE != "CN") {
                let item = gameSequences[gameTabsKey].subProviders[0];
                onGameItemPress(gameSequences[gameTabsKey], item);
                return;
            }

            const gameCatCode = categoryCode?.toLocaleUpperCase();

            const targetAction = ProductGamePageGameMap[window.LANGUAGE]?.includes(gameCatCode);

            if (targetAction) {
                Actions.ProductGamePage({
                    categoryCode: category.code,
                });
            } else {
                Actions.ProductIntro({
                    categoryCode: category.code
                });
            }
        } catch (error) {
            console.warn("onGameIntroPress failed:", error);
        }
    };

    // 埋点相关方法
    const piwikSubProviders = (code, categoryCode) => {
        let { specialSprCode, curGameCatCode, sprHotGame } = props;
        if (code == specialSprCode) {
            PiwikEventDataHandle({
                category: "Home",
                action: `Launch HotGame ${sprHotGame?.gameName}`,
                name: "Home_InstantGames_C_HotGame",
                path: "home",
                title: "Home",
                customProperties: {
                    "Home_InstantGames_C_HotGame_GameName": sprHotGame?.gameName, // 修正 key 格式
                },
            });
        } else {
            let flagTag = ["SPORTSBOOK", "ESPORTS"].includes(curGameCatCode?.toLocaleUpperCase());
            PiwikEventDataHandle({
                category: "Home",
                action: flagTag ? `Launch ${code}` : `Go to ${code} Lobby`,
                name: `Home_${categoryCode}_C_${code}`,
                path: "home",
                title: "Home",
            });
        }
    };

    // 設置全局函數
    window.getAviator = (from = "") => {
        if (from !== "sb") {
            Actions.pop();
        }
        openAviatorGame(from); // 單獨獲取spr hot game
    };

    const { gameSequences, curGameCatCode } = props;

    return (
        <View style={styles.gameBox}>
            {(Array.isArray(gameSequences) && gameSequences.length > 0)
                ? (
                    <>
                        {props.hasEnteredSlot && (
                            <View style={[styles.aiGameTabContainer, { display: curGameCatCode === SLOT_GAME_CAT_CODE ? "flex" : "none" }]}>
                                <AIGameTabInHome
                                    gameType={SLOT_GAME_CAT_CODE}
                                    providers={getSubProviders(SLOT_GAME_CAT_CODE)}
                                    providersMap={getSubProvidersMap(SLOT_GAME_CAT_CODE)}
                                    onLobbyEntryClick={() => {
                                        Actions.GameLobbyPage({
                                            categoryCode: SLOT_GAME_CAT_CODE,
                                        });

                                        PiwikEventDataHandle({
                                            category: "Home",
                                            action: `View ${SLOT_GAME_CAT_CODE} Listing`,
                                            name: `Home_C_${SLOT_GAME_CAT_CODE}`,
                                            title: "Home",
                                            path: "home",
                                        });
                                    }}
                                    onGameInfoClick={(gameInfo) => {
                                        Actions.GameInforPage({
                                            categoryCode: SLOT_GAME_CAT_CODE,
                                            productGamePageInfor: gameInfo
                                        });
                                    }}
                                    pageType={"gameHome"}
                                    onSeeMore={({ gameLists, navBarTitle, piwikTitle }) => {
                                        Actions.GameListPage({
                                            providersMap: getSubProvidersMap(SLOT_GAME_CAT_CODE),
                                            gameLists,
                                            categoryCode: SLOT_GAME_CAT_CODE,
                                            navBarTitle
                                        });

                                        PiwikEventDataHandle({
                                            category: "Home",
                                            action: `View ${piwikTitle} Gamelisting`,
                                            name: `Home_${SLOT_GAME_CAT_CODE}_C_${piwikTitle}`,
                                            title: "Home",
                                            path: "home",
                                        });
                                    }}
                                    onFilterProvider={(providerCode) => {
                                        Actions.GameFilterPage({
                                            categoryCode: SLOT_GAME_CAT_CODE,
                                            providerCode,
                                            presetConditionConfig: {
                                                routeType: "provider",
                                                presetCondition: providerCode
                                            }
                                        });

                                        PiwikEventDataHandle({
                                            category: "Home",
                                            action: `View ${providerCode} Gamelisting`,
                                            name: `Home_${SLOT_GAME_CAT_CODE}_C_${providerCode}`,
                                            title: "Home",
                                            path: "home",
                                        });
                                    }}
                                />
                            </View>
                        )}

                        {
                            curGameCatCode !== "Slot" &&
                            <View style={styles.gameTabContainer}>
                                {gameTabContent()}
                            </View>
                        }
                    </>
                )
                : (
                    <View style={styles.gameContainer}>
                        <LoadingBone length={1} wrapStyle={styles.loadBox} />

                        <ScrollView horizontal={true}>
                            <RowCenterCenter>
                                <LoadingBone length={5} wrapStyle={[styles.gameContentImg, { marginRight: 10 }]} />
                            </RowCenterCenter>
                        </ScrollView>
                    </View>
                )}
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
    userInfo_login: userName => actions.ACTION_UserInfo_login(userName),
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
    getGameMaintainStatus: code => dispatch(actions.ACTION_GameIsMaintain(code)),
    saveAviator: data => dispatch(actions.ACTION_AviatorGameData(data)),
    clearGame: () => dispatch(actions.ACTION_ClearGameInfo()),
});

const HomeWithContext = props => (
    <ParentContext.Consumer>
        {parentContext => <Home {...props} parentContext={parentContext} />}
    </ParentContext.Consumer>
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeWithContext);

const styles = StyleSheet.create({

    gameBox: {
        backgroundColor: Color.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingBottom: 10,
    },
    gameImageContainer: {
        position: "relative",
        borderRadius,
        overflow: "hidden",
    },
    gameContetnItem: {
        marginRight: 10,
        overflow: "hidden",
    },
    gameContentImg: {
        width: 0.36 * width,
        height: 0.46 * width,
        borderRadius
    },
    linearGradient: {
        bottom: 0,
        position: "absolute",
        width: 0.36 * width,
        height: 35,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 99999,
        justifyContent: "center",
    },
    gameContentTitle: {
        textAlign: "center",
        color: Color.white,
        fontSize: 16,
        fontWeight: "600",
    },
    gameSubtitle: {
        color: Color.charcoal,
        fontSize: 12,
        textAlign: "center",
        paddingTop: 8,
        width: 0.36 * width,
        fontWeight: "400"
    },
    gameIntroItem: {
        width: 0.36 * width,
        height: 0.465 * width,
        borderRadius,
        backgroundColor: Color.lightSilver,
        justifyContent: "center",
        marginRight: 16,
        paddingHorizontal: 8,
    },
    gameIntroTitle: {
        color: Color.theme,
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
    },
    gameIntroSubTitle: {
        color: Color.black,
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 14,
        textAlign: "center",
        marginBottom: 8,
    },
    gameIntroBtn: {
        color: Color.theme,
        fontSize: 12,
        fontWeight: "400",
        textAlign: "center",
        paddingHorizontal: 8,
        paddingVertical: 5,


        alignSelf: "center",
        borderRadius,
        borderWidth: 1,
        borderColor: Color.theme
    },

    gameContainer: {
        marginHorizontal: 16,
        paddingVertical: 16,
    },
    loadBox: {
        height: 44,
        backgroundColor: Color.softGray,
        marginVertical: 10,
        borderRadius,
        overflow: "hidden",
    },


    gameInnerScrollView: {
        marginLeft: 16,
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        // Android 平台优化 - 确保有足够的触摸区域和更好的滑动体验
        minHeight: Platform.OS === "android" ? 150 : undefined,
        paddingVertical: 16,
    },
    aiGameTabContainer: {
        paddingLeft: 16,
    },
    gameTabContainer: {
        // 游戏标签页容器样式
    },
});
