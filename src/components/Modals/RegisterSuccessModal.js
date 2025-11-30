import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";

import ImageMap from "@/locales/Images";
import CustomCheckbox from "$Components/CustomCheckbox";
import FilledButton from "$Components/FilledButton";
import UnderlinedButton from "$Components/UnderlinedButton";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

const { width } = Dimensions.get("window");

const RegisterPop = ({ onCancel }) => {
    const [checkBox, setCheckBox] = useState(false);

    const postWelcomeCall = ({ checkBox: checkBoxValue, navigateToDeposit }) => {
        onCancel?.();
        window.fetchRequest(window.ApiPort.PostWelcomeCall + `isWelcomeCall=${checkBoxValue}&`, "POST")
            .then(_res => {
                Toasts.removeAll();
            })
            .catch(_err => {});

        navigateToDeposit && Actions.DepositCenter({});
    };

    const newMemberPromotionList = [
        {
            promoTitle: translate("注册成功优惠1"),
        },
        {
            promoTitle: translate("注册成功优惠2"),
        },
        {
            promoTitle: translate("注册成功优惠3"),
        },
    ];

    return (
        <View style={styles.container}>
            <Image style={styles.homeBanner} resizeMode="stretch" source={ImageMap.NewMemberPromotion}></Image>
            <View style={styles.contentWrapper}>
                {Boolean(Array.isArray(newMemberPromotionList) && newMemberPromotionList.length) &&
                    newMemberPromotionList.map((v, i) => {
                        return (
                            <View
                                key={i}
                                style={styles.promotionItem}>
                                <Text style={styles.promotionText}>
                                    {v.promoTitle}
                                </Text>
                            </View>
                        );
                    })}

                <CustomCheckbox
                    isFull={true}
                    isCheck={checkBox}
                    text={translate("注册成功优惠4")}
                    textStyle={styles.checkboxText}
                    onPress={checkBox => {
                        setCheckBox(checkBox);

                        if (!checkBox) {
                            PiwikEventDataHandle("Welcome_Deposit1");
                        } else {
                            PiwikEventDataHandle("Welcome_Deposit2");
                        }
                    }}
                />
                {checkBox && (
                    <Text style={styles.hintText}>
                        {translate("注册成功优惠5")}
                    </Text>
                )}

                <FilledButton
                    text={translate("注册成功优惠6")}
                    onPress={() => {
                        postWelcomeCall({ checkBox, navigateToDeposit: true });
                        PiwikEventDataHandle("Welcome_Deposit3");
                    }}
                    wrapStyle={styles.filledButtonWrapper}
                />

                <UnderlinedButton
                    text={translate("注册成功优惠7")}
                    onPress={() => {
                        postWelcomeCall({ checkBox });
                        PiwikEventDataHandle("Welcome_Deposit4");
                    }}
                    wrapStyle={styles.underlinedButtonWrapper}
                />
            </View>
        </View>
    );
};

export default RegisterPop;

const styles = StyleSheet.create({
    homeBanner: {
        width: width * 0.9,
        height: width * 0.9 * 0.588,
    },
    container: {
        width: "100%",
        marginBottom: 10,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        overflow: "hidden",
    },
    contentWrapper: {
        marginHorizontal: 15,
        marginTop: 15,
    },
    promotionItem: {
        backgroundColor: "#EFEFF4",
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
    },
    promotionText: {
        color: "#464646",
    },
    checkboxText: {
        color: "#000",
        fontSize: 15,
    },
    hintText: {
        textAlign: "left",
        color: "#666",
        fontWeight: "400",
    },
    filledButtonWrapper: {
        marginTop: 20,
        marginBottom: 15,
    },
    underlinedButtonWrapper: {
        marginBottom: 20,
    },
});
