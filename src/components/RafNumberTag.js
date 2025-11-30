import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

/**
 * 數字標籤組件（簡化版）- 使用純 CSS 實現
 * @param {string|number} number - 顯示的數字
 * @param {array} colors - 漸變顏色陣列，預設為藍色漸變
 * @param {object} style - 自定義樣式
 * @param {object} textStyle - 文字樣式
 */
const NumberTagSimple = ({
    number = "3",
    colors = ["#6DCAFF", "#00A6FF"],
    style = {},
    textStyle = {}
}) => {
    return (
        <View style={[styles.container, style]}>
            {/* 主標籤部分 - 矩形 */}
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.tagMain}
            >
                <Text style={[styles.text, textStyle]}>{number}</Text>
            </LinearGradient>

            {/* 底部三角形 - 與左右對齊 */}
            <View style={styles.triangleContainer}>
                <View style={[styles.triangle, { borderTopColor: colors[1] }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 30,
        height: 40,
        alignItems: "center",
    },
    tagMain: {
        width: 30,
        height: 28, // 主體高度，三角形從這裡開始
        alignItems: "center",
        justifyContent: "center",
    },
    triangleContainer: {
        width: 30, // 與標籤寬度一致，確保對齊
        height: 12,
        alignItems: "center",
        overflow: "hidden",
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 15, // 一半寬度，確保與左右對齊
        borderRightWidth: 15, // 一半寬度，確保與左右對齊
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        // borderTopColor 在組件中動態設置
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default NumberTagSimple;

