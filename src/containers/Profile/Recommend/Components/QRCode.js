/**
 * 推薦好友組件
 * @param {string} url - 推薦連結
 * @param {function} onCopy - 複製連結的回調函數
 * @param {function} onSaveImage - 保存 QR 碼圖片的回調函數
 * @param {function} onShare - 分享連結的回調函數
 *
 * @example
 * <QRCode
 *   url="https://fun88.com/refer/abc123"
 *   onCopy={() => copyToClipboard(url)}
 *   onSaveImage={() => saveQRImage()}
 *   onShare={() => shareURL()}
 * />
 */
import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import QRCodeA from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { CopyIcon } from "$Components/icons/index.js";
import { translate } from "$locales/translate";
import { RowCenterStart, RowCenterAround, ColumnCenterCenter } from "$Components/CustomView";
const { width } = Dimensions.get("window");

class QRCode extends Component {
    constructor(props) {
        super(props);
        this.ViewShotRef = null;
    }

    render() {
        const { url, onCopy, onSaveImage, onShare } = this.props;

        return (
            <View>
                {/* 標題 */}
                <Text style={styles.urlTitle}>{translate("推荐好友(QRCODE)")}</Text>

                {/* QR CODE內容區塊 */}
                <ColumnCenterCenter style={styles.urlInner}>
                    <RowCenterStart style={[{ alignSelf: "stretch" }]}>
                        <Text style={styles.urlInnerTitle}>{translate("分享链接")}</Text>
                    </RowCenterStart>

                    {/* 推薦好友URL */}
                    <RowCenterStart style={styles.Urls}>
                        <Text style={styles.UrlsText} numberOfLines={1}>
                            {url}
                        </Text>

                        {/* M3使用icon複製鏈接 */}
                        {window.LANGUAGE === "VN" && <CopyIcon fill={Color.theme} onPress={onCopy} />}
                    </RowCenterStart>

                    {/* M1 & M2 使用這按鈕複製鏈接 */}
                    {(window.LANGUAGE === "CN" || window.LANGUAGE === "TH") && (
                        <ColumnCenterCenter>
                            <FilledButton wrapStyle={styles.copyBtn} textStyle={styles.copyBtnText} text={translate("复制链接")} onPress={onCopy} />
                        </ColumnCenterCenter>
                    )}

                    {/* QRCODE標題 */}
                    <RowCenterStart style={[{ alignSelf: "stretch" }]}>
                        <Text style={styles.urlInnerTitle}>{translate("推荐二维码")}</Text>
                    </RowCenterStart>

                    {/* QRCDOE */}
                    <RowCenterStart style={[{ padding: 10 }]}>
                        <ViewShot
                            ref={c => {
                                this.ViewShotRef = c;
                            }}
                            options={{ format: "jpg", quality: 0.9 }}>
                            {<QRCodeA value={url} size={140} bgColor="#000" />}
                        </ViewShot>
                    </RowCenterStart>
                    <RowCenterAround style={[{ marginTop: 10 }]}>
                        {/* 左邊按鈕保存二维码 */}
                        <FilledButton
                            type="medium"
                            wrapStyle={{ width: width * 0.35, marginRight: 30 }}
                            text={translate("保存二维码")}
                            onPress={onSaveImage} />

                        {/* 右邊按鈕分享二维码 */}
                        <FilledButton
                            type="medium"
                            wrapStyle={{ width: width * 0.35, backgroundColor: Color.vibrantGreen }}
                            text={translate("分享")}
                            onPress={onShare} />
                    </RowCenterAround>
                    <Text style={styles.UrlsNote}>{translate("推荐好友QRCODE备注")}</Text>
                </ColumnCenterCenter>
            </View>
        );
    }

    // 暴露 ViewShot 的引用，以便父組件可以調用其方法
    getViewShot = () => {
        return this.ViewShotRef;
    };
}

const styles = StyleSheet.create({
    urlTitle: {
        fontSize: 14,
        color: Color.charcoal,
        fontWeight: "500",
        marginBottom: 15,
    },
    QRTitle: {
        color: Color.darkGray,
        width: width - 60,
        fontSize: 14,
    },
    copyBtn: {
        width: width * 0.4,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: Color.theme,
    },
    copyBtnText: {
        fontSize: 14,
        fontWeight: "500",
        color: Color.white,
    },
    urlInner: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 15,
    },
    urlInnerTitle: {
        fontSize: 14,
        color: Color.darkGray,
        textAlign: "left",
    },
    Urls: {
        width: width - 60,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: Color.lightSilver,
    },
    UrlsText: {
        color: Color.charcoal,
        width: width - 120,
        fontSize: 14,
        overflow: "hidden",
    },
    UrlsNote: {
        fontSize: 12,
        color: Color.gray,
        marginTop: 15,
        lineHeight: 16,
    },
});

export default QRCode;
