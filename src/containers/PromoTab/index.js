import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import * as Sentry from "@sentry/react-native";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import LiveChat from "$Components/LiveChat";
import { CheckLogin } from "$Utils";
import { PAGE_HEADER_HEIGHT } from "@/lib/constants";
import { usePromoTab } from "$Hooks";

import BonusList from "./BonusList/index";
/* --------优惠列表--------*/
import Promotions from "./Promotions";
/* ----------返水----------*/
import PromotionsRebate from "./PromotionsRebate/index";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";

/**
 * PromoTab 组件
 * 优惠页面主容器，包含三个 Tab：优惠、我的优惠、返水
 */
const PromoTab = ({ navigation }) => {
    // 是否为体育投注模式
    const sportSB = navigation?.state?.routeName === "promotionSB";

    // 从 Hook 获取业务逻辑和状态
    const {
        activetab,
        generalCategories,
        rebateCategories,
        promotionsData,
        classifiedPromotions,
        bonusListTabsActive,
        setPromoData,
        getPromotions,
        initialization,
        onTabChange,
        onBonusTabChange,
    } = usePromoTab({ sportSB });

    // Tab 配置数据
    const PromoTabData = [
        {
            title: translate("优惠"),
            needLogin: false,
            Com: (
                <Promotions
                    categories={generalCategories}
                    classifiedPromotions={classifiedPromotions}
                    promotions={promotionsData}
                    getPromotions={getPromotions}
                    setPromoData={setPromoData}
                    initialization={initialization}
                    sportSB={sportSB}
                />
            ),
        },
        {
            title: translate("我的优惠"),
            needLogin: true,
            Com: (
                <BonusList
                    activetab={activetab}
                    sportSB={sportSB}
                    changeBonusListTabs={onBonusTabChange}
                    bonusListTabsActive={bonusListTabsActive}
                />
            ),
        },
        {
            title: translate("返水"),
            needLogin: true,
            Com: <PromotionsRebate categories={rebateCategories} sportSB={sportSB} />,
        },
    ];

    // Sentry 事务追踪（只在组件挂载时执行一次）
    useEffect(() => {
        const transaction = Sentry.startTransaction({
            name: "Promotion",
            op: "navigation",
        });

        // 立即完成事务追踪（与原来的 componentDidMount 逻辑一致）
        transaction && transaction.finish && transaction.finish();
    }, []);

    // 设置全局方法，供外部调用（每次渲染时更新，确保引用最新的方法）
    window.goPromotion = (tabIndex, bonusTabIndex) => {
        onTabChange(tabIndex, bonusTabIndex);
    };

    return (
        <View style={{ flex: 1 }}>
            <RowCenterBetween style={[styles.headerWrap]}>
                <RowCenterStart>
                    {PromoTabData.map((tabItem, tabIndex) => {
                        const { title } = tabItem;
                        const isActiveTab = activetab == tabIndex;
                        return (
                            <Touch
                                style={{}}
                                key={tabIndex}
                                onPress={() => {
                                    if (CheckLogin()) return;
                                    onTabChange(tabIndex);
                                    PiwikEventDataHandle(`PromoMainPage${tabIndex + 1}`);
                                }}>
                                <Text
                                    style={[
                                        styles.tabTxt,
                                        {
                                            fontSize: isActiveTab ? 20 : 14,
                                            opacity: isActiveTab ? 1 : 0.8,
                                            fontWeight: isActiveTab ? "600" : "400"
                                        },
                                    ]}>
                                    {title}
                                </Text>
                            </Touch>
                        );
                    })}
                </RowCenterStart>
                <LiveChat
                    callBack={() => {
                        if (activetab == PromoTabData.length - 1) {
                            PiwikEventDataHandle("Rebate3");
                        } else {
                            PiwikEventDataHandle("PromoMainPage6");
                        }
                    }}
                    showVip={true}
                />
            </RowCenterBetween>
            {PromoTabData[activetab].Com}
        </View>
    );
};

export default PromoTab;

const styles = StyleSheet.create({
    headerWrap: {
        backgroundColor: Color.theme,
        paddingHorizontal: 15,
        height: PAGE_HEADER_HEIGHT,
    },
    tabTxt: {
        color: Color.white,
        textAlign: "center",
        paddingRight: 15,
        fontWeight: "400"
    },
});
