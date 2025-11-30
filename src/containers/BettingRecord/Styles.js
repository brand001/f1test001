import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");
import Color from "$Components/Color";
import { PAGE_HEADER_HEIGHT } from "@/lib/constants";

const Styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#EFEFF4",
    },
    headerWrap: {
        paddingHorizontal: 15,
        width: width,
        backgroundColor: Color.theme,
        height: PAGE_HEADER_HEIGHT,
    },
    tipText: {
        color: "#fff",
        lineHeight: 20,
        flexWrap: "wrap",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    headerListTitle: {
        color: "#666666",
        marginBottom: 5,
        fontSize: 14,
    },
    headerListInfor: {
        color: "#222222",
        fontSize: 14,
        fontWeight: "500",
    },
    list: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    filterContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    filterRow: {

    },
    filterButton: {
        height: 32,
        borderColor: "transparent",
        borderRadius: 8,
        backgroundColor: Color.white,
        paddingHorizontal: 10,
    },
    filterButtonText: {
        fontSize: 12,
        color: Color.darkGray,
        flexShrink: 1,
        marginRight: 8,
    },
});

export default Styles;
