import React from "react";

import { StyleSheet, View } from "react-native";

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
    divider: {
        backgroundColor: "#2A2A2A",
        height: 1,
        width: "90%",
        alignSelf: "center",
    },
});

export default Divider;
