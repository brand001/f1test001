import React, { Component } from "react";
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");
import * as Animatable from "react-native-animatable";

import ImageMap from "@/locales/Images";
import { translate } from "@/locales/translate";
import FilledButton from "$Components/FilledButton";
import { LiveChatOpenGlobe, openEmail, openPhone } from "$Utils";
const AnimatableView = Animatable.View;
import { ImagesUrl } from "@/images/index";
import CountdownUtil from "$Utils/CountdownUtil";
import { ColumnCenterCenter, RowCenterCenter, RowStartCenter } from "$Components/CustomView";
import { RestrictIcon } from "$Components/icons";

const EmailObj = {
    CN: "cs@fun88.com",
    TH: "cs.thai@fun88.com",
    VN: "cs.viet@fun88.com",
};
const PhoneObj = {
    CN: "",
    TH: "+66 600 035 187",
    VN: "+84 400 842 891",
};

class RestrictPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Devicetoken: "",

            RetryAfter: this.props?.RetryAfter || 0, //RetryAfter   '2024-02-26T23:00:00.0000000Z'
            hour: "00",
            min: "00",
            sec: "00",
            description: "",
        };
    }

    componentDidMount() {
        if (this.props.from == "restrict") {
            let { error_details = {} } = this.props;
            let { errors = [] } = error_details;
            if (Array.isArray(errors) && errors.length) {
                this.setState({
                    description: errors[0]?.description,
                });
            }
        }

        if (this.props.from == "maintenance") {
            let { error_details } = this.props;
            let RetryAfter = this.state.RetryAfter;
            if (error_details && error_details?.RetryAfter) {
                RetryAfter = error_details?.RetryAfter;
            }
            if (RetryAfter) {
                this.setState(
                    {
                        RetryAfter,
                    },
                    () => {
                        this.startCountdown(RetryAfter);
                    },
                );
            }
        }
    }

    startCountdown(time) {
        this.countdown?.clear();

        this.countdown = new CountdownUtil(
            time,
            timeStr => {
                let [hour, min, sec] = timeStr.split(":");
                this.setState({
                    hour,
                    min,
                    sec,
                });
            },
            () => {
                this.countdown?.clear();
            },
        );
        this.countdown.setFormatType("HH:MM:SS");
        this.countdown.start();
    }

    componentWillUnmount() {
        this.countdown?.clear();
    }

    render() {
        const { hour, min, sec, RetryAfter } = this.state;

        const EmailBtn = () => {
            return (
                EmailObj[window.LANGUAGE].length > 0 && (
                    <FilledButton
                        outlined={true}
                        text={translate("电邮:") + " " + EmailObj[window.LANGUAGE]}
                        wrapStyle={{ marginTop: 10 }}
                        onPress={() => {
                            openEmail(EmailObj[window.LANGUAGE]);
                        }} />
                )
            );
        };

        const CsBtn = () => {
            return (
                <FilledButton
                    text={translate("线上客服")}
                    wrapStyle={{ marginTop: 10 }}
                    onPress={() => {
                        LiveChatOpenGlobe();
                    }} />
            );
        };

        const PhoneBtn = () => {
            return (
                PhoneObj[window.LANGUAGE].length > 0 && (
                    <FilledButton
                        outlined={true}
                        text={translate("热线电话:") + " " + PhoneObj[window.LANGUAGE]}
                        wrapStyle={{ marginTop: 10 }}
                        onPress={() => {
                            openPhone(PhoneObj[window.LANGUAGE]);
                        }} />
                )
            );
        };

        return (
            <View style={styles.viewContainer}>
                {
                    //ip限制
                    this.props.from == "restrict" &&
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <ImageBackground resizeMode="stretch" source={ImageMap.restrictBg} style={styles.viewBg}>
                            <ColumnCenterCenter>
                                <RestrictIcon wrapStyle={{ marginTop: 15 }} />
                                <Text style={styles.title}>{translate("IP 限制")}</Text>

                                {!!this.state.description && (
                                    <Text style={styles.ipText}>
                                        {translate("您的 IP 来自于:{x}", {
                                            x: this.state.description,
                                        })}
                                    </Text>
                                )}

                                <Text style={styles.infor}>
                                    {translate("抱歉！您所在的地区受到限制, 无法正常游览我们的网站哦。若有不便之处, 请多多原谅。若您有任何疑问, 请联系我们的在线客服或发邮件")}
                                </Text>
                            </ColumnCenterCenter>

                            {EmailBtn()}

                            {CsBtn()}
                        </ImageBackground>
                    </ScrollView>
                }

                {
                    //维护
                    this.props.from == "maintenance" &&
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <ImageBackground resizeMode="stretch" source={ImageMap.maintainenceBg} style={styles.viewBg}>
                            <ColumnCenterCenter>
                                {RetryAfter >= 0 && (
                                    <AnimatableView animation={"fadeInUpBig"} delay={200} easing="ease-out" iterationCount="1">
                                        <RowStartCenter style={styles.timeBoxWrap}>
                                            <View style={styles.timeBox1}>
                                                <RowCenterCenter>
                                                    <Text style={styles.timeText1}>{hour}</Text>
                                                </RowCenterCenter>
                                                <Text style={styles.timeText2}>{translate("小时")}</Text>
                                            </View>
                                            <View style={styles.timeBox1}>
                                                <RowCenterCenter>
                                                    <Text style={styles.timeText1}>{min}</Text>
                                                </RowCenterCenter>
                                                <Text style={styles.timeText2}>{translate("分钟")}</Text>
                                            </View>
                                            <View style={styles.timeBox1}>
                                                <RowCenterCenter>
                                                    <Text style={styles.timeText1}>{sec}</Text>
                                                </RowCenterCenter>
                                                <Text style={styles.timeText2}>{translate("秒")}</Text>
                                            </View>
                                        </RowStartCenter>
                                    </AnimatableView>
                                )}

                                <Text style={styles.title}>{translate("亲爱的客户")}</Text>
                                <Text style={styles.infor}>{translate("我们的系统正在升级维护中，请稍后再尝试登入\n您可以通过以下方式联系我们在线客服")}</Text>
                            </ColumnCenterCenter>
                            {CsBtn()}

                            {EmailBtn()}

                            {PhoneBtn()}
                        </ImageBackground>
                    </ScrollView>
                }
            </View>
        );
    }
}

export default RestrictPage;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewBg: {
        width: width,
        height: width * 1.8,
        paddingHorizontal: 30,
        paddingTop: width * 0.66,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        marginBottom: 12,
    },
    ipText: {
        color: "#222",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
    infor: {
        color: "#999",
        textAlign: "center",
        fontSize: 14,
        marginTop: 12,
        marginBottom: 15,
    },
    timeBoxWrap: {
        marginBottom: 30,
    },
    timeBox1: {
        marginHorizontal: 14,
        alignItems: "center",
    },
    timeBox: {
        backgroundColor: "#fff",
        width: 68,
        height: 76,
        borderRadius: 10,
        marginBottom: 10,
    },
    timeText1: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
    },
    timeText2: {
        color: "#222",
        textAlign: "center",
    },
});
