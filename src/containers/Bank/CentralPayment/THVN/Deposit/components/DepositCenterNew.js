import React from "react";
import { Text, Platform } from "react-native";
import { Toasts } from "$Toasts";
import { connect } from "react-redux";

import { DepositPage } from "central-payment-m23";
import { setConfig } from "central-payment-m23/config";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { LiveChatOpenGlobe, GetSeonFingerprint } from "$Utils";
import actions from "$LIB/redux/actions/index";
import { actions_fetchDepositStepTwoInProgressDetails, } from "$LIB/redux/actions/CentralPaymentAction";

class DepositCenterNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configSet: false,
        };
    }

    async componentDidMount() {
        console.log("componentDidMount", this.props);
        const privateParams = {
            platform: "app",
            platformOS: Platform.OS,
            brand: "F1",
            languageType: window.DefaultConfig.languageType,
            lang: window.LANGUAGE.toLocaleLowerCase(),
            authToken: ApiPort.Token,
            module: "Deposit",
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
            goLiveChat: () => LiveChatOpenGlobe(),
            fromPage: this.props.from === "GamePage" ? "game" : this.props.from,
            goHome: () => this.props.from === "GamePage" ? Actions?.returnToGame && Actions.returnToGame() : Actions.Home(),
            goPersonalInfo: () => Actions.UserInfor(),
            goRecord: ({ transactionId }) => {
                Actions.pop();
                Actions.Recordes({ reportType: "deposit", transactionId });
            },
            triggerRAF: () => {
                //this.props.userInfo_updateMemberInfo()
            }, // Only for F1
            goDeposit: () => Actions.DepositCenter(), // new deposit center
            goDepositOld: () => {
                this?.props?.toggleCentralPaymentHandler && this?.props?.toggleCentralPaymentHandler?.();
                Actions.pop();
            }, // old deposit center
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
            PiwikEvent: (data) => PiwikEventDataHandle(data),
            tutorialType: "deposit",
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
            depositMethod: this.props?.toggleCentralPayment,
        };

        // this.preCheck();
        // config 設定完才render central-payment-m1
        await setConfig(privateParams);
        this.setState({ configSet: true }); // 設置配置後更新狀態
    }

    async componentWillUnmount() {
        this.props.fetchDepositStepTwoInProgressDetails();
    }

    preCheck = async () => {
        const { dispatch, getState } = this.props;
        // Toasts.loading('加载中', 200);
        // const checkPassed = await depositPreCheck(
        //   dispatch,
        //   getState,
        //   url => fetchRequest(url, 'GET'),
        //   false,
        // );
        // Toasts.hide();
    };

    render() {
        console.log("helloTheme ", this.props.theme);
        // 等待配置設置完成後再渲染
        if (!this.state.configSet) {
            return <Text>Loading...</Text>;
        }

        return (
            <>
                <DepositPage />
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
    fetchDepositStepTwoInProgressDetails: () => dispatch(actions_fetchDepositStepTwoInProgressDetails()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositCenterNew);