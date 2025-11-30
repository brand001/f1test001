import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import AnimatedNumbers from "react-native-animated-numbers";
import { getMoneyFormat } from "$Utils";
import { RefreshIcon } from "$Components/icons/index.js";
import actions from "$LIB/redux/actions/index";
import Color from "./Color";
import { RowCenterCenter, RowCenterStart } from "./CustomView";

export default function RefreshMoney({ textStyle = {}, showMoney = true, callBack = () => {}, showIcon = true }) {
    const reduxState = useSelector(state => state);
    const dispatch = useDispatch();
    const balance = reduxState?.userInfo?.balanceTotal || 0;

    // Format balance according to rules: truncate to 2 decimals, remove .00 if zero
    const formatBalance = (amount) => {
        // Truncate to 2 decimal places (not round)
        const truncated = Math.floor(amount * 100) / 100;
        const integerPart = Math.floor(truncated);
        const decimalPart = Math.round((truncated - integerPart) * 100);

        // If decimal part is 0, return only integer
        if (decimalPart === 0) {
            return { integer: integerPart, decimal: null };
        }

        // Otherwise return integer and 2-digit decimal
        return {
            integer: integerPart,
            decimal: decimalPart.toString().padStart(2, "0")
        };
    };

    const formattedBalance = formatBalance(balance);

    const mergeStyle = [styles.moneyText, { ...textStyle }];
    return (
        <RowCenterStart>
            {/* {showMoney && (
                <RowCenterCenter>
                    {
                        window.LANGUAGE !== "VN" &&
                        <Text style={mergeStyle}>{
                            window.LANGUAGE == "CN" ? "¥ " : "฿ "
                        }</Text>
                    }
                    <AnimatedNumbers
                        includeComma
                        animateToNumber={formattedBalance.integer}
                        fontStyle={{ ...styles.moneyText, ...textStyle }}
                    />
                    {
                        formattedBalance.decimal &&
                        <>
                            <Text style={mergeStyle}>.</Text>

                            <AnimatedNumbers
                                includeComma
                                animateToNumber={parseInt(formattedBalance.decimal)}
                                fontStyle={{ ...styles.moneyText, ...textStyle }}
                            />
                        </>
                    }
                    {
                        window.LANGUAGE == "VN" &&
                        <Text style={mergeStyle}>{" đ"}</Text>
                    }
                </RowCenterCenter>
            )} */}

            {
                showMoney &&
                <Text numberOfLines={1} style={[styles.moneyText, { ...textStyle }]}>
                    {getMoneyFormat(balance)}
                </Text>
            }


            {
                showIcon &&
                <View style={{ marginLeft: 8 }}>
                    <RefreshIcon
                        fill={Color.gray}
                        width={16}
                        height={16}
                        spinning={true}
                        onPress={() => {
                            dispatch(actions.ACTION_UserInfo_getBalanceAll(true));
                            callBack();
                        }}
                    />
                </View>
            }
        </RowCenterStart>
    );
}

const styles = StyleSheet.create({
    moneyText: {
        fontWeight: "600",
        color: Color.charcoal,
        fontSize: 20,
    },
});
