import React, { useEffect } from "react";
import { View } from "react-native";
import { Actions } from "react-native-router-flux";
import { useSelector } from "react-redux";



import { WalletMappingGame } from "@/lib/data/game";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import GameListPageCom from "$ALLSHARED/APP/components/GameListPage/index.js";
import { GetAnnouncementPopup } from "$Utils";

export default function GameListPage(props) {
    let {
        categoryCode = "",
        gameLists = [],
        providersMap = {},
        navigation = {},
        navBarTitle = "",
        showSort = false
    } = props;


    const balanceObj = useSelector(state => state.userInfo.balanceObj);

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

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", }}>
            <GameListPageCom
                gameType={categoryCode}
                providersMap={providersMap}
                gameLists={gameLists}
                navBarTitle={navBarTitle}
                onBackClick={Actions.pop}
                onGameSearchClick={() => {
                    Actions.GameSearchPage({
                        categoryCode,
                    });
                }}
                showSort={showSort}
                onGameInfoClick={(gameInfo) => {
                    Actions.GameInforPage({
                        categoryCode,
                        productGamePageInfor: gameInfo
                    });
                }}
            />
        </View>
    );
};