import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import Color from "$Components/Color";
import { LogoIcon } from "$Components/icons/index";
import CustomTooltip from "$Components/CustomTooltip";
import FilledButton from "$Components/FilledButton";
import { RowCenterBetween, RowCenterEnd } from "$Components/CustomView";
import { translate } from "@/locales/translate";
import { Actions } from "react-native-router-flux";
import { PAGE_HEADER_HEIGHT } from "@/lib/constants";


const HomeHeaderTop = ({
    NavRightEl,
    onFinishTutorial,
}) => {
    const tutorialManager = useSelector(state => state.userSetting.tutorialManager);
    const handleFinish = () => {
        if (typeof onFinishTutorial === "function") {
            onFinishTutorial();
        }
    };
    let flag = Boolean(Actions?.currentScene?.toLowerCase()?.includes("home") && ApiPort.UserLogin);
    return (
        <RowCenterBetween style={styles.headerWrap}>
            <LogoIcon
                scale={window.LANGUAGE == "CN" ? .8 : .65}
            />
            {
                tutorialManager.hasCache ? (
                    NavRightEl
                ) : (
                    <CustomTooltip
                        visible={tutorialManager.index === 0}
                        Icon={NavRightEl}
                        maskColor={"rgba(0, 0, 0, .5)"}
                        containerStyle={{
                            left: 0
                        }}
                        {...(flag && {
                            renderContent: ({ callBack = () => {} }) => (
                                <View>
                                    <Text style={{ color: "#fff", fontWeight: "400", fontSize: 12, marginBottom: 10 }}>
                                        {translate("您的账户余额将显示在上方，\n可随时点击查看或进行存款")}
                                    </Text>

                                    <RowCenterEnd>
                                        <FilledButton
                                            fullWidth={false}
                                            wrapStyle={{ paddingHorizontal: 8 }}
                                            onPress={handleFinish}
                                            type="medium"
                                            text={translate("下一步")}
                                        />
                                    </RowCenterEnd>
                                </View>
                            )
                        })}
                    />
                )
            }
        </RowCenterBetween>
    );
};

const styles = StyleSheet.create({
    headerWrap: {
        height: PAGE_HEADER_HEIGHT,
        width: "100%",
        paddingHorizontal: 15,
        backgroundColor: Color.theme
    }
});

export default HomeHeaderTop;
