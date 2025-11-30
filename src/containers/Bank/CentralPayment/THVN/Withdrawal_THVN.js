import React from "react";
import { Text, Platform } from "react-native";
import { Toasts } from "$Toasts";
import { connect } from "react-redux";
import { WithdrawalPage } from "central-payment-m23";
import { setConfig } from "central-payment-m23/config";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { LiveChatOpenGlobe, GetSeonFingerprint } from "$Utils";
import actions from "$LIB/redux/actions/index";

class Withdrawal extends React.Component {
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
            lang: window.LANGUAGE.toLocaleLowerCase(),
            authToken: ApiPort.Token,
            module: "Withdrawal",
            theme: "light",
            toastTip: {
                loading: (msg, sec = 2) => { Toasts.loading(msg, sec); },
                success: (msg, sec = 2) => Toasts.success(msg, sec),
                error: (msg, sec = 2) => Toasts.fail(msg, sec),
                hide: () => { Toasts.removeAll(); },
            },
            lightToast: {
                success: (msg, sec = 2) => Toasts.success(msg, sec),
                error: (msg, sec = 2) => Toasts.fail(msg, sec),
                fail: (msg, sec = 2) => { Toasts.fail(msg, sec); },
                warning: (msg, sec = 2) => Toasts.error(msg, sec),
            },
            goLiveChat: () => { LiveChatOpenGlobe(); },
            goHome: () => Actions.Home(),
            goPersonalInfo: () => Actions.UserInfor(),
            goRecord: ({ transactionId }) => {
                Actions.pop();
                Actions.Recordes({ reportType: "withdraw", transactionId });
            },
            goDeposit: () => Actions.DepositCenter(), // new deposit center
            goDepositOld: () => () => {
                this?.props?.toggleCentralPaymentHandler?.();
            }, // old deposit center
            goBack: () => Actions.pop(), // 離開 withdrawal center
            goCDU: () => {
                Actions.pop();
                Actions.UploadFile({
                    fromPage: "Withdrawal", // 立即验证
                });
            },
            triggerRAF: () => {
                //this.props.userInfo_updateMemberInfo()
            }, // Only for F1
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
            PiwikEvent: (data) => PiwikEventDataHandle(data),
            tutorialType: "withdrawal",
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

        // this.preCheck();
        // config 設定完才render central-payment-m1
        await setConfig(privateParams);
        this.setState({ configSet: true }); // 設置配置後更新狀態
    }


    render() {
        console.log("helloTheme ", this.props.theme);
        // 等待配置設置完成後再渲染
        if (!this.state.configSet) {
            return <Text>Loading...</Text>;
        }

        return (
            <>
                <WithdrawalPage />
            </>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Withdrawal);