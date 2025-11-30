import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { translate } from "$locales/translate";
import Color from "$Components/Color";

const PasswordRequirements = ({ showRequirements = false, useDefaultColors = false }) => {
    if (!showRequirements) {
        return null;
    }

    const containerStyle = useDefaultColors ? styles.defaultContainer : styles.container;
    const textStyle = useDefaultColors ? styles.defaultRequirementText : styles.requirementText;

    return (
        <View style={containerStyle}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={[textStyle, { marginRight: 5 }]}>•</Text>
                <Text style={[textStyle, { textAlign: "left" }]}>
                    {translate("密码必须包含 8 到 20 个字符")}
                </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={[textStyle, { marginRight: 5 }]}>•</Text>
                <Text style={[textStyle, { textAlign: "left" }]}>
                    {translate("须包含至少一个大写和小写字母")}
                </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text style={[textStyle, { marginRight: 5 }]}>•</Text>
                <Text style={[textStyle, { textAlign: "left" }]}>
                    {translate("须包含至少一个特殊字符 (空格和英文句点除外)")}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightPink,
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 6,
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 6,
        alignSelf: "stretch",
    },
    defaultContainer: {
        backgroundColor: Color.paleGray,
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 8,
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 6,
        alignSelf: "stretch",
    },
    requirementText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.alertRed,
        flexWrap: "wrap",
    },
    defaultRequirementText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkGray,
        flexWrap: "wrap",
    },
});

export default PasswordRequirements; 