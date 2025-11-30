import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import GameCategories from "@/containers/Game/ProductGamePage/GameCategories";
import GameProviders from "@/containers/Game/ProductGamePage/GameProviders";
import CarouselBanner from "$Components/CarouselBanner";
import actions from "$LIB/redux/actions";
import { Toasts } from "$Toasts";
import { GetAnnouncementPopup, ShowLiveTestGame } from "$Utils";
import StorageUtil from "$Utils/Storage";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
const { width } = Dimensions.get("window");

import { translate } from "$locales/translate";

import { WalletMappingGame } from "@/lib/data/game";
import CustomScrollView from "$Components/CustomScrollView";

import { ParentContext } from "$ALLSHARED/contexts/ParentContext";
import GameListRow from "$ALLSHARED/APP/uiComponents/GameListRow.js";
import BackBar from "$ALLSHARED/APP/uiComponents/BackBar";
import { useGame, useBanner } from "$Hooks";


const ProductGamePage = (props) => {
    const { getSubProviders, getSubProvidersMap, getCategoryName } = useGame();
    const { getGameBanner } = useBanner();
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [gameProvidersDetails, setGameProvidersDetails] = useState([]);
    const [gameCategories, setGameCategories] = useState([]);
    const [banner, setBanner] = useState([]);

    useEffect(() => {
        const initializeComponent = async () => {
            let { categoryCode = "" } = props;

            props.navigation.setParams({
                rightButton: () => {
                    return <GamePageNavRight
                        type='money'
                        showRefresh={false}
                        showCs={true}
                        categoryCode={categoryCode}
                        depositCallBack={Actions.DepositCenter}
                        amount={props?.userInfo.balanceObj?.[WalletMappingGame?.[categoryCode?.toLocaleUpperCase()]]?.balance}
                    />;
                }
            });

            GetAnnouncementPopup({ type: categoryCode });

            const bannerData = await getGameBanner(categoryCode);
            setBanner(bannerData);

            loadAllGameData();
        };

        initializeComponent();
    }, []);


    const loadAllGameData = () => {
        // let { categoryCode = "" } = props;
        const getAllData = [getRecommendedGame(), GameProvidersDetails(), getGameCategories()];

        // 加載所有數據並處理結果
        Promise.all(getAllData)
            .then(() => {
                Toasts.removeAll();
            })
            .catch(error => {
                console.error("Failed to load game data:", error);
                Toasts.removeAll();
            });
    };

    const getRecommendedGame = async () => {
        let { categoryCode } = props;
        let fetchurl = `${Strapi_Domain}${ApiPort.CMS_GetGame}gameType=${categoryCode}&gameSortingType=Recommended&platform=app`;

        let recommendedGames = await StorageUtil.load(`recommended${categoryCode}`) || [];
        setRecommendedGames(recommendedGames);
        return fetchRequestCMS(fetchurl, "GET").then(res => {
            if (res.isSuccess && res?.result?.gameDetails) {
                // CXFUN88-6335: ST && SL 不是 isLive 全顯示，Prod 只顯示 isLive = true
                const gameDetails = res?.result?.gameDetails.filter(v => ShowLiveTestGame(v.isLive));
                const recommendedGames = gameDetails; // .slice(0, 15)
                setRecommendedGames(recommendedGames);
                StorageUtil.save({
                    key: `recommended${categoryCode}`,
                    data: recommendedGames,
                });
            }
        });
    };

    const GameProvidersDetails = async () => {
        let { categoryCode } = props;

        let gameProvidersDetails = getSubProviders(categoryCode);
        setGameProvidersDetails(gameProvidersDetails);

        if (!(Array.isArray(gameProvidersDetails) && gameProvidersDetails.length > 0)) {
            let fetchurl = `${Strapi_Domain}${ApiPort.CMS_GameProvidersDetails}gameType=${categoryCode}&`;

            let val = await StorageUtil.load(`Providers${categoryCode}`) || [];
            setGameProvidersDetails(val);
            return fetchRequestCMS(fetchurl, "GET").then(res => {
                if (res.isSuccess && res.result) {
                    setGameProvidersDetails(res.result);
                    StorageUtil.save({
                        key: `Providers${categoryCode}`,
                        data: res.result,
                    });
                }
            });
        }
    };

    const getGameCategories = async () => {
        const { categoryCode } = props;
        let fetchurl = `${Strapi_Domain}${ApiPort.CMS_GameCategories}gameType=${categoryCode}&platform=app`;

        let val = await StorageUtil.load(`Categories${categoryCode}`) || [];
        let result = val.filter(v => v.categoryType === "Category");
        result.forEach(v => {
            if (v.category == "AllGames") {
                v.name = translate("全部类型");
            }
        });
        setGameCategories(result);
        return fetchRequestCMS(fetchurl, "GET").then(res => {
            let result = res.result.filter(v => v.categoryType === "Category");
            if (res.isSuccess && res.result) {
                result.forEach(v => {
                    if (v.category == "AllGames") {
                        v.name = translate("全部类型");
                    }
                });
                setGameCategories(result);
                StorageUtil.save({
                    key: `Categories${categoryCode}`,
                    data: res.result,
                });
            }
        });
    };


    const piwikHandle = (gameData, type = "launchRecommend") => {
        const { provider = "", gameName = "", providerCode = "", category = "", code = "" } = gameData;
        const { categoryCode = "" } = props;
        const sprHotGame = props?.game?.sprHotGame;

        let realProvider = provider || providerCode || code;

        switch (type) {
            case "launchRecommend":
                PiwikEventDataHandle({
                    category: `${categoryCode}_Listing`,
                    action: `Launch Game ${gameName}`,
                    name: `${categoryCode}_Listing_C_Recommended_${realProvider}_Game`,
                    title: `${categoryCode} Listing`,
                    path: `${categoryCode?.toLowerCase()}_listing`,
                    customProperties: {
                        [`${categoryCode}_Listing_C_Recommended_${realProvider}_GameName`]: gameName,
                    },
                });
                break;

            case "recommendedMore":
                PiwikEventDataHandle({
                    category: `${categoryCode}_Listing`,
                    action: "Go to Recommended Game Listing",
                    name: `${categoryCode}_Listing_C_Recommended_More`,
                    title: `${categoryCode} Listing`,
                    path: `${categoryCode?.toLowerCase()}_listing`, // 統一使用 toLowerCase
                });
                break;

            case "launchJackpot":
                PiwikEventDataHandle({
                    category: `${categoryCode}_Listing`,
                    action: `Launch Game ${gameName}`,
                    name: `${categoryCode}_Listing_C_${realProvider}_Jackpot_Game`,
                    title: `${categoryCode} Listing`,
                    path: `${categoryCode?.toLocaleLowerCase()}_listing`,
                    customProperties: {
                        [`Slot_Listing_C_${realProvider}_Jackpot_GameName`]: gameName,
                    },
                });
                break;

            case "sprHotGame":
                PiwikEventDataHandle({
                    category: "InstantGames_Listing",
                    action: `Launch HotGame ${sprHotGame?.gameName}`,
                    name: "InstantGames_Listing_C_HotGame_SPR_Game",
                    title: "InstantGames Listing",
                    path: "instantgames_listing",
                    customProperties: {
                        ["InstantGames_Listing_C_HotGame_SPR_GameName"]: sprHotGame?.gameName,
                    },
                });
                break;

            case "providerList":
                PiwikEventDataHandle({
                    category: `${categoryCode}_Listing`,
                    action: `Go to ${realProvider} Lobby`,
                    name: `${categoryCode}_Listing_C_${realProvider}`,
                    title: `${categoryCode} Listing`,
                    path: `${categoryCode?.toLocaleLowerCase()}_listing`,
                });
                break;

            case "categoryList":
                PiwikEventDataHandle({
                    category: `${categoryCode}_Lobby`,
                    action: "Filter Game",
                    name: `${categoryCode}_Lobby_C_GameType`,
                    title: `${categoryCode} Listing`,
                    path: `${categoryCode?.toLocaleLowerCase()}_listing`,
                    customProperties: {
                        [`${categoryCode}_Lobby_C_GameType`]: category,
                    },
                });
                break;
        }
    };


    //推薦遊戲跳轉
    const recommendedGameList = () => {
        const { categoryCode } = props;
        // Actions.GameListPage({
        //     categoryCode,
        //     providersMap: context.getSubProvidersMap(categoryCode),
        //     gameLists,
        //     navBarTitle
        // });

        // let { setGameFilterConditions } = props.parentContext.gameStore;


        // let selectedOptions = {
        //     category: [],
        //     line: [],
        //     provider: [],
        //     volatility: [],
        //     feature: []
        // };
        // setGameFilterConditions(selectedOptions);

        Actions.GameFilterPage({
            categoryCode,
        });
        return;
    };

    //平台列表跳轉
    const providerGameList = (gameData = {}) => {
        const { categoryCode } = props;
        if (props.gameInfo?.maintainStatus?.providerCode === gameData?.providerCode) {
            piwikHandle(gameData, "sprHotGame");
            window.getAviator && window.getAviator();
            return;
        }
        piwikHandle(gameData, "providerList");

        let { providerCode = "", code = "" } = gameData;
        Actions.GameFilterPage({
            categoryCode,
            providerCode: providerCode || code,
            presetConditionConfig: {
                routeType: "provider",
                presetCondition: providerCode || code
            }
        });


    };

    //遊戲類型跳轉
    const categoryGameList = (gameData = {}) => {
        const { categoryCode } = props;
        let { setGameFilterConditions } = props.parentContext.gameStore;
        let selectedOptions = {
            category: [gameData],
            line: [],
            provider: [],
            volatility: [],
            feature: []
        };
        setGameFilterConditions(selectedOptions);

        Actions.GameFilterPage({
            categoryCode,
        });
    };

    const { categoryCode } = props;
    const titleText = window.LANGUAGE === "VN" && categoryCode.toLowerCase() === "slot" ? "Slots Đề Xuất" : translate("推荐游戏(LOBBY)");

    return (
        <View style={styles.rootView}>
            <CustomScrollView
                header={
                    <BackBar
                        title={getCategoryName(categoryCode)}
                        onPress={Actions.pop}
                        arrowIconFill={"#999"}
                    />
                }>
                {
                    Boolean((Array.isArray(banner) && banner.length)) &&
                    <CarouselBanner
                        key={categoryCode}
                        categoryCode={categoryCode}
                        bannerData={banner}
                        onBannerClickProp={({ item, index }) => {
                            PiwikEventDataHandle({
                                category: `${categoryCode}_Lobby`,
                                action: "Click Product Banner",
                                name: `${categoryCode}_Lobby_C_ProductBanner`,
                                path: `${categoryCode} Listing`,
                                title: `${categoryCode} Listing`,
                                customProperties: {
                                    [`${categoryCode}_Lobby_C_ProductBanner_Title`]: item.title || "",
                                    [`${categoryCode}_Lobby_C_ProductBanner_Position`]: index,
                                },
                            });
                        }}
                        showPagination={true}
                        bannerWidth={width - 32}
                        bannerHeight={0.426 * (width - 32)}
                        carouselItemWidth={width - 24}  // width - 32 + 8
                        slideStyle={{ paddingHorizontal: 4 }}
                        inactiveSlideScale={1}
                        wrapStyle={{ marginBottom: 20 }}
                    />

                }
                <View style={{ paddingLeft: 16 }}>
                    <GameListRow
                        // listType={listType}
                        games={recommendedGames.filter(game => ShowLiveTestGame(game.isLive))}
                        title={titleText}
                        providersMap={getSubProvidersMap(categoryCode)}
                        visibleAmount={999999999}
                        onSeeMore={recommendedGameList}
                        isSeeMoreVisible={true}
                        launchGame={true}
                    />
                </View>


                <View style={{ paddingHorizontal: 16 }}>
                    <GameProviders gameProvidersDetails={gameProvidersDetails} onProviderSelect={providerGameList} />

                    {/* 遊戲類型列表 */}
                    <GameCategories gameCategories={gameCategories} onCategorySelect={categoryGameList} />
                </View>
            </CustomScrollView>

        </View>
    );
};

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    gameInfo: state.gameInfo,
    game: state.game,
});
const mapDispatchToProps = dispatch => ({
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
});

const ProductGamePageWithContext = props => (
    <ParentContext.Consumer>
        {parentContext => <ProductGamePage {...props} parentContext={parentContext} />}
    </ParentContext.Consumer>
);

export default connect(mapStateToProps, mapDispatchToProps)(ProductGamePageWithContext);

const styles = StyleSheet.create({
    rootView: {
        backgroundColor: "#fff",
        flex: 1
    },
});