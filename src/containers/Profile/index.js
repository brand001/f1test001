import React from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { Toasts } from "$Toasts";

import TestFunctions from "../TestFunctions";
import SmarticoBanner from "./SmarticoBanner/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import Color from "$Components/Color";
import { RowCenterCenter, RowCenterBetween, RowCenterStart, ColumnStartCenter, ColumnCenterStart } from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
import { ArrowIcon, UserGuestIcon, UserLoginIcon } from "$Components/icons/index.js";
import LevelBadge from "$Components/LevelBadge";
import LiveChat from "$Components/LiveChat";
import { GetGlobalModal } from "$Utils/globalModal";
import CustomCarousel from "$Components/CustomCarousel";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { CheckLogin, GoSmartico, LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { MangerListsBottomArr, MangerListsTopArr, FilterList, LevelConfig, ProfileIconMap } from "./data";
import WalletInfo from "./WalletInfo";
import CustomScrollView from "$Components/CustomScrollView";


// Constants for banner priorities
const BANNER_PRIORITIES = {
    BBU: 1,
    Bullstreets: 2,
    default: 3
};



const filterBannerByPage = (name, page) =>
    name.split("-")[1]?.toLowerCase() === page.toLowerCase();

const sortBanners = (banners) => {
    return banners.sort((a, b) =>
        (BANNER_PRIORITIES[a.title] || BANNER_PRIORITIES.default) -
        (BANNER_PRIORITIES[b.title] || BANNER_PRIORITIES.default)
    );
};

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            faceLogin: false,
            QueleaActiveCampaign: "", //推薦好友
            unreadTotalCount: 0,
            scrollViewKey: 0,
            bannerData: "",
            recommendFlag: false,
            userName: this.props.userInfo?.userName
        };
        this.transaction = null;
    }

    // 查找匹配的会员等级配置
    findMemberLevel(levelName) {
        if (!levelName) return null;

        // 直接匹配
        if (LevelConfig[levelName]) {
            return LevelConfig[levelName];
        }

        // 遍历所有LevelConfig的键，检查每个配置的name属性
        for (const configKey in LevelConfig) {
            try {
                const config = LevelConfig[configKey];
                if (config && config.name === levelName) {
                    return config;
                }
            } catch (error) {
                // 跳过无效的配置
                continue;
            }
        }

        // 如果还没找到，尝试反向查找
        const levelKeys = ["白银会员", "黄金会员", "铂金会员", "星光会员", "银钻会员", "金钻会员", "星钻会员"];

        for (const key of levelKeys) {
            const translatedKey = translate(key);
            if (translatedKey === levelName) {
                // 尝试获取配置
                return LevelConfig[translatedKey] || null;
            }
        }

        return null;
    }

    async componentDidMount() {
        //获取推荐好友彩金详情和开始时间
        this.getQueleaActiveCampaign();
        if (window.ApiPort.UserLogin) {
            this.loadBanners();
            this.props.userInfo_getBalance(true);
            this.props.userInfo_updateMemberInfo({});
            this.getMessageCount();
            GetGlobalModal({
                name: "OneWalletTipModal",
                modalData: {
                    page: "Profile",
                    isToggleBalance: this.props?.userInfo?.isToggleBalance,
                },
                wrapStyle: { width: "100%" },
            });

            Platform.OS == "ios" && this.getFastLogin();
        }



        this.transaction && this.transaction.finish && this.transaction.finish();
    }

    /**
     * 進入推薦好友條件判斷
     */
    goRecommend = async () => {
        //未登录进入活动页面
        const activeCampaign = this.state.QueleaActiveCampaign;
        if (activeCampaign) {
            if (!activeCampaign?.isSuccess) {
                this.notStartReferralPopup();
                return;
            }
            const errorCode = activeCampaign?.errors?.[0]?.errorCode;
            if (errorCode === "VAL14001") {
                this.notStartReferralPopup();
                return;
            }

            if (!ApiPort.UserLogin) {
                Actions.Recommend();
                return;
            } else {
                this.getQueleaReferrerInfo();
            }
        }

    };

    /**
     * 獲取推薦好友彩金詳情和開始時間
     */
    getQueleaActiveCampaign = () => {
        fetchRequest(ApiPort.QueleaActiveCampaign, "GET").then(res => {
            Toasts.removeAll();
            this.setState({ QueleaActiveCampaign: res });
            if (res.isSuccess) {
                StorageUtil.save({
                    key: "QueleaActiveCampaign",
                    data: res
                });
            }
        }).catch((res) => {
            this.setState({ QueleaActiveCampaign: res });
            Toasts.removeAll();
        });
    };

    // 推薦好友未開啟彈窗
    notStartReferralPopup = () => {
        GetGlobalModal({
            title: translate("推荐好友功能未激活"),
            iconName: "warning",
            message: translate("当 FUN88 推荐朋友计划启动时，推荐您的朋友并获得奖励"),
            confirmText: translate("我知道了好友"),
            onConfirm: () => {},
        });
    };

    changeRecommendFlag(recommendFlag) {
        this.setState({
            recommendFlag
        });
    }

    //获取推荐人的信息
    getQueleaReferrerInfo() {
        Toasts.loading(translate("加载中,请稍候..."), 3);
        fetchRequest(ApiPort.QueleaReferrerInfo, "GET")
            .then(res => {
                Toasts.removeAll();
                let { recommendFlag = false } = this.state;
                let { isSuccess = false, result = {} } = res;
                let { queleaUrl = "" } = result;
                if ((queleaUrl || recommendFlag) && isSuccess) {
                    //进入进度页面
                    Actions.RecommendPage({
                        QueleaReferrerInfo: result || null,
                    });
                } else {
                    //进入活动页面
                    Actions.Recommend({
                        callBack: (flag) => {
                            this.changeRecommendFlag(flag);
                        }
                    });
                }
            })
            .catch(() => {
                Toasts.removeAll();
            });
    }

    getFastLogin = async () => {
        //ios获取快速登录方式
        let userName = this.props?.userInfo?.userName;
        let fastLoginKey = "fastLogin" + userName.toLowerCase();
        const data = await StorageUtil.load(fastLoginKey);
        if (data) {
            this.setState({ faceLogin: true });
        }
    };

    setFastLogin = () => {
        let { userName, faceLogin } = this.state;
        if (faceLogin) {
            //关闭脸部识别
            Alert.alert(
                translate("提醒你"),
                `${DeviceInfoIos ? translate("设定成功，下次登入即可使用脸部辨识认证") : translate("设定成功，下次登入即可使用指纹辨识认证")}`,
                [
                    {
                        text: translate("确认3"),
                    },
                ],
            );
            return;
        }

        if (Platform.OS == "ios") {
            //直接去指纹脸部识别设置
            Actions.LoginTouch({
                userName: userName.toLowerCase(),
                fastChange: true,
                changeBack: () => {
                    this.setState({ faceLogin: true });
                },
            });
        } else {
            //去设定界面
            Actions.SetLogin({ userName: userName.toLowerCase() });
        }
    };

    // 未讀訊息統計
    getMessageCount = async () => {
        let res = await fetchRequest(ApiPort.UnreadMessage + "key=All&", "GET");
        let { isSuccess = false, result = {} } = res;
        if (!isSuccess) return;
        let { unreadTransactionByType = {}, unreadAnnouncementCount = 0, unreadNewsCount = 0, unreadPersonalMessageCount = 0, } = result;
        let { deposit = 0, transfer = 0, withdrawal = 0, bonus = 0, } = unreadTransactionByType;
        let unreadTotalCount = deposit + transfer + withdrawal + bonus + unreadAnnouncementCount + unreadPersonalMessageCount + unreadNewsCount;
        this.setState({
            unreadTotalCount: unreadTotalCount,
        });
    };

    rendermMangerLists({ v, i, length }) {
        let { text, needLogin, img, callBack, show = true, otherText = "", renderRight = () => null } = v;
        let flag = i === length - 1;
        let Icon = ProfileIconMap[img];
        return show && <RowCenterBetween
            key={i}
            style={[
                styles.managerListsTouch,
                {
                    borderBottomWidth: flag ? 0 : 1,
                },
            ]}
            onPress={() => {
                if (needLogin && CheckLogin()) return;
                callBack({
                    goRecommend: this.goRecommend,
                    getMessageCount: this.getMessageCount,
                    setFastLogin: this.setFastLogin,
                });
            }}>
            <RowCenterCenter>
                {Icon && <Icon />}
                <Text style={{ color: "#666", fontSize: 14, fontWeight: "400", marginLeft: 12 }}>
                    {translate(text)}

                    {otherText}
                </Text>
            </RowCenterCenter>
            <RowCenterCenter>
                {
                    renderRight({ faceLogin: this.state.faceLogin })
                }
                <ArrowIcon fill={Color.gray} width={12} height={12} direction="right" />
            </RowCenterCenter>
        </RowCenterBetween>;
    }

    loadProfileBanner = async () => {
        try {
            const strapiData = await fetchRequestCMS(
                `${Strapi_Domain + ApiPort.CMS_BannerProfile}`,
                "GET"
            );
            return strapiData;
        } catch (error) {
            return [];
        }
    };

    loadExternalPromotionBanners = async () => {
        const { ExternalPromotions } = window.ApiPort;

        try {
            const [bannersData, bbuLinkData, bullstreetLinkData] = await Promise.all([
                fetchRequestCMS(`${Strapi_Domain + ExternalPromotions}${Platform.OS}`, "GET"),
                fetchRequest(`${ApiPort.ExternalPromotionLinkApi}?promotionName=BBU&`, "GET"),
                fetchRequest(`${ApiPort.ExternalPromotionLinkApi}?promotionName=Bullstreet&`, "GET"),
            ]);

            const promotionItems = bannersData?.result?.promotionItems || [];

            const processedBanners = promotionItems
                .filter(item => filterBannerByPage(item.name, "profile"))
                .map(item => {
                    const title = item.name?.split("-")[0] || "";
                    const banner = {
                        cmsImageUrl: item.imagePath,
                        title,
                        isBFFSC: true,
                        action: {
                            actionId: 28,
                            actionName: "Link To",
                            url: ""
                        }
                    };

                    if (title === "BBU") {
                        banner.action.url = bbuLinkData?.result;
                    } else if (title === "Bullstreets") {
                        banner.action.url = bullstreetLinkData?.result;
                    }

                    return banner;
                });

            return sortBanners(processedBanners);
        } catch (error) {
            return [];
        }
    };

    loadBanners = async () => {
        try {
            const [strapiBanners, bffscBanners] = await Promise.all([
                this.loadProfileBanner(),
                window.LANGUAGE == "CN" ? this.loadExternalPromotionBanners() : Promise.resolve([])
            ]);

            const combinedBanners = [...(bffscBanners || []), ...(strapiBanners || [])];
            this.setState({ bannerData: combinedBanners });
        } catch (error) {
            // Silent fail
        }
    };


    render() {
        const { unreadTotalCount, scrollViewKey, bannerData, userName } = this.state;
        const { useCentralPayment, depositStepTwoDetails } = this.props.centralPayment;
        let memberLevel = null;

        if (ApiPort.UserLogin) {
            const { levelName = "" } = this.props.userInfo.memberNewInfo;
            // 查找匹配的会员等级配置
            memberLevel = this.findMemberLevel(levelName);
        }



        const HeaderHeight = ApiPort.UserLogin ? 45 : 40;

        return (
            <View style={styles.viewContainer}>
                <CustomScrollView
                    getScrollHeight={({ offsetY }) => {
                        this.setState({
                            scrollViewKey: offsetY
                        });
                    }}
                    onRefresh={() => {
                        this.componentDidMount();
                    }}
                >
                    <RowCenterBetween
                        style={[
                            styles.profileTopWrap,
                            {
                                paddingBottom: HeaderHeight + 16 + 16,
                            },
                        ]}>

                        <RowCenterCenter>
                            <RowCenterCenter style={styles.profileTopIconBox}>
                                {
                                    ApiPort.UserLogin
                                        ?
                                        <UserLoginIcon />
                                        :
                                        <UserGuestIcon />
                                }
                            </RowCenterCenter>
                            {
                                ApiPort.UserLogin ? (
                                    <ColumnCenterStart
                                        style={{
                                            height: HeaderHeight,
                                        }}
                                    >
                                        <Text style={styles.userNameText}>{userName || userNameDB}</Text>
                                        {
                                            memberLevel &&
                                            <LevelBadge levelName={memberLevel?.name} colors={memberLevel?.colors} Icon={memberLevel?.Icon} />
                                        }
                                    </ColumnCenterStart>
                                )
                                    : (
                                        <ColumnCenterStart
                                            style={{
                                                height: HeaderHeight
                                            }}
                                            onPress={() => {
                                                CheckLogin({ showInfor: false });
                                            }}>
                                            <RowCenterStart>
                                                <Text style={styles.userNameText}>{translate("登录/注册")}</Text>

                                                <ArrowIcon fill={Color.white} width={15} height={15} direction="right" />
                                            </RowCenterStart>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "400",
                                                    color: Color.white,
                                                    marginTop: 2,
                                                }}>
                                                {translate("登录后可体验更多服务")}
                                            </Text>
                                        </ColumnCenterStart>
                                    )}
                        </RowCenterCenter>

                        <LiveChat
                            callBack={() => {
                                PiwikEventDataHandle("MemberCenter12");
                            }}
                            showVip={true}
                        />
                    </RowCenterBetween>

                    <View style={[
                        styles.profileBoxWrap, {
                            transform: [
                                {
                                    translateY: -16,
                                },
                            ],
                        }]}>
                        <View style={{
                            transform: [
                                {
                                    translateY: -HeaderHeight,
                                },
                            ],
                        }}>
                            {
                                ApiPort.UserLogin &&
                                <WalletInfo
                                    balance={this.props.userInfo.balanceTotal}
                                    scrollViewKey={scrollViewKey}
                                />
                            }


                            {ApiPort.UserLogin &&
                                <CustomCarousel
                                    bannerData={bannerData}
                                    borderRadius={12}
                                    onBannerClickProp={({ item }) => {
                                        let { title = "", isBFFSC = false } = item;
                                        if (isBFFSC) {
                                            PiwikEventDataHandle({
                                                category: "Member Center",
                                                action: `Click Banner (${title})`,
                                                name: `MemberCenter_C_${title}Banner`,
                                                path: "member_center",
                                                title: "Member Center",
                                            });
                                        } else {
                                            PiwikEventDataHandle({
                                                category: "Member Center",
                                                action: "Click Banner",
                                                name: "MemberCenter_C_Banner",
                                                path: "member_center",
                                                title: "Member Center",
                                                customProperties: {
                                                    ["MemberCenter_C_Banner_ActivityName"]: item.title || "",
                                                },
                                            });
                                        }
                                    }}
                                    showPagination={true}
                                    wrapStyle={{ marginBottom: bannerData.length > 1 ? 20 : 10 }}
                                />
                            }

                            {
                                Boolean(this.props.userSetting?.cmsMainsiteStatus?.smarticoIsActive) &&
                                <SmarticoBanner
                                    handleBannerClick={() => {
                                        PiwikEventDataHandle("MemberCenter24");
                                        GoSmartico({
                                            isLoginCallBack: true,
                                        });
                                    }}
                                />
                            }

                            <View
                                style={[
                                    styles.mangerListsTop,
                                    Boolean(this.props.userSetting?.cmsMainsiteStatus?.smarticoIsActive)
                                        ? {
                                            borderBottomLeftRadius: 8,
                                            borderBottomRightRadius: 8,
                                        }
                                        : { borderRadius: 8 },
                                ]}>
                                {MangerListsTopArr.map((v, i) => {
                                    let { text, needLogin, img, callBack, key = "", renderRight = () => null } = v;
                                    let Icon = ProfileIconMap[img];
                                    let data = {
                                        news: {
                                            unreadTotalCount
                                        }
                                    };
                                    return (
                                        <ColumnStartCenter
                                            onPress={() => {
                                                if (needLogin && CheckLogin()) return;
                                                callBack({
                                                    goRecommend: this.goRecommend,
                                                    getMessageCount: this.getMessageCount,
                                                    setFastLogin: this.setFastLogin,
                                                    from: "profile",
                                                });
                                            }}
                                            key={i}
                                            style={styles.listItem}>
                                            {Icon && <Icon wrapStyle={styles.iconBtnImg} />}
                                            <Text style={[styles.iconText, i < 4 ? { marginBottom: 15 } : {}]}>{translate(text)}</Text>
                                            {renderRight(data[key])}
                                            {text === "存款" && useCentralPayment && ["TH", "VN"].includes(window.LANGUAGE) &&
                                                depositStepTwoDetails?.ongoingDeposit && <View style={styles.redDot} />}
                                        </ColumnStartCenter>
                                    );
                                })}
                            </View>

                            {MangerListsBottomArr.map((v1, i1) => {
                                return (
                                    <View style={styles.viewBlock} key={i1}>
                                        {v1.filter(FilterList).map((v, i, self) =>
                                            this.rendermMangerLists({
                                                v,
                                                i,
                                                length: self.length,
                                            }),
                                        )}
                                    </View>
                                );
                            })}

                            {
                                window.ApiPort.UserLogin &&
                                <FilledButton
                                    text={translate("登出")}
                                    outlined={true}
                                    onPress={() => {
                                        LogoutUtil();
                                        PiwikEventDataHandle("MemberCenter11");
                                    }}
                                    wrapStyle={{ marginTop: 25 }}
                                />
                            }
                        </View>

                        {/*線上環境不顯示*/}
                        <TestFunctions />
                    </View>
                </CustomScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    userSetting: state.userSetting,
    centralPayment: state.centralPayment,
});
const mapDispatchToProps = dispatch => ({
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
    },
    profileTopWrap: {
        backgroundColor: Color.theme,
        paddingHorizontal: 15,
        paddingTop: 8
    },
    userNameText: {
        fontWeight: "800",
        fontSize: 15,
        color: Color.white,
        marginRight: 5,
    },
    profileTopIconBox: {
        backgroundColor: Color.lightSilver,
        borderRadius: 1000,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    profileBoxWrap: {
        paddingHorizontal: 16,
        paddingBottom: 70,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Color.lightSilver
    },
    listItem: {
        width: "25%",
    },
    iconBtnImg: {
        marginBottom: 6,
    },
    managerListsTouch: {
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
        height: 48,
    },

    mangerListsTop: {
        backgroundColor: Color.white,
        paddingVertical: 16,
        flexWrap: "wrap",
        flexDirection: "row"
    },
    viewBlock: {
        backgroundColor: Color.white,
        marginTop: 16,
        borderRadius: 8,
        paddingHorizontal: 15
    },
    iconText: {
        color: "#222",
        fontSize: 12,
        textAlign: "center",
    },
    redDot: { width: 8, height: 8, backgroundColor: "#FF2424", borderRadius: 4, position: "absolute", top: 0, right: 25 },
});
