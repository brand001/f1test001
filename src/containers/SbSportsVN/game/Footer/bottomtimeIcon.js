import {
    StyleSheet,

    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Modal,
    Image,
    ScrollView,
    ImageBackground,
    Platform,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";
import moment from "moment";
import { CalendarIcon } from "$Components/icons/index.js";

export default class BottomtimeIcon extends React.Component {
    state = {
        openTime: false,
    };
    render() {
        window.openTime = ((openTime) => {
            this.setState({ openTime });
        });
        return (
            <View style={{ alignSelf: "center" }}>
                {
                    this.state.openTime &&
                    <Touch style={styles.btns} onPress={() => { window.Bottomtimes && window.Bottomtimes(true); }}>
                        <Text style={{ color: "#fff", paddingRight: 8 }}>Chọn Thời Gian</Text>
                        {/* 日期 */}
                        <CalendarIcon
                            fill={"#fff"}
                            width={20}
                            height={20}
                        ></CalendarIcon>
                    </Touch>
                }
            </View>
        );
    }
}



const styles = StyleSheet.create({
    btns: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#00a6ff",
        borderRadius: 35,
        width: 150,
        height: 40,
    }
});
