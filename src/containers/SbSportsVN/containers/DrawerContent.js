import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Platform,
} from "react-native";
import {
    Button,
    Carousel,
    WhiteSpace,
    WingBlank,
    Radio,
    InputItem,
    DatePicker,
    Flex,

    List,
} from "@ant-design/react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Touch from "react-native-touch-once";
import { getMoneyFormat, CheckLogin } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { NavigationActions } from "react-navigation";
import { Actions } from "react-native-router-flux";
import { ACTION_UserSetting_ToggleListDisplayType } from "../lib/redux/actions/UserSettingAction";
import { ACTION_UserInfo_getBalanceSB } from "$LIB/redux/actions/UserInfoAction";
import { removeVendorToken } from "../lib/js/util";
import actions from "@/lib/redux/actions/index";
import { ApiPortSB } from "../lib/SPORTAPI";
const { width, height } = Dimensions.get("window");
import { ArrowIcon, LogoIcon, CloseIcon, DepositIcon } from "$Components/icons/index.js";
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
            message: false,
            hotGmae: false,
            setTing: false,
            tutorial: false,
            display: false,
            SettingDisplay: true,
            tutorialDisplay: true,
        };
    }
    componentWillMount() {
        if (ApiPort.UserLogin == true) {
            this.props.userInfo_getBalanceSB(true);
            this.setState({
                memberInfo: JSON.parse(localStorage.getItem("memberInfo")),
            });
        }
    }
    async componentDidMount() {
        let popverList = ["message", "hotGmae", "setTing", "tutorial", "display"];
        for (const item of popverList) {
            const data = await StorageUtil.load(item);
            if (!data) {
                this.setState({ [item]: true });
            }
        }
    }

    componentWillUnmount() {}

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
        Actions.pop();
        if (CheckLogin()) return;

        switch (key) {
            case "DepositCenter":
                PiwikEventDataHandle("SbSportsVN_DepositSivenav");
                Actions.DepositCenter();
                // Actions.DepositCenter({ from: 'GamePage' })
                break;
            case "News":
                PiwikEventDataHandle("SbSportsVN_NotificationSidenav");
                Actions.NewsSb();
                break;
            case "setSystem":
                PiwikEventDataHandle("SbSportsVN_SettingSidenav");
                Actions.Setting({ setType: "setSystem" });
                break;
            case "setPush":
                PiwikEventDataHandle("SbSportsVN_NotificationSettingSidenav");
                Actions.Setting({ setType: "setPush" });
                break;
            case "Rules":
                PiwikEventDataHandle("SbSportsVN_BettingRulesSidenav");
                Actions.Rules();
                break;
            default:
                "";
        }
    }

    logout() {
        // if (window.currentRouteIndex !== 0) {
        //     console.log('===sb2.0 pop-out',window.currentRouteIndex);
        //     Actions.pop();
        // } else {
        //     //=0則無法pop，因為沒有上層scene了，改用reset跳回首頁
        //     console.log('===sb2.0 reset-out',window.currentRouteIndex);
        //     Actions.reset('lightbox');
        // }
        console.log("===sb2.0 reset-out", window.currentRouteIndex);
        // Actions.reset("lightbox");
        Actions.pop();
        Actions.pop();
        Actions.jump("Home");
    }

    DomainC(key) {
        if (key == "live") {
        }
    }

    render() {
        const {
            UserLogin,
            balance,
            memberInfo,
            message,
            hotGmae,
            setTing,
            tutorial,
            display,
            SettingDisplay,
            tutorialDisplay,
        } = this.state;

        const { userSetting } = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: DeviceInfoIos ? 35 : 0,
                    backgroundColor: isBlue ? "#fff" : "#222222",
                    paddingHorizontal: 10,
                }}
            >
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logos}>
                        <LogoIcon fill={Color.theme} scale={.8} />
                    </View>

                    <View>
                        {UserLogin ? (
                            <View style={styles.userName}>
                                <Text
                                    style={{
                                        fontWeight: "500",
                                        color: isBlue ? "#000" : "#F5F5F5",
                                    }}
                                >
                                    {memberInfo && memberInfo.userName}
                                </Text>
                                <Text
                                    style={{ color: isBlue ? "#000" : "#F5F5F5", fontSize: 16 }}
                                >
                                    {getMoneyFormat(this.props.userInfo.balanceSB)}
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginBottom: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        PiwikEventDataHandle("SbSportsVN_LoginSidenav");
                                        this.close();
                                        Actions.Login({ types: "login", from: "sbhome" });
                                    }}
                                >
                                    <Image
                                        resizeMode="stretch"
                                        source={ImagesUrl.loginVn}
                                        style={{ width: 128, height: 50 }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        PiwikEventDataHandle("SbSportsVN_RegisterSidenav");
                                        this.close();
                                        Actions.Login({ tabType: "register", from: "sbhome" });
                                    }}
                                >
                                    <Image
                                        resizeMode="stretch"
                                        source={ImagesUrl.registerVn}
                                        style={{ width: 128, height: 50 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.listItem}>
                        <Touch
                            onPress={() => {
                                this.actionPage("DepositCenter");
                            }}
                            style={styles.iconBtn}
                        >
                            <DepositIcon width={26} height={26} wrapStyle={{ marginRight: 7 }} />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Gửi Tiền
                            </Text>
                            {/* 存款 */}
                        </Touch>
                    </View>

                    <View style={[styles.lineStyle, { height: isBlue ? 1 : 0 }]}></View>

                    <View style={styles.listItem}>
                        <Touch
                            onPress={() => {
                                this.actionPage("News");
                            }}
                            style={styles.iconBtn}
                        >
                            <Image
                                resizeMode="stretch"
                                source={ImagesUrl.message}
                                style={styles.iconBtn2}
                            />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Thông Báo
                            </Text>
                            {/* 通知 */}
                        </Touch>
                        {UserLogin && message && (
                            <View style={[styles.Popover]}>
                                <Touch
                                    onPress={() => {
                                        this.closePopver("message");
                                    }}
                                    style={styles.PopoverConten}
                                >
                                    <View
                                        style={[
                                            styles.arrow,
                                            {
                                                borderTopColor: "transparent",
                                                borderLeftColor: "transparent",
                                                borderBottomColor: "transparent",
                                            },
                                        ]}
                                    />
                                    <Text style={styles.popoverText}>Cập nhật thông báo</Text>
                                    {/* 查看赛事通知 */}
                                    <CloseIcon width={15} height={15}></CloseIcon>
                                </Touch>
                            </View>
                        )}
                    </View>

                    <View style={styles.listItem}>
                        <Touch
                            onPress={() => {
                                this.close();
                                window.ShowHotEvents && window.ShowHotEvents(1);
                                PiwikEventDataHandle("SbSportsVN_HotMatchesSidenav");
                            }}
                            style={styles.iconBtn}
                        >
                            <Image
                                resizeMode="stretch"
                                source={ImagesUrl.hotGame}
                                style={styles.iconBtn2}
                            />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Sự Kiện Hot
                            </Text>
                            {/* 热门赛事 */}
                        </Touch>
                        {hotGmae && (
                            <View style={[styles.Popover]}>
                                <Touch
                                    onPress={() => {
                                        this.closePopver("hotGmae");
                                    }}
                                    style={styles.PopoverConten}
                                >
                                    <View
                                        style={[
                                            styles.arrow,
                                            {
                                                borderTopColor: "transparent",
                                                borderLeftColor: "transparent",
                                                borderBottomColor: "transparent",
                                            },
                                        ]}
                                    />
                                    <Text style={styles.popoverText}>
                                        Cập nhật sự kiện nổi bật
                                    </Text>
                                    <CloseIcon width={15} height={15}></CloseIcon>
                                </Touch>
                            </View>
                        )}
                    </View>

                    <View style={[styles.lineStyle, { height: isBlue ? 1 : 0 }]}></View>

                    <Touch
                        style={styles.listItem}
                        onPress={() => this.setState({ SettingDisplay: !SettingDisplay })}
                    >
                        <View style={styles.iconBtn}>
                            <Image
                                resizeMode="stretch"
                                source={ImagesUrl.set}
                                style={styles.iconBtn2}
                            />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Cài Đặt
                            </Text>
                            {/* 设置 */}
                        </View>

                        {/* 展開箭 */}
                        <Touch
                            style={styles.arrowStyle}
                            onPress={() => this.setState({ SettingDisplay: !SettingDisplay })}
                        >
                            <ArrowIcon fill={"#999"} width={16} height={16} direction={SettingDisplay ? "top" : "bottom"} wrapStyle={{ marginLeft: 10 }} />

                        </Touch>

                        {/* 教學 */}
                        {display && (
                            <View style={[styles.Popover]}>
                                <Touch
                                    onPress={() => {
                                        this.closePopver("display");
                                    }}
                                    style={styles.PopoverConten}
                                >
                                    <View
                                        style={[
                                            styles.arrowDown,
                                            {
                                                borderLeftColor: "transparent",
                                                borderBottomColor: "transparent",
                                                borderRightColor: "transparent",
                                            },
                                        ]}
                                    />
                                    <Text style={styles.popoverText}>
                                        Cách hiện thị tỷ lệ cược
                                    </Text>
                                    <CloseIcon width={15} height={15}></CloseIcon>
                                </Touch>
                            </View>
                        )}
                    </Touch>

                    {SettingDisplay && (
                        <View
                            style={{ backgroundColor: isBlue ? "transparent" : "#111111" }}
                        >
                            <View style={[styles.listItemList]}>
                                <View style={styles.iconListBtn}>
                                    <Text
                                        style={{
                                            color: isBlue ? "#222222" : "#CCCCCC",
                                            fontSize: 12,
                                        }}
                                    >
                                        Hiện Thị Tỷ Lệ Cược
                                    </Text>
                                    {/* 盘口显示 */}
                                </View>
                                <View
                                    style={[
                                        styles.horizontal,
                                        { backgroundColor: isBlue ? "#EEEEF0" : "#3A3A3C" },
                                    ]}
                                >
                                    <Touch
                                        onPress={() => {
                                            this.props.toggleListDisplayType();
                                            PiwikEventDataHandle("SbSportsVN_VerticalDisplaySidenav");
                                        }}
                                        style={[
                                            styles.horizontalBtn,
                                            {
                                                backgroundColor:
                                                    userSetting.ListDisplayType != 2
                                                        ? "#00a6ff"
                                                        : "transparent",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    userSetting.ListDisplayType != 2 ? "#fff" : "#999999",
                                                fontSize: 12,
                                            }}
                                        >
                                            Dọc
                                        </Text>
                                        {/* 纵向 */}
                                    </Touch>
                                    <Touch
                                        onPress={() => {
                                            this.props.toggleListDisplayType();
                                            PiwikEventDataHandle("SbSportsVN_HorizontalDisplaySidenav");
                                        }}
                                        style={[
                                            styles.horizontalBtn,
                                            {
                                                backgroundColor:
                                                    userSetting.ListDisplayType == 2
                                                        ? "#00a6ff"
                                                        : "transparent",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    userSetting.ListDisplayType == 2 ? "#fff" : "#999999",
                                                fontSize: 12,
                                            }}
                                        >
                                            Ngang
                                        </Text>
                                        {/* 横向 */}
                                    </Touch>
                                </View>
                            </View>

                            <View style={[styles.listItemList]}>
                                <Touch
                                    onPress={() => {
                                        this.actionPage("setSystem");
                                    }}
                                    style={styles.iconListBtn}
                                >
                                    <Text
                                        style={{
                                            color: isBlue ? "#222222" : "#CCCCCC",
                                            fontSize: 12,
                                        }}
                                    >
                                        Cài Đặt Hệ Thống
                                    </Text>
                                    {/* 系统设置 */}
                                </Touch>
                            </View>

                            <View style={[styles.listItemList]}>
                                <Touch
                                    onPress={() => {
                                        this.actionPage("setPush");
                                    }}
                                    style={styles.iconListBtn}
                                >
                                    <Text
                                        style={{
                                            color: isBlue ? "#222222" : "#CCCCCC",
                                            fontSize: 12,
                                        }}
                                    >
                                        Cài Đặt Thông Báo
                                    </Text>
                                    {/* 推送设置 */}
                                </Touch>
                                {UserLogin && setTing && (
                                    <View style={[styles.Popover]}>
                                        <Touch
                                            onPress={() => {
                                                this.closePopver("setTing");
                                            }}
                                            style={styles.PopoverConten}
                                        >
                                            <View
                                                style={[
                                                    styles.arrow,
                                                    {
                                                        borderTopColor: "transparent",
                                                        borderLeftColor: "transparent",
                                                        borderBottomColor: "transparent",
                                                    },
                                                ]}
                                            />
                                            <Text style={styles.popoverText}>
                                                Cài đặt thông báo tỷ số
                                            </Text>
                                            {/* 赛事进球推送设置 */}
                                            <CloseIcon width={15} height={15}></CloseIcon>
                                        </Touch>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    <View style={[styles.lineStyle, { height: isBlue ? 1 : 0 }]}></View>

                    <View style={styles.listItem}>
                        <Touch
                            onPress={() => {
                                Actions.pop();
                                Actions.Rules();
                                PiwikEventDataHandle("SbSportsVN_BettingRulesSidenav");
                            }}
                            style={styles.iconBtn}
                        >
                            <Image
                                resizeMode="stretch"
                                source={ImagesUrl.rules}
                                style={styles.iconBtn2}
                            />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Điều Kiện Điều Khoản Cược
                            </Text>
                            {/* 投注规则 */}
                        </Touch>
                    </View>
                    <Touch
                        style={styles.listItem}
                        onPress={() => {
                            this.setState({ tutorialDisplay: !tutorialDisplay });
                        }}
                    >
                        <View style={styles.iconBtn}>
                            <Image
                                resizeMode="stretch"
                                source={ImagesUrl.tutorial}
                                style={styles.iconBtn2}
                            />
                            <Text
                                style={[
                                    styles.titleStyle,
                                    { color: isBlue ? "#000" : "#F5F5F5" },
                                ]}
                            >
                                Hướng Dẫn Cược
                            </Text>
                            {/* 新手教程 */}
                        </View>

                        {/* 展開箭 */}
                        <Touch
                            style={styles.arrowStyle}
                            onPress={() =>
                                this.setState({ tutorialDisplay: !tutorialDisplay })
                            }
                        >
                            <ArrowIcon fill={"#999"} width={16} height={16} direction={tutorialDisplay ? "top" : "bottom"} wrapStyle={{ marginLeft: 10 }} />
                        </Touch>

                        {tutorial && (
                            <View style={[styles.Popover]}>
                                <Touch
                                    onPress={() => {
                                        this.closePopver("tutorial");
                                    }}
                                    style={styles.PopoverConten}
                                >
                                    <View
                                        style={[
                                            styles.arrow,
                                            {
                                                borderTopColor: "transparent",
                                                borderLeftColor: "transparent",
                                                borderBottomColor: "transparent",
                                            },
                                        ]}
                                    />
                                    <Text style={styles.popoverText}>Hướng dẫn người mới</Text>
                                    {/* 新手教程讲解 */}
                                    <CloseIcon width={15} height={15}></CloseIcon>
                                </Touch>
                            </View>
                        )}
                    </Touch>
                    {tutorialDisplay && (
                        <View
                            style={{ backgroundColor: isBlue ? "transparent" : "#111111" }}
                        >
                            <View style={[styles.listItemList]}>
                                <Touch
                                    onPress={() => {
                                        Actions.pop();
                                        PiwikEventDataHandle("SbSportsVN_OddsTutorialSidenav");
                                        Actions.BetTutorial({ types: "trends" });
                                    }}
                                    style={styles.iconListBtn}
                                >
                                    <Text
                                        style={{
                                            color: isBlue ? "#222222" : "#CCCCCC",
                                            fontSize: 12,
                                        }}
                                    >
                                        Hướng Dẫn Về Tỷ Lệ Cược
                                    </Text>
                                    {/* 盘口教程 */}
                                </Touch>
                            </View>
                            <View style={[styles.listItemList]}>
                                <Touch
                                    onPress={() => {
                                        Actions.pop();
                                        PiwikEventDataHandle("SbSportsVN_BetTutorialSidenav");
                                        Actions.BetTutorial({ types: "bet" });
                                    }}
                                    style={styles.iconListBtn}
                                >
                                    <Text
                                        style={{
                                            color: isBlue ? "#222222" : "#CCCCCC",
                                            fontSize: 12,
                                        }}
                                    >
                                        Hướng Dẫn Đặt Cược
                                    </Text>
                                    {/* 投注教程 */}
                                </Touch>
                            </View>
                        </View>
                    )}

                    <View style={[styles.lineStyle, { height: isBlue ? 1 : 0 }]}></View>

                    {lowerV == "SABA" && (
                        <View style={styles.listItem}>
                            <View style={styles.listItem}>
                                <Touch onPress={() => {
                                    PiwikEventDataHandle("SbSportsVN_OWSportVendorSidenav");
                                    Actions.pop();
                                    Actions.pop();
                                    Actions.pop();
                                    Actions.pop();
                                    if (CheckLogin()) return;


                                    setTimeout(() => {
                                        //處理sb2.0遊戲token (開官方網頁版，會刷掉先前獲取的token)
                                        console.log("===removeVendorToken saba");
                                        removeVendorToken("saba");
                                        this.props.playGame({
                                            providerCode: "OWS",
                                            gameId: null,
                                            categoryCode: "Sportsbook"
                                        });
                                        //goToVenderGame('SABA');
                                    }, 1200);
                                }} style={styles.iconBtn}>
                                    <Image resizeMode='stretch' source={ImagesUrl.backtogameVn} style={styles.iconBtn2} />
                                    <Text style={[styles.titleStyle, { color: isBlue ? "#000" : "#F5F5F5" }]}>Giao Diện Thông Thường</Text>
                                    {/* SABA vender */}
                                </Touch>
                            </View>
                        </View>
                    )}
                    {
                        // ApiPort.UserLogin &&
                        <View style={styles.listItem}>
                            <Touch
                                onPress={() => {
                                    this.logout();
                                    PiwikEventDataHandle("SbSportsVN_BackMainSiteSidenav");
                                }}
                                style={styles.iconBtn}
                            >
                                <Image
                                    resizeMode="stretch"
                                    source={ImagesUrl.loginOut}
                                    style={styles.iconBtn2}
                                />
                                <Text
                                    style={[
                                        styles.titleStyle,
                                        { color: isBlue ? "#000" : "#F5F5F5" },
                                    ]}
                                >
                                    Trang Chủ
                                </Text>
                                {/* 返回乐天堂 */}
                            </Touch>
                        </View>
                    }
                    {/* 關閉按鈕 */}
                    <Touch
                        onPress={() => {
                            this.close();
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#00A6FF",
                                borderRadius: 60,
                                justifyContent: "center",
                                alignSelf: "center",
                                marginTop: 10,
                                marginBottom: 30,
                            }}
                        >
                            <CloseIcon width={24} height={24}></CloseIcon>
                        </View>
                    </Touch>
                </ScrollView>
                {
                    //     <Text style={{textAlign: 'center', lineHeight: 38}}>
                    //     版本号: v{Rb88Version}
                    // </Text>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting,
});
const mapDispatchToProps = {
    toggleListDisplayType: () => ACTION_UserSetting_ToggleListDisplayType(),
    userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
    playGame: (data) => actions.ACTION_PlayGame(data),
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
        // justifyContent: 'space-between',
        alignItems: "center",
        // flexDirection: 'row',
        padding: 15,
        paddingVertical: 25,
    },
    userName: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 15,
        paddingVertical: 10,
        marginBottom: 10,
        marginRight: 10,
    },
    listItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 15,
    },
    listItemList: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 40,
    },
    iconBtn: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 10,
        width: "100%"
    },
    iconListBtn: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 25,
        paddingTop: 5,
        paddingBottom: 5,
        width: "100%"
    },
    Popover: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        right: 10,
        zIndex: 1000,
        // left: 100,
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
        paddingVertical: 8,
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
        borderRightColor: "#363636",
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
    titleStyle: {
        color: "#000",
        fontSize: 12,
        // paddingBottom:3,
        fontWeight: "500",
    },
    loginBtn: {
        width: 110,
        height: 32,
        justifyContent: "center",
        borderRadius: 17,
        marginTop: 5,
    },
    arrowDown: {
        position: "absolute",
        bottom: -13,
        right: 20,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: "solid",
        borderWidth: 7,
        borderTopColor: "#363636",
        borderLeftColor: "#ffffff",
        borderBottomColor: "#ffffff",
        borderRightColor: "#ffffff",
    },
    popoverText: {
        color: "#fff",
        paddingRight: 5,
        fontSize: 11,
        letterSpacing: -0.5,
    },
    iconBtn2: {
        width: 26,
        height: 26,
        marginRight: 7,
    },
    lineStyle: {
        height: 1,
        backgroundColor: "#E5E5E5",
        width: width - 50,
        alignSelf: "center",
        marginBottom: 10,
    },
    arrowStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 109999,
        padding: 4,
        position: "absolute",
        width: 26,
        height: 26,
        right: 15,
    },
});
