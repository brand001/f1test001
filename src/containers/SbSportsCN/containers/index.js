import React, { Component } from "react";
import "./SbCnDomain";
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    View,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Linking,
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
// import fetch from 'fetch-with-proxy';
import { Flex, WingBlank, WhiteSpace, Tabs, Drawer } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import EventListing from "../game/EventListing";
import HomeHeader from "./HomeHeader";
import { ImagesUrl } from "@/images/index";
import { Decimal } from "decimal.js";
import VendorIM from "./../lib/vendor/im/VendorIM";
import VendorBTI from "./../lib/vendor/bti/VendorBTI";
import VendorSABA from "./../lib/vendor/saba/VendorSABA";
const { width, height } = Dimensions.get("window");
import BottomtimeIcon from "../game/Footer/bottomtimeIcon";
import Recommend from "./Recommend";
import Layout from "./Layout";
import BetCartPopup from "../game/Betting/BetCartPopup";
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from "$LIB/redux/actions/UserInfoAction";
import FastImage from "react-native-fast-image"; //android 拿黑盒子
import { vendorStorage } from "../lib/vendor/vendorStorage";
import actions from "@/lib/redux/actions/index";
import OneWallet from "@/containers/Game/AviatorGame/index";
import ExpandArrow from "$Components/ExpandArrow";
import Color from "$Components/Color";
class Home extends React.Component {
    // static navigationOptions = ({ navigation }) => {
    // 	return {
    // 		headerStyle: {
    // 			backgroundColor: "#00a6ff",
    // 			borderBottomWidth: 0,
    // 			maintenancePopup: false,
    // 			maintenanceSport: '乐天堂体育',
    // 			jumpToSport: 'IM体育',
    // 			lowerV: 'BTI'
    // 		},
    // 		headerTitle: <HomeHeader />,
    // 	};
    // };

    constructor(props) {
        super(props);
        this.state = {
            balance: "0.00",
            Vendor: VendorIM,
            VendorKey: 0,
            VendorLayoutKey: 1,
            sbType: this.props.sbType,
            SportId: this.props.SportId
        };

        // CheckDataVersion有多個同時執行個可能
        this.isCheckingVersion = false;
    }

    componentWillMount() {
        window.VendorData = VendorIM;
        window.lowerV = "IM";
        if (ApiPort.UserLogin == true) {
            // this.Checkdomin();
            // this.getMainDomain();
            // this.getServerUrl();
            //新注册用户需要二次获取信息
            window.GetMessageCounts && window.GetMessageCounts();
        }

    }
    componentDidMount() {
        this.CheckDataVersion();
    }

    componentWillUnmount() {
        VendorSABA.stopTokenRenewWhenLeave(); //沙巴停止更新token
        VendorBTI.stopTokenRenewWhenLeave(); //BTI停止更新token
    }

    // 檢測使用何種data版本
    // enforce表示一定要檢查，不管isFetching
    CheckDataVersion(enforce = false) {
        const { Vendor } = this.state;

        // 防止多個在跑
        if (this.isCheckingVersion && !enforce) {
            return;
        }
        this.isCheckingVersion = true;

        const switchApiVersion = (useNewApi) => {
            if (Vendor.configs.VL !== useNewApi) {
                Vendor.configs.VL = useNewApi;
                this.setState({
                    VendorKey: Math.ceil(Math.random() * 100000),
                    VendorLayoutKey: Math.ceil(Math.random() * 100000),
                });
            }
        };

        fetch(`${Strapi_Domain + ApiPort.sbDataVersion}`)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                // 如果明確返回1.0，則切換到 vendor API (舊)模式，
                // 其他狀況(包含API獲取不到)，則保持 Data API (舊)模式
                if (!data.version) throw new Error("Version empty");
                switchApiVersion(data.version !== "1.0");
            })
            .catch(error => {
                console.log(`Error: ${error}. Defaulting to version 1.0`);
                switchApiVersion(false);
            }).finally(() => {
                this.isCheckingVersion = false;
            });
    }

    render() {
        window.changeGame = async (key) => {
            const vendorMap = {
                "IM": VendorIM,
                "BTI": VendorBTI,
                "SABA": VendorSABA,
            };

            let Vendor = vendorMap[key];
            window.lowerV = key;
            window.VendorData = Vendor;
            if (Vendor.configs.VendorName === "SABA") {
                // SABA未登入才用新api
                Vendor.configs.VL = !(vendorStorage.getItem("loginStatus") == 1);
            }
            this.setState({
                Vendor,
                VendorKey: Math.ceil(Math.random() * 100000),
                VendorLayoutKey: Math.ceil(Math.random() * 100000),
                lowerV: key,
                SportId: 1
            }, () => {
                // 新api目前只用在 IM 和 SABA未登入，其他情況不需檢查
                if (Vendor.configs.VendorName !== "BTI" && (Vendor.configs.VendorName === "SABA" && vendorStorage.getItem("loginStatus") != 1)) {
                    this.CheckDataVersion(true);
                }
            });

        };
        window.changeGameKey = () => {
            //切换盘口，刷新盘率
            this.setState({ VendorKey: Math.ceil(Math.random() * 100000), });
        };
        const {
            Vendor,
            VendorKey,
            VendorLayoutKey,
        } = this.state;


        let { allBalance = [] } = this.props.userInfo;
        let balanceItem = allBalance.find(v => v.walletProductGroupCode == "SB" || v.walletProductGroupId == 2) || {};


        return (
            <View style={{ flex: 1, position: "relative" }}>
                <HomeHeader sbType={this.props.sbType} />
                {
                    ApiPort.UserLogin && this.props.userSetting?.oneClickPopup?.flag &&
                    <OneWallet
                        showExpandArrow={true}
                        balanceItem={balanceItem}
                        fromPage='SB2'
                        top={(Platform.OS == "ios" ? (DeviceInfoIos ? (window.isDynamicIslandIOS ? 40 + 20 : 40) : 20) : 0) + 40}
                        animationDirection="vertical"
                        style={{
                            width,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10
                        }}
                    />
                }
                <View
                    style={{
                        position: "absolute",
                        zIndex: -1,
                        top: window.DeviceInfoIos ? 20 + 50 : 40,
                        left: 0,
                        width: width,
                        height: 125,
                    }}
                >
                    <Image
                        resizeMode="stretch"
                        style={{
                            width: width,
                            height: 125,
                        }}
                        source={ImagesUrl.headerBG3NewCn}
                    />
                </View>
                <EventListing key={VendorKey} Vendor={Vendor} SportId={this.state.SportId} fixedFloatIconHorizonPosition={true} />

                {/* 早盘日期选择 */}
                <View style={{ position: "absolute", bottom: 20, left: (width - 110) * 0.5, zIndex: 9999 }}>
                    <BottomtimeIcon />
                </View>
                {/* 热门赛事 */}
                <Recommend />
                {/* 推送 */}
                <Layout key={VendorLayoutKey} Vendor={Vendor} />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    userSetting: state.userSetting,
});
const mapDispatchToProps = dispatch => ({
    userInfo_login: userName => ACTION_UserInfo_login(userName),
    userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
    changeOnClickPopup: (flag) => { dispatch(actions.ACTION_ONECLICKPOPUP(flag)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({


});
