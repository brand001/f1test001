import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";
import FilledButton from "$Components/FilledButton";
import { CopyIcon, FailIcon } from "$Components/icons/index";
import InfoBar from "$Components/InfoBar";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { ColumnCenterCenter, RowCenterCenter } from "$Components/CustomView";
import { useSecurityCode } from "$Hooks";
import { LiveChatOpenGlobe } from "$Utils";

const SecurityCode = () => {
    const {
        securityCode,
        isSubmitEnabled,
        codeStatus,
        showReuseWarning,
        remainingTimeText,
        onGenerateCode,
        onCopyCode,
        CODE_STATUS,
    } = useSecurityCode({ toasts: Toasts });

    return (
        <View style={styles.viewContainer}>
            <View style={styles.commonWrap}>
                {/* 提示語 */}
                <CustomLinkText
                    norMaltextStyle={styles.listLeftTitle}
                    text={translate("如果您需要取消红利，查询游戏流水/输赢或解除自我限制，请创建安全码并发送给{在线客服}。")}
                    themeTextStyle={[styles.listLeftTitle, styles.themeLinkText]}
                    onPressList={[
                        () => {
                            LiveChatOpenGlobe();
                        },
                    ]}
                    wrapStyle={styles.linkTextWrap}
                />

                {/* 未创建 */}
                {securityCode === "" && (
                    <FilledButton
                        text={translate("产生安全码")}
                        onPress={onGenerateCode}
                    />
                )}

                {/* 已创建 */}
                {securityCode !== "" && (
                    <ColumnCenterCenter style={styles.codeBox}>
                        {codeStatus === CODE_STATUS.ACTIVE && (
                            <>
                                <RowCenterCenter
                                    onPress={() => {
                                        onCopyCode(securityCode?.passcode);
                                    }}
                                    style={styles.flexWrap}>
                                    <Text style={styles.codeNum}>
                                        {securityCode?.passcode}
                                    </Text>

                                    <CopyIcon
                                        width={20}
                                        height={20}
                                        wrapStyle={styles.copyIconWrap}
                                    />
                                </RowCenterCenter>

                                <CustomLinkText
                                    norMaltextStyle={styles.timeText}
                                    text={translate("已创建安全码，您的安全码将在{{x}}內有效", { x: remainingTimeText })}
                                    themeTextStyle={styles.timeThemeText}
                                    onPressList={[]}
                                    wrapStyle={styles.timeTextWrap}
                                />
                            </>
                        )}

                        {/* 時間過期 */}
                        {codeStatus === CODE_STATUS.EXPIRED && (
                            <ColumnCenterCenter>
                                <FailIcon width={50} height={50} wrapStyle={styles.failRed} />
                                <Text style={styles.failRedText}>{translate("您的安全码已失效")}</Text>
                            </ColumnCenterCenter>
                        )}

                        {/* 提示語 */}
                        {showReuseWarning && <InfoBar type={"warn"} wrapStyle={styles.InfoBar} text={translate("此安全码仍可使用。请使用此安全码或等待限期结束创建新的安全码。")} />}

                        <FilledButton
                            text={translate("创建新的安全码")}
                            enable={isSubmitEnabled}
                            onPress={onGenerateCode}
                            wrapStyle={styles.newCodeButtonWrap}
                        />
                    </ColumnCenterCenter>
                )}
            </View>
        </View>
    );
};


export default SecurityCode;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
        marginHorizontal: 15,
    },
    commonWrap: {
        backgroundColor: Color.white,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 25,
        marginBottom: 40,
        paddingVertical: 20,
    },

    listLeftTitle: {
        color: Color.charcoal,
        fontSize: 14,
        fontWeight: "400",
        marginBottom: 25,
    },

    timeText: {
        fontSize: 14,
        color: Color.darkGray,
    },

    InfoBar: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 8,
    },

    codeBox: {
        width: "100%",
        borderTopColor: "#E5E5E5",
        borderTopWidth: 1,
    },
    flexWrap: {
        marginVertical: 16,
    },
    codeNum: {
        textAlign: "center",
        fontSize: 36,
        color: "#0CCC3C",
        fontWeight: "bold",
    },
    failRed: {
        marginTop: 15,
        marginBottom: 12,
    },
    failRedText: {
        color: "#EB2121",
        fontSize: 14,
        fontWeight: "bold",
    },
    themeLinkText: {
        textDecorationLine: "underline",
        color: Color.theme,
    },
    linkTextWrap: {
        marginTop: 0,
        marginBottom: 20,
    },
    copyIconWrap: {
        marginLeft: 8,
        transform: [{ translateY: -10 }],
    },
    timeThemeText: {
        color: Color.alertRed,
    },
    timeTextWrap: {
        marginTop: 0,
        marginBottom: 20,
    },
    newCodeButtonWrap: {
        width: "100%",
        marginTop: 25,
    },
});
