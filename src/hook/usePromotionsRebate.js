import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetRebateList } from "@/actions/CmsApi";
import { roundUpToTwoDecimals, getMoneyFormat, FormatDate } from "$Utils";
import { translate } from "@/locales/translate";
import { Decimal } from "decimal.js";

/**
 * 初始化日期範圍
 * 獲取當前日期（UTC+8 時區）
 * 
 * @returns {string} 格式化的日期字符串 (YYYY-MM-DD)
 */
const getInitialDate = () => moment(new Date()).utcOffset(8).format("YYYY-MM-DD");

/**
 * 返水記錄自定義 Hook
 * 
 * 處理返水記錄的數據獲取、過濾和展示邏輯
 * 主要功能：
 * - 獲取返水列表數據
 * - 計算返水總金額
 * - 計算類別的總投注金額和總返水金額
 * - 處理產品類別過濾
 * - 處理日期範圍選擇
 * - 導航到返水記錄詳情頁
 * 
 * @param {Object} params - Hook 參數
 * @param {Object} params.navigation - 導航對象，包含 RecordDetail 方法，用於頁面跳轉
 * @param {Array} params.categories - 產品類別列表
 * @param {boolean} params.sportSB - 是否為體育 SB（用於自動過濾）
 * @returns {Object} 返回狀態和方法對象
 */
export const usePromotionsRebate = ({ navigation, categories, sportSB }) => {
    // 當前選擇的開始日期（默認為今天）
    const [dateFrom, setDateFrom] = useState(getInitialDate());

    // 當前選擇的結束日期（默認為今天）
    const [dateTo, setDateTo] = useState(getInitialDate());

    // 返水記錄數據列表（格式化後的數據）
    const [rebateData, setRebateData] = useState("");

    // 原始返水記錄數據（保存原始數據，用於過濾恢復）
    const [originalRebateData, setOriginalRebateData] = useState("");

    // 總返水金額
    const [rebateTotal, setRebateTotal] = useState(0);

    // 當前選擇的產品類別過濾代碼（用於在日期變更後重新應用過濾）
    // 使用 useRef 確保 getRebateList 能訪問到最新值
    const selectedPromoCatCodeRef = useRef("");

    /**
     * 計算返水數據的總返水金額
     * 
     * 遍歷所有類別和返水項目，累加總返水金額
     * 
     * @param {Array} rebateDataList - 返水數據列表
     * @returns {number} 總返水金額（保留兩位小數）
     */
    const calculateRebateTotal = (rebateDataList) => {
        if (!rebateDataList || rebateDataList.length === 0) {
            return 0;
        }

        const total = rebateDataList.reduce((sum, category) => {
            const { data = [] } = category;
            const categoryTotal = data.reduce((categorySum, rebateItem) => {
                const { totalGivenAmount = 0 } = rebateItem;
                return categorySum + Number(totalGivenAmount);
            }, 0);
            return sum + categoryTotal;
        }, 0);

        return roundUpToTwoDecimals(total);
    };

    /**
     * 更新返水數據和總金額
     * 
     * 計算總返水金額並更新狀態
     * 
     * @param {Array} rebateDataList - 返水數據列表
     */
    const updateRebateData = (rebateDataList) => {
        const totalRebate = calculateRebateTotal(rebateDataList);
        setRebateData(rebateDataList);
        setRebateTotal(totalRebate);
    };

    /**
     * 計算類別的總投注金額和總返水金額
     * 
     * 計算指定返水詳情列表的總投注金額和總返水金額
     * 
     * @param {Array} rebateDetails - 返水詳情列表
     * @returns {Object} 包含 totalBetAmount 和 totalRebateAmount 的對象
     */
    const calculateCategoryAmounts = (rebateDetails) => {
        if (!rebateDetails || rebateDetails.length === 0) {
            return { totalBetAmount: "0", totalRebateAmount: "0" };
        }

        // 計算總投注金額（使用 Decimal 確保精度）
        const totalBetAmount = new Decimal(
            rebateDetails.reduce((sum, rebate) => {
                const { totalBetAmount: betAmount = 0 } = rebate;
                return sum + betAmount;
            }, 0)
        ).toFixed(2);

        // 計算總返水金額
        const totalRebateAmount = roundUpToTwoDecimals(
            rebateDetails.reduce((sum, rebate) => {
                const { totalGivenAmount: givenAmount = 0 } = rebate;
                return sum + givenAmount;
            }, 0)
        );

        return {
            totalBetAmount: totalBetAmount === "0" ? "0" : totalBetAmount,
            totalRebateAmount: totalRebateAmount === 0 ? "0" : totalRebateAmount.toString(),
        };
    };

    /**
     * 獲取返水列表數據
     * 
     * 從 API 獲取返水列表，並將數據分配到對應的產品類別
     * 處理流程：
     * 1. 清空當前數據
     * 2. 調用 API 獲取返水列表
     * 3. 將返水數據分配到對應的產品類別
     * 4. 過濾出有數據的類別
     * 5. 保存原始數據並更新顯示數據
     * 6. 如果是體育 SB，自動過濾
     * 7. 保存到 localStorage
     */
    const getRebateList = async () => {
        // 清空當前數據
        setRebateData("");
        setOriginalRebateData("");

        const params = {
            startDate: dateFrom,
            endDate: dateTo,
        };

        try {
            const res = await GetRebateList(params);
            const { result = [] } = res || {};

            // 為每個 category 分配對應的返水數據，不直接修改 props
            const categoriesWithData = categories.map(category => {
                const { PromoCatCode } = category;
                const categoryRebateData = result.filter(rebateItem => {
                    const { promotionCategory } = rebateItem;
                    return promotionCategory === PromoCatCode;
                });
                return {
                    ...category,
                    data: categoryRebateData,
                };
            });

            // 過濾出有數據的類別
            const rebateListWithData = categoriesWithData.filter(category => {
                const { data = [] } = category;
                return data && data.length > 0;
            });

            // 保存原始數據
            setOriginalRebateData(rebateListWithData);

            // 先處理體育 SB 的自動過濾
            let finalData = rebateListWithData;
            if (sportSB && rebateListWithData.length > 0) {
                // 直接過濾數據，不調用函數（避免循環依賴）
                finalData = rebateListWithData.filter(category => {
                    const { PromoCatCode = "" } = category;
                    return PromoCatCode && PromoCatCode.toLowerCase().includes("sports");
                });
            }

            // 如果有選擇的產品類別過濾，應用過濾
            if (selectedPromoCatCodeRef.current && finalData.length > 0) {
                finalData = finalData.filter(category => {
                    const { PromoCatCode = "" } = category;
                    return PromoCatCode && PromoCatCode.toLowerCase().includes(selectedPromoCatCodeRef.current.toLowerCase());
                });
            }

            // 更新顯示數據和總金額
            updateRebateData(finalData);

        } catch (error) {
            console.error("獲取返水列表失敗:", error);
            setRebateData([]);
            setOriginalRebateData([]);
            setRebateTotal(0);
        }
    };

    /**
     * 產品類別過濾處理
     * 
     * 根據選擇的產品類別代碼過濾返水數據
     * 
     * @param {string} promoCatCode - 產品類別代碼（可選，空字符串表示顯示所有）
     */
    const onProductCategoryFilter = (promoCatCode = "") => {
        // 如果沒有原始數據，直接返回
        if (!originalRebateData || originalRebateData.length === 0) {
            return;
        }

        // 如果沒有 promoCatCode，顯示所有原始數據
        let filterRebateData = originalRebateData;

        if (promoCatCode) {
            filterRebateData = originalRebateData.filter(category => {
                const { PromoCatCode = "" } = category;
                return PromoCatCode && PromoCatCode.toLowerCase().includes(promoCatCode.toLowerCase());
            });
        }

        // 使用統一的方法更新數據和總金額
        updateRebateData(filterRebateData);
    };

    /**
     * 日期範圍選擇變更處理
     * 
     * 當用戶選擇新的日期範圍時調用此函數
     * 更新開始日期和結束日期，觸發重新獲取數據
     * 
     * @param {string} startDate - 選擇的開始日期
     * @param {string} endDate - 選擇的結束日期
     */
    const onDateRangeChange = (startDate, endDate) => {
        setDateFrom(startDate);
        setDateTo(endDate);
    };

    /**
     * 返水記錄項目點擊處理
     * 
     * 當用戶點擊某個返水記錄項目時，導航到詳情頁
     * 處理流程：
     * 1. 從記錄項中提取返水詳情數據
     * 2. 將每條記錄格式化為詳情頁所需的格式
     * 3. 使用 navigation 跳轉到詳情頁
     * 
     * @param {Object} recordItem - 點擊的返水記錄項目
     * @param {Array} recordItem.data - 返水詳情數據列表
     * @param {string} recordItem.resourcesName - 資源名稱（用於詳情頁標題）
     */
    const onRecordItemPress = (recordItem) => {
        const { data = [], resourcesName = "" } = recordItem || {};

        // 處理數據，格式化為可直接展示的格式
        const formattedDataList = data.map(rebateItem => {
            const { applyDate, totalBetAmount = 0, totalGivenAmount = 0, rebateId = "" } = rebateItem;

            // 格式化數值
            const betAmountValue = getMoneyFormat(parseFloat(totalBetAmount));
            const validTurnoverValue = getMoneyFormat(parseFloat(totalGivenAmount));

            // 格式化日期
            let dateValue = "";
            if (applyDate) {
                try {
                    dateValue = FormatDate(applyDate, { timeLevel: "onlyDate" });
                } catch (error) {
                    console.error("Date formatting error:", error);
                    dateValue = "";
                }
            }

            return {
                items: [
                    {
                        label: translate("流水1"),
                        value: betAmountValue,
                    },
                    {
                        label: translate("返水1"),
                        value: validTurnoverValue,
                    },
                    {
                        label: translate("编号"),
                        value: rebateId,
                    },
                    {
                        label: translate("日期1"),
                        value: dateValue,
                    },
                ],
            };
        });

        // 使用 navigation 跳轉到詳情頁
        navigation?.RecordDetail({
            pageTitle: resourcesName,
            dataList: formattedDataList,
        });
    };

    /**
     * 產品類別過濾選擇處理
     * 
     * 當用戶選擇產品類別過濾時調用此函數
     * 更新過濾條件並發送 Piwik 事件追蹤
     * 
     * 當點擊"×"清除過濾時，PromoCatCode 為 "All"，此時顯示所有數據
     * 
     * @param {Object} selectedCategory - 選擇的產品類別項目
     * @param {string} selectedCategory.PromoCatCode - 產品類別代碼（"All" 表示清除過濾）
     */
    const onCategoryFilterChange = (selectedCategory) => {
        const { PromoCatCode } = selectedCategory || {};

        // 保存選擇的過濾代碼（用於日期變更後重新應用過濾）
        if (PromoCatCode === "All") {
            selectedPromoCatCodeRef.current = "";
        } else {
            selectedPromoCatCodeRef.current = PromoCatCode || "";
        }

        // 如果 PromoCatCode 為 "All"，表示清除過濾，顯示所有數據
        if (PromoCatCode === "All") {
            onProductCategoryFilter("");
        } else {
            onProductCategoryFilter(PromoCatCode);
        }

        // 發送 Piwik 事件追蹤
        PiwikEventDataHandle({
            eventTitle: "Rebate1",
            customProperties: {
                ["Promotion_Rebate_C_Filter_GameCategory"]: PromoCatCode === "All" ? "" : PromoCatCode,
            },
        });
    };

    /**
     * 日期選擇變更處理
     * 
     * 當用戶選擇日期範圍時調用此函數
     * 更新日期範圍並發送 Piwik 事件追蹤
     * 
     * @param {string} startDate - 選擇的開始日期
     * @param {string} endDate - 選擇的結束日期
     */
    const onDateSelectChange = (startDate, endDate) => {
        onDateRangeChange(startDate, endDate);
        // 發送 Piwik 事件追蹤
        PiwikEventDataHandle("Rebate2");
    };

    /**
     * 當日期範圍或分類列表變更時重新獲取數據
     * 
     * 監聽 dateFrom、dateTo 和 categories 的變化
     * 當這些值改變時，重新調用 API 獲取對應的返水記錄數據
     * 
     * 注意：categories 初始為空數組，當 usePromoTab 初始化完成後才會變為實際分類列表
     * 因此需要監聽 categories 的變化，確保分類列表加載完成後能自動獲取返水數據
     */
    useEffect(() => {
        if (dateFrom && dateTo && categories && categories.length > 0) {
            getRebateList();
        }
    }, [dateFrom, dateTo, categories]);

    /**
     * 返回 Hook 的狀態和方法
     * 
     * 供組件使用，包括：
     * - 所有狀態值（日期、數據、總金額等）
     * - 所有方法（日期選擇、過濾、格式化、導航等）
     */
    return {
        // State - 狀態值
        dateFrom,                   // 當前選擇的開始日期
        dateTo,                     // 當前選擇的結束日期
        rebateData,                 // 返水記錄數據列表（格式化後的數據）
        originalRebateData,         // 原始返水記錄數據（用於過濾恢復）
        rebateTotal,                // 總返水金額

        // Methods - 方法
        onDateRangeChange,          // 日期範圍選擇變更處理函數
        onCategoryFilterChange,     // 產品類別過濾選擇處理函數
        onRecordItemPress,          // 返水記錄項目點擊處理函數
        onDateSelectChange,         // 日期選擇變更處理函數
        calculateCategoryAmounts,   // 計算類別的總投注金額和總返水金額的函數
    };
};

