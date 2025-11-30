import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import moment from "moment/moment";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";
import { ShareIcon } from "$Components/icons/index.js";
import { GetGlobalModal } from "$Utils/globalModal";
import NoRecord from "$Components/NoRecord";
import { LiveChatOpenGlobe } from "$Utils";
import CustomWebView from "$Components/CustomWebView";

const PromotionsDetail = (props) => {
    const { navigation, StrApiDetail = {}, BoffApiDetail = {}, sportSB, callBack, PromotionsItem = { TncBtn: () => null } } = props;
    const modalHtml = StrApiDetail?.body || "";
    const webViewRef = useRef(null);

    useEffect(() => {
        (window.LANGUAGE == "VN" || (sportSB && window.LANGUAGE == "CN")) &&
            navigation.setParams({
                rightButton: () => {
                    return (
                        modalHtml && (
                            <ShareIcon
                                fill={Color.white}
                                onPress={() => {
                                    ///let dateRange = StrApiDetail?.dateRange || "";
                                    //let dateRangeArr = dateRange.split("-").map(v => v.trim());
                                    // let startDate = new Date(dateRangeArr[0] + " " + dateRangeArr[1]).getTime();
                                    // let endDate = new Date(dateRangeArr[2] + " " + dateRangeArr[3]).getTime();
                                    let { startDate, endDate } = BoffApiDetail;
                                    // 格式化日期時間文本
                                    const formatDateText = () => {
                                        const startDateStr = window.LANGUAGE == "VN"
                                            ? moment(startDate).format("HH:mm bb DD/MM/YYYY").replace(/bb/, "ngày")
                                            : moment(startDate).format("YYYY年MM月DD日 HH:mm");
                                        const endDateStr = window.LANGUAGE == "VN"
                                            ? moment(endDate).format("HH:mm bb DD/MM/YYYY").replace(/bb/, "ngày")
                                            : moment(endDate).format("YYYY年MM月DD日 HH:mm");
                                        return `${translate("活动时间（北京时间）")}\n${translate("从1")}${startDateStr}${translate("至1")}${endDateStr}`;
                                    };
                                    GetGlobalModal({
                                        modalData: {
                                            fromPage: "PromotionsDetailPage",
                                            title: StrApiDetail?.promoTitle,
                                            text: formatDateText(),
                                            imageUrl: StrApiDetail?.image,
                                            copyUrl: window.SBTDomain + `/${window.LANGUAGE?.toLocaleLowerCase()}/mobile/sbtwo` + `/share/?deeplink=promo&pid=${StrApiDetail?.promoId}`
                                        },
                                        allowMask: true,
                                        name: "ShareModal",
                                        wrapStyle: { width: "100%" },
                                        position: "bottom",
                                    });

                                    PiwikEventDataHandle("PromotionDetail7");
                                }}
                                wrapStyle={{ marginRight: 8 }}
                            />
                        )
                    );
                },
            });
    }, []);

    const onError = () => {
        webViewRef.current?.reload();
    };

    let { promotionType = "" } = BoffApiDetail;
    return (
        <View style={styles.viewContainer}>
            {Boolean(modalHtml) ? (
                <CustomWebView
                    ref={webViewRef}
                    onError={onError}
                    source={{
                        html: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" + modalHtml,
                        headers: {
                            Authorization: window.ApiPort.Token ? window.ApiPort.Token : "",
                            "Content-Type": "application/json charset=utf-8",
                            Culture: window.DefaultConfig?.Culture,
                            Accept: "application/json",
                        },
                    }}
                    scalesPageToFit={Platform.OS === "ios" ? false : true}
                    originWhitelist={["*"]}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    webViewStyle={styles.webViewStyle}
                    decelerationRate={0.985}
                    bounces={true}
                    overScrollMode="always"
                    showsVerticalScrollIndicator={true}
                    contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
                />
            ) : (
                <NoRecord>
                    <CustomLinkText
                        onPressList={[
                            () => {
                                LiveChatOpenGlobe();
                                PiwikEventDataHandle("BonusHistory7");
                            },
                        ]}
                        themeTextStyle={{ fontSize: 16 }}
                        norMaltextStyle={styles.noRecordText}
                        text={translate("目前没有详情，请联系{在线客服}")}
                    />
                </NoRecord>
            )}

            {/* ---------END--------- */}

            {Boolean(modalHtml) && (
                <View style={[styles.activeBtn]}>
                    {Boolean(PromotionsItem?.TncBtn) && (
                        <PromotionsItem.TncBtn promotionType={promotionType} BoffApiDetail={BoffApiDetail} StrApiDetail={StrApiDetail} callBack={callBack} />
                    )}
                    {/* <Text>{promotionType}={displayStatus}</Text> */}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
    },
    activeBtn: {
        padding: 15,
        backgroundColor: Color.white,
    },
    webViewStyle: {
        flex: 1,
        backgroundColor: Color.transparent,
        borderWidth: 0,
    },
    noRecordText: {
        color: Color.gray,
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
    },
});

export default PromotionsDetail;
