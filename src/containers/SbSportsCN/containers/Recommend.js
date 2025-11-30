
import React, { Component, PropTypes } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
    Modal,
    Platform,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import moment from "moment";
import VendorIM from "./../lib/vendor/im/VendorIM";
import HostConfig from "./../lib/Host.config";
import { connect } from "react-redux";
import { Toasts } from "$Toasts";
import Touch from "react-native-touch-once";
import EventData from "./../lib/vendor/data/EventData";
import VendorBTI from "../lib/vendor/bti/VendorBTI";
import { ImagesUrl } from "@/images/index";
import ImageForLeague from "../game/RNImage/ImageForLeague";
import ImageForTeam from "../game/RNImage/ImageForTeam";
import { CloseIcon } from "$Components/icons/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import StorageUtil from "$Utils/Storage";
const { width, height } = Dimensions.get("window");
/*
    热门赛事
*/



class Recommend extends React.Component {
    constructor() {
        super();
        this.state = {
            hotEventsVisible: false,
            hotEvents: "",
        };
    }
    async componentDidMount() {
        const guideData = await StorageUtil.load("guide");
        // 沒有新手引導不能彈出，會把新手引導遮住
        if (guideData) {
            const hotEventsVisibleData = await StorageUtil.load("hotEventsVisible");
            // 原始邏輯：如果 hotEventsVisible 存在，需要 UserLogin 為 true 才顯示
            // 如果 hotEventsVisible 不存在（第一次），則顯示
            if (!hotEventsVisibleData) {
                this.showHotEvents();
            } else if (ApiPort.UserLogin) {
                this.showHotEvents();
            }
        }
    }

    componentWillUnmount() {}

    showHotEvents(key) {

        const hotEventsVendorName = "im"; //固定im

        //維護就不展示
        if (this.checkMaintenanceStatus(hotEventsVendorName)) { //true表示維護中
            return;
        }
        if (window.EuroCupLogin) {
            return;
        }

        if (!key && getMiniGames) {
            //进入活动不展示
            return;
        }

        //在點擊按鈕時 才查詢
        key && Toasts.loading("加载中...");
        fetch(HostConfig.Config.CacheApi + "/hotevents/" + hotEventsVendorName)
            .then(response => response.json())
            .then(jsonData => {
                jsonData.data = jsonData.data.map(ev => EventData.clone(ev)); //需要轉換一下
                //有數據才展示彈窗
                const hotEventsVisible = (jsonData.data && jsonData.data.length > 0);
                StorageUtil.save({
                    key: "hotEventsVisible",
                    data: "hotEventsVisible"
                });
                this.setState({ hotEvents: jsonData.data, hotEventsVisible });
            })
            .catch(() => null)
            .finally(() => {
                Toasts.removeAll();
            });
    }
    checkMaintenanceStatus = (name) => {
        const { isBTI, isIM, isSABA, noTokenBTI, noTokenIM, noTokenSABA } = this.props.maintainStatus;
        const { isLogin } = this.props.userInfo; //有登入才額外判斷 token獲取狀態
        switch (name) {
            case "bti":
                return isBTI || (isLogin && noTokenBTI);
            case "im":
                return isIM || (isLogin && noTokenIM);
            case "saba":
                return isSABA || (isLogin && noTokenSABA);
            default:
                return false;
        }
    };

    render() {
        window.ShowHotEvents = (key) => {
            this.showHotEvents(key);
        };
        const { hotEventsVisible, hotEvents } = this.state;

        const Vendor = VendorIM; //固定im

        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={!window.isMobileOpen && hotEventsVisible}
                    onRequestClose={() => {}}
                >
                    <View style={styles.depModal}>
                        <View style={{ backgroundColor: "#004bef", borderRadius: 15 }}>
                            <ImageBackground
                                style={{ width: width - 40, height: 1.34 * (width - 40), padding: 10, position: "absolute", zIndex: -1 }}
                                resizeMode="stretch"
                                source={ImagesUrl.popUpMatchCn}
                            ></ImageBackground>
                            <View
                                style={{ width: width - 40, padding: 10 }}
                            >
                                <View>
                                    <View style={{ paddingTop: width * 0.35 }}>
                                        {hotEvents.length > 0 && hotEvents.map((v, i) => (
                                            <Touch key={i} onPress={() => {
                                                this.setState({ hotEventsVisible: false }, () => {
                                                    PiwikEventDataHandle("SbSportsCN_HotMatches");
                                                    let dataList = {
                                                        eid: v.EventId,
                                                        sid: v.SportId,
                                                        lid: v.LeagueId,
                                                    };
                                                    if (Vendor.configs.VendorName !== lowerV) { //如果當前不是選擇這個vendor，直接切換過去
                                                        window.changeGameFullPage(Vendor.configs.VendorName);
                                                    }
                                                    Actions.Betting_detail({ dataList, Vendor });
                                                });
                                                // Router.push(
                                                //     `${Vendor.configs.VendorPage}/detail?sid=${v.SportId}&eid=${v.EventId}&lid=${v.LeagueId}`
                                                // );
                                            }}>
                                                <View style={styles.itemsList}>
                                                    <View style={styles.itemName}>
                                                        {/* <LazyImageForLeague Vendor={Vendor} LeagueId={v.LeagueId} /> */}
                                                        <ImageForLeague LeagueId={v.LeagueId} Vendor={Vendor} />
                                                        <Text style={{ color: "#999" }}>{v.LeagueName}</Text>
                                                    </View>
                                                    <View style={styles.BettingList}>
                                                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            {/* <LazyImageForTeam Vendor={Vendor} TeamId={v.HomeTeamId} /> */}
                                                            <ImageForTeam TeamId={v.HomeTeamId} Vendor={Vendor} IconUrl={v.HomeIconUrl} />
                                                            <Text style={{ width: (width - 50) * 0.35, color: "#000", textAlign: "center" }}>{v.HomeTeamName}</Text>
                                                        </View>
                                                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            <Text style={{ color: "#000", fontSize: 12, paddingBottom: 15 }}>{v.getEventDateMoment().format("MM/DD HH:mm")}</Text>
                                                            <Text style={{ color: "#999", fontSize: 22, fontWeight: "bold" }}>VS</Text>
                                                        </View>
                                                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            {/* <LazyImageForTeam Vendor={Vendor} TeamId={v.AwayTeamId} /> */}
                                                            <ImageForTeam TeamId={v.AwayTeamId} Vendor={Vendor} IconUrl={v.AwayIconUrl} />
                                                            <Text style={{ width: (width - 50) * 0.35, color: "#000", textAlign: "center" }}>{v.AwayTeamName}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Touch>
                                        ))}
                                    </View>
                                    <Text style={{ color: "#fff", fontSize: 12, textAlign: "center" }}>点击卡片查看更多投注</Text>
                                </View>
                            </View>
                        </View>
                        <Touch onPress={() => { this.setState({ hotEventsVisible: false }); }} style={styles.closes}>
                            <CloseIcon width={30} height={30}></CloseIcon>
                        </Touch>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
});

export default connect(
    mapStateToProps,
    null,
)(Recommend);

const styles = StyleSheet.create({
    depModal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    closes: {
        backgroundColor: "rgba(0,0,0,.3)",
        width: 38,
        height: 38,
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    itemsList: {
        padding: 25,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    itemName: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    BettingList: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    }
});
