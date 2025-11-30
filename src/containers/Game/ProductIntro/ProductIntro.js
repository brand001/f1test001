import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
const { width } = Dimensions.get("window");
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import GameProviderList from "@/containers/Game/ProductIntro/GameProviderList";
import CarouselBanner from "$Components/CarouselBanner";
import actions from "$LIB/redux/actions";
import { translate } from "$locales/translate";
import { getAllVendorToken } from "$Utils/SbSportsBridge";
import { Toasts } from "$Toasts";
import { CheckYBSGame, GameLockToast, GetAnnouncementPopup, GetSelfExclusionPopup, OpenSbSports } from "$Utils";
import StorageUtil from "$Utils/Storage";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import { WalletMappingGame } from "@/lib/data/game";
import CustomScrollView from "$Components/CustomScrollView";
import { useGame, useBanner } from "$Hooks";

import BackBar from "$ALLSHARED/APP/uiComponents/BackBar";


// 游戏供应商介绍页面
const ProductIntro = (props) => {
    const { getSubProviders, getCategoryName } = useGame();
    const { getGameBanner } = useBanner();
    const [gameProvidersDetails, setGameProvidersDetails] = useState([]);
    const [banner, setBanner] = useState([]);
    const [showYbs, setShowYbs] = useState(true);

    useEffect(() => {
        const initializeComponent = async () => {
            const { categoryCode = "" } = props;
            //設置標題
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

            let gameProvidersDetails = getSubProviders(categoryCode);
            setGameProvidersDetails(gameProvidersDetails);

            const bannerData = await getGameBanner(categoryCode);
            setBanner(bannerData);

            if (!(Array.isArray(gameProvidersDetails) && gameProvidersDetails.length > 0)) {
                GameProvidersDetails(categoryCode);
            }

            if (props?.categoryCode == "Sportsbook") {
                let isYbs = await CheckYBSGame();
                setShowYbs(isYbs);
            }
        };

        initializeComponent();
    }, []);


    const GameProvidersDetails = async (categoryCode) => {
        let fetchurl = `${global.Strapi_Domain}${global.ApiPort.CMS_GameProvidersDetails}gameType=${categoryCode}&`;
        let val = await StorageUtil.load(`Providers${categoryCode}`) || [];
        setGameProvidersDetails(val);
        fetchRequestCMS(fetchurl, "GET").then(res => {
            if (res.isSuccess && res.result) {
                setGameProvidersDetails(res.result);
                Toasts.removeAll();
                StorageUtil.save({
                    key: `Providers${categoryCode}`,
                    data: res.result,
                });
            }
        });
    };


    const handleSB2 = async () => {
        //樂體育不用彈窗
        if (ApiPort.UserLogin) {
            // 自我限制檢查
            let isSelfExclusionPopup = await GetSelfExclusionPopup();
            if (isSelfExclusionPopup) return;

            if (GameLockToast()) return;

            //已登入 先獲取token後跳轉
            Toasts.loading(translate("加载中..."));
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


    const lanchGame = (item) => {
        const { categoryCode = "" } = props;
        const providerCode = item?.providerCode || item?.code;

        switch (providerCode) {
            case "SB2":
                handleSB2();
                break;
            default: {
                const data = {
                    providerCode: providerCode,
                    gameId: null,
                    categoryCode: categoryCode,
                    gameName: item?.name
                };
                props.playGame(data);
                break;
            }
        }


        PiwikEventDataHandle({
            category: `${categoryCode}_Listing`,
            action: `Launch ${providerCode}`,
            name: `${categoryCode}_Listing_C_${providerCode}`,
            path: `${categoryCode} Listing`,
            title: `${categoryCode?.toLocaleLowerCase()}_listing`,
        });
    };

    const { categoryCode = "" } = props;
    let filteredGameProvidersDetails = [...gameProvidersDetails];
    if (!showYbs) {
        let ybsIndx = filteredGameProvidersDetails.findIndex(item => (item.providerCode === "YBS" || item.code === "YBS"));
        if (ybsIndx > -1) {
            filteredGameProvidersDetails.splice(ybsIndx, 1);
        }
    }

    return <View style={styles.rootView}>
        <CustomScrollView
            header={
                <BackBar
                    title={getCategoryName(categoryCode)}
                    onPress={Actions.pop}
                    arrowIconFill={"#999"}
                />
            }

        >
            {/* BANNER輪播圖 */}
            {
                banner.length > 0 &&
                <CarouselBanner
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
                />
            }

            {/* 遊戲列表 */}
            <View style={{ paddingHorizontal: 16 }}>
                <GameProviderList
                    title={translate("平台")}
                    gameProvidersDetails={filteredGameProvidersDetails}
                    categoryCode={categoryCode}
                    onLanchGame={lanchGame}
                />
            </View>
        </CustomScrollView>
    </View>;
};

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    userSetting: state.userSetting,
});
const mapDispatchToProps = dispatch => ({
    playGame: data => dispatch(actions.ACTION_PlayGame(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductIntro);

const styles = StyleSheet.create({
    rootView: {
        backgroundColor: "#fff",
        flex: 1,
    },
});
