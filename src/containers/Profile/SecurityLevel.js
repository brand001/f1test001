import React from "react";

import { Dimensions, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { SuccessIcon } from "$Components/icons/index";
import UnderlinedButton from "$Components/UnderlinedButton";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "$locales/translate";

import { SECURITY_LEVELS } from "./data";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";
const { width } = Dimensions.get("window");

const getSecurityLevel = (phoneVerified, emailVerified, identityVerified) => {
    if (phoneVerified && emailVerified && identityVerified) {
        return "High";
    } else if (phoneVerified || emailVerified || identityVerified) {
        return "Medium";
    } else {
        return "Low";
    }
};

const UserSecurityLevel = ({ memberInfo, goVerify }) => {
    if (!memberInfo) {
        return null;
    }

    const phoneVerified = memberInfo?.phoneStatus;
    const emailVerified = memberInfo?.emailStatus;
    const identityVerified = Boolean(memberInfo.firstName);

    const level = getSecurityLevel(phoneVerified, emailVerified, identityVerified);
    const securityLevel = SECURITY_LEVELS[level];

    if (!securityLevel) {
        return null;
    }

    const { color, text, message } = securityLevel;

    const handleClick = () => {
        PiwikEventDataHandle("MemberCenter13");
        Actions.SecurityCheck();
    };

    return (
        <RowCenterBetween style={styles.userSecurityLevel}>
            <View style={styles.level}>
                <Text style={styles.levelTitle}>
                    {translate("安全等级:")} <Text style={{ color, fontSize: 12 }}>{translate(text)}</Text>
                </Text>
                <Text style={styles.levelSmall}>{translate(message)}</Text>
            </View>
            {level !== "High" ? (
                <UnderlinedButton text={translate("马上验证")} onPress={handleClick} textStyle={{ fontSize: 12 }} />
            ) : (
                <RowCenterStart>
                    <SuccessIcon
                        width={16}
                        height={16}
                        wrapStyle={{
                            marginRight: 2,
                        }}
                    />
                    <Text style={styles.green}>{translate("已验证")}</Text>
                </RowCenterStart>
            )}
        </RowCenterBetween>
    );
};

const styles = {
    userSecurityLevel: {
        backgroundColor: "white",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 10,
        paddingLeft: 8,
        paddingRight: 8,
        borderTopWidth: 1,
        borderTopColor: "#EFEFF4",
        width: width - 40,
        transform: [
            {
                translateX: -10,
            },
        ],
    },
    levelTitle: {
        color: "#333",
        fontWeight: "bold",
        fontSize: 12,
    },
    level: {
        fontSize: 12,
    },
    levelSmall: {
        color: "#333",
        fontSize: 9,
    },
    green: {
        color: "#34c759",
        fontSize: 12,
        marginLeft: 2,
    },
};

const mapStateToProps = state => ({
    memberInfo: state.userInfo?.memberInfo,
});

export default connect(mapStateToProps)(UserSecurityLevel);
