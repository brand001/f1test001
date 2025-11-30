import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Actions } from "react-native-router-flux";

import { WalletMappingGame } from "@/lib/data/game";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";


import GameSearchPageCom from "$ALLSHARED/APP/components/GameSearchPage/index.js";
import { SESSLOCAL_STORAGE_KEY_PREFIX } from "$ALLSHARED_CONSTANTS";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
const arySearchGamesByTextHistoryKey = SESSLOCAL_STORAGE_KEY_PREFIX + "ary1-of-searchGamesByText";
import { useGame } from "$Hooks";
import StorageUtil from "$Utils/Storage";


export default function GameSearchPage(props) {
    const { categoryCode, navigation } = props;
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const userInfo = useSelector(state => state.userInfo);
    let { getSubProvidersMap } = useGame();

    useEffect(() => {
        const fetchData = async () => {
            let data = await StorageUtil.load("arySearchGamesByTextHistoryKey");
            if (data) {
                localStorage.setItem(arySearchGamesByTextHistoryKey, data);
                setIsInitialLoading(true);
            } else {
                setIsInitialLoading(true);
            }
        };


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

        fetchData();


        return () => {
            StorageUtil.save({
                key: "arySearchGamesByTextHistoryKey",
                data: localStorage.getItem(arySearchGamesByTextHistoryKey),
            });
        };
    }, []);



    return isInitialLoading && <GameSearchPageCom
        gameType={categoryCode}
        onBackClick={Actions.pop}
        providersMap={getSubProvidersMap(categoryCode)}

        onGameInfoClick={(gameInfo) => {
            Actions.GameInforPage({
                categoryCode,
                productGamePageInfor: gameInfo
            });
        }}

        onSeeMore={({ gameLists, navBarTitle, piwikTitle }) => {
            Actions.GameListPage({
                categoryCode,
                providersMap: getSubProvidersMap(categoryCode),
                gameLists,
                navBarTitle
            });

            PiwikEventDataHandle({
                category: `${categoryCode}_Search`,
                action: `View ${piwikTitle} Gamelisting`,
                name: `${categoryCode}_C_${piwikTitle}`,
                path: `${categoryCode}_lobby_search`,
                title: `${categoryCode} Lobby Search`,
            });
        }}
        isSeeMoreVisible={true}
    />;
}