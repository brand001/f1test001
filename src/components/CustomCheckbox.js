import React from "react";

import { StyleSheet, Text } from "react-native";

import { CheckedIcon } from "$Components/icons/index";
import Color from "$Components/Color";
import { ColumnCenterCenter, RowCenterStart } from "./CustomView";

const CustomCheckbox = props => {
    const { isFull = false, type = "small", isCheck = false, text = undefined, textStyle = {}, onPress = () => { }, wrapStyle = {} } = props;
    let borderWidth = type === "small" ? 1 : type === "medium" ? 2 : 3;

    return (
        <RowCenterStart
            style={[styles.box, wrapStyle]}
            onPress={() => {
                onPress(!isCheck);
            }}>
            <ColumnCenterCenter
                style={[
                    styles.imgBox,
                    {
                        borderColor: isCheck ? Color.theme : Color.gray,
                        backgroundColor: isFull && isCheck ? Color.theme : Color.transparent,
                        borderWidth,
                    },
                ]}>
                {
                    isCheck && <CheckedIcon width={28} height={28} fill={isFull ? Color.white : Color.theme} />
                }
            </ColumnCenterCenter>
            {
                typeof text === "string" ?
                    <Text style={[styles.text, textStyle]}>{text}</Text>
                    :
                    (
                        typeof text === "function" ?
                            <text />
                            :
                            text?.$$typeof === Symbol.for("react.element") && text
                    )
            }

        </RowCenterStart>
    );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
    box: {
        marginVertical: 15,
    },
    img: {
        width: 18,
        height: 18,
    },
    text: {
        color: Color.darkGray,
        textAlign: "center",
        fontSize: 13,
        fontWeight: "400",
        flexWrap: "wrap",
    },
    imgBox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Color.grayGreen,
        marginRight: 6,
    },
});
