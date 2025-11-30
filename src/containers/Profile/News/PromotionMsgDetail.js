import React, { useEffect, useRef, useState } from "react";

import moment from "moment";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { FormatDate, GetPromoProductGroupNameMapImg, LiveChatOpenGlobe, CapitalizeFirstLetter, GetBonusName, GetBonusGmt, GoSmartico, getMoneyFormat } from "$Utils";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import LoadingBone from "$Components/LoadingBone";
const { width, height } = Dimensions.get("window");
import CustomLinkText from "$Components/CustomLinkText";
import { translate } from "$locales/translate";
import { WarningIcon } from "$Components/icons/index.js";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";
import { ImagesUrl } from "@/images/index";
/* bonus status
None = 0,
Pending = 1,
Canceled = 2,
Serving = 3,
WaitingForRelease = 4,
ForceToServed = 5,
Served = 6,
Release = 7,
Expired = 8,
Review = 9,
Process = 10
*/
const PromotionMsgDetail = props => {
    const { allBalance } = props.userInfo || [];
    let { Title, AppTitle, SendOn, IsPostBonus, PlayerBonusId, MemberNotificationCategoryId, Content, BonusGivenType, ExpireDate } = props.detail || {};
    const timeoutRef = useRef(null);
    BonusGivenType = BonusGivenType?.replace(/\s+/g, "").toUpperCase();
    let isShowGmt = GetBonusGmt();

    // state
    const [bonusDetail, setBonusDetail] = useState(null);
    const [bonusMsg, setBonusMsg] = useState("");
    const [countdown, setCountdown] = useState("");
    const [loading, setLoading] = useState(false);

    const parseContent = content => {
        // 將Content依照;切割
        const [campaignNativeTitle, campaignId, bonusGivenAmount, expiredDate, productGroups] = content.split(";");
        const productGroupArray = productGroups?.split(",");

        let productGroup = "";
        if (productGroupArray?.length === 1) {
            productGroup = productGroupArray[0];
        } else if (productGroupArray?.length > 1) {
            productGroup = ""; //productGroups > 1 不顯示
        }

        const parsedContent = {
            campaignNativeTitle,
            campaignId,
            bonusGivenAmount,
            expiredDate,
            productGroup,
        };

        return parsedContent;
    };

    // effects
    useEffect(() => {
        const getBonusDataFromAPI = async () => {
            if (!PlayerBonusId) return;
            // 設置 GMT+8 的時間
            const dateTo = moment().utcOffset(8).format("YYYY-MM-DD");
            const dateFrom = moment().utcOffset(8).subtract(90, "days").format("YYYY-MM-DD");
            try {
                setLoading(true);
                const result = await fetchRequest(`${ApiPort.AppliedHistory}PlayerBonusId=${PlayerBonusId}&dateFrom=${dateFrom} 00:00:00&dateTo=${dateTo} 23:59:59&`, "GET");
                setLoading(false);
                await setBonusDetail(result?.result[0]);
            } catch (err) {
                setBonusDetail({});
                setLoading(false);
            }
        };

        const getBonusDataFromProps = async () => {
            const { campaignNativeTitle, bonusGivenAmount, expiredDate, productGroup } = parseContent(Content) || {};

            setBonusDetail({
                bonusName: campaignNativeTitle,
                productGroup: productGroup,
                bonusGiven: bonusGivenAmount,
                expiredDate: expiredDate,
            });
        };

        if ([5, 6, 7, 8, 999].includes(MemberNotificationCategoryId)) {
            getBonusDataFromAPI();
        } else {
            getBonusDataFromProps();
        }

        showBonusMsg();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [PlayerBonusId, MemberNotificationCategoryId, Content]);

    useEffect(() => {
        if (!bonusDetail) return;
        showBonusMsg();
    }, [bonusDetail]);

    const colors = status => {
        //2已取消", 6 完成", 8已过期"
        const color = status == 8 ? "#f15858" : [5, 6, 7].includes(status) ? "#00a826" : "#F15858";
        return color;
    };

    const goBonusPage = async () => {
        const { status = "" } = bonusDetail || {};

        PiwikEventDataHandle({
            eventTitle: "Notification10",
            customProperties: {
                Message_C_BonusDetailStatus: status,
            },
        });

        try {
            if ([7, 8].includes(MemberNotificationCategoryId)) {
                if (BonusGivenType == "REWARDSPOINT") {
                    GoSmartico();
                } else if (BonusGivenType == "FREESPIN" || BonusGivenType == "FREEBET") {
                    Actions.jump("Promotion");
                    timeoutRef.current = setTimeout(() => {
                        window.goPromotion(1, 3);
                    }, 100);
                } else if (props?.userInfo?.isToggleBalance && IsPostBonus) {
                    Actions.LockedBalance({}); // 跳轉至鎖定金額頁面
                } else {
                    // 已完成之红利
                    Actions.jump("Promotion");
                    timeoutRef.current = setTimeout(() => {
                        window.goPromotion(1, 3);
                    }, 100);
                }
            } else if (MemberNotificationCategoryId == 201) {
                ////// 111111111
                // 待開始之紅利
                Actions.jump("Promotion");
                timeoutRef.current = setTimeout(() => {
                    window.goPromotion(1, 0);
                }, 100);
            } else if (MemberNotificationCategoryId == 202) {
                // 111111111
                await Actions.jump("Promotion"); //跳轉至特別優惠
                timeoutRef.current = setTimeout(() => {
                    window.goPromotion(0, 0);
                }, 100);
                return;
            } else if (MemberNotificationCategoryId == 5 && IsPostBonus && bonusStatusId == 7) {
                // 可領取之红利
                Actions.jump("Promotion");
                timeoutRef.current = setTimeout(() => {
                    window.goPromotion(1, 2);
                }, 100);
            } else if ([5].includes(MemberNotificationCategoryId) && BonusGivenType == "FREEBET") {
                Actions.jump("Promotion");
                timeoutRef.current = setTimeout(() => {
                    window.goPromotion(1, 2);
                }, 100);
            }
            else {
                // 已完成之红利
                Actions.jump("Promotion");
                timeoutRef.current = setTimeout(() => {
                    window.goPromotion(1, 3);
                }, 100);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showBonusMsg = () => {
        switch (MemberNotificationCategoryId) {
            case 7:
                if (BonusGivenType == "REWARDSPOINT") {
                    setBonusMsg(Content);
                } else if (BonusGivenType == "MONEY" && bonusRuleType == "POST") {
                    setBonusMsg(translate("彩金金额需要完成指定流水倍数才可提款，否则将会回收此彩金。"));
                }
                break;
            case 8:
                if (BonusGivenType == "REWARDSPOINT") {
                    setBonusMsg(Content);
                } else if (BonusGivenType == "MONEY" && bonusRuleType == "POST") {
                    setBonusMsg(translate("彩金金额需要完成指定流水倍数才可提款，否则将会回收此彩金。"));
                }
                break;
            case 201:
                setBonusMsg(translate("须在优惠申请结束时间内，点击“开始优惠”进行优惠流水倍数累计，否则此优惠将无效并自动从页面移除"));
                break;
            // case 999:
            //     if (BonusGivenType == 'REWARDSPOINT') {
            //         setBonusMsg(`Chúng tôi thành thật xin lỗi, nhưng điểm thưởng ${bonusGiven} của bạn đã bị hủy. Nếu có bất kỳ câu hỏi nào, `)
            //     } else if (BonusGivenType == 'FREESPIN') {
            //         setBonusMsg(`Chúng tôi thành thật xin lỗi, nhưng phần thưởng ${bonusGiven} vòng quay miễn phí của bạn đã bị hủy. Nếu có bất kỳ câu hỏi nào, `)
            //     }
            //     break;
            default:
                setBonusMsg("");
        }
    };

    // UI
    const { bonusName = "", wallet, bonusGiven = "", status = "", bonusStatusId = "", statusTipsMessage = "", productGroup = "" } = bonusDetail || {};
    let date = moment(SendOn).add(8, "h").format("DD/MM/YYYY HH:mm") + isShowGmt;

    let expiredDate = "";
    if (bonusDetail?.expiredDate) {
        const parsedDate = moment(bonusDetail.expiredDate).utcOffset(8); // 转换为 UTC+8
        if (parsedDate.isValid()) {
            expiredDate = FormatDate(parsedDate);
        }
    }

    const color = bonusStatusId && colors(bonusStatusId); //颜色

    const bonusRuleType = bonusDetail?.bonusRuleType?.toUpperCase() || "";
    if (loading) {
        return (
            <View style={[styles.containerView]}>
                <LoadingBone length={2} width={width - 30} />
            </View>
        );
    }

    return (
        <View style={[styles.containerView]}>
            <View style={[styles.centerContainer]}>
                <View style={styles.viewTitleBox}>
                    <Image style={{ width: 40, height: 40, marginRight: 10 }} source={ImagesUrl.newsMsg6} resizeMode="stretch"></Image>
                    <View style={{ width: "100%" }}>
                        <Text style={[styles.titles, { width: width * 0.75 }]}>{Title}</Text>
                        <Text style={[styles.dates]}>{date}</Text>
                    </View>
                </View>

                {/* body */}
                {
                    (
                        [5, 6, 201].includes(MemberNotificationCategoryId)
                        ||
                        ([7, 8].includes(MemberNotificationCategoryId) && ["FREESPIN", "MONEY", "FREEBET"].includes(BonusGivenType))
                        ||
                        ([999].includes(MemberNotificationCategoryId) && ["MONEY"].includes(BonusGivenType))
                    )
                    &&
                    (
                        <View style={styles.bodyContainer}>
                            <RowCenterBetween>
                                <Text style={[styles.titles, { width: "70%" }]}>{bonusName}</Text>

                                {!!productGroup &&
                                    GetPromoProductGroupNameMapImg({
                                        productGroup,
                                    })}
                            </RowCenterBetween>

                            <RowCenterBetween>
                                <Text style={[styles.bonusMoney, { paddingVertical: 15 }]}>
                                    {
                                        MemberNotificationCategoryId === 201
                                            ?
                                            translate("预付彩金")
                                            :
                                            GetBonusName({ bonusGivenType: BonusGivenType, bonusRuleType: bonusRuleType })
                                    }
                                </Text>
                                <Text style={[styles.bonusMoneyItem, { paddingVertical: 15 }]}>
                                    {
                                        ["REWARDSPOINT", "FREESPIN"].includes(BonusGivenType)
                                            ? getMoneyFormat(bonusGiven || 0, " ") // reward 不是钱， 所以不加钱的标志
                                            : getMoneyFormat(bonusGiven || 0)
                                    }
                                </Text>
                            </RowCenterBetween>

                            {![200, 201].includes(MemberNotificationCategoryId) && (
                                <RowCenterBetween>
                                    <Text
                                        style={[
                                            styles.bonusListMsg,
                                            {
                                                width: window.LANGUAGE === "VN" ? "60%" : "80%",
                                            },
                                        ]}>
                                        {translate("结束时间：")}
                                        {expiredDate ? `${expiredDate} ${isShowGmt}` : translate("无限期")}
                                    </Text>
                                    <RowCenterBetween>
                                        {
                                            statusTipsMessage &&
                                            <WarningIcon
                                                type={"ring"}
                                                fill={color} />
                                        }
                                        <Text style={[styles.bonusListMsg, { color, marginLeft: 5 }]}>{CapitalizeFirstLetter(status)}</Text>
                                    </RowCenterBetween>
                                </RowCenterBetween>
                            )}

                            {/* 优惠结束 */}
                            {MemberNotificationCategoryId === 201 && (
                                <RowCenterBetween>
                                    <Text style={[styles.bonusListMsg, { paddingLeft: 0, fontSize: 10, color: "#999" }]}>{translate("优惠结束(PMA)")}</Text>
                                    <Text style={[styles.bonusListMsg, { textAlign: "right" }]}>
                                        {expiredDate}
                                        {window.LANGUAGE === "VN" ? "\n" : " "}{isShowGmt}
                                    </Text>
                                </RowCenterBetween>
                            )}

                            {statusTipsMessage && bonusRuleType === "PRE" && (
                                <RowCenterStart style={[styles.toolTip, { borderTopColor: "#eaeaea" }]}>
                                    <WarningIcon
                                        type="ring"
                                        fill={Color.gray}
                                        width={15}
                                        height={15}
                                        direction="bottom"
                                        wrapStyle={{ marginRight: 5 }}
                                    />

                                    {(() => {
                                        if (!statusTipsMessage) return null;
                                        const lines = statusTipsMessage.split("\r\n");
                                        const firstLineRaw = lines[0] || "";
                                        const secondLineRaw = lines[1] || "";

                                        const firstLine = firstLineRaw.replace(/(\d+\.\d+)/g, match => {
                                            // 先去除逗號，轉成數字再格式化
                                            const numeric = Number(match.replace(/,/g, ""));
                                            return getMoneyFormat(numeric, "");
                                        });

                                        return (
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={[styles.bonusListMsg]}>{firstLine}</Text>

                                                {Boolean(secondLineRaw) && <Text style={[styles.bonusListMsg]}>{secondLineRaw}</Text>}
                                            </View>
                                        );
                                    })()}
                                </RowCenterStart>
                            )}
                        </View>
                    )}

                {
                    MemberNotificationCategoryId === 202 ? (
                        <>
                            <CustomLinkText
                                wrapStyle={{ marginTop: 16, marginBottom: 0 }}
                                norMaltextStyle={styles.csText}
                                text={translate("非常抱歉，您所申请的 {{X}}", {
                                    X: bonusName,
                                })}
                                themeTextStyle={[styles.csText, { fontWeight: "bold" }]}
                            />
                            <CustomLinkText
                                wrapStyle={{ marginTop: 0, marginBottom: 0 }}
                                norMaltextStyle={styles.csText}
                                onPressList={[() => LiveChatOpenGlobe()]}
                                text={translate("审核未成功，如有任何疑问请联系{在线客服}。")}
                            />
                        </>
                    ) : (
                        [999].includes(MemberNotificationCategoryId) && ["REWARDSPOINT", "FREESPIN", "FREEBET"].includes(BonusGivenType)
                            ? (
                                <CustomLinkText
                                    norMaltextStyle={styles.listLeftTitle}
                                    text={
                                        BonusGivenType == "FREEBET"
                                            ? translate("抱歉，您的 {x} 免费投注已取消，如有任何疑问请联系{在线客服}。", { x: bonusGiven })
                                            : BonusGivenType == "REWARDSPOINT"
                                                ? translate("非常抱歉，您的 {x} 乐币已取消，如有任何疑问请联系{在线客服}。", { x: bonusGiven })
                                                : translate("非常抱歉，您的 {x} 免费旋转奖励已取消，如有任何疑问请联系{在线客服}。", { x: bonusGiven })}
                                    themeTextStyle={[
                                        styles.listLeftTitle,
                                        {
                                            textDecorationLine: "underline",
                                            color: Color.theme,
                                        },
                                    ]}
                                    onPressList={[
                                        () => {
                                            LiveChatOpenGlobe();
                                        },
                                    ]}
                                    wrapStyle={{ marginTop: 0 }}
                                />
                            ) :

                            bonusMsg &&
                            <Text style={[styles.smallFontSize, {
                                marginTop: (
                                    [5, 6, 201].includes(MemberNotificationCategoryId)
                                    ||
                                    ([7, 8].includes(MemberNotificationCategoryId) && ["FREESPIN", "MONEY", "FREEBET"].includes(BonusGivenType))
                                )
                                    ?
                                    0 : 15
                            }]}>{bonusMsg}

                            </Text>
                    )}

                <View
                    style={[
                        styles.bonusListMsgLine,
                        {
                            marginTop: MemberNotificationCategoryId === 202 || bonusMsg ? 16 : 0,
                        },
                    ]}></View>

                {
                    !([999].includes(MemberNotificationCategoryId) && ["REWARDSPOINT", "FREESPIN", "FREEBET"].includes(BonusGivenType))
                    &&
                    <FilledButton
                        textStyle={{ fontWeight: "400" }}
                        text={MemberNotificationCategoryId === 202 ? translate("查看其他优惠") : translate("立即查看")}
                        onPress={() => {
                            goBonusPage();
                        }}
                    />
                }

            </View>
        </View>
    );
};

export default PromotionMsgDetail;

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: Color.lightSilver,
    },
    centerContainer: {
        padding: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: Color.white,
    },
    viewTitleBox: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: Color.lightSilver,
    },
    bodyContainer: {
        borderWidth: 1,
        borderColor: Color.mediumGray,
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 15,
    },

    dates: {
        fontSize: 10,
        paddingTop: 8,
        paddingBottom: 15,
        color: Color.gray,
    },
    titles: {
        fontWeight: "bold",
        fontSize: 14,
        color: Color.charcoal,
        flexWrap: "wrap",
    },
    // bonus categories

    smallFontSize: {
        paddingVertical: 4,
        fontSize: 12,
        lineHeight: 16,
        color: Color.darkGray,
    },
    bonusMoneyItem: {
        fontSize: 18,
        fontFamily: "PingFangTC-Semibold",
        fontWeight: "600",
        color: Color.charcoal,
    },
    bonusMoney: {
        fontSize: 12,
        color: Color.darkGray,
    },
    // bonus status
    bonusListMsg: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkGray,
        flexWrap: "wrap",
    },
    bonusListMsgLine: {
        height: 1,
        backgroundColor: Color.lightSilver,
        marginBottom: 20,
    },
    csText: {
        fontSize: 12,
        paddingLeft: 2,
        color: Color.darkGray,
        flexWrap: "wrap",
    },

    // tool tip
    toolTip: {
        borderTopWidth: 1,
        paddingTop: 15,
        marginTop: 15,
    },

    loadingBone: {
        marginTop: 15,
        height: 150,
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: Color.softGray,
        marginBottom: 10,
    },
    productImage: {
        width: 24,
        height: 24,
        marginLeft: 2,
    },
});
