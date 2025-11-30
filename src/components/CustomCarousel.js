import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, View, Linking } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import Color from "./Color";
import LoadingBone from "$Components/LoadingBone";
const { width } = Dimensions.get("window");
import NetworkImage from "./NetworkImage";
import { useBanner } from "$Hooks";

// Banner dimensions
const bannerWidth = width - 30;
const bannerHeight = (width - 33) * 0.23;

const ExternalPromotionBanner = ({
    bannerData = [],
    borderRadius = 0,
    showPagination = true,
    wrapStyle = {},
    realKey = "cmsImageUrl",
    onBannerClickProp = () => {},
}) => {
    const [bannerIndex, setBannerIndex] = useState(0);
    const { onBannerClick } = useBanner();

    const BannerStyle = [styles.carouselImg, {
        borderRadius
    }];

    const renderBanner = ({ item, index }) => (
        <Touch
            style={BannerStyle}
            onPress={() => {
                if (item?.isBFFSC) {
                    item?.action?.url && Linking.openURL(item?.action?.url);
                } else {
                    onBannerClick(item);
                }

                onBannerClickProp({ item, index });
            }}
        >
            <NetworkImage
                resizeMode="stretch"
                style={styles.carouselImg}
                source={{
                    uri: item[realKey]
                }}
            />
        </Touch>
    );


    return (
        <View style={[styles.wrapper, wrapStyle]}>
            {
                Array.isArray(bannerData)
                    ?
                    (
                        bannerData.length > 0
                            ? (
                                <>
                                    <View style={BannerStyle}>
                                        <Carousel
                                            data={bannerData}
                                            renderItem={renderBanner}
                                            sliderWidth={bannerWidth}
                                            itemWidth={bannerWidth}
                                            height={bannerHeight}
                                            autoplay
                                            loop
                                            autoplayDelay={500}
                                            autoplayInterval={4000}
                                            onSnapToItem={setBannerIndex}
                                        />
                                    </View>

                                    {
                                        showPagination && bannerData.length > 1 &&
                                        <Pagination
                                            dotsLength={bannerData.length}
                                            activeDotIndex={bannerIndex}
                                            containerStyle={styles.containerStyle}
                                            dotStyle={styles.dotStyle}
                                            inactiveDotStyle={styles.inactiveDotStyle}
                                            inactiveDotOpacity={1.1}
                                            inactiveDotScale={1.1}
                                        />
                                    }
                                </>
                            )
                            :
                            <></>

                    )
                    : (
                        <View style={BannerStyle}>
                            <LoadingBone length={1} wrapStyle={{ width: width - 30 }} />
                        </View>
                    )}

        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {

    },
    carouselImg: {
        width: bannerWidth,
        height: bannerHeight,
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

export default ExternalPromotionBanner;
