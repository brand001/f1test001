import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { ImagesUrl } from "@/images/index";
import Color from "$Components/Color";
import { CheckedIcon } from "$Components/icons";
import { ColumnCenterCenter, RowCenterCenter } from "./CustomView";

const StepProgressBar = props => {
    let { step = 1 } = props;
    let flag = step == 1;

    return (
        <RowCenterCenter style={styles.wrap}>
            <ColumnCenterCenter style={styles.circle}>{flag ? <Text style={styles.text}>1</Text> : <CheckedIcon width={26} height={28} fill={"#fff"}></CheckedIcon>}</ColumnCenterCenter>
            <View style={[styles.line, { backgroundColor: flag ? "#C4C4C4" : Color.theme }]} />
            <ColumnCenterCenter
                style={[
                    styles.circle,
                    {
                        backgroundColor: flag ? Color.white : Color.theme,
                        borderColor: "#C4C4C4",
                    },
                ]}>
                <Text style={[styles.text, { color: flag ? "#C4C4C4" : Color.white }]}>2</Text>
            </ColumnCenterCenter>
        </RowCenterCenter>
    );
};

export default StepProgressBar;

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 30,
    },
    circle: {
        height: 35,
        width: 35,
        borderRadius: 9999,
        backgroundColor: Color.theme,
        borderWidth: 1,
        borderColor: "transparent",
    },
    line: {
        height: 1,
        width: 200,
        backgroundColor: "#C4C4C4",
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
});
