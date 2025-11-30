import React from "react";

import { Image, StyleSheet, View } from "react-native";
import Touch from "react-native-touch-once";
import { CopyIcon, ArrowIcon, TimeIcon, CalendarIcon, BackTopIcon } from "$Components/icons/index";

/**
 * 回到頂部按鈕組件
 * @param {boolean} visible - 是否顯示按鈕
 * @param {Function} onPress - 點擊按鈕的回調函數
 * @param {Object} style - 自定義樣式
 * @param {Object} imageStyle - 自定義圖片樣式
 * @param {any} source - 自定義圖片來源
 */
const GoTopIcon = ({ visible = false, onPress = () => {}, style = {}, imageStyle = {} }) => {
    if (!visible) return null;

    return (
        <View style={[styles.goTop, style]}>
            <BackTopIcon onPress={onPress}>

            </BackTopIcon>
        </View>
    );
};

const styles = StyleSheet.create({
    goTop: {
        position: "absolute",
        right: 16,
        bottom: 16,
        // 移除 bottom，完全由参数控制
        zIndex: 9999,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default GoTopIcon;
