import React, { useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { useSelector } from "react-redux";

import { GetAnnouncementPopup } from "$Utils";
import GameFilterPage from "$ALLSHARED/APP/components/GameFilterPage/index.js";


import { WalletMappingGame } from "@/lib/data/game";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import { useGame } from "$Hooks";



export default function Components(props) {
    let {
        categoryCode = "",
        navigation = {},
        presetConditionConfig = {},
        showSort = false,
        navBarTitle = "",
    } = props;

    const balanceObj = useSelector(state => state.userInfo.balanceObj);
    const { getSubProviders, getSubProvidersMap, getCategoryName } = useGame();

    useEffect(() => {
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


        GetAnnouncementPopup({ type: categoryCode });
    }, []);

    return <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <GameFilterPage
            navBarTitle={showSort ? navBarTitle : getCategoryName(categoryCode)}
            categoryCode={categoryCode}
            gameType={categoryCode}
            providers={getSubProviders(categoryCode)}
            onBackClick={() => {
                Actions.pop();
            }}
            onGameFilterPage={() => {

            }}
            onSearchClick={() => {
                Actions.GameSearchPage({
                    categoryCode
                });
            }}
            onGameInfoClick={(gameInfo) => {
                Actions.GameInforPage({
                    categoryCode,
                    productGamePageInfor: gameInfo
                });
            }}
            pageType={"gameFilter"}
            showSort={showSort}
            providersMap={getSubProvidersMap(categoryCode)}
            presetConditionConfig={presetConditionConfig}
            {...props}
        ></GameFilterPage>
    </View>;
}