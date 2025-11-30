import React from "react";
import "./SbVnDomain";

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
import LoopCarousel from "react-native-looped-carousel";
import SnapCarousel, {

    Pagination
} from "react-native-snap-carousel";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import EventListing from "../game/EventListing";
import HomeHeader from "./HomeHeader";
import { Decimal } from "decimal.js";
import VendorIM from "../lib/vendor/im/VendorIM";
import VendorBTI from "../lib/vendor/bti/VendorBTI";
import VendorSABA from "../lib/vendor/saba/VendorSABA";
const { width, height } = Dimensions.get("window");
import BottomtimeIcon from "../game/Footer/bottomtimeIcon";
import Recommend from "./Recommend";
import Layout from "./Layout";
import BetCartPopup from "../game/Betting/BetCartPopup";
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from "$LIB/redux/actions/UserInfoAction";
const { Openinstall, Iovation } = NativeModules;
import OneWallet from "@/containers/Game/AviatorGame/index";
import actions from "$LIB/redux/actions/index";
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
            showRecommend: false,
            headerKey: 0
        };
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
        this.getBlockBox();
    }

    componentWillUnmount() {
        VendorSABA.stopTokenRenewWhenLeave(); //沙巴停止更新token
        VendorBTI.stopTokenRenewWhenLeave(); //BTI停止更新token
    }
    /** 獲取黑盒子參數*/
    getBlockBox() {
        //获取E2
        if (Platform.OS === "android") {
            Iovation && Iovation.getE2BlackBox && Iovation.getE2BlackBox(
                event => {
                    E2Backbox = event;
                },
                errorCallback => {}
            );
        } else {
            Openinstall && Openinstall.getE2BlackBox && Openinstall.getE2BlackBox((error, event) => {
                if (error) {

                } else {
                    E2Backbox = event;
                }
            });
        }
    }
    changeRecommed(flag) {
        console.log("flag", flag);
        this.setState({
            showRecommend: flag
        });
    }

    render() {
        window.changeGame = (key) => {
            const vendorMap = {
                "IM": VendorIM,
                "BTI": VendorBTI,
                "SABA": VendorSABA,
            };

            let Vendor = vendorMap[key];
            window.lowerV = key;
            window.VendorData = Vendor;
            this.setState({
                Vendor,
                VendorKey: Math.ceil(Math.random() * 100000),
                VendorLayoutKey: Math.ceil(Math.random() * 100000),
                lowerV: key,
            });

        };
        window.changeGameKey = () => {
            //切换盘口，刷新盘率
            this.setState({ VendorKey: Math.ceil(Math.random() * 100000), });
        };
        window.changeheaderKey = () => {
            //切换盘口，刷新盘率
            this.setState({ headerKey: Math.ceil(Math.random() * 100000), });
        };

        const {
            Vendor,
            VendorKey,
            VendorLayoutKey,
            showRecommend,
            headerKey
        } = this.state;
        let { allBalance = [] } = this.props.userInfo;
        let balanceItem = allBalance.find(v => v.walletProductGroupCode == "SB" || v.walletProductGroupId == 2) || {};

        return <View style={{ flex: 1, backgroundColor: isBlue ? "#EFEFF4" : "#2C2C2E" }}>
            <HomeHeader sbType={this.props.sbType} key={headerKey} />
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
            <EventListing key={VendorKey} Vendor={Vendor} showRecommend={showRecommend} gotoWorldCup={this.props.gotoWorldCup} />

            {/* 早盘日期选择 */}
            <View style={{ position: "absolute", bottom: 100, alignSelf: "center" }}>
                <BottomtimeIcon />
            </View>
            {/* 热门赛事 */}
            <Recommend showRecommend={showRecommend} changeRecommed={(e) => this.changeRecommed(e)} />
            {/* 推送 */}
            <Layout key={VendorLayoutKey} Vendor={Vendor} />
            {/* Tabbar */}
        </View>;
    }
}

const mapStateToProps = state => ({
    userSetting: state.userSetting,
    userInfo: state.userInfo,
});
const mapDispatchToProps = dispatch => ({
    userInfo_login: userName => ACTION_UserInfo_login(userName),
    userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
    changeOnClickPopup: (flag) => { dispatch(actions.ACTION_ONECLICKPOPUP(flag)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({


});
