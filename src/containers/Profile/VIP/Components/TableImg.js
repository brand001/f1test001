import { ColumnCenterCenter } from "$Components/CustomView";
import React from "react";

import { Dimensions, Text, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
const { width } = Dimensions.get("window");

const TableImg = props => {
    const { title, imageSource, containerStyle = {} } = props;

    return (
        <View style={containerStyle}>
            <Text style={styles.Title}>{title}</Text>
            <ColumnCenterCenter style={styles.tableContainer}>
                <AutoHeightImage resizeMode="stretch" source={imageSource} width={width * 0.95} />
            </ColumnCenterCenter>
        </View>
    );
};

const styles = {
    Title: {
        color: "#ABA79D",
        fontSize: 14,
        fontWeight: "500",
        paddingHorizontal: 25,
        marginBottom: 15,
    },
    tableContainer: {
        width: "100%",
        marginBottom: 30,
        paddingHorizontal: 15,
    },
};

export default TableImg;
