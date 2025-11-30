import React from "react";

import { Dimensions, StyleSheet } from "react-native";

import Color from "$Components/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 15,
    },

    bonusList: {
        borderRadius: 6,
        padding: 15,
        marginBottom: 15,
        backgroundColor: Color.white,
        width: width - 30,
        //overflow: 'hidden'
    },
    bonusRow: {
        marginBottom: 10,
    },
    bonusTitle: {
        width: width * 0.6,
        fontSize: 16,
        fontWeight: "600",
        color: Color.charcoal,
    },
    bonusMoney: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkGray,
    },
    bonusMoneyItem: {
        fontSize: 18,
        fontWeight: "600",
        color: Color.charcoal,
    },
    productImage: {
        width: 24,
        height: 24,
        marginLeft: 2,
    },
    productImageBox: {
        flexDirection: "row",
    },

    // BonusReadyItem
    readyBtnWrap: {
        borderTopColor: Color.lightSilver,
        borderTopWidth: 2,
        marginTop: 5,
        paddingTop: 16,
    },
    readyBtnText: {
        color: Color.darkGray,
        textAlign: "center",
        fontSize: 16,
    },

    timeTop: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: Color.gray,
        marginBottom: 10,
    },

    // index
    tabs: {
        width: width,
        height: 40,
        borderBottomWidth: 1,
        borderColor: "#E3E3E3"
    },
    tabsList: {
        height: "100%",
        borderBottomWidth: 3,
    },
    tabsItem: {
        fontSize: 14,
        color: Color.white,
    },
    //BonusActiveItem
    statusCheckItem: {
        fontSize: 12,
        paddingLeft: 3,
        color: Color.darkGray,
    },
    activeDelaate: {
        width: 60,
        backgroundColor: Color.alertRed,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 6,
        // position: 'absolute',
        // right: 0,
        // top: 0,
        // bottom: 0,
        // zIndex: 9999
    },
    activeDelaateText: {
        color: Color.white,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 5
    },

    //BonusReceive
    receiveBtn: {
        borderTopColor: Color.lightSilver,
        borderTopWidth: 1,
    },

    //BonusFinish
    herderSelect: {
        marginBottom: 15,
    },
    herderSelectList: {
        height: 40,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: Color.white,
        borderWidth: 0,
    },
    bonusListMsg: {
        fontSize: 12,
        paddingLeft: 2,
    },

    // time
    timeEnd: {
        fontSize: 12,
        paddingLeft: 2,
        fontWeight: "400",
        color: Color.darkGray,
    },

    disclaimerContainer: {
        justifyContent: "flex-start",
        borderRadius: 6,
        marginBottom: 40,
    },
    disclaimerPromptItem: {
        fontSize: 12,
        color: Color.darkGray,
    },
    disclaimerTitles: {
        color: Color.charcoal,
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 5,
    },
});

export default styles;
