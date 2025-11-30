import React, { useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, View, Animated, Platform, Dimensions } from "react-native";
import { BackTopIcon } from "./icons";
import Color from "./Color";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("window");

// 从 GameFlatList 移植的常量
const BackToTopOffset = 100;


const CustomScrollView = forwardRef((props, ref) => {
    const {
        showBackTopIcon = true,
        children,
        horizontal = false,
        bottom = 20,
        // 刷新控制相关参数
        onRefresh = undefined,
        tintColor = Color.theme,
        // 滚动相关参数
        onScroll,
        getScrollHeight = () => {},
        // header 相关参数
        header = null, // 新增 header 组件参数
        showHeaderOnScroll = true, // 是否在向下滑动时隐藏 header
        paddingHorizontal = 0,
        // 内置的常用参数
        showsHorizontalScrollIndicator = false,
        showsVerticalScrollIndicator = false,
        //removeClippedSubviews = true,
        // nestedScrollEnabled = true,
        scrollEventThrottle = 16,
        keyboardShouldPersistTaps = "handled",
        automaticallyAdjustContentInsets = false,
        type = "ScrollView",
        // KeyboardAwareScrollView 专用参数
        enableOnAndroid = true,
        extraScrollHeight = 20,
        keyboardOpeningTime = 250,
        onKeyboardWillShow,
        onKeyboardWillHide,
        onKeyboardDidShow,
        onKeyboardDidHide,
        innerRef,
        // 新增底部间距相关参数
        bottomPadding = 100, // 底部间距，默认100px
        enableBottomPadding = true, // 是否启用底部间距
        // 平台优化参数（Android/iOS 各自有默认值）
        removeClippedSubviews = Platform.OS === "android" ? true : false, // Android 性能优化：移除屏幕外的子视图
        nestedScrollEnabled = Platform.OS === "android" ? true : false, // 允许嵌套滚动
        overScrollMode = Platform.OS === "android" ? "auto" : undefined, // 过度滚动模式（仅 Android）
        scrollBarThumbImage = undefined, // 自定义滚动条（仅 Android）
        alwaysBounceVertical, // 垂直方向总是弹跳（仅 iOS），根据 horizontal 动态设置
        alwaysBounceHorizontal, // 水平方向总是弹跳（仅 iOS），根据 horizontal 动态设置
        decelerationRate = Platform.OS === "ios" ? "normal" : undefined, // 滚动减速速率（仅 iOS）
        // 允许外部覆盖的参数
        ...rest
    } = props;

    // 根据滚动方向动态设置弹性效果
    // 如果是横向滑动，那么横向有弹性；如果是垂直滑动，那么垂直有弹性
    const finalAlwaysBounceVertical = alwaysBounceVertical !== undefined
        ? alwaysBounceVertical
        : (Platform.OS === "ios" ? !horizontal : undefined);
    const finalAlwaysBounceHorizontal = alwaysBounceHorizontal !== undefined
        ? alwaysBounceHorizontal
        : (Platform.OS === "ios" ? horizontal : undefined);

    // 缓存 ScrollViewComponent，避免每次渲染重新计算
    const ScrollViewComponent = useMemo(() => {
        return type === "KeyboardAwareScrollView" ? KeyboardAwareScrollView : ScrollView;
    }, [type]);

    // 平台优化参数对象，应用于 ScrollView 和 KeyboardAwareScrollView
    // 所有优化参数在 props 中都有默认值，这里直接应用
    const platformOptimizations = useMemo(() => {
        const optimizations = {};

        // 跨平台参数（两个平台都支持）
        optimizations.removeClippedSubviews = removeClippedSubviews;
        optimizations.nestedScrollEnabled = nestedScrollEnabled;

        // Android 专用参数
        if (Platform.OS === "android") {
            if (overScrollMode !== undefined) {
                optimizations.overScrollMode = overScrollMode;
            }
            if (scrollBarThumbImage !== undefined) {
                optimizations.scrollBarThumbImage = scrollBarThumbImage;
            }
        }

        // iOS 专用参数
        if (Platform.OS === "ios") {
            if (finalAlwaysBounceVertical !== undefined) {
                optimizations.alwaysBounceVertical = finalAlwaysBounceVertical;
            }
            if (finalAlwaysBounceHorizontal !== undefined) {
                optimizations.alwaysBounceHorizontal = finalAlwaysBounceHorizontal;
            }
            if (decelerationRate !== undefined) {
                optimizations.decelerationRate = decelerationRate;
            }
        }

        return optimizations;
    }, [removeClippedSubviews, nestedScrollEnabled, overScrollMode, scrollBarThumbImage, finalAlwaysBounceVertical, finalAlwaysBounceHorizontal, decelerationRate]);

    const [show, setShow] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef(null);

    // 安全创建 Animated.Value，避免在某些安卓设备上的问题
    const backToTopAnimation = useRef(new Animated.Value(0)).current;

    // BackBar 相关状态和动画 - 从 GameFlatList 移植
    const [isBackBarVisible, setIsBackBarVisible] = useState(true);
    const [offsetY, setOffsetY] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0); // 新增 header 高度状态
    const backBarAnimation = useRef(new Animated.Value(1)).current;
    const lastScrollYRef = useRef(0);
    const scrollDirectionRef = useRef("none"); // 追踪滚动方向
    const scrollVelocityRef = useRef(0); // 追踪滚动速度
    const lastScrollTimeRef = useRef(Date.now());

    // 新增：底部抖动检测相关状态
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [dynamicBottomPadding, setDynamicBottomPadding] = useState(bottomPadding);
    const lastPaddingUpdateRef = useRef(0); // 防抖用：存储上次更新的时间戳
    const lastContentOverflowRef = useRef(0); // 存储上次的内容溢出值

    // 动画状态追踪，防止重复启动动画
    const backToTopAnimatingRef = useRef(false);
    const backBarAnimatingRef = useRef(false);

    // 同步 bottomPadding prop 变化到状态（仅在内容明显超出时）
    React.useEffect(() => {
        const contentOverflow = lastContentOverflowRef.current;
        const threshold = 50;
        // 如果内容明显超出，使用新的 bottomPadding
        if (contentOverflow >= threshold && bottomPadding !== dynamicBottomPadding) {
            setDynamicBottomPadding(bottomPadding);
        }
    }, [bottomPadding, dynamicBottomPadding]);

    // 回到顶部方法
    const scrollToTop = () => {
        try {
            if (scrollRef.current && typeof scrollRef.current.scrollTo === "function") {
                scrollRef.current.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                });
            }
            setShow(false);
        } catch (error) {
            console.warn("scrollToTop failed:", error);
        }
    };

    // 暴露方法给外部 - 添加安全检查
    useImperativeHandle(ref, () => ({
        scrollTo: (options) => {
            try {
                if (scrollRef.current && typeof scrollRef.current.scrollTo === "function") {
                    scrollRef.current.scrollTo(options);
                }
            } catch (error) {
                console.warn("scrollTo failed:", error);
            }
        },
        scrollToTop,
        measureInWindow: (callback) => {
            try {
                if (scrollRef.current && typeof scrollRef.current.measureInWindow === "function") {
                    scrollRef.current.measureInWindow(callback);
                }
            } catch (error) {
                console.warn("measureInWindow failed:", error);
            }
        },
        // 其他需要暴露的方法
    }), [scrollToTop]);

    // 处理滚动事件 - 从 GameFlatList 移植的完整逻辑
    const handleScroll = (e) => {
        try {
            // 边界检查：确保 nativeEvent 存在
            if (!e?.nativeEvent) {
                return;
            }

            // Android 保护：检查 contentOffset 是否存在，避免 NullPointerException
            if (Platform.OS === "android" && !e.nativeEvent.contentOffset) {
                return;
            }

            if (horizontal) {
                onScroll?.(e);
                return;
            }

            const currentScrollY = e.nativeEvent.contentOffset?.y ?? 0;
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTimeRef.current;
            const scrollDiff = currentScrollY - lastScrollYRef.current;
            const velocity = timeDiff > 0 ? Math.abs(scrollDiff) / timeDiff : 0;

            // 更新滚动方向
            if (scrollDiff > 0) {
                scrollDirectionRef.current = "down";
            } else if (scrollDiff < 0) {
                scrollDirectionRef.current = "up";
            }

            scrollVelocityRef.current = velocity;
            setOffsetY(currentScrollY);

            // 检测是否到达底部（添加边界检查）
            const contentHeight = e.nativeEvent.contentSize?.height ?? 0;
            const scrollViewHeight = e.nativeEvent.layoutMeasurement?.height ?? 0;
            const isAtBottomNow = contentHeight > 0 && currentScrollY + scrollViewHeight >= contentHeight - 1;

            setIsAtBottom(isAtBottomNow);

            // 动态调整底部间距以防止抖动 - 添加防抖逻辑
            if (enableBottomPadding) {
                const contentOverflow = contentHeight - scrollViewHeight;
                const threshold = 50; // 增加阈值，减少频繁调整
                const now = Date.now();

                // 防抖：只在内容高度变化超过阈值或距离上次更新超过100ms时才更新
                const contentOverflowChanged = Math.abs(contentOverflow - lastContentOverflowRef.current) > 10;
                const timePassed = (now - lastPaddingUpdateRef.current) > 100;
                const shouldUpdate = contentOverflowChanged || timePassed;

                if (shouldUpdate) {
                    let newPadding;
                    if (contentOverflow > 0 && contentOverflow < threshold) {
                        // 内容高度接近可视区域时，使用固定的小间距
                        newPadding = 20;
                    } else if (contentOverflow >= threshold) {
                        // 内容明显超出时，使用正常间距
                        newPadding = bottomPadding;
                    } else {
                        // 内容未超出时，使用最小间距
                        newPadding = 10;
                    }

                    // 只有间距真正改变时才更新状态
                    if (newPadding !== dynamicBottomPadding) {
                        setDynamicBottomPadding(newPadding);
                        lastPaddingUpdateRef.current = now; // 更新时间戳
                        lastContentOverflowRef.current = contentOverflow; // 更新内容溢出值
                    }
                }
            }

            // 显示/隐藏回到顶部按钮（防止重复启动动画）
            if (currentScrollY > BackToTopOffset) {
                if (!show && !backToTopAnimatingRef.current) {
                    setShow(true);
                    backToTopAnimatingRef.current = true;
                    Animated.timing(backToTopAnimation, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start((finished) => {
                        if (finished) {
                            backToTopAnimatingRef.current = false;
                        }
                    });
                }
            } else {
                if (show && !backToTopAnimatingRef.current) {
                    setShow(false);
                    backToTopAnimatingRef.current = true;
                    Animated.timing(backToTopAnimation, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start((finished) => {
                        if (finished) {
                            backToTopAnimatingRef.current = false;
                        }
                    });
                }
            }

            // Header 显示/隐藏逻辑 - 参考 CustomFlatList 的实现
            // 只有当 showHeaderOnScroll 为 true 时才执行隐藏逻辑
            if (showHeaderOnScroll) {
                const minScrollThreshold = 5; // 更小的触发阈值，提高灵敏度
                const velocityThreshold = 0.2; // 降低速度阈值，更容易触发
                const isScrollingFast = velocity > velocityThreshold;
                const hasScrolledEnough = Math.abs(currentScrollY - lastScrollYRef.current) > minScrollThreshold;

                // 向下滚动：快速隐藏（防止重复启动动画）
                if (
                    scrollDirectionRef.current === "down" &&
                    currentScrollY > 10 &&
                    (isScrollingFast || hasScrolledEnough)
                ) {
                    if (isBackBarVisible && !backBarAnimatingRef.current) {
                        setIsBackBarVisible(false);
                        // 平滑隐藏动画
                        backBarAnimatingRef.current = true;
                        Animated.timing(backBarAnimation, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                backBarAnimatingRef.current = false;
                            }
                        });
                    }
                }
                // 向上滚动：立即显示 - 更灵敏的触发，但忽略加载更多时的抖动
                else if (scrollDirectionRef.current === "up" && !isAtBottom) {
                    if (!isBackBarVisible && !backBarAnimatingRef.current) {
                        setIsBackBarVisible(true);
                        // 平滑显示动画
                        backBarAnimatingRef.current = true;
                        Animated.timing(backBarAnimation, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                backBarAnimatingRef.current = false;
                            }
                        });
                    }
                }
                // 滚动停止或很慢：保持当前状态
                else if (velocity < 0.1 && currentScrollY < 10) {
                    // 在顶部附近，确保显示
                    if (!isBackBarVisible && !backBarAnimatingRef.current) {
                        setIsBackBarVisible(true);
                        backBarAnimatingRef.current = true;
                        Animated.timing(backBarAnimation, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                backBarAnimatingRef.current = false;
                            }
                        });
                    }
                }
            } else {
                // 如果 showHeaderOnScroll 为 false，确保 header 始终显示
                if (!isBackBarVisible && !backBarAnimatingRef.current) {
                    setIsBackBarVisible(true);
                    backBarAnimation.setValue(1);
                }
            }

            lastScrollYRef.current = currentScrollY;
            lastScrollTimeRef.current = currentTime;

            // 调用外部传入的 onScroll 和 getScrollHeight
            onScroll?.(e);
            getScrollHeight?.({ offsetY: currentScrollY });
        } catch (error) {
            console.warn("handleScroll failed:", error);
        }
    };

    // 处理刷新控制 - 添加错误处理
    const handleRefresh = async () => {
        if (onRefresh) {
            setRefreshing(true);
            try {
                await onRefresh();
            } catch (error) {
                console.error("Refresh failed:", error);
            } finally {
                setRefreshing(false);
            }
        }
    };

    // 内置的 RefreshControl - 只有当 onRefresh 存在且不是水平滚动时才显示
    // 使用 useMemo 缓存，避免每次渲染重新创建
    const finalRefreshControl = useMemo(() => {
        if (horizontal || !onRefresh) {
            return null;
        }
        return (
            <RefreshControl
                refreshing={refreshing}
                tintColor={tintColor}
                onRefresh={handleRefresh}
                colors={[tintColor]} // Android 專用
                progressBackgroundColor="#ffffff" // Android 專用
                size="default" // Android 專用
            />
        );
    }, [horizontal, onRefresh, refreshing, tintColor, handleRefresh]);

    // 处理 header layout 事件
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    };

    // 渲染 header 组件 - 从 GameFlatList 移植的完整功能，使用 useMemo 优化性能
    const renderHeader = useMemo(() => {
        if (!header) {
            return null;
        }

        // KeyboardAwareScrollView 模式下，header 始终显示且不隐藏
        const isKeyboardAware = type === "KeyboardAwareScrollView";
        if (isKeyboardAware) {
            if (typeof header === "function") {
                return header({
                    wrapStyle: {
                        paddingHorizontal: paddingHorizontal,
                        width: width,
                    },
                });
            }
            if (React.isValidElement(header)) {
                return React.cloneElement(header, {
                    wrapStyle: {
                        paddingHorizontal: paddingHorizontal,
                        width: width,
                    },
                });
            }
        }

        // 阴影显示逻辑：参考 CustomFlatList，只有当 showHeaderOnScroll 为 true 且 header 可见且有滚动时才显示阴影
        const shouldShowShadow = isBackBarVisible && offsetY > 0 && showHeaderOnScroll;

        // 当 showHeaderOnScroll = true 时，使用动画控制显示/隐藏
        // 当 showHeaderOnScroll = false 时，header 始终显示，不使用动画
        const animatedStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: showHeaderOnScroll ? backBarAnimation : 1,
            transform: [
                {
                    translateY: showHeaderOnScroll
                        ? backBarAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0], // 从上方滑入/滑出
                        })
                        : 0,
                },
            ],
            ...(shouldShowShadow ? styles.shadow : {}), // 為 header 的父容器添加陰影
        };

        if (typeof header === "function") {
            return (
                <Animated.View style={animatedStyle} onLayout={handleLayout}>
                    {header({
                        wrapStyle: {
                            paddingHorizontal: paddingHorizontal,
                            width: width,
                        },
                    })}
                </Animated.View>
            );
        }

        if (React.isValidElement(header)) {
            return (
                <Animated.View style={animatedStyle} onLayout={handleLayout}>
                    {React.cloneElement(header, {
                        wrapStyle: {
                            paddingHorizontal: paddingHorizontal,
                            width: width,
                            // 合併原有的 wrapStyle，而不是覆蓋
                            ...(header.props.wrapStyle || {}),
                        },
                    })}
                </Animated.View>
            );
        }

        return (
            <Animated.View style={animatedStyle} onLayout={handleLayout}>
                {header}
            </Animated.View>
        );
    }, [header, type, isBackBarVisible, offsetY, paddingHorizontal, handleLayout, showHeaderOnScroll, backBarAnimation]);

    return (
        <View style={{ flex: 1, position: "relative" }}>
            {renderHeader}
            {!isBackBarVisible && header && type !== "KeyboardAwareScrollView" && <View style={{ height: 16 }}></View>}
            <Animated.View
                style={[
                    styles.btn,
                    { bottom: bottom },
                    {
                        opacity: backToTopAnimation,
                        transform: [
                            {
                                translateX: backToTopAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0], // 从右边100px滑入到0
                                })
                            }
                        ]
                    }
                ]}
                pointerEvents={show && showBackTopIcon && !horizontal ? "auto" : "none"}
                // 性能优化：根据平台选择硬件加速
                renderToHardwareTextureAndroid={Platform.OS === "android"}
                shouldRasterizeIOS={Platform.OS === "ios"}
            >
                <BackTopIcon
                    width={24}
                    height={24}
                    onPress={scrollToTop}
                />
            </Animated.View>
            <ScrollViewComponent
                ref={horizontal ? null : scrollRef}
                innerRef={type === "KeyboardAwareScrollView" ? innerRef : undefined}
                onScroll={horizontal ? onScroll : handleScroll}
                refreshControl={finalRefreshControl}
                // 内置的常用参数
                showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                scrollEventThrottle={scrollEventThrottle}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                horizontal={horizontal}
                // 禁用自动内容边距调整
                automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
                // 啟用彈性效果（bounces），預設為 true
                bounces={rest.bounces !== undefined ? rest.bounces : true}
                // 平台特定的性能优化参数（应用于 ScrollView 和 KeyboardAwareScrollView）
                {...platformOptimizations}
                // KeyboardAwareScrollView 专用参数
                enableOnAndroid={type === "KeyboardAwareScrollView" ? enableOnAndroid : undefined}
                extraScrollHeight={type === "KeyboardAwareScrollView" ? extraScrollHeight : undefined}
                keyboardOpeningTime={type === "KeyboardAwareScrollView" ? keyboardOpeningTime : undefined}
                onKeyboardWillShow={type === "KeyboardAwareScrollView" ? onKeyboardWillShow : undefined}
                onKeyboardWillHide={type === "KeyboardAwareScrollView" ? onKeyboardWillHide : undefined}
                onKeyboardDidShow={type === "KeyboardAwareScrollView" ? onKeyboardDidShow : undefined}
                onKeyboardDidHide={type === "KeyboardAwareScrollView" ? onKeyboardDidHide : undefined}
                // 动态调整 contentContainerStyle 以支持 header
                contentContainerStyle={useMemo(() => {
                    const styles = [
                        rest.contentContainerStyle,
                        {
                            paddingTop: isBackBarVisible ? headerHeight : 16, // 當 header 可見時使用 headerHeight，隱藏時使用 16px
                        }
                    ].filter(style => style !== undefined && style !== null);
                    return styles;
                }, [rest.contentContainerStyle, isBackBarVisible, headerHeight])}
                // 允许外部覆盖的参数（放在最后，确保可以覆盖默认值）
                {...rest}>
                {children}

                {/* 动态底部间距，防止抖动 */}
                {enableBottomPadding && (
                    <View style={{ height: dynamicBottomPadding }}></View>
                )}
            </ScrollViewComponent>
        </View>
    );
});

export default CustomScrollView;

const styles = StyleSheet.create({
    btn: {
        position: "absolute",
        // 移除 bottom，完全由参数控制
        zIndex: 9999,
        right: 15,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shadow: {
        // iOS shadow
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        // Android shadow
        elevation: 8,
    },
});
