import React from "react";

import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

const Styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        paddingHorizontal: 15,
    },
    viewContainer2: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        padding: 16,
    },
    tipText: {
        color: "#666666",
        fontSize: 13,
        marginVertical: 25,
    },
    managerListsStyle: {
        backgroundColor: "#FFFFFF",
        height: 50,
        marginBottom: 16,
        paddingHorizontal: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 4,
    },
    managerListsText0: {
        fontSize: 14,
    },
    managerListsText1: {
        fontSize: 12,
    },
    managerLists: {
        height: 50,
        justifyContent: "center",
        marginBottom: 10,
        overflow: "hidden",
    },

    uploadBox: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    uploadBox2: {
        paddingVertical: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    uploadList: {
        marginBottom: 16,
        paddingVertical: 16,
    },
    uplodFileText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    uploadLine: {
        height: 1,
        backgroundColor: "#E5E5E5",
        width: "100%",
        marginVertical: 20,
    },
    uploadTimes: {
        color: "#999999",
        fontSize: 12,
        textAlign: "center",
        marginVertical: 20,
    },
    uploadFileBtn: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        height: 44,
        paddingHorizontal: 10,
    },
    filenameText: {
        width: "88%",
        color: "#000",
        flexWrap: "wrap",
        textAlign: "left",
    },
    uploadTextInfor: {
        color: "#00A6FF",
        fontSize: 14,
        fontWeight: "400",
        marginLeft: 8
    },

    // guide
    wrapper: {
        marginBottom: 0,
        borderRadius: 6,
        backgroundColor: "#fff",
        marginVertical: 20,
    },
    carouselWrap: {
        width: "100%",
        borderRadius: 8,
        padding: 20,
        paddingBottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    carouselImg: {
        width: width - 80,
        height: (width - 80) * 1.225,
    },
    dotStyle: {
        width: 20,
        height: 6,
        borderRadius: 5,
        backgroundColor: "#00A6FF",
    },
    inactiveDotStyle: {
        width: 6,
        height: 6,
        backgroundColor: "#BCBEC3",
    },
    carouselWrapTitle: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    carouselInfor: {
        color: "#222",
        fontSize: 14,
        marginTop: 8,
        marginBottom: 20,
        textAlign: "center",
    },
    verificationBox: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    verificationTitle: {
        color: "#222",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    verificationText: {
        color: "#666666",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center"
    },
    guideText: {
        color: "#00A6FF",
        fontWeight: "400",
        fontSize: 12,
    },
    deleteButton: {
        backgroundColor: "#fff",
        borderRadius: 16,
        position: "absolute",
        top: 5,
        right: 5,
        padding: 5,
        shadowColor: "#222",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    uploadFileBtn2: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        // height: 44,
        padding: 10,
    },
});

export default Styles;
