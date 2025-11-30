import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, Image } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import actions from "@/lib/redux/actions/index.js";
import { CheckLogin } from "$Utils";
import { HomeSbIcon, HomeSbActiveIcon, RecordSbIcon, RecordSbActiveIcon, SbSettingIcon, ProIcon, ProActiveIcon, AviatorActiveIcon, AviatorIcon } from "$Components/icons/index.js";
import { ImagesUrl } from "@/images/index";
const { width, height } = Dimensions.get("window");
let data = {
    SbSports: {
        title: "Thể Thao",
        icon: selected => (<Image style={{ width: 26, height: 26 }} resizeMode="stretch" source={selected ? ImagesUrl.homeNavVn : ImagesUrl.homeNav1Vn} />),
    },
    personalSBWrap: {
        title: "Danh Mục",
        icon: selected => (selected ? <SbSettingIcon language={window.LANGUAGE} /> : <SbSettingIcon language={window.LANGUAGE} />),
    },
    betRecordSBWrap: {
        title: "Lịch Sử Cược",
        icon: selected => (<Image style={{ width: 26, height: 26 }} resizeMode="stretch" source={selected ? ImagesUrl.betHistorySb1Vn : ImagesUrl.betHistorySbVn} />),
    },
    SbAirCraftWrap: {
        title: "Tỷ Phú Bay",
        icon: selected => (selected ? <AviatorActiveIcon language={window.LANGUAGE} /> : <AviatorIcon language={window.LANGUAGE} />),
    },
    promotionSBWrap: {
        title: "Khuyến Mãi",
        icon: selected => (selected ? <ProActiveIcon language={window.LANGUAGE} /> : <ProIcon language={window.LANGUAGE} />),
    },
};
import CornerLabel from "$Components/CornerLabel";
class SbTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    sendPiwik = (key) => {
        switch (key) {
            case "SbSports":
                break;
            case "promotionSBWrap":
                break;
            case "betRecordSBWrap":
                break;
            case "SbAirCraftWrap":
                break;
            case "personalSBWrap":
                break;
            default:
                break;
        }
    };

    render() {
        const { state } = this.props.navigation;
        const activeTabIndex = state.index;


        return (
            <View
                style={{
                    paddingBottom: DeviceInfoIos ? 30 : 10,
                    backgroundColor: "#FFFFFF",
                }}
            >
                <View style={[styles.headers, { alignItems: "flex-end", position: "relative" }]}>
                    {
                        state.routes.map((element, index) => {
                            const select = activeTabIndex == index;


                            let navigationKey = element.key;
                            let param = data[navigationKey];
                            let { icon = () => {} } = param;
                            return (
                                <TouchableOpacity
                                    key={element.key}
                                    style={{ backgroundColor: "#FFFFFF", width: width / 5, height: 54, justifyContent: "flex-end" }}
                                    onPress={() => {

                                        if (element.key === "SbAirCraftWrap" || element.key === "betRecordSBWrap") {
                                            if (CheckLogin()) return;

                                            if (element.key === "SbAirCraftWrap") {
                                                window.getAviator && window.getAviator("sb");
                                                return;
                                            }
                                        }


                                        if (element.key === "SbSports") {
                                            this.props.changeOnClickPopup({
                                                walletCode: "SB",
                                                flag: false
                                            });
                                        }

                                        window.CheckUptateGlobe &&
                                            window.CheckUptateGlobe(false);
                                        this.sendPiwik(element.key);
                                        if (element.key == "personalSBWrap") {
                                            Actions.personalSBWrapStack();
                                            return;
                                        }
                                        Actions[element.key]();
                                    }}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        {
                                            icon(select)
                                        }
                                        <Text
                                            style={{ color: select ? "#00A6FF" : "#999999", fontSize: 10, textAlign: "center", marginTop: 2 }}>{data[element.key].title}</Text>
                                    </View>
                                    {select && (
                                        <Image resizeMode='stretch'
                                            style={{
                                                position: "absolute", top: -16, zIndex: 1, width: width / 5, height: 15, right: 0
                                            }}
                                            source={ImagesUrl.sbActive3}
                                        />
                                    )}
                                    {element.key === "SbAirCraftWrap" && (
                                        this.props.gameMaintainStatus && this.props.gameMaintainStatus.isComingSoon ? (
                                            <CornerLabel
                                                slope={false}
                                                type={"COMING"}
                                                wrapStyle={[styles.gameStatus, { right: -15 }]}
                                            />
                                        ) : this.props.gameMaintainStatus && this.props.gameMaintainStatus.isNew ? (
                                            <CornerLabel
                                                slope={false}
                                                type={"NEW"}
                                                wrapStyle={styles.gameStatus}
                                            />
                                        ) : this.props.gameMaintainStatus && this.props.gameMaintainStatus.isHot && (
                                            <CornerLabel
                                                slope={false}
                                                type={"HOT"}
                                                wrapStyle={styles.gameStatus}
                                            />
                                        )
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    }
                </View>
            </View>
        );
    }
}


const mapStateToProps = (state) => ({
    gameMaintainStatus: state.gameInfo.maintainStatus,
    userSetting: state.userSetting,
});
const mapDispatchToProps = {
    userInfo_getBalance: (forceUpdate = false) => actions.ACTION_UserInfo_getBalanceAll(forceUpdate),
    changeOnClickPopup: (flag) => actions.ACTION_ONECLICKPOPUP(flag)
};

export default connect(mapStateToProps, mapDispatchToProps)(SbTabBar);

const styles = StyleSheet.create({
    headers: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        height: 56,
        width: width,
        backgroundColor: "#FFFFFF",
        zIndex: 99,
        // paddingHorizontal: 20 ,
        borderTopWidth: 1,
        borderTopColor: "#EFEFEF",
        // paddingVertical: 30
    },
    gameStatus: {
        position: "absolute",
        top: 4,
        right: 8,
    },
});
