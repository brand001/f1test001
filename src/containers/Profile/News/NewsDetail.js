import moment from "moment";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, Linking } from "react-native";
import RenderHtml from "react-native-render-html";
import { WebView } from "react-native-webview";
const { width, height } = Dimensions.get("window");
import Color from "$Components/Color";
import { ColumnCenterStart, RowCenterCenter, RowCenterStart, RowStartCenter } from "$Components/CustomView";
import { GetBonusGmt, FormatDate, LiveChatOpenGlobe } from "$Utils";
import { NewsIconColorTextObj } from "./data";
import { Actions } from "react-native-router-flux";

const htmls = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge \"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0 user-scalable=no\"><title>Document</title></head><body>";

class NewsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webViewKey: 0,
        };
    }

    getImage = () => {
        const { data } = this.props;

        let id = data?.messageTypeOptionId || data?.newsTemplateCategory;

        let {
            color = "transparent",
            img = null,
            name = "",
        } = NewsIconColorTextObj[id] || {
            color: "transparent",
            img: null,
            name: "",
        };

        return {
            imgs: img,
            titleCatobj: <Text style={[styles.title, { color: color }]}>{`[${name}] `}</Text>,
        };
    };

    getTime = item => {
        return FormatDate(moment.utc(item).utcOffset(8)) + GetBonusGmt();
    };

    cleanHtmlContent = (html) => {
        if (!html) return "";

        return html
            .replace(/<span[^>]*>[\s\u2028\u2029\uFEFF]*<\/span>/gi, "") // Remove empty/invisible spans
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width chars
            .replace(/<o:p><\/o:p>/g, "") // MS Office junk
            .replace(/<font[^>]*>(.*?)<\/font>/gi, "$1") // Extract content from font tags
            .trim();
    };


    contentRender = (showWebView = false) => {
        const { megType, data } = this.props;
        const rawContent = megType === "Announcement" ? data?.content : data?.appContent || data?.content;
        const content = this.cleanHtmlContent(rawContent);
        console.log("rawContentrawContentcc", JSON.stringify(rawContent, null, 2));

        const titleCatObj = this.getImage().titleCatobj;
        // 檢查是否有名稱值
        const hasCat = NewsIconColorTextObj[data?.messageTypeOptionId || data?.newsTemplateCategory]?.name;
        return (
            <>
                <RowCenterStart style={styles.content}>
                    <Image resizeMode="stretch" source={this.getImage().imgs} style={styles.icon} />
                    <ColumnCenterStart style={{ width: "80%" }}>
                        <Text style={styles.title}> {hasCat ? titleCatObj : null}{megType === "Announcement" ? data?.topic : data?.appTitle || data?.title || data?.topic}</Text>
                        <Text style={styles.timeText}>{data?.sendOn !== "" ? this.getTime(data?.sendOn) : ""}</Text>
                    </ColumnCenterStart>
                </RowCenterStart>

                {/* 分線 */}
                <View style={styles.driver} />

                {showWebView ? (
                    <WebView
                        originWhitelist={["*"]}
                        source={{
                            html: `${htmls} ${content} </body></html>`,
                        }}
                        scalesPageToFit={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction
                        allowFileAccess
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            borderWidth: 0,
                            overflowY: "hidden",
                        }}
                    />
                ) : (
                    <View style={{ flexDirection: "row" }}>
                        <RenderHtml
                            contentWidth={width - 55}
                            baseFontStyle={{
                                color: "#666",
                                fontSize: 12,
                                lineHeight: 16,
                            }}
                            source={{
                                html: `<div style="color: #666; font-size: 12px">${content}</div>`,
                            }}
                            ignoredStyles={["font-family"]}
                            renderersProps={{
                                a: {
                                    onPress: (event, href) => {
                                        // Handle external links
                                        if (href && href.startsWith("http")) {
                                            // Open external links in browser
                                            Linking.openURL(href).catch(err => {
                                                console.error("Error opening URL:", err);
                                            });
                                        } else {
                                            // Handle internal links
                                            // Example: Normalize "about:///me/cdu" to "/me/cdu"
                                            const normalizedHref = href.replace(/^about:\/\/\/?/, "/");
                                            console.log("normalizedHref", normalizedHref);

                                            // Check if href contains /me/cdu (with or without language prefix)
                                            if (normalizedHref.includes("/me/cdu")) {
                                                Actions.UploadFile({
                                                    fromPage: "Profile",
                                                });
                                            } else if (normalizedHref.includes("/PMALiveChat")) {
                                                LiveChatOpenGlobe({ csp: true });
                                            };
                                        }
                                    },
                                },
                                defaultTextProps: {
                                    style: {
                                        color: "#666",
                                        fontSize: 12,
                                        lineHeight: 16,
                                    },
                                },
                            }}
                        />
                    </View>
                )}
            </>
        );
    };

    render() {
        const { data } = this.props;
        // 有table這種複雜內容，用webView
        let showWebView = !!(data?.content && data?.content?.indexOf("table") > -1);

        return data && showWebView ? (
            <View style={styles.container}>
                <View style={styles.inner}>{this.contentRender(showWebView)}</View>
            </View>
        ) : (
            <ScrollView style={styles.container}>
                <View style={styles.scrollInner}>{this.contentRender(showWebView)}</View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeff4",
        padding: 15,
    },
    inner: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 15,
    },
    scrollInner: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 15,
        marginBottom: 55,
    },
    content: {
        width: "100%",
        overflow: "hidden",
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: Color.charcoal,
        flexWrap: "wrap"
    },
    timeText: {
        fontSize: 10,
        color: Color.gray,
        marginTop: 8
    },
    driver: {
        height: 1,
        backgroundColor: "#F3F3F3",
        width: "1100%",
        marginVertical: 15,
        transform: [{ translateX: -100 }],
    },
});

export default NewsDetail;
