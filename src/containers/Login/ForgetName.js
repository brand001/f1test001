import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import InfoBar from "$Components/InfoBar";
import NavTab from "$Components/Nav/NavTab";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { RowCenterBetween } from "$Components/CustomView";
import LiveChat from "$Components/LiveChat";
import NavBack from "$Components/Nav/NavBack.js";
import { useForgetNameForm } from "$Hooks";

const { width } = Dimensions.get("window");

const ForgetName = ({ navigation }) => {
    const {
        forgetType,
        email,
        emailError,
        userName,
        userNameError,
        infoBarConfig,
        onUserNameChange,
        onEmailChange,
        onForgetTypeChange,
        onSubmit,
        onLiveChatClick,
        isFormValid,
    } = useForgetNameForm({ toasts: Toasts });

    useEffect(() => {
        navigation.setParams({
            leftButton: () => {
                return (
                    <RowCenterBetween style={{ width, paddingRight: 10 }}>
                        <NavBack />
                        <NavTab
                            {...(window.LANGUAGE == "VN" && {
                                navWidth: width * 0.76
                            })}
                            tabData={[translate("忘记密码"), translate("忘记用户名")]}
                            callBack={({ key }) => {
                                onForgetTypeChange(key === 0 ? "password" : "userName");
                            }}
                        />
                        <LiveChat callBack={onLiveChatClick} />
                    </RowCenterBetween>
                );
            },
        });
    }, []);

    const RenderEmailInput = () => {
        return (
            <CustomTextInput
                errorMessage={emailError}
                type={"error"}
                underlineColorAndroid="transparent"
                value={email}
                placeholder={translate("电子邮箱")}
                placeholderTextColor="#BCBEC3"
                maxLength={50}
                textContentType="emailAddress"
                onChangeText={onEmailChange}
            />
        );
    };

    return (
        <View style={styles.viewContainer}>
            <KeyboardAwareScrollView style={{ paddingTop: 15 }}>
                {/* 统一的 InfoBar */}
                {infoBarConfig && (
                    <InfoBar
                        type={infoBarConfig.type}
                        text={infoBarConfig.text}
                        wrapStyle={{ marginBottom: 10 }}
                    />
                )}

                {forgetType === "password" && (
                    <>
                        {RenderEmailInput()}

                        <CustomTextInput
                            errorMessage={userNameError}
                            type={"error"}
                            underlineColorAndroid="transparent"
                            value={userName}
                            placeholder={translate("用户名")}
                            placeholderTextColor="#BCBEC3"
                            maxLength={20}
                            textContentType="username"
                            onChangeText={onUserNameChange}
                        />
                    </>
                )}

                {forgetType === "userName" && (
                    RenderEmailInput()
                )}

                <FilledButton
                    text={translate("提交")}
                    enable={isFormValid}
                    onPress={onSubmit}
                    wrapStyle={{ marginTop: 20 }}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ForgetName;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
});