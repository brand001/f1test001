import React, { forwardRef, useImperativeHandle, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import DropDownSelect from "$Components/DropDownSelect";
import { ArrowIcon, CheckedIcon } from "$Components/icons/index.js";

import { RowCenterBetween } from "./CustomView";

const DropDownSelectArray = forwardRef((props, ref) => {
    const {
        title = "",
        data = [],
        onChange = () => { },
        realKey = "walletProductGroupName",
        RenderButton = () => { },
        children = null,
        buttonStyle = {},
        buttonTextStyle = {},
        callBack = () => { },
        defaultValue = "",
    } = props;

    const [index, setIndex] = useState(Boolean(defaultValue) ? -999 : 0);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleVisible: val => setVisible(val),
    }));

    const toggleVisible = (val = false) => {
        setVisible(val);
    };

    const toggleListHandler = () => {
        toggleVisible(true);
    };

    let value = Boolean(defaultValue) && index == -999 ? defaultValue : Array.isArray(data) && data.length > 0 && data[index][`${realKey}`];

    return (
        <>
            <DropDownSelect animationType="slideDown" modalVisible={visible} title={title || translate("选择类别2")} closeModal={toggleVisible} initialPadding={0}>
                <>
                    {Array.isArray(data) && data.length > 0 && (
                        <View style={styles.box}>
                            {data.map((item, i) => {
                                return (
                                    <RowCenterBetween
                                        key={i}
                                        onPress={() => {
                                            setIndex(i);

                                            toggleVisible();
                                            onChange({ key: i });
                                        }}
                                        style={[
                                            styles.list,
                                            {
                                                borderBottomWidth: i == data.length - 1 ? 0 : 1,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.listText,
                                                {
                                                    color: index == i ? Color.theme : Color.darkGray,
                                                },
                                            ]}>
                                            {item[`${realKey}`]}
                                        </Text>
                                        {index == i && <CheckedIcon fill={Color.theme} width={30} height={30} />}
                                    </RowCenterBetween>
                                );
                            })}
                        </View>
                    )}
                    {children}
                </>
            </DropDownSelect>

            {Boolean(RenderButton({})) ? (
                <RenderButton
                    value={value}
                    onPress={() => {
                        toggleListHandler();
                        callBack();
                    }}
                    flag={visible}></RenderButton>
            ) : (
                <RowCenterBetween
                    style={[styles.buttonStyle, buttonStyle]}
                    onPress={() => {
                        toggleListHandler();
                        callBack();
                    }}>
                    <Text style={{ color: Color.darkGray, fontSize: 14, fontWeight: "400", ...buttonTextStyle }}>{value}</Text>
                    <ArrowIcon fill={Color.gray} width={12} height={12} direction={visible ? "top" : "bottom"} wrapStyle={{
                        marginLeft: 10,
                        justifyContent: "center",
                        alignItems: "center"
                    }} />
                </RowCenterBetween>
            )}
        </>
    );
});

export default DropDownSelectArray;

const styles = StyleSheet.create({
    box: {
        backgroundColor: Color.white,
        paddingHorizontal: 15,
    },

    list: {
        height: 50,
        borderBottomColor: Color.mediumGray,
    },
    listText: {
        fontSize: 14,
        fontWeight: "400",
    },

    buttonStyle: {
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: Color.mediumGray,
        borderRadius: 6,
    },
});
