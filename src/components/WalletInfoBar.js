import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RowCenterBetween, RowCenterCenter } from '$Components/CustomView';
import Color from '$Components/Color';
import {
    WalletIcon,
    PlsIcon
} from '$Components/icons/index';
import { WalletProductGroupNameMapIcon } from "@/images/index.js";
import MoneyText from "$Components/MoneyText";


export default function WalletInfoBar({
    amount = '0',
    onPress = () => {},
    categoryCode = 'ALL'
}) {
    let Icon = WalletProductGroupNameMapIcon[categoryCode] || WalletIcon;
    return (
        <RowCenterBetween style={styles.container}>
            {typeof Icon === "function" ? <Icon wrapStyle={{
                marginHorizontal: 6
            }} /> : Icon}
            <MoneyText
                amount={amount}
                textStyle={styles.amountText}
            />
            <RowCenterCenter
                onPress={onPress}
                style={styles.plusIconWrap}>
                <PlsIcon
                    width={18}
                    height={18}
                />
            </RowCenterCenter>

        </RowCenterBetween>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.white,
        borderRadius: 8,
        overflow: 'hidden',
        height: 26,
        marginRight: 12
    },
    amountText: {
        color: Color.charcoal,
        fontSize: 12,
        fontWeight: '400',
    },
    plusIconWrap: {
        backgroundColor: Color.lightBlue,
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
        height: '100%'
    },
});
