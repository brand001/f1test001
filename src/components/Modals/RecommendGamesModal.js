import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import { Actions } from "react-native-router-flux";

import { translate } from "$locales/translate";
const { width } = Dimensions.get("window");
import Touch from "react-native-touch-once";

import actions from "@/lib/redux/actions/index";
import store from "@/lib/redux/store/index.js";
import ImageMap from "@/locales/Images";
import Color from "$Components/Color";
import { getAllVendorToken } from "$Utils/SbSportsBridge";
import { Toasts } from "$Toasts";
import { OpenSbSports } from "$Utils";
import { useGame } from "$Hooks";
import { globalModalPadding } from "$Utils/globalModal";
import { LikeIcon } from "$Components/icons/index.js";
import { ColumnCenterCenter } from "$Components/CustomView";



export default function RecommendGamesModal(props) {
    let { onCancel } = props;
    const { getCategoryCode } = useGame();
    const FreebetWithGamesModalData = {
        CN: [
            {
                img: ImageMap.FreebetWithGamesModal1,
                callBack: async () => {
                    Toasts.loading(translate("加载中,请稍候..."));
                    getAllVendorToken().finally(() => {
                        Toasts.removeAll();
                        OpenSbSports();
                    });
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal2,
                callBack: async () => {
                    await goSprHotGame();
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal3,
                callBack: async () => {
                    await GameFilterPage("AGL");
                },
            },
        ],
        TH: [
            {
                img: ImageMap.FreebetWithGamesModal1,
                callBack: async () => {
                    await GameFilterPage("AMB");
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal2,
                callBack: async () => {
                    await goSprHotGame();
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal3,
                callBack: async () => {
                    await GameFilterPage("WEC");
                },
            },
        ],

        VN: [
            {
                img: ImageMap.FreebetWithGamesModal1,
                callBack: async () => {
                    await GameFilterPage("PGS");
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal2,
                callBack: async () => {
                    await goSprHotGame();
                },
            },
            {
                img: ImageMap.FreebetWithGamesModal3,
                callBack: async () => {
                    await GameFilterPage("WEC");
                },
            },
        ],
    };


    async function GameFilterPage(providerCode) {
        Actions.GameFilterPage({
            categoryCode: getCategoryCode(providerCode),
            providerCode,
            presetConditionConfig: {
                routeType: "provider",
                presetCondition: providerCode
            }
        });
    }

    function goSprHotGame() {
        let state = store.getState();
        const provider = state.game.sprHotGame.provider;
        const gameId = state.game.sprHotGame.gameId;
        if (!provider || !gameId) {
            return;
        }
        let data = {
            providerCode: provider,
            gameId,
            categoryCode: "InstantGames"
        };
        store.dispatch(actions.ACTION_PlayGame(data));
    }

    let data = FreebetWithGamesModalData[window.LANGUAGE || "CN"];
    const ImgBoxWidth = width * 0.9 - globalModalPadding * 2;
    const ImgBoxHeight = (width * 0.9 - globalModalPadding * 2) * 0.38;
    return (
        <View style={styles.container}>
            <ColumnCenterCenter>
                <LikeIcon width={66} height={66} wrapStyle={{ marginBottom: 15 }} />
                {Boolean(translate("恭喜您 ！")) && <Text style={styles.title1}>{translate("恭喜您 ！")}</Text>}
            </ColumnCenterCenter>

            <Text style={styles.title2}>{translate("完成推荐好友活动条件，彩金将在24小时内到帐。")}</Text>
            <Text style={[styles.title3]}>{translate("推荐游戏")}</Text>

            {Boolean(Array.isArray(data) && data.length > 0) &&
                data.map((v, i) => {
                    let { img = null, callBack = () => {} } = v;
                    return <Touch
                        key={i}
                        onPress={() => {
                            onCancel();
                            callBack();
                        }}
                        style={[
                            styles.ImgBox,
                            {
                                marginBottom: i === data.length - 1 ? 0 : 14,
                                width: ImgBoxWidth,
                                height: ImgBoxHeight
                            }
                        ]}>
                        <AutoHeightImage
                            resizeMode="stretch"
                            style={styles.ImgBoxImg}
                            source={img}
                        />
                    </Touch>;
                })}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    title1: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "500",
        color: Color.charcoal,
    },
    title2: {
        marginBottom: 16,
        color: Color.charcoal,
        marginTop: 8,
        paddingHorizontal: 45,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "400",
    },
    title3: {
        fontSize: 14,
        fontWeight: "500",
        color: Color.charcoal,
        marginBottom: 10,
    },
    ImgBox: {
        borderRadius: 10,
        overflow: "hidden",
    },
    ImgBoxImg: {
        width: "100%",
        height: "100%",
    },
});
