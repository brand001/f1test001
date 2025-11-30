import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import Touch from "react-native-touch-once";

import Color from "$Components/Color";
import { ColumnCenterCenter, RowCenterCenter, RowCenterAround, RowCenterBetween } from "$Components/CustomView";
import { ArrowIcon } from "$Components/icons/index.js";


export function RecordItem({
    titleText = "",
    subtitleText = "",
    iconSource = null,
    bottomLeftText = "",
    bottomRightText = "",
    bottomLeftValue = "",
    bottomRightValue = "",
    bottomRightValueColor = "#222222",
    onPress = () => {}
}) {
    return (
        <Touch
            onPress={onPress}
            style={styles.list}>
            <RowCenterBetween>
                <RowCenterCenter>
                    {iconSource && (
                        <Image resizeMode="stretch" source={iconSource} style={{ width: 35, height: 35, marginRight: 10 }} />
                    )}
                    <View>
                        <Text style={styles.title}>{titleText}</Text>
                        {
                            subtitleText && <Text style={styles.time}>{subtitleText}</Text>
                        }
                    </View>
                </RowCenterCenter>

                <ArrowIcon fill={Color.silverGray} width={15} height={15} direction="right" />
            </RowCenterBetween>

            <View style={styles.line} />

            <RowCenterAround>
                <ColumnCenterCenter>
                    <Text style={styles.infor}>{bottomLeftText}</Text>

                    <Text style={styles.turnover}>{bottomLeftValue}</Text>
                </ColumnCenterCenter>
                <ColumnCenterCenter>
                    <Text style={styles.infor}>{bottomRightText}</Text>
                    <Text
                        style={[
                            styles.turnover,
                            { color: bottomRightValueColor },
                        ]}>
                        {bottomRightValue}
                    </Text>
                </ColumnCenterCenter>
            </RowCenterAround>
        </Touch>
    );
}

export function RecordDetailItem({
    items = [],
}) {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <View style={[styles.list]}>
            {items.map((item, index) => {
                const { label = "", value = "", color = "#222222" } = item;
                return (
                    <RowCenterBetween key={index}>
                        <Text style={styles.headerListTitle}>{label}</Text>
                        <Text
                            style={[
                                styles.headerListInfor,
                                { color },
                            ]}>
                            {value}
                        </Text>
                    </RowCenterBetween>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    line: {
        height: 1,
        backgroundColor: "#F3F3F3",
        alignSelf: "stretch",
        marginVertical: 15,
    },
    title: {
        color: "#000",
        fontWeight: "bold",
        marginBottom: 2,
        fontSize: 16,
    },
    time: {
        fontSize: 14,
        color: "#8a8a8a",
    },
    infor: {
        fontSize: 14,
        marginBottom: 10,
        color: "#999999",
    },
    turnover: {
        color: "#222222",
        fontWeight: "500",
        fontSize: 16,
    },
    headerListTitle: {
        color: "#666666",
        marginBottom: 5,
        fontSize: 14,
    },
    headerListInfor: {
        color: "#222222",
        fontSize: 14,
        fontWeight: "500",
    },
});

// 默认导出 RecordItem 以保持向后兼容
export default RecordItem;
