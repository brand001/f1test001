import React, { Component } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { connect } from "react-redux";

import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { ACTION_UserSetting_ToggleListDisplayType } from "../../../lib/redux/actions/UserSettingAction";

import { ApiPortSB } from "./../lib/SPORTAPI";
import { getMoneyFormat, CheckLogin } from "$Utils";
import StorageUtil from "$Utils/Storage";
const { width, height } = Dimensions.get("window");
import { ArrowIcon, CloseIcon, LogoIcon, DepositIcon } from "$Components/icons/index.js";
import Color from "$Components/Color";
import { ImagesUrl } from "@/images/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";


class DrawerContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberInfo: "",
            UserLogin: ApiPort.UserLogin,
            balance: "0.00",
            StatisticsAll: 0,
            message: false,
            hotGmae: false,
            setTing: false,
            tutorial: false,
            discDisplay: true,
            tutorialDisplay: true
        };
    }

    componentWillMount() {
        if (ApiPort.UserLogin == true) {
            this.getMessageCount();
            this.setState({
                memberInfo: JSON.parse(localStorage.getItem("memberInfo"))
            });
        }
    }

    async componentDidMount() {
        let popverList = ["message", "hotGmae", "setTing", "tutorial"];
        for (const item of popverList) {
            const data = await StorageUtil.load(item);
            if (!data) {
                this.setState({ [item]: true });
            }
        }
    }


    componentWillUnmount() {

    }

    // 未讀訊息統計
    getMessageCount = () => {
        fetchRequest(ApiPortSB.UnreadMessage + "key=All&", "GET")
            .then((res) => {
                let { isSuccess = false, result = {} } = res;
                if (!isSuccess) return;
                let { unreadTransactionByType = {}, unreadAnnouncementCount = 0, unreadNewsCount = 0, unreadPersonalMessageCount = 0, } = result;
                let { deposit = 0, transfer = 0, withdrawal = 0, bonus = 0, } = unreadTransactionByType;
                let unreadTotalCount = deposit + transfer + withdrawal + bonus + unreadAnnouncementCount + unreadPersonalMessageCount + unreadNewsCount;

                this.setState({
                    StatisticsAll: unreadTotalCount,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    closePopver(message) {
        this.setState({ [message]: false });
        StorageUtil.save({
            key: message,
            data: message
        });
    }

    close() {
        Actions.pop();
    }

    actionPage(key) {
        if (CheckLogin()) return;

        switch (key) {
            case "DepositCenter":
                PiwikEventDataHandle("SbSportsCN_DepositNavSidenav");
                Actions.DepositSbCenter({ from: "GamePage" });
                break;
            case "TransferSb":
                PiwikEventDataHandle("SbSportsCN_TransferNavSidenav");
                Actions.TransferSb();
                break;
            case "News":
                PiwikEventDataHandle("SbSportsCN_NotificationSidenav");
                Actions.NewsSb();
                break;
            case "setSystem":
                PiwikEventDataHandle("SbSportsCN_HotMatchesSidenav");
                Actions.Setting({ setType: "setSystem" });
                break;
            case "setPush":
                PiwikEventDataHandle("SbSportsCN_NotificationSettingSidenav");
                Actions.Setting({ setType: "setPush" });
                break;
            case "Rules":
                Actions.Rules();
                break;
            default:
                "";
        }
    }

    logout() {
        Actions.Home();
    }

    render() {
        const {
            UserLogin,
            balance,
            memberInfo,
            message,
            hotGmae,
            setTing,
            StatisticsAll,
            tutorial,
        } = this.state;

        window.GetMessageCounts = () => {
            this.getMessageCount();
        };
        const {
            userSetting,
        } = this.props;
        return (
            <View style={{ flex: 1, paddingTop: DeviceInfoIos ? 35 : 0, backgroundColor: "#FFFFFF" }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View style={styles.logos}>
                        <LogoIcon fill={Color.theme} scale={1.2}></LogoIcon>
                    </View>

                    <View>
                        {
                            !UserLogin &&
                            <View style={styles.userName}>
                                <Text style={{ color: "#666" }}>欢迎, 访客参访中...</Text>
                            </View>
                        }
                        {
                            UserLogin &&
                            <View style={styles.userName}>
                                <Text style={{ fontWeight: "bold", color: "#222", fontSize: 16 }}>{
                                    memberInfo.userName && memberInfo.userName.length > 10 ? memberInfo.userName.slice(0, 10) + "..." : memberInfo.userName
                                }</Text>
                                <Text
                                    style={{ color: "#222", fontSize: 16, fontWeight: "bold" }}>{getMoneyFormat(this.props.userInfo.balanceSB)}</Text>
                            </View>
                        }
                        <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }} />
                    </View>

                    <View style={styles.listItem}>
                        <Touch onPress={() => {
                            this.actionPage("DepositCenter");
                            PiwikEventDataHandle("SbSportsCN_DepositSidenav");
                        }} style={[styles.iconBtn, { paddingTop: 10 }]}>
                            <DepositIcon width={26} height={26} wrapStyle={{ marginLeft: 5, marginRight: 4 }} />
                            <Text style={{ color: "#000" }}>存款</Text>
                        </Touch>
                    </View>
                    <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }} />
                    <View style={[styles.listItem, { paddingTop: 9 }]}>
                        <Touch onPress={() => {
                            this.actionPage("News");
                            PiwikEventDataHandle("SbSportsCN_NotificationSidenavClick");
                        }} style={styles.iconBtn}>
                            <Image resizeMode='stretch' source={ImagesUrl.message}
                                style={{ width: 35, height: 35 }} />
                            <Text style={{ color: "#000" }}>通知</Text>
                        </Touch>
                        {
                            // StatisticsAll > 0 &&
                            UserLogin &&
                            <View style={styles.news}>
                                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>{StatisticsAll}</Text>
                            </View>
                        }
                        {
                            UserLogin && message &&
                            <View style={styles.Popover}>
                                <Touch onPress={() => {
                                    this.closePopver("message");
                                }} style={styles.PopoverConten}>
                                    <View style={styles.arrow} />
                                    <Text style={{ color: "#fff", paddingRight: 5, fontSize: 12 }}>查看赛事通知</Text>
                                    <CloseIcon width={15} height={15} />
                                </Touch>
                            </View>
                        }
                    </View>

                    <View style={styles.listItem}>
                        <Touch onPress={() => {
                            this.close();
                            window.ShowHotEvents && window.ShowHotEvents(1);
                            PiwikEventDataHandle("SbSportsCN_HotMatchesSidenavClick");
                        }} style={styles.iconBtn}>
                            <Image resizeMode='stretch' source={ImagesUrl.hotGame}
                                style={{ width: 35, height: 35 }} />
                            <Text style={{ color: "#000" }}>热门赛事</Text>
                        </Touch>
                        {
                            hotGmae &&
                            <View style={[styles.Popover, { left: 130 }]}>
                                <Touch onPress={() => {
                                    this.closePopver("hotGmae");
                                }} style={styles.PopoverConten}>
                                    <View style={styles.arrow} />
                                    <Text style={{ color: "#fff", paddingRight: 5, fontSize: 12 }}>推荐热门赛事</Text>
                                    <CloseIcon width={15} height={15} />
                                </Touch>
                            </View>
                        }
                    </View>
                    <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }} />
                    <View style={[styles.listItem, { paddingTop: 9 }]}>
                        <TouchableOpacity style={[styles.iconBtn, { width: width - 20, justifyContent: "space-between" }]}
                            onPress={() => {
                                this.setState(
                                    (prevState, nextProps) => ({
                                        discDisplay: !prevState.discDisplay,
                                    }));
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image resizeMode='stretch' source={ImagesUrl.set}
                                    style={{ width: 35, height: 35 }} />
                                <Text style={{ color: "#000" }}>设置</Text>
                            </View>
                            <ArrowIcon fill={"#999"} width={16} height={16} direction={this.state.discDisplay ? "top" : "bottom"} />
                        </TouchableOpacity>
                    </View>
                    <View style={[this.state.discDisplay ? styles.showContext : styles.hideContext]}>
                        <View style={[styles.listItemList]}>
                            <View style={styles.iconListBtn}>
                                <Text style={{ color: "#222", fontSize: 13, }}>盘口显示</Text>
                            </View>
                            <View style={styles.horizontal}>
                                <Touch
                                    onPress={() => {
                                        this.props.toggleListDisplayType();
                                        PiwikEventDataHandle("SbSportsCN_VerticalDisplaySidenav");
                                    }}
                                    style={[styles.horizontalBtn, { backgroundColor: userSetting.ListDisplayType != 2 ? "#00a6ff" : "transparent" }]}
                                >
                                    <Text
                                        style={{ color: userSetting.ListDisplayType != 2 ? "#fff" : "#999999", fontSize: 12 }}>纵向</Text>
                                </Touch>
                                <Touch
                                    onPress={() => {
                                        this.props.toggleListDisplayType();
                                        PiwikEventDataHandle("SbSportsCN_HorizontalDisplaySidenav");
                                    }}
                                    style={[styles.horizontalBtn, { backgroundColor: userSetting.ListDisplayType == 2 ? "#00a6ff" : "transparent" }]}
                                >
                                    <Text
                                        style={{ color: userSetting.ListDisplayType == 2 ? "#fff" : "#999999", fontSize: 12 }}>横向</Text>
                                </Touch>
                            </View>
                        </View>

                        <View style={styles.listItemList}>
                            <Touch onPress={() => {
                                this.actionPage("setSystem");
                                PiwikEventDataHandle("SbSportsCN_SettingSidenav");
                            }} style={styles.iconListBtn}>
                                <Text style={{ color: "#222", fontSize: 13, }}>系统设置</Text>
                            </Touch>
                        </View>

                        <View style={styles.listItemList}>
                            <Touch onPress={() => {
                                this.actionPage("setPush");
                                PiwikEventDataHandle("SbSportsCN_NotificationSettingSidenavClick");
                            }} style={styles.iconListBtn}>
                                <Text style={{ color: "#222", fontSize: 13, }}>推送设置</Text>
                            </Touch>
                            {
                                UserLogin && setTing &&
                                <View style={[styles.Popover, { left: 130 }]}>
                                    <Touch onPress={() => {
                                        this.closePopver("setTing");
                                    }} style={styles.PopoverConten}>
                                        <View style={styles.arrow} />
                                        <Text style={{ color: "#fff", paddingRight: 5, fontSize: 12 }}>赛事进球推送设置</Text>
                                        <CloseIcon width={15} height={15} />
                                    </Touch>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }} />
                    <View style={[styles.listItem, { paddingTop: 9 }]}>
                        <Touch onPress={() => {
                            Actions.Rules();
                            PiwikEventDataHandle("SbSportsCN_BettingRulesSidenav");
                        }} style={styles.iconBtn}>
                            <Image resizeMode='stretch' source={ImagesUrl.rules}
                                style={{ width: 35, height: 35 }} />
                            <Text style={{ color: "#000" }}>投注规则</Text>
                        </Touch>
                    </View>
                    <View style={styles.listItem}>
                        <TouchableOpacity style={[styles.iconBtn, { width: width - 20, justifyContent: "space-between" }]}
                            onPress={() => {
                                this.setState(
                                    (prevState, nextProps) => ({
                                        tutorialDisplay: !prevState.tutorialDisplay,
                                    }));
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image resizeMode='stretch' source={ImagesUrl.tutorial}
                                    style={{ width: 35, height: 35 }} />
                                <Text style={{ color: "#000" }}>新手教程</Text>
                            </View>
                            <ArrowIcon fill={"#999"} width={16} height={16} direction={this.state.tutorialDisplay ? "top" : "bottom"} />
                        </TouchableOpacity>
                        {
                            tutorial &&
                            <View style={[styles.Popover, { left: 130 }]}>
                                <Touch onPress={() => {
                                    this.closePopver("tutorial");
                                }} style={styles.PopoverConten}>
                                    <View style={styles.arrow} />
                                    <Text style={{ color: "#fff", paddingRight: 5, fontSize: 12 }}>新手教程讲解</Text>
                                    <CloseIcon width={15} height={15} />
                                </Touch>
                            </View>
                        }
                    </View>
                    <View style={[this.state.tutorialDisplay ? styles.showContext : styles.hideContext]}>
                        <View style={styles.listItemList}>
                            <Touch onPress={() => {
                                PiwikEventDataHandle("SbSportsCN_OddsTutorialSidenav");
                                Actions.BetTutorial({ types: "trends" });
                            }} style={styles.iconListBtn}>
                                <Text style={{ color: "#222", fontSize: 13, }}>盘口教程</Text>
                            </Touch>
                        </View>
                        <View style={styles.listItemList}>
                            <Touch onPress={() => {
                                PiwikEventDataHandle("SbSportsCN_BetTutorialSidenav");
                                this.close();
                                Actions.BetTutorial({ types: "bet" });
                            }} style={styles.iconListBtn}>
                                <Text style={{ color: "#222", fontSize: 13, }}>投注教程</Text>
                            </Touch>
                        </View>
                    </View>
                    <View style={{ backgroundColor: "#E5E5E5", width: width - 40, height: 1, alignSelf: "center" }} />
                    {
                        // ApiPort.UserLogin &&
                        <View style={[styles.listItem, { paddingTop: 9 }]}>
                            <Touch onPress={() => {
                                this.logout();
                                PiwikEventDataHandle("SbSportsCN_BackMainSiteSidenav");
                            }} style={styles.iconBtn}>
                                <Image resizeMode='stretch' source={ImagesUrl.loginOut}
                                    style={{ width: 35, height: 35 }} />
                                <Text style={{ color: "#000" }}>返回乐天堂</Text>
                            </Touch>
                        </View>
                    }
                </ScrollView>

                <Touch style={{
                    width: 48,
                    height: 48,
                    borderRadius: 48 / 2,
                    backgroundColor: "#00A6FF",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 34,
                }} onPress={() => {
                    this.close();
                }}>
                    <CloseIcon />
                </Touch>
                {
                    //     <Text style={{textAlign: 'center', lineHeight: 38}}>
                    //     版本号: v{Rb88Version}
                    // </Text>
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting
});
const mapDispatchToProps = {
    toggleListDisplayType: () => ACTION_UserSetting_ToggleListDisplayType(),
};
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
    horizontalBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        width: 50,
        height: 30,
    },
    horizontal: {
        position: "absolute",
        right: 15,
        backgroundColor: "#EEEEF0",
        borderRadius: 50,
        width: 100,
        height: 30,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    logos: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 15,
        paddingTop: 25,
    },
    userName: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 20,
        paddingVertical: 10
    },
    listItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 9,
    },
    listItemList: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 6,
        paddingBottom: 6,
        // backgroundColor: 'rgba(239,239,244,.3)',
    },
    iconBtn: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 20,
        //backgroundColor: 'red',
        width: "100%"
    },
    iconListBtn: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 50,
        paddingTop: 5,
        paddingBottom: 5,
        //backgroundColor: 'red',
        width: "100%"
    },
    Popover: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        left: 100,
    },
    PopoverConten: {
        backgroundColor: "#363636",
        borderRadius: 8,
        padding: 5,
        paddingLeft: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    arrow: {
        position: "absolute",
        left: -13,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: "solid",
        borderWidth: 7,
        borderTopColor: "#ffffff",
        borderLeftColor: "#ffffff",
        borderBottomColor: "#ffffff",
        borderRightColor: "#363636"
    },
    news: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 109999,
        padding: 4,
        backgroundColor: "#eb2121",
        position: "absolute",
        width: 26,
        height: 26,
        right: 15,
    },
    arrow1: {
        top: -5,
        left: 8,
        width: 10,
        height: 10,
        borderColor: "#999",
        borderRightWidth: 2,
        borderBottomWidth: 2,
        transform: [{ rotate: "45deg" }],
    },
    arrows: {
        top: 0,
        left: 8,
        width: 10,
        height: 10,
        borderColor: "#999",
        borderLeftWidth: 2,
        borderTopWidth: 2,
        transform: [{ rotate: "45deg" }],
    },
    showContext: {
        width: width - 50,
        backgroundColor: "#fff",
        paddingBottom: 10
    },
    hideContext: {
        display: "none",
        backgroundColor: "#fff",
        paddingBottom: 10,
        height: 0,
    },
});








