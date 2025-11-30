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
    StyleSheet,
    Linking,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { WhiteSpace } from "@ant-design/react-native";
const { width, height } = Dimensions.get("window");
import { handicapData, ouData, singleData, cornerData, oeData, csData } from "./mockBetData";
import Touch from "react-native-touch-once";
import { LiveChatOpenGlobe } from "$Utils";
import StorageUtil from "$Utils/Storage";
import NavBack from "$Components/Nav/NavBack";
import { ImagesUrl } from "@/images/index";
import NavTab from "$Components/Nav/NavTab";
let tutorialBetImg = [
    [
        ImagesUrl.singleBet1MinVn,
        ImagesUrl.singleBet2MinVn,
        ImagesUrl.singleBet3MinVn,
        ImagesUrl.singleBet4MinVn,
        ImagesUrl.singleBet5MinVn,
        ImagesUrl.singleBet6MinVn,
        ImagesUrl.singleBet7MinVn,
        ImagesUrl.singleBet8MinVn,
    ],
    [
        ImagesUrl.bettingCombo1MinVn,
        ImagesUrl.bettingCombo2MinVn,
        ImagesUrl.bettingCombo3MinVn,
        ImagesUrl.bettingCombo4MinVn,
        ImagesUrl.bettingCombo5MinVn,
        ImagesUrl.bettingCombo6MinVn,
        ImagesUrl.bettingCombo7MinVn,
        ImagesUrl.bettingCombo8MinVn,
    ],
];


class BetTutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerActive: 1,
            tabList1: [`Cược${"\n"}Chấp`, `Tài${"\n"}Xỉu`, `Cược ${"\n"} Thắng`, `Cược${"\n"}Góc`, `Chẵn ${"\n"} Lẻ`, `Tỉ Số ${"\n"} Chính Xác`],
            tabList2: ["Cược Đơn", "Cược Xiên"], //单项投注 ,混合投注
            activeTab: 0,
            refreshKey: 0,
            activeSlide: 0,
            betTutorial: handicapData,
            betTutorialActive: null,
        };
    }

    componentWillMount() {
        StorageUtil.save({
            key: "tutorial",
            data: "tutorial"
        });
    }

    componentDidMount() {
        if (this.props.types == "trends") {
            this.props.navigation.setParams({
                title: () => {
                    return (
                        <NavTab
                            textStyle={{
                                fontSize: 12
                            }}
                            tabData={["Hướng Dẫn Tỷ Lệ Cược", "Cược Mô Phỏng"]}
                            callBack={({ key }) => {
                                this.setState({
                                    headerActive: key + 1
                                });
                            }}></NavTab>
                    );
                },
            });

        } else {
            this.props.navigation.setParams({
                title: "Hướng Dẫn Đặt Cược",
            });
        }
    }

    componentWillUnmount() {}

    headerActive(headerActive) {
        this.setState({ headerActive, activeTab: 0, betTutorialActive: null, betTutorial: handicapData, });
    }
    activeTab(activeTab) {
        this.setState({ activeTab, betTutorialActive: null, refreshKey: this.state.refreshKey + 10, activeSlide: 0 });
        if (this.state.headerActive == 2) {
            let betTutorial = this.getData(activeTab);
            this.setState({ betTutorial });
        }
    }
    getData = (type) => {
        switch (type) {
            case 0:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_让球`);
                return handicapData;
            case 1:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_大小`);
                return ouData;
            case 2:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_独赢`);
                return singleData;
            case 3:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_角球`);
                return cornerData;
            case 4:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_单双`);
                return oeData;
            case 5:
                // Pushgtagdata(`Tutorial`, 'View', `Odds_Tutorial_波胆`);
                return csData;
            default:
                return [];
        }
    };
    txtReturn() {
        let data = this.state.betTutorial;
        let key = this.state.betTutorialActive;
        if (!data || key == null) {
            return " ";
        }
        let acriveData = data[key.slice(0, 1)][key.slice(2, 3)];
        return `${acriveData.teamName}  ${acriveData.oddType}  @${acriveData.odd}`;
    }
    txtReturnBottom(i) {
        let data = this.state.betTutorial;
        let key = this.state.betTutorialActive;
        if (!data || key == null) {
            return " ";
        }
        let acriveData = data[key.slice(0, 1)][key.slice(2, 3)];
        return acriveData.content[i];
    }
    timgReturn() {
        let data = this.state.betTutorial;
        let key = this.state.betTutorialActive;
        if (!data || key == null) {
            return " ";
        }
        let imgType = data[key.slice(0, 1)][key.slice(2, 3)].imgType;
        let isWin = imgType == "win" ? ImagesUrl.winVn :
            imgType == "winHalf" ? ImagesUrl.winHalfVn :
                imgType == "lose" ? ImagesUrl.loseVn :
                    imgType == "loseHalf" ? ImagesUrl.loseHalfVn :
                        ImagesUrl.returnPrincipalVn;
        return isWin;
    }
    render() {
        const {
            headerActive,
            tabList1,
            tabList2,
            activeTab,
            betTutorial,
            betTutorialActive,
            refreshKey,
            activeSlide,
        } = this.state;

        return (
            <View style={{ backgroundColor: "#1CA6FC", flex: 1 }}>
                {this.props.types == "trends" ?
                    <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
                        {
                            headerActive == 1 &&
                            <View style={{ flex: 1, }}>
                                <View style={[styles.tabView, { backgroundColor: "#00A6FF" }]}>
                                    {
                                        tabList1.map((item, index) => {
                                            return (
                                                <Touch onPress={() => { this.activeTab(index); }} key={index}>
                                                    <Text style={[activeTab == index ? styles.activeTabTxt : styles.noactiveTabTxt]}>{item}</Text>
                                                    {
                                                        activeTab == index && <View style={[styles.activeTabBorder, { backgroundColor: "#fff" }]} />
                                                    }
                                                </Touch>
                                            );
                                        })
                                    }
                                </View>
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {
                                        activeTab == 0 &&
                                        <View style={{ backgroundColor: "transparent" }}>
                                            <View style={{ padding: 10, margin: 15, width: width - 30, backgroundColor: "#FFF5BF", borderRadius: 10, }}>
                                                <Text style={{ color: "#222222", fontSize: 12, lineHeight: 20, }}>
                                                    {/* 滚球-让球赛果为投注后的进球比分。例如：投注时比分1-0，完场比分2-1，则滚球-让球盘赛果为1-1 */}
                                                    Cược chấp trực tiếp sẽ không tính tỷ số lúc đặt cược. Ví dụ: Lúc cược chấp tỷ số là 1-0 và kết thúc trận đấu tỷ số là 2-1 thì tỷ số được tính cho cược chấp trực tiếp là 1-1.
                                                </Text>
                                            </View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab01Vn} style={{ width: width, height: width * 0.6269, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab02Vn} style={{ width: width, height: width * 0.811, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab03Vn} style={{ width: width, height: width * 0.714, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab04Vn} style={{ width: width, height: width * 1.146, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab05Vn} style={{ width: width, height: width * 1.147, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab06Vn} style={{ width: width, height: width * 1.149, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab07Vn} style={{ width: width, height: width * 1.146, marginBottom: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab08Vn} style={{ width: width, height: width * 1.143, marginBottom: 10 }} />
                                        </View>
                                    }
                                    {
                                        activeTab == 1 &&
                                        <View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab20Vn} style={{ width: width, height: width * 0.917 }} />
                                        </View>
                                    }
                                    {
                                        activeTab == 2 &&
                                        <View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab30Vn} style={{ width: width, height: width * 1.148 }} />
                                        </View>
                                    }
                                    {
                                        activeTab == 3 &&
                                        <View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab40Vn} style={{ width: width, height: width * 0.34, marginTop: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab41Vn} style={{ width: width, height: width * 0.34, marginTop: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab42Vn} style={{ width: width, height: width * 0.41, marginTop: 10 }} />
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab43Vn} style={{ width: width, height: width * 0.34, marginTop: 10 }} />
                                        </View>
                                    }
                                    {
                                        activeTab == 4 &&
                                        <View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab50Vn} style={{ width: width, height: width * 0.74 }} />
                                        </View>
                                    }
                                    {
                                        activeTab == 5 &&
                                        <View>
                                            <Image resizeMode='contain' source={ImagesUrl.tutorialTab60Vn} style={{ width: width, height: width * 0.896 }} />
                                        </View>
                                    }
                                </ScrollView>
                            </View>
                        }
                        {
                            headerActive == 2 &&
                            <View style={{ flex: 1 }}>
                                <View style={[styles.tabView, { backgroundColor: "#00A6FF" }]}>

                                    {
                                        tabList1.map((item, index) => {
                                            return (
                                                <Touch onPress={() => { this.activeTab(index); }} key={index}>
                                                    <Text style={[activeTab == index ? styles.activeTabTxt : styles.noactiveTabTxt]}>{item}</Text>
                                                    {
                                                        activeTab == index && <View style={[styles.activeTabBorder, { backgroundColor: "#fff" }]} />
                                                    }
                                                </Touch>
                                            );
                                        })
                                    }
                                </View>
                                <View style={{ padding: 10, }}>
                                    <Text style={{ color: "#222222", fontSize: 16, paddingBottom: 10, fontWeight: "bold" }}>Lựa Chọn Đơn</Text>
                                    {/* 单选项 */}
                                    <Text style={{ color: "#666666", fontSize: 12 }}>Lựa chọn các cược có lợi nhuận dựa trên kết quả cược</Text>
                                    {/* 根据赛果选择会盈利的投注选项 */}
                                </View>
                                <View style={{ backgroundColor: "#fff", paddingHorizontal: 10 }}>
                                    <View style={styles.betTitle}>
                                        <View style={styles.teams}>
                                            <Text style={{ color: "#222222", fontWeight: "bold" }}>New Castle</Text>
                                            {/* 纽卡斯尔联 */}
                                            <Image resizeMode='stretch' source={ImagesUrl.team1Vn} style={{ width: 40, height: 40, marginLeft: 10 }} />
                                        </View>
                                        <View>
                                            <Text style={{ color: "#666666", fontSize: 10, textAlign: "center", lineHeight: 30 }}>Kết Quả Trận Đấu</Text>
                                            {/* 赛果 */}
                                            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 22, textAlign: "center" }}>
                                                {
                                                    activeTab == 3 ? "7 - 5" : "2 - 0"
                                                }
                                            </Text>
                                        </View>
                                        <View style={styles.teams}>
                                            <Image resizeMode='stretch' source={ImagesUrl.team2Vn} style={{ width: 36, height: 36 }} />
                                            <Text style={{ color: "#222222", fontWeight: "bold" }}>Tottenham</Text>
                                            {/* 热刺 */}
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.handicap}>
                                            {
                                                (activeTab == 0 || activeTab == 3) &&
                                                <View >
                                                    <Image resizeMode='stretch' source={ImagesUrl.team1Vn} style={{ width: 25, height: 25, marginBottom: 12 }} />
                                                    <Image resizeMode='stretch' source={ImagesUrl.team2Vn} style={{ width: 25, height: 25 }} />
                                                </View>
                                            }
                                            {
                                                betTutorial.map((item, index) => {
                                                    return (
                                                        <View key={index} style={
                                                            (activeTab == 2 || activeTab == 4 || activeTab == 5) ? styles.rowView : {}
                                                        }>
                                                            {
                                                                item.map((v, i) => {
                                                                    return (
                                                                        <Touch
                                                                            onPress={() => { this.setState({ betTutorialActive: `${index}+${i}` }); }}
                                                                            key={i}
                                                                            style={[
                                                                                styles.betTutorial,
                                                                                {
                                                                                    width:
                                                                                        activeTab == 0 ? (width - 60) * 0.25 :
                                                                                            activeTab == 1 ? (width - 30) * 0.25 :
                                                                                                activeTab == 2 ? (width - 20) * 0.33 :
                                                                                                    activeTab == 3 ? (width - 50) * 0.5 :
                                                                                                        activeTab == 4 ? (width - 20) * 0.5 : (width - 30) * 0.333
                                                                                },
                                                                                betTutorialActive == `${index}+${i}` ? {
                                                                                    backgroundColor: "#E6F6FF",
                                                                                    borderColor: "#00A6FF",
                                                                                    borderWidth: 1,
                                                                                    paddingTop: 7,
                                                                                    paddingBottom: 7,
                                                                                } : {
                                                                                    backgroundColor: "#F7F7F7"
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Text style={{ fontSize: 12, color: "#999999" }}>{v.oddType}</Text>
                                                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                                                <Text style={{
                                                                                    color: v.fluxType === "up" ? "#0CCC3C" : v.fluxType === "down" ? "#EB2121" : "#222222",
                                                                                    // fontWeight: 'bold'
                                                                                }}>{v.odd}</Text>
                                                                                {
                                                                                    v.fluxType === "up" &&
                                                                                    <Image resizeMode='stretch' source={ImagesUrl.roundUpVn} style={{ width: 7, height: 7, top: -3 }} />
                                                                                }
                                                                                {
                                                                                    v.fluxType === "down" &&
                                                                                    <Image resizeMode='stretch' source={ImagesUrl.roundDownVn} style={{ width: 7, height: 7, top: -3 }} />
                                                                                }
                                                                            </View>
                                                                        </Touch>
                                                                    );
                                                                })
                                                            }
                                                        </View>
                                                    );
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                                {
                                    betTutorialActive != null &&
                                    <View>
                                        <Text style={{ color: "#666666", fontSize: 16, paddingLeft: 10, lineHeight: 40, fontWeight: "bold" }}>Kết Quả Cược</Text>
                                        {/* 投注结果 */}
                                        <View style={{ backgroundColor: "#fff", paddingLeft: 15, }}>
                                            <View style={[styles.detaile, { borderBottomColor: "#D2D2D2" }]}>
                                                <Text style={{ color: "#000", fontSize: 16, lineHeight: 40 }}>Cược: {this.txtReturn()}</Text>
                                                {/* 投注： */}
                                                <Image resizeMode='stretch'
                                                    source={this.timgReturn()}
                                                    style={{ width: 30, height: 30 }} />
                                            </View>
                                            <View style={{ paddingTop: 10, }}>
                                                <Text style={{ lineHeight: 18, color: "#666666", fontSize: 12, width: width * 0.8 }}>{this.txtReturnBottom(0)}</Text>
                                                <Text style={{ lineHeight: 18, color: "#666666", fontSize: 12, marginBottom: 10, width: width * 0.8 }}>{this.txtReturnBottom(1)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    :
                    <View style={{ flex: 1, backgroundColor: "#EFEFF4" }}>
                        <View style={[styles.tabView, { backgroundColor: "#00A6FF" }]}>
                            {
                                tabList2.map((item, index) => {
                                    return (
                                        <Touch onPress={() => { this.activeTab(index); }} key={index}>
                                            <Text style={[activeTab == index ? {
                                                height: 30,
                                                color: "#fff",
                                                paddingLeft: 13,
                                                paddingRight: 13,
                                                width: width * 0.5,
                                                textAlign: "center",
                                                fontWeight: "bold"

                                            } : styles.noactiveTabTxt1]}>{item}</Text>
                                            {
                                                activeTab == index && <View style={[styles.activeTabBorder, { backgroundColor: "#fff" }]} />
                                            }
                                        </Touch>
                                    );
                                })
                            }
                        </View>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                horizontal={true}
                                pagingEnabled={true}
                                key={refreshKey}
                                onMomentumScrollEnd={(e) => {
                                    let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
                                    let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

                                    let activeSlide = 0;
                                    if (offsetY != 0) {
                                        //滑动块数
                                        activeSlide = offsetY / oriageScrollWidth;
                                    }
                                    this.setState({ activeSlide });
                                }}
                            >
                                {
                                    tutorialBetImg[activeTab].map((item, index) => {
                                        return (
                                            <View key={index} style={{ width: width, display: "flex", justifyContent: "center", alignItems: "center", padding: 15 }}>
                                                <Image resizeMode='stretch' source={item} style={{ width: width - 50, height: (width - 50) * 1.95 }} />
                                                {
                                                    index == tutorialBetImg[activeTab].length - 1 &&
                                                    <View style={styles.againBtn}>
                                                        <Touch
                                                            onPress={() => {
                                                                Actions.pop();
                                                                Actions.drawerClose();
                                                            }}
                                                            style={{ width: width - 150, borderRadius: 10, backgroundColor: "#00A6FF", marginBottom: 15 }}
                                                        >
                                                            <Text style={{ color: "#fff", lineHeight: 40, textAlign: "center" }}>Cược Ngay</Text>
                                                            {/* 实战来一注 */}
                                                        </Touch>
                                                        <Touch onPress={() => { this.setState({ refreshKey: refreshKey + 10, activeSlide: 0 }); }} style={{ width: width - 150, borderRadius: 10, borderColor: "#fff", borderWidth: 1, }}>
                                                            <Text style={{ color: "#fff", lineHeight: 40, textAlign: "center" }}>Xem Lại</Text>
                                                            {/* 再看一次 */}
                                                        </Touch>
                                                    </View>
                                                }
                                            </View>
                                        );
                                    })
                                }
                            </ScrollView>
                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", paddingBottom: 25, width: width }}>
                                {
                                    tutorialBetImg[activeTab].map((item, index) => {
                                        return (
                                            <View key={index} style={activeSlide == index ? styles.activeSlide : styles.noactiveSlide} />
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>}
            </View>
        );
    }
}

export default BetTutorial;

const styles = StyleSheet.create({
    activeSlide: {
        width: 15,
        height: 4,
        backgroundColor: "#00A6FF",
        borderRadius: 10,
        marginLeft: 5,
    },
    noactiveSlide: {
        width: 4,
        height: 4,
        backgroundColor: "#B8B8B8",
        borderRadius: 10,
        marginLeft: 5,
    },
    againBtn: {
        position: "absolute",
        bottom: 120,
        left: 0,
        width: width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    detaile: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 30,
        borderBottomWidth: 1,
    },
    rowView: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        width: width,
    },
    betTutorial: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 8,
    },
    betTutorialActive: {
        backgroundColor: "#E6F6FF",
        borderColor: "#00A6FF",
        borderWidth: 1,
        paddingTop: 7,
        paddingBottom: 7,
    },
    nobetTutorialActive: {
        backgroundColor: "#F7F7F7",
    },
    handicap: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        width: width - 15,
    },
    teams: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    betTitle: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        width: width - 20,
        paddingTop: 5,
        paddingBottom: 15,
    },
    activeTabTxt: {
        fontSize: 12,
        color: "#fff",
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
        paddingBottom: 10,
        fontWeight: "bold"
    },
    noactiveTabTxt: {
        // lineHeight: 35,
        fontSize: 12,
        color: "#FFFFFF",
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
        paddingBottom: 10
    },
    activeTabTxt1: {
        height: 30,
        color: "#fff",
        paddingLeft: 13,
        paddingRight: 13,
        width: width * 0.5,
        textAlign: "center",
        fontWeight: "bold"

    },
    noactiveTabTxt1: {
        height: 30,
        color: "#fff",
        paddingLeft: 13,
        paddingRight: 13,
        width: width * 0.5,
        textAlign: "center"
    },
    activeTabBorder: {
        position: "absolute",
        bottom: 0,
        width: "90%",
        height: 3,
    },
    tabView: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width,
        // marginBottom:10
    },
    headerActive: {
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 8,
        paddingLeft: 10,
        paddingRight: 10,
    },
    noheaderActive: {
        backgroundColor: "#1588D5",
        borderRadius: 50,
        padding: 8,
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerView: {
        width: width,
        height: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    headerTitle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#1588D5",
        borderRadius: 50,
    },
});
