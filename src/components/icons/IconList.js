import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import * as Icons from "./index";
import Touch from "react-native-touch-once";
import { CopyText } from "$LIB/utils/index";

const IconList = () => {
    const iconComponents = Object.entries(Icons).map(([name, Icon]) => {
        // 跳过非组件的导出
        if (typeof Icon !== "function") return null;

        return (
            <Touch
                key={name}
                style={styles.iconContainer}
                onPress={() => {
                    CopyText(name);
                }}
            >
                <View style={styles.iconWrapper}>
                    <Icon width={24} height={24} fill="#fff" color="#fff" style={{ color: "#fff" }} />
                </View>
                <Text style={styles.iconName}>{name}</Text>
            </Touch>
        );
    }).filter(Boolean); // 过滤掉 null 值

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SVG ICON {iconComponents.length}</Text>
            <Text style={[styles.title, { color: "red", fontWeight: "bold" }]}>可点击复制需要的Iocn</Text>
            <Text style={styles.title}>npx @svgr/cli ./src/components/icons/svg/warningRing.svg --native -d ./src/components/icons</Text>
            <View style={styles.grid}>
                {iconComponents}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1f1f1f",
    },
    title: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
        marginVertical: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
    },
    iconContainer: {
        width: "25%",
        padding: 10,
        alignItems: "center",
    },
    iconWrapper: {
        width: 40,
        height: 40,
        backgroundColor: "#333",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    iconName: {
        marginTop: 5,
        fontSize: 12,
        textAlign: "center",
        color: "#fff",
    },
});

export default IconList; 