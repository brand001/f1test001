import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import NavTab from "$Components/Nav/NavTab";
import CustomWebView from "$Components/CustomWebView";

const TABS = [
    { key: "IM", label: "IM", url: "https://7xc9b5.skylgl.com/cn/" },
    { key: "SABA", label: "沙巴", url: "https://rrl.net2cast.com/cs/RnR.html" },
    { key: "BTI", label: "BTI", url: "https://contents.masamiab.com/betting-rules/zh/" },
];

const Rules = ({ navigation }) => {
    const [activeUrl, setActiveUrl] = useState(TABS[0].url);

    useEffect(() => {
        navigation.setParams({
            title: () => {
                return (
                    <NavTab
                        tabData={TABS.map((tab) => tab.label)}
                        callBack={({ key }) => {
                            const tab = TABS[key];
                            if (tab?.url) {
                                setActiveUrl(tab.url);
                            }
                        }}
                    />
                );
            },
        });
    }, [activeUrl]);

    return (
        <View style={styles.container}>
            <CustomWebView
                key={activeUrl}
                source={{ uri: activeUrl }}
                mixedContentMode="always"
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={false}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                allowFileAccess
                webViewStyle={styles.webView}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Rules;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00a6ff",
    },
    webView: {
        flex: 1,
        zIndex: 15,
    },
});
