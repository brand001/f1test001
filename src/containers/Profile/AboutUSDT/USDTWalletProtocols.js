import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { TableData, tableHeader, comparisonTableHeader, comparisonTableData } from "./data";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import { translate } from "@/locales/translate";
import CustomScrollView from "$Components/CustomScrollView";

const { width } = Dimensions.get("window");

const USDTHelpCenter = () => {
    const [tabIndex, setTabIndex] = useState(1);
    const isCN = window.LANGUAGE === "CN";

    const onClickInfoTabs = (key) => {
        setTabIndex(key);
    };

    return (
        <>
            {isCN && (
                <RowCenterBetween style={styles.magTab}>
                    {["什么是 USDT", "钱包协议"].map((v, i) => {
                        const isActive = tabIndex === i + 1;
                        return (
                            <RowCenterCenter
                                key={i}
                                onPress={() => onClickInfoTabs(i + 1)}
                                style={[
                                    styles.magTabList,
                                    isActive && styles.magTabListActive,
                                ]}>
                                <Text style={[
                                    styles.magTabText,
                                    isActive && styles.magTabTextActive,
                                ]}>
                                    {v}
                                </Text>
                            </RowCenterCenter>
                        );
                    })}
                </RowCenterBetween>
            )}

            <CustomScrollView>
                <View style={styles.contentWrapper}>
                    <View style={styles.contentContainer}>
                        {isCN ? (
                            <>
                                {tabIndex === 1 && (
                                    <>
                                        <Text style={styles.title}>泰达币简介</Text>
                                        <View style={styles.box}>
                                            <Text style={styles.text}>
                                                泰达币（USDT）是Tether公司推出的基于稳定价值货币美元（USD）的代币Tether USD。
                                                每发行1个USDT，Tether公司的银行账户都会有1美元的资金保障，用户可以在Tether平台进行资金查询。
                                            </Text>
                                        </View>

                                        <Text style={styles.title}>泰达币特点</Text>
                                        <View style={[styles.box, styles.boxNoPaddingTop]}>
                                            <Text style={styles.title1}>稳定的货币</Text>
                                            <Text style={styles.text}> Tether将现金转换成数字货币，锚定或将美元、欧元和日元等国家货币的价格钩。</Text>
                                            <Text style={styles.title1}>透明的</Text>
                                            <Text style={styles.text}>我们的外汇储备每天都在公布，并受到频繁的专业审计。流通中的所有东西总是与我们的储备相匹配。</Text>
                                            <Text style={styles.title1}>区块链技术</Text>
                                            <Text style={styles.text}>Tether平台建立在区块链技术的基础之上，利用它们提供的安全性和透明性。</Text>
                                            <Text style={styles.title1}>安全</Text>
                                            <Text style={styles.text}>Tether的区块链技术在满足国际合规标准和法规的同时，提供了世界级的安全保障。</Text>
                                            <Text style={[styles.text, styles.textWithMarginTop]}>USDT最大的特点是，它与同数量的美元是等值的，1USDT=1美元。使之成为波动剧烈的加密货币市场中良好的保值代币。</Text>
                                        </View>
                                    </>
                                )}

                                {tabIndex === 2 && (
                                    <>
                                        <Text style={styles.title}>钱包协议的类型</Text>
                                        <View style={[styles.box, styles.boxNoPaddingTop]}>
                                            <Text style={styles.title1}>第1种 ：ERC20</Text>
                                            <Text style={styles.text}> 存储在以太坊的 USDT （基于 ERC - 20 协议发行） 这种USDT存储在以太坊地址上，相对应的，每次转账（链接上转账）是 需要消耗GAS ，也就是ETH。</Text>

                                            <Text style={styles.title1}>第2种 ：TRC20</Text>
                                            <Text style={styles.text}>存储在波场网络的 USDT（基于 TRC - 20 协议发行） 该USDT 存储在TRON 的地址中，存款 提款都是通过 TRON网络进行的。</Text>

                                            <Text style={styles.title1}>第3种：OMNI</Text>
                                            <Text style={styles.text}>存储在比特币网络的 USDT （基于 OMNI 协议发行）这种 USDT 存储在比特币地址上，所以每次转账（链上转账）时，都需要支付少量比特币作为矿工费。</Text>
                                        </View>

                                        <Text style={styles.title}>三种 USDT 科普</Text>

                                        <View style={styles.tableRow}>
                                            {tableHeader.map((item, index) => (
                                                <View
                                                    key={index}
                                                    style={[
                                                        styles.tableHeader,
                                                        styles.tableHeaderCell,
                                                        index === 0 && styles.tableHeaderCellFirst,
                                                        index === 3 && styles.tableHeaderCellLast,
                                                    ]}>
                                                    <Text style={styles.tableHeaderText}>
                                                        {item}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        <View>
                                            {TableData.map((item, index) => {
                                                const isEven = index % 2 === 0;
                                                return (
                                                    <View key={index} style={styles.tableRow}>
                                                        <View style={[
                                                            styles.tableHeader,
                                                            styles.tableContentWrap,
                                                            isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                        ]}>
                                                            <Text style={styles.tableContentText}>{item.type}</Text>
                                                        </View>

                                                        <View style={[
                                                            styles.tableHeader,
                                                            styles.tableContentWrap,
                                                            isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                        ]}>
                                                            <Text style={styles.tableContentText}>{item.first}</Text>
                                                        </View>

                                                        <View style={[
                                                            styles.tableHeader,
                                                            styles.tableContentWrap,
                                                            isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                        ]}>
                                                            <Text style={styles.tableContentText}>{item.second}</Text>
                                                        </View>

                                                        <View style={[
                                                            styles.tableHeader,
                                                            styles.tableContentWrap,
                                                            isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                            styles.tableCellLast,
                                                        ]}>
                                                            <Text style={styles.tableContentText}>{item.third}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            })}

                                            <View style={[styles.box, styles.boxNoTopRadius]}>
                                                <Text style={styles.text}>
                                                    * 三种USDT 地址不互通，转账请务必鉴别，存款等操 作应注意严格存入对应地址。
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.title}>哪种协议更加符合您的需求？</Text>

                                        <View style={styles.box}>
                                            <Text style={styles.text}>
                                                1.大笔转账推荐 OMNI 的USDT，手续费贵，慢一点，但最安全。
                                            </Text>
                                            <Text style={[styles.text, styles.textWithMarginVertical]}>
                                                2.中等额度就选择 ERC20 的 USDT，手续费一般。速度一般，安全性较高。
                                            </Text>
                                            <Text style={styles.text}>
                                                3.小额转账可以用波场USDT，速度更快一点，波场网络转账本身不收手续费（交易平台可能收一些）。
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <View style={styles.box}>
                                    <Text style={[styles.text, styles.textWithMarginBottom]}>
                                        {translate("USDT 可以在多个区块链网络上运行，这使得 USDT 可以在钱包和交易平台之间转移。顺利")}
                                    </Text>
                                    <Text style={styles.text}>
                                        {translate("ERC-20 是一个值得信赖的安全网络。 TRC-20 的优点是费用低、速度快。")}
                                    </Text>
                                </View>

                                <Text style={[styles.title, styles.titleCenter]}>
                                    {translate("FUN88 支持 ERC-20 和 TRC-20 支付网关。")}
                                </Text>

                                <View>
                                    {/* 表格标题行 */}
                                    <View style={styles.tableRow}>
                                        {comparisonTableHeader.map((item, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.tableHeader,
                                                    styles.tableHeaderCell,
                                                    index === 0 && styles.tableHeaderCellFirst,
                                                    index === 2 && styles.tableHeaderCellLast,
                                                ]}>
                                                <Text style={styles.tableHeaderText}>
                                                    {typeof item === "string" ? item : item.text}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* 表格数据行 */}
                                    {comparisonTableData.map((item, index) => {
                                        // 第一行和第三行白色，第二行浅灰色
                                        const isEven = index % 2 === 0;
                                        const isLastRow = index === comparisonTableData.length - 1;
                                        return (
                                            <View key={index} style={styles.tableRow}>
                                                <View style={[
                                                    styles.tableContentWrap,
                                                    styles.tableCell,
                                                    styles.tableCellFirstColumn,
                                                    isLastRow && styles.tableCellBottomLeft,
                                                ]}>
                                                    <Text style={styles.tableCellFirstColumnText}>{item.type}</Text>
                                                </View>

                                                <View style={[
                                                    styles.tableContentWrap,
                                                    styles.tableCell,
                                                    isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                    isLastRow && styles.tableCellBottomNoBorder,
                                                ]}>
                                                    <Text style={styles.tableContentText}>{item.erc20}</Text>
                                                </View>

                                                <View style={[
                                                    styles.tableContentWrap,
                                                    styles.tableCell,
                                                    isEven ? styles.tableCellEven : styles.tableCellOdd,
                                                    styles.tableCellLast,
                                                    isLastRow && styles.tableCellBottomRight,
                                                ]}>
                                                    <Text style={styles.tableContentText}>{item.trc20}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>

                                <View style={[styles.box, styles.boxNoTopRadius]}>
                                    <Text style={styles.text}>
                                        {translate("如果使用了错误的地址，可能会导致无法恢复的资金损失。确认交易前请务必确认。")}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </CustomScrollView>
        </>
    );
};

export default USDTHelpCenter;

const styles = StyleSheet.create({
    // Tab 樣式
    magTab: {
        height: 35,
        width: width,
        backgroundColor: "#369BF2",
    },
    magTabList: {
        width: width / 2,
        height: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: "#fff",
        borderBottomWidth: 0,
        marginBottom: -3,
    },
    magTabListActive: {
        borderBottomWidth: 3,
    },
    magTabText: {
        color: "#B4E4FE",
        fontSize: 14,
        fontWeight: "bold",
    },
    magTabTextActive: {
        color: "#fff",
    },
    // 容器樣式
    contentWrapper: {
        flex: 1,
        paddingBottom: 50,
    },
    contentContainer: {
        paddingTop: 24,
        paddingHorizontal: 15,
    },
    // 標題樣式
    title: {
        color: "#222222",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 15,
    },
    titleCenter: {
        textAlign: "center",
    },
    title1: {
        color: "#222",
        lineHeight: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
    // Box 樣式
    box: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 24,
        flex: 1,
    },
    boxNoPaddingTop: {
        paddingTop: 0,
    },
    boxNoTopRadius: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    // 文字樣式
    text: {
        color: "#666",
        lineHeight: 20,
    },
    textWithMarginTop: {
        marginTop: 15,
    },
    textWithMarginVertical: {
        marginVertical: 10,
    },
    textWithMarginBottom: {
        marginBottom: 10,
    },
    // 表格樣式
    tableRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tableHeader: {
        backgroundColor: "#369BF2",
        padding: 8,
        borderRightColor: "#fff",
        borderRightWidth: 1,
    },
    tableHeaderCell: {
        flex: 1,
    },
    tableHeaderCellFirst: {
        borderTopLeftRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
    },
    tableHeaderCellLast: {
        borderTopRightRadius: 10,
    },
    tableHeaderText: {
        color: "#fff",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 20,
        fontWeight: "bold",
    },
    tableContentWrap: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    tableCell: {
        borderRightColor: "#E5E5E5",
        borderRightWidth: 1,
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
    },
    tableCellFirstColumn: {
        backgroundColor: "#369BF2",
        borderRightColor: "#fff",
        borderRightWidth: 1,
    },
    tableCellEven: {
        backgroundColor: "#E5F0FA",
    },
    tableCellOdd: {
        backgroundColor: "#F3F5F9",
    },
    tableCellFirstColumnText: {
        textAlign: "center",
        fontSize: 10,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    tableCellLast: {
        borderRightWidth: 0,
    },
    tableCellBottomLeft: {
        borderBottomLeftRadius: 10,
        borderBottomWidth: 0,
    },
    tableCellBottomRight: {
        borderBottomRightRadius: 10,
        borderBottomWidth: 0,
    },
    tableCellBottomNoBorder: {
        borderBottomWidth: 0,
    },
    tableContentText: {
        textAlign: "center",
        fontSize: 12,
        lineHeight: 18,
        color: "#333333",
    },
});
