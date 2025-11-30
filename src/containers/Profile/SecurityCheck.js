import _ from "lodash";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import Color from "$Components/Color";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
import { SuccessIcon } from "$Components/icons/index";
import InfoBar from "$Components/InfoBar";
import { translate } from "$locales/translate";


import { VerificationTypeArr } from "./data";

class SecurityCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // true表示已驗證
            phoneStatus: false,
            emailStatus: false,
            identityCardStatus: false,
        };
    }

    componentDidMount() {
        this.checkVerifyState();
    }

    componentDidUpdate(prevProps) {
        const prevMemberInfo = prevProps?.userInfo?.memberInfo;
        const currentMemberInfo = this.props?.userInfo?.memberInfo;

        // 使用 lodash 深度比较对象
        if (!_.isEqual(prevMemberInfo, currentMemberInfo)) {
            this.checkVerifyState();
        }
    }

    checkVerifyState = () => {
        const memberInfo = this.props.userInfo.memberInfo;

        let phoneStatus = memberInfo?.phoneStatus;
        let emailStatus = memberInfo.emailStatus;
        let identityCardStatus = Boolean(memberInfo?.firstName);

        let forCount = [phoneStatus, emailStatus, identityCardStatus];
        let countVerified = forCount.filter(v => v === true).length;

        this.setState(
            {
                phoneStatus,
                emailStatus,
                identityCardStatus,
            },
            () => {
                // 三個都驗證通過
                if (countVerified === 3) {
                    Actions.pop();
                }
            },
        );
    };

    render() {
        return (
            <View style={styles.viewContainer}>
                <InfoBar type={"tip"} wrapStyle={{ marginTop: 15 }} text={translate("乐天堂严格遵守法律法规，遵循以下隐私保护原则，为您提供更加安全、可靠的服务：")} />

                {VerificationTypeArr.map((v, i) => {
                    let { text = "", title = "", Icon = null, callBack = () => {}, type } = v;
                    return (
                        <RowCenterBetween key={i} style={styles.boxWrap}>
                            <RowCenterCenter>
                                {
                                    Icon &&
                                    <Icon
                                        width={40}
                                        height={40}
                                        wrapStyle={{
                                            marginRight: 10,
                                        }}
                                    />
                                }

                                <View>
                                    <Text style={styles.boxTitle}>{translate(title)}</Text>
                                    <Text style={styles.boxDec}>{translate(text)}</Text>
                                </View>
                            </RowCenterCenter>

                            {this.state[`${type}Status`] ? (
                                <RowCenterCenter>
                                    <SuccessIcon
                                        width={18}
                                        height={18}
                                        wrapStyle={{
                                            marginRight: 5,
                                        }}
                                    />
                                    <Text style={styles.successText}>{translate("已验证")}</Text>
                                </RowCenterCenter>
                            ) : (
                                <FilledButton
                                    text={translate("马上验证")}
                                    onPress={() => {
                                        callBack({
                                            self: this,
                                        });
                                    }}
                                    wrapStyle={{
                                        height: 32,
                                        paddingHorizontal: 8,
                                    }}
                                    textStyle={{ fontSize: 12 }} />
                            )}
                        </RowCenterBetween>
                    );
                })}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SecurityCheck);

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Color.lightSilver,
    },
    successText: {
        color: Color.vividGreen,
        fontSize: 14,
        fontWeight: "bold",
    },
    boxTitle: {
        color: Color.deepGray,
        fontSize: 16,
        fontWeight: "bold",
    },
    boxWrap: {
        backgroundColor: Color.white,
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 12,
        marginTop: 16,
    },
    boxDec: {
        color: Color.gray,
        fontSize: 12,
        marginTop: 5,
    },
});
