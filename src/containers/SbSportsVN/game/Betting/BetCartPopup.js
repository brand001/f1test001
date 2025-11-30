/* 串关购物车浮窗 */
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
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {

    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";
import { connect } from "react-redux";
import { ACTION_BetCart_setIsComboBet } from "../../lib/redux/actions/BetCartAction";
import { ImagesUrl } from "@/images/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class _BetCartPopup extends React.Component {
    state = {};
    render() {
        const { Vendor, FromDetailPage } = this.props;
        const isComboBet = this.props.betCartInfo["isComboBet" + Vendor.configs.VendorName];
        const betCartData = this.props.betCartInfo["betCart" + Vendor.configs.VendorName];
        return (
            <View>
                {
                    global.localStorage.getItem("loginStatus") == 1 && betCartData && betCartData.length > 0 &&
                    <Touch
                        onPress={async () => {
                            if (!this.props.isLandscapeShow) {
                                this.props.setIsLandscape && this.props.setIsLandscape();
                            }
                            let betCartTabId = isComboBet == true ? 2 : 1; //1單注2串關
                            if (isComboBet == true && betCartData.length < 2) {
                                //投注選項不滿兩個，就切回單注模式
                                await this.props.betCart_setIsComboBet(false, Vendor.configs.VendorName);
                                betCartTabId = 1;
                            }
                            this.props.ShowBottomSheet(betCartTabId);
                            FromDetailPage ? PiwikEventDataHandle("SbSportsVN_BetcartMatchPage") :
                                PiwikEventDataHandle("SbSportsVN_BetcartMainPage");
                        }}
                        style={styles.iconView}
                    >
                        <Image source={ImagesUrl.groupVn} style={{ width: 65, height: 65 }} />
                        <View style={styles.numIcon}>

                            <Text style={{ color: "#fff" }}>{betCartData.length}</Text>
                        </View>
                    </Touch>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
    betCart_setIsComboBet: ACTION_BetCart_setIsComboBet,
};

export default connect(mapStateToProps, mapDispatchToProps)(_BetCartPopup);

const styles = StyleSheet.create({
    iconView: {
        bottom: 20
        // backgroundColor: '#00a6ff',
        // height: 55,
        // width: 55,
        // borderRadius: 130,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    numIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        // top: -10,
        right: -2,
        backgroundColor: "#fcab23",
        width: 25,
        height: 25,
        borderRadius: 30
    }
});
