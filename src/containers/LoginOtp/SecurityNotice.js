import React, { useEffect } from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
const { width } = Dimensions.get("window");

import FilledButton from "$Components/FilledButton";
import { translate } from "$locales/translate";
import { ImagesUrl } from "@/images/index";

export default function SecurityNotice(props) {
    useEffect(() => {
        props.navigation.setParams({
            title: props.formPage === "loginOTP" ? translate("安全公告") : translate("安全系统升级公告"),
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image resizeMode="stretch" source={ImagesUrl.loginOtpPassword} style={styles.image} />
            <View style={styles.contentContainer}>
                <Text style={styles.text}>{translate("亲爱的玩家，")}</Text>
                <Text style={styles.text}>
                    {props?.formPage === "loginOTP"
                        ? translate(
                            "为了维持最高的服务标准，我们正在不断升级我们的系统。目前，我们需要进行进一步升级数据安全系统，需要您帮助来验证您的电话号码或电子邮件，以确保是您本人登录。\n\n为了进一步保护您的信息，我们将需要您通过短信或电子邮件身份验证您的登录信息。您登录后，我们会将6位数的验证码发送到账户绑定的电话或电子邮件，您可以通过在网页或客户端上输入6位数验证码来验证您的帐户。如果您无法确认电话号码或电子邮件地址，请联系我们在线客户服务，随时为您提供协助。\n\n我们全体员工将竭尽全力保护您的个人信息，我们希望得到您的理解与支持。",
                        )
                        : translate(
                            "感谢您一直以来的支持与信任，乐天堂一直秉持着为客户提供业界最好的服务。为了更好的保护您的账户安全，目前我们正在升级安全系统，需要您协助更新您的密码。\n\n为了更进一步保护您的个人信息，我们将在您登录账户时进行短信或电子邮件验证，在您登录的那一刻，系统将会发送6位数的验证码至您注册的手机号码或电子邮件地址中，您可以在网页或APP客户端上输入验证码进行验证登录。如果您无法确认您的注册电话号码或电子邮件地址，您可以随时联系乐天使在线客服或发送邮件到cs@fun88.com，她们将全力协助您。\n\n再次感谢您的支持与理解，保障客户账户安全是乐天堂所有员工的使命！",
                        )}
                </Text>
                <Text style={styles.text}>{translate("谢谢\n乐天堂 FUN88")}</Text>

                <FilledButton
                    onPress={() => {
                        Actions.pop();
                    }}
                    text={translate("进行验证")}
                    wrapStyle={{ marginTop: 40 }}
                    textStyle={{}}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    image: {
        width: width,
        height: width * 0.248,
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    text: {
        color: "#666666",
        paddingBottom: 12,
        lineHeight: 20,
    },
});