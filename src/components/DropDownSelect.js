import React, { Component } from "react";
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { width, height } = Dimensions.get("window");
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { CloseIcon } from "$Components/icons/index.js";
import LiveChat from "$Components/LiveChat";
import { RowCenterBetween } from "./CustomView";
import Touch from "react-native-touch-once";

const AnimatedObj = {
    slideDown: {
        transform: "translateY",
        style: {
            bottom: 0,
        },
        toValue: {
            open: 0,
            close: height,
        },
    },
    slideUp: {
        transform: "translateY",
        style: {
            top: 0,
        },
        toValue: {
            open: 0,
            close: -height,
        },
    },
    slideLeft: {
        transform: "translateX",
        style: {
            right: 0,
        },
        toValue: {
            open: 0,
            close: -width,
        },
    },
    slideRight: {
        transform: "translateX",
        style: {
            left: 0,
        },
        toValue: {
            open: 0,
            close: width,
        },
    },
};

export default class DropDownSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0), // 控制 container 的透明度
            slideAnim: new Animated.Value(height), // 控制 wrap 的 Y轴或X轴位置
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modalVisible !== this.props.modalVisible) {
            this.props.modalVisible ? this.openAnimation() : this.closeAnimation();
        }
    }

    openAnimation = () => {
        const { animationType = "slideDown" } = this.props;
        const animationConfig = AnimatedObj[animationType];

        Animated.parallel([
            Animated.timing(this.state.fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.slideAnim, {
                toValue: animationConfig.toValue.open,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    closeAnimation = () => {
        const { animationType = "slideDown" } = this.props;
        const animationConfig = AnimatedObj[animationType];

        Animated.parallel([
            Animated.timing(this.state.fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.slideAnim, {
                toValue: animationConfig.toValue.close,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            this.props?.closeModal();
        });
    };

    closeModal = () => {
        this.closeAnimation();
    };

    confirm = () => {
        this.props?.confirm();
    };

    openCS = () => {
        this.closeModal();
        this.props?.csCallback();
    };


    renderFooter = () => {
        const { footer = null } = this.props;
        if (typeof footer === "function") {
            return footer({
                closeModal: this.closeModal,
            });
        }
        if (React.isValidElement(footer)) {
            return React.cloneElement(footer, {
                closeModal: this.closeModal,
            });
        }
    };

    render() {
        const { modalVisible, title = translate("选择类别2"), confirmText = "", isScrollView = false, showCSIcon = false, initialPadding = 16, animationType = "slideDown", footer = null } = this.props;
        const { confirmTextStyle = {} } = this.props;
        let { transform, style } = AnimatedObj[animationType];

        return (
            <Modal transparent={true} visible={this.props.modalVisible} animationType="none">
                {/* 淡入淡出背景 */}
                <Animated.View style={[styles.container, { opacity: this.state.fadeAnim }]}>
                    <TouchableOpacity onPress={this.closeModal} style={{ flex: 1 }} />
                </Animated.View>

                {/* 滑动出现的内容 */}
                <Animated.View style={[styles.wrap, style, { transform: [{ [transform]: this.state.slideAnim }] }]}>
                    {Boolean(title) && (
                        <RowCenterBetween style={[styles.header]}>
                            <CloseIcon fill={Color.gray} onPress={this.closeModal} wrapStyle={styles.buttonStyle} />

                            <Text style={styles.title}>{title}</Text>

                            <View style={{ width: 70, alignItems: "flex-end" }}>
                                {showCSIcon ? (
                                    <LiveChat callBack={this.openCS} csp={false} />
                                ) : Boolean(confirmText) ? (
                                    <Touch onPress={this.confirm} style={[styles.buttonStyle, { alignItems: "flex-end" }]} >
                                        <Text style={[styles.confirmText, confirmTextStyle]}>{confirmText}</Text>
                                    </Touch>
                                ) : (
                                    <Touch style={[styles.buttonStyle, { alignItems: "flex-end", opacity: 0 }]} >
                                        <Text style={[styles.confirmText, confirmTextStyle]}>{""}</Text>
                                    </Touch>
                                )}
                            </View>
                        </RowCenterBetween>
                    )}

                    {isScrollView ? (
                        <View>
                            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={[{ paddingHorizontal: initialPadding }]}>
                                {this.props.children}
                            </ScrollView>
                            {
                                this.renderFooter()
                            }
                        </View>
                    ) : (
                        <View>
                            <View style={[{ paddingHorizontal: initialPadding }]}>{this.props.children}</View>
                            {
                                this.renderFooter()
                            }
                        </View>
                    )}
                    {DeviceInfoIos && <View style={{ height: 20 }} />}
                </Animated.View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        backgroundColor: "rgba(0, 0, 0, .3)",
    },
    wrap: {
        position: "absolute",
        width: width,
        backgroundColor: Color.lightSilver,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    header: {
        height: 55,
        paddingHorizontal: 16,
    },
    buttonStyle: {
        backgroundColor: Color.transparent,
        height: "auto",
        paddingHorizontal: 0,
        alignSelf: "auto",
        width: 70,
        justifyContent: "flex-start",
    },
    confirmText: {
        color: Color.charcoal,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: Color.charcoal,
        textAlign: "center",
    },
});
