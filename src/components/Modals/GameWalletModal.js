import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import Color from "$Components/Color";
import LiveChat from "$Components/LiveChat";
import WalletLock from "$Components/WalletLock";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";
import ExpandArrow from "$Components/ExpandArrow";
import MoneyText from "$Components/MoneyText";
import { DepositIcon, RefreshIcon } from "$Components/icons/index";
import InfoBar from "$Components/InfoBar";

const OneWallet = ({ modalData = {}, onCancel = () => {} }) => {
    const dispatch = useDispatch();
    const {
        balanceItem = {
            walletProductGroupName: "",
            balance: 0,
            lockedBalance: 0,
            usableAmount: "",
        },
        categoryCode = "Sportsbook",
        showExpandArrow = false,
    } = modalData;


    let { walletProductGroupName = "", balance = 0 } = balanceItem;
    const userName = useSelector(state => state?.userInfo)?.userName;

    const piwikHandle = type => {
        switch (type) {
            case "CS":
                PiwikEventDataHandle({
                    category: `In${categoryCode}_SideMenu`,
                    action: "Contact CS",
                    name: `In${categoryCode}_SideMenu_C_CS`,
                    path: "",
                    title: "",
                });
                break;

            case "RefreshBalance":
                PiwikEventDataHandle({
                    category: `In${categoryCode}_SideMenu`,
                    action: "Refresh Balance",
                    name: `In${categoryCode}_SideMenu_C_RefreshBalance`,
                    path: "",
                    title: "",
                });
                break;
        }
    };


    return (
        <View style={[styles.oneWalletContainer]}>
            <RowCenterBetween style={{ marginBottom: 16 }}>
                <Text style={styles.userName}>{userName}</Text>
                <LiveChat
                    csp={true}
                    callBack={() => {
                        piwikHandle("CS");
                    }}
                />
            </RowCenterBetween>

            {
                balance <= 0 &&
                <InfoBar
                    text={translate("余额不足，请存款")}
                    wrapStyle={{ marginBottom: 16 }}
                />
            }


            <View style={styles.inforContainer}>
                <RowCenterStart style={styles.walletBox}>
                    <Text style={styles.walletText}>
                        {window.LANGUAGE === "CN"
                            ? `${walletProductGroupName} ${translate("可用金额")}`
                            : `${translate("可用金额")} ${walletProductGroupName}`}
                    </Text>
                    <RefreshIcon
                        onPress={() => {
                            dispatch(actions.ACTION_UserInfo_getBalanceAll(true));
                            piwikHandle("RefreshBalance");
                        }}
                        fill={Color.gray}
                        width={14}
                        height={14}
                        spinning={true}
                        wrapStyle={{}}
                    />
                </RowCenterStart>

                <RowCenterStart style={{ marginVertical: 10 }}>
                    <MoneyText
                        style={styles.amountTxt}
                        amount={balance}
                    />
                </RowCenterStart>

                <WalletLock
                    firstText={translate("通用金额")}
                    firstTipText={translate("可用于下注任何类别游戏")}
                    secnodText={translate("优惠锁定金额")}
                    secnodTipText={translate("因申请优惠而被锁定的金额，仅可于该类别游戏中使用")}
                    balanceItem={balanceItem}
                    isToggleBalance={true}
                    defaultIsShow={false}
                    fromPage="gamePage"
                    categoryCode={categoryCode}
                    hideModalWithAnimation={onCancel}
                />
            </View>

            <RowCenterStart
                style={styles.depositBox}
                onPress={() => {
                    onCancel();
                    Actions.DepositCenter();

                    PiwikEventDataHandle({
                        category: `In${categoryCode}_SideMenu`,
                        action: "Go to Deposit",
                        name: `In${categoryCode}_SideMenu_C_Deposit`,
                        path: "",
                        title: "",
                    });
                }}
            >

                <DepositIcon
                    width={26}
                    height={26}
                />
                <Text style={styles.depositText}>{translate("存款")}</Text>
            </RowCenterStart>

            {
                showExpandArrow &&
                <View style={{ alignItems: "center" }}>
                    <ExpandArrow
                        buttonStyle={{ backgroundColor: Color.white }}
                        onPress={onCancel}
                    />
                </View>
            }


        </View>

    );
};

export default OneWallet;

const styles = StyleSheet.create({
    walletText: {
        fontSize: 12,
        color: Color.darkGray,
        marginRight: 15,
    },
    walletBox: {

    },
    amountTxt: {
        fontSize: 20,
        color: Color.charcoal,
        fontWeight: "bold",
    },
    oneWalletContainer: {
        backgroundColor: "#EFEFF4",
        padding: 20,
        zIndex: 9999999999,
        position: "relative",
        width: "100%",
        height: "100%",
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: Color.charcoal,
    },
    depositBox: {
        backgroundColor: Color.white,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: "100%",
    },
    depositText: {
        color: Color.darkGray,
        fontWeight: "400",
        fontSize: 14,
        marginLeft: 8,
    },
    inforContainer: {
        backgroundColor: Color.white,
        borderRadius: 10,
        padding: 16,
        paddingBottom: 0,
        marginBottom: 16,
    }
});
