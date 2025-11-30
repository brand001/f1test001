import React from "react";

import { StyleSheet, Text } from "react-native";

import Color from "$Components/Color";

const NavTitle = props => {
    const { text = "", textStyle = {} } = props;

    return <Text style={[styles.title, textStyle]}>{text}</Text>;
};

export default NavTitle;

const styles = StyleSheet.create({
    title: {
        color: Color.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
