import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { Actions } from "react-native-router-flux";

const { width } = Dimensions.get("window");
import ReferralProcess from "@/containers/Profile/Recommend/Components/ReferralProcess";
import FilledButton from "$Components/FilledButton";
import { FormatDate, CheckLogin } from "$Utils";
import StorageUtil from "$Utils/Storage";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";

import ActivePage from "./Components/ActivePage";
import CustomScrollView from "$Components/CustomScrollView";

export default class Recommend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: "",
            campaignRewardDetails: [],
            maxReferral: 10,
            startDateTime: "",
        };
        this._ScrollTop = null;
    }

    componentDidMount() {
        this.getData();
    }

    //取缓存並處理日期
    getData = async () => {
        const data = await StorageUtil.load("QueleaActiveCampaign");
        if (!data) return;
        let formattedDate = "";

        // 處理日期格式
        if (data.result && data.result.startDate) {
            const startDate = new Date(data.result.startDate.split("T")[0]);
            formattedDate = FormatDate(startDate, { timeLevel: "onlyDate" });
        }

        this.setState({
            result: data.result,
            campaignRewardDetails: data.result?.campaignRewardDetails || [],
            startDateTime: formattedDate,
            maxReferral: data.result?.maxReferral
        });
    };

    //下一步,加入，或者查看进度
    goDetail = () => {
        if (CheckLogin()) return;
        Actions.RecommendPage({ QueleaReferrerInfo: "" });

        this.props?.callBack?.(true);
    };


    render() {
        const { result, startDateTime, campaignRewardDetails, maxReferral } = this.state;

        return (
            <View style={styles.container}>
                <CustomScrollView
                    bottom={100}
                >
                    {/* BANNER */}
                    <Image resizeMode="stretch" source={ImgMap.rafBanner} style={{ width: width, height: width * 0.32 }} />

                    <View style={{ padding: 15 }}>
                        {/* 推薦好友三步驟 */}
                        <ReferralProcess startDateTime={startDateTime} />

                        {/* 活動頁面 */}
                        <ActivePage result={result} campaignRewardDetails={campaignRewardDetails} maxReferral={maxReferral} />
                    </View>
                </CustomScrollView>

                {/* 底部按鈕 */}
                <View style={styles.depositButtonWrap}>
                    <FilledButton
                        text={translate("立即加入")}
                        onPress={() => {
                            this.goDetail();
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    depositButtonWrap: {
        position: "absolute",
        backgroundColor: "rgba(255,255,255,.9)",
        width: width,
        height: 76,
        padding: 10,
        bottom: 0,
        flex: 1,
        alignItems: "center",
    },
});
