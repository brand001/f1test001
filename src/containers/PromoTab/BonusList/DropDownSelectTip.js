import React, { useState } from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { getMoneyFormat } from "$Utils";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";
import DropDownSelect from "$Components/DropDownSelect";
import FilledButton from "$Components/FilledButton";
import { WarningIcon, SuccessIcon } from "$Components/icons/index";
import CustomCheckbox from "$Components/CustomCheckbox";
import { ColumnCenterCenter, RowCenterBetween } from "$Components/CustomView";

export function BonusActiveDropDownSelect(props) {
    let {
        modalVisible = false,
        closeModal = () => {},
        confirm = () => {},

        isTurnoverProgress = false,
        cancelBonusType = "",
        winningAmount = 0,
        bonusGivenAmount = 0,
        pullbackAmount = 0,

        onPress = () => {},
    } = props;

    const [isChecked, setCheck] = useState(false);

    return (
        <DropDownSelect
            animationType="slideDown"
            modalVisible={modalVisible}
            title={translate("重要提示")}
            closeModal={() => {
                closeModal(false);
                setCheck(false);
            }}
            confirm={() => {
                confirm();
                setCheck(false);
            }}
            showCSIcon={true}>
            <View style={styles.container}>
                <ColumnCenterCenter style={[styles.inforBox]}>
                    <WarningIcon width={45} height={45} fill={"#F5B200"} wrapStyle={{ marginBottom: 10 }} />

                    {cancelBonusType == "POST" ? (
                        <Text style={styles.dropDownSelectText}>{translate("优惠进行期间，已累计的有效流水将会失效。")}</Text> /// 取消优惠，已累计的有效流水将会失效
                    ) : (
                        <>
                            <Text style={styles.dropDownSelectText}>
                                {isTurnoverProgress
                                    ? translate("取消优惠将会撤回 {x} 元", {
                                        x: getMoneyFormat(pullbackAmount, ""),
                                    })
                                    : translate("取消优惠将会撤回预付彩金 {x} 元", {
                                        x: getMoneyFormat(pullbackAmount, ""),
                                    })}
                            </Text>
                            <View style={styles.line} />
                            {winningAmount <= 0 ? (
                                <Text style={styles.dropDownSelectText}>{translate("优惠进行期间，已累计的有效流水将会失效。")}</Text>
                            ) : (
                                <View>
                                    <View style={[styles.confirmCancelBonusDisclaimerWrap]}>
                                        <Text style={styles.dropDownSelectText}>1. </Text>
                                        <Text style={[styles.dropDownSelectText, { textAlign: "left" }]}>
                                            {translate("取消此优惠将会撤回预付彩金 {x} 元，以及申请优惠后投注所获得的盈利 {x} 元。", {
                                                x: getMoneyFormat(bonusGivenAmount, ""),
                                                y: getMoneyFormat(winningAmount, ""),
                                            })}
                                        </Text>
                                    </View>
                                    <View style={[styles.confirmCancelBonusDisclaimerWrap]}>
                                        <Text style={styles.dropDownSelectText}>2. </Text>
                                        <Text style={[styles.dropDownSelectText, { textAlign: "left" }]}>{translate("优惠进行期间，已累计的有效流水将会失效。")}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ColumnCenterCenter>

                {/* 新增確認閱讀提示框 */}
                <CustomCheckbox
                    isFull={false}
                    isCheck={isChecked}
                    type="medium"
                    text={<CustomLinkText
                        norMaltextStyle={[styles.dropDownSelectText, { fontSize: 13 }]}
                        text={translate("我已阅读上述说明，并同意{取消进行中的优惠}")}
                        themeTextStyle={[
                            [styles.dropDownSelectText],
                            {
                                fontWeight: "bold",
                                fontSize: 13,
                                color: Color.charcoal,
                            },
                        ]}
                    />}
                    onPress={isChecked => {
                        setCheck(isChecked);
                    }}
                />
                <View>
                    <FilledButton
                        onPress={() => {
                            setCheck(false);
                            closeModal(false);

                            onPress();
                        }}
                        text={translate("确认4")}
                        enable={isChecked}
                        wrapStyle={{ marginBottom: 10 }}
                    />

                    <FilledButton
                        text={translate("返回")}
                        outlined={true}
                        onPress={() => {
                            setCheck(false);
                            closeModal(false);
                        }}
                    />
                </View>
            </View>
        </DropDownSelect>
    );
}

export function BonusReceiveeDropDownSelect(props) {
    let {
        modalVisible = false,
        closeModal = () => {},

        isToggleBalance = false,
        goLockedBalance = () => {},
    } = props;
    return (
        <DropDownSelect animationType="slideDown" modalVisible={modalVisible} title={translate("彩金领取成功")} closeModal={closeModal}>
            <View style={styles.container}>
                <ColumnCenterCenter style={[styles.inforBox, { marginBottom: 15 }]}>
                    <SuccessIcon width={45} height={45} fill={Color.vividGreen} type="ring" wrapStyle={{ marginBottom: 10 }} />
                    <Text style={styles.dropDownSelectText}>{translate("领取的彩金金额需要在指定时间内，完成指定流水倍数才可提款，否则将会回收此彩金。")}</Text>
                </ColumnCenterCenter>

                {
                    isToggleBalance &&
                    <FilledButton
                        onPress={goLockedBalance}
                        text={translate("查看未完成流水金额")}
                        wrapStyle={{ marginBottom: 10 }}
                        outlined={!isToggleBalance}
                    />
                }

                <FilledButton
                    onPress={closeModal}
                    text={translate("我知道了")}
                    outlined={isToggleBalance}
                />
            </View>
        </DropDownSelect>
    );
}

export function ConfirmBonusDropDownSelect(props) {
    let {
        modalVisible = false,
        closeModal = () => {},

        errorMsg = {},
        givenAmount = 0,

        showCSIcon = false,

        onPress = () => {},
    } = props;

    const [isChecked, setCheck] = useState(false);

    return (
        <DropDownSelect
            animationType="slideDown"
            modalVisible={modalVisible}
            title={translate("重要提示")}
            closeModal={() => {
                setCheck(false);
                closeModal(false);
            }}
            confirm={() => {
                setCheck(false);
                closeModal(false);
            }}
            showCSIcon={showCSIcon}>
            <View style={styles.container}>
                <ColumnCenterCenter style={[styles.inforBox]}>
                    <WarningIcon width={45} height={45} fill={"#F5B200"} wrapStyle={{ marginBottom: 10 }} />

                    {errorMsg?.data?.pullbackAmount ? (
                        <CustomLinkText
                            norMaltextStyle={styles.dropDownSelectText}
                            text={translate("您目前有一项进行中的优惠，将会为您取消原本的优惠，且撤回 {{x}} 元", {
                                x: getMoneyFormat(errorMsg?.data?.pullbackAmount || 0, ""),
                            })}
                            themeTextStyle={[styles.dropDownSelectText, { fontWeight: "bold", co: Color.charcoal }]}
                        />
                    ) : (
                        <Text style={[styles.dropDownSelectText]}>{translate("您目前有一项进行中的优惠，将会为您取消原本的优惠")}</Text>
                    )}

                    <View style={{ marginTop: 10, width: "100%" }}>
                        <View style={[styles.confirmBonusSubContainer]}>
                            <RowCenterBetween
                                style={[
                                    styles.bonusAmountContainer,
                                    {
                                        borderBottomWidth: 1,
                                        borderBottomColor: Color.mediumGray,
                                    },
                                ]}>
                                <Text style={[styles.bonusAmountSpacingText]}>{translate("进行中优惠彩金金额")}</Text>
                                <Text style={[styles.bonusAmountSpacingAmount]}>{getMoneyFormat(errorMsg?.data?.bonusGiven || 0)}</Text>
                            </RowCenterBetween>

                            <RowCenterBetween style={[styles.bonusAmountContainer]}>
                                <Text style={[styles.bonusAmountSpacingText]}>{translate("新优惠彩金金额")}</Text>
                                <Text style={[styles.bonusAmountSpacingAmount]}>{getMoneyFormat(givenAmount || 0)}</Text>
                            </RowCenterBetween>
                        </View>
                        <Text style={[styles.confirmBonusText]}>{translate("优惠进行期间，已累计的有效流水将会失效。")}</Text>
                    </View>
                </ColumnCenterCenter>

                {/* 新增確認閱讀提示框 */}
                <CustomCheckbox
                    isFull={false}
                    isCheck={isChecked}
                    type="medium"
                    text={<CustomLinkText
                        norMaltextStyle={[styles.dropDownSelectText, { fontSize: 13 }]}
                        text={translate("我已阅读上述说明，并同意{取消进行中的优惠}")}
                        themeTextStyle={[
                            [styles.dropDownSelectText],
                            {
                                fontWeight: "bold",
                                fontSize: 13,
                                color: Color.charcoal,
                            },
                        ]}
                    />}
                    onPress={isChecked => {
                        setCheck(isChecked);
                    }}
                />

                <View>
                    <FilledButton
                        onPress={() => {
                            if (!isChecked) return;

                            setCheck(false);
                            closeModal(false);
                            onPress("cancel");
                        }}
                        text={translate("确认4")}
                        enable={isChecked}
                        wrapStyle={{ marginBottom: 10 }}
                    />

                    <FilledButton
                        onPress={() => {
                            setCheck(false);
                            closeModal(false);
                        }}
                        text={translate("返回")}
                        outlined={true}
                    />
                </View>
            </View>
        </DropDownSelect>
    );
}

const styles = StyleSheet.create({
    container: {
        //marginBottom: 20
    },
    inforBox: {
        padding: 15,
        borderRadius: 6,
        backgroundColor: Color.white,
    },
    dropDownSelectIcon: {
        width: 44,
        height: 44,
        marginBottom: 15,
    },
    dropDownSelectText: {
        color: Color.darkGray,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "400",
        flexWrap: "wrap",
    },
    line: {
        width: "100%",
        height: 1,
        marginVertical: 15,
        backgroundColor: Color.mediumGray,
    },
    confirmCancelBonusDisclaimerWrap: {
        flexDirection: "row",
        marginVertical: 3,
    },

    confirmBonusSubContainer: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 2,
        borderColor: Color.mediumGray,
        backgroundColor: Color.lightSilver,
    },
    confirmBonusText: {
        fontSize: 12,
        marginTop: 12,
        color: Color.gray,
    },
    bonusAmountContainer: {
        paddingVertical: 10,
    },
    bonusAmountSpacingText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.gray,
    },
    bonusAmountSpacingAmount: {
        fontSize: 14,
        color: Color.charcoal,
        fontWeight: "400",
    },
});
