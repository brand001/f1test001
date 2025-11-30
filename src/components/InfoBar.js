import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { ImagesUrl } from "@/images/index";
import Color from "$Components/Color";



const InfoBar = props => {
    const { type = "", wrapStyle = {}, text = "", textStyle = {}, children = null, size = "medium" } = props;

    const InfoBarType = {
        large: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 6,
        },
        medium: {
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderRadius: 4,
        },
    };

    const { paddingVertical, paddingHorizontal, borderRadius } = InfoBarType[size];

    const boxStyle = {
        paddingVertical,
        paddingHorizontal,
        borderRadius,
    };

    return (
        <View
            style={[
                styles.box,
                type == "warn" && styles.warnBox,
                type == "error" && styles.errorBox,
                type == "alert" && styles.alertBox,
                type == "success" && styles.successBox,
                type == "note" && styles.noteBox,
                type == "tip" && styles.tipBox,
                type == "fail" && styles.failBox,
                type == "errorBgTransparent" && styles.errorBgTransparentBox,
                boxStyle,
                wrapStyle,
            ]}>


            {
                Boolean(children) && <View style={{ marginRight: 6 }}>
                    {
                        children
                    }
                </View>
            }

            <Text
                style={[
                    styles.text,
                    type == "warn" && styles.warnText,
                    type == "error" && styles.errorText,
                    type == "alert" && styles.alertText,
                    type == "success" && styles.successText,
                    type == "note" && styles.noteText,
                    type == "tip" && styles.tipText,
                    type == "fail" && styles.failText,
                    type == "errorBgTransparent" && styles.errorBgTransparentText,
                    textStyle,
                ]}>
                {text}
            </Text>
        </View>
    );
};

export default InfoBar;

const styles = StyleSheet.create({
    box: {
        backgroundColor: Color.lightYellow,
        borderRadius: 8,
        padding: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        overflow: "hidden",
        alignItems: "flex-start",
        wordBreak: "break-word", // 允许单词在适当位置断行
        overflowWrap: "break-word", // 确保长单词能正确换行
    },
    warnBox: {
        backgroundColor: Color.lightYellow,
    },
    errorBox: {
        backgroundColor: Color.lightPink,
    },
    alertBox: {
        backgroundColor: Color.transparent,
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    successBox: {
        backgroundColor: Color.softMint,
    },
    errorBgTransparentBox: {
        backgroundColor: "transparent",
        paddingLeft: 0,
    },
    noteBox: {
        backgroundColor: Color.paleGray,
    },
    tipBox: {
        backgroundColor: Color.neutralGray,
    },
    failBox: {
        backgroundColor: "transparent"
    },
    text: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkAmber,
        flexWrap: "wrap",
        wordBreak: "break-word", // 允许单词在适当位置断行
        overflowWrap: "break-word", // 确保长单词能正确换行
    },
    warnText: {
        color: Color.darkAmber,
    },
    errorText: {
        color: Color.alertRed,
    },
    alertText: {
        color: Color.alertRed,
    },
    successText: {
        color: Color.brightGreen,
    },
    noteText: {
        color: Color.darkGray,
    },
    tipText: {
        color: Color.darkGray,
    },
    failText: {
        color: Color.alertRed,
    },
    errorBgTransparentText: {
        color: Color.alertRed,
    }
});
