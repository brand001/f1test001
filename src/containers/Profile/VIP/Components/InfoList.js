import React from "react";

import { Dimensions, StyleSheet, Text, View } from "react-native";
const { width } = Dimensions.get("window");

const InfoList = ({ title, notes }) => {
    return (
        <View style={styles.infoListContainer}>
            <Text style={styles.faqTitle}>{title}</Text>
            {notes.map((item, index) => (
                <View key={index} style={styles.listItem}>
                    <Text style={styles.infoText}>{index + 1}. </Text>
                    <Text style={[styles.infoText, styles.infoText1]}>{item}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    infoListContainer: {
        maxWidth: width - 5,
        marginHorizontal: 20,
        marginBottom: 30,
    },
    faqTitle: {
        color: "#ABA79D",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 10,
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 10,
    },
    infoText: {
        color: "#ABA79D",
        fontSize: 12,
        lineHeight: 16,
    },
    infoText1: {
        width: width - 60,
        flexWrap: "wrap",
    },
});

export default InfoList;
