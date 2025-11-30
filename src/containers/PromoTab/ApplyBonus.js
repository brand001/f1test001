import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { getMoneyFormat } from "$Utils";
import { PostBonusCalculate } from "$Utils/PostBonusCalculateUtil.js";
import { ErrorCodeHandler } from "./PromotionStatus.js";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import actions from "$LIB/redux/actions/index";
import { Toasts } from "$Toasts";
import FilledButton from "$Components/FilledButton.js";
import { InforIcon } from "$Components/icons/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class ApplyBonus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: "",
            bonus: "0",
            turnover: "0",
            amountErr: "",
            ableSubmit: false,
        };
    }

    componentWillUnmount() {
        this.props.userInfo_getBalance();
    }

    debounce(func, delay) {
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(func, delay);
    }

    _onChangeAmount = val => {
        const { bonus, turnover } = this.state;
        const { balanceTotal = 0 } = this.props?.userInfo || {};
        const money = Number(val);
        const { minAccept = 0 } = this.props?.BoffApiDetail?.bonusData || {
            minAccept: 0,
        };
        const deficiency = money > minAccept && money > balanceTotal;
        const requiredMinAccept = money < minAccept;

        if (deficiency || requiredMinAccept) {
            this.setState({
                amount: val,
                amountErr: deficiency ? translate("余额不足，请先存款再申请") : `${translate("最低申请金额：")}${getMoneyFormat(minAccept, "")} ${translate("元")}`,
                bonus: requiredMinAccept ? "0" : bonus,
                turnover: requiredMinAccept ? "0" : turnover,
                ableSubmit: false,
            });
            return;
        } else {
            this.setState(
                {
                    amount: val,
                    amountErr: "",
                },
                () => {
                    this.debounce(() => this.getCalculate(), 300);
                },
            );
        }
    };

    getCalculate = async () => {
        let { amount = 0, amountErr } = this.state;
        let { bonusId = "", bonusProduct = "" } = this.props?.StrApiDetail || {};
        let { bonusGroupId = "", groupID = "", bonusRuleGroupId = "", account = "" } = this.props?.BoffApiDetail?.bonusData || {};
        if (amount <= 0 || amount == "") return;

        let res = {
            bonusGiven: 0,
            turnoverRequire: 0,
            inPlan: true,
        };
        try {
            res = await PostBonusCalculate({
                amount: amount,
                wallet: account || bonusProduct || "MAIN",
                bonusRuleGroupId: bonusGroupId || groupID || bonusRuleGroupId,
                bonusId: bonusId,
            });
        } catch (err) {
            res = {
                bonusGiven: 0,
                turnoverRequire: 0,
            };
        }

        let { bonusGiven = 0, turnoverRequire = 0, inPlan = true } = res;

        this.setState({
            bonus: bonusGiven,
            turnover: turnoverRequire,
            ableSubmit: !amountErr && !inPlan,
        });
    };

    submitApplication = () => {
        const { amount } = this.state;

        let { bonusId = "", bonusProduct = "" } = this.props?.StrApiDetail || {};
        let { bonusGroupId111 = "", groupID = "", bonusRuleGroupId = "", account = "" } = this.props?.BoffApiDetail?.bonusData || {};

        let { EligibleApiDetail = {} } = this.props;
        let { bonusGroupId = "", bonusRuleId = "" } = EligibleApiDetail;

        const data = {
            // BonusId: bonusRuleId,
            // amount: amount,
            // bonusMode: 'Deposit',
            // targetWallet: (account || bonusProduct || 'MAIN'),
            // isMax: false,

            // couponCode: '',
            // successBonusId: '',
            // transferBonus: {
            //     fromWallet: '',
            //     transactionId: 1412356856,
            //     isFreeBet: false
            // },
            // depositBonus: {
            //     depositCharges: 2.0,
            //     depositId: 1412356856
            // },
            // blackBox: E2Backbox

            blackBox: E2Backbox,
            bonusId: bonusRuleId || bonusRuleGroupId,
            amount: amount,
            targetWallet: account || bonusProduct || "MAIN",
            e2BlackBoxValue: E2Backbox,
        };

        Toasts.loading(translate("加载中,请稍候..."));
        fetchRequest(ApiPort.BonusApplicationsV2 + "&", "POST", data)
            .then(res => {
                Toasts.removeAll();
                let { isSuccess = false, result = {} } = res;
                if (isSuccess && result?.bonusResult?.message?.toLocaleUpperCase() == "SUCCESS") {
                    Toasts.success(translate("优惠申请成功"), 2000, () => {
                        this?.props?.callBack?.();
                    });
                } else {
                    ErrorCodeHandler({
                        result,
                        okFuntion: () => {
                            Actions.pop();
                        },
                    });
                }
            })
            .catch(err => console.log("getCalculate", err));


        const { StrApiDetail, BoffApiDetail } = this.props;
        PiwikEventDataHandle({
            eventTitle: "PromoMainPage9",
            customProperties: {
                "Promotion_S_Application_PromoName_PrmoID": StrApiDetail?.promoTitle + "_" + BoffApiDetail?.promoId, // 修正 key 格式
            },
        });
    };

    render() {
        const { amount, bonus, turnover, amountErr, ableSubmit } = this.state;
        return (
            <View style={styles.viewContianer}>
                <View style={styles.scrollContianer}>
                    <KeyboardAwareScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <Text style={styles.promoTitle}>{this.props?.StrApiDetail?.bonusName}</Text>

                        <CustomTextInput
                            title={translate("申请金额")}
                            value={amount}
                            type={"alert"}
                            errorMessage={amountErr}
                            keyboardType={"numeric"}
                            onChangeText={val => this._onChangeAmount(val?.replace(/[^0-9.]/g, ""))}
                        />

                        <CustomTextInput title={translate("可得彩金2")} value={getMoneyFormat(bonus, "")} disabled={true} />

                        <CustomTextInput title={translate("所需流水")} value={getMoneyFormat(turnover, "")} disabled={true} />

                        <View style={{ flexDirection: "row" }}>
                            <View style={{ alignSelf: "flex-start", paddingTop: 8 }}>
                                <InforIcon fill={"#999999"} width={16} height={16} marginRight={4} />
                            </View>
                            <Text style={styles.promoText}>{translate("有效流水将优先用于满足彩金优惠流水需求, 剩余的有效流水将随后计入您的返水")}</Text>
                        </View>

                        <FilledButton
                            onPress={() => {
                                if (!ableSubmit) return;

                                this.submitApplication();
                            }}
                            text={translate("提交")}
                            enable={ableSubmit}
                            wrapStyle={{ marginTop: 20 }}
                        />
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = dispatch => ({
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ApplyBonus);

const styles = StyleSheet.create({
    viewContianer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
        padding: 15,
    },
    scrollContianer: {
        padding: 15,
        backgroundColor: Color.white,
        borderRadius: 8,
        height: "auto",
    },
    promoTitle: {
        paddingBottom: 15,
        fontWeight: "600",
        color: Color.charcoal,
        fontSize: 16,
    },
    promoText: {
        paddingTop: 8,
        fontWeight: "400",
        color: "#666666",
        fontSize: 12,
        flex: 1,
    },
});
