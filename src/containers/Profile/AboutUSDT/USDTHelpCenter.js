import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { ArrowIcon } from "$Components/icons/index";
import { RowCenterBetween } from "$Components/CustomView";
import CustomScrollView from "$Components/CustomScrollView";

// HTMLView 樣式表
const htmlStylesheet = {
    p: {
        color: "#666666",
        fontSize: 14,
        lineHeight: 18,
    },
};

const USDTHelpCenter = ({ FaqDataCN: propFaqDataCN }) => {
    const [activeId, setActiveId] = useState(0);
    const FaqDataCN = propFaqDataCN;

    const handleToggleItem = (itemId) => {
        setActiveId(activeId === itemId ? 0 : itemId);
    };

    return (
        <CustomScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {FaqDataCN &&
                    FaqDataCN.map((item, index) => {
                        const isActive = activeId === item.id;
                        return (
                            <View key={index} style={styles.questionWrap}>
                                <TouchableOpacity onPress={() => handleToggleItem(item.id)}>
                                    <RowCenterBetween style={styles.questionHeader}>
                                        <Text style={styles.questionTitle}>
                                            {item.title}
                                        </Text>
                                        <ArrowIcon
                                            direction={isActive ? "bottom" : "top"}
                                            fill={"#262626"}
                                        />
                                    </RowCenterBetween>
                                </TouchableOpacity>

                                {isActive && (
                                    <View style={styles.questionContent}>
                                        <HTMLView
                                            value={item.body}
                                            stylesheet={htmlStylesheet}
                                        />
                                    </View>
                                )}
                            </View>
                        );
                    })}
            </View>
        </CustomScrollView>
    );
};

export default USDTHelpCenter;

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#EFEFF4",
        padding: 15,
    },
    container: {
        marginBottom: 15,
    },
    questionWrap: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 16,
    },
    questionHeader: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 5,
    },
    questionTitle: {
        lineHeight: 20,
        fontSize: 14,
        width: "90%",
        color: "#222",
    },
    questionContent: {
        paddingBottom: 20,
    },
});
