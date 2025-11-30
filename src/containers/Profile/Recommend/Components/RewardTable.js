import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { getMoneyFormat } from "$Utils";
import { ColumnCenterCenter } from "$Components/CustomView";

const RewardTable = ({ title, topTitles, subTitles, campaignRewardDetails }) => {
    // 處理數據邏輯
    const formatAmount = (detail, field) => {
        if (!detail) return "N/A";

        const value = detail[field];
        if (value === 0) return "0";
        return value ? getMoneyFormat(value, "") : "N/A";
    };

    const getFormattedData = () => {
        if (!campaignRewardDetails || campaignRewardDetails.length === 0) {
            return [];
        }

        return campaignRewardDetails.map(detail => ({
            depositAmount: formatAmount(detail, "depositAmount"),
            turnoverAmount: formatAmount(detail, "turnoverAmount"),
            refereeRewardAmount: formatAmount(detail, "refereeRewardAmount"),
            referralRewardAmount: formatAmount(detail, "referralRewardAmount"),
        }));
    };

    const formattedData = getFormattedData();

    // 數據單元格渲染函數
    const renderCell = (value, isReward = false) => (
        <ColumnCenterCenter style={[styles.dataCell, window.LANGUAGE === "CN" ? { borderRightWidth: 0 } : {}, { backgroundColor: "#fff" }]}>
            <Text style={[styles.pricesTxt, { color: isReward ? "#00A6FF" : "#232323" }]}>{value}</Text>
        </ColumnCenterCenter>
    );

    return (
        <>
            {/* 推荐奖金 */}
            <Text style={styles.titles}>{title}</Text>

            <View style={styles.container}>
                {/* 第一行主標題 */}
                <View style={styles.topTitles}>
                    {topTitles.map((item, index) => (
                        <ColumnCenterCenter
                            key={index}
                            style={[
                                styles.pricesTitleBox,
                                index === topTitles.length - 1 ? { borderRightWidth: 0 } : {},
                                window.LANGUAGE === "CN" ? { borderRightWidth: 0 } : {},
                                {
                                    width: window.LANGUAGE === "CN" ? "50%" : `${item.width * 107}%`,
                                },
                            ]}>
                            <Text style={styles.pricesTitleBold}>{item.title}</Text>
                        </ColumnCenterCenter>
                    ))}
                </View>

                {/* 第二行子標題 */}
                <View style={styles.subTitles}>
                    {subTitles.map((item, index) => (
                        <ColumnCenterCenter key={index} style={[styles.pricesRegionTitle, window.LANGUAGE === "CN" ? { borderRightWidth: 0 } : {}]}>
                            <Text style={[styles.pricesTxt, { color: "#030303" }]}>{item}</Text>
                        </ColumnCenterCenter>
                    ))}
                </View>

                {/* 第三行推薦獎金試算 */}
                {formattedData.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={styles.dataRow}>
                        {/* 左半邊 */}
                        <View style={window.LANGUAGE === "CN" ? { flexDirection: "row", width: "66.67%" } : styles.dataRowHalf}>
                            {renderCell(rowData.depositAmount)}
                            {renderCell(rowData.turnoverAmount)}
                        </View>

                        {/* 右半邊 */}
                        <View style={window.LANGUAGE === "CN" ? { flexDirection: "row", width: "33.33%" } : styles.dataRowHalf}>
                            {window.LANGUAGE === "CN" ? null : renderCell(rowData.refereeRewardAmount, true)}
                            {renderCell(rowData.referralRewardAmount, true)}
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E3E3E3",
        backgroundColor: "#fff",
    },
    titles: {
        color: "#222222",
        fontSize: 14,
        marginVertical: 15,
        fontWeight: "bold",
    },
    topTitles: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F2",
        height: 35,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        backgroundColor: "#00A6FF",
    },
    pricesTitleBox: {
        height: 35,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: "#E2E2E2",
    },
    pricesTitleBold: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
    },
    pricesRegionTitle: {
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: "#F3F5F9",
        borderBottomColor: "#E3E3E3",
        borderRightColor: "#E3E3E3",
        height: 25,
    },
    pricesTxt: {
        textAlign: "center",
        fontSize: 12,
        color: "#030303",
    },
    subTitles: {
        width: "100%",
        flexDirection: "row",
    },
    dataRow: {
        width: "100%",
        height: 35,
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    dataRowHalf: {
        width: "50%",
        flexDirection: "row",
    },
    dataCell: {
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3",
        borderRightColor: "#E3E3E3",
        height: 35,
    },
});

export default RewardTable;
