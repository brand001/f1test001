import React, { useState, useEffect, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    Animated,
    View,
} from "react-native";
import Touch from "react-native-touch-once";

import Color from "$Components/Color";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";

const { width } = Dimensions.get("window");

const NavTab = props => {
    const {
        tabData = [],
        callBack = () => {},
        renderIcon = () => null,
        tabStyle = {},
        tabActiveStyle = {},
        wrapStyle = {},
        activeBackGroundColor = Color.white,

        activeKey = 0,
        textStyle = {},
        textActiveStyle = {},
        navWidth = width * 0.6,
        isAnimation = true, // ✅ 新增参数，默认关闭动画
        spacing = 2
    } = props;

    const [tabKey, setTabKey] = useState(activeKey);
    const tabWidth = (navWidth - spacing * 2) / tabData.length; // 4 padding 左右共 8
    const translateX = useRef(new Animated.Value(tabWidth * activeKey)).current;

    useEffect(() => {
        if (typeof activeKey === "number" && activeKey !== tabKey) {
            setTabKey(activeKey);
            moveSlider(activeKey);
        }
    }, [activeKey]);

    const moveSlider = (index) => {
        const toValue = index * tabWidth;

        if (isAnimation) {
            Animated.timing(translateX, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            translateX.setValue(toValue);
        }
    };

    const handlePress = (index) => {
        setTabKey(index);
        moveSlider(index);
        callBack({ key: index, value: tabData[index] });
    };

    return (
        <View style={[
            styles.wrap,
            {
                width: navWidth,
            },
            wrapStyle]}>
            {/* 背景滑动块 */}
            <Animated.View
                style={[
                    styles.animatedBg,
                    {
                        width: tabWidth,
                        transform: [{ translateX }],
                        top: spacing,
                        bottom: spacing,
                        left: spacing,
                        backgroundColor: activeBackGroundColor
                    },
                ]}
            />
            <RowCenterBetween style={{ flex: 1 }}>
                {
                    tabData.map((v, i) => {
                        const isActive = tabKey === i;
                        return (
                            <RowCenterCenter
                                key={i}
                                onPress={() => handlePress(i)}
                                style={[styles.btnList, isActive ? tabActiveStyle : tabStyle]}
                            >
                                <Text
                                    style={[
                                        styles.btnTxt,
                                        {
                                            color: isActive ? Color.theme : Color.pastelBlue,
                                            fontWeight: isActive ? "700" : "400",
                                        },
                                        isActive ? textActiveStyle : textStyle
                                    ]}
                                >
                                    {v}
                                </Text>
                                {renderIcon(i)}
                            </RowCenterCenter>
                        );
                    })
                }
            </RowCenterBetween>
        </View>
    );
};

export default NavTab;

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: Color.brightBlue,
        height: 34,
        borderRadius: 50,
        paddingHorizontal: 4,
        overflow: "hidden",
    },
    animatedBg: {
        position: "absolute",
        borderRadius: 50,
    },
    btnList: {
        flex: 1,
        height: 30,
        borderRadius: 50,
        width: "100%"
    },
    btnTxt: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "400"
    },
    line: {
        width: 1, // 细线宽度
        height: "60%",
        backgroundColor: Color.deepBlue,
        position: "absolute",
        left: "50%",
        transform: [{ translateX: -0.5 }], // 细线宽度的一半
    },
});