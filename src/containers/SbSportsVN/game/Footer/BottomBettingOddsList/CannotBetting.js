/*----------- 当投注条件不成立时 无法投注时 显示 ---------- */

import React from "react";
import {
    StyleSheet,

    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Alert,
    Modal,
    ImageBackground,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Touch from "react-native-touch-once";
import styles from "../styleType";
import { Toasts } from "$Toasts";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class CannotBetting extends React.Component {
    render() {
        const { type, isNotEnoughSelections, detailWidth, detailHeight } = this.props;

        let message = () => {
            if (type == 2 && isNotEnoughSelections) {
                return "Cược Xiên phải chọn ít nhất 2 tỷ lệ cược hợp lệ";//混合过关最少需要选取两个以上的有效投注选项呦
            }
            if (type == 3 && isNotEnoughSelections) {
                return "系统混合过关最少需要选取三个以上的有效投注选项呦";
            }
            return "暂时无法投注";
        };

        let width = detailWidth ? detailWidth : width;
        let height = detailHeight ? detailHeight : height;
        return (

            <View style={[styles.bettotalamount, { width: width, backgroundColor: isBlue ? "#fff" : "#2C2C2E" }]}>
                <View style={[styles.total_amount, { width: width, }]}>
                    <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tổng Tiền Cược</Text>
                    {/* 总投注额 */}
                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontWeight: "bold" }}>0 đ</Text>
                </View>
                <View style={[styles.total_amount, { width: width, }]}>
                    <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tiền Thắng Cược</Text>
                    {/* 可赢金额 */}
                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontWeight: "bold" }}>0 đ</Text>
                </View>
                <View style={[styles.BetingBtn, { width: width }]}>
                    <Touch
                        style={styles.Btn_left}
                        onPress={() => {
                            this.props.RemoveBetCart();
                            PiwikEventDataHandle("SbSportsVN_ClearBetCart");
                        }}
                    >
                        <Text style={{ color: "#1CA6FC" }}>Xóa Tất Cả</Text>
                        {/* 全部清除 */}
                    </Touch>
                    <Touch
                        style={[styles.Btn_right, { width: width * 0.6, backgroundColor: isBlue ? "#efeff4" : "#666666" }]}
                        onPress={() => {
                            window.KeyBoardToast("fail", message());
                        }}>
                        <Text style={{ color: "#ccc" }}>Xác Nhận Đặt Cược</Text>
                        {/* 投注 */}
                    </Touch>
                </View>
            </View>
        // <div className="Bottom-flex">
        // 	<div className="total-amount">
        // 		<label className="gray">总投注额</label>
        // 		<b>￥ 0</b>
        // 	</div>
        // 	<div className="total-amount">
        // 		<label className="gray">可赢金额</label>
        // 		<b>￥ 0</b>
        // 	</div>
        // 	<div className="BetingBtn">
        // 		<button
        // 			className="Btn-left"
        // 			onClick={() => {
        // 				this.props.RemoveBetCart([], 2);
        // 			}}
        // 		>
        // 			全部清除
        // 		</button>

        // 		<button
        // 			className="Btn-right"
        // 			style={{
        // 				color: '#ccc'
        // 			}}
        // 			onClick={() => {
        // 				Toasts.fail(message());
        // 			}}
        // 		>
        // 			<big>投注</big>
        // 		</button>
        // 	</div>
        // </div>
        );
    }
}

export default CannotBetting;
