import React from "react";

import { Text, View } from "react-native";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomLinkText from "$Components/CustomLinkText";

import styles from "./styles";

const Disclaimer = props => {
    const { text = [] } = props;

    return (
        <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerTitles}>{translate("温馨提醒2")}</Text>
            {text.map((v, i) => {
                return (
                    <CustomLinkText
                        wrapStyle={{ marginTop: 0 }}
                        norMaltextStyle={styles.disclaimerPromptItem}
                        text={v}
                        themeTextStyle={[styles.disclaimerPromptItem, { fontWeight: "bold", color: Color.charcoal }]}
                    />
                );
            })}
        </View>
    );
};

export default Disclaimer;
