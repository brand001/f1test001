import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Keyboard } from "react-native";
import DeviceInfo from "react-native-device-info";
import ViewShot from "react-native-view-shot";
import { useSelector } from "react-redux";

import FilledButton from "$Components/FilledButton";
import { translate } from "$locales/translate";
import { SaveImg, FormatDate } from "$Utils";
import { RowCenterBetween } from "$Components/CustomView";

const DeviceInformation = () => {
    const [userIp, setUserIp] = useState("");
    const viewShotRef = useRef(null);

    useEffect(() => {
        // 关闭键盘
        Keyboard.dismiss();

        DeviceInfo.getIpAddress().then(ip => {
            const ipAddress = ip || "1.1.1.1";
            setUserIp(ipAddress);
        });
    }, []);
    const userName = useSelector(state => state?.userInfo)?.userName;

    const Data = [
        {
            key: translate("用户名1"),
            value: userName,
        },
        {
            key: translate("手机型号"),
            value: DeviceInfo.getModel(),
        },
        {
            key: translate("平台1"),
            value: "FUN88 App",
        },
        {
            key: translate("登录IP"),
            value: userIp,
        },
        {
            key: translate("系统版本"),
            value: `V${DeviceInfo?.getSystemVersion()}`,
        },
        {
            key: translate("应用程序版本"),
            value: `V${Rb88Version}`,
        },
        {
            key: translate("当前时间"),
            value: FormatDate(new Date(), { timeLevel: "full" }),
        },
    ];

    return (
        <ViewShot
            style={[styles.viewContainer]}
            ref={viewShotRef}>
            <Text style={styles.pageTitle}>{translate("个人信息")}</Text>
            <View style={styles.inforContainer}>
                {Data.map((v, i) => {
                    return (
                        <RowCenterBetween style={styles.inforList} key={i}>
                            <Text style={styles.inforLeft}>{v.key}</Text>
                            <Text style={styles.inforight}>{v.value}</Text>
                        </RowCenterBetween>
                    );
                })}
            </View>
            <Text style={styles.pageTitle1}>{translate("点击“截图”保存图片文件并发送给客服")}</Text>

            <FilledButton
                text={translate("屏幕截图")}
                onPress={async () => {
                    await SaveImg(viewShotRef.current);
                }} />
        </ViewShot>
    );
};

export default DeviceInformation;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    pageTitle: {
        color: "#666",
        fontWeight: "400",
        marginBottom: 15,
    },
    inforContainer: {
        backgroundColor: "#fff",
        borderRadius: 6,
        paddingHorizontal: 15,
    },
    inforList: {
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
        paddingVertical: 14,
    },
    inforLeft: {
        color: "#222",
        fontWeight: "400",
    },
    inforight: {
        color: "#000",
        fontWeight: "400",
    },
    pageTitle1: {
        color: "#999",
        fontWeight: "400",
        marginVertical: 15,
    },
});
