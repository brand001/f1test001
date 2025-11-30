import React from "react";

import { StyleSheet, Text, View } from "react-native";
import { getMoneyFormat } from "$Utils";
import { translate } from "$locales/translate";

const RewardExample = ({ campaignRewardDetails, notes }) => {
    if (!campaignRewardDetails || campaignRewardDetails.length === 0) {
        return null;
    }

    let firstDepositAmount = campaignRewardDetails[0]?.depositAmount || 300;
    let firstTurnoverAmount = campaignRewardDetails[0]?.turnoverAmount || 900;
    let fisrtReferralRewardAmount = campaignRewardDetails[0]?.referralRewardAmount || 68;
    let firstRefereeRewardAmount = campaignRewardDetails[0]?.refereeRewardAmount || 28;



    let secondDepositAmount = campaignRewardDetails[1]?.depositAmount || 1000;
    let secondTurnoverAmount = campaignRewardDetails[1]?.turnoverAmount || 3000;
    let secondReferralRewardAmount = campaignRewardDetails[1]?.referralRewardAmount || 88;
    let secondRefereeRewardAmount = campaignRewardDetails[1]?.refereeRewardAmount || 38;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{translate("范例：A 推荐 B")}</Text>

            {/* 第一行範例 */}
            <Text style={[styles.noteText, { marginBottom: 15 }]}>
                {
                    translate("B 完成注册，存款满 {X} 元并达到 {Y} 的流水，A 即能获得 {Z} 元 + {A} 元，共 {B} 元的免费彩金。",
                        {
                            X: window.LANGUAGE == "VN" ? getMoneyFormat(firstDepositAmount, "") : getMoneyFormat(secondDepositAmount, ""),
                            Y: window.LANGUAGE == "VN" ? getMoneyFormat(firstTurnoverAmount, "") : getMoneyFormat(secondTurnoverAmount, ""),
                            Z: window.LANGUAGE == "VN" ? getMoneyFormat(fisrtReferralRewardAmount, "") : getMoneyFormat(fisrtReferralRewardAmount, ""),
                            A: window.LANGUAGE == "VN" ? getMoneyFormat(firstRefereeRewardAmount, "") : getMoneyFormat(secondReferralRewardAmount, ""),
                            B: getMoneyFormat(fisrtReferralRewardAmount + secondReferralRewardAmount, ""),
                        }
                    )
                }
            </Text>

            {/* 第二行範例 */}
            <Text style={styles.noteText}>{
                translate("如果 B 存款 {X} 元以上 {Y} 元以下，并达到 {Z} 流水，那会员 A 只能获得 {A} 元免费彩金。", {
                    X: window.LANGUAGE == "VN" ? getMoneyFormat(secondDepositAmount, "") : getMoneyFormat(firstDepositAmount, ""),
                    Y: window.LANGUAGE == "VN" ? getMoneyFormat(firstDepositAmount, "") : getMoneyFormat(secondDepositAmount, ""),
                    Z: window.LANGUAGE == "VN" ? getMoneyFormat(secondTurnoverAmount, "") : getMoneyFormat(firstTurnoverAmount, ""),
                    A: window.LANGUAGE == "VN" ? getMoneyFormat(secondReferralRewardAmount, "") : getMoneyFormat(fisrtReferralRewardAmount, ""),
                    B: window.LANGUAGE == "VN" ? getMoneyFormat(secondRefereeRewardAmount, "") : "",
                })
            }</Text>

            {/* 備註 */}
            <Text style={styles.title}>{translate("备注")}</Text>
            {notes.map((item, index) => (
                <View key={index} style={styles.pageList}>
                    <Text style={styles.noteText}>{index + 1 + ". "}</Text>
                    <Text style={styles.noteText}>{item}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    title: {
        fontSize: 14,
        color: "#222222",
        paddingTop: 15,
        paddingBottom: 10,
        fontWeight: "bold",
    },
    pageList: {
        flexDirection: "row",
        marginBottom: 5,
    },
    noteText: {
        fontSize: 12,
        color: "#666666",
        lineHeight: 16,
    },
});

export default RewardExample;
