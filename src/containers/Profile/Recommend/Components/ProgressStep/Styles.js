import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");


const styles = StyleSheet.create({
    pageList: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: width - 30,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    num: {
        color: "#00A6FF",
        fontSize: 50,
        fontWeight: "bold",
        marginRight: 15,
    },
    contentContainer: {
        flex: 1, // 讓內容區域佔據剩餘空間
    },
    pageapian: {
        color: "#222222",
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: "bold",
    },
    pageapian1: {
        color: "#666666",
        fontSize: 12,
        paddingVertical: 2,
    },
    touchBtn: {
        marginTop: 10,
        paddingHorizontal: 8,
        height: 30,
        alignSelf: "flex-start"
    },
    sVerif: {
        borderRadius: 15,
    },
    verifyIcon: {
        width: 18,
        height: 18,
        borderRadius: 9999,
        justifyContent: "center",
        alignItems: "center",
    },
});


export default styles;
