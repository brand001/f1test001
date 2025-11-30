import React, { useRef, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Animated } from "react-native";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { CloseIcon } from "$Components/icons/index";
import { RowCenterCenter, RowCenterStart, RowCenterBetween, ColumnCenterCenter } from "$Components/CustomView";
import { useAddressPicker } from "@/hook/usePromotionsAddress";

const { width, height } = Dimensions.get("window");

/**
 * 地址選擇器組件
 * 
 * 用於選擇省、市、區三級地址的彈窗組件
 * 支持動畫效果和步驟導航
 * 
 * @param {Object} props - 組件屬性
 * @param {boolean} props.visible - 是否顯示選擇器
 * @param {Array} props.provinceData - 省份數據列表
 * @param {Array} props.districtData - 城市數據列表
 * @param {Array} props.townData - 區縣數據列表
 * @param {boolean} props.loading - 是否正在加載數據
 * @param {string} props.selectedProvince - 已選中的省份名稱
 * @param {string} props.selectedDistrict - 已選中的城市名稱
 * @param {string} props.selectedTown - 已選中的區縣名稱
 * @param {Function} props.onProvinceSelect - 省份選擇回調函數
 * @param {Function} props.onDistrictSelect - 城市選擇回調函數
 * @param {Function} props.onTownSelect - 區縣選擇回調函數
 * @param {Function} props.onConfirm - 確認選擇回調函數
 * @param {Function} props.onClose - 關閉選擇器回調函數
 */
const AddressPicker = (props) => {
    const {
        visible,
        provinceData,
        districtData,
        townData,
        loading,
        selectedProvince: initialSelectedProvince,
        selectedDistrict: initialSelectedDistrict,
        selectedTown: initialSelectedTown,
        onProvinceSelect,
        onDistrictSelect,
        onTownSelect,
        onConfirm,
        onClose,
    } = props;

    // 動畫值（在組件中創建）
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;

    // 從 useAddressPicker hook 獲取的狀態和方法
    const {
        currentStep, // 當前選擇步驟（"province" | "district" | "town"）
        selectedProvince, // 已選中的省份名稱
        selectedDistrict, // 已選中的城市名稱
        selectedTown, // 已選中的區縣名稱
        onHandleEmptyTownSelect, // 處理沒有區縣數據的情況（當區縣列表為空時點擊確認）
        onHandleClose, // 處理關閉選擇器（觸發關閉回調）
        onGoBackToStep, // 回到指定步驟 @param {string} targetStep - 目標步驟 ("province" | "district" | "town")
        getCurrentData, // 獲取當前步驟對應的數據列表 @param {Array} provinceDataList - 省份數據列表 @param {Array} districtDataList - 城市數據列表 @param {Array} townDataList - 區縣數據列表 @returns {Array} 當前步驟對應的數據列表
        getCurrentSelected, // 獲取當前步驟對應的選中項名稱 @returns {string} 當前步驟對應的選中項名稱
        onHandleItemSelect, // 處理項目選擇（根據當前步驟自動調用對應的選擇處理函數） @param {Object} selectedItem - 選中的項目對象 @param {string} selectedItem.name - 項目名稱 @param {string|number} selectedItem.id - 項目 ID
    } = useAddressPicker({
        selectedProvince: initialSelectedProvince,
        selectedDistrict: initialSelectedDistrict,
        selectedTown: initialSelectedTown,
        onProvinceSelect,
        onDistrictSelect,
        onTownSelect,
        onConfirm,
        onClose,
    });

    /**
     * 執行打開動畫
     * 
     * 同時執行背景淡入和內容滑入動畫
     */
    const onOpenAnimation = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    /**
     * 執行關閉動畫
     * 
     * 同時執行背景淡出和內容滑出動畫，動畫完成後觸發關閉回調
     */
    const onCloseAnimation = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHandleClose();
        });
    };

    /**
     * 控制動畫效果
     * 
     * 根據 visible 狀態執行打開或關閉動畫
     */
    useEffect(() => {
        if (visible) {
            // 重置動畫值並執行打開動畫
            slideAnim.setValue(height);
            fadeAnim.setValue(0);
            onOpenAnimation();
        } else {
            onCloseAnimation();
        }
    }, [visible]);

    /**
     * 渲染路徑導航
     * 
     * 根據當前步驟顯示對應的導航路徑
     * - province: 顯示"請選擇省"
     * - district: 顯示已選省份和"請選擇市"
     * - town: 顯示已選省、市和"請選擇區"或已選區縣
     * 
     * @returns {JSX.Element} 路徑導航組件
     */
    const onRenderPathNavigation = () => {
        let selectedPathText = { ...styles.selectedPathText, marginRight: window.LANGUAGE == "CN" ? 24 : 5 };
        switch (currentStep) {
        case "province":
            return (
                <RowCenterCenter style={styles.currentStepContainer}>
                    <Text style={[styles.panelTitle, styles.provinceTitle]}>{translate("请选择省")}</Text>
                </RowCenterCenter>
            );
        case "district":
            return (
                <RowCenterStart style={[styles.pathContainer, styles.districtContainer]}>
                    <TouchableOpacity onPress={() => onGoBackToStep("province")} style={styles.selectedPathContainer}>
                        <Text style={[styles.pathText, selectedPathText]}>{selectedProvince}</Text>
                    </TouchableOpacity>
                    <RowCenterCenter style={styles.currentStepContainer}>
                        <Text style={[styles.pathText, styles.currentStepText]}>{translate("请选择市")}</Text>
                    </RowCenterCenter>
                </RowCenterStart>
            );
        case "town":
            return (
                <RowCenterStart style={[styles.pathContainer, styles.townContainer]}>
                    <TouchableOpacity onPress={() => onGoBackToStep("province")} style={styles.selectedPathContainer}>
                        <Text style={[styles.pathText, selectedPathText]}>{selectedProvince}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onGoBackToStep("district")} style={styles.selectedPathContainer}>
                        <Text style={[styles.pathText, selectedPathText]}>{selectedDistrict}</Text>
                    </TouchableOpacity>
                    {selectedTown ? (
                        <Text style={[styles.pathText, selectedPathText]}>{selectedTown}</Text>
                    ) : (
                        <RowCenterCenter style={styles.currentStepContainer}>
                            <Text style={[styles.pathText, styles.currentStepText]}>{translate("请选择区")}</Text>
                        </RowCenterCenter>
                    )}
                </RowCenterStart>
            );
        default:
            return (
                <RowCenterCenter style={styles.currentStepContainer}>
                    <Text style={[styles.panelTitle, styles.provinceTitle]}>{translate("请选择省")}</Text>
                </RowCenterCenter>
            );
        }
    };

    const currentData = getCurrentData(provinceData, districtData, townData);
    const currentSelected = getCurrentSelected();

    return (
        <Modal visible={visible} animationType="none" transparent={true}>
            {/* 淡入淡出背景 */}
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <TouchableOpacity onPress={onCloseAnimation} style={{ flex: 1 }} />
            </Animated.View>

            {/* 滑动出现的内容 */}
            <Animated.View style={[styles.wrap, { transform: [{ translateY: slideAnim }] }]}>
                {/* Header */}
                <RowCenterBetween style={styles.header}>
                    <CloseIcon onPress={onCloseAnimation} width={22} height={22} fill={Color.gray} />
                    <Text style={styles.title}>{translate("选择省、市、区")}</Text>
                    <CloseIcon onPress={onCloseAnimation} width={22} height={22} fill={Color.gray} wrapStyle={styles.confirmButton} />
                </RowCenterBetween>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.panel}>
                        <RowCenterStart style={styles.listItem}>
                            {onRenderPathNavigation()}
                        </RowCenterStart>

                        <ScrollView>
                            <View style={styles.listContainer}>
                                {loading ? (
                                    <ColumnCenterCenter style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#00A6FF" />
                                        <Text style={styles.loadingText}>{translate("加载中...")}</Text>
                                    </ColumnCenterCenter>
                                ) : currentData.length > 0 ? (
                                    currentData.map((item, index) => (
                                        <RowCenterStart
                                            key={index}
                                            style={[
                                                styles.listItem,
                                                currentSelected === item.name && styles.selectedItem
                                            ]}
                                            onPress={() => onHandleItemSelect(item)}
                                        >
                                            <Text style={[
                                                styles.itemText,
                                                currentSelected === item.name && styles.selectedItemText
                                            ]}>
                                                {item.name}
                                            </Text>
                                        </RowCenterStart>
                                    ))
                                ) : currentStep === "town" ? (
                                    // 如果是區縣級別且沒有數據，顯示可點擊的項目
                                    <RowCenterStart
                                        style={styles.listItem}
                                        onPress={onHandleEmptyTownSelect}
                                    >
                                        {/* <Text style={styles.itemText}>{translate("暂无数据，点击确认")}</Text> */}
                                    </RowCenterStart>
                                ) : (
                                    <ColumnCenterCenter style={styles.loadingContainer}>
                                        {/* <Text style={styles.emptyText}>{translate("暂无数据")}</Text> */}
                                    </ColumnCenterCenter>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    wrap: {
        position: "absolute",
        width: width,
        height: height * 0.7,
        backgroundColor: Color.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        bottom: 0,
    },
    header: {
        paddingHorizontal: 16,
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFF4",
        backgroundColor: "#E3E3E3",
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        overflow: "hidden",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: Color.charcoal,
    },
    confirmButton: {
        opacity: 0,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Color.white,
        paddingHorizontal: 16,
    },
    panel: {
        flex: 1,
    },
    panelTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#00A6FF",
    },
    listContainer: {
        flex: 1,
    },
    pathContainer: {
        height: "100%",
    },
    pathText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222222",
    },
    listItem: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    selectedItem: {

    },
    itemText: {
        fontSize: 14,
        color: "#666666",
        fontWeight: "400",
    },
    selectedItemText: {

    },
    // 路徑導航不同狀態樣式
    provinceTitle: {
        color: "#00A6FF",
        fontSize: 16,
        fontWeight: "700",
    },
    districtContainer: {
        borderBottomColor: "#00A6FF",
    },
    townContainer: {
        borderBottomColor: "#00A6FF",
    },
    selectedPathText: {
        color: "#222222",
        fontWeight: "400",
    },
    currentStepContainer: {
        borderBottomWidth: 2,
        borderBottomColor: "#00A6FF",
        height: "100%",
    },
    currentStepText: {
        color: "#00A6FF",
        fontWeight: "600",

    },
    selectedPathContainer: {
        marginRight: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        height: "100%",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#999999",
        fontWeight: "400",
    },
});

export default AddressPicker;   
