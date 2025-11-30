import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Actions } from "react-native-router-flux";

import { WalletMappingGame } from "@/lib/data/game";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import GameInforPageCom from "$ALLSHARED/APP/components/GameInforPage/index.js";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { useGame } from "$Hooks";

import { GetAnnouncementPopup } from "$Utils";


export default function GameInforPage(props) {
    const { categoryCode, productGamePageInfor, navigation } = props;
    const userInfo = useSelector(state => state.userInfo);
    const { getSubProvidersMap } = useGame();
    useEffect(() => {
        navigation.setParams({
            rightButton: () => {
                return <GamePageNavRight
                    type='money'
                    showRefresh={false}
                    showCs={true}
                    categoryCode={categoryCode}
                    depositCallBack={Actions.DepositCenter}
                    amount={userInfo.balanceObj?.[WalletMappingGame?.[categoryCode?.toLocaleUpperCase()]]?.balance}
                />;
            }
        });


        GetAnnouncementPopup({ type: categoryCode });
    }, []);




    return <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <GameInforPageCom
            categoryCode={categoryCode}
            providersMap={getSubProvidersMap(categoryCode)}
            productGamePageInfor={productGamePageInfor}
            onBackClick={Actions.pop}
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
            onSeeMore={({ gameLists, navBarTitle, piwikTitle, providerCode }) => {

                Actions.GameFilterPage({
                    categoryCode,
                    providerCode,
                    presetConditionConfig: {
                        routeType: "provider",
                        presetCondition: providerCode
                    }
                });

                PiwikEventDataHandle({
                    category: `${categoryCode}_Gameinfo`,
                    action: `View ${piwikTitle} Gamelisting`,
                    name: `${categoryCode}_Gameinfo_C_${piwikTitle}`,
                    path: `${categoryCode}_info_page`,
                    title: `${categoryCode} Info Page`,
                });
            }}
            isSeeMoreVisible={true}
        />
    </View>;
}