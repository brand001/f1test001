import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { useSelector } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { ErrorCodeHandler, SignupBonusStatus } from "./../PromotionStatus.js";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import DropDownSelectArray from "$Components/DropDownSelectArray";
import { Toasts } from "$Toasts";
import FilledButton from "$Components/FilledButton.js";
import { InforIcon } from "$Components/icons/index";

import { ConfirmBonusDropDownSelect } from "./DropDownSelectTip";
{
    /* 确认累计游戏类别 */
}
const ConfirmBonus = props => {
    // props
    const { promotionDetails } = props;
    const { productGroups, givenAmount, participantId } = promotionDetails;

    const reduxState = useSelector(state => state);
    const balanceObj = reduxState?.userInfo?.balanceObj || {};
    if (Object.keys.length && Array.isArray(productGroups) && productGroups.length) {
        productGroups.forEach(v => {
            v.name = balanceObj[v?.productGroup]?.walletProductGroupName || v.name;
        });
    }

    // state
    const [errorMsg, setErrorMsg] = useState(null);
    const [balIndex, setBalIndex] = useState(productGroups.length > 1 ? -1 : 0);
    const [balListVisible, setBalListVisible] = useState(false);
    const [cancelBonusModal, setCancelBonusModal] = useState(false);

    // methods
    const toggleVisible = (val = false) => {
        setBalListVisible(val);
    };

    const errorCodeHandler = result => {
        let errorMsg = "";
        const errorCode = result?.errorCode;
        const errMsg = result?.message || "";

        errorMsg = {
            unableSubmit: false,
        };

        if (errorCode == "CP30011") {
            setCancelBonusModal(true);
            errorMsg = {
                data: result?.data,
            };
        } else {
            if (errorCode == "CP30017" || errorCode == "CP30020" || errorCode == "CP30018") {
                errorMsg = {
                    title: "",
                    msg: (errorCode == "CP30017" || errorCode == "CP30020")
                        ?
                        translate("尚未完成有效流水要求，请在完成有效流水需求后再开始优惠")
                        :
                        translate("进行中的优惠等待确认中，请联系在线客服协助确认"),
                    unableSubmit: true,
                };
            } else {
                ErrorCodeHandler({
                    result,
                    okFuntion: () => {
                        Actions.pop();
                    },
                });
            }
        }

        PiwikEventDataHandle({
            eventTitle: "BonusHistory10",
            customProperties: {
                Bonus_C_ConfirmCancelSignUpBonus_ErrorMsg: errMsg,
            },
        });
        return errorMsg;
    };

    const submitApplication = type => {
        let productGroup = productGroups[balIndex]?.productGroup;
        const data = {
            participantId: participantId,
            productGroup: productGroup,
            blackboxValue: E2Backbox,
            isCancel: type === "cancel" ? true : false,
        };

        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(ApiPort.CampaignApplications, "POST", data)
            .then(res => {
                Toasts.removeAll();
                const result = res?.result;

                if (type == "cancel") {
                    if (result?.isSuccess) {
                        Toasts.success(translate("优惠已开始"), 2000, () => {
                            props?.callBack();
                            return;
                        });
                    } else {
                        let { message = "", errorCode = "" } = result;
                        // {
                        //     "result": {
                        //         "isSuccess": false,
                        //         "message": "Sportsbook\ncó cược chưa thanh toán,\nvui lòng thử lại sau.",
                        //         "errorCode": "CP30013",
                        //         "errorDesc": "Unfinished game found.",
                        //         "data": {
                        //             "productGroup": "Sportsbook",
                        //             "productGroupName": "Sportsbook",
                        //             "productVendors": [
                        //                 "Thể Thao IM",
                        //                 "Thể Thao CMD"
                        //             ]
                        //         }
                        //     },
                        //     "isSuccess": false
                        // }
                        if (errorCode == "CP30013") {
                            GetGlobalModal({
                                title: translate("取消失败"),
                                message: result?.message,
                                confirmText: translate("我知道了"),
                                onConfirm: () => {},
                            });
                        } else {
                            setErrorMsg(errorCodeHandler(result));
                        }
                        return;
                    }
                }

                // isSuccess --> 轉跳至進行中
                if (result?.isSuccess) {
                    Toasts.success(translate("优惠已开始"), 2000, () => {
                        props?.callBack && props?.callBack();
                    });

                    PiwikEventDataHandle({
                        eventTitle: "BonusHistory9",
                        isSuccess: 2,
                    });
                } else {
                    setErrorMsg(errorCodeHandler(result));

                    PiwikEventDataHandle({
                        eventTitle: "BonusHistory9",
                        isSuccess: 1,
                        customProperties: {
                            Promotion_C_ConfirmType_CancelOnging_ErrorMsg: result?.message,
                        },
                    });
                }
            })
            .catch(err => {
                Toasts.fail(translate("系统忙碌中，请稍后再试"));
            });
    };

    return (
        <View style={styles.viewContianer}>
            {/* <Text onPress={() => {
                setCancelBonusModal(true)
            }}>12323</Text> */}

            <View style={styles.scrollContianer}>
                {/* 重要提示 */}
                <ConfirmBonusDropDownSelect
                    modalVisible={cancelBonusModal}
                    closeModal={setCancelBonusModal}
                    errorMsg={errorMsg}
                    givenAmount={givenAmount}
                    showCSIcon={true}
                    onPress={type => {
                        SignupBonusStatus({
                            productGroup: productGroups[balIndex]?.productGroup,
                            callBack: () => {
                                submitApplication(type);
                            },
                        });
                    }}
                />

                <Text style={styles.promoTitle}>
                    {Array.isArray(productGroups) && productGroups.length == 1 ? translate("以该游戏类别进行有效流水累计") : translate("选择游戏类别进行有效流水累计")}
                </Text>

                <View style={styles.listBox}>
                    <Text style={styles.title}>{translate("游戏类别")}</Text>
                    <View>
                        {Array.isArray(productGroups) && productGroups.length > 1 ? (
                            <DropDownSelectArray
                                modalVisible={balListVisible}
                                data={productGroups}
                                realKey="name"
                                defaultValue={translate("请选择游戏类别")}
                                title={translate("请选择游戏类别")}
                                closeModal={toggleVisible}
                                animationType={"slide"}
                                buttonStyle={[styles.viewInput, styles.herderSelectList]}
                                onChange={({ key }) => {
                                    setBalIndex(key);
                                    setErrorMsg({
                                        msg: "",
                                        unableSubmit: false,
                                    });
                                }}
                            />
                        ) : (
                            <View style={[styles.viewInput]}>
                                <Text style={styles.viewInputText}>{productGroups[0]?.name || ""}</Text>
                            </View>
                        )}
                    </View>
                    {errorMsg?.unableSubmit && <Text style={styles.errorTip}>{errorMsg?.msg}</Text>}
                </View>

                <View style={styles.listBox}>
                    <Text style={styles.title}>{translate("可得彩金2")}</Text>
                    <View style={[styles.viewInput]}>
                        <Text style={styles.viewInputText}>{balIndex === -1 ? 0 : givenAmount || 0}</Text>
                    </View>
                </View>

                <View style={styles.listBox}>
                    <Text style={styles.title}>{translate("所需流水")}</Text>
                    <View style={[styles.viewInput]}>
                        <Text style={styles.viewInputText}>{balIndex === -1 ? 0 : productGroups[balIndex]?.turnoverAmount || 0}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <View style={{ alignSelf: "flex-start", paddingTop: 8 }}>
                        <InforIcon fill={"#999999"} width={16} height={16} marginRight={4} />
                    </View>
                    <Text style={styles.promoText}>{translate("有效流水将优先用于满足彩金优惠流水需求, 剩余的有效流水将随后计入您的返水")}</Text>
                </View>

                <FilledButton
                    text={translate("确认4")}
                    onPress={() => {
                        if (errorMsg?.unableSubmit || balIndex === -1) return;
                        submitApplication("apply");
                        PiwikEventDataHandle("BonusHistory8");
                    }}
                    enable={!(errorMsg?.unableSubmit || balIndex === -1)}
                    wrapStyle={{ marginTop: 20, marginBottom: 15 }}
                />

                <FilledButton
                    text={translate("返回")}
                    outlined={true}
                    onPress={() => {
                        Actions.pop();
                    }} />
            </View>
        </View>
    );
};

export default React.memo(ConfirmBonus);

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
    listBox: {
        marginBottom: 15,
    },
    title: {
        color: Color.charcoal,
        fontWeight: "600",
        fontSize: 14,
    },
    viewInput: {
        backgroundColor: Color.lightSilver,
        borderRadius: 8,
        width: "100%",
        height: 40,
        justifyContent: "center",
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Color.mediumGray,
        marginTop: 10,
        color: Color.gray,
        fontWeight: "400",
        fontSize: 14,
    },
    viewInputText: {
        color: Color.gray,
        fontWeight: "400",
        fontSize: 14,
    },
    herderSelectList: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: Color.white,
        justifyContent: "space-between",
    },
    errorTip: {
        color: Color.alertRed,
        fontSize: 12,
        fontWeight: "400",
        paddingTop: 8,
    },
    promoText: {
        paddingTop: 8,
        fontWeight: "400",
        color: "#666666",
        fontSize: 12,
        flex: 1,
    },
});
