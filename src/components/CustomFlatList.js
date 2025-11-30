import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, FlatList, Animated, Dimensions, Platform, RefreshControl } from "react-native";
import ListFooter from "$Components/ListFooter";
import NoRecord from "$Components/NoRecord";
import LoadingBone from "$Components/LoadingBone";
import { BackTopIcon } from "$Components/icons";
import { translate } from "$locales/translate";

let BackToTopOffset = 100;

const { width } = Dimensions.get("window");

const CustomFlatList = ({
    data = "",
    ListHeaderComponent = null,
    renderItem = null,
    header = null, // 绝对定位的 sticky header 组件
    wrapStyle = {},
    showBackTopIcon = true,
    numColumns = 1,
    keyExtractor = null,
    showHeaderOnScroll = true, // 是否在向下滑动时隐藏 header
    itemsPerPage = 5, // 每页加载的数据项数量
    emptyText = translate("暂无记录"), // 空数据时的提示文本
    loadingMoreText = translate("加载更多…"), // 加载更多时的提示文本
    noMoreText = translate("没有更多了"), // 没有更多数据时的提示文本
    showNoMoreText = true, // 是否显示没有更多数据时的提示文本
    onRefresh = null, // 下拉刷新回调函数
    tintColor = "#00A6FF", // 刷新指示器颜色（iOS）
}) => {
    // const { GameCard } = mainsiteUI;
    const flatListRef = useRef(null);
    const [fullDataList, setFullDataList] = useState([]); // 全部数据列表
    const [displayedItems, setDisplayedItems] = useState([]); // 当前显示的数据项
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false); // 是否为最后一页
    const [nextPageStartIndex, setNextPageStartIndex] = useState(itemsPerPage);
    const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // 下拉刷新状态
    // 安全创建 Animated.Value，避免在某些安卓设备上的问题
    const backToTopAnimation = useRef(new Animated.Value(0)).current;
    const headerAnimation = useRef(new Animated.Value(1)).current;
    const previousScrollYRef = useRef(0);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [scrollOffsetY, setScrollOffsetY] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState(() => {
        if (data === null || data === undefined || data === "") {
            return "loading";
        }
        if (Array.isArray(data)) {
            return data.length > 0 ? "loaded" : "empty";
        }
        return "loading";
    });
    const shouldLoadMoreRef = useRef(false);
    const currentScrollDirectionRef = useRef("none"); // 当前滚动方向
    const currentScrollVelocityRef = useRef(0); // 当前滚动速度
    const previousScrollTimeRef = useRef(Date.now());
    const isLoadMoreTriggeredRef = useRef(false); // 是否触发了加载更多

    // 底部抖动检测相关状态
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [bottomPadding, setBottomPadding] = useState(50);
    const previousPaddingUpdateTimeRef = useRef(0); // 防抖用：上次更新底部间距的时间戳
    const previousContentOverflowRef = useRef(0); // 上次的内容溢出值

    // 动画状态追踪，防止重复启动动画
    const isBackToTopAnimatingRef = useRef(false);
    const isHeaderAnimatingRef = useRef(false);

    React.useEffect(() => {
        if (data === null || data === undefined || data === "") {
            setLoadingStatus("loading");
            return;
        }

        if (Array.isArray(data)) {
            if (data.length > 0) {
                setLoadingStatus("loaded");
                const totalItemCount = data.length;
                const totalPages = !(totalItemCount % itemsPerPage)
                    ? totalItemCount / itemsPerPage
                    : Number.parseInt(totalItemCount / itemsPerPage) + 1;

                setFullDataList(data);
                setDisplayedItems(data.slice(0, itemsPerPage));
                setNextPageStartIndex(itemsPerPage);
                setIsLastPage(totalPages === 1);
                setCurrentPage(1);
            } else {
                setLoadingStatus("empty");
                // 当 data 是空数组时，清空所有相关状态
                setFullDataList([]);
                setDisplayedItems([]);
                setNextPageStartIndex(itemsPerPage);
                setIsLastPage(true);
                setCurrentPage(1);
            }

            // 重置滚动相关状态
            setScrollOffsetY(0);
            setIsBackToTopVisible(false);
            setIsHeaderVisible(true);
            setIsScrolledToBottom(false);
            setBottomPadding(50);
            backToTopAnimation.setValue(0);
            headerAnimation.setValue(1);
            previousScrollYRef.current = 0;
            currentScrollDirectionRef.current = "none";
            currentScrollVelocityRef.current = 0;
            previousScrollTimeRef.current = Date.now();
            isLoadMoreTriggeredRef.current = false;
            isBackToTopAnimatingRef.current = false;
            isHeaderAnimatingRef.current = false;
            previousPaddingUpdateTimeRef.current = 0;
            previousContentOverflowRef.current = 0;
        }
    }, [data]);

    // 监听 currentPage 变化，当 currentPage 变化且不是第一页时，调用 loadMoreItems
    useEffect(() => {
        if (currentPage > 1) {
            loadMoreItems(true);
        }
    }, [currentPage]);

    const loadMoreItems = (shouldLoadMore = false) => {
        if (fullDataList && fullDataList.length && !!shouldLoadMore) {
            const totalItemCount = fullDataList.length;
            const totalPages = !(totalItemCount % itemsPerPage)
                ? totalItemCount / itemsPerPage
                : Number.parseInt(totalItemCount / itemsPerPage) + 1;

            setDisplayedItems((prevItems) => [
                ...prevItems,
                ...fullDataList.slice(
                    nextPageStartIndex,
                    nextPageStartIndex + itemsPerPage,
                ),
            ]);
            setNextPageStartIndex((prev) => prev + itemsPerPage);
            setIsLastPage(currentPage >= totalPages);
        }
    };

    const handleLoadMore = () => {
        if (isLastPage) {
            return;
        }
        // 添加震动反馈
        // try {
        //     Vibration.vibrate(10); // 更轻微震动10毫秒
        // } catch (error) {
        //     // 忽略震动错误，不影响主要功能
        //     console.warn("Vibration failed:", error);
        // }
        setCurrentPage((prev) => prev + 1);
    };




    // 处理滚动事件 - 参考 CustomScrollView 的完整逻辑
    const handleScroll = (event) => {
        try {
            // 边界检查：确保 nativeEvent 存在
            if (!event?.nativeEvent) {
                return;
            }

            const currentScrollY = event.nativeEvent.contentOffset?.y ?? 0;
            const scrollTime = Date.now();
            const timeDiff = scrollTime - previousScrollTimeRef.current;
            const scrollDiff = currentScrollY - previousScrollYRef.current;
            const scrollVelocity = timeDiff > 0 ? Math.abs(scrollDiff) / timeDiff : 0;

            // 更新滚动方向
            if (scrollDiff > 0) {
                currentScrollDirectionRef.current = "down";
            } else if (scrollDiff < 0) {
                currentScrollDirectionRef.current = "up";
            }

            currentScrollVelocityRef.current = scrollVelocity;
            setScrollOffsetY(currentScrollY);

            // 检测是否到达底部（添加边界检查）
            const contentHeight = event.nativeEvent.contentSize?.height ?? 0;
            const scrollViewHeight = event.nativeEvent.layoutMeasurement?.height ?? 0;
            const isAtBottomNow = contentHeight > 0 && currentScrollY + scrollViewHeight >= contentHeight - 1;

            setIsScrolledToBottom(isAtBottomNow);

            // 动态调整底部间距以防止抖动 - 添加防抖逻辑
            const contentOverflow = contentHeight - scrollViewHeight;
            const paddingThreshold = 50; // 增加阈值，减少频繁调整

            // 防抖：只在内容高度变化超过阈值或距离上次更新超过100ms时才更新
            const contentOverflowChanged = Math.abs(contentOverflow - previousContentOverflowRef.current) > 10;
            const timePassed = (scrollTime - previousPaddingUpdateTimeRef.current) > 100;
            const shouldUpdatePadding = contentOverflowChanged || timePassed;

            if (shouldUpdatePadding) {
                let newBottomPadding;
                if (contentOverflow > 0 && contentOverflow < paddingThreshold) {
                    // 内容高度接近可视区域时，使用固定的小间距
                    newBottomPadding = 20;
                } else if (contentOverflow >= paddingThreshold) {
                    // 内容明显超出时，使用正常间距
                    newBottomPadding = 50;
                } else {
                    // 内容未超出时，使用最小间距
                    newBottomPadding = 10;
                }

                // 只有间距真正改变时才更新状态
                if (newBottomPadding !== bottomPadding) {
                    setBottomPadding(newBottomPadding);
                    previousPaddingUpdateTimeRef.current = scrollTime; // 更新时间戳
                    previousContentOverflowRef.current = contentOverflow; // 更新内容溢出值
                }
            }

            // 显示/隐藏回到顶部按钮（防止重复启动动画）
            const shouldShowBackToTop = currentScrollY > BackToTopOffset;
            if (shouldShowBackToTop) {
                if (!isBackToTopVisible && !isBackToTopAnimatingRef.current) {
                    setIsBackToTopVisible(true);
                    isBackToTopAnimatingRef.current = true;
                    Animated.timing(backToTopAnimation, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start((finished) => {
                        if (finished) {
                            isBackToTopAnimatingRef.current = false;
                        }
                    });
                }
            } else {
                if (isBackToTopVisible && !isBackToTopAnimatingRef.current) {
                    setIsBackToTopVisible(false);
                    isBackToTopAnimatingRef.current = true;
                    Animated.timing(backToTopAnimation, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start((finished) => {
                        if (finished) {
                            isBackToTopAnimatingRef.current = false;
                        }
                    });
                }
            }

            // Header 显示/隐藏逻辑 - 从 CustomScrollView 移植
            // 只有当 showHeaderOnScroll 为 true 时才执行隐藏逻辑
            if (showHeaderOnScroll) {
                const minScrollThreshold = 5; // 更小的触发阈值，提高灵敏度
                const velocityThreshold = 0.2; // 降低速度阈值，更容易触发
                const isScrollingFast = scrollVelocity > velocityThreshold;
                const hasScrolledEnough = Math.abs(currentScrollY - previousScrollYRef.current) > minScrollThreshold;

                // 向下滚动：快速隐藏（防止重复启动动画）
                if (
                    currentScrollDirectionRef.current === "down" &&
                    currentScrollY > 10 &&
                    (isScrollingFast || hasScrolledEnough)
                ) {
                    if (isHeaderVisible && !isHeaderAnimatingRef.current) {
                        setIsHeaderVisible(false);
                        // 平滑隐藏动画
                        isHeaderAnimatingRef.current = true;
                        Animated.timing(headerAnimation, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                isHeaderAnimatingRef.current = false;
                            }
                        });
                    }
                }
                // 向上滚动：立即显示 - 更灵敏的触发，但忽略加载更多时的抖动
                else if (currentScrollDirectionRef.current === "up" && !isScrolledToBottom) {
                    if (!isHeaderVisible && !isHeaderAnimatingRef.current) {
                        setIsHeaderVisible(true);
                        // 平滑显示动画
                        isHeaderAnimatingRef.current = true;
                        Animated.timing(headerAnimation, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                isHeaderAnimatingRef.current = false;
                            }
                        });
                    }
                }
                // 滚动停止或很慢：保持当前状态
                else if (scrollVelocity < 0.1 && currentScrollY < 10) {
                    // 在顶部附近，确保显示
                    if (!isHeaderVisible && !isHeaderAnimatingRef.current) {
                        setIsHeaderVisible(true);
                        isHeaderAnimatingRef.current = true;
                        Animated.timing(headerAnimation, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }).start((finished) => {
                            if (finished) {
                                isHeaderAnimatingRef.current = false;
                            }
                        });
                    }
                }
            } else {
                // 如果 showHeaderOnScroll 为 false，确保 header 始终显示
                if (!isHeaderVisible && !isHeaderAnimatingRef.current) {
                    setIsHeaderVisible(true);
                    headerAnimation.setValue(1);
                }
            }

            previousScrollYRef.current = currentScrollY;
            previousScrollTimeRef.current = scrollTime;
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

    // 内置的 RefreshControl - 只有当 onRefresh 存在时才显示
    const finalRefreshControl = onRefresh ? (
        <RefreshControl
            refreshing={refreshing}
            tintColor={tintColor}
            onRefresh={handleRefresh}
            colors={[tintColor]} // Android 專用
            progressBackgroundColor="#ffffff" // Android 專用
            size="default" // Android 專用
        />
    ) : null;

    // 处理 header layout 事件
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    };

    // 渲染 header 组件 - 从 CustomScrollView 移植的完整功能，使用 useMemo 优化性能
    const renderHeader = useMemo(() => {
        if (!header) {
            return null;
        }

        const shouldShowShadow = isHeaderVisible && scrollOffsetY > 0 && showHeaderOnScroll;

        const animatedStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: headerAnimation,
            transform: [
                {
                    translateY: headerAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0], // 从上方滑入/滑出
                    }),
                },
            ],
            ...(shouldShowShadow ? styles.shadow : {}), // 為 header 的父容器添加陰影
        };

        if (typeof header === "function") {
            return (
                <Animated.View style={animatedStyle} onLayout={handleLayout}>
                    {header({
                        wrapStyle: {
                            paddingHorizontal: 16,
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
                            paddingHorizontal: 16,
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
    }, [header, isHeaderVisible, scrollOffsetY, handleLayout]);

    // 回到顶部方法
    const scrollToTop = () => {
        try {
            if (flatListRef.current && typeof flatListRef.current.scrollToOffset === "function") {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
            setIsBackToTopVisible(false);
        } catch (error) {
            console.warn("scrollToTop failed:", error);
        }
    };

    // 动态调整 contentContainerStyle 以支持动态底部间距
    const contentContainerStyle = useMemo(() => {
        return {
            paddingBottom: bottomPadding,
        };
    }, [bottomPadding]);



    return (
        <View style={styles.viewContainer}>
            {renderHeader}
            {/* {!isBackBarVisible && header && <View style={{ height: 16 }}></View>} */}

            {loadingStatus === "loading" ? (
                <View
                    style={[
                        styles.flatList,
                        { marginTop: headerHeight },
                    ]}
                >
                    <LoadingBone
                        wrapStyle={{
                            marginBottom: 16,
                        }}
                        length={4}
                    />
                </View>
            ) : (
                <FlatList
                    key={`flat-list-${data[0]?.gameName + data[1]?.gameName}`}
                    ref={flatListRef}
                    style={[
                        styles.flatList,
                        {
                            marginTop: isHeaderVisible ? headerHeight : 16, // 當 header 可見時使用 headerHeight，隱藏時使用 16px
                            ...wrapStyle,
                        },
                    ]}
                    contentContainerStyle={contentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    numColumns={numColumns}
                    data={displayedItems}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor || ((item, index) => item.gameId || item.id || index.toString())}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    refreshControl={finalRefreshControl}
                    // 平台优化参数
                    removeClippedSubviews={Platform.OS === "android" ? true : false}
                    nestedScrollEnabled={Platform.OS === "android" ? true : false}
                    // 性能优化参数（与 itemsPerPage 保持一致，避免冲突）
                    initialNumToRender={itemsPerPage} // 初始渲染的项目数量，与 itemsPerPage 一致
                    maxToRenderPerBatch={itemsPerPage} // 每批渲染的最大项目数，与 itemsPerPage 一致
                    windowSize={5} // 渲染窗口大小，5表示渲染可见区域上下各2.5屏的内容
                    updateCellsBatchingPeriod={50} // 批量更新单元格的周期（毫秒），减少更新频率
                    // 注意：如果项目高度固定，可以提供 getItemLayout 函数以进一步提升性能
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={() => {
                        if (!Array.isArray(data) || data.length === 0) {
                            return (
                                <NoRecord
                                    text={emptyText}
                                    textStyle={styles.noRecordTxt}
                                />
                            );
                        }

                        if (!showNoMoreText) {
                            return null;
                        }

                        return (
                            <ListFooter
                                key={`list-footer-${displayedItems.length}`}
                                isEmptyData={displayedItems.length === 0}
                                lastPage={isLastPage}
                                loadingText={loadingMoreText}
                                emptyText={noMoreText}
                            />
                        );
                    }}
                    onEndReached={() => {
                        shouldLoadMoreRef.current = true;
                        isLoadMoreTriggeredRef.current = true;
                    }}
                    onMomentumScrollEnd={() => {
                        if (shouldLoadMoreRef.current) {
                            handleLoadMore();
                            shouldLoadMoreRef.current = false;
                        }
                        // 延迟重置加载状态，避免抖动
                        setTimeout(() => {
                            isLoadMoreTriggeredRef.current = false;
                        }, 500);
                    }}
                    onEndReachedThreshold={0.1}
                    columnWrapperStyle={numColumns > 1 ? styles.rowBetween : undefined}
                />
            )}

            {/* 回到顶部按钮 */}
            <Animated.View
                style={[
                    styles.backToTopButton,
                    {
                        opacity: backToTopAnimation,
                        right: 16,
                        transform: [
                            {
                                translateX: backToTopAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0], // 从右边100px滑入到0
                                }),
                            },
                        ],
                    },
                ]}
                pointerEvents={isBackToTopVisible && showBackTopIcon ? "auto" : "none"}
                // 性能优化：根据平台选择硬件加速
                renderToHardwareTextureAndroid={Platform.OS === "android"}
                shouldRasterizeIOS={Platform.OS === "ios"}
            >
                <BackTopIcon width={24} height={24} onPress={scrollToTop} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 16,
    },
    flatList: {
        flex: 1,
        borderRadius: 6,
        overflow: "hidden",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    noRecordTxt: {
        fontSize: 14,
        color: "#CCCCCC",
    },
    backToTopButton: {
        position: "absolute",
        bottom: 20,
        right: 0,
        width: 48,
        height: 48,
        borderRadius: 22,
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

export default React.memo(CustomFlatList);
