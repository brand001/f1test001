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
} from "react-native";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import Touch from "react-native-touch-once";
import { ApiPortSB } from "../../lib/SPORTAPI";
import CustomTextInput from "$Components/CustomTextInput";

import { Toasts } from "$Toasts";
import FilledButton from "$Components/FilledButton";
import { ImagesUrl } from "@/images/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
//金額加千位分隔格點
const payMoneyFormat = (value) => {
    return value == "" ? value : parseInt(value) > 0 && value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
};
const oddsTypeList = {
    MY: "马来盘", //马来盘
    HK: "香港盘", //香港盘
    EU: "欧洲盘", //欧洲盘
    ID: "印尼盘", //印尼盘
};

import StorageUtil from "$Utils/Storage";

class SetTingModle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountSet: false,
            setType: this.props.setType || "amount",
            setTing: "",
            alwaysAcceptBetterOdds: false,
            amount1: "9999",
            amount2: "1000",
            amount3: "100",
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
    }

    async componentWillMount() {
        if (this.props.setType == "oddsType") {
            this.props.navigation.setParams({
                title: "盘口设置"
            });
        }
        const res = await StorageUtil.load("setTing");
        if (res) {
            this.setData(res);
        }
        this.getSeting();
    }

    componentDidMount() {}

    componentWillUnmount() {}

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

    setData(res) {
        console.log("resres", res);
        this.setState({
            amount1: res.amount1 && res.amount1.toString(),
            amount2: res.amount2 && res.amount2.toString(),
            amount3: res.amount3 && res.amount3.toString(),
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
        const val1 = parseInt(amount1), val2 = parseInt(amount2), val3 = parseInt(amount3);
        if (key == 1) {
            PiwikEventDataHandle("SbSportsVN_SettingBetAmount");
            if (val1 < 10 || val2 < 10 || val3 < 10) {
                Toasts.error("Số tiền tối thiểu phải là 10 đ");//最低金额是￥10
                return;
            }
            if (val1 > 99999 || val2 > 99999 || val3 > 99999) {
                Toasts.error("Số tiền tối đa phải là 99,999 đ");//最高金额是￥99,999
                return;
            }
            if (val1 < val2 || val1 < val3) {
                Toasts.error("Tiền Cược 1 phải lớn hơn Tiền Cược 2 và Tiền Cược 3");//快捷金额1必须大于快捷金额2和快捷金额3
                return;
            }
            if (val2 > val1 || val2 < val3) {
                Toasts.error("Tiền Cược 2 phải nhỏ hơn Tiền Cược 1 và lớn hơn Tiền Cược 3");//快捷金额2必须小于快捷金额1且大于快捷金额3
                return;
            }
            if (val3 > val1 || val3 > val2) {
                Toasts.error("Tiền Cược 3 phải nhỏ hơn Tiền Cược 1 và Tiền Cược 2");//快捷金额3必须小于快捷金额1和快捷金额2
                return;
            }
        }

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

                    if (this.props.setType == "oddsType") {
                        this.setPropsChange();
                    }
                }
            }).catch((err) => {
                // Toasts.removeAll();
            });
    }

    handleInput(key, value) {
        let newvalue = value.replace(/[^\d]/g, "");
        const parseVal = parseFloat(newvalue);
        parseVal < 10 && Toasts.fail("Số tiền tối thiểu phải là 10 đ");//最低金额是￥10
        parseVal > 99999 && Toasts.fail("Số tiền tối đa phải là 99,999 đ");//最高金额是￥99,999

        this.setState({ [key]: newvalue, amountSet: true });


    }
    setPropsChange() {
        const {
            oddsType,
        } = this.state;
        this.props.propsChangeFun(oddsType);
    }
    changeOddsType(oddsType) {
        this.setState({ oddsType }, () => {
            this.onSubmit("oddsType");
        });
    }



    render() {
        const {
            amountSet,
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
                    setType == "amount" &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15, paddingBottom: amountSet ? 150 : 25 }}>
                            <View style={{ padding: 15, backgroundColor: isBlue ? "#fff" : "#3A3A3C", borderRadius: 10 }}>
                                <Image
                                    resizeMode="contain"
                                    source={ImagesUrl.moneyTableVn}
                                    style={{ width: width - 60, height: (width - 60) * 0.84 }} />


                                <View style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5" }}>Tiền Cược 1</Text>
                                    {/* 金额1 */}
                                    <CustomTextInput
                                        underlineColorAndroid="transparent"
                                        value={payMoneyFormat(amount1)}
                                        maxLength={6}
                                        keyboardType="numeric"
                                        onChangeText={value =>
                                            this.handleInput("amount1", value)
                                        }
                                        wrapStyle={{ borderColor: "#bcbec3" }}
                                        containerStyle={{ width: 100 }}
                                        inputStyle={{ color: "#000" }}
                                    />
                                </View>

                                <View style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5" }}>Tiền Cược 2</Text>
                                    {/* 金额2 */}

                                    <CustomTextInput

                                        underlineColorAndroid="transparent"
                                        value={payMoneyFormat(amount2)}
                                        maxLength={6}
                                        keyboardType="numeric"
                                        onChangeText={value =>
                                            this.handleInput("amount2", value)
                                        }


                                        wrapStyle={{ borderColor: "#bcbec3" }}
                                        containerStyle={{ width: 100 }}
                                        inputStyle={{ color: "#000" }}
                                    />
                                </View>

                                <View style={styles.setPushList}>
                                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5" }}>Tiền Cược 3</Text>
                                    {/* 金额3 */}

                                    <CustomTextInput

                                        underlineColorAndroid="transparent"
                                        value={payMoneyFormat(amount3)}
                                        maxLength={6}
                                        keyboardType="numeric"
                                        onChangeText={value =>
                                            this.handleInput("amount3", value)
                                        }


                                        wrapStyle={{ borderColor: "#bcbec3" }}
                                        containerStyle={{ width: 100 }}
                                        inputStyle={{ color: "#000" }}
                                    />
                                </View>

                                <Text style={{ color: "#bcbec3", fontSize: 13, paddingTop: 15 }}>Tối thiểu: 10 đ, Tối đa: 99,999 đ </Text>
                                {/* 最低:￥ 最高:￥ */}
                            </View>
                            <FilledButton
                                onPress={() => { this.onSubmit(1); }}
                                text={"Lưu"}
                                wrapStyle={{ marginTop: 25 }}
                            />
                        </View>
                    </ScrollView>
                }
                {/* {
                    setType == 'oddsType' &&
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 15 }}>
                            <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 10 }}>
                                <Touch onPress={() => { this.changeOddsType('HK') }} style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>香港盘</Text>
                                    <View style={[oddsType == 'HK' ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType('ID') }} style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>印尼盘</Text>
                                    <View style={[oddsType == 'ID' ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType('EU') }} style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>欧洲盘</Text>
                                    <View style={[oddsType == 'EU' ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>

                                <Touch onPress={() => { this.changeOddsType('MY') }} style={styles.setPushList}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>马来盘</Text>
                                    <View style={[oddsType == 'MY' ? styles.checkView : styles.noCheckView]}></View>
                                </Touch>
                            </View>
                        </View>
                    </ScrollView>
                } */}
            </View>
        );
    }
}

export default SetTingModle;

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
    inputView: {
        width: 100,
        height: 40,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#bcbec3",
    },
    input: {
        height: 40,
        width: 100,
        color: "#000",
        paddingLeft: 10,
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
    setPushList: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: width - 60,
        height: 50,
    }
});
