import React from "react";

import { Dimensions, StyleSheet, Text, View } from "react-native";

import { FormatDate } from "$Utils";
import { translate } from "$locales/translate";
import { RowCenterCenter } from "$Components/CustomView";
const { width } = Dimensions.get("window");
const defaultDate = new Date("2023-01-01"); //默認時間

/**
 * 推薦好友三步驟
 * @param {string} startDateTime - 活動開始時間
 */
const ReferralProcess = ({ startDateTime = FormatDate(defaultDate, { timeLevel: "onlyDate" }) }) => {
    return (
        <>
            <Text style={styles.titles}>{translate("推荐好友三步骤")}</Text>

            {/* 步驟1 */}
            <RowCenterCenter style={styles.pageList}>
                <Text style={styles.num}>1</Text>
                <View>
                    <Text style={styles.pageapian}>{translate("点击 “立即加入” 按钮")}</Text>
                    <Text style={styles.pageapian1}>{translate("满足指定条件，生成推荐链接。")}</Text>
                </View>
            </RowCenterCenter>

            {/* 步驟2 */}
            <RowCenterCenter style={styles.pageList}>
                <Text style={styles.num}>2</Text>
                <View>
                    <Text style={styles.pageapian}>{translate("分享推荐链接或二维码")}</Text>
                    <Text style={styles.pageapian1}>{translate("被推荐的好友须透过链接注册并进行游戏。")}</Text>
                </View>
            </RowCenterCenter>

            {/* 步驟3 */}
            <RowCenterCenter style={styles.pageList}>
                <Text style={styles.num}>3</Text>
                <View>
                    <Text style={styles.pageapian}>{translate("查看进度及获得彩金")}</Text>
                    <Text style={styles.pageapian1}>{translate("可随时前往 “推荐好友” 页面查看好友们的注册、充值、流水进度。")}</Text>
                </View>
            </RowCenterCenter>

            {/* 活动开始时间 */}
            <Text style={styles.DateTime}>
                {translate("活动开始时间")} {startDateTime}
            </Text>
        </>
    );
};

const styles = StyleSheet.create({
    titles: {
        paddingLeft: 15,
        color: "#222222",
        fontSize: 14,
        paddingBottom: 15,
        fontWeight: "bold",
    },
    pageList: {
        paddingVertical: 24,
        paddingHorizontal: 15,
        width: width - 30,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    num: {
        color: "#00A6FF",
        fontSize: 50,
        fontWeight: "bold",
        marginRight: 15,
    },
    pageapian: {
        color: "#222222",
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "bold",
        flexWrap: "wrap",
        width: width * 0.7,
    },
    pageapian1: {
        color: "#666666",
        fontSize: 12,
        width: width * 0.7,
    },
    DateTime: {
        textAlign: "center",
        fontSize: 12,
        color: "#666666",
    },
});

export default ReferralProcess;
