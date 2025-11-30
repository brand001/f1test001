import React from "react";

import { Platform, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Color from "$Components/Color";
import { CloseIcon, MoreIcon, RefreshIcon } from "$Components/icons/index.js";
import LiveChat from "$Components/LiveChat";
import LoginRegist from "$Components/LoginRegist";
import actions from "$LIB/redux/actions/index";
import WalletInfoBar from "$Components/WalletInfoBar";
import { RowCenterCenter, RowStartCenter } from "$Components/CustomView";

export default function GamePageNavRight(props) {
    const reduxState = useSelector(state => state);
    const dispatch = useDispatch();
    let {
        depositCallBack = () => {},
        wrapStyle = {
            height: "100%",
        },
        type = "",
        showCs = false,
        showRefresh = false,
        loginCallBack = () => {},
        registCallBack = () => {},
        expandCallBack = () => {},
        csCallBack = () => {},
        refreshCallBack = () => {},
        categoryCode = "ALL",
        amount = 0,
        children = null,
        showVip = false,
        showOngoingDeposit = false
    } = props;

    let { userSetting = {} } = reduxState;
    let { flag = false } = userSetting?.oneClickPopup || {};
    return (
        <RowCenterCenter style={[styles.viewWrap, wrapStyle]}>
            {
                children
            }


            {
                !ApiPort.UserLogin &&
                <LoginRegist
                    loginCallBack={loginCallBack}
                    registCallBack={registCallBack}
                />
            }


            {
                ApiPort.UserLogin &&
                <RowCenterCenter>
                    {
                        showRefresh &&
                        <RefreshIcon
                            fill={Color.white}
                            width={14}
                            height={14}
                            spinning={true}
                            onPress={refreshCallBack}
                            wrapStyle={{ marginRight: 12 }}
                        />
                    }


                    {
                        type == "money" &&
                        <View style={{ position: "relative", }}>
                            <WalletInfoBar
                                categoryCode={categoryCode?.toLocaleUpperCase()}
                                onPress={depositCallBack}
                                amount={amount}
                            />
                            { // red dot for ongoing deposit with central payment
                                showOngoingDeposit &&
                                <View style={styles.redDot} />
                            }
                        </View>
                    }


                    {
                        type == "more" && (flag ? (
                            <CloseIcon
                                fill={Color.white}
                                onPress={() => {
                                    dispatch(actions.ACTION_ONECLICKPOPUP({ flag: !flag }));
                                    expandCallBack({
                                        type: "expand"
                                    });
                                }}
                                width={24}
                                height={24}
                            />
                        ) : (
                            <MoreIcon
                                fill={Color.white}
                                onPress={() => {
                                    dispatch(actions.ACTION_ONECLICKPOPUP({ flag: !flag }));
                                    expandCallBack({
                                        type: "expand"
                                    });
                                }}
                                width={24}
                                height={24}
                            />
                        ))
                    }
                </RowCenterCenter>
            }

            {
                showCs &&
                <LiveChat
                    callBack={() => {
                        csCallBack({
                            type: "cs"
                        });
                    }}
                    showVip={showVip}
                />
            }
        </RowCenterCenter>
    );
}

const styles = StyleSheet.create({
    viewWrap: {
        marginRight: 10,
    },

    redDot: { width: 8, height: 8, backgroundColor: "#FF2424", borderRadius: 4, position: "absolute", top: -2, right: 10 },
});
