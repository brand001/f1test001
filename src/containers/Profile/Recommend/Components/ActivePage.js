import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { getMoneyFormat, LiveChatOpenGlobe } from "$Utils";
import RewardExample from "./../Components/RewardExample";
import RewardTable from "./../Components/RewardTable";
import { translate } from "$locales/translate";
const { width } = Dimensions.get("window");
import RafList from "./../Components/RafList";
import CustomLinkText from "$Components/CustomLinkText";
import { DropDownIcon } from "$Components/icons/index";
import Color from "$Components/Color";
import { RowCenterCenter } from "$Components/CustomView";

export default class activePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: false,
        };
    }

    render() {
        const { activePage } = this.state;
        const { campaignRewardDetails, maxReferral } = this.props;
        let fisrtReferralRewardAmount = campaignRewardDetails[0]?.referralRewardAmount || 68;
        let secondReferralRewardAmount = campaignRewardDetails[1]?.referralRewardAmount || 88;
        //表格數據
        const tableConfigs = {
            CN: {
                topTitles: [
                    { title: translate("被推荐人"), width: 0.5 },
                    { title: translate("推荐人"), width: 0.5 },
                ],
                subTitles: [translate("存款金额"), translate("流水"), translate("可得彩金")],
            },
            TH: {
                topTitles: [
                    { title: translate("被推荐人"), width: 0.465 },
                    { title: translate("推荐人"), width: 0.24 },
                    { title: translate("会员(RAF主標題)"), width: 0.24 },
                ],
                subTitles: [translate("存款金额"), translate("流水"), translate("可得彩金"), translate("可得彩金")],
            },
            VN: {
                topTitles: [
                    { title: translate("被推荐人"), width: 0.465 },
                    { title: translate("推荐人"), width: 0.24 },
                    { title: translate("会员(RAF主標題)"), width: 0.24 },
                ],
                subTitles: [translate("存款金额"), translate("流水"), translate("可得彩金"), translate("可得彩金")],
            },
        };

        // FAQ
        const FAQ = [
            translate("彩金是否可以申请其他优惠？"),
            translate("此优惠所派发的彩金是可以申请官网其他优惠。"),
            translate("所获得的彩金需要多少流水才可以提款？"),
            translate("此优惠所派发的彩金只需一倍流水即可提款。"),
            translate("无法验证手机号以及邮箱账号？"),
            <CustomLinkText
                usePrueText={true}
                text={translate("联系官网24小时{在线客服}进行辅助验证。")}
                norMaltextStyle={styles.infoText}
                themeTextStyle={styles.linkText}
                onPressList={[
                    () => {
                        LiveChatOpenGlobe();
                    },
                ]}
            />,
        ];

        // 活動規則
        const LIST = [
            translate("被推荐人必须是第一次来本站注册并且游戏。"),
            translate("被推荐人必须和您以不同的IP地址注册的, 有不同的住址。"),
            translate("被推荐人必须是在您的推荐链接或推荐二维码下面进行注册成为会员的。"),
            translate("被推荐人必须核实过有效电话的真实性。"),
            translate("仅正确填写有效电话号码的会员方有获奖资格。会员可联系官网客服进行更改。"),
            translate("任何非正常性投注套利行为，一旦发现将立即取消其参与本优惠的资格。"),
            translate("此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码、支付方式（相同借记卡/信用卡/银行账户号码）IP地址， 同一网络环境等将可以作为判定是否独立玩家的条件。"),
            translate("活动截止日期由本站官方进行通知。"),
            translate("本站享有活动最终解释权，此活动必须遵守本站标准条款。"),
            translate("若完成所有条件后的24小时内未收到推荐奖励，会员可联系官网客服查询奖励进度。"),
            translate("代理玩家账号不适用于此活动"),
        ];

        const Remark = [
            translate("需要被推荐人在活动时间内完成相应的存款和流水后推荐人才能获取彩金。（{X} 彩金和{Y} 彩金推荐人可以同时获得)", { X: getMoneyFormat(fisrtReferralRewardAmount, ""), Y: getMoneyFormat(secondReferralRewardAmount, "") }),
            translate("推荐人必须至少有一次存款记录。"),
            translate("推荐人必须完成姓名以及电话验证。"),
            translate("被推荐的新会员名额上限为每个月 {x}人。", { x: maxReferral }),
        ];

        // 取得對應語系的數據
        const { topTitles, subTitles } = tableConfigs[window.LANGUAGE] || {
            topTitles: [],
            subTitles: [],
        };

        return (
            <View style={{ paddingBottom: 60 }}>
                {/* 推薦好友獎金表格 */}
                <RewardTable title={translate("推荐奖金_RAF")} topTitles={topTitles} subTitles={subTitles} campaignRewardDetails={campaignRewardDetails} />

                {/* 推好好友獎金範例 */}
                {campaignRewardDetails && <RewardExample campaignRewardDetails={campaignRewardDetails} notes={Remark} />}

                {/* 常見問題 */}
                <RafList title={translate("常见问题_RAF")} notes={FAQ} type="FAQ" />

                {/* 顯示/隱藏 活動規則按鈕 */}
                <View style={{ alignItems: "center" }}>
                    <RowCenterCenter
                        onPress={() => {
                            this.setState({ activePage: !activePage });
                        }}
                        style={styles.activePage}>
                        <Text style={styles.activePageTxt}>{activePage ? translate("隐藏活动规则") : translate("显示活动规则")}</Text>
                        <DropDownIcon fill={Color.darkGray} width={20} height={20} />
                    </RowCenterCenter>
                </View>

                {/* 活動規則 */}
                {activePage && <RafList title={translate("活动规则")} notes={LIST} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activePage: {
        height: 40,
        width: width * 0.45,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        marginBottom: 15,
    },
    activePageTxt: {
        fontSize: 12,
        color: "#666666",
    },
    infoText: {
        color: "#666666",
        fontSize: 12,
        lineHeight: 16,
    },
    linkText: {
        color: "#00A6FF",
        fontSize: 12,
        lineHeight: 16,
    },
});
