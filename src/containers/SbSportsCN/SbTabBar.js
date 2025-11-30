import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, Image } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import actions from "@/lib/redux/actions/index";

import { HomeSbIcon, HomeSbActiveIcon, RecordSbIcon, RecordSbActiveIcon, SbSettingIcon, ProIcon, ProActiveIcon, AviatorActiveIcon, AviatorIcon } from "$Components/icons/index.js";
import { CheckLogin } from "$Utils";
import CornerLabel from "$Components/CornerLabel";
import { ImagesUrl } from "@/images/index";

const { width, height } = Dimensions.get("window");
let data = {
    SbSports: {
        title: "首页",
        icon: selected => (selected ? <HomeSbActiveIcon language={window.LANGUAGE} /> : <HomeSbIcon language={window.LANGUAGE} />),

    },
    personalSBWrap: {
        title: "菜单",
        icon: selected => (selected ? <SbSettingIcon language={window.LANGUAGE} /> : <SbSettingIcon language={window.LANGUAGE} />),
    },
    betRecordSBWrap: {
        title: "注单",
        icon: selected => (selected ? <RecordSbActiveIcon language={window.LANGUAGE} /> : <RecordSbIcon language={window.LANGUAGE} />),
    },
    SbAirCraftWrap: {
        title: "夺金战机",
        icon: selected => (selected ? <AviatorActiveIcon language={window.LANGUAGE} /> : <AviatorIcon language={window.LANGUAGE} />),
    },
    promotionSBWrap: {
        title: "优惠",
        icon: selected => (selected ? <ProActiveIcon language={window.LANGUAGE} /> : <ProIcon language={window.LANGUAGE} />),
    },
};

class SbTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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
                                    style={{ backgroundColor: "#FFFFFF", width: 56, height: 54, justifyContent: "flex-end" }}
                                    onPress={() => {
                                        if (element.key === "SbAirCraftWrap" || element.key === "betRecordSBWrap") {
                                            if (CheckLogin()) return;

                                            if (element.key === "SbAirCraftWrap") {
                                                window.getAviator && window.getAviator("sb");
                                                return;
                                            }
                                        }

                                        window.CheckUptateGlobe &&
                                            window.CheckUptateGlobe(false);
                                        Actions[element.key]();
                                    }}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <View style={styles.tabIconImg}>{icon(select)}</View>
                                        <Text
                                            style={{ color: select ? "#00A6FF" : "#666", fontSize: 12, marginTop: 2 }}>{data[element.key].title}</Text>
                                    </View>

                                    {select && (
                                        <Image resizeMode='stretch'
                                            style={{
                                                position: "absolute", top: -16, zIndex: 1, width: 56, height: 15, right: 0
                                            }}
                                            source={ImagesUrl.sbActive3}
                                        />
                                    )}
                                    {element.key === "SbAirCraftWrap" && (
                                        (this.props.gameMaintainStatus && this.props.gameMaintainStatus.isComingSoon) ? (
                                            <CornerLabel
                                                slope={false}
                                                type={"COMING"}
                                                wrapStyle={[styles.gameStatus, { right: -15 }]}
                                            />
                                        ) : (this.props.gameMaintainStatus && this.props.gameMaintainStatus.isNew) ? (
                                            <CornerLabel
                                                slope={false}
                                                type={"NEW"}
                                                wrapStyle={styles.gameStatus}
                                            />
                                        ) : (this.props.gameMaintainStatus && this.props.gameMaintainStatus.isHot) && (
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
        right: -2,
    },
});
