import React, { useRef, useState } from "react";

import { Animated, LayoutAnimation, StyleSheet, Text, UIManager, View } from "react-native";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { getMoneyFormat } from "$Utils";
import Color from "$Components/Color";
import CustomTooltip from "$Components/CustomTooltip";
import { RowCenterBetween, RowCenterCenter, RowCenterStart } from "$Components/CustomView";
import { ArrowIcon, LockIcon, WarningIcon } from "$Components/icons/index.js";
import { translate } from "$locales/translate";

// 启用 LayoutAnimation
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const WalletLock = props => {
    let { balanceItem = {}, isToggleBalance = false, fromPage = "", categoryCode = "", firstText = "", firstTipText = "", secnodText = "", secnodTipText = "", defaultIsShow = false, hideModalWithAnimation = () => {} } = props;

    const [isShow, setShow] = useState(defaultIsShow);

    // 创建旋转动画值
    const rotateAnim = useRef(new Animated.Value(0)).current;

    let isProfile = fromPage == "profilePage";

    // 切换动画
    const toggleAnimation = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // 启动旋转动画
        Animated.timing(rotateAnim, {
            toValue: isShow ? 0 : 1, // 切换旋转值
            duration: 300,
            useNativeDriver: true,
        }).start();

        setShow(!isShow);
    };

    return (
        <View style={styles.container}>
            <RowCenterStart
                onPress={() => {
                    toggleAnimation();
                    if (isProfile) {
                        isShow ? PiwikEventDataHandle("OneWallet2") : PiwikEventDataHandle("OneWallet6");
                    } else {
                        isShow
                            ? PiwikEventDataHandle({
                                category: `In${categoryCode}_SideMenu`,
                                action: "Hide Balance Detail",
                                name: `In${categoryCode}_SideMenu_C_HideBalanceDetail`,
                                path: "",
                                title: "",
                            })
                            : PiwikEventDataHandle({
                                category: `In${categoryCode}_SideMenu`,
                                action: "Unhide Balance Detail",
                                name: `In${categoryCode}_SideMenu_C_UnhideBalanceDetail`,
                                path: "",
                                title: "",
                            });
                    }
                }}
                style={{ marginBottom: 4 }}>
                <Text style={styles.moneyShowBtnText}>{isShow ? translate("隐藏部分") : translate("显示全部")}</Text>

                <ArrowIcon fill={Color.gray} width={12} height={12} direction={isShow ? "top" : "bottom"} wrapStyle={{ marginLeft: 10 }} />
            </RowCenterStart>

            {isShow && (
                <>
                    <RowCenterBetween style={[styles.moneyInfoList, { marginVertical: 2 }]}>
                        <RowCenterStart>
                            <Text style={styles.moneyInfoListText}>{firstText}</Text>

                            <CustomTooltip
                                timeOut={4000}
                                text={firstTipText}
                                Icon={
                                    <WarningIcon
                                        type='ring'
                                        fill={Color.gray}
                                        width={16}
                                        height={16}
                                        direction="bottom"
                                    ></WarningIcon>
                                }
                                callBack={() => {
                                    if (isProfile) {
                                        PiwikEventDataHandle("OneWallet3");
                                    } else {
                                        PiwikEventDataHandle({
                                            category: `In${categoryCode}_SideMenu`,
                                            action: "View Balance CustomTooltip",
                                            name: `In${categoryCode}_SideMenu_C_BalanceToolTip`,
                                            path: "",
                                            title: "",
                                        });
                                    }
                                }}
                            />
                        </RowCenterStart>

                        <Text style={styles.moneyInfoListRightText}>{getMoneyFormat(balanceItem?.balance)}</Text>
                    </RowCenterBetween>

                    <RowCenterBetween style={styles.moneyInfoList}>
                        <RowCenterStart style={styles.moneyInfoListLeft}>
                            <Text style={styles.moneyInfoListText}>{secnodText}</Text>

                            <CustomTooltip
                                timeOut={4000}
                                text={secnodTipText}
                                Icon={
                                    <LockIcon
                                        fill={Color.gray}
                                        width={18}
                                        height={18}
                                    ></LockIcon>
                                }
                                callBack={() => {
                                    if (isProfile) {
                                        PiwikEventDataHandle("OneWallet4");
                                    } else {
                                        PiwikEventDataHandle({
                                            category: `In${categoryCode}_SideMenu`,
                                            action: "View Locked Balance CustomTooltip",
                                            name: `In${categoryCode}_SideMenu_C_LockedBalanceTooltip`,
                                            path: "",
                                            title: "",
                                        });
                                    }
                                }}
                            />
                        </RowCenterStart>

                        <RowCenterCenter
                            onPress={() => {
                                hideModalWithAnimation();
                                if (isToggleBalance) {
                                    Actions.LockedBalance({});
                                    PiwikEventDataHandle("OneWallet5");
                                }
                            }}>
                            <Text style={styles.moneyInfoListRightText}>{getMoneyFormat(balanceItem?.lockedBalance)}</Text>

                            {isToggleBalance && (
                                <ArrowIcon
                                    fill={Color.gray}
                                    width={12}
                                    height={12}
                                    direction="right"
                                    wrapStyle={{
                                        position: "absolute",
                                        right: -20,
                                        alignSelf: "center",
                                    }}
                                />
                            )}
                        </RowCenterCenter>
                    </RowCenterBetween>
                </>
            )}
        </View>
    );
};

export default WalletLock;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FAFAFA",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 15,
    },
    moneyShowBtnImg: {
        width: 24,
        height: 24,
    },
    moneyShowBtnText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.gray,
    },
    moneyInfoList: {
        width: "94%",
    },
    moneyInfoListText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "400"
    },
    moneyInfoListRightText: {
        color: "#222",
        fontWeight: "400",
        fontSize: 14,
    },
});
