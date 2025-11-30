import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import InfoBar from "$Components/InfoBar";

import AddressPicker from "./AddressPicker";
import { ColumnCenterCenter, RowCenterBetween } from "$Components/CustomView";
import { ArrowIcon } from "$Components/icons/index";
import NavBack from "$Components/Nav/NavBack.js";
import { usePromotionsAddressForm } from "@/hook/usePromotionsAddress";

/**
 * 促銷地址表單組件
 * 
 * 用於新增或編輯促銷地址的表單組件
 * 支持地址選擇、表單驗證和提交功能
 * 
 * @param {Object} props - 組件屬性
 * @param {string} props.types - 表單類型 ("add" | "edit")
 * @param {Object} props.addressData - 編輯模式下的地址數據
 * @param {boolean} props.isPrimary - 是否為默認地址
 * @param {Function} props.getAddress - 獲取地址列表的回調函數
 * @param {Function} props.showDeleteConfirmModal - 顯示刪除確認模態框的回調函數
 * @param {Object} props.navigation - 導航對象
 */
const PromotionsAddressform = (props) => {
    const { types: formType, addressData: editAddressData, isPrimary: initialIsPrimary, getAddress: onGetAddressList, showDeleteConfirmModal: onShowDeleteConfirmModal, navigation } = props;

    // 從 usePromotionsAddressForm hook 獲取的狀態和方法
    const {
        // ========== 表單字段狀態 ==========
        addressLabel, // 地址標籤（地址名稱）
        recipientName, // 收件人姓名
        phoneNumber, // 手機號碼（不含國家代碼前綴）
        address, // 詳細地址
        zipCode, // 郵政編碼
        addressSelectorError, // 地址選擇器錯誤訊息
        isPrimary, // 是否設為默認地址
        addressId, // 地址 ID（編輯模式使用）

        // ========== 地址選擇器狀態 ==========
        provinceData, // 省份數據列表
        districtData, // 城市數據列表
        townData, // 區縣數據列表
        showAddressModal, // 是否顯示地址選擇彈窗
        selectedProvince, // 已選中的省份名稱
        selectedDistrict, // 已選中的城市名稱
        selectedTown, // 已選中的區縣名稱
        addressLoading, // 地址數據是否正在加載中

        // ========== 表單操作方法 ==========
        setIsPrimary, // 設置是否為默認地址 @param {boolean} value - 是否設為默認地址
        onFieldChange, // 處理字段變更（通用處理函數） @param {Object} fieldConfig - 字段配置對象 @param {string} rawInputValue - 原始輸入值
        onSubmitAddress, // 提交地址表單（新增或更新）
        onProvinceSelect, // 處理省份選擇 @param {Object} selectedProvinceItem - 選中的省份對象 @param {string} selectedProvinceItem.name - 省份名稱 @param {string|number} selectedProvinceItem.id - 省份 ID
        onDistrictSelect, // 處理城市選擇 @param {Object} selectedDistrictItem - 選中的城市對象 @param {string} selectedDistrictItem.name - 城市名稱 @param {string|number} selectedDistrictItem.id - 城市 ID
        onTownSelect, // 處理區縣選擇 @param {Object} selectedTownItem - 選中的區縣對象 @param {string} selectedTownItem.name - 區縣名稱 @param {string|number} selectedTownItem.id - 區縣 ID
        onAddressConfirm, // 處理地址選擇確認 @param {Object} _selectedData - 選中的地址數據（未使用）
        onOpenAddressModal, // 顯示地址選擇彈窗（會預加載已選項目的下級數據）
        onCloseAddressModal, // 關閉地址選擇彈窗（會驗證地址選擇是否完整）
        getFieldConfigs, // 獲取字段配置對象 @param {Object} inputRefs - 輸入框 refs 對象 @returns {Array} 字段配置數組
        fieldValues, // 字段值映射對象（用於表單輸入框的 value 屬性） @type {Object} { addressLabel, recipientName, phoneNumber, address, zipCode }
        fieldErrors, // 字段錯誤映射對象（用於顯示表單驗證錯誤） @type {Object} { addressLabel, recipientName, phoneNumber, address, zipCode }
        getSubmitButtonEnable, // 獲取提交按鈕的 enable 狀態 @returns {boolean} 是否啟用提交按鈕（新增模式：所有字段驗證通過且已填寫完整；編輯模式：所有字段驗證通過、已填寫完整且內容有變更）
        getDeleteButtonEnable, // 獲取刪除按鈕的 enable 狀態 @returns {boolean} 是否啟用刪除按鈕（所有字段已填寫完整時才啟用）
    } = usePromotionsAddressForm({
        formType,
        editAddressData,
        isPrimary: initialIsPrimary,
        onGetAddressList,
    });

    // 添加 ref
    const _addressLabelInput = useRef(null);
    const _recipientNameInput = useRef(null);
    const _phoneNumberInput = useRef(null);
    const _addressInput = useRef(null);
    const _zipCodeInput = useRef(null);

    // 動畫
    const toggleAnimation = useRef(new Animated.Value(isPrimary ? 1 : 0)).current;

    // 字段配置對象
    const FieldConfigs = getFieldConfigs({
        addressLabelRef: _addressLabelInput,
        recipientNameRef: _recipientNameInput,
        phoneNumberRef: _phoneNumberInput,
        addressRef: _addressInput,
        zipCodeRef: _zipCodeInput,
    });


    /**
     * 設置導航標題、返回按鈕和動畫值
     * 
     * 根據表單類型設置對應的標題和返回按鈕行為
     * 當表單有內容時，返回會顯示確認離開的提示
     */
    useEffect(() => {
        navigation.setParams({
            title: formType === "edit" ? translate("编辑收货地址") : translate("新增收货地址"),
        });

        navigation.setParams({
            leftButton: () => {
                return (
                    <NavBack
                        onPress={() => {
                            if (((addressLabel || recipientName || zipCode || phoneNumber || address) && formType === "add") || formType === "edit") {
                                GetGlobalModal({
                                    title: translate("确定离开此页面?"),
                                    message: translate("您所填写的内容尚未提交，若离开将不被保存"),
                                    cancelText: translate("离开address"),
                                    onCancel: () => {
                                        Actions.pop();
                                    },
                                    confirmText: translate("继续填写"),
                                    onConfirm: () => {},
                                });
                            } else {
                                Actions.pop();
                            }
                        }}
                    />
                );
            },
        });

        // 更新動畫值
        toggleAnimation.setValue(isPrimary ? 1 : 0);
    }, [formType, addressLabel, recipientName, zipCode, phoneNumber, address, isPrimary]);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                    {FieldConfigs.map((field) => {
                        return (
                            <React.Fragment key={field.key}>
                                {field.key === "address" && (
                                    <>
                                        <Text style={[styles.titles]}>{translate(field.title)}</Text>

                                        <RowCenterBetween
                                            style={[
                                                styles.addressSelector,
                                                {
                                                    borderColor: showAddressModal
                                                        ? "#00A6FF"
                                                        : "#E3E3E8",
                                                },
                                            ]}
                                            onPress={onOpenAddressModal}
                                        >
                                            <Text
                                                style={[
                                                    styles.addressText,
                                                    { color: selectedProvince ? "#222" : "#BCBEC3" },
                                                ]}
                                            >
                                                {Boolean(selectedProvince ||
                                                    selectedDistrict ||
                                                    selectedTown)
                                                    ? `${selectedProvince}, ${selectedDistrict}, ${selectedTown}`
                                                    : translate("请选择省、市、区")}
                                            </Text>
                                            <ArrowIcon
                                                width={14}
                                                height={14}
                                                fill={"#999999"}
                                                direction={showAddressModal ? "top" : "bottom"}
                                            />
                                        </RowCenterBetween>

                                        {addressSelectorError ? (
                                            <InfoBar
                                                type="errorBgTransparent"
                                                text={translate(addressSelectorError)}
                                                wrapStyle={{ marginBottom: 8 }}
                                            />
                                        ) : null}
                                    </>
                                )}

                                <CustomTextInput
                                    ref={field.ref}
                                    errorMessage={translate(fieldErrors[field.key])}
                                    title={field.showTitle ? translate(field.title) : ""}
                                    titleStyle={styles.titles}
                                    type={"errorBgTransparent"}
                                    containerStyle={styles.inputContainer}
                                    wrapStyle={styles.inputWrap}
                                    underlineColorAndroid="transparent"
                                    value={fieldValues[field.key]}
                                    placeholder={translate(field.placeholder)}
                                    placeholderTextColor="#BCBEC3"
                                    maxLength={field.maxLength || undefined}
                                    returnKeyType={field.returnKeyType}
                                    onSubmitEditing={() => {
                                        if (field.nextRef && field.nextRef.current) {
                                            field.nextRef.current.focus();
                                        }
                                    }}
                                    onChangeText={(e) => onFieldChange(field, e)}
                                    renderOutLeft={field.renderOutLeft ? () => {
                                        return (
                                            <ColumnCenterCenter style={styles.phoneBox}>
                                                <Text style={styles.phoneText}>
                                                    +{window.DefaultConfig?.countryCallingCode}
                                                </Text>
                                            </ColumnCenterCenter>
                                        );
                                    } : null}
                                    keyboardType={field.keyboardType}
                                    textContentType={field.textContentType}
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* 地址選擇彈窗 */}
                    {showAddressModal && (
                        <AddressPicker
                            visible={showAddressModal}
                            provinceData={provinceData}
                            districtData={districtData}
                            townData={townData}
                            selectedProvince={selectedProvince}
                            selectedDistrict={selectedDistrict}
                            selectedTown={selectedTown}
                            loading={addressLoading}
                            onProvinceSelect={onProvinceSelect}
                            onDistrictSelect={onDistrictSelect}
                            onTownSelect={onTownSelect}
                            onConfirm={onAddressConfirm}
                            onClose={onCloseAddressModal}
                        />
                    )}
                </View>

                {/* 設為默認運送地址 */}
                <RowCenterBetween style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>{translate("设为默认地址")}</Text>
                    <TouchableOpacity
                        style={[styles.toggleSwitch, isPrimary && styles.toggleSwitchActive]}
                        onPress={() => {
                            const newIsPrimaryValue = !isPrimary;
                            setIsPrimary(newIsPrimaryValue);

                            // 執行切換動畫
                            Animated.timing(toggleAnimation, {
                                toValue: newIsPrimaryValue ? 1 : 0,
                                duration: 200,
                                useNativeDriver: false,
                            }).start();
                        }}
                    >
                        <Animated.View
                            style={[
                                styles.toggleHandle,
                                {
                                    transform: [
                                        {
                                            translateX: toggleAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 20],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </RowCenterBetween>

                {formType === "add" && (
                    <FilledButton
                        text={translate("提交address")}
                        enable={getSubmitButtonEnable()}
                        onPress={onSubmitAddress}
                    />
                )}

                {formType === "edit" && (
                    <View style={styles.editButtonsContainer}>
                        <FilledButton
                            text={translate("更新")}
                            enable={getSubmitButtonEnable()}
                            onPress={onSubmitAddress}
                        />

                        <FilledButton
                            text={translate("删除")}
                            outlined={true}
                            enable={getDeleteButtonEnable()}
                            wrapStyle={styles.deleteButtonWrap}
                            textStyle={styles.deleteButtonText}
                            onPress={() => {
                                PiwikEventDataHandle("ShipmentFormAccount4");
                                onShowDeleteConfirmModal({
                                    addressId,
                                    shouldPop: true,
                                });
                            }}
                        />
                    </View>
                )}
            </KeyboardAwareScrollView>
        </View>
    );
};

export default PromotionsAddressform;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 6,
    },
    inputContainer: {
        marginTop: 0,
        marginBottom: 16,
    },
    inputWrap: {
        borderRadius: 6,
        borderColor: "#E3E3E8",
        height: 44,
    },
    addressSelector: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 8,
    },
    addressText: {
        fontSize: 14,
        fontWeight: "400",
        maxWidth: "96%"
    },
    editButtonsContainer: {
        // 空樣式，保持結構
    },
    deleteButtonWrap: {
        marginTop: 15,
        borderColor: "#EB2121",
        marginBottom: 40,
    },
    deleteButtonText: {
        color: "#EB2121",
    },
    titles: {
        fontSize: 14,
        fontWeight: "600",
        color: Color.charcoal,
        marginBottom: 8,
        marginTop: 0,
    },
    phoneBox: {
        height: 42,
        width: 46,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#E3E3E8",
        marginRight: 8
    },
    phoneText: {
        fontSize: 14,
        color: "#BCBEC3",
        fontWeight: "400",
    },
    toggleContainer: {
        marginVertical: 16,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: "600",
        color: Color.charcoal,
    },
    toggleSwitch: {
        width: 44,
        height: 24,
        backgroundColor: "#999999",
        borderRadius: 12,
        padding: 2,
        justifyContent: "center",
    },
    toggleSwitchActive: {
        backgroundColor: "#00A6FF",
    },
    toggleHandle: {
        width: 20,
        height: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
    },
});

