import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

import { ImagesUrl } from "@/images/index";

const AnimatableView = Animatable.View;
const AnimatableImage = Animatable.Image;
const { width, height } = Dimensions.get("window");
export default class LoadIngWebViewGif extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { loadStatus } = this.props;
        return (
            <AnimatableView animation={loadStatus ? "fadeIn" : "fadeOutDownBig"} resizeMode="stretch" easing="ease-out" style={[styles.viewContainer, { zIndex: loadStatus ? 1 : -100 }]}>
                <AnimatableImage resizeMode="stretch" easing="ease-out" style={styles.loadingImg} animation={loadStatus ? "zoomIn" : "bounceIn"} source={ImagesUrl.gameLoad} />
            </AnimatableView>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, .8)",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 100,
    },
    loadingImg: {
        width: 0.35 * width,
        height: 0.35 * width,
    },
});
