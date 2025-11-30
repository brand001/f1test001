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
import { ImagesUrl } from "@/images/index";
import SnapCarousel, {

    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import { Flex, WingBlank, WhiteSpace, Tabs, Drawer } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import React from "react";
// import { ChangeSvg } from '$LIB/js/util';
// import Router from 'next/router';
import { connect } from "react-redux";
import i18n from "../../../lib/vendor/vendori18n";

class SelectionOdds extends React.Component {

    isOddsUpOrDown = (SelectionData, list) => {
        if (SelectionData && list) {
            const thisKey = SelectionData.EventId + "|||" + SelectionData.LineId + "|||" + SelectionData.SelectionId;
            return (list.Selections[thisKey] === true);
        }
        return false;
    };

    render() {
        const { Vendor, OddsUpData, OddsDownData, SelectionData, ClickOdds, LineIsLocked, SelectionCountInLine } = this.props;
        const isComboBet = this.props.betCartInfo["isComboBet" + Vendor.configs.VendorName];
        const betCartData = this.props.betCartInfo["betCart" + Vendor.configs.VendorName];

        const IsCorrectScore = (this.props.EventType === "CORRECTSCORE");

        const Upstatus = this.isOddsUpOrDown(SelectionData, OddsUpData);
        const Downstatus = this.isOddsUpOrDown(SelectionData, OddsDownData);
        const CheckSelect = isComboBet ? betCartData.filter((i) => i.SelectionId == SelectionData.SelectionId) : [];
        let SelectionName = SelectionData.SelectionName;


        //讓球不要展示主客
        if (
            ( //IM
                Vendor.configs.VendorName === "IM"
                && SelectionData.BetTypeId === 1
                && SelectionData.BetTypeName
                && (SelectionData.BetTypeName.indexOf("Cược Chấp") !== -1)
                && ([1, 2].indexOf(SelectionData.SelectionType) !== -1)
            )
            ||
            ( //SABA
                Vendor.configs.VendorName === "SABA"
                && [1, 7, 17].indexOf(SelectionData.BetTypeId) !== -1
                && SelectionData.BetTypeName
                && (SelectionData.BetTypeName.indexOf("Cược Chấp") !== -1)
                && (["a", "h"].indexOf(SelectionData.SelectionType) !== -1)
            )
            ||
            ( //BTI
                Vendor.configs.VendorName === "BTI"
                && ["2_0", "2_1", "2_2", "2_39"].indexOf(SelectionData.BetTypeId) !== -1
                && SelectionData.BetTypeName
                && (SelectionData.BetTypeName.indexOf("Cược Chấp") !== -1)
                && (["Home", "Away"].indexOf(SelectionData.SelectionType) !== -1)
            )
        ) {
            SelectionName = SelectionName ? SelectionName.replace(i18n.HOME, "").replace(i18n.AWAY, "") : SelectionName;
        }

        //沙巴三項讓球特殊處理
        let isSABA3Hadicap = false;
        if (
            Vendor.configs.VendorName === "SABA"
            && SelectionData.BetTypeId === 28
            && SelectionData.BetTypeName
            && (SelectionData.BetTypeName.indexOf("3 Cửa") !== -1)
            && (["1", "x", "2"].indexOf(SelectionData.SelectionType) !== -1)
        ) {
            isSABA3Hadicap = true;
        }

        let width = this.props.detailWidth;
        return (
            (LineIsLocked || SelectionData.SelectionIsLocked) ? (
                <View
                    style={[styles.SelectionHeader, { width: width * 0.8 },
                    SelectionCountInLine == 3 ? { width: width * 0.3, } : {},
                    SelectionCountInLine == 2 ? { width: width * 0.4, } : {},
                    { justifyContent: "center" },
                    IsCorrectScore ? { width: "100%", flexGrow: 0 } : {},
                    { backgroundColor: isBlue ? "#f7f7f7" : "#545457" }
                    ]}
                >
                    <Image resizeMode='stretch' source={ImagesUrl.locked} style={{ width: 15, height: 15 }} />
                </View>
            ) : (
                <Touch
                    onPress={() => {
                        ClickOdds(SelectionData);
                    }}
                    style={[styles.SelectionHeader, { width: width * 0.8 },
                    SelectionCountInLine == 3 ? { width: width * 0.3, flexGrow: 0, paddingHorizontal: 8, marginHorizontal: 0, height: isSABA3Hadicap ? 52 : 32, paddingVertical: isSABA3Hadicap ? 8 : 0 } : {},
                    SelectionCountInLine == 2 ? { width: width * 0.4, } : {},
                    IsCorrectScore ? { width: "100%", flexGrow: 0 } : {},
                    CheckSelect != "" ? { borderColor: "#00a6ff", borderWidth: 1 } : {},
                    { backgroundColor: isBlue ? "#f7f7f7" : "#545457" }
                    ]}
                >
                    {
                        SelectionName != "" &&
                        <Text style={[{ fontSize: 10, color: "#999999" },
                        SelectionCountInLine == 1 ? { fontSize: 11, width: width * 0.4 } : {},
                        SelectionCountInLine == 3 ? { fontSize: 11, width: isSABA3Hadicap ? width * 0.4 : width * 0.15 } : {},
                        IsCorrectScore ? { width: "auto" } : {},
                        ]}>{SelectionName == "Tie" ? "Hòa" : SelectionName}</Text>
                    }
                    {SelectionData.Handicap !== null ? <Text style={{ color: isBlue ? "#666666" : "#999999", fontSize: 12 }}>{SelectionData.Handicap}</Text> : null}
                    <View style={[
                        { display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" },
                        SelectionCountInLine == 1 ? { width: width * 0.2 } : {},
                        IsCorrectScore ? { width: "auto" } : {},
                    ]}>
                        {!SelectionData.DisplayOdds || SelectionData.DisplayOdds == 0 ? (
                            <Text style={{ color: "#000" }}>—</Text>
                        ) : (
                            // <span
                            // 	dangerouslySetInnerHTML={{
                            // 		__html: ChangeSvg(SelectionData.DisplayOdds)
                            // 	}}
                            // 	className="NumberBet"
                            // />
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: Downstatus ? "red" : Upstatus ? "#0ccc3c" : (isBlue ? "#000" : "#F5F5F5")
                                }}
                            >
                                {SelectionData.DisplayOdds}
                            </Text>
                        )}

                        <View style={{ position: "absolute", right: -8, top: 0 }}>
                            {Downstatus ? (
                                <Image resizeMode='stretch' source={ImagesUrl.roundDownVn} style={{ width: 10, height: 10 }} />
                                // <img src="/svg/betting/round-down.svg" />
                            ) : Upstatus ? (
                                <Image resizeMode='stretch' source={ImagesUrl.roundUpVn} style={{ width: 10, height: 10 }} />
                                // <img src="/svg/betting/round-up.svg" />
                            ) : (
                                null
                            )}
                        </View>
                    </View>
                </Touch>
            )
        );
    }
}

const mapStateToProps = (state) => ({
    betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionOdds);

const styles = StyleSheet.create({
    listData: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    },
    SelectionHeader: {
        backgroundColor: "#f7f7f7",
        height: 32,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        // flexWrap: 'wrap',
        borderRadius: 77,
        marginTop: 8,
        marginHorizontal: 8,
        paddingHorizontal: 16,
        flexShrink: 0,
        flexGrow: 1,
    },
});
