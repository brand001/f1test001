import React, { Component } from "react";
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
    Switch,
} from "react-native";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import Touch from "react-native-touch-once";
import { ApiPortSB } from "../../lib/SPORTAPI";
import { Toasts } from "$Toasts";
const oddsTypeList = {
    MY: "马来盘", //马来盘
    HK: "香港盘", //香港盘
    EU: "欧洲盘", //欧洲盘
    ID: "印尼盘", //印尼盘
};

import CustomCheckbox from "$Components/CustomCheckbox";
import { ArrowIcon } from "$Components/icons/index";
import StorageUtil from "$Utils/Storage";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setType: this.props.setType || "setSystem",
            setTing: "",
            alwaysAcceptBetterOdds: false,
            amount1: 9999,
            amount2: 1000,
            amount3: 100,
            betSlipSound: false,
            betSlipVibration: false,
            goalAllRB: true,
            goalIBet: true,
            goalMyFavorite: true,
            goalNotification: true,
            goalSound: false,
            goalSoundType: 1,
            goalVibration: true,
            listDisplayType: 1,
            oddsType: "EU",
        };
        this.propsChangeFun = this.propsChangeFun.bind(this);
    }

    async componentWillMount() {
        if (this.props.setType == "setPush") {
            this.props.navigation.setParams({
                title: "Cài Đặt Thông Báo"//推送设置
            });
        }
        const res = await StorageUtil.load("setTing");
        if (res) {
            this.setData(res);
        }
        this.getSeting();
    }

    componentDidMount() {
        let adsd = {
            alwaysAcceptBetterOdds: false,
            amount1: 7777,
            amount2: 1000,
            amount3: 100,
            betSlipSound: false,
            betSlipVibration: false,
            goalAllRB: false,
            goalIBet: true,
            goalMyFavorite: true,
            goalNotification: true,
            goalSound: false,
            goalSoundType: 1,
            goalVibration: true,
            listDisplayType: 1,
            oddsType: "EU",
        };

        StorageUtil.save({
            key: "setTing",
            data: adsd,
        });
    }

    componentWillUnmount() {}

    setData(res) {
        this.setState({
            amount1: res.amount1,
            amount2: res.amount2,
            amount3: res.amount3,
            oddsType: res.oddsType,
            alwaysAcceptBetterOdds: res.alwaysAcceptBetterOdds,
            betSlipVibration: res.betSlipVibration,
            betSlipSound: res.betSlipSound,
            goalNotification: res.goalNotification,
            goalMyFavorite: res.goalMyFavorite,
            goalIBet: res.goalIBet,
            goalAllRB: res.goalAllRB,
            goalSound: res.goalSound,
            goalSoundType: res.goalSoundType,
            goalVibration: res.goalVibration,
            listDisplayType: res.listDisplayType ?? 1,
            setTing: res,
        });
    }

    getSeting() {
        // Toasts.loading('加载中,请稍候...', 200);
        window.fetchRequest(ApiPortSB.GetMemberNotificationSetting, "GET")
            .then((res) => {
                // Toasts.removeAll();
                if (res && res.result && res.result.notificationSetting) {
                    this.setData(res.result.notificationSetting);

                    StorageUtil.save({
                        key: "setTing",
                        data: res.result.notificationSetting,
                    });
                }
            })
            .catch((e) => {});
    }

    onSubmit(key) {
        const {
            alwaysAcceptBetterOdds,
            amount1,
            amount2,
            amount3,
            betSlipSound,
            betSlipVibration,
            goalAllRB,
            goalIBet,
            goalMyFavorite,
            goalNotification,
            goalSound,
            goalSoundType,
            goalVibration,
            oddsType,
            listDisplayType,
        } = this.state;
        // const val1 = parseInt(amount1), val2 = parseInt(amount2), val3 = parseInt(amount3);

        // if (val1 < 10 || val2 < 10 || val3 < 10) {
        //     Toasts.error("最低金额是￥10");
        //     return;
        // }
        // if (val1 > 99999 || val2 > 99999 || val3 > 99999) {
        //     Toasts.error("最高金额是￥99,999");
        //     return;
        // }
        // if (val1 < val2 || val1 < val3) {
        //     Toasts.error("快捷金额1必须大于快捷金额2和快捷金额3");
        //     return;
        // }
        // if (val2 > val1 || val2 < val3) {
        //     Toasts.error("快捷金额2必须小于快捷金额1且大于快捷金额3");
        //     return;
        // }
        // if (val3 > val1 || val3 > val2) {
        //     Toasts.error("快捷金额3必须小于快捷金额1和快捷金额2");
        //     return;
        // }

        const updateData = {
            amount1: amount1,
            amount2: amount2,
            amount3: amount3,
            oddsType: oddsType,
            alwaysAcceptBetterOdds: alwaysAcceptBetterOdds,
            betSlipVibration: betSlipVibration,
            betSlipSound: betSlipSound,
            goalNotification: goalNotification,
            goalMyFavorite: goalMyFavorite,
            goalIBet: goalIBet,
            goalAllRB: goalAllRB,
            goalSound: goalSound,
            goalSoundType: goalSoundType,
            goalVibration: goalVibration,
            listDisplayType: listDisplayType,
        };
        // Toasts.loading('Đang tải...', 200);
        window.fetchRequest(ApiPortSB.EditMemberNotificationSetting, "POST", updateData)
            .then((res) => {
                // Toasts.removeAll();
                if (res.isSuccess == true) {
                    Toasts.success("Lưu Thành Công");//设置成功
                    localStorage.setItem("NotificationSetting-" + res.result.memberCode, JSON.stringify(updateData));
                    key == "oddsType" && window.changeGameKey && window.changeGameKey();

                    StorageUtil.save({
                        key: "setTing",
                        data: updateData,
                    });
                }
            }).catch((err) => {
                // Toasts.removeAll();
            });
    }
    changeOddsType(oddsType) {
        this.setState({ oddsType }, () => {
            this.onSubmit("oddsType");
        });
    }
    onSwitchChange(key) {
        if (key == "goalNotification") {
            if (this.state.goalNotification == true) {
                this.setState({
                    goalMyFavorite: false,
                    goalIBet: false,
                    goalAllRB: false,
                    goalSound: false,
                    goalVibration: false,
                });
            } else {
                this.setState({
                    goalMyFavorite: true,
                    goalIBet: true,
                    goalAllRB: false,
                    goalSound: true,
                    goalVibration: true,
                });
            }
        }

        this.setState({ [key]: !this.state[key] }, () => {
            this.onSubmit();
        });
    }

    checkPush(key) {
        this.setState({ [key]: !this.state[key] }, () => {
            this.onSubmit();
        });
    }
    propsChangeFun(oddsType) {
        console.log("oddsTypeoddsType", oddsType);
        this.setState({ oddsType });
    }
    render() {
        const {
            setType,
            alwaysAcceptBetterOdds,
            amount1,
            amount2,
            amount3,
            betSlipSound,
            betSlipVibration,
            goalAllRB,
            goalIBet,
            goalMyFavorite,
            goalNotification,
            goalSound,
            goalSoundType,
            goalVibration,
            oddsType,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: isBlue ? "#efeff4" : "#2C2C2E" }}>
                {
                    setType == "setSystem" &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <View
                                // onPress={() => { Actions.SetTingModle({ setType: 'oddsType', propsChangeFun: this.propsChangeFun }) }}
                                style={[styles.setSystemView1, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Chọn Kiểu Xem Cược</Text>
                            </View>
                            <View style={{
                                padding: 15,
                                backgroundColor: isBlue ? "#fff" : "#3A3A3C",
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                marginBottom: 10,
                                borderTopWidth: 1,
                                borderColor: isBlue ? "#EFEFEF" : "#333333"
                            }}>
                                <Touch onPress={() => { this.changeOddsType("HK"); }} style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Hong Kong</Text>
                                    {/* 香港盘 */}
                                    <View style={[oddsType == "HK" ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType("ID"); }} style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Indonesian</Text>
                                    {/* 印尼盘 */}
                                    <View style={[oddsType == "ID" ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType("EU"); }} style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Châu Âu</Text>
                                    {/* 欧洲盘 */}
                                    <View style={[oddsType == "EU" ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType("MY"); }} style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Malay</Text>
                                    {/* 马来盘 */}
                                    <View style={[oddsType == "MY" ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>
                            </View>

                            <View style={[styles.setSystemView, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <Text style={{ color: isBlue ? "#222222" : "#F5F5F5", letterSpacing: -0.5 }}>Tự Động Chấp Nhận Tỷ Lệ Cược Tốt Hơn</Text>
                                {/* 自动接受更好的赔率 */}
                                <Switch
                                    onTintColor={"#00A6FF"}
                                    value={alwaysAcceptBetterOdds}
                                    thumbTintColor={"#fff"}
                                    onValueChange={() => { this.onSwitchChange("alwaysAcceptBetterOdds"); }}
                                />
                            </View>

                            {/* <View style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>震动</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#bcbec3', fontSize: 12 }}>注单震动提醒</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={betSlipVibration}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('betSlipVibration') }}
                                    />
                                </View>
                            </View>

                            <View style={styles.setSystemView}>
                                <Text style={{ color: '#666' }}>提示音</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#bcbec3', fontSize: 12 }}>注单提示音</Text>
                                    <Switch
                                        onTintColor={'#00A6FF'}
                                        value={betSlipSound}
                                        thumbTintColor={'#fff'}
                                        onValueChange={() => { this.onSwitchChange('betSlipSound') }}
                                    />
                                </View>
                            </View> */}

                            <Touch onPress={() => { Actions.SetTingModle({ setType: "amount" }); }} style={[styles.setSystemView, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>Tùy Chỉnh Tiền Cược</Text>
                                {/* 自定义快捷金额 */}
                                <ArrowIcon fill={"#999"} width={12} height={12} direction="right" />
                            </Touch>
                        </View>
                    </ScrollView>
                }
                {
                    setType == "setPush" &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <View style={[styles.setPushView, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <View style={styles.setPushListTop}>
                                    <Text style={{ color: isBlue ? "#000" : "#fff" }}>Thông Báo Tỷ Số</Text>
                                    {/* 进球推送 */}
                                    <Switch
                                        onTintColor={"#00A6FF"}
                                        value={goalNotification}
                                        thumbTintColor={"#fff"}
                                        onValueChange={() => { this.onSwitchChange("goalNotification"); }}
                                    />
                                </View>
                                <CustomCheckbox
                                    wrapStyle={styles.CustomCheckbox}
                                    isFull={true}
                                    isCheck={goalMyFavorite}
                                    type="medium"
                                    text={"Tất Cả Trận Đấu Theo Dõi"}
                                    textStyle={{ color: "#000" }}
                                    onPress={isChecked => {
                                        this.checkPush("goalMyFavorite");
                                    }}
                                />
                                <CustomCheckbox
                                    wrapStyle={styles.CustomCheckbox}
                                    isFull={true}
                                    isCheck={goalIBet}
                                    type="medium"
                                    text={"Tất Cả Trận Đấu Đang Đặt Cược"}
                                    textStyle={{ color: "#000" }}
                                    onPress={isChecked => {
                                        this.checkPush("goalIBet");
                                    }}
                                />
                                <CustomCheckbox
                                    wrapStyle={styles.CustomCheckbox}
                                    isFull={true}
                                    isCheck={goalAllRB}
                                    type="medium"
                                    text={"Tất Cả Trận Đấu Trực Tiếp"}
                                    textStyle={{ color: "#000" }}
                                    onPress={isChecked => {
                                        this.checkPush("goalAllRB");
                                    }}
                                />


                            </View>
                            <View style={[styles.setPushList1, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <Text style={{ color: isBlue ? "#000" : "#fff", width: 220, }}>Cài Đặt Rung</Text>
                                {/* 声音 */}
                                <Switch
                                    onTintColor={"#00A6FF"}
                                    thumbTintColor={"#fff"}
                                    value={goalSound}
                                    onValueChange={() => { this.onSwitchChange("goalSound"); }}
                                />
                            </View>
                            <View style={[styles.setPushList1, { backgroundColor: isBlue ? "#fff" : "#3A3A3C" }]}>
                                <Text style={{ color: isBlue ? "#000" : "#fff", width: 220, }}>Cài Đặt Chuông Thông Báo</Text>
                                {/* 震动 */}
                                <Switch
                                    onTintColor={"#00A6FF"}
                                    value={goalVibration}
                                    thumbTintColor={"#fff"}
                                    onValueChange={() => { this.onSwitchChange("goalVibration"); }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                }
            </View>
        );
    }
}

export default Setting;

const styles = StyleSheet.create({
    setSystemView: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },
    setSystemView1: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: -5,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },



    setPushView: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    setPushListTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 60,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    CustomCheckbox: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        width: "100%",
        paddingLeft: 10
    },
    setPushList: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 60,
        height: 50,
    },
    checkView: {
        width: 18,
        height: 18,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#00a6ff"
    },
    noCheckView: {
        width: 18,
        height: 18,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#bcbec3"
    },
    setPushList1: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        // width: width - 60,
        height: 50,
        backgroundColor: "#fff",
        marginTop: 10,
        padding: 15,
        borderRadius: 8
    },
});
