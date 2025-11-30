/* 展示 一個賠率框=投注選項(Selection) 包含處理投注線鎖定狀態  */


import { dataIsEqual } from "../../../../../lib/js/util";
import { ImagesUrl } from "@/images/index";

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
import SelectionDesc from "./SelectionDesc";
import DisplayOdds from "./DisplayOdds";
const { width, height } = Dimensions.get("window");
import React from "react";
import { connect } from "react-redux";

class OddsCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        //指定要監控變化的prop
        this.MonitorProps = ["LineIsLocked"];
        //有使用的component: SelectionDesc 和 DisplayOdds，裡面有用到的字段，也要監控
        this.MonitorPropsOfSelectionData = ["EventId", "LineId", "SelectionId", "SelectionName", "Handicap", "DisplayOdds"];
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    isOddsUpOrDown = (SelectionData, list) => {
        if (SelectionData && list) {
            const thisKey = SelectionData.EventId + "|||" + SelectionData.LineId + "|||" + SelectionData.SelectionId;
            return (list.Selections[thisKey] === true);
        }
        return false;
    };

    //優化效能：只有指定的prop變化時才要重新渲染
    shouldComponentUpdate(nextProps, nextState) {
        //特別處理 賠率變化，直接判斷
        return !dataIsEqual(this.props.SelectionData, nextProps.SelectionData, this.MonitorPropsOfSelectionData)
            || !dataIsEqual(this.props, nextProps, this.MonitorProps)
            || !dataIsEqual(this.props.betCartInfo, nextProps.betCartInfo, ["isComboBet" + nextProps.Vendor.configs.VendorName])
            || JSON.stringify(this.props.betCartInfo["betCart" + this.props.Vendor.configs.VendorName]) !== JSON.stringify(nextProps.betCartInfo["betCart" + nextProps.Vendor.configs.VendorName])
            || this.isOddsUpOrDown(this.props.SelectionData, this.props.OddsUpData) !== this.isOddsUpOrDown(nextProps.SelectionData, nextProps.OddsUpData)
            || this.isOddsUpOrDown(this.props.SelectionData, this.props.OddsDownData) !== this.isOddsUpOrDown(nextProps.SelectionData, nextProps.OddsDownData);
    }

    render() {
        const { SelectionData, LineIsLocked, OddsUpData, OddsDownData, ClickOdds, IsHorizontal, LeftOrRight, hasFTCorrectScore } = this.props;
        const { Vendor } = this.props;
        const isComboBet = this.props.betCartInfo["isComboBet" + Vendor.configs.VendorName];
        const betCartData = this.props.betCartInfo["betCart" + Vendor.configs.VendorName];

        //console.log('=====Odds rendered', SelectionData ? SelectionData.EventId + '|||' + SelectionData.LineId + '|||' + SelectionData.SelectionId : 'NULL selection');

        const isOddsUp = this.isOddsUpOrDown(SelectionData, OddsUpData);
        const isOddsDown = this.isOddsUpOrDown(SelectionData, OddsDownData);

        const UpOrDown = (
            (isOddsUp === true)
                ? "UP"
                : ((isOddsDown === true) ? "DOWN" : "")
        );
        /* 高亮 */
        const MoreStatus = isComboBet && isComboBet != "false";
        const CheckSelect =
            MoreStatus && SelectionData
                ? betCartData.filter((i) => i.SelectionId == SelectionData.SelectionId)
                : [];
        return (
            <>
                {(LineIsLocked || SelectionData.SelectionIsLocked) ? (
                    <View style={[styles.noactive, { justifyContent: "center", backgroundColor: isBlue ? "#f7f7f7" : "#545457", }, IsHorizontal ? { height: 34, flex: 1, marginHorizontal: 4, marginBottom: 0 } : {}]}>
                        <Image resizeMode='stretch' source={ImagesUrl.locked} style={{ width: 15, height: 15 }} />
                    </View>
                ) : (
                    <Touch
                        // className={
                        // 	CheckSelect != '' ? 'Game-indicators active' : 'Game-indicators'
                        // }
                        style={[CheckSelect != "" ? {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            backgroundColor: isBlue ? "#e6f6ff" : "#2C2C2E",
                            borderRadius: 5,
                            height: 42,
                            marginBottom: 5,
                            borderColor: "#00a6ff",
                            borderWidth: 1,
                            paddingHorizontal: 7,
                        } : {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            backgroundColor: isBlue ? "#f7f7f7" : "#545457",
                            borderRadius: 5,
                            height: 42,
                            marginBottom: 5,
                            paddingHorizontal: 3,
                        }, IsHorizontal ? { height: 34, flex: 1, marginHorizontal: 4, marginBottom: 0 } : {}]}
                        onPress={() => {
                            ClickOdds(SelectionData);
                        }}
                    >
                        {/* 玩法選項 說明 */}
                        <SelectionDesc SelectionData={SelectionData} IsHorizontal={IsHorizontal} LeftOrRight={LeftOrRight} hasFTCorrectScore={hasFTCorrectScore} />
                        {/* 賠率 包含上下變化 */}
                        <DisplayOdds SelectionData={SelectionData} UpOrDown={UpOrDown} />
                    </Touch>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    betCartInfo: state.betCartInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(OddsCell);

const styles = StyleSheet.create({
    active: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: isBlue ? "#e6f6ff" : "#2C2C2E",
        borderRadius: 5,
        height: 42,
        marginBottom: 5,
        borderColor: "#00a6ff",
        borderWidth: 1,
        paddingHorizontal: 5,
    },
    noactive: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        height: 42,
        marginBottom: 5,
        paddingHorizontal: 5,
    },
});
