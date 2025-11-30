import React from "react";

import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Touch from "react-native-touch-once";

import CornerLabel from "$Components/CornerLabel"; // 假設你使用這個庫來實現漸變效果
import { translate } from "$locales/translate";
import { RowCenterBetween } from "$Components/CustomView";
import { ImagesUrl } from "@/images/index";
const { width, height } = Dimensions.get("window");
const itemWidth3 = (width - 16 * 2 - 16) / 3;

/**
 * 遊戲平台列表組件
 * @param {Array} gameProvidersDetails - 遊戲平台詳情數據
 * @param {Function} onProviderSelect - 選擇平台的回調函數
 * @returns {JSX.Element|null}
 */
const GameProviders = ({ gameProvidersDetails = [], onProviderSelect }) => {
    // 如果沒有遊戲，不顯示整個區塊
    if (!gameProvidersDetails || gameProvidersDetails.length === 0) {
        return null;
    }

    return (
        <>
            {/* 標題區塊 */}
            <View style={styles.LabelBox}>
                <Text style={styles.gameTextLabel}>{translate("我们的平台")}</Text>
            </View>

            {/* 列表區塊 */}
            <RowCenterBetween style={styles.container}>
                {gameProvidersDetails.map((v, i) => {
                    const imgUrl = v.image;
                    return (
                        <Touch
                            key={i}
                            style={[
                                styles.item,
                                {
                                    marginBottom: (i + 1) % 3 === 0 ? 0 : 8,
                                    width: itemWidth3,
                                    height: itemWidth3,
                                },
                            ]}
                            onPress={() => onProviderSelect(v)}>
                            <ImageBackground
                                source={{ uri: imgUrl }}
                                resizeMethod="resize"
                                resizeMode="cover"
                                style={{ flex: 1 }}
                                defaultSource={ImagesUrl.loadinglight}
                                imageStyle={styles.itemImg}>
                                {/* 如果 isHot 為 true 則優先顯示 HOT，否則檢查 isNew */}
                                <CornerLabel
                                    gradient={true}
                                    cornerRadius={54}
                                    type={v.isNew ? "NEW" : v.isHot && "HOT"} />
                                <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.4)"]} style={styles.providerContainer}>
                                    <Text style={styles.gameContentTitle}>{v?.providerName || v?.name}</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </Touch>
                    );
                })}
                {gameProvidersDetails.length > 0 && gameProvidersDetails.length % 3 !== 0 && <View style={styles.fakeItem} />}
            </RowCenterBetween>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
    },
    item: {
        borderRadius: 6,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    itemImg: {
        width: "100%",
        height: "100%",
        borderRadius: 6,
    },
    fakeItem: {
        width: itemWidth3,
        height: itemWidth3,
        borderRadius: 6,
        overflow: "hidden",
    },
    providerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        position: "absolute",
        width: "100%",
        height: 35,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    gameContentTitle: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 14,
    },
    LabelBox: {
        marginBottom: 8,
    },
    gameTextLabel: {
        color: "#222",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default GameProviders;
