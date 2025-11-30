/* ************* 投注状态 投注中 - 投注成功 - 投注失败************** */
import React from "react";
import { numberWithCommas } from "../BettingDataCheck";
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
import ComboBonusModal from "../../ComboBonusModal";
import { WarningIcon } from "$Components/icons/index.js";
import { ImagesUrl } from "@/images/index";

class Betstatus extends React.Component {
    state = {
        showgift: false
    };
    render() {
        const {
            BettingList,
            BetActiveType,
            detailWidth,
            detailHeight,
        } = this.props;

        //投注結果標示模塊
        const HighlightBetBlock = (props) => {
            return <View style={[styles.CantPlay, { width: width - 20, }, props.extraStyle1 ? props.extraStyle1 : {}]}>
                <View style={[styles.CantPlayErr, props.extraStyle2 ? props.extraStyle2 : {}]}>
                    <Text style={{ color: "#000", fontWeight: "bold" }}>{props.msg}</Text>
                </View>
            </View>;
        };

        const HighlightErrBetBlock = (props) => {
            return <View style={[styles.CantPlay, { width: width - 20 }, props.extraStyle1 ? props.extraStyle1 : {}]}>
                <View style={[styles.CantPlayErr2, props.extraStyle2 ? props.extraStyle2 : {}]}>
                    <View
                        style={{
                            backgroundColor: "#EB2121",
                            borderRadius: 4,
                            paddingVertical: 8,
                            paddingHorizontal: 6,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: props.BetActiveType == 1 ? 11 : 0
                        }}>
                        <WarningIcon fill={"#fff"} checkColor={"#EB2121"}></WarningIcon>
                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500", marginLeft: 6 }}>{props.msg}</Text>
                    </View>
                    {(props.BetActiveType == 1) && (
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 12,
                                paddingHorizontal: 15,
                                fontWeight: "500",
                                textAlign: "center"
                            }}>Hãy kiểm tra lịch sử cược, nếu không hiển thị phiếu cược vui lòng thực hiện lại hoặc liên hệ live chat.</Text>
                    )}
                </View>
            </View>;
        };

        //單注才有的數據
        let SingleBetDataArray = [];

        //串關才有的數據
        let ComobBetDataArray = [];
        let hasComboBonus = false; //是否有串關獎勵
        let comboBonusExtraMoney = 0; //串關獎勵額外盈利

        let Selections = []; //投注選項 用於展示
        let totalBet = 0; //總投注額
        let totalWin = 0; //總可贏金額


        //單注
        if (BetActiveType == 1) {
            BettingList.map((bettingObj) => {

                //計算單注相關金額
                const betSetting = bettingObj.betInfo.BetSettings;
                //是否負數盤
                const IsMinusOdds = betSetting ? betSetting.IsMinusOdds : false;
                const BetAmount = bettingObj.amount;
                /* 實際投注金額  金额统一乘 负数盘比例（RealBetAmountRate），如果不是负数盘 比例返回的是 （1）  所以统一都乘 RealBetAmountRate */
                const RealBetAmount = betSetting
                    ? Number(Number(BetAmount) * Number(betSetting.RealBetAmountRate)).toFixed(2)
                    : 0;
                //可贏金額 (EstimatedPayoutRate有針對負數盤做調整，所以還是用BetAmount去乘，不是用RealBetAmount)
                const CanWinAmount = betSetting
                    ? Number(Number(BetAmount) * Number(betSetting.EstimatedPayoutRate)).toFixed(2)
                    : 0;

                totalBet = totalBet + Number(RealBetAmount);
                totalWin = totalWin + Number(CanWinAmount);

                SingleBetDataArray.push({
                    IsMinusOdds,
                    BetAmount,
                    RealBetAmount,
                    CanWinAmount,
                    //增加字段用於展示 投注狀態
                    betResultStatus: bettingObj.betResultStatus,
                    errorMsg: bettingObj.errorMsg
                });

                //合併selection，用於展示
                Selections.push(bettingObj.betInfo.Selections);
            });
        } else {
            //串關
            //Selections都一樣 只取第一個BetInfo的Selections
            Selections = BettingList[0].betInfo.Selections;

            //只有串投才有串關獎勵，系統混合沒有
            if (BetActiveType == 2) {
                hasComboBonus = BettingList.filter(b => b.betInfo.HasComboBonus).length > 0;
            }

            BettingList.map((bettingObj, index) => {
                const binfo = bettingObj.betInfo;
                let item = null;
                if (BetActiveType == 2) {
                    item = binfo.BetSettings.find(s => s.ComboType == bettingObj.comboType);
                } else {
                    item = binfo.SystemParlayBetSettings.find(s => s.ComboType == bettingObj.comboType);
                }

                console.log("====betInfo", JSON.parse(JSON.stringify(item)));

                const BetAmount = bettingObj.amount;
                const CanWinAmount = BetAmount * Number(item.EstimatedPayoutRate);
                const TotalBetAmount = BetAmount * item.ComboCount;


                totalBet = totalBet + Number(TotalBetAmount);
                totalWin = totalWin + Number(CanWinAmount);

                ComobBetDataArray.push({ BetAmount, CanWinAmount, BetSetting: item });

                if (item.HasComboBonus) {
                    //額外盈利 = 投注額 x (EstimatedPayoutRate - OriginEstimatedPayoutRate)
                    comboBonusExtraMoney = comboBonusExtraMoney + (BetAmount * (item.EstimatedPayoutRate - item.OriginEstimatedPayoutRate));
                }
            });
        }

        let width = detailWidth ? detailWidth : width;
        let height = detailHeight ? detailHeight : height;
        return (
            <View style={[styles.betstatus, { backgroundColor: isBlue ? "#fff" : "#2C2C2E" }]}>
                {(Selections && Selections.length > 0) ? (
                    <View>
                        {Selections.map((item, index) => {

                            const SingleBetData = SingleBetDataArray[index]; //單注數據
                            return (
                                <View key={index} style={[styles.Betlistitem, { width: width - 20, backgroundColor: isBlue ? "#efeff4" : "#3A3A3C", }]}>
                                    <View style={[styles.betitem, { width: width - 50, }]}>
                                        {item.IsOutRightEvent ? (
                                            <Text style={[styles.teamName, { width: width * 0.7, color: isBlue ? "#000" : "#F5F5F5" }]}>{`${item.OutRightEventName}`}</Text>
                                        ) : (
                                            <Text style={[styles.teamName, { width: width * 0.7, color: isBlue ? "#000" : "#F5F5F5" }]}>{`${item.HomeTeamName +
                                                " vs " +
                                                item.AwayTeamName}`}</Text>
                                        )}
                                        <View>
                                            <Text style={{ color: "#00a6ff", fontSize: 17 }}>
                                                @{item.DisplayOdds}
                                                {/* @<span
													dangerouslySetInnerHTML={{
														__html: ChangeSvg(item.DisplayOdds)
													}}
													className="NumberBet"
												/> */}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.betitem, { width: width - 50, }]}>
                                        <Text style={{ color: isBlue ? "#999" : "#CCCCCC", width: width * 0.4 }}>{item.LeagueName}</Text>
                                        <Text style={{ color: isBlue ? "#000" : "#F5F5F5", width: width * 0.4, textAlign: "right" }}>{item.SelectionDesc}</Text>
                                    </View>
                                    <View style={[styles.betitem, { width: width - 50, }]}>
                                        <Text style={{ color: isBlue ? "#666666" : "#CCCCCC", width: width * 0.6 }}>{item.LineDesc}</Text>
                                        {/* 投注金額框 只適用於單投 */}
                                        {BetActiveType == 1 && (
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tiền Cược: </Text>
                                                {/* 投注额： */}
                                                <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>{SingleBetData.BetAmount} đ</Text>
                                            </View>
                                        )}
                                    </View>
                                    {/* 负数盘 实际投注金额 */}
                                    {BetActiveType == 1 && SingleBetData.IsMinusOdds && (
                                        <View style={[styles.betitem, { width: width - 50, paddingBottom: 0 }]}>
                                            <Text style={{ color: "#000" }}></Text>
                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                                <Text style={{ color: "#bcbec3", fontSize: 10 }}>Cược Thực Tế： {numberWithCommas(SingleBetData.RealBetAmount)} đ</Text>
                                            </View>
                                        </View>
                                    )}
                                    {BetActiveType == 1 && (
                                        <View style={[styles.betitem, { width: width - 50, paddingBottom: 0 }]}>
                                            <Text style={{ color: "#000" }}></Text>
                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                                <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>Tiền Thắng Cược：{SingleBetData.CanWinAmount} đ</Text>
                                                {/* 可赢金额： */}
                                            </View>
                                        </View>
                                    )}
                                    {BetActiveType == 1 && (<>
                                        {/* 0未開始 1投注中 2成功 3失敗 4pending 5賠率變更(等待確認重試) */}
                                        {/* {SingleBetData.betResultStatus === 2 && (
										<HighlightBetBlock msg={'投注成功'} extraStyle1={styles.CantPlay_BetSuccess} extraStyle2={styles.CantPlayErr_BetSuccess}/>
									)} */}
                                        {SingleBetData.betResultStatus === 6 && (
                                            <HighlightErrBetBlock
                                                msg={"Đường truyền bị gián đoạn"}
                                                extraStyle1={styles.CantPlay_BetFail}
                                                extraStyle2={{
                                                    width: "100%",
                                                }}
                                                BetActiveType={BetActiveType}
                                            />//投注未知錯誤
                                        )}
                                        {SingleBetData.betResultStatus === 3 && (
                                            <HighlightBetBlock msg={SingleBetData.errorMsg || "Đặt Cược Thất Bại"} extraStyle1={styles.CantPlay_BetFail} />//投注失败
                                        )}
                                        {SingleBetData.betResultStatus === 4 && (
                                            <HighlightBetBlock msg={"Đang Chờ Xác Nhận"} extraStyle1={styles.CantPlay_Pending} extraStyle2={styles.CantPlayErr_Pending} />//等待确认中
                                        )}
                                        {SingleBetData.betResultStatus === 5 && (
                                            <HighlightBetBlock msg={"Tỷ lệ cược đã thay đổi"} extraStyle1={styles.CantPlay_OddsChanged} extraStyle2={styles.CantPlayErr_OddsChanged} />//赔率变更
                                        )}
                                    </>)}
                                </View>
                            );
                        })}
                    </View>
                ) : null}
                <View className="Bottom-btn">
                    {/* 混合过关 系统混合过关*/}
                    {BetActiveType == 2 && <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontWeight: "bold" }}>Cược Xiên</Text>}
                    {BetActiveType == 3 && <Text style={{ color: isBlue ? "#000" : "#F5F5F5", fontWeight: "bold" }}>Cược Xiên Hệ Thống</Text>}
                    {(BetActiveType == 2 || BetActiveType == 3) &&
                        BettingList.map((bettingObj, index) => {
                            const ComboBetData = ComobBetDataArray[index]; //串投數據
                            const item = ComboBetData.BetSetting;

                            return (
                                <View style={{ paddingBottom: 15 }} key={index}>
                                    <View>
                                        <Text className="set-gray" style={{ color: isBlue ? "#000" : "#F5F5F5" }}>
                                            {item.ComboTypeName} x {item.ComboCount}@{item.EstimatedPayoutRate}
                                        </Text>
                                        {item.HasComboBonus && (
                                            <Touch
                                                onPress={() => {
                                                    this.setState({
                                                        showgift: !this.state.showgift
                                                    });
                                                }} className="gift" style={styles.gift}>
                                                <View style={styles.giftBg}>
                                                    <Image resizeMode='stretch' source={ImagesUrl.orange} style={{ width: 75, height: 35 }} />
                                                </View>
                                                <Text style={{ color: "#fff", paddingRight: 8 }}>{item.ComboBonusPercentage}%</Text>
                                                <Image resizeMode='stretch' source={ImagesUrl.gift} style={{ width: 22, height: 22 }} />

                                                {/* <ReactSVG
													src={'/svg/betting/gift.svg'}
													onClick={() => {
														this.setState({
															showgift: !this.state.showgift
														});
													}}
													style={{ marginLeft: 0 }}
												/> */}
                                            </Touch>
                                        )}
                                        {
                                            this.state.showgift &&
                                            <ComboBonusModal
                                                visible={this.state.showgift}
                                                onClose={() => {
                                                    this.setState({
                                                        showgift: false
                                                    });
                                                }}
                                            />
                                        }
                                    </View>
                                    <View style={styles.BetAmountHun}>
                                        {/* 投注额： */}
                                        <Text className="light-gray" style={{ color: isBlue ? "#000" : "#F5F5F5" }}>
                                            Tiền Cược: <Text style={{ fontWeight: "bold" }}>{Number(ComboBetData.BetAmount).toFixed(2)} đ</Text>
                                        </Text>
                                        {/* 可赢金额： */}
                                        <Text className="light-gray" style={{ color: isBlue ? "#000" : "#F5F5F5" }}>
                                            Tiền Thắng Cược：<Text style={{ fontWeight: "bold" }}>{Number(ComboBetData.CanWinAmount).toFixed(2)} đ</Text>
                                        </Text>
                                    </View>
                                    {/* 0未開始 1投注中 2成功 3失敗 4pending 5賠率變更(等待確認重試) */}
                                    {/* {bettingObj.betResultStatus === 2 && (
									<HighlightBetBlock msg={'投注成功'} extraStyle1={styles.CantPlay_BetSuccess} extraStyle2={styles.CantPlayErr_BetSuccess}/>
								)} */}
                                    {bettingObj.betResultStatus === 6 && (
                                        <HighlightErrBetBlock
                                            msg={"Đường truyền bị gián đoạn"}
                                            extraStyle1={styles.CantPlay_BetFail}
                                            extraStyle2={{
                                                width: "80%",
                                            }}
                                            BetActiveType={BetActiveType}
                                        />//投注未知錯誤
                                    )}
                                    {bettingObj.betResultStatus === 3 && (
                                        <HighlightBetBlock msg={bettingObj.errorMsg || "Đặt Cược Thất Bại"} extraStyle1={styles.CantPlay_BetFail} />//投注失败
                                    )}
                                    {bettingObj.betResultStatus === 4 && (
                                        <HighlightBetBlock msg={"Đang Chờ Xác Nhận"} extraStyle1={styles.CantPlay_Pending} extraStyle2={styles.CantPlayErr_Pending} />//等待确认中
                                    )}
                                    {bettingObj.betResultStatus === 5 && (
                                        <HighlightBetBlock msg={"Tỷ lệ cược đã thay đổi"} extraStyle1={styles.CantPlay_OddsChanged} extraStyle2={styles.CantPlayErr_OddsChanged} />//赔率变更
                                    )}
                                </View>
                            );
                        })}
                    <View style={styles.BetAmount}>
                        <Text className="gray" style={{ color: isBlue ? "#666666" : "#CCCCCC" }}>
                            Tổng Tiền Cược :
                            {/* 总投注额：￥ */}
                        </Text>
                        <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>{Number(totalBet).toFixed(2)} đ</Text>
                        {hasComboBonus && (
                            <View className="total-amount">
                                <Text className="gray">额外赢利</Text>
                                <Text style={{ color: "#000" }}>
                                    ￥{(comboBonusExtraMoney > 0) ? (
                                        Number(comboBonusExtraMoney).toFixed(2)
                                    ) : (
                                        0
                                    )}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.BetAmount}>
                        <Text style={{ color: isBlue ? "#666666" : "#CCCCCC" }} className="gray">
                            Tiền Thắng Cược :
                            {/* 可赢金额：￥ */}
                        </Text>
                        <Text style={{ color: isBlue ? "#222222" : "#F5F5F5" }}>{Number(totalWin).toFixed(2)} đ</Text>
                    </View>
                </View>
            </View>
        );
    }
}
export default Betstatus;
