import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { RowCenterCenter } from "./CustomView";
import Color from "./Color";
import { getMoneyFormat } from "$Utils";

// 自定義動畫數字組件 - 主流實現方式
const AnimatedNumber = ({ value, style, isDecimal = false }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = React.useState(0);

    useEffect(() => {
        const targetValue = parseInt(value, 10) || 0;

        // 創建動畫
        const animation = Animated.timing(animatedValue, {
            toValue: targetValue,
            duration: 800,
            useNativeDriver: false,
        });

        // 監聽動畫值變化
        const listener = animatedValue.addListener(({ value: animatedVal }) => {
            setDisplayValue(Math.floor(animatedVal));
        });

        // 開始動畫
        animation.start();

        // 清理
        return () => {
            animatedValue.removeListener(listener);
            animation.stop();
        };
    }, [value, animatedValue]);

    // 如果是小數部分，直接顯示原始值（保持格式如 "02"）
    if (isDecimal) {
        return (
            <Text style={style}>
                {value || "00"}
            </Text>
        );
    }

    return (
        <Text style={style}>
            {displayValue.toLocaleString()}
        </Text>
    );
};

export default function MoneyText({ amount = 0, textStyle = {} }) {
    const balance = getMoneyFormat(amount || 0, "").replace(/,/g, "");
    const mergeStyle = [styles.moneyText, { ...textStyle }];

    let isSplit = balance.includes(".");
    let [integer, decimal] = balance.split(".");

    return (
        <RowCenterCenter>
            {/* 貨幣符號 - 越南盾放在後面 */}
            {window.LANGUAGE !== "VN" && (
                <Text style={mergeStyle}>
                    {window.LANGUAGE === "CN" ? "¥ " : "฿ "}
                </Text>
            )}


            <AnimatedNumber
                value={integer}
                style={mergeStyle}
            />
            {
                isSplit &&
                <>
                    <Text style={mergeStyle}>.</Text>

                    <AnimatedNumber
                        value={decimal}
                        style={mergeStyle}
                        isDecimal={true}
                    />
                </>
            }


            {/* 越南盾符號放在後面 */}
            {window.LANGUAGE === "VN" && (
                <Text style={mergeStyle}> đ</Text>
            )}
        </RowCenterCenter>
    );
}


const styles = StyleSheet.create({
    moneyText: {
        fontWeight: "600",
        color: Color.charcoal,
        fontSize: 20,
    },
});
