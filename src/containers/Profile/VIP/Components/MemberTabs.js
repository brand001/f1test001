import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import React from "react";

import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const MemberTabs = props => {
    const { tabsList, tabsActive, handleTabChange } = props;

    return (
        <RowCenterBetween style={styles.tabs}>
            {tabsList.map((item, index) => {
                return (
                    <RowCenterCenter
                        key={index}
                        style={[
                            styles.tabsList,
                            tabsActive === index && styles.tabsListActiveContainer,
                            {
                                width: width * item.width,
                            },
                        ]}
                        onPress={() => handleTabChange(index)}>
                        {item.icon}
                        <Text
                            style={[
                                styles.tabsItem,
                                {
                                    color: tabsActive === index ? item.color : "#ABA79D",
                                },
                            ]}>
                            {item.name}
                        </Text>
                        {tabsActive === index && (
                            <View
                                style={[
                                    styles.tabsListActive,
                                    {
                                        backgroundColor: tabsActive === index ? item.color : "#ABA79D",
                                    },
                                ]}
                            />
                        )}
                    </RowCenterCenter>
                );
            })}
        </RowCenterBetween>
    );
};

const styles = StyleSheet.create({
    tabs: {
        width: width,
        backgroundColor: "#17191C",
        marginTop: 25,
        marginBottom: 35,
    },
    tabsList: {
        width: width / 3,
        paddingBottom: 10,
        position: "relative",
    },
    tabsItem: {
        fontSize: 12,
        color: "#ABA79D",
        marginLeft: 5
    },
    tabsListActiveContainer: {
        position: "relative",
    },
    tabsListActive: {
        position: "absolute",
        bottom: 0,
        width: 20,
        height: 3,
        alignSelf: "center",
    },
});

export default MemberTabs;
