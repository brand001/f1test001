import React, { Component } from "react";
import {
    ScrollView,
    View,
    TextInput,
    Text,
    Dimensions,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Modal,
    StyleSheet,
    Linking,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { WhiteSpace, Switch } from "@ant-design/react-native";
const { width, height } = Dimensions.get("window");
import Touch from "react-native-touch-once";
import { CloseIcon } from "$Components/icons/index";
import StorageUtil from "$Utils/Storage";
const guideList = [
    "Bấm để tìm kiếm trận đấu nhanh",
    "Lựa Chọn Danh Mục Thể Thao",
    "Chọn Tỷ Lệ và Cược Ngay",
];

class Guide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guide: false,
            activeKey: 0,
            guideKey: 0,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        // setTimeout(() => {
        if (ApiPort.UserLogin) {
            console.log("guide");
            this.guide();
        }
        // }, 2000);
    }

    componentWillUnmount() {}

    //新手引导
    async guide() {
        const guideData = await StorageUtil.load("guide3");
        if (!guideData) {
            console.log(456);
            this.setState({ guide: true });
            StorageUtil.save({
                key: "guide3",
                data: "guide3"
            });
        } else {
            console.log(123);
        }
    }
    GuideChange(key) {
        if (key == 3) {
            this.setState({ guide: false });
            //打开推荐
            // window.ShowHotEvents && window.ShowHotEvents()
            return;
        }
        this.setState({ activeKey: key });
        this.props.GuideChange(key);
    }
    guideKey(key) {
        //点击2次关闭
        let guideKey = this.state.guideKey;
        guideKey += 1;
        this.setState({ guideKey });


        if (guideKey == 2 || key == 1) {
            this.setState({ guide: false });
            //打开推荐
            //  window.ShowHotEvents && window.ShowHotEvents()
        }
    }
    render() {
        const {
            guide,
            activeKey,
        } = this.state;

        const {
            GuideLeft,
            GuideTop,
        } = this.props;
        window.showGuide = () => {
            this.guide();
        };
        return (
            <View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={guide}
                    supportedOrientations={["portrait", "landscape"]}
                    onRequestClose={() => {}}
                >
                    <View style={{ flex: 1 }}>
                        {/* <Touch onPress={() => { this.guideKey() }} style={styles.marsk}></Touch> */}
                        <View style={{ height: height }}>
                            {
                                guideList.map((item, index) => {
                                    return (
                                        activeKey == index &&
                                        <View key={index}
                                            style={[activeKey == 0 ? styles.block0 : activeKey == 1 ? styles.block1 : styles.block2, { top: activeKey == 0 ? GuideTop : activeKey == 1 ? GuideTop + 230 : "45%" }]}
                                        // style={{position: 'absolute', top: activeKey == 0?GuideTop: activeKey == 1?GuideTop+250:10,
                                        // right:activeKey == 0?20:activeKey == 1?'none':10,
                                        // left:activeKey == 1?0:'none'
                                        // }}
                                        >
                                            <View style={[styles.guideView]}>
                                                <View style={styles.list}>
                                                    <Text style={{ fontSize: 12, color: "#fff" }}>{item}</Text>
                                                    <Touch onPress={() => { this.guideKey(1); }} style={{ width: 40, paddingLeft: 5 }}>
                                                        <CloseIcon width={16} height={16}></CloseIcon>
                                                    </Touch>
                                                </View>
                                                <View style={styles.list}>

                                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                                        <View style={activeKey == 0 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 1 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 2 ? styles.active : styles.noactive} />
                                                        <View style={activeKey == 3 ? styles.active : styles.noactive} />
                                                    </View>
                                                    <Touch onPress={() => { this.GuideChange(index + 1); }} style={styles.nextBtn}>
                                                        <Text style={{ color: "#000", fontSize: 12, lineHeight: 26, textAlign: "center" }}>{activeKey == 2 ? "Bắt Đầu Cược" : "Tiếp Theo"}</Text>
                                                    </Touch>
                                                </View>
                                                {
                                                    activeKey != 2 &&
                                                    <View style={[
                                                        styles.arrow, { right: (activeKey == 0 || activeKey == 2) ? 30 : 160 }
                                                    ]} />
                                                }
                                                {
                                                    activeKey == 2 &&
                                                    <View style={styles.arrowBottom} />
                                                }
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default Guide;

const styles = StyleSheet.create({
    marsk: {
        position: "absolute",
        zIndex: -1,
        width: width,
        height: height,
    },
    guideView: {
        width: 230,
        height: 85,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#363636",
        borderRadius: 8,
        padding: 10
    },
    list: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: 200,
        height: 35,
        paddingLeft: 8,
        paddingRight: 8,
    },
    active: {
        width: 12,
        height: 4,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginLeft: 5,
    },
    noactive: {
        width: 4,
        height: 4,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginLeft: 5,
    },
    nextBtn: {
        width: 80,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    arrow: {
        position: "absolute",
        top: -12,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 6,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "#363636",
        borderRightColor: "transparent",
    },
    arrowBottom: {
        position: "absolute",
        bottom: -12,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 6,
        borderTopColor: "#363636",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
    },
    block0: {
        position: "absolute",
        right: 20
    },
    block2: {
        position: "absolute",
        right: 20
    }
});
