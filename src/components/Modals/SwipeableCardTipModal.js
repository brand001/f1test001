import React, { useState } from "react";

import { Dimensions, Image, Platform, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");
import FilledButton from "$Components/FilledButton";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { ColumnCenterCenter } from "$Components/CustomView";
import { HandPointerLeftIcon } from "$Components/icons/index.js";

export default function SwipeableCardTipModal({ modalData = {}, onCancel = () => {}, modalCallBack = () => {} }) {
    let { modalChildren, direction = "top", text = "向左滑动可取消优惠" } = modalData;
    const [isMoved, setMoved] = useState(false);

    return (
        <ColumnCenterCenter style={[styles.modalContainer]}>
            <ColumnCenterCenter style={[styles.tutorialCenterContainer, {}]}>
                {direction === "bottom" ? (
                    <>
                        <ColumnCenterCenter style={[styles.tutorialCardContainer, { backgroundColor: "#f5f5f5" }]}>
                            {React.cloneElement(modalChildren, { drawableHandler: () => setMoved(true) })}
                        </ColumnCenterCenter>
                        <Text style={{ fontSize: 12, color: Color.white, marginBottom: 6, marginTop: 16, fontWeight: "600" }}>{translate(text)}</Text>
                        <HandPointerLeftIcon />
                    </>
                ) : (
                    <>
                        <Text style={{ fontSize: 12, color: Color.white, marginBottom: 6, fontWeight: "600" }}>{translate(text)}</Text>
                        <HandPointerLeftIcon />
                        <ColumnCenterCenter style={[styles.tutorialCardContainer, { backgroundColor: "#f5f5f5" }]}>
                            {React.cloneElement(modalChildren, { drawableHandler: () => setMoved(true) })}
                        </ColumnCenterCenter>
                    </>
                )}
            </ColumnCenterCenter>

            {
                isMoved &&
                <FilledButton
                    onPress={() => {
                        modalCallBack();
                        onCancel();
                    }}
                    type='small'
                    text={translate("我知道了")}
                    fullWidth={false}
                    wrapStyle={styles.tutorialBtn}
                    textStyle={[]}
                />
            }

        </ColumnCenterCenter >
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        height
    },
    tutorialCenterContainer: {
        position: "absolute",
        top: Platform.OS === "ios" ? height * 0.16 : height * 0.13,
    },
    tutorialCardContainer: {
        paddingTop: 15,
        width,
        minHeight: 110,
        borderRadius: 5,
        display: "flex",
    },
    tutorialBtn: {
        borderRadius: 50,
        paddingHorizontal: 15,
        alignSelf: "center",
        height: 36,
        position: "absolute",
        bottom: 50,
    },
});
