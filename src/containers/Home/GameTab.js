import React, { useMemo, useRef, startTransition } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { ColumnCenterCenter } from "$Components/CustomView";
import CornerLabel from "$Components/CornerLabel";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

const { width } = Dimensions.get("window");

// 判斷 gameSequences 中是否有 NEW 或 HOT 標籤
const hasNewOrHotLabel = (gameSequences) => {
    if (!gameSequences || !Array.isArray(gameSequences)) {
        return false;
    }
    return gameSequences.some((item) => {
        const labelsUp = item?.labels?.toLocaleUpperCase();
        return labelsUp === "NEW" || labelsUp === "HOT";
    });
};

const TabItem = React.memo(({ item, index, isActive, onPress, language, isFirst, isLast, hasNewOrHotLabel = false }) => {
    try {
        const labelsUp = item?.labels?.toLocaleUpperCase();
        const rightOffset = language === "CN" ? -2 : 8;
        const langKey = `tabItem${language}`;
        const edgeKey = `tabItem${isFirst ? "First" : isLast ? "Last" : "qwer"}${language}`;
        const handlePress = () => onPress(index);

        return (
            <ColumnCenterCenter
                key={item?.code || index}
                style={[styles.tabItem, styles[langKey], styles[edgeKey], { paddingTop: hasNewOrHotLabel ? (window.LANGUAGE == "CN" ? 26 : 20) : 16 }]}
                onPress={handlePress}
            >
                <CornerLabel
                    slope={false}
                    type={labelsUp}
                    wrapStyle={[styles.gameStatus, { right: rightOffset }]}
                />
                <Text style={isActive ? styles.gameTitleActive : styles.gameTitleInactive}>
                    {item?.name}
                </Text>
                <View style={isActive ? styles.gameTabbarLineActive : styles.gameTabbarLine} />
            </ColumnCenterCenter>
        );
    } catch (error) {
        console.warn("TabItem render failed:", error);
        return null;
    }
});

const GameTab = (props) => {
    const { gameSequences, activeTab, onTabChange } = props;
    const scrollViewRef = useRef(null);
    const language = window.LANGUAGE;
    const tabWidth = useMemo(() => (language === "CN" ? (width - 30) / 7 : 120), [language]);

    // Tab 相关方法 - 优化：降低更新优先级并延后埋点
    const handleTabPress = (index) => {
        if (onTabChange) {
            startTransition(() => {
                onTabChange(index, gameSequences[index]);
            });
        }


        // 滚动顶部tab到选中位置
        if (scrollViewRef.current) {
            const targetOffset = Math.max(0, (index * tabWidth) - (width / 2) + (tabWidth / 2));
            scrollViewRef.current.scrollTo({ x: targetOffset, animated: true });
        }

        PiwikEventDataHandle({
            category: "Home",
            action: `View ${gameSequences[index]?.code} Listing`,
            name: `Home_GameNav_C_${gameSequences[index]?.code}`,
            path: "home",
            title: "Home",
        });
    };

    const tabs = useMemo(() => (
        (gameSequences || []).map((item, index) => (
            <TabItem
                key={item?.code || index}
                item={item}
                index={index}
                isActive={index === activeTab}
                onPress={handleTabPress}
                language={language}
                isFirst={index === 0}
                hasNewOrHotLabel={hasNewOrHotLabel(gameSequences)}
                isLast={index === (gameSequences?.length || 0) - 1}
            />
        ))
    ), [gameSequences, activeTab, handleTabPress, language]);
    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.gameTabScrollView}
            // 優化：統一性能配置
            scrollEventThrottle={16}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}>
            {tabs}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    gameStatus: {
        position: "absolute",
        top: 6,
        right: -4,
    },
    gameTabbarLine: {
        height: 2,
        width: 10,
        borderRadius: 999,
    },
    gameTabbarLineActive: {
        height: 2,
        width: 10,
        borderRadius: 999,
        backgroundColor: "#00A6FF",
    },
    gameTitle: {
        fontSize: 14,
        paddingBottom: 6,
        paddingTop: 15,
        fontWeight: "bold",
    },
    gameTitleActive: {
        fontSize: 14,
        paddingBottom: 6,
        fontWeight: "bold",
        color: "#00A6FF",
    },
    gameTitleInactive: {
        fontSize: 14,
        paddingBottom: 6,
        fontWeight: "bold",
        color: "#999999",
    },
    tabItemCN: {
        width: (width - 30) / 7
    },
    tabItemFirstCN: {
    },
    tabItemLastCN: {
        marginRight: 15
    },
    tabItemTH: {
        paddingRight: 15
    },
    tabItemVN: {
        paddingRight: 15,
    },
    tabItemLastTH: {
        paddingRight: 0,
        marginRight: 15
    },
    tabItemLastVN: {
        paddingRight: 0,
        marginRight: 15
    },
    tabItem: {
        paddingTop: 16,
    },
    gameTabScrollView: {
        marginHorizontal: 15,
        overflow: "visible"
    },
});

export default React.memo(GameTab, (prev, next) => {
    if (prev.activeTab !== next.activeTab) return false;
    if (prev.onTabChange !== next.onTabChange) return false;
    const prevSeq = prev.gameSequences || [];
    const nextSeq = next.gameSequences || [];
    if (prevSeq.length !== nextSeq.length) return false;
    for (let i = 0; i < prevSeq.length; i++) {
        const a = prevSeq[i];
        const b = nextSeq[i];
        if (a?.code !== b?.code || a?.name !== b?.name || (a?.labels || "") !== (b?.labels || "")) {
            return false;
        }
    }
    return true;
}); 