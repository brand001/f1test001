import React from "react";

import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const RafList = ({ title, notes, type }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {notes.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.listItem,
                        type === "FAQ" && index % 2 !== 0 ? styles.answerSpacing : null, // 只有 A: 時加 marginBottom
                    ]}>
                    <Text style={[styles.text, type === "FAQ" && styles.boldText]}>{type === "FAQ" ? (index % 2 === 0 ? "Q: " : "A: ") : `${index + 1}. `}</Text>
                    <Text style={[styles.text, type === "FAQ" && index % 2 === 0 ? styles.boldText : null]}>{item}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    answerSpacing: {
        marginBottom: 15,
    },
    title: {
        fontSize: 14,
        color: "#222222",
        fontWeight: "bold",
        marginBottom: 13,
    },
    text: {
        fontSize: 12,
        color: "#666666",
        lineHeight: 18,
    },
    boldText: {
        fontWeight: "bold",
        color: "#222222",
    },
});

export default RafList;
