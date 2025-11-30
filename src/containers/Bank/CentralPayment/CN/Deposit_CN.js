import React from "react";
import { Text, Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { DepositPage } from "central-payment-m1";
import { setConfig } from "central-payment-m1/config";
import actions from "$LIB/redux/actions/index";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe, OpenVIPCS, GetSelfExclusionPopup, GetSeonFingerprint } from "$Utils";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class Deposit_CN extends React.Component {
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
            authToken: ApiPort.Token,
            module: "Deposit",
            theme: "light",
            toastTip: {
                loading: (msg, sec = 2) => Toasts.loading(msg, sec),
                success: (msg, sec = 2) => Toasts.success(msg, sec),
                error: (msg, sec = 2) => Toasts.error(msg, sec),
                hide: () => Toasts.hideAll(),
            },
            lightToast: {
                success: (msg, sec) => Toasts.success(msg, sec),
                error: (msg, sec) => Toasts.error(msg, sec),
                fail: (msg, sec) => Toasts.fail(msg, sec),
                warning: (msg, sec) => Toasts.fail(msg, sec),
            },
            localStorage,
            goLiveChat: this.openCS,
            goVIPLiveChat: OpenVIPCS, // Only for F1
            triggerRAF: () => {
                //this.props.userInfo_updateMemberInfo()
            }, // Only for F1
            fromPage: this.props.from === "GamePage" ? "game" : this.props.from,
            goHome: () => this.props.from ? Actions.pop() : Actions.Home(),
            goPersonalInfo: () => Actions.UserInfor(),
            goRecord: () => {
                Actions.pop();
                Actions.Recordes({ reportType: "deposit" });
            },
            goDeposit: () => Actions.DepositCenter(),
            goBack: () => Actions.pop(), // 離開 deposit center
            goBankCard: () => Actions.BankCard(),
            goSNCVerification: () => {
                Actions.pop();
                Actions.UploadFile();
            },
            goKYCVerification: () => {
                Actions.pop();
                Actions.UploadFile();
            },
            fraudSignature: await GetSeonFingerprint(),
            e2Backbox: E2Backbox || "",
            tutorialType: "deposit",
            PiwikEvent: (data) => PiwikEventDataHandle(data, true),
            environment: window.isStaging === "LIVE" ? "prod" : window.isStaging === "ST" ? "st" : "sl",
            hostDomain: window.SBTDomain,
            bffscDomain: window.bffsc_url,
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




        let isSelfExclusionPopup = await GetSelfExclusionPopup();
        if (isSelfExclusionPopup) return;
    }

    openCS = () => {
        LiveChatOpenGlobe();
    };

    render() {
        // 等待配置設置完成後再渲染
        if (!this.state.configSet) {
            return <Text>Loading...</Text>;
        }

        return <DepositPage />;
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit_CN);