import React from "react";

import { StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";

import { RowCenterCenter } from "$Components/CustomView";
import { ArrowIcon, CloseIcon } from "$Components/icons/index.js";
import NavTitle from "$Components/Nav/NavTitle";

import Color from "../Color";

const TypeStyle = {
    gameNav: {
        textStyle: {
            color: "#222222",
            fontSize: 16,
            fontWeight: "600",
            marginLeft: -2
        },
        wrapStyle: {
            //marginBottom: 15,
            alignSelf: "flex-start"
        }
    }
};

const NavBack = ({
    action = "back",
    title = "",
    arrowIconFill = Color.white,
    wrapStyle = {},
    children = null,
    onPress = () => {
        Actions.pop();
    },
    textStyle = {},
    type = "",
}) => {
    if (type) {
        textStyle = TypeStyle[type]?.textStyle;
        wrapStyle = { ...TypeStyle[type]?.wrapStyle, ...wrapStyle };
    } else {
        wrapStyle = { ...wrapStyle, height: 40 };
    }

    return (
        <RowCenterCenter style={[{}, wrapStyle]}>
            <RowCenterCenter onPress={onPress} style={[styles.wrap]}>
                {
                    action === "back" &&
                    <ArrowIcon
                        fill={arrowIconFill}
                        width={15}
                        height={15}
                        wrapStyle={{
                            width: 26,
                            height: 18,
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }} />
                }

                {
                    action === "close" &&
                    <CloseIcon
                        fill={Color.white}
                        width={24}
                        height={24} />
                }


                {
                    !!title &&
                    <NavTitle
                        text={title}
                        textStyle={{
                            fontSize: (window.LANGUAGE == "VN" && !ApiPort.UserLogin) ? 12 : 14,
                            marginLeft: -8,
                            ...textStyle
                        }} />
                }
            </RowCenterCenter>

            {children}
        </RowCenterCenter>
    );
};

const styles = StyleSheet.create({
    wrap: {
        paddingLeft: 10,
        paddingRight: 8,
        height: "100%"
    },
});

export default NavBack;
