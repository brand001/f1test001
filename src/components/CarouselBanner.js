import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import SnapCarousel, { Pagination } from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import LoadingBone from "./LoadingBone";
import NetworkImage from "$Components/NetworkImage";
import Color from "./Color";
import { useBanner } from "$Hooks";

const { width } = Dimensions.get("window");

const CarouselBanner = (props) => {
    const {
        bannerData,
        onBannerClickProp = () => {},
        firstItem = 0,
        loop = true,
        autoplay = true,
        backgroundColor = "#e0e0e0",
        showPagination = false,
        bannerWidth = width - 60,
        bannerHeight = 0.498 * (width - 60),
        carouselSliderHeight,
        carouselItemWidth,
        slideStyle,
        inactiveSlideScale,
        wrapStyle = {},
    } = props;

    const [activeIndex, setActiveIndex] = useState(0);
    const { onBannerClick } = useBanner();

    const finalCarouselSliderHeight = carouselSliderHeight || bannerHeight;
    const finalCarouselItemWidth = carouselItemWidth || bannerWidth;

    // 處理 banner 點擊
    const handlePress = (item, index) => {
        // 先執行 hook 的 banner 邏輯（導航、遊戲啟動等）
        onBannerClick(item);
        // 再執行埋點邏輯
        onBannerClickProp({ item, index });
    };

    // 渲染輪播項目
    const renderBannerItem = ({ item, index }) => (
        <Touch
            key={`${item.id || index}-${item.cmsImageUrl}`}
            onPress={() => handlePress(item, index)}
            style={[styles.carouselItem, { width: bannerWidth, height: bannerHeight }]}
        >
            <NetworkImage
                resizeMethod="resize"
                resizeMode="stretch"
                source={{ uri: item.cmsImageUrl }}
                style={[styles.carouselImage, { width: bannerWidth, height: bannerHeight }]}
                fadeDuration={200}
            />
        </Touch>
    );

    // 判斷是否有數據
    const hasBannerData = Array.isArray(bannerData) && bannerData.length > 0;

    return <View style={wrapStyle}>
        {
            hasBannerData ? (
                <View style={styles.container}>
                    <SnapCarousel
                        key={`carousel-${bannerData.length}-${bannerData[0]?.id || 0}`}
                        data={bannerData}
                        renderItem={renderBannerItem}
                        sliderWidth={width}
                        sliderHeight={finalCarouselSliderHeight}
                        itemWidth={finalCarouselItemWidth}
                        hasParallaxImages={false}
                        firstItem={firstItem}
                        loop={loop}
                        autoplay={autoplay}
                        slideStyle={slideStyle}
                        inactiveSlideScale={inactiveSlideScale}
                        enableSnap={true}
                        removeClippedSubviews={false}
                        onSnapToItem={setActiveIndex}
                    />
                    {showPagination && bannerData.length > 1 && (
                        <Pagination
                            dotsLength={bannerData.length}
                            activeDotIndex={activeIndex}
                            containerStyle={styles.containerStyle}
                            dotStyle={styles.dotStyle}
                            inactiveDotStyle={styles.inactiveDotStyle}
                            inactiveDotOpacity={0.6}
                            inactiveDotScale={0.8}
                        />
                    )}
                </View>
            ) : (
                <View style={[styles.wrapper2, { backgroundColor, width: bannerWidth, height: bannerHeight }]} >
                    <LoadingBone />
                </View>
            )
        }
    </View>;
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    wrapper2: {
        margin: 10,
        marginBottom: 0,
        overflow: "hidden",
        borderRadius: 6,
        alignSelf: "center",
    },
    carouselImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "stretch",
        borderRadius: 10,
    },
    carouselItem: {
        borderRadius: 10,
        overflow: "hidden"
    },
    containerStyle: {
        paddingVertical: 2,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -15,
    },
    dotStyle: {
        width: 5,
        height: 5,
        marginHorizontal: -5,
        backgroundColor: Color.theme,
    },
    inactiveDotStyle: {
        backgroundColor: "rgba(102, 102, 102, .2)",
    },
});

export default React.memo(CarouselBanner);
