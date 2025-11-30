import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View, Text, Animated } from "react-native";
const { width, height } = Dimensions.get("window");
import ImageMap from "@/locales/Images";
import CountdownUtil from "$Utils/CountdownUtil";

const TIME = 4;
import { translate } from "@/locales/translate";
import { ColumnCenterCenter } from "$Components/CustomView";


export default class LaunchAdCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeCarouselIndex: 0,
            loadSuccess: false,
            sec: 4
        };
        this.fadeAnim = new Animated.Value(1);
    }

    componentWillUnmount() {
        this.countdown?.clear();
    }

    changeImg = () => {
        const HomeCarousel = [ImageMap.homeModalCarousel1, ImageMap.homeModalCarousel3];

        const { homeCarouselIndex } = this.state;
        const nextIndex = (homeCarouselIndex + 1) % HomeCarousel.length;

        Animated.timing(this.fadeAnim, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            this.setState({
                homeCarouselIndex: nextIndex,
            }, () => {
                Animated.timing(this.fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }).start();
            });
        });
    };

    closeAppCarousel() {
        this.props.closeAppCarousel();
    }

    startCountdown(time) {
        this.countdown?.clear();

        this.countdown = new CountdownUtil(
            time,
            timeStr => {
                let sec = this.countdown.getRemainingTime(timeStr);
                if (sec > 0) {
                    this.setState({
                        sec
                    });
                    sec % 2 === 0 && this.changeImg();
                } else {
                    this.closeAppCarousel();
                    this.countdown?.clear();
                }
            },
            () => {
                this.closeAppCarousel();
                this.countdown?.clear();
            },
        );
        this.countdown.setFormatType("SS");
        this.countdown.start();
    }

    render() {
        const { homeCarouselIndex, loadSuccess, sec } = this.state;
        const HomeCarousel = [ImageMap.homeModalCarousel1, ImageMap.homeModalCarousel4];
        const currentImg = HomeCarousel[homeCarouselIndex];
        return (
            <View style={styles.viewContainer}>
                <Animated.Image
                    key={homeCarouselIndex}
                    resizeMethod="resize"
                    resizeMode="cover"
                    source={currentImg}
                    defaultSource={currentImg}
                    style={{
                        width: width,
                        height: height,
                        opacity: this.fadeAnim
                    }}
                    onLoadEnd={() => {
                        this.setState({
                            loadSuccess: true,
                        }, () => {
                            sec == 4 && this.startCountdown(TIME);
                        });
                    }}
                />

                {loadSuccess && (
                    <ColumnCenterCenter
                        onPress={() => {
                            this.closeAppCarousel();
                        }}
                        style={styles.skipWrap}>
                        <Text style={{ color: "#000" }}>{translate("跳过 {x}s", { x: sec })}</Text>
                    </ColumnCenterCenter>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        backgroundColor: "#000",
    },
    skipWrap: {
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 8,
        position: "absolute",
        top: "5%",
        right: 20,
        paddingHorizontal: 8,
        height: 34,
    },
});
