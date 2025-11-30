import { ColumnCenterCenter, RowCenterCenter } from "$Components/CustomView";
import React from "react";

import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";

const { width } = Dimensions.get("window");

const MemberLevelContent = props => {
    const { tabsActive, generalMembershipLevel, starMembershipLevel, VIPMembershipLevel, goToDetailsTab } = props;

    // 普通会员內容
    const renderGeneralMembership = () => {
        return (
            <ScrollView
                snapToInterval={width * 0.85}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScrollView}
                contentContainerStyle={{ paddingRight: 24 }}
            >
                {generalMembershipLevel.map((item, index) => (
                    <AutoHeightImage
                        key={index}
                        resizeMode="stretch"
                        source={item.cmsImageUrl}
                        width={width * 0.85}
                        style={{
                            marginRight: 12,
                        }}
                    />
                ))}
            </ScrollView>
        );
    };

    const MoreButton = () => {
        return (
            <RowCenterCenter style={styles.more}>
                <TouchableOpacity
                    onPress={() => {
                        goToDetailsTab(1);
                    }}
                    style={styles.moreButton}
                />
            </RowCenterCenter>
        );
    };
    // 星光会员內容
    const renderStarMembership = () => {
        return (
            <ColumnCenterCenter style={styles.flexCenter}>
                {starMembershipLevel.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            position: "relative",
                        }}>
                        <AutoHeightImage resizeMode="stretch" source={item.cmsImageUrl} width={width * 0.88} />

                        {/* 圖片上的查看更多，點擊跳到DetailTab */}
                        <MoreButton />
                    </View>
                ))}
            </ColumnCenterCenter>
        );
    };

    // VIP会员內容
    const renderVIPMembership = () => {
        return (
            <ScrollView
                snapToInterval={width * 0.85}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScrollView}
                contentContainerStyle={{ paddingRight: 24 }}>
                {VIPMembershipLevel.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            position: "relative",
                            marginRight: 12,
                        }}>
                        <AutoHeightImage resizeMode="stretch" source={item.cmsImageUrl} width={width * 0.85} />

                        {/* 圖片上的查看更多，點擊跳到DetailTab */}
                        <MoreButton />
                    </View>
                ))}
            </ScrollView>
        );
    };

    // 根據當前激活的標籤渲染對應內容
    return (
        <>
            {tabsActive === 0 && renderGeneralMembership()}
            {tabsActive === 1 && renderStarMembership()}
            {tabsActive === 2 && renderVIPMembership()}
        </>
    );
};

const styles = StyleSheet.create({
    imageScrollView: {
        paddingHorizontal: 15,
        marginBottom: 40,
    },
    flexCenter: {
        width: "100%",
        paddingHorizontal: 15,
        marginBottom: 25,
    },
    more: {
        position: "absolute",
        bottom: 240,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 9999
    },
    moreButton: {
        width: 220,
        height: "100%",
    },
});

export default MemberLevelContent;
