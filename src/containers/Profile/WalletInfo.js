import React, { useState } from "react";

import { StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import DropDownSelectArray from "$Components/DropDownSelectArray";
import actions from "$LIB/redux/actions/index";
import WalletLock from "$Components/WalletLock";
import { RefreshIcon } from "$Components/icons/index.js";
import MoneyText from "$Components/MoneyText";

import SecurityLevel from "./SecurityLevel";
import { RowCenterStart } from "$Components/CustomView";

export default function WalletInfo(props) {
    const [index, setIndex] = useState(0);
    const reduxState = useSelector(state => state);
    let { isToggleBalance, withdrawableBalance, totalContractBalance } = reduxState.userInfo;
    let moneyData = reduxState.userInfo.allBalance;
    let isTotalBalance = index == 0;
    const dispatch = useDispatch();


    return (
        <View style={styles.moneyContainer}>
            <DropDownSelectArray
                title={translate("选择类别2")}
                onChange={({ key }) => {
                    setIndex(key);

                    PiwikEventDataHandle({
                        category: "MemberCenter",
                        action: "Choose Balance Type",
                        name: "MemberCenter_BalanceType_C_Choose",
                        path: "",
                        title: "",
                        customProperties: {
                            "MemberCenter_BalanceType_C_Choose": moneyData[key]?.walletProductGroupName, // 修正 key 格式
                        },
                    });
                }}
                realKey="walletProductGroupName"
                data={moneyData}
                callBack={() => {
                    PiwikEventDataHandle("OneWallet1");
                }}
                buttonStyle={{ height: 28, alignSelf: "flex-start" }}
            />

            <RowCenterStart style={{ marginTop: 6, marginBottom: 10 }}>
                <MoneyText amount={props?.balance} textStyle={{}} />
                <RefreshIcon
                    fill={Color.gray}
                    width={16}
                    height={16}
                    spinning={true}
                    onPress={() => {
                        dispatch(actions.ACTION_UserInfo_getBalanceAll(true));
                        PiwikEventDataHandle("OneWallet8");
                    }}
                    wrapStyle={{ marginLeft: 8 }}
                />
            </RowCenterStart>

            {!(!isToggleBalance && index == 0) && (
                <WalletLock
                    key={props.scrollViewKey}
                    firstText={isTotalBalance ? translate("可提款金额") : translate("通用金额")}
                    firstTipText={isTotalBalance ? translate("提款流水将在注单结算后的 15 分钟内更新") : translate("可用于下注任何类别游戏")}
                    secnodText={isTotalBalance ? translate("未完成流水金额") : translate("优惠锁定金额")}
                    secnodTipText={isTotalBalance ? translate("完成流水要求，以解锁符合条件的存款和优惠金额至可提款金额") : translate("因申请优惠而被锁定的金额，仅可于该类别游戏中使用")}
                    balanceItem={
                        isTotalBalance
                            ? {
                                balance: withdrawableBalance,
                                lockedBalance: totalContractBalance,
                            }
                            : moneyData[index]
                    }
                    isToggleBalance={isToggleBalance}
                    defaultIsShow={true}
                    fromPage="profilePage"></WalletLock>
            )}
            <SecurityLevel />
        </View>
    );
}

const styles = StyleSheet.create({
    moneyContainer: {
        backgroundColor: Color.white,
        paddingHorizontal: 16,
        paddingTop: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
});
