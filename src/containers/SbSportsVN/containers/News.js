import React from "react";
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, Platform, FlatList, RefreshControl, Modal } from "react-native";
import { Actions } from "react-native-router-flux";
import Accordion from "react-native-collapsible/Accordion";
import Touch from "react-native-touch-once";
import ModalDropdown from "react-native-modal-dropdown";
import HTMLView from "react-native-htmlview";
import VendorIM from "../lib/vendor/im/VendorIM";
import VendorBTI from "../lib/vendor/bti/VendorBTI";
import VendorSABA from "../lib/vendor/saba/VendorSABA";
import { ApiPortSB } from "../lib/SPORTAPI";
import { Toasts } from "$Toasts";
import NavBack from "$Components/Nav/NavBack";
const {
    width, height
} = Dimensions.get("window");
import NavTab from "$Components/Nav/NavTab";
class News extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            sportsTabType: "SABA", // 1.Bti 2.Im
            isShowDetail: false,
            detailData: "",
            // 公告
            AnnouncementData: "",
            selItemAnnouncement: { id: "0", egName: "All", label: "全部" },
            AnnouncementUnreadCount: 0,
            // 通知
            TransferData: "", //交易
            PersonalData: "", //个人
            selItemTransfer: { id: "0", egName: "All", label: "全部" },
            PersonalUnreadCount: 0,
            TransferUnreadCount: 0,
            moreLoading: false,
            // page info
            TransferPageInfo: {
                currentIndex: 1,
                lastPage: 1,
            },




            currentShowNotice: [],
            currentShowNoticeAll: [],
            SportsPageInfo: {
                currentIndex: 1,
                lastPage: 1,
            },
        };
    }

    componentWillMount(props) {
        this.setNav();
        if (ApiPort.UserLogin == true) {
            Toasts.loading("đang tải...", 200);//加载中,请稍候...
            let processed = [
                this.onClickSportsTabs("SABA")
            ];
            Promise.all(processed).then((res) => {
                Toasts.removeAll();
            });
        }

    }

    setNav() {
        this.props.navigation.setParams({
            title: () => {
                return (
                    <NavTab
                        tabData={["SABA", "IM", "BTI"]}
                        callBack={({ value }) => {
                            this.onClickSportsTabs(value);
                        }}></NavTab>
                );
            },
        });
    }





    getVendorAnnouncements(vendor = "SABA") {
        let targetVendor = VendorSABA;
        if (vendor === "BTI") {
            targetVendor = VendorBTI;
        } else if (vendor === "IM") {
            targetVendor = VendorIM;
        }
        Toasts.loading("đang tải...", 200);
        this.setState({
            currentShowNotice: [],
            SportsPageInfo: {
                currentIndex: 1,
                lastPage: 1,
            },
        });
        targetVendor.getAnnouncements()
            .then((datas) => {
                Array.isArray(datas) && this.SetSportsNews(datas);
                Toasts.removeAll();
            })
            .catch((err) => {
                Toasts.removeAll();
                console.log(err);
            });
    }

    SetSportsNews = (res) => {
        let pageTotal = Math.ceil((res.length * 1) / 8);
        this.setState({
            currentShowNotice: this.state.currentShowNotice.concat(res.slice(0, this.state.SportsPageInfo.currentIndex * 8)),
            currentShowNoticeAll: res,
            SportsPageInfo: {
                currentIndex: 1,
                lastPage: pageTotal,
            },
        });
    };







    // 顯示更多訊息
    moreMessage = (type) => {
        const { moreLoading } = this.state;
        return (
            <View>
                {this.isLastPage(type) ? (
                    <Text style={{ color: "#00a6ff", textAlign: "center", fontSize: 13 }}>không có thêm thông tin</Text>//沒有更多信息
                ) : (
                    <Touch onPress={() => this.getNextPage(type)}>
                        <Text style={{ color: "#00a6ff", textAlign: "center", fontSize: 13, paddingBottom: 25 }}>Nhấp để hiển thị thêm thông tin</Text>
                        {/* 点击显示更多信息 */}
                    </Touch>
                )}
            </View>

        );
    };

    isLastPage = (type) => {
        if (this.state[[`${type}PageInfo`]]["lastPage"] === 1) {
            return true;
        } else {
            return (
                this.state[`${type}PageInfo`]["currentIndex"] >=
                this.state[[`${type}PageInfo`]]["lastPage"]
            );
        }
    };

    getNextPage = (type) => {
        let fetchurl = "";
        const {

        } = this.state;

        if (this.isLastPage(type)) return;

        switch (type) {
            case "Sports":
                this.goNextSportMsg();
                return;
            default:
                return;
        }

    };

    goNextSportMsg = () => {
        this.setState({
            SportsPageInfo: {
                ...this.state.SportsPageInfo,
                currentIndex:
                    this.state.SportsPageInfo[
                    "currentIndex"
                    ] *
                    1 +
                    1,
            },
        }, () => {
            const { currentShowNotice, currentShowNoticeAll } = this.state;
            const indexOfLastPost = this.state.SportsPageInfo.currentIndex * 8;
            const indexOfFirstPost = indexOfLastPost - 8;
            this.setState({
                currentShowNotice: currentShowNotice.concat(currentShowNoticeAll.slice(indexOfFirstPost, indexOfLastPost)),
            });
        });
    };



    onClickSportsTabs = (key) => {
        this.setState({
            sportsTabType: key,
        }, () => {
            this.setNav();
        });
        this.getVendorAnnouncements(key);
    };


    render() {
        const {
            sportsTabType,
        } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: isBlue ? "#00A6FF" : "#1B1B1B" }}>

                <View style={{ flex: 1, backgroundColor: isBlue ? "#EFEFF4" : "#1B1B1B" }}>
                    {
                        sportsTabType == "IM" &&
                        <View style={{ flex: 1, padding: 15 }}>

                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                ref={el => { this.scrollview = el; }}
                            >
                                <Text style={{ textAlign: "center", lineHeight: 30, color: "#BCBEC3" }}>Chỉ hiện thị tin trong 30 ngày</Text>
                                {/* 只显示30天内的信息 */}
                                {
                                    Array.isArray(this.state.currentShowNotice) && this.state.currentShowNotice.length > 0 &&
                                    this.state.currentShowNotice.map((v, index) => {
                                        return (
                                            <View key={index} style={[styles.gonggaoList, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                                <Text style={{ paddingBottom: 15, color: isBlue ? "#000" : "#F5F5F5" }}>{v.PostingDate}</Text>
                                                <Text style={{ color: "#999", lineHeight: 20 }}>{v.AnnouncementText}</Text>
                                            </View>
                                        );
                                    })
                                }
                                {this.moreMessage("Sports")}
                            </ScrollView>
                        </View>
                    }
                    {
                        sportsTabType == "SABA" &&
                        <View style={{ flex: 1, padding: 15 }}>

                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                ref={el => { this.scrollview = el; }}
                            >
                                <Text style={{ textAlign: "center", lineHeight: 30, color: "#BCBEC3" }}>Chỉ hiện thị tin trong 7 ngày</Text>
                                {/* 只显示7天内的信息 */}
                                {
                                    Array.isArray(this.state.currentShowNotice) && this.state.currentShowNotice.length > 0 &&
                                    this.state.currentShowNotice.map((v, index) => {
                                        return (
                                            <View key={index} style={[styles.gonggaoList, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                                <Text style={{ paddingBottom: 15, color: isBlue ? "#000" : "#F5F5F5" }}>{v.PostingDate}</Text>
                                                <Text style={{ color: "#999", lineHeight: 20 }}>{v.AnnouncementText}</Text>
                                            </View>
                                        );
                                    })
                                }
                                {this.moreMessage("Sports")}
                            </ScrollView>
                        </View>
                    }
                    {
                        sportsTabType == "BTI" &&
                        <View style={{ flex: 1, padding: 15 }}>

                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                ref={el => { this.scrollview = el; }}
                            >
                                <Text style={{ textAlign: "center", lineHeight: 30, color: "#BCBEC3" }}>Chỉ hiện thị tin trong 30 ngày</Text>
                                {/* 只显示30天内的信息 */}
                                {
                                    Array.isArray(this.state.currentShowNotice) && this.state.currentShowNotice.length > 0 &&
                                    this.state.currentShowNotice.map((v, index) => {
                                        return (
                                            <View key={index} style={[styles.gonggaoList, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                                <Text style={{ paddingBottom: 15, color: isBlue ? "#000" : "#F5F5F5" }}>{v.PostingDate}</Text>
                                                <Text style={{ color: "#999", lineHeight: 20 }}>{v.AnnouncementText}</Text>
                                            </View>
                                        );
                                    })
                                }
                                {this.moreMessage("Sports")}
                            </ScrollView>
                        </View>
                    }
                </View>
            </View>

        );
    }


}


export default (News);



const styles = StyleSheet.create({
    topNav: {
        width: width,
        height: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    btnType: {
        backgroundColor: "#7676801F",
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    btnList: {
        width: 110,
        backgroundColor: "#00A6FF",
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    btnTxt: {
        textAlign: "center",
        lineHeight: 32,
    },
    redIcon: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: "red",
        marginLeft: 10,
    },
    magTab: {
        display: "flex",
        // justifyContent: 'space-around',
        alignItems: "center",
        flexDirection: "row",
        height: 35,
        // width: 200,
        borderRadius: 17,
        alignSelf: "center"
    },
    magTabList: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 32,
        width: 70,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 0,
    },
    messageItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
    },
    allRed: {
        width: 85,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#00a6ff",

    },
    noallRed: {
        width: 85,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#bcbec3",

    },
    allRedTxt: {
        color: "#00a6ff",
        lineHeight: 28,
        textAlign: "center"
    },
    noallRedTxt: {
        color: "#bcbec3",
        lineHeight: 28,
        textAlign: "center"
    },
    gonggaoList: {
        borderRadius: 10,
        marginBottom: 15,
        padding: 15
    },
    activeTab: {
        backgroundColor: isBlue ? "#fff" : "#1CA6FC",
        borderRadius: 15
    }
});

const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 12,
        lineHeight: 22,
    },
});