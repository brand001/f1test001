import React, { useEffect, useRef } from "react";

import { Animated, StyleSheet, View } from "react-native";

import Color from "$Components/Color";

const Progress = props => {
    const { width = 0 } = props;
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: width,
            duration: 800, // 动画持续时间（毫秒）
            useNativeDriver: false, // 因为 width 不能使用 Native Driver
        }).start();
    }, [width]);

    const animatedStyle = {
        width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
        }),
    };

    return (
        <View style={styles.progress}>
            <Animated.View style={[styles.progressItem, animatedStyle]} />
        </View>
    );
};

export default Progress;

const styles = StyleSheet.create({
    progress: {
        backgroundColor: Color.mediumGray,
        height: 6,
        borderRadius: 999999,
        width: "100%",
        overflow: "hidden",
    },
    progressItem: {
        backgroundColor: Color.theme,
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
    },
});
