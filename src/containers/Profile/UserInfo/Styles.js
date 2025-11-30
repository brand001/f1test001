import React from "react";

import { StyleSheet } from "react-native";

import Color from "$Components/Color";

const Styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
        marginHorizontal: 15,
    },
    imgIcon: {
        width: 18,
        height: 18,
    },
    inputTitle: {
        color: Color.darkGray,
        fontSize: 14,
        marginBottom: 10,
        fontWeight: "400",
    },
    inputTitle2: {
        color: Color.gray,
        fontSize: 14,
        marginBottom: 10,
        fontWeight: "400",
    },
    commonWrap: {
        backgroundColor: Color.white,
        borderRadius: 10,
        paddingHorizontal: 15,

        marginTop: 25,
        marginBottom: 40,
        paddingVertical: 20,
    },
    detailPageWrap: {},
    tipText: {
        color: Color.gray,
        marginTop: 9,
        fontSize: 12,
        fontWeight: "400",
    },
    SecurityQuestionTitle: {
        color: Color.gray,
        fontSize: 14,
        fontWeight: "400",
        marginBottom: 15,
    },

    // index
    commonWrapIndex: {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    listContentWrap: {
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: Color.softWhiteGray,
        borderBottomWidth: 1,
    },
    listLeftTitle: {
        color: Color.charcoal,
        fontSize: 14,
        fontWeight: "400",
    },

    // UserUpdateInfo
    modalBgContainer: {
        backgroundColor: Color.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: "hidden",
    },
    depositImg: {
        marginTop: 30,
    },
    depositText: {
        color: Color.darkGray,
        textAlign: "center",
        paddingHorizontal: 35,
        fontWeight: "400",
        marginBottom: 10,
    },
});

export default Styles;
