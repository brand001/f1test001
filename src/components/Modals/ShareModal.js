import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
const { width } = Dimensions.get("window");

import QRCodeA from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { CopyIcon, DownloadIcon } from "$Components/icons/index";
import { CopyText, SaveImg } from "$Utils";
import { ColumnCenterCenter, ColumnCenterStart, ColumnStartCenter, RowCenterBetween, RowCenterCenter, RowCenterStart } from "$Components/CustomView";
import NetworkImage from "$Components/NetworkImage";

const ShareModal = ({ modalData = {}, onCancel = () => {} }) => {
    const ViewShotRef = useRef(null);

    const {
        title = "",
        text = "",
        imageUrl = null,
        renderHeader = null,
        copyUrl = "",
        fromPage = ""
    } = modalData;

    return (
        <View style={styles.container}>
            <ColumnCenterCenter style={styles.GameDetailSharePopupTopBox}>
                <ViewShot
                    ref={ViewShotRef}
                    options={{
                        fileName: `${title}.png`,
                        format: "png",
                    }}
                    style={styles.GameDetailSharePopupShareBox}>
                    {renderHeader ? (
                        renderHeader
                    ) : (
                        <NetworkImage
                            style={styles.GameDetailSharePopupShareBoxTop}
                            resizeMode="stretch"
                            source={imageUrl}
                        />
                    )}
                    <RowCenterBetween style={styles.GameDetailSharePopupShareBoxBottom}>
                        <ColumnStartCenter style={styles.GameDetailSharePopupShareBoxBottomLeft}>
                            <Text style={styles.ShareLeagueName2}>{title}</Text>
                            {text ? (
                                <Text style={styles.ShareVS2}>{text}</Text>
                            ) : null}
                        </ColumnStartCenter>
                        <RowCenterCenter style={styles.GameDetailSharePopupShareBoxBottomRight}>
                            <QRCodeA value={copyUrl} size={75} bgColor="#FFF" />
                        </RowCenterCenter>
                    </RowCenterBetween>
                </ViewShot>
            </ColumnCenterCenter>

            <View style={styles.GameDetailSharePopupBottomBox}>
                <RowCenterStart style={styles.GameDetailSharePopupBottomBoxTop}>
                    <ColumnCenterStart
                        style={styles.ShareButtonBox}
                        onPress={() => {
                            CopyText(copyUrl);
                            fromPage == "PromotionsDetailPage" && PiwikEventDataHandle({
                                eventTitle: "PromotionDetail4",
                                customProperties: {
                                    "Promotion_Share_C_Link_PromotionName": title, // 修正 key 格式
                                    [`Promotion_Share_C_Link_${title}_URL`]: copyUrl, // 修正 key 格式
                                },
                            });
                        }}>
                        <CopyIcon width={26} height={26} fill={Color.theme} wrapStyle={styles.ShareIconBox} />

                        <Text style={styles.ShareText}>{translate("复制链接2")}</Text>
                    </ColumnCenterStart>

                    <ColumnCenterStart
                        style={styles.ShareButtonBox}
                        onPress={async () => {
                            await SaveImg(ViewShotRef.current, translate("保存成功！"));
                            fromPage == "PromotionsDetailPage" && PiwikEventDataHandle({
                                eventTitle: "PromotionDetail5",
                                customProperties: {
                                    "Promotion_Share_C_Picture_PromotionName": title, // 修正 key 格式
                                },
                            });
                        }}>
                        <DownloadIcon width={26} height={26} fill={Color.theme} wrapStyle={styles.ShareIconBox} />

                        <Text style={styles.ShareText}>{translate("下载图片")}</Text>
                    </ColumnCenterStart>
                </RowCenterStart>
                <ColumnCenterCenter
                    onPress={() => {
                        onCancel?.();
                    }}
                    style={styles.GameDetailSharePopupBottomBoxBottom}>
                    <Text style={styles.ShareCancelText}>{translate("取消")}</Text>
                    {DeviceInfoIos && (
                        <View
                            style={{
                                height: 10,
                                backgroundColor: "#fff",
                                width,
                            }}
                        />
                    )}
                </ColumnCenterCenter>
            </View>
        </View>
    );
};

export default ShareModal;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    GameDetailSharePopupTopBox: {
        width: width,
        paddingBottom: 40,
    },
    GameDetailSharePopupShareBox: {
        width: 0.85 * width,
        height: 0.315 * width + 135,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        overflow: "hidden"
    },
    GameDetailSharePopupShareBoxTop: {
        width: 0.85 * width,
        height: 0.315 * width
    },
    GameDetailSharePopupShareBoxBottom: {
        width: 0.85 * width,
        height: 130,
        backgroundColor: "#FFFFFF",
        paddingLeft: 16,
        paddingRight: 16,
    },
    GameDetailSharePopupShareBoxBottomLeft: {
        flex: 1,
        paddingRight: 8,
    },
    ShareLeagueName2: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222222",
        lineHeight: 22,
        textAlign: "left",
        width: "100%"
    },
    ShareVS2: {
        marginTop: 8,
        fontSize: 12,
        color: "#666666",
        lineHeight: 17,
    },
    GameDetailSharePopupShareBoxBottomRight: {
        width: 80,
        height: 80,
    },
    GameDetailSharePopupBottomBox: {
        width: width,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    GameDetailSharePopupBottomBoxTop: {
        width: width,
        height: 118,
        backgroundColor: "#EFEFF4",
    },
    ShareButtonBox: {
        marginLeft: 24,
    },
    ShareIconBox: {
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        width: 46,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },
    ShareIcon: {
        width: 22,
        height: 22,
    },
    ShareText: {
        fontSize: 12,
        color: "#222222",
        lineHeight: 22,
        marginTop: 4,
    },
    GameDetailSharePopupBottomBoxBottom: {
        width: width,
        height: 65,
        backgroundColor: "#FFFFFF",
    },
    ShareCancelText: {
        fontSize: 16,
        color: "#00A6FF",
        lineHeight: 22,
        fontWeight: "bold",
    },
});
