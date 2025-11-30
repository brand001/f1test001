import React from "react";
import { Text, Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { BankCardPage } from "central-payment-m1";
import { setConfig } from "central-payment-m1/config";
import actions from "$LIB/redux/actions/index";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe, OpenVIPCS, GetSeonFingerprint } from "$Utils";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class BankCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configSet: false,
        };
    }

    async componentDidMount() {
        const privateParams = {
            platform: "app",
            platformOS: Platform.OS,
            brand: "F1",
            languageType: window.DefaultConfig.languageType,
            authToken: ApiPort.Token,
            module: "BankCard",
            theme: "light",
            toastTip: {
                loading: (msg, sec = 2) => Toasts.loading(msg, sec),
                success: (msg, sec = 2) => Toasts.success(msg, sec),
                error: (msg, sec = 2) => Toasts.fail(msg, sec),
                hide: () => Toasts.hideAll(),
            },
            lightToast: {
                success: (msg, sec) => Toasts.success(msg, sec),
                error: (msg, sec) => Toasts.fail(msg, sec),
                fail: (msg, sec) => Toasts.fail(msg, sec),
                warning: (msg, sec) => Toasts.fail(msg, sec),
            },
            localStorage,
            goLiveChat: this.openCS,
            goVIPLiveChat: OpenVIPCS, // Only for F1
            triggerRAF: () => {
                //this.props.userInfo_updateMemberInfo()
            }, // Only for F1
            goHome: () => {
                Actions.pop();
            },
            goPersonalInfo: () => Actions.UserInfor(),
            goRecord: () => Actions.Recordes(),
            goDeposit: () => Actions.DepositCenter(),
            goBack: () => Actions.pop(),
            goBankCard: () => Actions.BankCard(),
            fraudSignature: await GetSeonFingerprint(),
            e2Backbox: E2Backbox || "",
            PiwikEvent: (data) => PiwikEventDataHandle(data, true),
            environment: window.isStaging === "LIVE" ? "prod" : window.isStaging === "ST" ? "st" : "sl",
            hostDomain: window.SBTDomain,
            appInfo: {
                version: Rb88Version,
                device: {
                    brand: window.deviceBrand,
                    model: window.deviceModel,
                    osVersion: window.osVersion
                },
            },
        };

        // config 設定完才render central-payment-m1
        await setConfig(privateParams);
        this.setState({ configSet: true }); // 設置配置後更新狀態
    }

    openCS = () => {
        LiveChatOpenGlobe();
    };

    render() {
        // 等待配置設置完成後再渲染
        if (!this.state.configSet) {
            return <Text>Loading...</Text>;
        }

        return <BankCardPage />;
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
    };
};

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankCard);
