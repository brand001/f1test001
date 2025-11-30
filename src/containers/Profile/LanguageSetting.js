


import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Color from "$Components/Color";
import { LanguageSettingData } from "./data";
import { ListItem } from "$Components/ListItem";
import RadioButton from "$Components/RadioButton";


export default function FilledButton() {
    const [active, setActive] = useState(window.LANGUAGE);

    return (
        <View style={styles.viewContainer}>
            <View style={styles.viewBlock}>
                {
                    LanguageSettingData.map((v, i, length) => {
                        const { Icon = null, text = "", key = "CN" } = v;
                        const isLast = i === length - 1;
                        const isSelected = active == key;
                        return (
                            <ListItem
                                key={key}
                                text={text}
                                isLast={isLast}
                                leftIcon={Icon}
                                rightComponent={<RadioButton size={20} isSelected={isSelected} />}
                                onPress={() => {
                                    if (key == window.LANGUAGE) return;
                                    setActive(key);
                                    window.ChangeLanguag(key);
                                }}
                            />
                        );
                    })
                }
            </View>
        </View>
    );


}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightSilver,
        padding: 15
    },
    viewBlock: {
        backgroundColor: Color.white,
        borderRadius: 8,
        paddingHorizontal: 12
    },
});