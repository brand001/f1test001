import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from "react-native";
import CarouselWithPagination from "$Components/CarouselWithPagination";
import { RowCenterCenter } from "$Components/CustomView";
import { GuideCN, GuideTHVN } from "./data";
import CustomWebView from "$Components/CustomWebView";

const { width, height } = Dimensions.get("window");

const UsdtGuide = ({ actionType, navigation }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [activeCarouselIndices, setActiveCarouselIndices] = useState({});

    const isCN = window.LANGUAGE === "CN";
    const GuideData = isCN ? GuideCN : GuideTHVN;
    const GuideRealData = GuideData[actionType]?.content;
    const tabWidth = GuideData[actionType]?.tabWidth;

    useEffect(() => {
        if (navigation && GuideData[actionType]?.titile) {
            navigation.setParams({
                title: GuideData[actionType].titile,
            });
        }
    }, [actionType]);

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselItem}>
            {item.imgs && (
                <Image
                    resizeMode="stretch"
                    source={item.imgs}
                    style={styles.imageStyle}
                />
            )}
        </View>
    );

    const handleSnapToItem = (index, tabIndex) => {
        setActiveCarouselIndices((prevState) => ({
            ...prevState,
            [tabIndex]: index,
        }));
    };

    const showTabs = Boolean(GuideRealData?.[activeTab]?.title) && Boolean(GuideRealData?.length > 1);

    return (
        <View style={styles.container}>
            {showTabs && (
                <View style={styles.tabWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <RowCenterCenter style={styles.tabContainer}>
                            {GuideRealData.map((tab, index) => {
                                const isActive = activeTab === index;
                                return (
                                    <RowCenterCenter
                                        key={index}
                                        style={[
                                            styles.tab,
                                            isActive && styles.activeTab,
                                            { width: tabWidth },
                                        ]}
                                        onPress={() => setActiveTab(index)}>
                                        <Text style={[
                                            styles.tabText,
                                            isActive && styles.activeTabText,
                                        ]}>
                                            {tab.title}
                                        </Text>
                                    </RowCenterCenter>
                                );
                            })}
                        </RowCenterCenter>
                    </ScrollView>
                </View>
            )}

            <View style={styles.contentContainer}>
                {isCN ? (
                    <CarouselWithPagination
                        key={activeTab}
                        activeKey={activeTab}
                        data={GuideRealData[activeTab]?.content}
                        renderCarouselItem={renderCarouselItem}
                        onSnapToItem={handleSnapToItem}
                        activeCarouselIndices={activeCarouselIndices}
                    />
                ) : (
                    <CustomWebView
                        type="video"
                        key={GuideRealData[activeTab]?.content[0]?.imgs}
                        source={{ uri: GuideRealData[activeTab]?.content[0]?.imgs }}
                        webViewStyle={styles.webViewStyle}
                        controls={true}
                        resizeMode="contain"
                    />
                )}
            </View>
        </View>
    );
};

export default UsdtGuide;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabWrapper: {
        height: 44,
    },
    tabContainer: {
        flexDirection: "row",
        height: 44,
        backgroundColor: "#00a6ff",
    },
    tab: {
        borderBottomWidth: 3,
        borderBottomColor: "transparent",
        height: "100%",
    },
    activeTab: {
        borderBottomColor: "white",
    },
    tabText: {
        color: "#B4E4FE",
        textAlign: "center",
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "bold",
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
    },
    carouselItem: {
        justifyContent: "center",
        alignItems: "center",
        width: width,
    },
    imageStyle: {
        width: width - 20,
        height: height - 250,
        alignSelf: "center",
        borderRadius: 20,
    },
    webViewStyle: {
        height: "95%",
        width: "90%",
        alignSelf: "center",
    },
});