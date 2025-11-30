import React from "react";

/**
 * 單選按鈕組件
 * @param {boolean} isSelected - 是否被選中
 * @param {number} [size=16] - 按鈕大小，默認為16
 * @param {function} [onPress] - 點擊事件處理函數
 *
 * @example
 * // 基本使用
 * <RadioButton isSelected={selected} onPress={() => setSelected(!selected)} />
 *
 * // 自定義大小
 * <RadioButton isSelected={selected} size={20} onPress={handlePress} />
 */

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ColumnCenterCenter } from "./CustomView";

const RadioButton = ({ isSelected, size = 16, onPress }) => {
    // 計算內圓大小為外圓的一半
    const innerSize = size / 2;

    const buttonStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    const innerCircleStyle = {
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container onPress={onPress} style={styles.container}>
            {isSelected ? (
                <ColumnCenterCenter style={[styles.selectedButton, buttonStyle]}>
                    <View style={[styles.innerCircle, innerCircleStyle]} />
                </ColumnCenterCenter>
            ) : (
                <ColumnCenterCenter style={[styles.unselectedButton, buttonStyle]} />
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {},
    selectedButton: {
        backgroundColor: "#00A6FF",
    },
    unselectedButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#BCBEC3",
    },
    innerCircle: {
        backgroundColor: "#fff",
    },
});

export default RadioButton;
