/* -----------确认投注 总金额 可赢 开始下注-------------*/

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
import { connect } from "react-redux";
import { ACTION_BetCart_setIsComboBet } from "../../../lib/redux/actions/BetCartAction";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

class Bettotalamount extends React.Component {
    sum(arr) {
        return eval(arr.join("+"));
    }
    render() {
        const {
            /* 盘口计算盈利金额利率 类型array */
            EstimatedPayoutRatelist,
            /* 用于计算 总投注额 */
            ComboCount,
            /* 注单的类型 */
            BetActiveType,
            /* 投注的金额列表 */
            BetAmountvallist,
            /* 返回的盘口详情 */
            BetInfoData,
            /* 选择的盘口key */
            ActiveInput,
            /* 选择的免费投注盘口的key */
            FreeBetTokenList,
            /* 金额含有错误 */
            Amounterror,
            /* 用户余额 */
            Balance,
            detailWidth,
            detailHeight,
        } = this.props;

        /* 总投注金额 */
        const totalBet = ComboCount != "" ? this.sum(ComboCount) : 0;

        //是否有投注
        const NOBet = totalBet <= 0;

        /* 余额不足 */
        const BalanceNotEnough = Balance <= 0 || (Balance < totalBet);

        //不用檢查串關的投注選項數量，如果不夠，在crossBetting就會轉到CannotBetting去展示，根本不會出現這個模塊

        //不能投注  1.沒輸入金額  2.餘額不足  3.金額未達上下限
        const CanNotBet = NOBet || BalanceNotEnough || Amounterror;

        //是否有串關獎勵
        let hasComboBonus = false;
        //只有串投才有串關獎勵，系統混合沒有
        if (BetActiveType == 2 && BetInfoData && BetInfoData.BetSettings && BetInfoData.BetSettings.length > 0) {
            hasComboBonus = BetInfoData.BetSettings.filter(bs => bs.HasComboBonus).length > 0;
        }

        let comboBonusExtraMoney = 0; //串關獎勵額外盈利
        if (hasComboBonus) {
            //額外盈利 = 投注額 x (EstimatedPayoutRate - OriginEstimatedPayoutRate)
            BetInfoData.BetSettings.map((item, index) => {
                if (item.HasComboBonus) {
                    comboBonusExtraMoney = comboBonusExtraMoney + (BetAmountvallist[index] * (item.EstimatedPayoutRate - item.OriginEstimatedPayoutRate));
                }
            });
        }

        let width = detailWidth ? detailWidth : width;
        let height = detailHeight ? detailHeight : height;
        return (
            <View style={[styles.bettotalamount, { width: width, backgroundColor: isBlue ? "#fff" : "#2C2C2E" }]}>
                <View style={[styles.total_amount, { width: width, }]}>
                    <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tổng Tiền Cược</Text>
                    {/* 总投注额 */}
                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5" }}>{totalBet != 0 ? Number(totalBet).toFixed(2) : "0.00"} đ</Text>
                </View>
                {hasComboBonus && (
                    <View style={[styles.total_amount, { width: width, }]}>
                        <Text style={{ color: "#999" }}>额外赢利</Text>
                        <Text style={{ color: "#000", fontWeight: "bold" }}>
							￥{(comboBonusExtraMoney > 0) ? (
                                Number(comboBonusExtraMoney).toFixed(2)
                            ) : (
                                0
                            )}
                        </Text>
                    </View>
                )}
                <View style={[styles.total_amount, { width: width, }]}>
                    <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tiền Thắng Cược</Text>
                    {/* 可赢金额 */}
                    <Text style={{ color: isBlue ? "#000" : "#F5F5F5" }}>{this.sum(EstimatedPayoutRatelist).toFixed(2)} đ</Text>
                </View>
                <View style={[styles.BetingBtn, { width: width, }]}>
                    {BetActiveType == 1 ? (
                        <Touch
                            style={styles.Btn_left}
                            onPress={() => {
                                this.props.betCart_setIsComboBet(true, this.props.Vendor.configs.VendorName);
                                this.props.CloseBottomSheet();
                            }}
                        >

                            <Text style={{ color: "#1CA6FC" }}>+ Xiên</Text>
                            {/* +串 */}
                        </Touch>
                    ) : (
                        <Touch
                            style={styles.Btn_left}
                            onPress={() => {
                                this.props.betCart_setIsComboBet(false, this.props.Vendor.configs.VendorName);
                                this.props.RemoveBetCart();
                                if (this.props.EuroCupBet || this.props.EuroCupBetDetail) {
                                    PiwikEventDataHandle("SbSportsVN_ClearBetCartEUROPage");
                                } else {
                                    PiwikEventDataHandle("SbSportsVN_ClearBetCart");
                                }
                            }}
                        >
                            <Text style={{ color: "#1CA6FC" }}>Xóa Tất Cả</Text>
                            {/* 全部清除 */}
                        </Touch>
                    )}

                    <Touch
                        style={[styles.Btn_right, { width: width * 0.6, backgroundColor: CanNotBet ? (isBlue ? "#efeff4" : "#666666") : "#00A6FF", }]}
                        onPress={() => {
                            if (NOBet) {
                                window.KeyBoardToast("fail", "Vui lòng điền số tiền cược");//请输入金额后再进行投注
                                return;
                            }
                            if (BalanceNotEnough) {
                                window.KeyBoardToast("fail", "Số dư của Bạn còn lại rất ít, Nạp Tiền Ngay");//您的余额不足，请充值后再进行投注
                                return;
                            }
                            if (Amounterror) {
                                window.KeyBoardToast("fail", "Vui lòng nhập số tiền đặt cược chính xác");//请输入正确的投注金额
                                return;
                            }
                            this.props.StartBetting(
                                BetInfoData,
                                BetAmountvallist,
                                ActiveInput,
                                FreeBetTokenList,
                            );

                            if (this.props.EuroCupBet || this.props.EuroCupBetDetail) {
                                PiwikEventDataHandle("SbSportsVN_PlacebetEUROPage");
                            } else {
                                PiwikEventDataHandle("SbSportsVN_Placebet");
                            }
                        }}
                    >
                        <Text style={{ color: CanNotBet ? "#ccc" : "#fff", }}>Xác Nhận Đặt Cược</Text>
                        {/* 投注 */}
                    </Touch>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
    betCart_setIsComboBet: (isComboBet, vendorName) => ACTION_BetCart_setIsComboBet(isComboBet, vendorName),
};

export default connect(mapStateToProps, mapDispatchToProps)(Bettotalamount);
