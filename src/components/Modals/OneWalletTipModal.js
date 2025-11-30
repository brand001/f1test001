import React from "react";

import { Dimensions, Image, View } from "react-native";
const { width, height } = Dimensions.get("window");

import ImageMap from "@/locales/Images";
import { translate } from "@/locales/translate";
import FilledButton from "$Components/FilledButton";
import { ColumnCenterCenter } from "$Components/CustomView";
const marginHorizontal = 16;
const imgWidth = width - marginHorizontal * 2;
import StorageUtil from "$Utils/Storage";

export default function OneWalletTipModal({ modalData = {}, onCancel = () => {} }) {
    const OneWalletImg = {
        Profile: {
            img: ImageMap.oneWalletProfile,
            imgHeight: 1.036 * imgWidth,
        },
        MyBonus: {
            img: ImageMap.oneWalletMyBonus,
            imgHeight: 1.469 * imgWidth,
        },
        Locked: {
            img: ImageMap.oneWalletLocked,
            imgHeight: 1.6 * imgWidth,
        },
    };

    let { page } = modalData;
    let { img = null, imgHeight = 0 } = OneWalletImg[page];
    return (
        <ColumnCenterCenter
            style={{
                width: "100%",
            }}>
            <Image source={img} resizeMode={"stretch"} style={{ width: imgWidth, height: imgHeight }} />

            <FilledButton
                text={translate("我知道了")}
                fullWidth={false}
                type={"medium"}
                wrapStyle={{
                    borderRadius: 9999,
                    marginTop: 30,
                    width: 120,
                }}
                onPress={() => {
                    onCancel();
                    StorageUtil.save({ key: `oneWallet${page}${memberCode}`, data: true });
                }}
            />
        </ColumnCenterCenter>
    );
}
