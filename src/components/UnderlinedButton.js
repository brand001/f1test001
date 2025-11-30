import React from "react";

import { StyleSheet, Text } from "react-native";
import Touch from "react-native-touch-once";

import Color from "$Components/Color";
import { ColumnCenterCenter } from "./CustomView";

export default function UnderlinedButton(props) {
    const { text = "", onPress = () => {}, wrapStyle = {}, textStyle = {}, textDecorationLine = "underline" } = props;

    return (
        <ColumnCenterCenter style={[styles.button, wrapStyle]} onPress={onPress}>
            <Text style={[styles.text, { textDecorationLine: textDecorationLine }, textStyle]}>{text}</Text>
        </ColumnCenterCenter>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Color.theme,
        fontWeight: "600",
        fontSize: 14,
    },
});
