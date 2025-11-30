import React from "react";

import { StyleSheet, View } from "react-native";

import { CheckLogin } from "$Utils";
import Color from "$Components/Color";
import { translate } from "$locales/translate";
import FilledButton from "./FilledButton";
import { RowCenterStart } from "./CustomView";

const LoginRegist = props => {
    const { wrapStyle = {}, loginButtonStyle = {}, registerButtonStyle = {}, loginCallBack = () => {}, registCallBack = () => {}, loginTextStyle = {}, registerTextStyle = {}, blockWidth = 12 } = props;
    const buttonStyle = {
        height: 26,
        borderRadius: 8,
        width: window.LANGUAGE == "VN" ? 74 : 64
    };
    return (
        <RowCenterStart style={[styles.viewWrap, wrapStyle]}>
            <FilledButton
                onPress={() => {
                    CheckLogin({
                        showInfor: false,
                    });

                    loginCallBack();
                }}
                text={translate("登录")}
                wrapStyle={[styles.loginButton, buttonStyle, loginButtonStyle]}
                textStyle={[{ color: Color.theme, fontWeight: "500" }, styles.btnText, loginTextStyle]}
            />

            {!!blockWidth && <View style={{ width: blockWidth }}></View>}

            <FilledButton
                onPress={() => {
                    CheckLogin({
                        showInfor: false,
                        tabType: "register",
                    });

                    registCallBack();
                }}
                text={translate("注册")}
                wrapStyle={[styles.registerButton, buttonStyle, registerButtonStyle]}
                textStyle={[{ color: Color.vibrantGreen, fontWeight: "500" }, styles.btnText, registerTextStyle]}
            />
        </RowCenterStart>
    );
};

export default LoginRegist;

const styles = StyleSheet.create({
    viewWrap: {
        marginRight: 12
    },
    loginButton: {
        backgroundColor: Color.lightBlue,
    },
    registerButton: {
        backgroundColor: Color.lightGreen,
    },
    btnText: {
        fontSize: 12,
        fontWeight: "600"
    }
});
