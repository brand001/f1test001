import React, { useState } from "react";

import moment from "moment";
import { StyleSheet, Text } from "react-native";
import { DatePicker } from "react-native-common-date-picker";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import DropDownSelect from "$Components/DropDownSelect";
import { ArrowIcon } from "$Components/icons/index.js";

import { RowCenterBetween } from "./CustomView";

export default function DateModal(props) {
    const {
        type = "DD-MM-YYYY",
        title = "",
        confirmText = "",
        minDate = new Date("1920-01-01"),
        maxDate = new Date(),
        RenderButton = () => {},
        callBack = () => {},
        onChange = () => {},
        buttonStyle = {},
        defaultDate = new Date(),
    } = props;

    const [visible, setVisible] = useState(false);
    const [date, setData] = useState(moment(new Date()));

    let value = moment(new Date(defaultDate)).format(type);
    return (
        <>
            <DropDownSelect
                animationType="slideDown"
                modalVisible={visible}
                confirmText={confirmText}
                title={title || translate("选择类别2")}
                closeModal={() => {
                    setVisible(false);
                }}
                confirm={() => {
                    onChange(date);
                    setVisible(false);
                }}
                initialPadding={0}>
                <DatePicker
                    type={type}
                    minDate={minDate}
                    maxDate={maxDate}
                    defaultDate={defaultDate}
                    toolBarCancelStyle={{ display: "none" }}
                    toolBarConfirmStyle={{ display: "none" }}
                    customToolBar={() => null}
                    toolBarStyle={{
                        borderBottomWidth: 0,
                    }}
                    selectedTextColor={Color.charcoal}
                    onValueChange={value => {
                        setData(value);
                    }}
                />
            </DropDownSelect>

            {Boolean(RenderButton({})) ? (
                <RenderButton
                    value={value}
                    onPress={() => {
                        setVisible(true);
                        callBack();
                    }}
                    flag={visible}></RenderButton>
            ) : (
                <RowCenterBetween
                    onPress={() => {
                        setVisible(true);
                        callBack();
                    }}
                    style={[styles.buttonStyle, buttonStyle]}>
                    <Text style={{ color: Color.darkGray }}>{value}</Text>

                    <ArrowIcon fill={Color.gray} width={12} height={12} direction={visible ? "top" : "bottom"} wrapStyle={{ marginLeft: 10 }} />
                </RowCenterBetween>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Color.white,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 6,
    },
    icon: {
        width: 25,
        height: 25,
        marginLeft: 4,
    },
});
