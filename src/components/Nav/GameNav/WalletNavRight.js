import React from "react";

import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getMoneyFormat } from "$Utils";
import Color from "$Components/Color";
import { ArrowIcon } from "$Components/icons/index.js";
import LiveChat from "$Components/LiveChat";
import actions from "$LIB/redux/actions/index";
import { RowCenterAround, RowCenterStart } from "$Components/CustomView";

export default function(props) {
    const dispatch = useDispatch();
    let { children, walletCode = "" } = props;

    const reduxState = useSelector(state => state);
    let { userInfo = {}, userSetting = {} } = reduxState;
    let { allBalance = [] } = userInfo;
    let balanceItem = allBalance.find(v => v?.walletProductGroupCode == walletCode) || { balance: 0, walletProductGroupName: "" };
    let { flag = false } = userSetting?.oneClickPopup || {};

    return (
        <RowCenterAround style={styles.navRightBtn}>
            {ApiPort.UserLogin && (
                <RowCenterStart
                    onPress={() => {
                        dispatch(actions.ACTION_ONECLICKPOPUP({ flag: !flag }));
                    }}
                    style={{
                        backgroundColor: "#fff",
                        paddingHorizontal: Platform.OS == "ios" ? 6 : 2,
                        borderRadius: 6,
                        paddingVertical: 4,
                    }}>
                    <View style={{ alignItems: "flex-end", marginRight: 4 }}>
                        <Text style={{ fontSize: 10, color: "#000" }}>{balanceItem.walletProductGroupName}</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                                color: "#000",
                            }}>
                            {getMoneyFormat(balanceItem.balance)}
                        </Text>
                    </View>
                    <ArrowIcon fill={Color.gray} width={10} height={10} direction={flag ? "top" : "bottom"} wrapStyle={{ marginLeft: 5 }} />
                </RowCenterStart>
            )}
            {children}
            <LiveChat></LiveChat>
        </RowCenterAround>
    );
}

const styles = StyleSheet.create({
    navRightBtn: {
        paddingRight: 15,
    },
});
