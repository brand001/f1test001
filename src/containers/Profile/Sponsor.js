import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";

import CustomScrollView from "$Components/CustomScrollView";
import ImgMap from "$locales/Images";

const { width } = Dimensions.get("window");

const SPONSOR_IMAGES = [
    ImgMap.Sponsor_1,
    ImgMap.Sponsor_2,
    ImgMap.Sponsor_3,
    ImgMap.Sponsor_4,
    ImgMap.Sponsor_5,
    ImgMap.Sponsor_6,
    ImgMap.Sponsor_7,
    ImgMap.Sponsor_8,
    ImgMap.Sponsor_9,
];

const Sponsor = () => {
    return (
        <View style={styles.container}>
            <CustomScrollView>
                {SPONSOR_IMAGES.map((image, index) => (
                    <AutoHeightImage key={index} source={image} width={width} />
                ))}
            </CustomScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default Sponsor;
