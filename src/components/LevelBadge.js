import React from "react";

import { Image, StyleSheet, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { RowCenterCenter } from "$Components/CustomView";

const LevelBadge = ({
    levelName = "",
    Icon = null,
    style = {},
    colors = ["#FFFDFA", "#FFB81B", "#B17C00"],
    locations = [0, 0.075, 1]
}) => {
    return (
        <LinearGradient
            colors={colors}
            locations={locations}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.levelContainer, style]}>
            <RowCenterCenter>
                <Icon />
                <Text style={styles.levelText}>{levelName}</Text>
            </RowCenterCenter>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    levelContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        height: 22,
        paddingHorizontal: 10,
        marginTop: 4,
    },
    levelText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "400",
        marginLeft: 2
    },
});

export default LevelBadge;
