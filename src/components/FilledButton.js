import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Color from "$Components/Color";

const ButtonType = {
    xlarge: {
        height: 56,
        borderRadius: 8,
        fontSize: 18
    },
    large: {
        height: 44,
        borderRadius: 8,
        fontSize: 16
    },
    medium: {
        height: 36,
        borderRadius: 8,
        fontSize: 14
    },
    small: {
        height: 24,
        borderRadius: 8,
        fontSize: 12
    },
};

export default function FilledButton(props) {
    const [isPressed, setIsPressed] = useState(false);
    const lastPressTime = useRef(0);
    const {
        text = "",
        outlined = false,
        onPress = () => {},
        wrapStyle = {},
        enable = true,
        textStyle = {},
        children = null,
        type = "large",
        fullWidth = true,
        throttleTime = 400, // 节流时间间隔（毫秒）
        variant = "default",
    } = props;

    const Tag = enable ? TouchableOpacity : View;
    const { height, borderRadius, fontSize } = ButtonType[type] || ButtonType.large;

    // ✅ 根据 variant 计算背景色和文字色
    const getButtonColors = () => {
        if (!enable) {
            return {
                backgroundColor: Color.mediumGray,
                textColor: Color.gray,
            };
        }

        if (variant === "light") {
            return {
                backgroundColor: isPressed ? Color.lightGray : Color.white,
                textColor: Color.theme,
            };
        }

        // default variant
        return {
            backgroundColor: isPressed ? Color.hoverTheme : Color.theme,
            textColor: Color.white,
        };
    };

    const { backgroundColor, textColor } = getButtonColors();

    // 节流处理函数：第一次点击立即执行，throttleTime 内的后续点击被忽略，throttleTime 后可以再次执行
    const handlePress = () => {
        if (!enable) return;

        const now = Date.now();

        // 如果是第一次点击（lastPressTime.current === 0），立即执行
        if (lastPressTime.current === 0) {
            lastPressTime.current = now;
            onPress();
            return;
        }

        const timeSinceLastPress = now - lastPressTime.current;

        if (timeSinceLastPress < throttleTime) {
            // 在节流时间间隔内，忽略本次点击
            return;
        }

        // 更新上次点击时间并执行
        lastPressTime.current = now;
        onPress();
    };

    return (
        <Tag
            style={[
                styles.button,
                {
                    backgroundColor,
                    height,
                    borderRadius,
                },
                fullWidth ? { alignSelf: "stretch" } : { alignSelf: "center" }, // ✅ 控制是否占满一行
                outlined && styles.outlinedButton,
                variant === "light" && styles.lightButton,
                wrapStyle,
            ]}
            onPressIn={() => !outlined && setIsPressed(true)}
            onPressOut={() => !outlined && setIsPressed(false)}
            onPress={enable ? handlePress : undefined}
        >
            {children}
            <Text
                style={[
                    styles.text,
                    {
                        color: textColor,
                        fontSize,
                        fontWeight: textStyle.fontWeight || "bold",
                    },
                    outlined && styles.outlinedText,
                    variant === "light" && styles.lightText,
                    textStyle,
                ]}>
                {text}
            </Text>
        </Tag>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        height: 44,
        backgroundColor: Color.theme,
        textAlign: "center",
        flexDirection: "row"
    },
    outlinedButton: {
        borderWidth: 1,
        borderColor: Color.theme,
        backgroundColor: Color.transparent,
    },
    text: {
        textAlign: "center",
    },
    outlinedText: {
        color: Color.theme,
    },
    lightButton: {
        backgroundColor: Color.white,
    },
    lightText: {
        color: Color.theme,
    },
});
