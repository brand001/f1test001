import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { LiveChatOpenGlobe } from "$Utils";
import { translate } from "@/locales/translate";
import CustomLinkText from "$Components/CustomLinkText";
import { WarningIcon } from "$Components/icons/index";

class OTPLimitExceed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() { }

    componentWillUnmount() { }

    render() {
        return (
            <View style={styles.verificationFail}>
                <WarningIcon width={65} height={65} fill={"#F5B200"} />
                <Text style={styles.verificationFailTitle}>
                    {translate("您已经超过5次尝试")}
                </Text>
                <CustomLinkText
                    textAlign="center"
                    norMaltextStyle={{
                        fontSize: 14,
                        color: "#222222",
                    }}
                    themeTextStyle={{ fontSize: 14 }}
                    onPressList={[LiveChatOpenGlobe]}
                    text={translate("您已超过允许的所有验证尝试次数。请在24小时后重试,或通过{在线客服}联系客户支持")}
                />

                <Touch
                    onPress={() => { Actions.pop(); }}
                    style={{
                        backgroundColor: "#00a6ff",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: 44,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{translate("关闭")}</Text>
                </Touch>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OTPLimitExceed);

const styles = StyleSheet.create({
    verificationFail: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -150,
        paddingHorizontal: 20
    },
    verificationFailTitle: {
        fontSize: 18,
        color: "#222222",
        fontWeight: "700",
        paddingTop: 20,
        paddingBottom: 20,
        textAlign: "center"
    },
});
