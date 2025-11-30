import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { SuccessIcon } from "$Components/icons/index";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";

export default function VipCsCallModal(props) {
    let { onCancel = () => {} } = props;
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const submit = () => {
        const data = {
            currency: window.DefaultConfig?.currency,
            description: value,
            memberCode: window.memberCode,
        };

        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(ApiPort.CallBack, "POST", data)
            .then(res => {
                Toasts.removeAll();
                if (res.isSuccess) {
                    setSuccess(true);
                } else {
                    Toasts.fail(res.message);
                }
            })
            .catch(() => {
                Toasts.removeAll();
            });
    };

    return (
        <View style={styles.body}>
            {success ? (
                <>
                    <View style={{ alignItems: "center" }}>
                        <SuccessIcon
                            width={55}
                            height={55}
                            wrapStyle={{
                                marginBottom: 20,
                            }}
                        />
                    </View>

                    <Text style={styles.infor}>{translate("乐天使已收到您的留言，VIP专属客服将会使用国家代码电话为 +852 的手机于 5 分钟内与您联系，记得留意您的手机哟。 谢谢")}</Text>

                    <FilledButton
                        text={translate("知道了")}
                        onPress={() => {
                            onCancel();
                        }}
                        type={"medium"}
                        wrapStyle={{
                            marginTop: 20,
                        }} />
                </>
            ) : (
                <>
                    <Text style={styles.title}>{translate("亲爱的VIP会员，请描述并提交所遇到的问题，VIP客服将在 5 分钟内回拨至您绑定的手机号码")}</Text>
                    <CustomTextInput
                        maxLength={50}
                        onChangeText={value => {
                            value = value.replace(/^\s+/g, "");
                            if (value.length <= 0) {
                                setError(translate("问题反馈内容不得为空"));
                            } else {
                                setError(""); // 清除錯誤
                            }
                            setValue(value);
                        }}
                        errorMessage={error}
                        value={value}
                        wrapStyle={{ height: 88 }}
                        placeholder={translate("最多50个字")}
                        underlineColorAndroid="transparent"
                        multiline={true} // 启用多行输入
                        numberOfLines={5} // 指定文本框的行数（仅影响高度）
                        textAlignVertical="top" // 让文字从顶部开始对齐
                        autoFocus={true} // 自动聚焦，确保键盘显示
                        keyboardType="default" // 明确指定键盘类型
                    ></CustomTextInput>

                    <FilledButton
                        text={translate("提交")}
                        enable={value?.length && error == ""}
                        onPress={() => {
                            submit();
                        }}
                        type={"medium"}
                        wrapStyle={{
                            marginTop: 10,
                        }} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        width: "100%",
        paddingTop: 15,
    },
    title: {
        fontSize: 14,
        lineHeight: 20,
        color: Color.darkGray,
        marginBottom: 15,
    },
    infor: {
        fontSize: 14,
        textAlign: "center",
        color: Color.black,
    },
});
