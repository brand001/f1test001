import React, { Component } from "react";
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
    Animated,
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
import ImageForLeague from "../game/RNImage/ImageForLeague";
const { width, height } = Dimensions.get("window");
import { ArrowIcon } from "$Components/icons/index";

class Accordion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tltleList: this.props.tltleList || "",
            showList: this.props.showsAll,
            showsAll: this.props.showsAll,
        };
    }
    componentDidUpdate(res) {

        if (this.props.showsAll != this.state.showsAll) {
            this.setState({ showList: this.props.showsAll, showsAll: this.props.showsAll });
        }
    }

    componentDidMount() {}

    componentWillUnmount() {}


    shows() {
        this.props.closeAccordion(!this.state.showList);
        this.setState({ showList: !this.state.showList });
    }

    render() {
        const {
            showList,
            tltleList,
        } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableOpacity onPress={() => { this.shows(); }}>
                        <View style={styles.titleView}>
                            <View style={styles.titles}>
                                <ImageForLeague LeagueId={this.props.tltleList.LeagueId} />
                                <Text style={{ color: "#999", paddingLeft: 10, width: width * 0.82 }} numberOfLines={1}>{this.props.tltleList != "" && this.props.tltleList.LeagueName}</Text>
                            </View>
                            <ArrowIcon direction={showList ? "top" : "bottom"} fill="#A0A0A0" width={16} height={16}></ArrowIcon>
                        </View>
                    </TouchableOpacity>
                    <View style={showList ? { backgroundColor: "#fff" } : { height: 0, overflow: "hidden" }}>
                        {this.props.children}
                    </View>

                </View>
            </View>
        );
    }
}


export default Accordion;

const styles = StyleSheet.create({
    titleView: {
        backgroundColor: "#EFEFF4",
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: 12,
        paddingRight: 16,
        alignItems: "center",
        flexDirection: "row",
        height: 38,
    },
    titles: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    }
});
