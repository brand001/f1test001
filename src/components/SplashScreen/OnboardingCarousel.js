import React from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import ImageMap from "@/locales/Images";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { translate } from "$locales/translate";
import { CheckLogin } from "$Utils";
import { ColumnCenterCenter } from "$Components/CustomView";

const { width, height } = Dimensions.get("window");

export default class OnboardingCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeCarouselIndex: 0,
        };
    }

    closeAppCarousel() {
        this.props.closeAppCarousel();
    }

    render() {
        const { homeCarouselIndex } = this.state;
        const HomeCarousel = [ImageMap.homeModalCarousel1, ImageMap.homeModalCarousel2, ImageMap.homeModalCarousel4];


        const renderHomeCarouse = (item) => {
            return (
                <ImageBackground key={item.index} source={item.item} resizeMode="cover" fadeDuration={0} resizeMethod="resize" style={styles.homeCarouselImg}>
                    {
                        item.index === HomeCarousel.length - 1 &&
                        <ColumnCenterCenter style={styles.homeModalBottom}>
                            <FilledButton
                                text={translate("登录")}
                                onPress={() => {
                                    this.props.closeAppCarousel();
                                    CheckLogin({
                                        showInfor: false,
                                        tabType: "login",
                                    });
                                }}
                                fullWidth={false}
                                wrapStyle={{
                                    marginBottom: 15,
                                    width: "85%",
                                }} />

                            <FilledButton
                                text={translate("注册")}
                                onPress={() => {
                                    this.props.closeAppCarousel();
                                    CheckLogin({
                                        showInfor: false,
                                        tabType: "register",
                                    });
                                }}
                                fullWidth={false}
                                wrapStyle={{
                                    marginBottom: 15,
                                    width: "85%",
                                    backgroundColor: Color.vibrantGreen,
                                }} />
                        </ColumnCenterCenter>
                    }
                </ImageBackground>
            );
        };
        return (
            <>
                <Carousel
                    data={HomeCarousel}
                    renderItem={renderHomeCarouse}
                    sliderWidth={width}
                    itemWidth={width}
                    // scrollEndDragDebounceValue={homeCarouselIndex}
                    // initialNumToRender={homeCarouselIndex}
                    // activeSlideOffset={homeCarouselIndex}
                    // 關閉轉場動畫
                    inactiveSlideScale={1}
                    initialScrollIndex={homeCarouselIndex}
                    firstItem={homeCarouselIndex}
                    onSnapToItem={homeCarouselIndex => {
                        this.setState({ homeCarouselIndex });
                    }}
                    enableSnap={true}
                    decelerationRate="fast"
                    activeAnimationType="timing"
                    activeAnimationOptions={{
                        duration: 150
                    }}
                    pagingEnabled={true}
                />
                <Pagination
                    dotsLength={HomeCarousel.length}
                    activeDotIndex={homeCarouselIndex}
                    containerStyle={styles.homePaginationContainer}
                    dotStyle={styles.homePaginationDot}
                    inactiveDotStyle={styles.homePaginationInactiveDot}
                    dotContainerStyle={{ marginHorizontal: 3 }}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    homeCarouselImg: {
        width,
        height,
    },
    homePaginationContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "1%",
    },
    homePaginationDot: {
        width: 16,
        height: 6,
        borderRadius: 1000,
        backgroundColor: "#00A6FF",
    },
    homePaginationInactiveDot: {
        width: 6,
        height: 6,
        borderRadius: 1000,
        backgroundColor: "#5C5C5C",
    },
    homeModalBottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "7%",
        width: "100%",
    },
});
