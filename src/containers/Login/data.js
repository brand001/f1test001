import React from "react";

import { Actions } from "react-native-router-flux";

import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe } from "$Utils";

export const suggestedEmailDomain = {
    get CN() {
        return ["qq.com", "163.com", "sina.com", "sohu.com", "126.com", "139.com", "wo.cn", "hotmail.com", "msn.com", "outlook.com"];
    },
    get TH() {
        return ["hotmail.com", "gmail.com", "icloud.com", "outlook.com", "hotmail.co.th", "outlook.co.th", "live.com", "yahoo.com", "msn.com", "windowslive.com"];

    },
    get VN() {
        return ["gmail.com", "icloud.com", "yahoo.com", "yahoo.com.vn", "hotmail.com", "outlook.com", "outlook.com.vn", "caothang.edu.vn", "live.com", "cdktcnqn.edu.vn"];
    }
};

export const HelpKnowledgeBaseIDObj = {
    CN: {
        STarticleNumber: "000006905",
        LIVEarticleNumber: "000006905",
        STcategoryUID: "",
        LIVEcategoryUID: "7"
    },
    TH: {
        STarticleNumber: "000006816",
        LIVEarticleNumber: "000006816",
        STcategoryUID: "",
        LIVEcategoryUID: "100"
    },
    VN: {
        STarticleNumber: "000009352",
        LIVEarticleNumber: "000009352",
        STcategoryUID: "",
        LIVEcategoryUID: "14"
    },
};

export const LoginErrorPop = {
    MEM00060: () => {
        //超过5次登陆失败不饿能登陆，跳到客服页面
        GetGlobalModal({
            title: translate("超过登录次数"),
            showCloseIcon: true,
            iconName: "warning",
            message: translate("您已登录失败 5 次，请联系客服获取帮助"),
            confirmText: translate("在线客服"),
            onConfirm: () => {
                window.FastLoginErr && Actions.pop();
                LiveChatOpenGlobe();
            },
        });
    },
    MEM00061: () => {
        // /您的帐号无法使用,请联系在线客服
        GetGlobalModal({
            title: translate("账户已被禁用"),
            showCloseIcon: true,
            iconName: "warning",
            message: translate("您的帐号无法使用,请联系在线客服!"),
            confirmText: translate("在线客服"),
            onConfirm: () => {
                LiveChatOpenGlobe();
            },
        });
    },
    MEM00141: () => {
        //Login with Confiscated account 账户锁定
        ApiPort.UserLogin == false;
        Toasts.fail(translate("您的帐户已禁用。 请联系客服"), 2);
    },
    MEM00004: ({ self }) => {
        self.setState({
            emptyLogMsg: translate("用户名称或密码错误！请重新输入！"),
        });
    },
    MEM00059: ({ self }) => {
        self.setState({
            emptyLogMsg: translate("用户名称或密码错误！请重新输入！"),
        });
    },
};
