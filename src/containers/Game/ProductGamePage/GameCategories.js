import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";

import { translate } from "$locales/translate";
import { RowCenterBetween, RowStartCenter } from "$Components/CustomView";
import { ImagesUrl } from "@/images/index";
/**
 * 遊戲類型列表組件
 * @param {Array} gameCategories - 遊戲類型數據
 * @param {Function} onCategorySelect - 選擇類型的回調函數
 * @returns {JSX.Element|null}
 */
const GameCategories = ({ gameCategories = [], onCategorySelect }) => {
    const { width } = Dimensions.get("window");
    const itemWidth3 = (width - 16 * 2 - 16) / 3;

    // 如果沒有遊戲，不顯示整個區塊
    if (!gameCategories || gameCategories.length === 0) {
        return null;
    }

    return (
        <>
            {/* 標題區塊 */}
            <View style={styles.LabelBox}>
                <Text style={styles.gameTextLabel}>{translate("游戏类型")}</Text>
            </View>

            {/* 列表區塊 */}
            <RowCenterBetween style={styles.container}>
                {gameCategories.map((category, index) => (
                    <RowStartCenter key={index} onPress={() => onCategorySelect(category)} style={[styles.gameCategoriesContainer, { width: itemWidth3 }]}>
                        <Image
                            resizeMode="stretch"
                            defaultSource={ImagesUrl.loadinglight}
                            source={{ uri: category.iconNormal }}
                            style={{ width: 25, height: 25, marginRight: 5 }}
                        />

                        <Text style={[styles.gameCategoriesText, { width: itemWidth3 - 55 }]}>{category.name}</Text>
                    </RowStartCenter>
                ))}

                {gameCategories.length > 0 && gameCategories.length % 3 !== 0 && <View style={[styles.gameCategoriesInner, { width: itemWidth3 }]} />}
            </RowCenterBetween>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
    },
    gameCategoriesContainer: {
        borderRadius: 6,
        backgroundColor: "#EFEFF4",
        height: 44,
        marginBottom: 16,
        overflow: "hidden",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    gameCategoriesInner: {
        height: 44,
        marginBottom: 8,
    },
    gameCategoriesText: {
        color: "#333",
        fontSize: 12,
        fontWeight: '400',
        flexWrap: "wrap",
    },
    LabelBox: {
        marginTop: 8,
        marginBottom: 8,
    },
    gameTextLabel: {
        color: "#222",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default GameCategories;
