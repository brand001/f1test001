import React, { useEffect, useRef, useState, useMemo } from "react";
import { Animated, Dimensions, Easing, findNodeHandle, Image, StyleSheet, Text, TouchableWithoutFeedback, UIManager, View, FlatList } from "react-native";
import { translate } from "@/locales/translate";
import { connect } from "react-redux";
import Color from "./Color";
import FilledButton from "./FilledButton";
import { CloseIcon, FilterSetIcon } from "./icons/index";
import { RowCenterBetween, ColumnCenterCenter, RowCenterStart, RowCenterCenter, ColumnBetweenCenter } from "./CustomView";

const { width, height } = Dimensions.get("window");
const NavHeight = 48;
const paddingWidth = 30;

const ANIMATION_CONFIG = {
    DURATION: {
        PANEL: 700,
        ITEM: 400
    },
    EASING: Easing.bezier(0.4, 0, 0.2, 1),
    ITEM_DELAY: 50
};

const PromotionsFilter = ({
    userSetting,
    data = [],
    realName = "",
    showFilter = true,
    children = null,
    name: propName,
    onFiltter,
    callBack,
    isHideText = false,
    wrapStyle = {}
}) => {
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(0);
    const [name, setName] = useState("");

    const viewRef = useRef(null);
    const animatedValue = useRef(new Animated.Value(-height)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;
    const itemsAnimation = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    useEffect(() => {
        if (propName) {
            setName(propName);
        }
    }, [propName]);

    useEffect(() => {
        if (userSetting?.routerName) {
            setShow(false);
        }
    }, [userSetting?.routerName]);

    useEffect(() => {
        if (show) {
            let newIndex = data.findIndex(v => v[realName] == name);
            newIndex = newIndex >= 0 ? newIndex : 0;
            handleCategorySelect(newIndex);
        }
    }, [show, data, realName, name]);

    const handleCategorySelect = (newIndex) => {
        if (index === newIndex) return; // 避免重复点击
        setIndex(newIndex);
    };

    const handleReset = () => {
        setIndex(0);
        setName("");
        onFiltter({
            PromoCatCode: "All",
            PromoCatID: 0,
            languageCode: "",
        });
    };

    const handleFilterApply = async () => {
        try {
            const selectedItem = data[index];
            setName(selectedItem[realName]);
            hideDropdown();
            await onFiltter(selectedItem);
        } catch (err) {
            console.warn("Filter apply error:", err);
        }
    };

    const createPanelAnimation = (toShow) => {
        return Animated.parallel([
            Animated.timing(animatedValue, {
                toValue: toShow ? 0 : -height,
                duration: ANIMATION_CONFIG.DURATION.PANEL,
                easing: ANIMATION_CONFIG.EASING,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: toShow ? 1 : 0,
                duration: ANIMATION_CONFIG.DURATION.PANEL,
                easing: ANIMATION_CONFIG.EASING,
                useNativeDriver: true,
            })
        ]);
    };

    const createItemsAnimation = (toShow) => {
        return Animated.timing(itemsAnimation, {
            toValue: toShow ? 1 : 0,
            duration: ANIMATION_CONFIG.DURATION.ITEM,
            easing: ANIMATION_CONFIG.EASING,
            useNativeDriver: true,
        });
    };

    const showDropdown = () => {
        if (animationRef.current) {
            animationRef.current.stop();
        }
        setShow(true);
        animationRef.current = Animated.sequence([
            createPanelAnimation(true),
            createItemsAnimation(true)
        ]);
        animationRef.current.start();
    };

    const hideDropdown = () => {
        if (animationRef.current) {
            animationRef.current.stop();
        }
        animationRef.current = Animated.sequence([
            createItemsAnimation(false),
            createPanelAnimation(false)
        ]);
        animationRef.current.start(() => {
            setShow(false);
            animationRef.current = null;
        });
    };

    const measurePosition = () => {
        if (viewRef.current) {
            const nodeHandle = findNodeHandle(viewRef.current);
            if (nodeHandle) {
                UIManager.measure(nodeHandle, () => {
                    // 测量位置，用于后续可能的定位需求
                });
            }
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(measurePosition, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleFilterToggle = () => {
        if (show) {
            hideDropdown();
        } else {
            measurePosition();
            showDropdown();
        }
        callBack?.();
    };

    const paddedData = useMemo(() => {
        const remainder = data.length % 4;
        if (remainder === 0) return data;

        const padding = Array(4 - remainder).fill({
            [realName]: "",
            promoCatImageUrl: ""
        });
        return [...data, ...padding];
    }, [data, realName]);

    const renderCategoryItem = ({ item, index: itemIndex }) => {
        const { promoCatImageUrl = "" } = item;
        const isSelected = itemIndex === index;
        const scaleAndOpacity = itemsAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1]
        });

        return (
            <Animated.View style={[
                styles.categoryItemAnimated,
                {
                    opacity: scaleAndOpacity,
                    transform: [{ scale: scaleAndOpacity }],
                }
            ]}>
                <ColumnBetweenCenter
                    style={[styles.categoryBtn, { width: (width - paddingWidth * 2) / 4 }]}
                    onPress={item[realName] ? () => handleCategorySelect(itemIndex) : null}>
                    <ColumnCenterCenter style={isSelected ? styles.selectedCategoryIconView : styles.categoryIconView}>
                        <Image
                            source={
                                typeof promoCatImageUrl === "string"
                                    ? { uri: promoCatImageUrl }
                                    : promoCatImageUrl
                            }
                            style={styles.categoryIconImg}
                        />
                    </ColumnCenterCenter>
                    <Text style={[
                        styles.categoryName,
                        isSelected ? styles.categoryNameSelected : styles.categoryNameNormal
                    ]}>{item[realName]}</Text>
                </ColumnBetweenCenter>
            </Animated.View>
        );
    };

    const keyExtractor = (item, index) => `category-${index}`;

    useEffect(() => {
        return () => {
            // 清理动画
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (userSetting?.routerName) {
            hideDropdown();
        }
    }, [userSetting?.routerName]);
    const selectedCategoryBtnDynamicStyle = isHideText ? {
        maxWidth: width * 0.34,
        minWidth: 60
    } : {};

    const selectedCategoryTextDynamicStyle = isHideText ? {
        maxWidth: width * 0.34 - 16 - 18 - 4
    } : {};

    return (
        <View style={[styles.container, wrapStyle]}>
            <RowCenterBetween style={styles.navBox} ref={viewRef}>
                {showFilter && (
                    <RowCenterStart>
                        <FilterSetIcon wrapStyle={styles.filterBtn} onPress={handleFilterToggle} />

                        {name && name !== translate("全部") && (
                            <RowCenterCenter style={[styles.selectedCategoryBtn, selectedCategoryBtnDynamicStyle]} onPress={handleReset}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[styles.selectedCategoryNameText, selectedCategoryTextDynamicStyle]}>
                                    {name}
                                </Text>
                                <CloseIcon fill={Color.gray} width={18} height={18} />
                            </RowCenterCenter>
                        )}
                    </RowCenterStart>
                )}
                {children}
            </RowCenterBetween>

            {show && (
                <TouchableWithoutFeedback onPress={hideDropdown}>
                    <Animated.View style={[styles.dropdownContainer, { opacity: opacityValue }]}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <Animated.View style={[styles.dropdownBox, { transform: [{ translateY: animatedValue }] }]}>
                                <RowCenterBetween style={styles.dropdownHeader}>
                                    <Text style={styles.dropdownText}>{translate("优惠种类")}</Text>
                                    <CloseIcon
                                        fill={Color.gray}
                                        width={18}
                                        height={18}
                                        onPress={hideDropdown}
                                    />
                                </RowCenterBetween>

                                <FlatList
                                    data={paddedData}
                                    renderItem={renderCategoryItem}
                                    keyExtractor={keyExtractor}
                                    numColumns={4}
                                    style={styles.categoriesBox}
                                    showsVerticalScrollIndicator={false}
                                    columnWrapperStyle={styles.columnWrapper}
                                    initialNumToRender={8}
                                    maxToRenderPerBatch={8}
                                    windowSize={3}
                                />
                                <FilledButton
                                    onPress={handleFilterApply}
                                    type="medium"
                                    text={translate("提交2")}
                                    fullWidth={false}
                                    wrapStyle={styles.submitButton}
                                />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const mapStateToProps = state => ({
    userSetting: state.userSetting,
});

export default connect(mapStateToProps)(PromotionsFilter);

const styles = StyleSheet.create({
    container: {
        zIndex: 999,
        backgroundColor: "#EFEFF4",
    },
    navBox: {
        paddingHorizontal: 15,
        height: NavHeight,
        zIndex: 9999,
    },
    filterBtn: {
        backgroundColor: Color.white,
        height: 32,
        width: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedCategoryBtn: {
        backgroundColor: Color.white,
        borderRadius: 6,
        paddingHorizontal: 8,
        height: 32,
        marginLeft: 8,
        marginRight: 4,
    },
    selectedCategoryNameText: {
        color: Color.darkGray,
        fontSize: 12,
        marginRight: 4,
    },
    dropdownContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        width,
        position: "absolute",
        top: 0,
        zIndex: 9999,
        flex: 1,
        height,
        overflow: "hidden",
    },
    dropdownBox: {
        width,
        backgroundColor: Color.white,
        paddingVertical: 20,
        overflow: "hidden",
    },
    dropdownHeader: {
        height: 22,
        paddingHorizontal: paddingWidth,
    },
    dropdownText: {
        fontSize: 16,
        color: Color.charcoal,
        fontWeight: "600",
    },
    categoriesBox: {
        marginTop: 24,
        zIndex: 99999,
        overflow: "hidden",
    },
    columnWrapper: {
        marginHorizontal: 10,
        justifyContent: "space-between",
    },
    categoryBtn: {
        marginBottom: 20,
    },
    categoryItemAnimated: {
        overflow: "hidden",
    },
    selectedCategoryIconView: {
        borderWidth: 2,
        borderColor: Color.theme,
        width: 48,
        height: 48,
        borderRadius: 14,
        padding: 2,
    },
    categoryIconView: {
        width: 48,
        height: 48,
    },
    categoryIconImg: {
        width: 40,
        height: 40,
    },
    categoryName: {
        textAlign: "center",
        fontSize: 12,
        marginTop: 12,
    },
    categoryNameSelected: {
        color: Color.charcoal,
        fontWeight: "600",
    },
    categoryNameNormal: {
        color: Color.darkGray,
        fontWeight: "400",
    },
    submitButton: {
        paddingHorizontal: 30,
    },
});
