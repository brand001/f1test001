import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { useDispatch, useSelector } from "react-redux";

import { ImagesUrl } from "@/images/index";
import Color from "$Components/Color";
import DropDownSelect from "$Components/DropDownSelect";
import { ArrowIcon } from "$Components/icons/index.js";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { LiveChatOpenGlobe, OpenVIPCS } from "$Utils";
import { ColumnCenterCenter, ColumnStartAround, RowCenterBetween, RowCenterStart } from "./CustomView";

const LiveChat = props => {
    const {
        wrapStyle = {},
        imgStyle = {},
        callBack = () => {},
        children = "",
        csp = true,
        showVip = false
    } = props;

    const dispatch = useDispatch();

    const ServiceType = [
        {
            text: translate("VIP 客户经理"),
            img1: ImagesUrl.AmityChatIcon1,
            fillColor: Color.theme,
            desc: translate("每日12:00 - 02:00"),
            callBack: () => {
                GetAmityToken();
            },
        },
        {
            text: translate("客服与帮助中心"),
            img1: ImagesUrl.CS,
            fillColor: Color.gray,
            desc: translate("全天24小时"),
            callBack: () => {
                LiveChatOpenGlobe({
                    csp: true,
                });
            },
        },
    ];

    const reduxState = useSelector(state => state);
    const { userInfo = {} } = reduxState;
    const { memberInfo = {}, memberNewInfo = {} } = userInfo;
    const isVip = (ApiPort.UserLogin && (memberNewInfo?.isVIP || memberInfo?.isVIP || false) && window.LANGUAGE == "CN");
    const isAmity = (ApiPort.UserLogin && memberInfo?.amityType != 0 && memberInfo?.amityType != undefined && window.LANGUAGE == "CN");
    const [showAmitySelect, setShowAmitySelect] = useState(false);

    const onPress = () => {
        dispatch(actions.ACTION_RouterName(Math.random()));

        if (isAmity) {
            setShowAmitySelect(true);
        } else {
            let listingParams = callBack();
            LiveChatOpenGlobe({ csp, listingParams: typeof listingParams === "string" ? listingParams : "" });
        }

    };

    const GetAmityToken = () => {
        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(ApiPort.GetAmityToken, "GET")
            .then(data => {
                Toasts.removeAll();
                if (data?.isSuccess) {
                    let amityToken = data?.result?.replace(/"/g, "");
                    amityToken &&
                        Actions.AmityChat({
                            amityToken,
                        });
                } else {
                    Toasts.fail(translate("网络错误，请稍后重试"), 2);
                }
            })
            .catch(error => {
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请稍后重试"), 2);
            });
    };

    const serviceAction = i => {
        setShowAmitySelect(false);

        ServiceType[i]?.callBack();
    };

    return (
        <RowCenterStart>
            {
                // 充值和提款也有
                showVip && isVip &&
                <Touch
                    onPress={() => {
                        OpenVIPCS();
                        dispatch(actions.ACTION_RouterName(Math.random()));
                    }}
                    style={{ marginRight: 8 }}>
                    <Image resizeMode="stretch" source={ImagesUrl.vipCsCallbank} style={{ width: 28, height: 28 }} />
                </Touch>

            }

            <Touch style={wrapStyle} onPress={onPress}>
                <Image source={isAmity ? ImagesUrl.amity : ImagesUrl.CS} resizeMode="stretch" style={{ width: 28, height: 28, ...imgStyle }} />
                {children}
            </Touch>

            <DropDownSelect
                title={translate("选择服务")}
                modalVisible={showAmitySelect}
                closeModal={() => {
                    setShowAmitySelect(false);
                }}>
                <View>
                    {ServiceType.map((v, i) => {
                        return (
                            <RowCenterBetween
                                key={i}
                                style={[styles.serviceTypeList]}
                                onPress={() => {
                                    serviceAction(i);
                                }}>
                                {i == 0 && (
                                    <LinearGradient style={styles.serviceTypeListVip} colors={["#BF8E2D", "#DAA61F", "#FFC90A"]}>
                                        <Text style={styles.serviceTypeListVipText}>VIP</Text>
                                    </LinearGradient>
                                )}
                                <RowCenterStart>
                                    <Image source={v.img1} resizeMode="stretch" style={[styles.serviceTypeListImg, styles[`serviceTypeListImg${i}`]]}></Image>

                                    <ColumnStartAround
                                        style={{
                                            height: 40,
                                        }}>
                                        <Text style={styles.serviceTypeListText}>{v.text}</Text>
                                        <Text
                                            style={{
                                                color: "#999999",
                                                fontSize: 12,
                                                fontWeight: "400",
                                            }}>
                                            {v.desc}
                                        </Text>
                                    </ColumnStartAround>
                                </RowCenterStart>

                                <RowCenterStart>
                                    {i == 0 && <Text style={styles.serviceTypeListCheckText}>{translate("查看")}</Text>}

                                    <ArrowIcon fill={v.fillColor} width={15} height={15} direction={"right"} wrapStyle={{ marginLeft: 5 }} />
                                </RowCenterStart>
                            </RowCenterBetween>
                        );
                    })}
                </View>
            </DropDownSelect>
        </RowCenterStart>
    );
};

export default LiveChat;

const styles = StyleSheet.create({
    serviceTypeList: {
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#FFFFFF",
        position: "relative",
    },
    serviceTypeListText: {
        color: "#666666",
        fontSize: 14,
        fontWeight: "600",
    },
    serviceTypeListImg: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    serviceTypeListVipText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "400",
    },
    serviceTypeListVip: {
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 9,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 1,
        paddingHorizontal: 10,
    },
    serviceTypeListCheckText: {
        color: "#00A6FF",
        fontSize: 14,
        fontWeight: "400",
    },
});
