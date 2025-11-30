import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";

import Color from "$Components/Color";
import CornerLabel from "$Components/CornerLabel";
import { RowStartBetween } from "$Components/CustomView";
import { ImagesUrl } from "@/images/index";
const { width } = Dimensions.get("window");

// 封裝的游戲提供商列表組件
const GameProviderList = ({
    gameProvidersDetails = [],
    title = "",
    onLanchGame = () => {}
}) => {

    return (
        <>
            <Text style={styles.title}>{title}</Text>
            <RowStartBetween style={styles.container}>
                {gameProvidersDetails.length > 0 &&
                    gameProvidersDetails.map((item, i) => (
                        <Touch key={i} style={[styles.inner]} onPress={() => onLanchGame(item)}>
                            {/* 如果 isHot 為 true 則優先顯示 HOT，否則檢查 isNew */}
                            <CornerLabel
                                cornerRadius={54}
                                gradient={true}
                                borderRadius={6}
                                type={item.isNew ? "NEW" : item.isHot && "HOT"} />

                            {item && item.banner ? (
                                <Image
                                    resizeMode="stretch"
                                    style={[styles.gameImg, { width: "100%" }]}
                                    defaultSource={ImagesUrl.loadinglight}
                                    source={{
                                        uri: item.banner,
                                    }}
                                />
                            ) : (
                                <Image
                                    resizeMode="stretch"
                                    style={[styles.gameImg, { width: "100%" }]}
                                    defaultSource={ImagesUrl.loadinglight}
                                    source={ImagesUrl.loadinglight}
                                />
                            )}
                        </Touch>
                    ))}
            </RowStartBetween>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: Color.charcoal,
        marginVertical: 15,
    },
    inner: {
        width: "100%",
        height: 0.39 * width,
        marginBottom: 16,
        overflow: "hidden",
        borderRadius: 6,
    },
    gameImg: {
        flex: 1,
        borderRadius: 8,
    },
});

export default GameProviderList;
