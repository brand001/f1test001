import React, { Component } from "react";
import { Dimensions, ScrollView, View, Text, StyleSheet } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
const { width } = Dimensions.get("window");
import InfoList from "@/containers/Profile/VIP/Components/InfoList";
import TableImg from "@/containers/Profile/VIP/Components/TableImg";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";
import { InforIcon } from "$Components/icons/index";

import Divider from "./Components/Divider";

class DetailsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const DetailTabData = [
            translate("任何等级的欢迎礼金只能领取一次，不能通过重复升级再次获得。"),
            translate("网站保留以奖金或实物礼品的形式提供生日礼品的权利。"),
            translate("如果钻石会员在生日月份期间降级为非钻石VIP，将无法享受此项福利。"),
            translate("会员必须在过去 7 天内至少有 1 次存款，才能在任务中心领取每日签到奖励。"),
            translate("会员需注册超过7天，才能参与每日、每周和每月任务。"),
            translate("如会员未能保持 VIP 等级并被降级，将失去所有相关福利，并且无法重新获得降级前的任何权益。"),
            translate("本网站保留修改、修正和最终解释本活动的权利。"),
            translate("会员过去 90 天有效流水必须为存款金额的 3 倍或以上才能升级为 VIP 或升级至下一个 VIP 等级。"),
            translate("会员每次只能升级一级，升级下一级的乐币将从上次升级日期开始计算。"),
        ];

        return (
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <AutoHeightImage width={width} source={ImgMap.vipBanner} />
                <View style={{ paddingBottom: 50 }}>
                    {/* 钻石权益 */}
                    <TableImg title={translate("钻石权益")} imageSource={ImgMap.VIP_table_1} containerStyle={{ marginTop: 30 }} />

                    <View style={styles.container}>
                        <View style={{ alignSelf: "flex-start" }}>
                            <InforIcon fill={"#ABA79D"} width={16} height={16} marginRight={4} />
                        </View>
                        <Text style={styles.promoText}>{translate("有效流水将优先用于满足彩金优惠流水需求, 剩余的有效流水将随后计入您的返水")}</Text>
                    </View>

                    {/* 乐币奖励 */}
                    <TableImg title={translate("乐币奖励")} imageSource={ImgMap.VIP_table_2} />

                    {/* 奖励与礼品 */}
                    <TableImg title={translate("奖励与礼品")} imageSource={ImgMap.VIP_table_3} />

                    {/* 其他福利 */}
                    <TableImg title={translate("其他福利")} imageSource={ImgMap.VIP_table_4} />

                    {/* 积分有效期 */}
                    <TableImg title={translate("乐币有效期")} imageSource={ImgMap.VIP_table_5} />

                    {/* 分線 */}
                    <Divider />

                    {/* 条款与条件： */}
                    <InfoList title={translate("条款与条件：")} notes={DetailTabData} />
                </View>
            </ScrollView>
        );
    }
}

export default DetailsTab;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 27,
        paddingBottom: 32,
    },
    promoText: {
        fontWeight: "400",
        color: "#ABA79D",
        fontSize: 12,
        flex: 1,
    },
});
