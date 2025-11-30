import React from "react";

/**
 * 獎金進度組件
 * @param {number} progressBar1 - 點擊次數
 * @param {number} progressBar2 - 註冊人數
 * @param {number} progressBar3 - 存款人數
 * @param {number} progressBar4 - 第一級獎勵人數
 * @param {number} progressBar5 - 第二級獎勵人數
 * @param {number} firstTierRewardAmount - 第一級獎勵金額
 * @param {number} secondTierRewardAmount - 第二級獎勵金額
 * @param {string} referrerPayoutAmount - 總獎勵金額
 * @param {object} progressBarData1 - 第一級進度數據
 * @param {object} progressBarData2 - 第二級進度數據
 *
 * @example
 * <BonusProgress
 *   progressBar1={10}
 *   progressBar2={5}
 *   progressBar3={3}
 *   progressBar4={2}
 *   progressBar5={1}
 *   firstTierRewardAmount={38}
 *   secondTierRewardAmount={88}
 *   referrerPayoutAmount={200}
 *   progressBarData1={progressData1}
 *   progressBarData2={progressData2}
 * />
 */
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { getMoneyFormat } from "$Utils";
import Color from "$Components/Color";
import { translate } from "$locales/translate";
import { RowCenterBetween, RowCenterCenter, RowStartBetween } from "$Components/CustomView";

const { width } = Dimensions.get("window");

const BonusProgress = ({
    progressBar1 = 0,
    progressBar2 = 0,
    progressBar3 = 0,
    progressBar4 = 0,
    progressBar5 = 0,
    firstTierRewardAmount = 0,
    secondTierRewardAmount = 0,
    referrerPayoutAmount = 0,
    progressBarData1 = {},
    progressBarData2 = {},
}) => {
    //基本步驟item
    const stepItem = (value, label, suffix) => (
        <RowStartBetween style={styles.progressList}>
            <RowCenterCenter>
                <View style={[value !== 0 ? styles.yuan : styles.kong]} />
                <Text style={[styles.progressTxt, { color: value !== 0 ? "#1C8EFF" : "#999999" }]}>{label}</Text>
            </RowCenterCenter>
            <Text style={[styles.progressTxt, { color: "#666" }]}>
                {value} {suffix}
            </Text>
            <View style={styles.progressView} />
        </RowStartBetween>
    );

    //彩金備註文字
    const bonusNote = progressData => {
        if (!progressData) return null;

        return (
            <View style={styles.bonusNote}>
                {progressData !== "" && <Text style={styles.bonusNoteTxt}>{progressData.depositMsg + " / " + progressData.turnoverMsg + " / " + progressData.rulesMsg}</Text>}
            </View>
        );
    };

    const rewardStep = (value, rewardAmount, progressData, showProgressView = true) => (
        <RowStartBetween style={[styles.progressList, { height: 60 }]}>
            <RowCenterCenter>
                <View style={[value !== 0 ? styles.yuan : styles.kong]} />
                <Text style={[styles.progressTxt, { color: value !== 0 ? "#1C8EFF" : "#666666" }]}>
                    {translate("彩金")} {getMoneyFormat(rewardAmount)}
                </Text>
            </RowCenterCenter>

            <Text style={[styles.progressTxt, { color: "#666" }]}>
                {value} {translate("人")}
            </Text>

            {/* 備註文字 */}
            {bonusNote(progressData)}

            {showProgressView && <View style={[styles.progressView, { height: 60 }]} />}
        </RowStartBetween>
    );

    return (
        <>
            <Text style={styles.titles}>{translate("奖金进度")}</Text>
            <View style={styles.container}>
                <View style={styles.progress}>
                    {/* 链接步驟 */}
                    {stepItem(progressBar1, translate("链接"), translate("点击"))}

                    {/* 注册步驟 */}
                    {stepItem(progressBar2, translate("注册(奖金进度)"), translate("人"))}

                    {/* 存款步驟 */}
                    {stepItem(progressBar3, translate("存款(奖金进度)"), translate("人"))}

                    {/* 彩金 ¥38步驟 */}
                    {rewardStep(progressBar4, firstTierRewardAmount, progressBarData1, true)}

                    {/* 彩金 ¥88步驟 */}
                    {rewardStep(progressBar5, secondTierRewardAmount, progressBarData2, false)}
                </View>

                {/* 总得奖金 */}
                <RowCenterBetween style={[{ padding: 20 }]}>
                    <Text style={styles.amountText}>{translate("总得奖金")}</Text>
                    <Text style={styles.amountText}>{window.LANGUAGE === "VN" ? getMoneyFormat(referrerPayoutAmount, "VND") : `￥ ${getMoneyFormat(referrerPayoutAmount, "")}`}</Text>
                </RowCenterBetween>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    titles: {
        color: "#222222",
        fontSize: 14,
        marginBottom: 15,
        fontWeight: "500",
    },
    amountText: {
        fontSize: 14,
        color: Color.charcoal,
        fontWeight: "500",
    },
    progress: {
        width: width - 30,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F2",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    progressList: {
        width: width - 60,
        height: 40,
    },
    progressView: {
        width: 2,
        height: 40,
        backgroundColor: "#F0F0F2",
        marginLeft: 3,
        position: "absolute",
        bottom: -6,
        left: 0,
        zIndex: -1,
    },
    yuan: {
        width: 8,
        height: 8,
        borderRadius: 15,
        backgroundColor: "#1C8EFF",
        fontSize: 12,
    },
    kong: {
        width: 8,
        height: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "#fff",
        fontSize: 12,
    },
    progressTxt: {
        fontSize: 12,
        paddingLeft: 15,
        fontWeight: "500",
    },
    bonusNote: {
        position: "absolute",
        bottom: 15,
        left: 23,
        width: "80%",
    },
    bonusNoteTxt: {
        fontSize: 10,
        color: Color.gray,
    },
});

export default BonusProgress;
