import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import CustomCheckbox from "$Components/CustomCheckbox";
import HTMLView from "react-native-htmlview";
import { connect } from "react-redux";

const { height } = Dimensions.get("window");
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { ImagesUrl } from "@/images/index";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { translate } from "$locales/translate";
import { LiveChatOpenGlobe } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { CsIcon } from "$Components/icons/index";

const AnnouncementModal = ({ modalData, userInfo, onCancel }) => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // 組件卸載時的清理邏輯
        return () => {
            if (isChecked) {
                const { optionType = "" } = modalData || {};
                const { userName = "" } = userInfo || {};
                let key = `222ann${userName}` + optionType;
                StorageUtil.save({ key, data: true });
            }
        };
    }, [isChecked]);


    const { content, topic } = modalData || {
        content: "",
        topic: "",
    };

    return (
        <View style={styles.body}>
            <Text style={styles.title}>{topic}</Text>

            <View style={{ alignItems: "center", marginTop: 20 }}>
                <View style={{ maxHeight: .4 * height, width: "100%" }}>
                    <ScrollView>
                        <HTMLView value={`<div style="text-align: center; background-color: red;">${content}</div>`} style={{ width: "100%", alignItems: "center" }} stylesheet={styleHtmls} />
                    </ScrollView>
                </View>
                <CustomCheckbox
                    isFull={true}
                    isCheck={isChecked}
                    type="medium"
                    text={translate("不再显示")}
                    onPress={() => {
                        // 只切換狀態，不立即保存
                        setIsChecked(!isChecked);

                        PiwikEventDataHandle({
                            category: "Deposit",
                            action: "Do Not Show Popup",
                            name: "Deposit_Popup_C_Notshow",
                            path: "deposit_announcement_popup",
                            title: "Deposit Announcement Popup",
                        });
                    }}
                />
            </View>

            <FilledButton
                type={"medium"}
                onPress={() => {
                    onCancel?.({});

                    LiveChatOpenGlobe();
                    PiwikEventDataHandle({
                        category: "Deposit",
                        action: "Contact CS",
                        name: "Deposit_Popup_C_CS",
                        path: "deposit_announcement_popup",
                        title: "Deposit Announcement Popup",
                    });
                }}
                text={translate("在线客服")}
                wrapStyle={{ marginTop: 15, marginBottom: 0 }}>
                <CsIcon wrapStyle={{ marginRight: 6 }} />
            </FilledButton>
        </View>
    );
};

const mapStateToProps = state => ({
    userSetting: state.userSetting,
    userInfo: state.userInfo,
});

export default connect(mapStateToProps, null)(AnnouncementModal);

const styles = StyleSheet.create({
    body: {
        width: "100%",
    },
    title: {
        color: Color.charcoal,
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 16,
        marginTop: 18,
        textAlign: "center",
    },
});

const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 14,
        lineHeight: 20,
        width: "100%",

        fontWeight: "400",
        color: Color.charcoal,
        textAlign: "center",
    },
});
