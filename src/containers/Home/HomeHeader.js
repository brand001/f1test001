import React, { useEffect, useState, useContext } from "react";
import { Dimensions, Image, StyleSheet, Text, View, Animated, Platform } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useSelector, useDispatch } from "react-redux";
import actions from "@/lib/redux/actions";
import CustomTooltip from "$Components/CustomTooltip";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { FianceLists, ProfileIconMap } from "@/containers/Profile/data";
import { ImagesUrl } from "@/images/index";
import { translate } from "@/locales/translate";
import CarouselBanner from "$Components/CarouselBanner";
import Color from "$Components/Color";
import CustomCarousel from "$Components/CustomCarousel";
import { CheckLogin } from "$Utils";
import StorageUtil from "$Utils/Storage";
import GamePageNavRight from "$Components/Nav/GameNav/GamePageNavRight";
import { ColumnCenterCenter, RowCenterCenter, RowCenterBetween, ColumnCenterStart, RowCenterEnd } from "$Components/CustomView";
import { Toasts } from "$Toasts";
import { LogoIcon, BellIcon } from "$Components/icons/index";

import { actions_fetchDepositStepTwoInProgressDetails, Actions_setCentralPaymentStatus } from "$LIB/redux/actions/CentralPaymentAction";

const { width } = Dimensions.get("window");

export default function HomeHeader(props) {
    const dispatch = useDispatch();
    const balanceTotal = useSelector(state => state.userInfo.balanceTotal);


    const [mainBanner, setBanner] = useState([]);
    const [news, setNews] = useState([]);
    let [featureBanner, setFeatureBanner] = useState("");

    // 新增：动画值
    const fadeAnim = useState(new Animated.Value(1))[0];
    const slideAnim = useState(new Animated.Value(0))[0];

    // 处理隐藏/显示动画
    useEffect(() => {
        if (props.hideHomeHeader) {
            // 隐藏动画 - 使用更平滑的缓动
            try {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: -80,
                        duration: 250,
                        useNativeDriver: true,
                    })
                ]).start();
            } catch (error) {
                console.warn("Hide animation failed:", error);
            }
        } else {
            // 显示动画 - 使用弹性缓动效果
            try {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start();
            } catch (error) {
                console.warn("Show animation failed:", error);
            }
        }
    }, [props.hideHomeHeader]);

    useEffect(() => {
        if (!ApiPort.UserLogin || window.LANGUAGE === "CN") return;
        dispatch(actions_fetchDepositStepTwoInProgressDetails());
    }, [ApiPort.UserLogin, actions_fetchDepositStepTwoInProgressDetails,]);

    useEffect(() => {
        const fetchCMS_CentralPaymentStatus = async () => {
            try {
                const res = await fetchRequestCMS(`${Strapi_Domain + ApiPort.centralPaymentActive}`, "GET");
                if (!res?.isSuccess) throw new Error("getCMS_MainSiteConfig failed");
                dispatch(Actions_setCentralPaymentStatus(res));
            } catch (err) {
                // 建議明確傳遞 false 或 null，避免 undefined
                dispatch(Actions_setCentralPaymentStatus(null));
            }
        };

        fetchCMS_CentralPaymentStatus();
    }, [dispatch, ApiPort.UserLogin,]);

    useEffect(() => {
        const getMainBanner = async () => {
            const login = ApiPort.UserLogin ? "after" : "before";
            let val = await StorageUtil.load("getHomeBanner") || [];
            setBanner(val);
            let data = (await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_Banner}?login=${login}&displaying_webp`, "GET")) || [];
            if (!(Array.isArray(data) && data.length)) return;
            setBanner(data);
            StorageUtil.save({
                key: "getHomeBanner",
                data: data,
            });
        };

        const getNews = async () => {
            let data = await fetchRequest(ApiPort.GetAnnouncements + "messageTypeOptionID=10&pageSize=8&pageIndex=1&", "GET");

            let { isSuccess = false, result = {} } = data;
            let { announcementsByMember = [] } = result;
            if (isSuccess && Array.isArray(announcementsByMember) && announcementsByMember.length) {
                let news = announcementsByMember.filter(v => v.isRunningText);
                setNews(news);
            }
        };

        const getFeatureBanner = async () => {
            const login = ApiPort.UserLogin ? "after" : "before";
            let val = await StorageUtil.load("getBannerFeature") || [];
            setFeatureBanner(val);

            let data = (await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_BannerFeature}?login=${login}&displaying_webp`, "GET")) || [];
            if (!(Array.isArray(data) && data.length)) return;
            setFeatureBanner(data);
            StorageUtil.save({
                key: "getBannerFeature",
                data: data,
            });
        };

        getMainBanner();
        getNews();
        getFeatureBanner();
    }, []);

    function getDetail(data) {
        if (CheckLogin()) return;

        if (parseInt(data?.messageID) == 0 || parseInt(data?.messageId) == 0) {
            Actions.NewsDetail({ data: data });
            return;
            //[個人]有可能包含帳戶信息(MessageID===0)，但是會沒有detail可查，直接使用當前數據展示
        }

        let fetchurl = ApiPort.GetAnnouncementDetail + "?AnnouncementID=" + data.announcementID + "&";
        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(fetchurl, "GET").then(data => {
            Toasts.removeAll();
            let { isSuccess = false, result = {} } = data;
            let { announcementResponse = {} } = result;
            if (isSuccess && Object.keys(announcementResponse).length) {
                Actions.NewsDetail({ data: announcementResponse, });
            }
        });
    }

    function renderBellItem({ item, i }) {
        return (
            <Text key={i}
                onPress={() => {
                    getDetail(item.item);
                }}
                style={styles.bellIText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.item?.topic}
            </Text>
        );
    }


    let isHaveNews = Array.isArray(news) && news.length > 0;

    const smarticoStateActive = useSelector((state) => state?.userSetting?.cmsMainsiteStatus?.smarticoIsActive);
    if (Array.isArray(featureBanner) && featureBanner.length > 0) {
        featureBanner = !!smarticoStateActive
            ? featureBanner
            : featureBanner?.filter((item) => !(item?.action?.url?.toLocaleLowerCase?.()?.includes?.("/rewards-centre")));
    }

    const spaceHeight = isHaveNews ? DeviceInfoIos ? 18 : 16 : DeviceInfoIos ? 22 : 16;
    const wrapperBodyMarginBottom = isDynamicIslandIOS ? 15 : (DeviceInfoIos ? 5 : 10);
    const loginBoxHeight = 60;

    const NavRightEl = <GamePageNavRight
        type="money"
        categoryCode="ALL"
        showCs={true}
        showRefresh={false}
        wrapStyle={{ marginRight: 0 }}
        loginCallBack={() => {
            PiwikEventDataHandle("HomePage8");
        }}
        registCallBack={() => {
            PiwikEventDataHandle("HomePage9");
        }}
        depositCallBack={() => {
            Actions.DepositCenter();
            PiwikEventDataHandle("HomePage10");
        }}
        amount={balanceTotal}
    />;



    return (
        <Animated.View
            style={{
                width: "100%",
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}
            onLayout={props.onLayout}>
            {/* HeaderTop moved to Home/index.js outside CustomScrollView */}

            {/* 公告 https://arcadie.atlassian.net/issues/FP5-1711 */}
            {isHaveNews ? (
                <RowCenterCenter style={styles.newsBox}>
                    <BellIcon></BellIcon>
                    <Carousel
                        data={news}
                        autoplay={true}
                        loop={true}
                        sliderWidth={width}
                        itemWidth={width}
                        autoplayDelay={500}
                        autoplayInterval={4000}
                        renderItem={(item, i) => {
                            return renderBellItem({ item, i });
                        }}
                    />
                </RowCenterCenter>
            ) : (
                <View style={{ height: 26 }}></View>
            )}

            <View style={styles.headerBG3}>
                <Image
                    resizeMode="contain"
                    style={{
                        width: width,
                        height: width * 0.75,
                    }}
                    source={ImagesUrl.headerBG3}
                />


            </View>


            {/** Main Banner **/}
            <CarouselBanner
                bannerData={mainBanner}
                onBannerClickProp={({ item, index }) => {
                    PiwikEventDataHandle({
                        eventTitle: "HomePage1",
                        customProperties: {
                            "Home_C_Banner_Title": item.title || "", // 修正 key 格式
                            "Home_C_Banner_Position": index, // 修正 key 格式
                        },
                    });
                }}
                bannerWidth={width - 60}
                bannerHeight={0.498 * (width - 60)}
                carouselItemWidth={width - 60}
            />

            <View style={[styles.wrapperBody, {
                marginTop: spaceHeight,
                // marginBottom: wrapperBodyMarginBottom,
            }]}>

                <CustomCarousel
                    bannerData={featureBanner}
                    borderRadius={99999}
                    onBannerClickProp={({ item, index }) => {
                        PiwikEventDataHandle({
                            eventTitle: "HomePage5",
                            customProperties: {
                                "Home_C_FeatureBanner_ActivityName": item?.title || "", // 修正 key 格式
                            },
                        });
                    }}
                    showPagination={false}
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    headerWrap: {
        height: 40,
        width: "100%",
        paddingHorizontal: 15,
    },
    newsBox: {
        height: 40,
        width: width,
        paddingHorizontal: 15,
        marginBottom: 5
    },
    bellIText: {
        width: width - 30 - 20,
        color: Color.white,
        paddingLeft: 6,
        fontSize: 12,
        fontWeight: "500"
    },
    headerBG3: {
        position: "absolute",
        zIndex: -1,
        top: -width * 0.25,
        left: 0,
        right: 0,
    },

    //
    wrapperBody: {
        paddingHorizontal: 15,
    },
    siginInText: {
        color: Color.charcoal,
        fontSize: 12,
        marginTop: 6,
    },
    iconBtn0: {
        marginRight: 14,
    },
    greetingText: {
        fontSize: 12,
        color: "#666666",
        marginVertical: 2,
        fontWeight: "400",
    },
    greetingText1: {
        color: Color.theme,
        fontWeight: "600",
        fontSize: 16,
    },
    loginRegistbuttonStyle: {
        height: 40,
    },

    redDot: { width: 8, height: 8, backgroundColor: "#FF2424", borderRadius: 4, position: "absolute", top: 0, right: 2 },
});