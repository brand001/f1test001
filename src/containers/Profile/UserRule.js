import React from "react";
import { StyleSheet, View } from "react-native";
import Color from "$Components/Color";
import { RuleData } from "./data";
import { LiveChatOpenGlobe } from "@/lib/utils";
import { ListItem } from "$Components/ListItem";


export default function UserRule() {
    return (
        <View style={styles.viewContainer}>
            <View style={styles.viewBlock}>
                {
                    RuleData.map((v, i, length) => {
                        const { text = "", articleNumberMap = {} } = v;
                        const articleNumber = articleNumberMap[window.LANGUAGE][window.isStaging];
                        const isLast = i === length - 1;

                        return (
                            <ListItem
                                key={i}
                                text={text}
                                isLast={isLast}
                                onPress={() => {
                                    LiveChatOpenGlobe({
                                        csp: true,
                                        articleNumber
                                    });
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