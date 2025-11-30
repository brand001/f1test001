import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { CloseIcon, SuccessIcon } from "$Components/icons/index";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";

const { width } = Dimensions.get("window");

const formPage = "Referee";

class RecommendRefereeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            referreeTaskStatus: this.props?.modalData || {},
        };
    }

    goDepositPage() {
        const { onCancel = () => {}, modalCallBack = () => {} } = this.props;
        onCancel();

        Actions.DepositCenter({
            callBack: () => {
                modalCallBack();
            },
        });
    }

    goVerificationActionPage() {
        const { onCancel = () => {}, modalCallBack = () => {} } = this.props;
        const { referreeTaskStatus } = this.state;
        let { isContactVerified = false } = referreeTaskStatus;
        let { memberInfo = {} } = this.props.userInfo;

        let phoneStatus = memberInfo?.phoneStatus;
        let emailStatus = memberInfo.emailStatus;

        const { firstName = "" } = memberInfo;

        onCancel();


        if (window.LANGUAGE == "TH" && !firstName) {
            Actions.UserUpdateInfo({
                updateType: "firstName",
                formPage,
                callBack: isSucessSubmit => {
                    if (isSucessSubmit) {
                        if (!emailStatus) {
                            Actions.Verification({
                                verificaType: "email",
                                formPage,
                                serviceAction: "ProfileVerification", //Quelea
                                callBack: () => {
                                    modalCallBack();
                                },
                            });
                            return;
                        }

                        if (!phoneStatus) {
                            Actions.Verification({
                                verificaType: "phone",
                                formPage,
                                serviceAction: "ProfileVerification", //Quelea
                                callBack: () => {
                                    modalCallBack();
                                },
                            });
                            return;
                        }
                    } else {
                        modalCallBack();
                    }
                }
            });
            return;
        }


        if (!isContactVerified) {
            if (!emailStatus) {
                Actions.Verification({
                    verificaType: "email",
                    formPage,
                    serviceAction: "ProfileVerification", //Quelea
                    callBack: (flag) => {
                        flag && modalCallBack(); // falg tur 没有做任何验证， 返回任务时， 重新打开modal
                    },
                });
                return;
            }

            if (!phoneStatus) {
                Actions.Verification({
                    verificaType: "phone",
                    formPage,
                    serviceAction: "ProfileVerification", //Quelea
                    callBack: (flag) => {
                        flag && modalCallBack();
                    },
                });
                return;
            }
        }
    }

    isAllDone = () => {
        const { referreeTaskStatus } = this.state;
        return referreeTaskStatus.isContactVerified && referreeTaskStatus.isDeposited;
    };

    render() {
        let { memberInfo = {} } = this.props.userInfo;
        const { referreeTaskStatus } = this.state;
        const { onCancel = () => {} } = this.props;
        let { isDeposited = false, isContactVerified = false } = referreeTaskStatus;
        // let isDeposited = false
        // let isContactVerified = false
        let isCNVN = (window.LANGUAGE == "CN" || window.LANGUAGE == "VN");
        isContactVerified = window.LANGUAGE == "TH" ? isContactVerified && memberInfo?.firstName : isContactVerified;
        // let depositPartFlag = isCNVN ? !isDeposited : (!isDeposited && isContactVerified)
        // let verificationPartFlag = isCNVN ? (isDeposited && !isContactVerified) : !isContactVerified

        const DepositPart = () => {
            return (
                <View style={styles.recommendLits}>
                    <Text style={styles.listTitle}>{isCNVN ? translate("第二步") : translate("第三步")}</Text>
                    <RowCenterBetween>
                        <Text style={styles.listInfor}>{translate("进入存款页面完成首存")}</Text>

                        <SuccessIcon width={22} height={22} type={isDeposited ? "fill" : "ring"} />
                    </RowCenterBetween>

                    <FilledButton
                        text={translate("立即存款")}
                        enable={!isDeposited}
                        wrapStyle={[
                            styles.btn,
                            {
                                backgroundColor: isDeposited ? Color.silverGray : Color.theme,
                            },
                        ]}
                        textStyle={styles.btnText}
                        onPress={() => {
                            this.goDepositPage();
                        }} />
                </View>
            );
        };

        const VerificationPart = () => {
            return (
                <View style={[styles.recommendLits, { marginBottom: 0 }]}>
                    <Text style={styles.listTitle}>{isCNVN ? translate("第三步") : translate("第二步")}</Text>
                    <RowCenterBetween>
                        <Text style={styles.listInfor}>{translate("完成存款后进行邮箱和手机的验证")}</Text>

                        <SuccessIcon width={22} height={22} type={isContactVerified ? "fill" : "ring"} />
                    </RowCenterBetween>

                    <FilledButton
                        text={translate("立即验证")}
                        enable={!isContactVerified}
                        wrapStyle={[
                            styles.btn,
                            {
                                backgroundColor: isContactVerified ? Color.silverGray : Color.theme,
                            },
                        ]}
                        textStyle={styles.btnText}
                        onPress={() => {
                            this.goVerificationActionPage();
                            //CXFUN88-3601
                        }} />
                </View>
            );
        };

        // //CXFUN88-3601 依次执行
        // let depositPartFlag = isCNVN ? !isDeposited : (!isDeposited && isContactVerified)
        // let verificationPartFlag = isCNVN ? (isDeposited && !isContactVerified) : !isContactVerified

        // const DepositPart = () => {
        //     return <View style={styles.recommendLits}>
        //         <Text style={styles.listTitle}>{isCNVN ? translate('第二步') : translate('第三步')}</Text>
        //         <RowCenterBetween>
        //             <Text style={styles.listInfor}>{translate('进入存款页面完成首存')}</Text>
        //             <Image resizeMode="contain"
        //                 source={(isCNVN ? depositPartFlag : true) ? ImagesUrl.successWhite : ImagesUrl.successGreen}
        //                 style={styles.icon} />
        //         </RowCenterBetween>

        //         <FilledButton
        //             text={translate('立即存款')}
        //             enable={depositPartFlag}
        //             wrapStyle={[styles.btn, { backgroundColor: depositPartFlag ? Color.theme : Color.silverGray }]}
        //             textStyle={styles.btnText}
        //             onPress={() => {
        //                 this.goDepositPage()
        //             }}
        //          />
        //     </View>
        // }

        // const VerificationPart = () => {
        //     return <View style={[styles.recommendLits, { marginBottom: 0 }]}>
        //         <Text style={styles.listTitle}>{isCNVN ? translate('第三步') : translate('第二步')}</Text>
        //         <RowCenterBetween>
        //             <Text style={styles.listInfor}>{translate('完成存款后进行邮箱和手机的验证')}</Text>
        //             <Image resizeMode="contain"
        //                 source={(isCNVN ? false : !verificationPartFlag) ? ImagesUrl.successGreen : ImagesUrl.successWhite}
        //                 style={styles.icon} />
        //         </RowCenterBetween>

        //         <FilledButton
        //             text={translate('立即验证')}
        //             enable={verificationPartFlag}
        //             wrapStyle={[styles.btn, { backgroundColor: verificationPartFlag ? Color.theme : Color.silverGray }]}
        //             textStyle={styles.btnText}
        //             onPress={() => {
        //                 this.goVerificationActionPage()
        //                 //CXFUN88-3601
        //             }}
        //          />
        //     </View>
        // }

        return (
            <View style={styles.container}>
                <View style={styles.recommendLits}>
                    <Text style={styles.listTitle}>{translate("第一步")}</Text>
                    <RowCenterBetween>
                        <Text style={styles.listInfor}>{translate("点击 “立即注册” 成为我们的会员")}</Text>
                        <SuccessIcon width={22} height={22} />
                    </RowCenterBetween>

                    <FilledButton text={translate("立即注册")} enable={false} wrapStyle={styles.btn} textStyle={styles.btnText} />
                </View>

                <View style={{ height: 15 }}></View>
                {isCNVN ? (
                    <>
                        {DepositPart()}
                        <View style={{ height: 15 }}></View>
                        {VerificationPart()}
                    </>
                ) : (
                    <>
                        {VerificationPart()}
                        <View style={{ height: 15 }}></View>
                        {DepositPart()}
                    </>
                )}
                <RowCenterCenter>
                    <Text style={{ color: Color.theme, paddingTop: 15, paddingBottom: 5, fontWeight: "600" }} onPress={onCancel}>{translate("关闭")}</Text>
                </RowCenterCenter>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    userSetting: state.userSetting,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendRefereeModal);
const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    listTitle: {
        color: Color.charcoal,
        fontSize: 14,
        fontWeight: "400",
    },
    listInfor: {
        color: Color.darkGray,
        fontSize: 12,
        fontWeight: "400",
        width: "75%",
        marginVertical: 8,
    },
    btn: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        height: 28,
        backgroundColor: Color.silverGray,
    },
    btnText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.white,
    },
    recommendLits: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        padding: 15,
        borderRadius: 10,
    },
    icon: {
        width: 22,
        height: 22,
    },
});
