import React from "react";

import moment from "moment";
import { Text, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";

import { PromotionDetail, PromotionList } from "@/actions/CmsApi";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { getMoneyFormat, GetPromoProductGroupNameMapImg, GetBonusGmt, FormatDate } from "$Utils";
import { PromotionsTypeObj } from "./../PromotionStatus";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { RowCenterBetween } from "$Components/CustomView";
import { Toasts } from "$Toasts";

import styles from "./styles";

function BonusReadyItem(props) {
    const { bonusList, checkIsExpriy } = props;

    const promotionDetails = async item => {
        PiwikEventDataHandle("BonusHistory5");

        // const isExpired = checkIsExpriy(item.claimEndDateUtc)

        // if (isExpired) {
        //     return
        // }

        let { campaignId = "" } = item;

        let params = {
            type: "general",
            transactionType: "",
            wallet: "",
        };
        Toasts.loading(translate("加载中,请稍候..."), 200);
        let res = await PromotionList(params);

        let parms = {};
        let promotionType = "";
        let displayStatus = "";
        let promoId = "";
        let PromotionsItem = {};

        if (!(Array.isArray(res) && res?.length)) {
            parms.campaignId = campaignId;
        } else {
            PromotionsItem = res.find(v => v?.campaignId == campaignId) || {};

            promotionType = PromotionsItem?.promotionType;
            displayStatus = PromotionsItem?.displayStatus;
            promoId = PromotionsItem?.promoId;

            if (promoId) {
                parms.id = promoId;
            } else if (campaignId) {
                parms.campaignId = campaignId;
            }
        }

        PromotionDetail(parms)
            .then(res => {
                Toasts.removeAll();
                Actions.PromotionsDetail({
                    StrApiDetail: res,
                    BoffApiDetail: PromotionsItem,

                    PromotionsItem: promotionType ? PromotionsTypeObj[promotionType][displayStatus] : null,
                    callBack: () => {
                        props?.callBack && props?.callBack();
                    },
                });
            })
            .catch(error => {
                Toasts.removeAll();
            });
    };
    const bonusStart = item => {
        PiwikEventDataHandle({
            eventTitle: "BonusHistory6",
            customProperties: {
                ["Bonus_C_StartPromotion_PromoName_PrmoID"]: item.campaignNativeName + "-" + (item.campaignId || item.entryPeriodId),
            },
        });
        const isExpired = checkIsExpriy(item.claimEndDateUtc);
        if (isExpired) {
            return;
        }
        Actions.ConfirmBonus({
            promotionDetails: item,
            callBack: () => {
                props?.callBack && props?.callBack();
            },
        });
    };

    return (
        <>
            {bonusList?.length &&
                bonusList?.map((item, index) => {
                    let { productGroups = [] } = item;
                    return (
                        <View style={styles.bonusList} key={index}>
                            {/****************** 标题 ******************/}
                            <RowCenterBetween style={styles.bonusRow}>
                                <Text style={[styles.bonusTitle]}>{item.campaignNativeName || ""}</Text>

                                {(Array.isArray(productGroups) || productGroups.length > 0) &&
                                    GetPromoProductGroupNameMapImg({
                                        productGroup: productGroups.length == 1 ? productGroups[0]?.productGroup : productGroups,
                                    })}
                            </RowCenterBetween>

                            {/****************** 预付红利 ******************/}
                            <RowCenterBetween style={styles.bonusRow}>
                                <Text style={[styles.bonusMoney, { fontSize: 14 }]}>{translate("预付彩金")}</Text>
                                <Text style={styles.bonusMoneyItem}>{getMoneyFormat(item.givenAmount)}</Text>
                            </RowCenterBetween>

                            {/****************** 优惠结束 ******************/}
                            <RowCenterBetween style={styles.bonusRow}>
                                <Text style={styles.bonusMoney}>{translate("优惠结束")}</Text>
                                <Text style={styles.bonusMoney}>
                                    {" "}
                                    {item?.claimEndDateUtc && FormatDate(moment.utc(item.claimEndDateUtc).add(8, "h"))}{" "}
                                    {GetBonusGmt()}
                                </Text>
                            </RowCenterBetween>

                            {/****************** buttons ******************/}
                            <RowCenterBetween style={styles.readyBtnWrap}>
                                {/****************** 查看详情 ******************/}
                                <TouchableOpacity style={{ width: "50%" }} onPress={() => promotionDetails(item)}>
                                    <Text style={styles.readyBtnText}>{translate("查看详情")}</Text>
                                </TouchableOpacity>

                                {/****************** 开始优惠 ******************/}
                                <TouchableOpacity
                                    style={{
                                        width: "50%",
                                        borderLeftColor: Color.lightSilver,
                                        borderLeftWidth: 1,
                                    }}
                                    onPress={() => bonusStart(item)}>
                                    <Text
                                        style={[
                                            styles.readyBtnText,
                                            {
                                                color: Color.theme,
                                                fontWeight: "bold",
                                            },
                                        ]}>
                                        {translate("开始优惠2")}
                                    </Text>
                                </TouchableOpacity>
                            </RowCenterBetween>
                        </View>
                    );
                })}
        </>
    );
}

export default BonusReadyItem;
