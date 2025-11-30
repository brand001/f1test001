import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { GetSelfExclusionStatus, GetSelfExclusionPopup, GetAnnouncementPopup, LiveChatOpenGlobe, GetSeonFingerprint } from "$Utils";
import { setFEWalletParams } from "$CentralPayment/platform.pay.config";
import Deposit_VN from "$CentralPayment/Deposit/M3/APP/deposit";
import Deposit_TH from "$CentralPayment/Deposit/M2/APP/deposit";
import { Toasts } from "$Toasts";
const { width, height } = Dimensions.get("window");
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import actions from "$LIB/redux/actions/index";

class DepositCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relaodPage: Math.random(),
            isFillName: false,
        };

        let { bonusId = "", bonusProduct = "", bonusName = "", promoTitle = "" } = this.props?.StrApiDetail || {};

        let { bonusGroupId = "", groupID = "", bonusRuleGroupId = "", account = "", title = "", name = "" } = this.props?.BoffApiDetail?.bonusData || {};

        let { depositingWallet = "" } = this.props;

        const privateParams = {
            device: "APP",
            platformType: "F1",
            languageType: window.DefaultConfig.languageType,
            ApiDomain: window.common_url,
            successUrl: "f1p5native://",
            domainName: window.SBTDomain,
            siteId: window.siteId,
            bonusId: bonusId,
            bonusRuleGroupId: bonusGroupId || groupID || bonusRuleGroupId,
            bonusName: promoTitle || bonusName || title || name,
            depositingWallet: depositingWallet || account || (!bonusProduct?.includes("API") && bonusProduct) || "MAIN",
            e2Backbox: window.E2Backbox || "",
            ActiveMethods: this.props?.ActiveMethods || "", //指定存款,默认第一个
            firstName: "zzz",
            headerBannerHide: props.headerBannerHide,
            PiwikEventDataHandle: data => {
                PiwikEventDataHandle(data);
            },
            BackClick: () => {
                Actions.pop();
            },
            LivechatClick: (flag = false) => {
                LiveChatOpenGlobe(flag);
            },
            goAddBankInfo: (callBack = false) => {
                Actions.BankCard();
            },
            goRecord: (type = "deposit", methods) => {
                Actions.Recordes({
                    reportType: "deposit",
                    methods,
                });
            }, //type = deposit存款记录,withdrawals提款记录
            ApiGet: url => fetchRequest(url, "GET"),
            ApiPost: (url, postdata = "") => fetchRequest(url, "POST", postdata),
            goVerifyContact: () => {}, //OTP
            goFinishKYCInfo: () => {
                alert("KYC");
            }, //KYC
            goFinishMemberInfo: () => {}, //firstName
            modalTip: {
                info: data => {
                    // 1个
                    let flag = data.children && typeof data.children === "string";
                    GetGlobalModal({
                        title: data.title,
                        message: data.children,
                        cancelText: data?.noBtnTxt,
                        onCancel: () => {
                            let noFunction = data.noFunction;
                            if (noFunction && typeof noFunction === "function") {
                                noFunction();
                            }
                        },
                        confirmText: data.okBtnTxt,
                        onConfirm: () => {
                            let okFunction = data.okFunction;
                            if (okFunction && typeof okFunction === "function") {
                                okFunction();
                            }
                        },
                    });
                },
                confirm: data => {
                    // 2
                    GetGlobalModal({
                        title: data.title,
                        message: data.children,
                        confirmText: data.okBtnTxt,
                        onConfirm: () => {
                            let okFunction = data.okFunction;
                            if (okFunction && typeof okFunction === "function") {
                                okFunction();
                            }
                        },
                    });
                },
            },
            toastTip: {
                loading: msg => {
                    !GetSelfExclusionStatus() && Toasts.loading(msg, 50);
                },
                success: msg => Toasts.success(msg),
                error: msg => Toasts.error(msg),
                hide: () => {
                    Toasts.removeAll();
                },
            },
            webPiwikEvent: (category = "category", action = "action", name = "name", isSuccess, tempCustomProperties) => {
            },
            webPiwikUrl: (path = "path", title = "title") => {
            },
            appPiwikEvent: data => {
                PiwikEventDataHandle(data);
            },
            appPiwikUrl: () => {},
            isTriggeredByInsufficientFlow: this.props.isTriggeredByInsufficientFlow,
            returnToGame: this.props.returnToGame,
            getSeonSession: async () => {
                return await GetSeonFingerprint();
            }
        };
        setFEWalletParams(privateParams);
    }

    async componentDidMount() {
        let firstName = this.props?.userInfo?.memberInfo?.firstName;
        if (!firstName) {
            this.setState({
                isFillName: true,
            });
            PiwikEventDataHandle("AvailabilityProcess3");
            await GetGlobalModal({
                title: translate("请更新个人账户资料"),
                message: translate("首次提款用户需填写完毕个人银行账户等资料，方可进行提款申请"),
                cancelText: translate("稍后再说"),
                onCancel: () => {
                    Actions.pop();
                },
                confirmText: translate("前往更新资料"),
                onConfirm: () => {
                    if (window.LANGUAGE == "CN") {
                        Actions.pop();
                        Actions.UserInfor();
                    } else {
                        Actions.UserUpdateInfo({
                            updateType: "deposit",
                            callBack: (isSucessSubmit) => {
                                if (isSucessSubmit) {
                                    this.setState({
                                        relaodPage: Math.random(),
                                    }, () => {
                                        Toasts.successInfo(translate("验证成功"), 2000);
                                        PiwikEventDataHandle({
                                            eventTitle: "AvailabilityProcess1",
                                            isSuccess: 2,
                                        });
                                    });

                                } else {
                                    Actions.pop();
                                }
                            },
                        });
                    }
                },
            });
        } else {
            this.setState({
                isFillName: true
            });
        }



        let isSelfExclusionPopup = await GetSelfExclusionPopup();
        if (isSelfExclusionPopup) return;

        await GetAnnouncementPopup({ type: "deposit" });

        this.props.userInfo_getBalance(true);
    }

    componentWillUnmount() {
        this.props.userInfo_getBalance(true);
        this.props?.callBack?.();
    }

    // shouldComponentUpdate(prevProps) {
    //     if (prevProps?.piwikName == this?.props?.piwikName && this?.props?.piwikName && this.props.fromPage == "game") {
    //         return false;
    //     }
    // }

    render() {
        let { isFillName } = this.state;
        let Deposit = window.LANGUAGE == "VN" ? Deposit_VN : Deposit_TH;
        return (
            <>
                {
                    //isFillName &&
                    <Deposit
                        fromPage={this.props.fromPage}
                        key={this.state.relaodPage}
                        triggerFor={this.props.triggerFor || "deposit"}
                        vendor={this.props.vendor || {}}
                        toggleCentralPaymentHandler={this.props.toggleCentralPaymentHandler}
                        useCentralPayment={this.props.useCentralPayment}
                        accessNewPaymentPermission={this.props.accessNewPaymentPermission}
                    />
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    userSetting: state.userSetting,
    userInfo: state.userInfo,
    useCentralPayment: state.centralPayment.useCentralPayment,
});
const mapDispatchToProps = dispatch => ({
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DepositCenter);
const styles = StyleSheet.create({});
