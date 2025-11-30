import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

import Color from "./Color";

const windowWidth = Dimensions.get("window").width;

const AnimatableView = Animatable.View;

export const SlideLong = {
    0: {
        opacity: 0,
        translateX: -(windowWidth - 30) / 2,
    },
    1: {
        opacity: 1,
        translateX: windowWidth - 30,
    },
};

const light = ["#e0e0e0", "#d0d0d0", "#e0e0e0"];
const dark = ["#50535a", "#656871", "#50535a"];

export default function LoadingBone(props) {
    const { length = 4, height = 160, width = windowWidth - 30, type = "light", wrapStyle = {} } = props;
    let arr = new Array(length).fill(1);
    return arr.map((item, index) => {
        return (
            <View key={index} style={[styles.LoadingBoneView, { height, width }, wrapStyle]}>
                <AnimatableView animation={SlideLong} easing="ease-out" iterationCount="infinite" duration={1200}>
                    <LinearGradient colors={type === "light" ? light : dark} start={{ y: 0, x: 0 }} end={{ y: 0, x: 1 }} style={[styles.boneView, { height }]}></LinearGradient>
                </AnimatableView>
            </View>
        );
    });
}

const styles = StyleSheet.create({
    LoadingBoneView: {
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: Color.softGray,
        marginBottom: 15,
    },
    boneView: {
        width: "100%",
    },
});
