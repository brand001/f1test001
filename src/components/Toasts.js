import React from "react";
import { Dimensions, Text, View, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Toast as ToastAntd } from "@ant-design/react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SuccessIcon, FailIcon, WarningIcon } from "$Components/icons/index.js";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { ColumnCenterCenter, RowCenterCenter } from "$Components/CustomView";

const { width, height } = Dimensions.get("window");

// Toast 样式
const toastStyles = {
    baseContainer: {
        backgroundColor: Color.white,
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxWidth: width - 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    baseText: {
        textAlign: "left",
        color: Color.darkGray,
        paddingLeft: 6,
        fontSize: 14,
        fontWeight: "400",
    },
    successInfoContainer: {
        backgroundColor: Color.white,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 22,
        maxWidth: width - 100,
        alignSelf: "center",
        marginTop: -height / 3,
    },
    successInfoText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginTop: 12,
        textAlign: "center",
    },
    iconWrap: {
        justifyContent: "center",
        alignItems: "center",
    }
};

// 提供安全区偏移的容器
const WithSafeTop = ({ children }) => {
    const insets = useSafeAreaInsets();

    // 🧠 自动适配：刘海用 insets.top，其他最小为 10
    let topOffset = insets.top;

    if (Platform.OS === "android") {
        topOffset = Math.max(insets.top, 10); // 安卓有时为 0
    } else {
        topOffset = topOffset > 20 ? topOffset - 40 : 10; // iOS 刘海和非刘海适配
    }
    return <View style={{ marginTop: topOffset }}>{children}</View>;
};

// Toast 自定义类型
const toastConfig = {
    success: ({ text1 }) => (
        <WithSafeTop>
            <RowCenterCenter style={toastStyles.baseContainer}>
                <SuccessIcon width={18} height={18} fill="#00A826" type="ring" wrapStyle={toastStyles.iconWrap} />
                <Text style={toastStyles.baseText}>{text1}</Text>
            </RowCenterCenter>
        </WithSafeTop>
    ),
    fail: ({ text1 }) => (
        <WithSafeTop>
            <RowCenterCenter style={toastStyles.baseContainer}>
                <FailIcon width={18} height={18} fill="#DD4343" type="ring" wrapStyle={toastStyles.iconWrap} />
                <Text style={toastStyles.baseText}>{text1}</Text>
            </RowCenterCenter>
        </WithSafeTop>
    ),
    error: ({ text1 }) => (
        <WithSafeTop>
            <RowCenterCenter style={toastStyles.baseContainer}>
                <FailIcon width={18} height={18} fill="#DD4343" type="ring" wrapStyle={toastStyles.iconWrap} />
                <Text style={toastStyles.baseText}>{text1}</Text>
            </RowCenterCenter>
        </WithSafeTop>
    ),
    info: ({ text1 }) => (
        <WithSafeTop>
            <RowCenterCenter style={toastStyles.baseContainer}>
                <WarningIcon width={18} height={18} fill="#FFAC0A" type="ring" wrapStyle={toastStyles.iconWrap} />
                <Text style={toastStyles.baseText}>{text1}</Text>
            </RowCenterCenter>
        </WithSafeTop>
    ),
    successInfo: ({ text1 }) => (
        <ColumnCenterCenter style={{ width, height, backgroundColor: "rgba(0, 0, 0, 0)" }}>
            <View style={toastStyles.successInfoContainer}>
                <SuccessIcon width={45} height={45} wrapStyle={toastStyles.iconWrap} />
                <Text style={toastStyles.successInfoText}>{text1}</Text>
            </View>
        </ColumnCenterCenter>
    ),
};

// 通用显示方法
const showToast = (type, msg, time = 2000, callBack = () => { }, position = "top") => {
    time = Math.max(2000, Math.min(2000, time));
    Toast.show({
        type,
        text1: msg,
        position,
        visibilityTime: time,
        autoHide: true,
    });
    setTimeout(callBack, time);
};

// 对外暴露的方法
export const Toasts = {
    loading: (msg = translate("加载中,请稍候..."), time, callBack) => {
        ToastAntd.loading(msg, time, callBack);
    },
    removeAll: () => {
        ToastAntd.removeAll();
    },
    success: (msg, time = 1500, callBack = () => { }) => {
        showToast("success", msg, time, callBack);
    },
    fail: (msg, time = 1500, callBack = () => { }) => {
        showToast("fail", msg, time, callBack);
    },
    error: (msg, time = 1500, callBack = () => { }) => {
        showToast("error", msg, time, callBack);
    },
    info: (msg, time = 1500, callBack = () => { }) => {
        showToast("info", msg, time, callBack);
    },
    successInfo: (msg = translate("验证成功"), time = 1500, callBack = () => { }) => {
        showToast("successInfo", msg, time, callBack, "center");
    },
    hide: () => {
        Toast.hide();
    },
    hideAll: () => {
        Toast.hide();
        ToastAntd.removeAll();
    },
};

// 根组件挂载 Toast（必须放在 App 内）
export const ToastRoot = () => <Toast config={toastConfig} />;
