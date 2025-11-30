import React from "react";
import { Image, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import Touch from "react-native-touch-once";
class IconDrag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { CIRCLE_SIZE, closeImgstyle, OpenMenu, chickButton } = this.props;
        return (
            <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                <Touch
                    style={{
                        position: "absolute",
                        top: -closeImgstyle.height / 4,
                        right: -closeImgstyle.width / 4,
                        zIndex: 9999,
                    }}
                    onPress={() => OpenMenu()}>
                    <Image resizeMode="stretch" source={this.props.closeImg} style={{ ...closeImgstyle }} />
                </Touch>
                <Touch style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE + 45 }} onPress={() => chickButton()}>
                    <FastImage source={this.props.iconImg} resizeMode="stretch" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }} />
                </Touch>
            </View>
        );
    }
}

const styles = StyleSheet.create({});

export default IconDrag;
