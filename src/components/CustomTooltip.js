import React, { useEffect, useState } from "react";

import { Dimensions, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
const { width } = Dimensions.get("window");
import Tooltip from "react-native-walkthrough-tooltip";

import Color from "$Components/Color";
import { CloseIcon, WarningIcon } from "$Components/icons/index.js";

export default function CustomTooltip({
    text = "",
    renderContent = null,
    containerStyle = null,
    isShowCloseImg = false,
    textStyle = null,
    callBack = () => {},
    placement = "bottom",
    timeOut = 0,
    Icon = null,
    visible = false,
    maskColor = "transparent",
}) {
    const [tipVisible, setTipVisible] = useState(visible);
    const reduxState = useSelector(state => state);
    let routerName = reduxState.userSetting.routerName;

    useEffect(() => {
        setTipVisible(visible);
    }, [visible]);

    useEffect(() => {
        if (timeOut <= 0 || !tipVisible) return;

        const timer = setTimeout(() => {
            setTipVisible(false);
        }, timeOut);

        return () => {
            clearTimeout(timer);
            setTipVisible(false);
        };
    }, [tipVisible, timeOut, routerName]);

    return (
        <Tooltip
            backgroundColor={maskColor}
            contentStyle={[styles.tipContentStyle, { ...containerStyle }]}
            useReactNativeModal={timeOut == 0}
            displayInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
            placement={placement}
            isVisible={(text || typeof renderContent == 'function') ? tipVisible : false}
            content={
                <>
                    {
                        Boolean(text)
                            ?
                            <>
                                <Text style={[styles.tipText, { ...textStyle }]}>{text}</Text>
                                {isShowCloseImg && <CloseIcon fill={Color.white} onPress={() => setTipVisible(false)} wrapStyle={styles.closeIcon} width={18} height={18} />}
                            </>
                            :
                            typeof renderContent == 'function' && renderContent({
                                callBack: () => {
                                    setTipVisible(false)
                                }
                            })
                    }
                </>
            }
            onClose={() => {
                if (timeOut > 0) return;
                setTipVisible(false);
            }}>
            <TouchableOpacity
                hitSlop={{ left: 80, right: 80 }}
                activeOpacity={0}
                underlayColor="transparent"
                onPress={() => {
                    setTipVisible(!tipVisible);
                    callBack();
                }}>
                {
                    Boolean(Icon) && <View style={{ marginLeft: 5 }}>
                        {Icon}
                    </View>
                }
            </TouchableOpacity>
        </Tooltip>
    );
}

const styles = StyleSheet.create({
    tipContentStyle: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 8,
        left: 40,
    },
    tipText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "400",
    },
    closeIcon: {
        width: 44,
        position: "absolute",
        top: 10,
        right: -20,
    },
});
