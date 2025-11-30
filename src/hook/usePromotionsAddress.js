import { useState, useEffect } from "react";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { Toasts } from "$Toasts";
import { translate } from "@/locales/translate";
import { checkPhone } from "$Utils";
import { useMember } from "./useMember";
import RegMap from "@/locales/Reg";
import { MAX_SHIPPING_ADDRESS_COUNT } from "@/lib/constants";
const StarLengthMap = {
    CN: 6,
    TH: 5,
    VN: 5,
};

/**
 * 促銷地址管理自定義 Hook
 * 
 * 處理促銷地址的數據獲取、排序、刪除和教程顯示邏輯
 * 主要功能：
 * - 獲取地址列表數據
 * - 將默認地址排在最前面
 * - 刪除地址
 * - 顯示刪除確認模態框
 * - 顯示地址卡片教程
 * 
 * @returns {Object} 返回狀態和方法對象
 */
export const usePromotionsAddress = () => {
    const [addressData, setAddressData] = useState([]);
    const { getMemberData } = useMember();

    /**
     * 獲取地址列表數據
     * 
     * 從 API 獲取用戶的地址列表，並自動處理排序
     */
    const getAddress = () => {
        Toasts.loading(translate("加载中,请稍候..."), 99999);
        window.fetchRequest(window.ApiPort.ShippingAddress, "GET")
            .then(res => {
                Toasts.removeAll();
                const { isSuccess = false, result = [] } = res;
                if (isSuccess && Array.isArray(result)) {
                    setAddress(result);
                } else {
                    setAddress([]);
                }
            })
            .catch(_error => {
                Toasts.removeAll();
                setAddress([]);
            });
    };

    /**
     * 設置地址數據並處理排序
     * 
     * 處理流程：
     * 1. 將默認地址排在最前面
     * 2. 更新 state
     * 
     * @param {Array} addressList - 地址數據數組
     */
    const setAddress = (addressList) => {
        let sortedAddressList = [];
        if (Array.isArray(addressList) && addressList.length > 0) {
            // 將默認地址排在最前面
            const primaryAddress = addressList.find(item => item.isPrimary);
            const nonDefaultAddresses = addressList.filter(item => !item.isPrimary);

            if (primaryAddress) {
                sortedAddressList = [primaryAddress, ...nonDefaultAddresses];
            } else {
                sortedAddressList = addressList;
            }
        } else {
            // 如果是空數組，直接設置為空數組
            sortedAddressList = [];
        }

        // 更新 state
        setAddressData(sortedAddressList);
    };

    /**
     * 獲取會員代碼
     * 
     * @returns {string} 會員代碼
     */
    const getMemberCode = () => {
        return getMemberData("memberCode");
    };

    /**
     * 刪除地址
     * 
     * 處理流程：
     * 1. 調用 API 刪除地址
     * 2. 刪除成功後刷新地址列表
     * 3. 發送 Piwik 事件追蹤
     * 
     * @param {Object} deleteParams - 刪除參數對象
     * @param {string} deleteParams.addressId - 要刪除的地址 ID
     * @param {boolean} deleteParams.shouldPop - 是否在刪除後返回上一頁
     */
    const deleteAddress = ({ addressId, shouldPop }) => {
        Toasts.loading(translate("加载中,请稍候..."));
        window.fetchRequest(window.ApiPort.DeleteShippingAddress + `?addressId=${addressId}&`, "DELETE")
            .then(res => {
                Toasts.removeAll();
                let { isSuccess = false, result = false } = res;
                if (isSuccess && result) {
                    // 先更新地址列表，再显示成功提示
                    shouldPop && Actions.pop();
                    getAddress();
                    Toasts.success(translate("地址已删除"), 2, () => {
                        // 在提示消失后再执行页面跳转
                    });

                    if (shouldPop) {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount8",
                            path: "edit_shipping_address",
                            title: "Edit Shipping Address",
                            isSuccess: 2,
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount8",
                            path: "shipping_address",
                            title: "Shipping Address",
                            isSuccess: 2,
                        });
                    }
                } else {
                    let message = res?.errors?.[0]?.description || res?.error_details?.description;
                    Toasts.fail(message || "");

                    if (shouldPop) {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount8",
                            path: "edit_shipping_address",
                            title: "Edit Shipping Address",
                            isSuccess: 1,
                            customProperties: {
                                ShippingAddress_S_DeleteAddress_Confirm_ErrorMsg: message,
                            },
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount8",
                            path: "shipping_address",
                            title: "Shipping Address",
                            isSuccess: 1,
                            customProperties: {
                                ShippingAddress_S_DeleteAddress_Confirm_ErrorMsg: message,
                            },
                        });
                    }
                }
            })
            .catch(error => {
                Toasts.removeAll();
                let message = error?.errors[0]?.message;
                Toasts.fail(message || "");
            });
    };

    /**
     * 顯示刪除確認模態框
     * 
     * 處理流程：
     * 1. 發送 Piwik 事件追蹤（如果不是從編輯頁面返回）
     * 2. 顯示確認刪除的模態框
     * 3. 確認後調用 deleteAddress
     * 
     * @param {Object} deleteParams - 刪除參數對象
     * @param {string} deleteParams.addressId - 要刪除的地址 ID
     * @param {boolean} deleteParams.shouldPop - 是否在刪除後返回上一頁，默認為 false
     */
    const showDeleteConfirmModal = ({ addressId, shouldPop = false }) => {
        if (!shouldPop) {
            PiwikEventDataHandle("ShipmentFormAccount5");
        }
        GetGlobalModal({
            title: translate("温馨提醒address"),
            message: translate("您确认要删除地址吗?"),
            cancelText: translate("保留"),
            onCancel: () => {
                if (shouldPop) {
                    PiwikEventDataHandle({
                        eventTitle: "ShipmentFormAccount9",
                        path: "edit_shipping_address",
                        title: "Edit Shipping Address",
                    });
                } else {
                    PiwikEventDataHandle({
                        eventTitle: "ShipmentFormAccount9",
                        path: "shipping_address",
                        title: "Shipping Address",
                    });
                }
            },
            confirmText: translate("删除"),
            onConfirm: () => {
                deleteAddress({ addressId, shouldPop });
            },
        });
    };

    /**
     * 初始化加載地址列表（只調用一次）
     * 
     * 組件掛載時執行，獲取地址列表
     */
    useEffect(() => {
        getAddress();
    }, []);

    /**
     * 返回 Hook 的狀態和方法
     * 
     * 供組件使用，包括：
     * - 地址數據狀態
     * - 獲取地址方法
     * - 設置地址方法
     * - 刪除地址方法
     * - 顯示刪除確認模態框方法
     * - 獲取會員代碼方法
     * - 常量值
     */
    return {
        // State - 狀態值
        addressData,              // 地址數據列表

        // Methods - 方法
        getAddress,                // 獲取地址列表
        setAddress,                // 設置地址數據（處理排序）
        deleteAddress,             // 刪除地址
        showDeleteConfirmModal,    // 顯示刪除確認模態框
        getMemberCode,             // 獲取會員代碼

        // Constants - 常量
        MaxAddressLength: MAX_SHIPPING_ADDRESS_COUNT,          // 最大地址數量
        StarLengthMap,             // 星號長度映射表
    };
};

// 验证规则对象
const ValidationRules = {
    addressLabel: {
        get regex() {
            return RegMap.ShipAddressLabelReg;
        },
        get maxLength() {
            return window.LANGUAGE == "CN" ? 10 : 15;
        },
        required: true,
        errorMessages: {
            empty: "地址名称不可为空",
            invalid: "地址名称格式错误",
            tooLong: "地址名称不能超过50个字符。"
        }
    },
    recipientName: {
        get regex() {
            return RegMap.ShipUserNameReg;
        },
        get maxLength() {
            return window.LANGUAGE == "CN" ? 10 : 50;
        },
        required: true,
        errorMessages: {
            empty: "收货人名称不可为空",
            invalid: "收货人格式错误",
            tooLong: "姓名不能超过50个字符。"
        }
    },
    phoneNumber: {
        required: true,
        errorMessages: {
            empty: "请输入手机号码。",
            invalid: "手机号码格式无效。"
        }
    },
    address: {
        get regex() {
            return RegMap.AddressReg;
        },
        get maxLength() {
            return window.LANGUAGE == "CN" ? 50 : 100;
        },
        required: true,
        errorMessages: {
            empty: "详细地址不可为空",
            invalid: "详细地址限 50 字内，仅可使用 # ' . , - / & ( ) 特殊字符",
            tooLong: "详细地址不能超过100个字符。"
        }
    },
    zipCode: {
        get regex() {
            return RegMap.ShipZipCodeReg;
        },
        get maxLength() {
            return window.LANGUAGE == "CN" ? 6 : 5;
        },
        required: true,
        errorMessages: {
            empty: "邮政编码不可为空",
            invalid: "邮政编码格式错误",
            tooLong: "邮政编码不能超过6位。"
        }
    }
};

// 验证方法对象
const ValidationMethods = {
    // 验证地址标签
    validateAddressLabel: (value) => {
        const rule = ValidationRules.addressLabel;
        if (!value || value.trim().length === 0) {
            return { isValid: false, error: rule.errorMessages.empty };
        }
        if (value.length > rule.maxLength) {
            return { isValid: false, error: rule.errorMessages.tooLong };
        }
        if (!rule.regex.test(value.trim())) {
            return { isValid: false, error: rule.errorMessages.invalid };
        }
        return { isValid: true, error: "" };
    },

    // 验证收件人姓名
    validateRecipientName: (value) => {
        const rule = ValidationRules.recipientName;
        if (!value || value.trim().length === 0) {
            return { isValid: false, error: rule.errorMessages.empty };
        }
        if (value.length > rule.maxLength) {
            return { isValid: false, error: rule.errorMessages.tooLong };
        }
        if (!rule.regex.test(value.trim())) {
            return { isValid: false, error: rule.errorMessages.invalid };
        }
        return { isValid: true, error: "" };
    },

    // 验证手机号码
    validatePhoneNumber: (value) => {
        const { error } = checkPhone(value);
        return { isValid: !error, error: error };
    },

    // 验证详细地址
    validateAddress: (value) => {
        const rule = ValidationRules.address;
        if (!value || value.trim().length === 0) {
            return { isValid: false, error: rule.errorMessages.empty };
        }
        if (value.length > rule.maxLength) {
            return { isValid: false, error: rule.errorMessages.tooLong };
        }
        if (!rule.regex.test(value.trim())) {
            return { isValid: false, error: rule.errorMessages.invalid };
        }
        return { isValid: true, error: "" };
    },

    // 验证邮政编码
    validateZipCode: (value) => {
        const rule = ValidationRules.zipCode;
        if (!value || value.trim().length === 0) {
            return { isValid: false, error: rule.errorMessages.empty };
        }
        if (value.length > rule.maxLength) {
            return { isValid: false, error: rule.errorMessages.tooLong };
        }
        if (!rule.regex.test(value.trim())) {
            return { isValid: false, error: rule.errorMessages.invalid };
        }
        return { isValid: true, error: "" };
    },

    // 验证地址选择器
    validateAddressSelector: (provinceId, districtId, cityId, townData = [], hasTownDataLoaded = false) => {
        if (!provinceId || !districtId) {
            return { isValid: false, error: "详细地址不可为空" };
        }

        // 如果已经加载了town数据且townData有数据，但cityId为空，则必须选择
        if (hasTownDataLoaded && townData.length > 0 && (cityId === undefined || cityId === null || cityId === "")) {
            return { isValid: false, error: "详细地址不可为空" };
        }

        return { isValid: true, error: "" };
    },

    // 验证所有字段
    validateAllFields: (formData, addressSelectorData) => {
        const results = {
            addressLabel: ValidationMethods.validateAddressLabel(formData.addressLabel),
            recipientName: ValidationMethods.validateRecipientName(formData.recipientName),
            phoneNumber: ValidationMethods.validatePhoneNumber(formData.phoneNumber),
            address: ValidationMethods.validateAddress(formData.address),
            zipCode: ValidationMethods.validateZipCode(formData.zipCode),
            addressSelector: ValidationMethods.validateAddressSelector(
                addressSelectorData.provinceId,
                addressSelectorData.districtId,
                addressSelectorData.cityId,
                addressSelectorData.townData,
                addressSelectorData.hasTownDataLoaded
            )
        };

        const allValid = Object.values(results).every(result => result.isValid);
        const hasErrors = Object.values(results).some(result => !result.isValid);

        return {
            allValid,
            hasErrors,
            results,
            errorCount: Object.values(results).filter(result => !result.isValid).length
        };
    }
};

/**
 * 促銷地址表單自定義 Hook
 * 
 * 處理促銷地址表單的數據管理、驗證和提交邏輯
 * 主要功能：
 * - 表單字段狀態管理
 * - 表單驗證
 * - 地址選擇器數據獲取
 * - 提交地址表單
 * 
 * @param {Object} formParams - Hook 參數對象
 * @param {string} formParams.formType - 表單類型 ("add" | "edit")
 * @param {Object} formParams.editAddressData - 編輯模式下的地址數據
 * @param {boolean} formParams.isPrimary - 是否為默認地址，默認為 false
 * @param {Function} formParams.onGetAddressList - 獲取地址列表的回調函數
 * @returns {Object} 返回狀態和方法對象
 */
export const usePromotionsAddressForm = ({ formType, editAddressData, initialIsPrimary = false, onGetAddressList }) => {
    // 表單字段狀態
    const [addressLabel, setAddressLabel] = useState("");
    const [addressLabelError, setAddressLabelError] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientNameError, setRecipientNameError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [zipCodeError, setZipCodeError] = useState("");
    const [addressSelectorError, setAddressSelectorError] = useState("");
    const [isPrimary, setIsPrimary] = useState(initialIsPrimary);

    // 地址 ID（編輯模式）
    const [addressId, setAddressId] = useState(0);

    // 地址選擇器狀態
    const [provinceId, setProvinceId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [cityId, setCityId] = useState("");
    const [provinceData, setProvinceData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [townData, setTownData] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedTown, setSelectedTown] = useState("");
    const [addressLoading, setAddressLoading] = useState(false);
    const [hasTownDataLoaded, setHasTownDataLoaded] = useState(false);

    // 手機號碼最大長度
    const [prefixesMaxLength, setPrefixesMaxLength] = useState(window.LANGUAGE == "CN" ? 11 : 9);

    /**
     * 設置地址數據（編輯模式）
     */
    const setAddressFormData = () => {
        if (formType === "edit" && editAddressData) {
            const {
                provinceId: pId = "",
                districtId: dId = "",
                cityId: cId = "",
                province = "",
                district = "",
                city = "",
                address: addr = "",
                isPrimary: primary = false,
                recipientName: name = "",
                phoneNumber: phone = "",
                zipCode: zip = "",
                addressId: id = 0,
                addressLabel: label = "",
            } = editAddressData;

            setAddress(addr);
            setIsPrimary(primary);
            setRecipientName(name);
            setPhoneNumber(phone?.includes("-") ? phone.split("-")[1] : phone);
            setZipCode(zip);
            setAddressId(id);
            setProvinceId(pId);
            setDistrictId(dId);
            setCityId(cId);
            setSelectedProvince(province);
            setSelectedDistrict(district);
            setSelectedTown(city);
            setAddressLabel(label);

            // 編輯模式時，需要加載對應的市區和區縣數據
            if (pId) {
                getDistrictData(pId);
            }
            if (dId) {
                getTownData(dId);
            }
        }
    };

    /**
     * 獲取省份數據
     */
    const getProvinceData = () => {
        setProvinceData([]);
        setAddressLoading(true);

        window
            .fetchRequest(window.ApiPort.AddressProvince, "GET")
            .then((res) => {
                if (res.result) {
                    let provinceData = res.result.map((item) => ({
                        ...item,
                        value: item.name,
                        label: item.name,
                    }));
                    setProvinceData(provinceData);
                    setAddressLoading(false);
                } else {
                    setAddressLoading(false);
                }
            })
            .catch((_error) => {
                setAddressLoading(false);
            });
    };

    /**
     * 獲取城市數據
     * 
     * @param {string|number} selectedProvinceId - 選中的省份 ID
     */
    const getDistrictData = (selectedProvinceId) => {
        setDistrictData([]);
        setTownData([]);
        setAddressLoading(true);

        window
            .fetchRequest(window.ApiPort.AddressDistrict + "id=" + selectedProvinceId + "&", "GET")
            .then((res) => {
                if (res.result) {
                    let districtData = res.result.map((item) => ({
                        ...item,
                        value: item.name,
                        label: item.name,
                    }));
                    setDistrictData(districtData);
                    setAddressLoading(false);
                } else {
                    setAddressLoading(false);
                }
            })
            .catch((_error) => {
                setAddressLoading(false);
            });
    };

    /**
     * 獲取區縣數據
     * 
     * @param {string|number} selectedDistrictId - 選中的城市 ID
     */
    const getTownData = (selectedDistrictId) => {
        setTownData([]);
        setAddressLoading(true);
        setHasTownDataLoaded(false);

        window
            .fetchRequest(window.ApiPort.AddressTown + "id=" + selectedDistrictId + "&", "GET")
            .then((res) => {
                if (res.result && res.result.length > 0) {
                    let townData = res.result.map((item) => ({
                        ...item,
                        value: item.name,
                        label: item.name,
                    }));
                    setTownData(townData);
                    setAddressLoading(false);
                    setHasTownDataLoaded(true);
                } else {
                    setAddressLoading(false);
                    setHasTownDataLoaded(true);
                }
            })
            .catch((_error) => {
                setAddressLoading(false);
                setHasTownDataLoaded(true);
            });
    };

    /**
     * Promise 版本的獲取城市數據
     * 
     * @param {string|number} selectedProvinceId - 選中的省份 ID
     * @returns {Promise} 返回 Promise 對象
     */
    const getDistrictDataPromise = (selectedProvinceId) => {
        setDistrictData([]);
        setTownData([]);
        setAddressLoading(true);

        return window
            .fetchRequest(window.ApiPort.AddressDistrict + "id=" + selectedProvinceId + "&", "GET")
            .then((res) => {
                if (res.result) {
                    let districtData = res.result.map((item) => ({
                        ...item,
                        value: item.name,
                        label: item.name,
                    }));
                    setDistrictData(districtData);
                    setAddressLoading(false);
                } else {
                    setAddressLoading(false);
                }
                return res;
            })
            .catch((error) => {
                setAddressLoading(false);
                throw error;
            });
    };

    /**
     * 處理地址選擇確認
     * 
     * @param {Object} _selectedData - 選中的地址數據（未使用）
     */
    const onAddressConfirm = (_selectedData) => {
        setShowAddressModal(false);
        setAddressSelectorError("");
    };

    /**
     * 預加載區縣數據（用於編輯模式，不觸發確認）
     * 
     * @param {string|number} selectedDistrictId - 選中的城市 ID
     * @returns {Promise} 返回 Promise 對象
     */
    const preloadTownDataPromise = (selectedDistrictId) => {
        setTownData([]);
        setAddressLoading(true);
        setHasTownDataLoaded(false);

        return window
            .fetchRequest(window.ApiPort.AddressTown + "id=" + selectedDistrictId + "&", "GET")
            .then((res) => {
                if (res.result && res.result.length > 0) {
                    let townData = res.result.map((item) => ({
                        ...item,
                        value: item.name,
                        label: item.name,
                    }));
                    setTownData(townData);
                    setAddressLoading(false);
                    setHasTownDataLoaded(true);
                } else {
                    setAddressLoading(false);
                    setHasTownDataLoaded(true);
                }
                return res;
            })
            .catch((error) => {
                setAddressLoading(false);
                setHasTownDataLoaded(true);
                throw error;
            });
    };

    /**
     * 處理省份選擇
     * 
     * @param {Object} selectedProvinceItem - 選中的省份對象
     * @param {string} selectedProvinceItem.name - 省份名稱
     * @param {string|number} selectedProvinceItem.id - 省份 ID
     */
    const onProvinceSelect = (selectedProvinceItem) => {
        setSelectedProvince(selectedProvinceItem.name);
        setProvinceId(selectedProvinceItem.id);
        setSelectedDistrict("");
        setSelectedTown("");
        setDistrictId("");
        setCityId("");
        getDistrictData(selectedProvinceItem.id);
    };

    /**
     * 處理城市選擇
     * 
     * @param {Object} selectedDistrictItem - 選中的城市對象
     * @param {string} selectedDistrictItem.name - 城市名稱
     * @param {string|number} selectedDistrictItem.id - 城市 ID
     */
    const onDistrictSelect = (selectedDistrictItem) => {
        setSelectedDistrict(selectedDistrictItem.name);
        setDistrictId(selectedDistrictItem.id);
        setSelectedTown("");
        setCityId("");
        getTownData(selectedDistrictItem.id);
    };

    /**
     * 處理區縣選擇
     * 
     * @param {Object} selectedTownItem - 選中的區縣對象
     * @param {string} selectedTownItem.name - 區縣名稱
     * @param {string|number} selectedTownItem.id - 區縣 ID
     */
    const onTownSelect = (selectedTownItem) => {
        setSelectedTown(selectedTownItem.name);
        setCityId(selectedTownItem.id);
    };


    /**
     * 顯示地址選擇彈窗
     */
    const onOpenAddressModal = async () => {
        const loadPromises = [];

        if (provinceId && districtData.length === 0) {
            loadPromises.push(getDistrictDataPromise(provinceId));
        }
        if (districtId && townData.length === 0) {
            loadPromises.push(preloadTownDataPromise(districtId));
        }

        if (loadPromises.length > 0) {
            await Promise.all(loadPromises);
        }

        setShowAddressModal(true);
    };

    /**
     * 關閉地址選擇彈窗
     */
    const onCloseAddressModal = () => {
        const addressValidation = ValidationMethods.validateAddressSelector(
            provinceId,
            districtId,
            cityId,
            townData,
            hasTownDataLoaded
        );

        setShowAddressModal(false);
        setAddressSelectorError(addressValidation.error);
    };

    /**
     * 統一的驗證處理方法
     * 
     * @param {string} fieldKey - 字段鍵名
     * @param {string} fieldValue - 字段值
     * @returns {boolean} 驗證是否通過
     */
    const validateField = (fieldKey, fieldValue) => {
        const validationMap = {
            addressLabel: ValidationMethods.validateAddressLabel,
            recipientName: ValidationMethods.validateRecipientName,
            phoneNumber: ValidationMethods.validatePhoneNumber,
            address: ValidationMethods.validateAddress,
            zipCode: ValidationMethods.validateZipCode
        };

        const validator = validationMap[fieldKey];
        if (validator) {
            const validationResult = validator(fieldValue);
            const setterMap = {
                addressLabel: setAddressLabelError,
                recipientName: setRecipientNameError,
                phoneNumber: setPhoneNumberError,
                address: setAddressError,
                zipCode: setZipCodeError
            };
            const errorSetter = setterMap[fieldKey];
            if (errorSetter) {
                errorSetter(validationResult.error);
            }
            return validationResult.isValid;
        }
        return true;
    };

    /**
     * 處理手機號碼變更
     * 
     * @param {string} phoneValue - 手機號碼值
     */
    const onPhoneNumberChange = (phoneValue) => {
        const cleanedPhoneValue = phoneValue.replace(/[^0-9]/g, "").trim();
        setPhoneNumber(cleanedPhoneValue);
        const { error: phoneError = "", prefixesMaxLength: maxLength } = checkPhone(cleanedPhoneValue);
        setPhoneNumberError(phoneError);
        setPrefixesMaxLength(maxLength);
    };

    /**
     * 處理字段變更（通用處理函數）
     * 
     * @param {Object} fieldConfig - 字段配置對象
     * @param {string} fieldConfig.key - 字段鍵名
     * @param {Function} fieldConfig.onChangeText - 字段值轉換函數
     * @param {Function} fieldConfig.validation - 字段驗證函數
     * @param {string} fieldConfig.specialHandling - 特殊處理標識（如 "phone"）
     * @param {string} rawInputValue - 原始輸入值
     */
    const onFieldChange = (fieldConfig, rawInputValue) => {
        // 應用字段的 onChangeText 轉換
        const processedValue = fieldConfig.onChangeText ? fieldConfig.onChangeText(rawInputValue) : rawInputValue;

        // 特殊處理手機號碼
        if (fieldConfig.specialHandling === "phone") {
            onPhoneNumberChange(processedValue);
            return;
        }

        // 使用映射對象更新字段值
        const setterMap = {
            addressLabel: setAddressLabel,
            recipientName: setRecipientName,
            address: setAddress,
            zipCode: setZipCode,
        };

        const fieldSetter = setterMap[fieldConfig.key];
        if (fieldSetter) {
            fieldSetter(processedValue);
        }

        // 驗證字段
        if (fieldConfig.validation) {
            validateField(fieldConfig.key, processedValue);
        }
    };

    /**
     * 提交地址表單
     */
    const onSubmitAddress = () => {
        let postData = {
            addressLabel: addressLabel.trim(),
            recipientName: recipientName.trim(),
            zipCode: zipCode.trim(),
            phoneNumber: window.DefaultConfig?.countryCallingCode + "-" + phoneNumber.trim(),
            provinceId: provinceId || 0,
            districtId: districtId || 0,
            cityId: cityId || 0,
            address: address.trim(),
            isPrimary: isPrimary,
        };

        if (formType === "edit") {
            postData.addressId = addressId;
        }

        Toasts.loading(translate("加载中,请稍候..."), 99999);
        const httpMethod = formType === "add" ? "POST" : "PUT";
        window.fetchRequest(window.ApiPort.ShippingAddress, httpMethod, postData)
            .then((res) => {
                Toasts.removeAll();
                let { isSuccess = false, result = false } = res;
                if (isSuccess && result) {
                    Actions.pop();
                    Toasts.success(
                        formType === "add" ? translate("新增成功") : translate("地址更新成功"),
                        2,
                        () => {
                            onGetAddressList && onGetAddressList();
                        }
                    );

                    if (formType === "add") {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount3",
                            isSuccess: 2,
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount7",
                            isSuccess: 2,
                        });
                    }
                } else {
                    let errorDescription = res?.errors?.[0]?.description || res?.error_details?.description;
                    Toasts.fail(errorDescription || "");
                    if (formType === "add") {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount3",
                            isSuccess: 1,
                            customProperties: {
                                ShippingAddress_S_NewAddress_ErrorMsg: errorDescription,
                            },
                        });
                    } else {
                        PiwikEventDataHandle({
                            eventTitle: "ShipmentFormAccount7",
                            isSuccess: 1,
                            customProperties: {
                                ShippingAddress_Edit_S_UpdateAddress_ErrorMsg: errorDescription,
                            },
                        });
                    }
                }
            })
            .catch((_error) => {
                Toasts.removeAll();
            });
    };

    /**
     * 檢查表單是否有變更（編輯模式）
     * 
     * @returns {boolean} 表單內容是否有變更
     */
    const hasContentChanged = () => {
        if (formType === "edit" && editAddressData) {
            const originalPhoneNumber = editAddressData.phoneNumber?.includes("-")
                ? editAddressData.phoneNumber.split("-")[1]
                : editAddressData.phoneNumber || "";

            return (
                addressLabel !== (editAddressData.addressLabel || "") ||
                recipientName !== (editAddressData.recipientName || "") ||
                phoneNumber !== originalPhoneNumber ||
                address !== (editAddressData.address || "") ||
                zipCode !== (editAddressData.zipCode || "") ||
                provinceId !== (editAddressData.provinceId || "") ||
                districtId !== (editAddressData.districtId || "") ||
                cityId !== (editAddressData.cityId || "") ||
                isPrimary !== (editAddressData.isPrimary || false)
            );
        }
        return true;
    };

    /**
     * 獲取表單驗證結果
     * 
     * @returns {Object} 驗證結果對象
     */
    const getValidationResult = () => {
        const formData = {
            addressLabel,
            recipientName,
            zipCode,
            phoneNumber,
            address
        };

        const addressSelectorData = {
            provinceId,
            districtId,
            cityId,
            townData,
            hasTownDataLoaded
        };

        return ValidationMethods.validateAllFields(formData, addressSelectorData);
    };

    /**
     * 獲取提交按鈕的 enable 狀態
     * 
     * @returns {boolean} 是否啟用提交按鈕
     */
    const getSubmitButtonEnable = () => {
        const validationResult = getValidationResult();
        const isAllFieldsValid = validationResult.allValid;

        // 判斷地址選擇是否完整
        let addressSelectorValid = provinceId && districtId;
        if (townData.length > 0) {
            addressSelectorValid = addressSelectorValid && (cityId !== undefined && cityId !== null && cityId !== "");
        }

        const formData = {
            addressLabel,
            recipientName,
            zipCode,
            phoneNumber,
            address
        };

        const isAllFieldsFilled = Object.values(formData).every(value => value.trim() !== "") && addressSelectorValid;

        if (formType === "add") {
            return isAllFieldsValid && isAllFieldsFilled;
        } else {
            // edit 模式需要檢查內容是否有變更
            const hasChanged = hasContentChanged();
            return isAllFieldsValid && isAllFieldsFilled && hasChanged;
        }
    };

    /**
     * 獲取刪除按鈕的 enable 狀態
     * 
     * @returns {boolean} 是否啟用刪除按鈕
     */
    const getDeleteButtonEnable = () => {
        // 判斷地址選擇是否完整
        let addressSelectorValid = provinceId && districtId;
        if (townData.length > 0) {
            addressSelectorValid = addressSelectorValid && (cityId !== undefined && cityId !== null && cityId !== "");
        }

        const formData = {
            addressLabel,
            recipientName,
            zipCode,
            phoneNumber,
            address
        };

        return Object.values(formData).every(value => value.trim() !== "") && addressSelectorValid;
    };

    /**
     * 字段值映射對象
     */
    const fieldValues = {
        addressLabel,
        recipientName,
        phoneNumber,
        address,
        zipCode,
    };

    /**
     * 字段錯誤映射對象
     */
    const fieldErrors = {
        addressLabel: addressLabelError,
        recipientName: recipientNameError,
        phoneNumber: phoneNumberError,
        address: addressError,
        zipCode: zipCodeError,
    };

    /**
     * 獲取字段配置對象
     * 
     * @param {Object} inputRefs - 輸入框 refs 對象
     * @param {Object} inputRefs.addressLabelRef - 地址標籤輸入框 ref
     * @param {Object} inputRefs.recipientNameRef - 收件人輸入框 ref
     * @param {Object} inputRefs.phoneNumberRef - 手機號碼輸入框 ref
     * @param {Object} inputRefs.addressRef - 詳細地址輸入框 ref
     * @param {Object} inputRefs.zipCodeRef - 郵政編碼輸入框 ref
     * @returns {Array} 字段配置數組
     */
    const getFieldConfigs = (inputRefs) => {
        const {
            addressLabelRef,
            recipientNameRef,
            phoneNumberRef,
            addressRef,
            zipCodeRef
        } = inputRefs;

        return [
            {
                key: "addressLabel",
                ref: addressLabelRef,
                title: "地址名称",
                placeholder: "请输入地址名称，例如：我家",
                get maxLength() {
                    return window.LANGUAGE == "CN" ? 10 : 15;
                },
                returnKeyType: "next",
                nextRef: recipientNameRef,
                validation: ValidationMethods.validateAddressLabel,
                onChangeText: (e) => e.trimLeft().replace(/\s+/g, " "),
                showTitle: true
            },
            {
                key: "recipientName",
                ref: recipientNameRef,
                title: "收货人",
                placeholder: "请输入收货人姓名",
                get maxLength() {
                    return window.LANGUAGE == "CN" ? 10 : 50;
                },
                returnKeyType: "next",
                nextRef: phoneNumberRef,
                validation: ValidationMethods.validateRecipientName,
                onChangeText: (e) => e.trimLeft().replace(/\s+/g, " "),
                showTitle: true
            },
            {
                key: "phoneNumber",
                ref: phoneNumberRef,
                title: "手机号码address",
                placeholder: "请输入手机号码",
                maxLength: prefixesMaxLength,
                returnKeyType: "next",
                nextRef: addressRef,
                keyboardType: "phone-pad",
                textContentType: "username",
                renderOutLeft: true,
                validation: ValidationMethods.validatePhoneNumber,
                onChangeText: (e) => e.replace(/[^0-9]/g, "").trim(),
                showTitle: true,
                specialHandling: "phone"
            },
            {
                key: "address",
                ref: addressRef,
                title: "详细地址",
                placeholder: "小区楼栋 / 乡村名称",
                get maxLength() {
                    return window.LANGUAGE == "CN" ? 50 : 100;
                },
                returnKeyType: "next",
                nextRef: zipCodeRef,
                textContentType: "username",
                validation: ValidationMethods.validateAddress,
                onChangeText: (e) => e.trimLeft().replace(/\s+/g, " "),
                showTitle: false
            },
            {
                key: "zipCode",
                ref: zipCodeRef,
                title: "邮政编码",
                placeholder: "邮政编码不可为空",
                get maxLength() {
                    return window.LANGUAGE == "CN" ? 6 : 5;
                },
                returnKeyType: "done",
                keyboardType: "number-pad",
                textContentType: "username",
                validation: ValidationMethods.validateZipCode,
                onChangeText: (e) => e.replace(/[^0-9]/g, "").trim(),
                showTitle: true
            }
        ];
    };

    /**
     * 初始化加載數據
     */
    useEffect(() => {
        setAddressFormData();
        getProvinceData();
    }, []);

    return {
        // Form State - 表單狀態
        addressLabel,
        addressLabelError,
        recipientName,
        recipientNameError,
        phoneNumber,
        phoneNumberError,
        address,
        addressError,
        zipCode,
        zipCodeError,
        addressSelectorError,
        isPrimary,
        addressId,
        prefixesMaxLength,

        // Address Selector State - 地址選擇器狀態
        provinceId,
        districtId,
        cityId,
        provinceData,
        districtData,
        townData,
        showAddressModal,
        selectedProvince,
        selectedDistrict,
        selectedTown,
        addressLoading,
        hasTownDataLoaded,

        // Methods - 方法
        setIsPrimary,
        onFieldChange,                 // 處理字段變更（通用函數）
        onSubmitAddress,               // 提交地址表單
        hasContentChanged,             // 檢查表單是否有變更
        getValidationResult,          // 獲取表單驗證結果

        // Address Selector Methods - 地址選擇器方法
        onProvinceSelect,              // 處理省份選擇
        onDistrictSelect,              // 處理城市選擇
        onTownSelect,                  // 處理區縣選擇
        onAddressConfirm,              // 處理地址選擇確認
        onOpenAddressModal,            // 顯示地址選擇彈窗
        onCloseAddressModal,           // 關閉地址選擇彈窗

        // Validation Methods - 驗證方法
        ValidationMethods,             // 驗證方法對象
        ValidationRules,               // 驗證規則對象

        // Field Config - 字段配置
        getFieldConfigs,               // 獲取字段配置對象
        fieldValues,                   // 字段值映射對象
        fieldErrors,                   // 字段錯誤映射對象

        // Button Enable - 按鈕啟用狀態
        getSubmitButtonEnable,         // 獲取提交按鈕的 enable 狀態
        getDeleteButtonEnable,         // 獲取刪除按鈕的 enable 狀態
    };
};

/**
 * 地址選擇器自定義 Hook
 * 
 * 處理地址選擇器的狀態管理和選擇邏輯（不包含動畫邏輯，動畫由組件處理）
 * 主要功能：
 * - 管理選擇步驟（省、市、區）
 * - 處理選擇邏輯
 * 
 * @param {Object} pickerParams - Hook 參數對象
 * @param {string} pickerParams.selectedProvince - 已選中的省份名稱
 * @param {string} pickerParams.selectedDistrict - 已選中的城市名稱
 * @param {string} pickerParams.selectedTown - 已選中的區縣名稱
 * @param {Function} pickerParams.onProvinceSelect - 省份選擇回調
 * @param {Function} pickerParams.onDistrictSelect - 城市選擇回調
 * @param {Function} pickerParams.onTownSelect - 區縣選擇回調
 * @param {Function} pickerParams.onConfirm - 確認回調
 * @param {Function} pickerParams.onClose - 關閉回調
 * @returns {Object} 返回狀態和方法對象
 */
export const useAddressPicker = ({
    selectedProvince: initialSelectedProvince = "",
    selectedDistrict: initialSelectedDistrict = "",
    selectedTown: initialSelectedTown = "",
    onProvinceSelect,
    onDistrictSelect,
    onTownSelect,
    onConfirm,
    onClose,
}) => {
    // 當前步驟狀態
    const [currentStep, setCurrentStep] = useState("province");

    // 選擇狀態
    const [selectedProvince, setSelectedProvince] = useState(initialSelectedProvince);
    const [selectedDistrict, setSelectedDistrict] = useState(initialSelectedDistrict);
    const [selectedTown, setSelectedTown] = useState(initialSelectedTown);

    /**
     * 初始化狀態
     * 根據已選擇的項目確定當前步驟
     */
    const initializeState = () => {
        let step = "province";
        if (initialSelectedProvince && initialSelectedDistrict && initialSelectedTown) {
            // 如果已經選擇了完整的省、市、區，顯示區縣選擇界面
            step = "town";
        } else if (initialSelectedProvince && initialSelectedDistrict) {
            // 如果已經選擇了省、市，顯示區縣選擇界面
            step = "town";
        } else if (initialSelectedProvince) {
            // 如果已經選擇了省，顯示市區選擇界面
            step = "district";
        } else {
            // 第一次打開，沒有任何選擇，從省份開始
            step = "province";
        }

        setCurrentStep(step);
        setSelectedProvince(initialSelectedProvince || "");
        setSelectedDistrict(initialSelectedDistrict || "");
        setSelectedTown(initialSelectedTown || "");
    };

    /**
     * 處理省份選擇
     * 
     * @param {Object} selectedProvinceItem - 選中的省份對象
     * @param {string} selectedProvinceItem.name - 省份名稱
     * @param {string|number} selectedProvinceItem.id - 省份 ID
     */
    const onHandleProvinceSelect = (selectedProvinceItem) => {
        setSelectedProvince(selectedProvinceItem.name);
        setCurrentStep("district");
        setSelectedDistrict("");
        setSelectedTown("");
        onProvinceSelect && onProvinceSelect(selectedProvinceItem);
    };

    /**
     * 處理城市選擇
     * 
     * @param {Object} selectedDistrictItem - 選中的城市對象
     * @param {string} selectedDistrictItem.name - 城市名稱
     * @param {string|number} selectedDistrictItem.id - 城市 ID
     */
    const onHandleDistrictSelect = (selectedDistrictItem) => {
        setSelectedDistrict(selectedDistrictItem.name);
        setCurrentStep("town");
        setSelectedTown("");
        onDistrictSelect && onDistrictSelect(selectedDistrictItem);
    };

    /**
     * 處理區縣選擇
     * 
     * @param {Object} selectedTownItem - 選中的區縣對象
     * @param {string} selectedTownItem.name - 區縣名稱
     * @param {string|number} selectedTownItem.id - 區縣 ID
     */
    const onHandleTownSelect = (selectedTownItem) => {
        setSelectedTown(selectedTownItem.name);
        onTownSelect && onTownSelect(selectedTownItem);
        // 選擇區縣後自動確認並關閉
        onHandleConfirm();
    };

    /**
     * 處理沒有區縣數據的情況
     */
    const onHandleEmptyTownSelect = () => {
        const emptyItem = { id: 0, name: "" };
        setSelectedTown("");
        onTownSelect && onTownSelect(emptyItem);
        // 自動確認並關閉
        onHandleConfirm();
    };

    /**
     * 處理確認
     */
    const onHandleConfirm = () => {
        onConfirm && onConfirm({
            province: selectedProvince,
            district: selectedDistrict,
            town: selectedTown,
        });
    };

    /**
     * 處理關閉
     */
    const onHandleClose = () => {
        onClose && onClose();
    };

    /**
     * 回到上一步
     * 
     * @param {string} targetStep - 目標步驟 ("province" | "district" | "town")
     */
    const onGoBackToStep = (targetStep) => {
        setCurrentStep(targetStep);
    };

    /**
     * 獲取當前數據
     * 
     * @param {Array} provinceDataList - 省份數據列表
     * @param {Array} districtDataList - 城市數據列表
     * @param {Array} townDataList - 區縣數據列表
     * @returns {Array} 當前步驟對應的數據列表
     */
    const getCurrentData = (provinceDataList, districtDataList, townDataList) => {
        switch (currentStep) {
            case "province":
                return provinceDataList || [];
            case "district":
                return districtDataList || [];
            case "town":
                return townDataList || [];
            default:
                return provinceDataList || [];
        }
    };

    /**
     * 獲取當前選中項
     * 
     * @returns {string} 當前步驟對應的選中項名稱
     */
    const getCurrentSelected = () => {
        switch (currentStep) {
            case "province":
                return selectedProvince;
            case "district":
                return selectedDistrict;
            case "town":
                return selectedTown;
            default:
                return "";
        }
    };

    /**
     * 處理項目選擇
     * 
     * @param {Object} selectedItem - 選中的項目對象
     */
    const onHandleItemSelect = (selectedItem) => {
        switch (currentStep) {
            case "province":
                onHandleProvinceSelect(selectedItem);
                break;
            case "district":
                onHandleDistrictSelect(selectedItem);
                break;
            case "town":
                onHandleTownSelect(selectedItem);
                break;
        }
    };

    // 初始化狀態
    useEffect(() => {
        initializeState();
    }, []);

    // 當 props 變化時，重新初始化狀態
    useEffect(() => {
        initializeState();
    }, [initialSelectedProvince, initialSelectedDistrict, initialSelectedTown]);

    return {
        // State - 狀態值
        currentStep,              // 當前步驟
        selectedProvince,         // 選中的省份
        selectedDistrict,         // 選中的城市
        selectedTown,             // 選中的區縣

        // Methods - 方法
        onHandleProvinceSelect,   // 處理省份選擇
        onHandleDistrictSelect,   // 處理城市選擇
        onHandleTownSelect,       // 處理區縣選擇
        onHandleEmptyTownSelect,  // 處理空區縣選擇
        onHandleConfirm,          // 處理確認
        onHandleClose,            // 處理關閉
        onGoBackToStep,           // 回到上一步
        getCurrentData,            // 獲取當前數據
        getCurrentSelected,       // 獲取當前選中項
        onHandleItemSelect,       // 處理項目選擇
    };
};

