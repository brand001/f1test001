import React from "react";

import { StyleSheet, View } from "react-native";

import Color from "$Components/Color";
import { ArrowIcon } from "./icons/index";
import { RowCenterCenter } from "./CustomView";


const ExpandArrow = props => {
    const { onPress = () => {}, buttonStyle = {} } = props;

    return (
        <RowCenterCenter style={styles.box} onPress={onPress}>
            <ArrowIcon direction='top' width={18} height={18} fill={Color.theme}></ArrowIcon>
        </RowCenterCenter>
    );
};

export default ExpandArrow;

const styles = StyleSheet.create({
    box: {
        borderRadius: 99999,
        width: 36,
        height: 36,
        backgroundColor: Color.white,
        marginVertical: 20
    },
});
