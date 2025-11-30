import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import { ImagesUrl } from "@/images/index";
import { translate } from "@/locales/translate";
import { ColumnCenterCenter } from "./CustomView";
const { width, height } = Dimensions.get("window");
import { NoRecordIcon, NoDataIcon } from "./icons/index";
const RecordMap = {
    noRecord: NoRecordIcon,
    noData: NoDataIcon
};

export default function NoRecord({
    text = translate("暂无记录"),
    textStyle = {},
    wrapStyle = {},
    children = null,
    imgName = "noRecord",
    width = 90,
    height = 90,
    imgStyle = {}
}
) {
    const Icon = RecordMap[imgName];
    return (
        <ColumnCenterCenter style={[styles.noRecordBox, wrapStyle]}>
            <Icon width={width} height={height} style={[styles.noRecordImg, imgStyle]} />
            {Boolean(children) ? children : <Text style={[styles.noRecordText, textStyle]}>{text}</Text>}
        </ColumnCenterCenter>
    );
}

const styles = StyleSheet.create({
    noRecordBox: {
        // flex: 1,
        paddingTop: 200,
        paddingHorizontal: "10%",
        zIndex: -10,
    },
    noRecordImg: {
        marginBottom: 10,
    },
    noRecordText: {
        color: "#999",
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
    },
});
