import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { ArrowIcon } from "$Components/icons/index.js";
import Color from "./Color";
import { ColumnCenterCenter, RowStartCenter } from "./CustomView";

export default function Pagination({ onChange, total, current }) {
    return (
        <RowStartCenter style={styles.container}>
            <ColumnCenterCenter
                style={[styles.numBtn]}
                onPress={() => {
                    if (current > 1) {
                        onChange(current - 1);
                    }
                }}>
                <ArrowIcon
                    fill={current > 1 ? Color.black : Color.gray}
                    width={14}
                    height={14}
                />
            </ColumnCenterCenter>

            {Array.from({ length: total }, (_, index) => index + 1).map((v, i) => {
                let flag = current == v;
                return (
                    <ColumnCenterCenter
                        key={i}
                        onPress={() => {
                            onChange(v);
                        }}
                        style={[
                            styles.numBtn,
                            {
                                backgroundColor: flag ? "#E4E4E4" : "transparent",
                            },
                        ]}>
                        <Text style={[styles.numBtnText]}>{v}</Text>
                    </ColumnCenterCenter>
                );
            })}

            <ColumnCenterCenter
                style={[styles.numBtn]}
                onPress={() => {
                    if (current + 1 <= total) {
                        onChange(current + 1);
                    }
                }}>
                <ArrowIcon
                    fill={current + 1 <= total ? Color.black : Color.gray}
                    width={14}
                    height={14}
                />
            </ColumnCenterCenter>
        </RowStartCenter>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    arrow: {
        width: 26,
        height: 26,
    },
    numBtn: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 5,
        marginHorizontal: 3,
    },
    numBtnText: {
        color: "#222",
    },
});
