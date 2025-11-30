import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import InfoList from "@/containers/Profile/VIP/Components/InfoList";
import MemberLevelContent from "@/containers/Profile/VIP/Components/MemberLevelContent";
import MemberTabs from "@/containers/Profile/VIP/Components/MemberTabs";
import CustomLinkText from "$Components/CustomLinkText";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";
import { LiveChatOpenGlobe } from "$Utils";

import CustomAccordion from "./Components/CustomAccordion";
import Divider from "./Components/Divider";
import { DiamondIcon, StarIcon, CrownIcon } from "$Components/icons/index.js";
import CustomScrollView from "$Components/CustomScrollView";

export const MemberLevelTab = props => {
    // props
    const { goToDetailsTab, tabsActive, handleTabChange } = props;

    const tabsList = useMemo(() => [
        {
            name: translate("标准会员"),
            icon: <CrownIcon fill="#fff" width={20} height={20} />,
            color: "#FFFFFF",
            width: window.LANGUAGE === "VN" ? 0.42 : 0.34,
        }, // 标准会员
        {
            name: translate("星光会员"),
            icon: <StarIcon fill="#A4A4F6" width={20} height={20} />,
            color: "#9B9EECEC",
            width: 0.24,
        }, // 星光会员
        {
            name: translate("VIP会员"),
            icon: <DiamondIcon fill="#B59849" width={20} height={20} />,
            color: "#B29E57",
            width: 0.34,
        }, // VIP会员级
    ], []);

    const FAQ = [
        {
            title: translate("如何获得乐币？"),
            content: translate("只需下注并达到有效流水即可。"),
        },
        {
            title: translate("为什么玩游戏后没有立即获得乐币？"),
            content: translate("乐币将在次日发放至会员账户。"),
        },
        {
            title: translate("我在哪里可以查看我的乐币？"),
            content: translate("您可以前往我们的彩金殿堂查看您的乐币余额。"),
        },
        {
            title: translate("乐币可以用来做什么？"),
            content: translate("可以在我们的天王俱乐部兑换物品，包括但不限于免费投注、免费旋转或实物商品。"),
        },
        {
            title: translate("我可以将乐币兑换成真钱吗？"),
            content: translate("乐币不能兑换成真钱，但您可以在天王俱乐部中兑换各种物品。"),
        },
        {
            title: translate("何时会进行升级或降级？"),
            content: translate("我们每天会进行一次升级或降级，每次调整至多一个等级！"),
        },
        {
            title: translate("什么是天王俱乐部？"),
            content: translate("天王俱乐部让您使用乐币进行购物，不仅可以兑换免费投注和免费旋转，还可以兑换各种商品！"),
        },
        {
            title: translate("我已在天王俱乐部兑换了商品但尚未收到，该怎么办？"),
            content: translate("您可以将您的用户名和兑换的物品发送至rewards@fun88.com，或联系24小时在线的乐天使客服团队。"),
        },
    ];

    const memberLevelTabData = [
        translate("升级所需的乐币仅基于有效流水计算，活动乐币将不包含在内。"),
        translate("乐币是基于有效流水金额计算。"),
        translate("本站保留更换您在天王俱乐部兑换的商品为同等价值商品的权利，或在商品无货、信息无效/不完整时拒绝兑换请求的权利。"),
        translate("实物商品兑换的配送时间将依据配送合作伙伴的服务及所需时间。"),
        <CustomLinkText
            usePrueText={true}
            text={translate("详情请访问我们的{问答中心}或联系乐天使 24 小时在线客服团队。")}
            norMaltextStyle={styles.infoText}
            themeTextStyle={styles.linkText}
            onPressList={[
                () => {
                    LiveChatOpenGlobe();
                },
            ]}
        />,
    ];

    return (
        <CustomScrollView>
            {/* TAB */}
            <MemberTabs tabsList={tabsList} tabsActive={tabsActive} handleTabChange={handleTabChange} />

            {/* 會員等級內容 */}
            <MemberLevelContent
                tabsActive={tabsActive}
                generalMembershipLevel={ImgMap.generalMembershipLevel}
                starMembershipLevel={ImgMap.starMembershipLevel}
                VIPMembershipLevel={ImgMap.VIPMembershipLevel}
                goToDetailsTab={goToDetailsTab}
            />

            {/* 分線 */}
            <Divider />

            {/* FAQ */}
            <CustomAccordion title={translate("常见问题")} FAQ={FAQ} />

            {/* 条款和条件 */}
            <InfoList title={translate("条款与条件：")} notes={memberLevelTabData} />
        </CustomScrollView>
    );
};

const styles = StyleSheet.create({
    infoText: {
        color: "#ABA79D",
        fontSize: 12,
        lineHeight: 16,
    },
    linkText: {
        color: "#ABA79D",
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});
