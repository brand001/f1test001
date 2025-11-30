import React from "react";

import { StyleSheet, Text, View } from "react-native";

import Color from "./Color";

// 檢查文本是否包含大括號模式
const hasMatchPattern = text => {
    return /\{[^{}]*\}/.test(text);
};

const parseTextWithLinks = ({ text, onPressList, norMaltextStyle, themeTextStyle, exactClickableText }) => {
    // 如果指定了精確可點擊文本
    if (exactClickableText) {
        const textWithoutBrackets = text.replace(/\{([^{}]*)\}/g, "$1");
        const parts = [];

        // 查找可點擊文本的位置（忽略大括號）
        const clickableIndex = textWithoutBrackets.indexOf(exactClickableText);

        if (clickableIndex === -1) {
            return [
                <Text key="all" style={[styles.text1, norMaltextStyle]}>
                    {textWithoutBrackets}
                </Text>,
            ];
        }

        // 添加點擊文本前的內容
        if (clickableIndex > 0) {
            parts.push(
                <Text key="before" style={[styles.text1, norMaltextStyle]}>
                    {textWithoutBrackets.substring(0, clickableIndex)}
                </Text>,
            );
        }

        // 添加可點擊文本
        parts.push(
            <Text key="clickable" style={[styles.text2, themeTextStyle]} onPress={onPressList[0]}>
                {exactClickableText}
            </Text>,
        );

        // 添加點擊文本後的內容
        if (clickableIndex + exactClickableText.length < textWithoutBrackets.length) {
            parts.push(
                <Text key="after" style={[styles.text1, norMaltextStyle]}>
                    {textWithoutBrackets.substring(clickableIndex + exactClickableText.length)}
                </Text>,
            );
        }

        return parts;
    }

    // 原有的大括號解析邏輯
    const regex = /\{([^{}]*)\}/g;
    let lastIndex = 0;
    let elements = [];
    let matchCount = 0;

    text.replace(regex, (match, content, index) => {
        if (index > lastIndex) {
            elements.push(
                <Text key={lastIndex} style={[styles.text1, norMaltextStyle]}>
                    {text.substring(lastIndex, index)}
                </Text>,
            );
        }

        const handlePress = onPressList.length > matchCount ? onPressList[matchCount] : undefined;

        elements.push(
            <Text key={index} style={[styles.text2, themeTextStyle]} onPress={handlePress}>
                {content}
            </Text>,
        );

        lastIndex = index + match.length;
        matchCount++;
    });

    if (lastIndex < text.length) {
        elements.push(
            <Text key={lastIndex} style={[styles.text1, norMaltextStyle]}>
                {text.substring(lastIndex)}
            </Text>,
        );
    }

    return elements;
};

const CustomLinkText = ({
    text = "",
    wrapStyle = {},
    onPressList = [],
    textAlign = "left",
    norMaltextStyle = {},
    themeTextStyle = {},
    exactClickableText = null, // 精確可點擊文本
    stripBrackets = false, // 是否移除所有大括號（用於特殊情況）
    usePrueText = false,
}) => {
    // 如果需要移除所有大括號
    const processedText = stripBrackets ? text.replace(/\{([^{}]*)\}/g, "$1") : text;

    // 渲染處理後的文本
    return usePrueText ? (
        <Text style={{ textAlign }}>
            {parseTextWithLinks({
                text: processedText,
                onPressList,
                norMaltextStyle,
                themeTextStyle,
                exactClickableText,
            })}
        </Text>
    ) : (
        <View style={[styles.box, wrapStyle]}>
            <Text style={{ textAlign }}>
                {parseTextWithLinks({
                    text: processedText,
                    onPressList,
                    norMaltextStyle,
                    themeTextStyle,
                    exactClickableText,
                })}
            </Text>
        </View>
    );
};

export default CustomLinkText;

const styles = StyleSheet.create({
    box: {
        marginVertical: 10,
    },
    text1: {
        color: Color.gray,
        fontSize: 12,
    },
    text2: {
        color: Color.theme,
        fontSize: 12,
        fontWeight: "600",
    },
});
