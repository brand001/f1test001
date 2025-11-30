import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { useSelector } from "react-redux";
const { width } = Dimensions.get("window");

import { GetAnnouncementPopup } from "$Utils";

import GameLobbyPage from "$ALLSHARED/APP/components/GameLobbyPage/index.js";
import BackBar from "$ALLSHARED/APP/uiComponents/BackBar.js";



import { WalletMappingGame } from "@/lib/data/game";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import CarouselBanner from "$Components/CarouselBanner";
import CustomScrollView from "$Components/CustomScrollView";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { usePromotion, useGame, useBanner } from "$Hooks";




export default function Components(props) {
    let {
        categoryCode = "",
        navigation = {},
        presetConditionConfig = {},
    } = props;

    const balanceObj = useSelector(state => state.userInfo.balanceObj);
    const [banner, setBanner] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const { getPromotionData, getPromotionStatusDetail } = usePromotion();
    const { getCategoryName, getSubProviders, getSubProvidersMap } = useGame();
    const { getGameBanner } = useBanner();


    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = async () => {
        await fetchData();
        // 更新 refreshKey 来强制子组件重新渲染
        setRefreshKey(prev => prev + 1);
    };

    const fetchData = async () => {
        try {
            setBanner(getGameBanner(categoryCode));
            GetAnnouncementPopup({ type: categoryCode });
            navigation.setParams({
                rightButton: () => {
                    return <GamePageNavRight
                        type='money'
                        showRefresh={false}
                        showCs={true}
                        categoryCode={categoryCode}
                        depositCallBack={Actions.DepositCenter}
                        amount={balanceObj?.[WalletMappingGame?.[categoryCode?.toLocaleUpperCase()]]?.balance}
                    />;
                }
            });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    return <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <CustomScrollView
            style={{ paddingLeft: 16, flex: 1, borderRadius: 6, overflow: "hidden" }}
            onRefresh={handleRefresh}
            header={
                <BackBar
                    title={getCategoryName(categoryCode)}
                    showSearch={true}
                    onGameSearchClick={() => {
                        Actions.GameSearchPage({
                            categoryCode,
                        });
                    }}
                />
            }
        >
            {
                Boolean((Array.isArray(banner) && banner.length)) &&
                <CarouselBanner
                    wrapStyle={{ width, marginBottom: 25, marginHorizontal: -15 }}
                    key={`carousel-${categoryCode}-${refreshKey}`}
                    categoryCode={categoryCode}
                    bannerData={banner}
                    onBannerClickProp={({ item, index }) => {
                        PiwikEventDataHandle({
                            category: `${categoryCode}_Lobby`,
                            action: "Click Product Banner",
                            name: `${categoryCode}_Lobby_C_ProductBanner`,
                            path: `${categoryCode}_lobby`,
                            title: `${categoryCode} Lobby`,
                            customProperties: {
                                [`${categoryCode}_Lobby_C_ProductBanner_Title`]: item?.title || "",
                                [`${categoryCode}_Lobby_C_ProductBanner_Position`]: index,
                            }
                        });
                    }}
                    showPagination={true}
                    bannerWidth={width - 32}
                    bannerHeight={0.426 * (width - 32)}
                    carouselItemWidth={width - 24}  // width - 32 + 8
                    slideStyle={{ paddingHorizontal: 4 }}
                    inactiveSlideScale={1}
                />
            }
            <GameLobbyPage
                key={`gameLobby-${categoryCode}-${refreshKey}`}
                gameType={categoryCode}
                presetConditionConfig={presetConditionConfig}
                providers={getSubProviders(categoryCode)}
                providersMap={getSubProvidersMap(categoryCode)}
                promotionsList={getPromotionData("SLOT")}
                onBackClick={Actions.pop}
                onSeeMore={({ gameLists, navBarTitle, piwikTitle }) => {
                    Actions.GameListPage({
                        categoryCode,
                        providersMap: getSubProvidersMap(categoryCode),
                        gameLists,
                        navBarTitle
                    });


                    PiwikEventDataHandle({
                        category: `${categoryCode}_Lobby`,
                        action: `View ${piwikTitle} Gamelisting`,
                        name: `${categoryCode}_C_${piwikTitle}`,
                        path: `${categoryCode}_lobby`,
                        title: `${categoryCode} Lobby`,
                    });
                }}
                onSeeMorePromotionsClick={() => {
                    Actions.jump("Promotion");
                }}
                onPromotionClick={(item) => {
                    getPromotionStatusDetail({ promotionId: item?.promoId });

                    PiwikEventDataHandle({
                        category: `${categoryCode}_Lobby`,
                        action: "Click Banner (Promotion)",
                        name: `${categoryCode}_Lobby_C_PromotionBanner`,
                        path: `${categoryCode}_lobby`,
                        title: `${categoryCode} Lobby`,
                        customProperties: {
                            [`${categoryCode}_Lobby_C_PromotiontBanner_BannerName`]: item?.promoTitle || ""
                        }
                    });
                }}
                onGameFilterPage={() => {
                    Actions.GameFilterPage({
                        categoryCode,
                    });
                }}
                onGameInfoClick={(gameInfo) => {
                    Actions.GameInforPage({
                        categoryCode,
                        productGamePageInfor: gameInfo
                    });
                }}
                pageType={"gameLobby"}
                onGameSearchClick={() => {
                    Actions.GameSearchPage({
                        categoryCode,
                    });
                }}
                onLobbyEntryClick={(props) => {
                    // Actions.GameFilterPage({
                    //     categoryCode,
                    // })
                    // return

                    Actions.GameFilterPage({
                        categoryCode,
                        pageType: "allGameList",
                        ...props
                    });


                    PiwikEventDataHandle({
                        category: `${categoryCode}_Lobby`,
                        action: "Go to All Slot Page",
                        name: `${categoryCode}_Lobby_C_AllSlotPage`,
                        path: `${categoryCode}_lobby`,
                        title: `${categoryCode} Lobby`,
                    });

                }}
                onFilterProvider={(providerCode) => {
                    Actions.GameFilterPage({
                        categoryCode,
                        providerCode,
                        presetConditionConfig: {
                            routeType: "provider",
                            presetCondition: providerCode
                        }
                    });

                    PiwikEventDataHandle({
                        category: `${categoryCode}_Lobby`,
                        action: `View ${providerCode} Gamelisting`,
                        name: `${categoryCode}_Lobby_C_${providerCode}`,
                        path: `${categoryCode}_lobby`,
                        title: `${categoryCode} Lobby`,
                    });
                }}
            />
        </CustomScrollView>
    </View>;
}