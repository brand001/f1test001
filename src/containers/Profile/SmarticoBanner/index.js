import React, { Component } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
const { width } = Dimensions.get("window");
import AutoHeightImage from "react-native-auto-height-image";

import ImageMap from "@/locales/Images";

class SmarticoBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TouchableOpacity style={{ marginBottom: 0 }} onPress={this.props.handleBannerClick.bind(this)}>
                <AutoHeightImage resizeMode="stretch" width={width * 0.92} source={ImageMap.smarticoBanner} />
            </TouchableOpacity>
        );
    }
}

export default SmarticoBanner;
