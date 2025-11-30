import React, { useState, useRef } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import HTMLView from "react-native-htmlview";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import { CheckLogin, LiveChatOpenGlobe } from "$Utils";

import { Advantage, Prompt, UsdtInfor, FaqDataCN, FaqDataTHVN } from "./data";
import { translate } from "@/locales/translate";
import { ColumnCenterCenter, RowCenterAround, RowCenterBetween, RowCenterCenter, RowCenterStart } from "$Components/CustomView";
import ImageMap from "@/locales/Images";
import { ImagesUrl } from "@/images/index";
import { ArrowIcon } from "$Components/icons/index";
import FilledButton from "$Components/FilledButton";

const { width, height } = Dimensions.get("window");
const depositButtonViewHeight = 76;

// HTMLView 樣式表
const styleHtmls = {
    div: {
        fontSize: 12,
        color: "#DFDFDF",
        lineHeight: 17,
    },
};

const AboutUSDT = () => {
    const [offsetY, setOffsetY] = useState(0);
    const [activeId, setActiveId] = useState(0);
    const [titlePositions, setTitlePositions] = useState({});
    const scrollRef = useRef(null);

    const renderTitle = (str, iconSize = "m", index = null) => {
        const isCN = window.LANGUAGE === "CN";
        const iconWidth = iconSize === "s" ? 40 : 75;

        const handleLayout = (event) => {
            if (index !== null) {
                // 計算標題在 ScrollView 中的絕對位置
                // Banner 高度：450px，contentContainer marginTop：-100px
                // 所以 contentContainer 從 350px 開始
                const { y } = event.nativeEvent.layout;
                const bannerHeight = 450;
                const contentMarginTop = -100;
                const absoluteY = y + bannerHeight + contentMarginTop;
                setTitlePositions(prev => ({
                    ...prev,
                    [index]: absoluteY,
                }));
            }
        };

        return (
            <View onLayout={handleLayout}>
                <RowCenterBetween style={styles.titleWrapper}>
                    <Image
                        resizeMode="stretch"
                        source={ImagesUrl.titleRight}
                        style={[
                            styles.titleIcon,
                            { width: iconWidth, marginLeft: -20 },
                        ]}
                    />
                    <Text style={[
                        styles.titleTextStyle,
                        { fontSize: isCN ? 20 : 16 },
                    ]}>
                        {str}
                    </Text>
                    <Image
                        resizeMode="stretch"
                        source={ImagesUrl.titleLeft}
                        style={[
                            styles.titleIcon,
                            { width: iconWidth, marginRight: -20 },
                        ]}
                    />
                </RowCenterBetween>
            </View>
        );
    };






    const triggerScroll = (y) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y, animated: true });
        }
    };

    // 根據標題位置計算導航點
    // 標題順序：0=頂部, 1=USDT優勢, 2=存款支付方式, 3=常見問題
    const title1 = titlePositions[1] || 0;
    const title2 = titlePositions[2] || 0;
    const title3 = titlePositions[3] || 0;

    // 計算當前激活的導航點（4個點：頂部 + 3個標題）
    const getActiveDot = () => {
        if (offsetY <= 0) return 0;
        if (title3 > 0 && offsetY >= title3) return 3; // 最後一個標題
        if (title2 > 0 && offsetY >= title2) return 2;
        if (title1 > 0 && offsetY >= title1) return 1;
        return 0; // 第一個標題之前，視為頂部
    };

    const activeDotIndex = getActiveDot();

    const dotsArr = [
        {
            axisY: 0,
            range: activeDotIndex === 0,
        },
        {
            axisY: title1 > 0 ? title1 : 0,
            range: activeDotIndex === 1,
        },
        {
            axisY: title2 > 0 ? title2 : 0,
            range: activeDotIndex === 2,
        },
        {
            axisY: title3 > 0 ? title3 : 0,
            range: activeDotIndex === 3,
        },
    ];

    const isCN = window.LANGUAGE === "CN";
    const ButtonText = {
        color: "#FFE4C4",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: isCN ? 14 : 12
    };

    return (
        <View style={styles.viewContainer}>
            <View style={styles.dotsContainer}>
                {dotsArr.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => triggerScroll(item.axisY)}
                        style={[
                            styles.dotStyle,
                            item.range ? styles.dotActive : styles.dotInactive,
                        ]}
                    />
                ))}
            </View>

            <ScrollView
                ref={scrollRef}
                removeClippedSubviews={false}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
                onScroll={(e) => {
                    const scrollOffsetY = e.nativeEvent.contentOffset.y;
                    setOffsetY(scrollOffsetY);
                }}
                scrollEventThrottle={16}>


                {/* banner */}
                <View style={styles.bannerContainer}>
                    <Image resizeMode="cover" source={ImageMap.usdtBanner} style={styles.bannerImage} />
                </View>

                <View style={styles.contentContainer}>
                    <>
                        <Text style={styles.titleText}>{translate("您必须了解的加密货币")}</Text>
                        <Text style={styles.titleSubtitle}>
                            {translate("加密货币是现代社会中最有价值的发明之一，其颠覆传统的去中心化交易模式及安全、稳定、隐秘之特性， 广受企业机构的青睐，成为现今市场交易的主流。")}
                        </Text>

                        <View style={styles.promptContainer}>
                            {Prompt.map((item, index) => (
                                <RowCenterStart
                                    key={index}
                                    style={styles.promptItem}>
                                    <item.icon
                                        width={58}
                                        height={58}
                                        wrapStyle={{
                                            marginRight: 12
                                        }}
                                    />
                                    <View style={styles.promptContent}>
                                        <Text style={styles.PromptTitle}>{item.title}</Text>
                                        <Text style={styles.PromptText} numberOfLines={0}>{item.description}</Text>
                                    </View>
                                </RowCenterStart>
                            ))}
                        </View>
                    </>

                    <>
                        {renderTitle(translate("USDT泰达币的优势"), "m", 1)}

                        <Text style={styles.titleSubtitle2}>{translate("泰达币（Tether）也被称为USDT，其价值与美元对等 1USDT=1美元。作为最稳定且保值的币种，在加密货币中独占鳌头。")}</Text>

                        <RowCenterAround style={styles.AdvantageWrap}>
                            {Advantage.map((item, index) => (
                                <ColumnCenterCenter
                                    key={index}
                                    style={styles.AdvantageList}>
                                    <Image
                                        source={item.icon}
                                        style={styles.advantageIcon}
                                    />
                                    <Text style={styles.AdvantageListText}>{item.title}</Text>
                                </ColumnCenterCenter>
                            ))}
                        </RowCenterAround>

                        <FilledButton
                            //type='medium'
                            outlined={true}
                            onPress={() => Actions.USDTWalletProtocols()}
                            wrapStyle={styles.buttonAlign}>
                            <Text style={ButtonText}>{translate("钱包协议的区别")}</Text>
                            <ArrowIcon
                                direction={"right"}
                                fill={"#FFE4C4"}
                                wrapStyle={{
                                    marginLeft: 10
                                }}
                            />
                        </FilledButton>
                    </>

                    <>
                        {renderTitle(translate("FUN88 USDT 存款支付方式"), "s", 2)}

                        <View style={styles.tableRow}>
                            {/* 左列 - 极速虚拟币 */}

                            <View style={styles.tableColumn}>
                                <ColumnCenterCenter
                                    style={[
                                        styles.tableLeft,
                                        styles.tableHeaderLeft,
                                    ]}
                                >
                                    <Text style={[styles.tableText, styles.tableHeaderText]}>{UsdtInfor[0].title}</Text>
                                </ColumnCenterCenter>

                                {UsdtInfor[0].text.map((text, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <ColumnCenterCenter
                                            key={`left-${index}`}
                                            style={[
                                                styles[isEven ? "tableLeft" : "tableRight"],
                                                isEven ? styles.tableCellEven : styles.tableCellOdd,
                                            ]}
                                        >
                                            <Text style={styles.tableText}>{text}</Text>
                                        </ColumnCenterCenter>
                                    );
                                })}
                            </View>

                            {/* 右列 - 虚拟币支付 */}
                            <View style={styles.tableColumn}>
                                <ColumnCenterCenter
                                    style={[
                                        styles.tableRight,
                                        styles.tableHeaderRight,
                                    ]}
                                >
                                    <Text style={[styles.tableText, styles.tableHeaderText]}>{UsdtInfor[1].title}</Text>
                                </ColumnCenterCenter>
                                {UsdtInfor[1].text.map((text, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <ColumnCenterCenter
                                            key={`right-${index}`}
                                            style={[
                                                styles[isEven ? "tableLeft" : "tableRight"],
                                                isEven ? styles.tableCellEven : styles.tableCellOdd,
                                            ]}
                                        >
                                            <Text style={styles.tableText}>{text}</Text>
                                        </ColumnCenterCenter>
                                    );
                                })}
                            </View>
                        </View>

                        <View>
                            {!isCN && FaqDataTHVN.map((v, i) => (
                                <View key={i} style={styles.bulletItem}>
                                    <Text style={styles.bullet}>{"\u2022"}</Text>
                                    <Text style={styles.bulletText}>{v?.text}</Text>
                                </View>
                            ))}
                            {window.LANGUAGE === "TH" && (
                                <View>
                                    <View style={[styles.bulletItem, { marginBottom: 0 }]}>
                                        <Text style={styles.bullet}>{"\u2022"}</Text>
                                        <Text style={styles.bulletText}>คุณมีบัญชีคริปโตหรือยัง หากยัง สมัครได้ที่นี่</Text>
                                    </View>
                                    <View style={[styles.bulletItem, { marginLeft: 20, marginBottom: 0 }]}>
                                        <Text style={styles.bullet}>{"\u2022"}</Text>
                                        <Touch onPress={() => Linking.openURL("https://www.binance.th/th")}>
                                            <Text style={[styles.bulletText, { textDecorationLine: "underline" }]}>https://www.binance.th/th</Text>
                                        </Touch>
                                    </View>
                                    <View style={[styles.bulletItem, { marginLeft: 20, marginBottom: 0 }]}>
                                        <Text style={styles.bullet}>{"\u2022"}</Text>
                                        <Touch onPress={() => Linking.openURL("https://www.bitkub.com/th")}>
                                            <Text style={[styles.bulletText, { textDecorationLine: "underline" }]}>https://www.bitkub.com/th</Text>
                                        </Touch>
                                    </View>
                                </View>
                            )
                            }
                        </View>

                        <RowCenterBetween
                            style={{
                                marginTop: 20,
                            }}>
                            <FilledButton
                                //type='medium'
                                outlined={true}
                                onPress={() => {
                                    Actions.UsdtGuide({
                                        actionType: "Deposit",
                                    });
                                }}
                                wrapStyle={[styles.tutorialButton]}>
                                <Text style={ButtonText}>{translate("存款教程")}</Text>
                                <ArrowIcon
                                    direction={"right"}
                                    fill={"#FFE4C4"}
                                    wrapStyle={{
                                        marginLeft: 10
                                    }}
                                />
                            </FilledButton>
                            <FilledButton
                                //type='medium'
                                outlined={true}
                                onPress={() => {
                                    Actions.UsdtGuide({
                                        actionType: "Withdrawal",
                                    });
                                }}
                                wrapStyle={styles.tutorialButton}>
                                <Text style={ButtonText}>{translate("提款教程")}</Text>
                                <ArrowIcon
                                    direction={"right"}
                                    fill={"#FFE4C4"}
                                    wrapStyle={{
                                        marginLeft: 10
                                    }}
                                />
                            </FilledButton>
                        </RowCenterBetween>
                    </>

                    <>
                        {renderTitle(translate("常见问题USDT"), "m", 3)}
                        <View>
                            {isCN ? (
                                FaqDataCN.map((item, index) => {
                                    if (index >= 3) return null;
                                    const isActive = activeId === item.id;
                                    return (
                                        <View key={index}>
                                            <TouchableOpacity
                                                style={styles.questionWrap}
                                                onPress={() => setActiveId(isActive ? 0 : item.id)}
                                            >
                                                <RowCenterBetween>
                                                    <Text style={styles.faqDataText}>{item.title}</Text>
                                                    <ArrowIcon
                                                        direction={isActive ? "bottom" : "right"}
                                                        fill={"#999"}
                                                        wrapStyle={styles.arrowIconWrap}
                                                    />
                                                </RowCenterBetween>
                                            </TouchableOpacity>
                                            {isActive && (
                                                <View style={styles.faqContent}>
                                                    <HTMLView value={item.body} stylesheet={styleHtmls} />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                            ) : (
                                <Text style={[styles.titleSubtitle, styles.titleSubtitleMargin]}>{translate("如果您还有其他问题？请参阅我们的问答中心或联系 Fun Angel 客户支持团队以获取更多建议。")}</Text>
                            )}

                            <FilledButton
                                onPress={() =>
                                    isCN
                                        ? Actions.USDTHelpCenter({ FaqDataCN })
                                        : LiveChatOpenGlobe()
                                }
                                //type='medium'
                                outlined={true}
                                wrapStyle={styles.buttonAlign}>
                                <Text style={ButtonText}>{translate("查看更多USDT")}</Text>
                                <RowCenterCenter
                                    style={{
                                        marginLeft: 10
                                    }}>
                                    <ArrowIcon
                                        direction={"right"}
                                        fill={"#FFE4C4"}
                                    />
                                    <ArrowIcon
                                        direction={"right"}
                                        fill={"#FFE4C4"}
                                    />
                                </RowCenterCenter>
                            </FilledButton>
                        </View>
                    </>
                </View>
            </ScrollView>

            {isCN && (
                <View style={styles.depositButtonWrap}>
                    <FilledButton
                        onPress={() => {
                            if (CheckLogin()) return;
                            Actions.DepositCenter();
                        }}
                        text={"立即存款"}
                        wrapStyle={styles.depositButton}
                    />
                </View>
            )}
        </View>
    );
};

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AboutUSDT);

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: "relative",
        backgroundColor: "#0C113D",
    },
    contentContainer: {
        backgroundColor: "#0C113D",
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginTop: -100,
        paddingHorizontal: 20,
        paddingTop: 30
    },
    titleText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    titleSubtitle: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    titleSubtitle2: {
        fontSize: 14,
        color: "#DFDFDF",
    },
    buttonAlign: {
        borderColor: "#FFE4C4",
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 60
    },
    tableLeft: {
        marginRight: 0.29,
        flex: 1,
        height: 45,
    },
    tableRight: {
        flex: 1,
        height: 45,
        marginLeft: 0.29,
    },
    tableText: {
        color: "#FFFFFF",
        fontSize: 10,
        textAlign: "center",
        paddingHorizontal: 15
    },
    questionWrap: {
        backgroundColor: "#0D133E",
        flex: 1,
        marginBottom: 20,
    },
    tutorialButton: {
        backgroundColor: "transparent",
        borderColor: "#FFE4C4",
        width: "48%",
        borderWidth: 1,
    },
    depositButtonWrap: {
        position: "absolute",
        backgroundColor: "#0C113D",
        width: width,
        height: depositButtonViewHeight,
        padding: 10,
        bottom: 0,
        flex: 1,
        alignItems: "center",
    },
    depositButton: {
        backgroundColor: "#0CCC3C",
    },
    dotStyle: {
        width: 10,
        height: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    PromptTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#FFE4C4",
        flexWrap: "wrap"
    },
    PromptText: {
        fontSize: 12,
        color: "#DFDFDF",
        flexWrap: "wrap",
    },
    bulletItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
        flexWrap: "wrap"
    },
    bullet: {
        color: "#ffffff",
        fontSize: 16,
        marginRight: 8,
    },
    bulletText: {
        color: "#ffffff",
        fontWeight: "400",
        fontSize: 12,
        flexWrap: "wrap",
        flex: 1
    },


    AdvantageWrap: {
        flexWrap: "wrap",
        marginTop: 15,
    },
    AdvantageList: {
        backgroundColor: "rgba(14,20,64,.9)",
        opacity: 0.9,
        width: width * 0.27,
        height: 95,
        margin: 5,
        marginBottom: 10,
    },
    AdvantageListText: {
        fontSize: window.LANGUAGE == "CN" ? 14 : 10,
        marginBottom: 5,
        marginTop: 10,
        color: "#DFDFDF",
        textAlign: "center"
    },
    faqDataText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#DFDFDF",
    },
    // 新增樣式
    titleWrapper: {
        marginTop: 35,
        marginBottom: 30,
    },
    titleIcon: {
        height: 20,
    },
    titleTextStyle: {
        color: "#FFE4C4",
        textAlign: "center",
    },
    dotsContainer: {
        position: "absolute",
        right: 5,
        zIndex: 99,
        top: height * 0.3,
    },
    dotActive: {
        backgroundColor: "#fff",
    },
    dotInactive: {
        backgroundColor: "#aaaaaa",
    },
    scrollContentContainer: {
        paddingBottom: depositButtonViewHeight,
    },
    bannerContainer: {
        width: width,
        height: 450,
    },
    bannerImage: {
        width: width,
        height: 450,
    },
    promptContainer: {
        flex: 1,
    },
    promptItem: {
        marginBottom: 20,
    },
    promptContent: {
        flex: 1,
    },
    advantageIcon: {
        width: 30,
        height: 30,
    },
    tableRow: {
        flexDirection: "row",
        marginBottom: 15,
    },
    tableColumn: {
        flex: 1,
    },
    tableHeaderLeft: {
        backgroundColor: "#1A2151",
        borderTopLeftRadius: 8,
        height: 38,
    },
    tableHeaderRight: {
        backgroundColor: "#1A2151",
        borderTopRightRadius: 8,
        height: 38,
    },
    tableHeaderText: {
        fontSize: 12,
    },
    tableCellEven: {
        backgroundColor: "#141337",
    },
    tableCellOdd: {
        backgroundColor: "#1B1A3D",
    },
    arrowIconWrap: {
        marginLeft: 10,
    },
    faqContent: {
        marginBottom: 15,
    },
    titleSubtitleMargin: {
        marginBottom: 10,
    },
});
