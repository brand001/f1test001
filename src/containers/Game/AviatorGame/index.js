import React, { useEffect, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Animated,
    Image
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
import { RootSiblingPortal } from "react-native-root-siblings";
import ExpandArrow from "$Components/ExpandArrow";
import MoneyText from "$Components/MoneyText";
import { DepositIcon, RefreshIcon } from "$Components/icons/index";
import InfoBar from "$Components/InfoBar";

const { width, height } = Dimensions.get("window");

const OneWallet = props => {
    const dispatch = useDispatch();
    const {
        balanceItem = {
            walletProductGroupName: "",
            balance: 0,
            lockedBalance: 0,
            usableAmount: "",
        },
        categoryCode = "Sportsbook",
        fromPage = "",
        top = 0,
        wrapStyle = {},
        style = {},
        showExpandArrow = false,
        useRootSiblingPortal = false,
        animationDirection = "horizontal", // ✅ 新增动画方向
    } = props;

    const isHorizontal = animationDirection === "horizontal";
    const translateAnim = useRef(new Animated.Value(isHorizontal ? width : -height)).current;
    const userName = useSelector(state => state?.userInfo)?.userName;

    useEffect(() => {
        Animated.timing(translateAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        dispatch(actions.ACTION_UserInfo_getBalanceAll(true));
    }, []);

    const hideWallet = () => {
        Animated.timing(translateAnim, {
            toValue: isHorizontal ? width : -height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            dispatch(actions.ACTION_ONECLICKPOPUP({ flag: false }));
        });
    };

    let { walletProductGroupName = "", balance = 0, lockedBalance = 0, usableAmount = "" } = balanceItem;

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
    let Tag = useRootSiblingPortal ? RootSiblingPortal : React.Fragment;
    return (
        <Tag>
            <TouchableWithoutFeedback onPress={hideWallet}>
                <View
                    style={[
                        styles.viewContainer,
                        {
                            top: top,
                            ...wrapStyle,
                        },
                    ]}
                >
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <Animated.View
                            style={[
                                styles.oneWalletContainer,
                                style,
                                {
                                    transform: [
                                        isHorizontal
                                            ? { translateX: translateAnim }
                                            : { translateY: translateAnim },
                                    ],
                                },
                            ]}
                        >
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
                                />
                            </View>

                            <RowCenterStart
                                style={styles.depositBox}
                                onPress={() => {
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
                                        onPress={hideWallet}
                                    />
                                </View>
                            }
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Tag>

    );
};

export default OneWallet;

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: "rgba(0, 0, 0, .6)",
        width,
        height,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 999999,
    },
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
        position: "relative"
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
