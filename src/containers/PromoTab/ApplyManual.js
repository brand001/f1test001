import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";
import CustomTextInput from "$Components/CustomTextInput";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe } from "$Utils";
import FilledButton from "$Components/FilledButton";


const MaxLength = 100;

class ApplyManual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };
    }

    submitManual() {
        let { message } = this.state;
        if (!Boolean(message)) return;
        let { BoffApiDetail, StrApiDetail, callBack = () => {} } = this.props;
        let entryPeriodId = BoffApiDetail?.entryPeriodId;

        PiwikEventDataHandle({
            eventTitle: "ManualDetail5",
            customProperties: {
                Promotion_S_Application_PromoName_PrmoID: StrApiDetail.promoTitle + "_" + BoffApiDetail.campaignId,
            },
        });

        const { address, firstName } = this.props?.userInfo.memberInfo || {};

        const postData = {
            entryPeriodId: entryPeriodId,
            siteId: window.siteId,
            formData: {
                formType: 1,
                participantName: firstName,
                email: "",
                remark: message,
                phoneNumber: "",
                address: address?.address || "",
                prize: "",
                shirtSize: "",
            },
        };

        Toasts.loading(translate("加载中,请稍候..."));
        fetchRequest(ApiPort.CampaignEnrollments + "actionType=2" + "&", "POST", postData)
            .then(res => {
                Toasts.removeAll();
                let { result = {} } = res;
                if (res?.isSuccess && result?.isSuccess) {
                    Toasts.success(translate("优惠申请成功"), 2000, () => {
                        callBack();
                    });
                } else {
                    Toasts.fail(translate("系统忙碌中，请稍后再试"));
                }
            })
            .catch(error => {
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
                Toasts.removeAll();
            });
    }

    render() {
        const memberInfo = this.props?.userInfo.memberInfo;
        let canSubmit = true;

        let ContactsEmail = canSubmit ? memberInfo.contacts?.find(item => item.contactType == "Email")?.contact : this.props?.myPromoItem?.emailAddress;
        let ContactsPhone = canSubmit ? memberInfo.contacts?.find(item => item.contactType == "Phone")?.contact : this.props?.myPromoItem?.contactNo;
        const promoTitle = canSubmit ? this.props?.StrApiDetail?.promoTitle : this.props?.myPromoItem?.promotionTitle;
        const firstName = this.props?.userInfo?.userName || memberInfo.firstName || "";
        const remark = canSubmit ? "" : this.props?.myPromoItem?.remarks;

        let { message = "" } = this.state;

        return (
            <View style={styles.viewContianer}>
                <KeyboardAwareScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={styles.scrollContianer}>
                        <Text style={styles.promoTitle}>{promoTitle}</Text>

                        <CustomTextInput title={translate("用户名2")} value={firstName} disabled={true} />

                        <CustomTextInput title={translate("电子邮箱2")} value={ContactsEmail} disabled={true} />

                        <CustomLinkText
                            text={translate("如果您想更新电子邮箱，请联系我们的{在线客服}1")}
                            norMaltextStyle={styles.liveChatText}
                            themeTextStyle={styles.liveChatText1}
                            onPressList={[
                                () => {
                                    LiveChatOpenGlobe();
                                    if (canSubmit) {
                                        PiwikEventDataHandle("ManualDetailReview4");
                                    } else {
                                        PiwikEventDataHandle("ManualDetail4");
                                    }
                                },
                            ]}
                        />

                        <CustomTextInput title={translate("联络电话")} value={ContactsPhone} disabled={true} />

                        <CustomLinkText
                            text={translate("如果您想更新联系电话，请联系我们的{在线客服}")}
                            norMaltextStyle={styles.liveChatText}
                            themeTextStyle={styles.liveChatText1}
                            onPressList={[
                                () => {
                                    LiveChatOpenGlobe();

                                    if (canSubmit) {
                                        PiwikEventDataHandle("ManualDetailReview4");
                                    } else {
                                        PiwikEventDataHandle("ManualDetail4");
                                    }
                                },
                            ]}
                        />

                        <CustomTextInput
                            title={translate("留言")}
                            placeholder={translate("请输入优惠详情所需的信息")}
                            value={canSubmit ? message : remark || "Tin nhắn mẫu"}
                            onChangeText={message => {
                                this.setState({ message });
                            }}
                            maxLength={MaxLength}
                            wrapStyle={{ height: 100 }}
                            underlineColorAndroid="transparent"
                            textContentType="username"
                            multiline={true} // 启用多行输入
                            //numberOfLines={5} // 指定文本框的行数（仅影响高度）
                            textAlignVertical="top" // 让文字从顶部开始对齐
                        />

                        {canSubmit && (
                            <FilledButton
                                text={translate("提交mannual")}
                                enable={message}
                                wrapStyle={{ marginTop: 20 }}
                                onPress={() => {
                                    this.submitManual();
                                }} />
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

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

    liveChatText: {
        color: Color.darkGray,
        fontSize: 12,
        fontWeight: "400",
        marginTop: 5,
        marginBottom: 5,
    },
    liveChatText1: {
        color: Color.theme,
    },
});
const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyManual);
