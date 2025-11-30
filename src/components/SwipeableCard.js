import React, { Component } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet } from "react-native";

const SWIPE_THRESHOLD = 75;
const { width } = Dimensions.get("window");

class SwipeableCard extends Component {
    constructor(props) {
        super(props);

        this.pan = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => false,

            onMoveShouldSetPanResponder: (evt, gestureState) => {
                const { dx, dy } = gestureState;

                // 🧠 设定启动滑动的阈值，避免误判
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                // 如果滑动非常小，不响应（防止误触）
                if (absDx < 5 && absDy < 5) return false;

                // 如果明显是横向滑动才响应
                return absDx > absDy * 1.5;
            },

            onPanResponderMove: Animated.event([null, { dx: this.pan.x }], { useNativeDriver: false }),

            onPanResponderRelease: () => {
                if (this.pan.x._value < -SWIPE_THRESHOLD) {
                    this.moveCardHandler();
                } else {
                    this.initialLocation();
                    this.props.swipeHandler && this.props.swipeHandler(false);
                }
            },
        });

        this.initialLocation = this.initialLocation.bind(this);
        this.moveCardHandler = this.moveCardHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!this.props.isActive && prevProps.isActive !== this.props.isActive) {
            this.initialLocation();
        }
    }

    moveCardHandler() {
        Animated.spring(this.pan, {
            toValue: { x: -SWIPE_THRESHOLD, y: 0 },
            useNativeDriver: false,
        }).start();
        this.props.swipeHandler && this.props.swipeHandler(true);
    }

    initialLocation() {
        Animated.spring(this.pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    }

    reset = () => {
        this.initialLocation();
    };

    render() {
        const { children, style = { width: width - 30 } } = this.props;

        return (
            <Animated.View
                style={{
                    transform: [{ translateX: this.pan.x }],
                    ...styles.card,
                    ...style,
                }}
                {...this.panResponder.panHandlers}>
                {children}
            </Animated.View>
        );
    }
}

export default SwipeableCard;

const styles = StyleSheet.create({
    card: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 5,
        width: width - 30,
    },
});
