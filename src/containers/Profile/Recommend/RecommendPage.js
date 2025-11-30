import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";

import { SaveImg, CopyText } from "$Utils";
import StorageUtil from "$Utils/Storage";
const { width, height } = Dimensions.get("window");
import Share from "react-native-share";
import { connect } from "react-redux";
import _ from "lodash";

import BonusProgress from "./Components/BonusProgress";
import ProgressStep from "./Components/ProgressStep";
import QRCode from "./Components/QRCode";
import ReferreeList from "./Components/ReferreeList";
import actions from "@/lib/redux/actions/index";
import FilledButton from "$Components/FilledButton";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";

import ActivePage from "./Components/ActivePage";
import { RowCenterCenter } from "$Components/CustomView";
import CustomScrollView from "$Components/CustomScrollView";

class Recommend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registered: false,
            QueleaReferrerInfo: this.props.QueleaReferrerInfo || "",
            memberInfo: "",
            activepages: false,
            isDeposited: false,
            isContactVerified: false,
            result: "",
            campaignRewardDetails: [],
            dateRegister: "0000年00月00",
            phoneVerified: false,
            emailVerified: false,
            totalDeposits: "0",
            totalBets: 0,
            isVerificationMet: false,
            isDepositMet: false,
            isRegisteredMet: false,
            IdentityCardStatus: false,
            //进度条数据
            progressBar1: "0",
            progressBar2: "0",
            progressBar3: "0",
            progressBar4: "0",
            progressBar5: "0",
            firstTierRewardAmount: "0",
            secondTierRewardAmount: "0",
            progressBarData1: "",
            progressBarData2: "",
            referrerPayoutAmount: "0",
            ScrollTop: false,
            QueleaReferreeList: [], //M2新功能列表
            Urls: (this.props.QueleaReferrerInfo && this.props.QueleaReferrerInfo.queleaUrl) || "",
        };
        this._ScrollTop = null;
    }

    componentDidMount() {
        //获取充值，流水最低详情
        this.getData();

        //没用加入过的表示条件不知道满足，需要再拿api
        if (!this.state.Urls) {
            //加入推荐条件是否满足
            this.ReferrerEligible();
            //获取不满足的准确信息
            this.ReferrerActivity();
            this.getUser();
        }
        //M2獲取獎金列表
        this.GetQueleaReferreeList();
        //获取推荐个数，能获取的彩金
        this.ReferrerRewardStatus();
    }

    //获取充值，流水最低详情
    getData = async () => {
        const data = await StorageUtil.load("QueleaActiveCampaign");
        if (!data) return;
        this.setState({
            result: data.result,
            campaignRewardDetails: data.result.campaignRewardDetails,
            maxReferral: data.result?.maxReferral
        });
    };

    GetQueleaReferreeList = () => {
        if (window.LANGUAGE !== "TH") return;
        fetchRequest(ApiPort.GetQueleaReferreeList, "GET")
            .then(res => {
                let { isSuccess = false, result = {} } = res;
                let QueleaReferreeList = result?.refereeDetails || result?.referreeDetails;
                if (isSuccess && QueleaReferreeList) {
                    this.setState({
                        QueleaReferreeList
                    });
                }
            })
            .catch(err => console.log(err));
    };

    //加入推荐条件是否满足
    ReferrerEligible() {
        fetchRequest(ApiPort.ReferrerEligible, "GET")
            .then(res => {
                if (res.isSuccess && res.result) {
                    const { isVerificationMet = false, isDepositMet = false, isRegisteredMet = false, isBetAmountMet = false } = res.result;

                    // 判斷是否所有條件都滿足
                    const registered = isVerificationMet && isDepositMet && isRegisteredMet && isBetAmountMet;

                    this.setState({
                        registered,
                        isVerificationMet,
                        isDepositMet,
                        isRegisteredMet,
                        isBetAmountMet,
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    //获取不满足的准确信息
    ReferrerActivity() {
        Toasts.loading(translate("加载中..."));
        fetchRequest(ApiPort.ReferrerActivity, "GET")
            .then(res => {
                Toasts.removeAll();
                if (res.isSuccess && res.result) {
                    const { dateRegister = new Date().toISOString(), phoneVerified = false, emailVerified = false, totalDeposits = 0, totalBets = 0 } = res.result;

                    this.setState({
                        dateRegister: dateRegister,
                        phoneVerified: phoneVerified,
                        emailVerified: emailVerified,
                        totalDeposits: totalDeposits,
                        totalBets: totalBets,
                    });
                }
            })
            .catch(error => {
                Toasts.removeAll();
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
                console.log(error);
            });
    }

    //获取推荐个数，能获取的彩金
    ReferrerRewardStatus = () => {
        Toasts.loading(translate("加载中..."));
        fetchRequest(ApiPort.ReferrerRewardStatus, "GET")
            .then(res => {
                Toasts.removeAll();
                if (res.isSuccess && res.result) {
                    const {
                        linkClicked = 0,
                        memberRegistered = 0,
                        memberDeposited = 0,
                        firstTierMetCount = 0,
                        secondTierMetCount = 0,
                        firstTierRewardAmountSetting = 0,
                        secondTierRewardAmountSetting = 0,
                        firstTierMsg = {},
                        secondTierMsg = {},
                        referrerPayoutAmount = 0,
                    } = res.result;

                    //进度条数据
                    this.setState({
                        progressBar1: linkClicked,
                        progressBar2: memberRegistered,
                        progressBar3: memberDeposited,
                        progressBar4: firstTierMetCount,
                        progressBar5: secondTierMetCount,
                        firstTierRewardAmount: firstTierRewardAmountSetting,
                        secondTierRewardAmount: secondTierRewardAmountSetting,
                        progressBarData1: firstTierMsg,
                        progressBarData2: secondTierMsg,
                        referrerPayoutAmount: referrerPayoutAmount,
                    });
                }
            })
            .catch(error => {
                Toasts.removeAll();
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
                console.log(error);
            });
    };


    componentDidUpdate(prevProps) {
        const prevMemberInfo = prevProps?.userInfo?.memberInfo;
        const currentMemberInfo = this.props?.userInfo?.memberInfo;

        // 使用 lodash 深度比较对象
        if (!_.isEqual(prevMemberInfo, currentMemberInfo)) {
            this.getUser();
        }
    }

    getUser = () => {
        let memberInfo = this.props?.userInfo?.memberInfo;
        let IdentityCardStatus = memberInfo.firstName !== "";

        this.setState({
            IdentityCardStatus,
        });
    };

    // 前往手机 || 邮箱验证
    navigateToVerification = verificationType => {
        Actions.Verification({
            formPage: "Recommend",
            verificaType: verificationType,
            callBack: () => this.componentDidMount(),
            serviceAction: "ProfileVerification", // Quelea
        });
    };

    Verify = () => {
        const { emailVerified, IdentityCardStatus } = this.state;


        // M2邏輯
        if (window.LANGUAGE === "TH" && !IdentityCardStatus) {
            Actions.UserUpdateInfo({
                updateType: "firstName",
                IdentityCardStatus: true,
                formPage: "Recommend",
                callBack: () => {
                    const typeToVerify = !emailVerified ? "email" : "phone";
                    this.navigateToVerification(typeToVerify);
                }
            });
            return;
        }

        // 優先驗證未驗證的項目
        const typeToVerify = !emailVerified ? "email" : "phone";
        this.navigateToVerification(typeToVerify);
    };

    goDeposit() {
        Actions.DepositCenter({
            from: "GamePage",
            callback: () => {
                this.componentDidMount();
            },
        });
    }

    //复制链接
    copys = () => {
        if (this.state.Urls === "") {
            return;
        }
        CopyText(this.state.Urls);
    };

    //保存二维码
    saveImg = () => {
        const viewShotRef = this.referComponent.getViewShot();
        SaveImg(viewShotRef, translate("已保存"));
    };

    ShareUrl = () => {
        if (!Share) {
            Toasts.fail(translate("系统忙碌中，请稍后再试"));
            return;
        }
        const shareOptions = {
            title: translate("分享给大家"),
            url: this.state.Urls,
            failOnCancel: false,
        };
        return Share.open(shareOptions);
    };

    //生成推荐链接
    getUrls() {
        if (!this.state.registered) {
            //不满足条件
            return;
        }

        Toasts.loading(translate("加载中..."), 200);
        fetchRequest(ApiPort.ReferrerSignUp, "POST")
            .then(res => {
                Toasts.removeAll();
                if (res.isSuccess && res.result) {
                    let data = res.result;
                    this.setState({
                        QueleaReferrerInfo: data,
                        Urls: data.queleaUrl,
                    });
                } else {
                    Toasts.fail(translate("系统忙碌中，请稍后再试"));
                }
            })
            .catch(error => {
                Toasts.removeAll();
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
            });
    }

    render() {
        const {
            registered,
            dateRegister,
            phoneVerified,
            emailVerified,
            totalDeposits,
            totalBets,
            isVerificationMet,
            isDepositMet,
            isRegisteredMet,
            isBetAmountMet,
            IdentityCardStatus,
            progressBar1,
            progressBar2,
            progressBar3,
            progressBar4,
            progressBar5,
            firstTierRewardAmount,
            secondTierRewardAmount,
            progressBarData1,
            progressBarData2,
            referrerPayoutAmount,
            Urls,
            result,
            campaignRewardDetails,
            QueleaReferreeList,
            ScrollTop,
            maxReferral
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
                <CustomScrollView
                    bottom={100}
                >
                    {/* BANNER */}
                    <Image resizeMode="stretch" source={ImgMap.rafBanner} style={{ width: width, height: width * 0.32 }} />

                    <View style={{ padding: 15 }}>
                        {/* 推薦好友完成步驟 */}
                        {Urls === "" && (
                            <>
                                <Text style={styless.title}>{translate("须满足申请资格")}</Text>
                                <ProgressStep
                                    result={result}
                                    isRegisteredMet={isRegisteredMet} //CN LOGIC
                                    isVerificationMet={isVerificationMet} //CN LOGIC
                                    dateRegister={dateRegister} //CN LOGIC
                                    IdentityCardStatus={IdentityCardStatus} //TH LOGIC
                                    totalDeposits={totalDeposits}
                                    totalBets={totalBets}
                                    isDepositMet={isDepositMet}
                                    isBetAmountMet={isBetAmountMet}
                                    emailVerified={emailVerified}
                                    phoneVerified={phoneVerified}
                                    goDeposit={() => this.goDeposit()}
                                    Verify={() => this.Verify()}
                                />
                            </>
                        )}

                        {(
                            <>
                                {/* https://arcadie.atlassian.net/issues/FSC-15 */}
                                {/* QRCODE複製鏈接與分享好友 */}
                                {
                                    Urls !== "" &&
                                    <QRCode
                                        url={Urls}
                                        onCopy={this.copys}
                                        onSaveImage={this.saveImg}
                                        onShare={this.ShareUrl}
                                        ref={ref => {
                                            this.referComponent = ref;
                                        }}
                                    />
                                }


                                {/* M1&M3奖金进度 M2獎金列表 */}
                                {window.LANGUAGE === "CN" || window.LANGUAGE === "VN" ? (
                                    <BonusProgress
                                        progressBar1={progressBar1}
                                        progressBar2={progressBar2}
                                        progressBar3={progressBar3}
                                        progressBar4={progressBar4}
                                        progressBar5={progressBar5}
                                        firstTierRewardAmount={firstTierRewardAmount}
                                        secondTierRewardAmount={secondTierRewardAmount}
                                        referrerPayoutAmount={referrerPayoutAmount}
                                        progressBarData1={progressBarData1}
                                        progressBarData2={progressBarData2}
                                    />
                                ) : (
                                    <ReferreeList referreeList={QueleaReferreeList} />
                                )}
                            </>
                        )}

                        {/* 活動頁面 */}
                        <ActivePage flag={Urls !== ""} result={result} campaignRewardDetails={campaignRewardDetails} maxReferral={maxReferral} />
                    </View>
                </CustomScrollView>

                {/* 底部按鈕 */}
                {Urls === "" && (
                    <RowCenterCenter style={styless.btnContainer}>
                        <FilledButton
                            enable={registered}
                            wrapStyle={{ width: width * 0.9 }}
                            text={translate("生成专属推荐链接")}
                            onPress={() => {
                                this.getUrls();
                            }}
                        />
                    </RowCenterCenter>
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);

const styless = StyleSheet.create({
    title: {
        color: "#222222",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 15,
    },
    btnContainer: {
        backgroundColor: "#fff",
        padding: 15,
        width: width,
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    num: {
        color: "#00A6FF",
        fontSize: 50,
        fontWeight: "bold",
        paddingRight: 10,
    }
});
