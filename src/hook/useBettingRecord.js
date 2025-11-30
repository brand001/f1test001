import { useState, useEffect } from "react";
import moment from "moment";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetDateStr } from "$Utils/date";
import { getMoneyFormat, getWinLossColor, FormatDate } from "$Utils";
import { GetWalletProductGroupNameMapImg, mapCombinedGroupToImageKey } from "@/images/index.js";
import { translate } from "@/locales/translate";

/**
 * 投注記錄自定義 Hook
 * 
 * 處理投注記錄的數據獲取、過濾和展示邏輯
 * 主要功能：
 * - 獲取產品類別映射設定
 * - 根據日期和產品類別獲取投注記錄數據
 * - 合併相同產品組的數據
 * - 格式化投注記錄項目數據
 * - 處理日期選擇和產品類別過濾
 * - 導航到投注記錄詳情頁
 * 
 * @param {Object} navigation - 導航對象，包含 RecordDetail 方法，用於頁面跳轉
 * @returns {Object} 返回狀態和方法對象
 */
export const useBettingRecord = (navigation) => {
    // 當前選擇的結束日期（默認為今天）
    const [nowDate, setNowDate] = useState(GetDateStr(0));

    // 當前選擇的開始日期（默認為今天）
    const [beforeDate, setBeforeDate] = useState(GetDateStr(0));

    // 投注記錄數據列表（格式化後的數據）
    const [bettingData, setBettingData] = useState("");

    // 當前選擇的產品類別代碼（用於過濾）
    const [productCode, setProductCode] = useState("");

    // 產品類別列表（包含所有可選的產品類別）
    const [productCategories, setProductCategories] = useState([]);

    // 總有效流水金額
    const [totalTurnover, setTotalTurnover] = useState(0);

    // 總輸贏金額
    const [totalWinLoss, setTotalWinLoss] = useState(0);

    // 總投注金額
    const [totalBetAmount, setTotalBetAmount] = useState(0);

    // 原始投注記錄數據（未合併的詳細數據，用於詳情頁展示）
    const [originData, setOriginData] = useState([]);

    /**
     * 獲取產品類別映射設定
     * 
     * 從 API 獲取所有產品類別的映射關係，包括：
     * - 產品組別名稱和本地化名稱
     * - 產品組別 ID（用於 v2.0 API 請求）
     * - 對應的圖標圖片
     * 
     * 處理邏輯：
     * 1. 獲取 API 返回的產品類別列表
     * 2. 為每個類別映射對應的圖標
     * 3. 將第一個選項設置為"全部"（用於顯示所有產品類別）
     * 4. 更新 productCategories 狀態
     */
    const getSettingProductGroupMapping = async () => {
        try {
            const res = await window.fetchRequest(`${window.ApiPort.SettingProductGroupMapping}`, "GET");
            if (res.isSuccess && res.result) {
                const { result } = res;

                // 映射每個產品類別，添加圖標和本地化名稱
                let categories = result.map(item => {
                    const { productGroup, localizedProductGroup, productGroupId } = item;
                    // 將產品組別映射為對應的圖片 key
                    const imageKey = mapCombinedGroupToImageKey(productGroup);
                    // 獲取對應的圖片 URL
                    const imageUrl = GetWalletProductGroupNameMapImg(imageKey);

                    return {
                        ...item,
                        promoCatImageUrl: imageUrl,
                        // 根據 API mapping: providerName = localizedProductGroup
                        providerName: localizedProductGroup,
                        // 確保 productGroupId 存在，用於 v2.0 API 請求
                        productGroupId,
                    };
                });

                // 安全地處理第一個元素 - 設置為 "全部" 選項
                if (categories.length > 0) {
                    categories[0].promoCatImageUrl = GetWalletProductGroupNameMapImg("all");
                    categories[0].productGroup = "";
                    categories[0].productGroupId = ""; // 全部選項不需要 productGroupId
                    categories[0].providerName = translate("全部");
                }

                setProductCategories(categories);
            }
        } catch (error) {
            console.error("Failed to get product group mapping:", error);
        }
    };

    /**
     * 合併相同 productGroup 和 providerCode 的數據
     * 
     * 將具有相同產品組別和供應商代碼的記錄合併為一條記錄，
     * 累加它們的投注金額、輸贏金額和有效流水
     * 
     * @param {Array} data - 需要合併的原始數據數組
     * @returns {Array} 合併後的數據數組
     */
    const margeData = (data) => {
        return data.reduce((acc, cur) => {
            const { providerCode: curProviderCode, productGroup: curProductGroup, turnover: curTurnover, winLoss: curWinLoss, validTurnover: curValidTurnover } = cur;

            // 查找是否已存在相同的 providerCode 和 productGroup 組合
            const obj = acc.find(e => e.providerCode === curProviderCode && e.productGroup === curProductGroup);

            if (obj) {
                // 如果已存在，累加金額
                obj.turnover += curTurnover;
                obj.winLoss += curWinLoss;
                obj.validTurnover += curValidTurnover;
            } else {
                // 如果不存在，添加新記錄
                // 添加 productType 字段以兼容 RecordItem 組件
                acc.push({
                    ...cur,
                    productType: curProductGroup
                });
            }
            return acc;
        }, []);
    };

    /**
     * 獲取投注記錄數據
     * 
     * 根據選擇的日期範圍和產品類別，從 API 獲取投注記錄數據
     * 處理流程：
     * 1. 發送 Piwik 事件追蹤
     * 2. 根據選擇的產品類別構建 productGroupIdList 參數
     * 3. 調用 API 獲取數據
     * 4. 合併相同產品組別的數據
     * 5. 更新相關狀態（總金額、輸贏、有效流水等）
     */
    const getBettingData = async () => {
        const providerCode = productCode || "";

        // 發送 Piwik 事件追蹤，記錄用戶選擇的遊戲類別
        PiwikEventDataHandle({
            eventTitle: "Betrecord2",
            customProperties: {
                ["Bet_Record_C_Filter_GameCategory"]: providerCode,
            },
        });

        // 構建 productGroupIdList 參數（用於 v2.0 API）
        let productGroupIdList = "";
        if (providerCode && productCategories.length > 0) {
            // 查找選擇的產品類別對應的 productGroupId
            const selectedCategory = productCategories.find(cat => cat.productGroup === providerCode);
            if (selectedCategory?.productGroupId) {
                productGroupIdList = selectedCategory.productGroupId;
            }
        }

        // 清空當前數據，顯示加載狀態
        setBettingData("");

        try {
            // 調用 API 獲取投注記錄數據
            const data = await window.fetchRequest(`${window.ApiPort.MemberDailyTurnoverByProductTypeV2}?dateFrom=${beforeDate}&dateTo=${nowDate}&productGroupIdList=${productGroupIdList}&`, "GET");

            if (data?.result) {
                const { result: res } = data;

                // 安全地處理 dailyTurnoverDetails（每日投注詳情）
                const dailyTurnoverDetails = res?.dailyTurnoverDetails || [];
                // 深拷貝數據，避免直接修改原始數據
                const copyData = JSON.parse(JSON.stringify(dailyTurnoverDetails));

                // 合併相同產品組別的數據
                let mergedData = [];

                if (copyData.length > 0) {
                    mergedData = margeData(copyData);
                }

                // 更新統計數據
                setTotalTurnover(res?.totalValidTurnover || 0);  // 總有效流水
                setTotalWinLoss(res?.totalWinLoss || 0);          // 總輸贏
                setTotalBetAmount(res?.totalTurnover || 0);       // 總投注金額
                setOriginData(dailyTurnoverDetails);              // 保存原始數據（用於詳情頁）
                setBettingData(mergedData);                       // 設置合併後的數據
            }
        } catch (error) {
            console.error("Failed to get betting data:", error);
            // 發生錯誤時，設置為空數組
            setBettingData([]);
        }
    };

    /**
     * 日期範圍選擇變更處理
     * 
     * 當用戶選擇新的日期範圍時調用此函數
     * 更新開始日期和結束日期，觸發 useEffect 重新獲取數據
     * 
     * @param {string} startDate - 選擇的開始日期
     * @param {string} endDate - 選擇的結束日期
     */
    const onDateRangeChange = async (startDate, endDate) => {
        setBeforeDate(startDate);
        setNowDate(endDate);
    };

    /**
     * 產品類別過濾變更處理
     * 
     * 當用戶選擇產品類別過濾時調用此函數
     * 更新 productCode，觸發 useEffect 重新獲取數據
     * 
     * @param {Object} selectedCategory - 選擇的產品類別項目
     * @param {string} selectedCategory.productGroup - 產品組別代碼
     */
    const onCategoryFilterChange = async (selectedCategory) => {
        const { productGroup } = selectedCategory || {};
        setProductCode(productGroup);
    };

    /**
     * 格式化投注記錄項目數據
     * 
     * 將原始投注記錄數據格式化為 UI 展示所需的格式
     * 包括：
     * - 產品類別圖標 URL
     * - 格式化後的投注金額
     * - 格式化後的輸贏金額（帶顏色和符號）
     * - 供應商本地化名稱
     * 
     * @param {Object} recordItem - 原始投注記錄項目
     * @param {string} recordItem.productGroup - 產品組別
     * @param {number} recordItem.turnover - 投注金額
     * @param {number} recordItem.winLoss - 輸贏金額
     * @param {string} recordItem.providerCodeLocalizedName - 供應商本地化名稱
     * @param {string} recordItem.providerCode - 供應商代碼
     * @returns {Object|null} 格式化後的數據對象，如果 recordItem 為空則返回 null
     */
    const onFormatRecordItem = (recordItem) => {
        if (!recordItem) return null;

        const { productGroup, turnover = 0, winLoss = 0, providerCodeLocalizedName, providerCode } = recordItem;

        // 將 productGroup 映射為對應的圖片 key
        const imageKey = productGroup ? mapCombinedGroupToImageKey(productGroup) : null;
        // 獲取對應的圖片 URL
        const imageUrl = imageKey ? GetWalletProductGroupNameMapImg(imageKey) : null;

        // 格式化數值
        const turnoverValue = getMoneyFormat(parseFloat(turnover));  // 投注金額格式化
        const winLossValue = parseFloat(winLoss.toFixed(3)) + "";    // 輸贏金額保留3位小數
        // 獲取輸贏金額的顏色和符號（正數顯示+，負數顯示-）
        const { color: winLossColor, sign: winLossSign } = getWinLossColor(winLoss);
        // 格式化輸贏金額顯示（移除負號，添加符號前綴）
        const bottomRightValue = winLossSign + getMoneyFormat(winLossValue?.replace("-", "") || "0");

        return {
            imageUrl,                                    // 產品類別圖標 URL
            turnoverValue,                               // 格式化後的投注金額
            bottomRightValue,                            // 格式化後的輸贏金額（帶符號）
            winLossColor,                                // 輸贏金額顏色（正數/負數）
            providerCodeLocalizedName: providerCodeLocalizedName || providerCode || "",  // 供應商名稱
        };
    };

    /**
     * 投注記錄項目點擊處理
     * 
     * 當用戶點擊某個投注記錄項目時，導航到詳情頁
     * 處理流程：
     * 1. 從原始數據中過濾出該產品組別的所有記錄
     * 2. 將每條記錄格式化為詳情頁所需的格式
     * 3. 使用 navigation 跳轉到詳情頁
     * 
     * @param {Object} recordItem - 點擊的投注記錄項目
     * @param {string} recordItem.providerCode - 供應商代碼
     * @param {string} recordItem.productGroup - 產品組別
     * @param {string} recordItem.providerCodeLocalizedName - 供應商本地化名稱
     */
    const onRecordItemPress = (recordItem) => {
        const { providerCode, productGroup, providerCodeLocalizedName = "" } = recordItem || {};

        // 從原始數據中過濾出與當前項目相同 providerCode 和 productGroup 的所有記錄
        const filterData = originData.filter(v => {
            const { providerCode: vProviderCode, productGroup: vProductGroup } = v;
            return vProviderCode === providerCode && vProductGroup === productGroup;
        });

        // 處理數據，格式化為可直接展示的格式
        const formattedDataList = filterData.map(recordItem => {
            const { dateLabel = "", turnover = 0, validTurnover = 0, winLoss = 0 } = recordItem;

            // 格式化日期（從 ISO 格式轉換為可讀格式）
            let dateValue = "";
            if (dateLabel && dateLabel !== "") {
                try {
                    // 提取日期部分（去除時間部分）
                    const dateStr = dateLabel.split("T")[0];
                    if (dateStr) {
                        dateValue = FormatDate(moment(new Date(dateStr)), { timeLevel: "onlyDate" });
                    }
                } catch (error) {
                    console.error("Date formatting error:", error);
                    dateValue = "";
                }
            }

            // 格式化數值
            const betAmountValue = getMoneyFormat(parseFloat(turnover));           // 投注金額
            const validTurnoverValue = getMoneyFormat(parseFloat(validTurnover));  // 有效流水

            // 處理輸贏金額（添加符號和顏色）
            const winLossAmount = winLoss + "";
            const { color: winLossColor, sign: winLossSign } = getWinLossColor(winLoss);
            const winLossValue = winLossSign + getMoneyFormat(winLossAmount.replace("-", "") || "0");

            // 返回格式化後的詳情項數據結構
            return {
                items: [
                    {
                        label: translate("日期"),
                        value: dateValue,
                    },
                    {
                        label: translate("投注金额"),
                        value: betAmountValue,
                    },
                    {
                        label: translate("有效流水"),
                        value: validTurnoverValue,
                    },
                    {
                        label: translate("输/赢"),
                        value: winLossValue,
                        color: winLossColor,  // 用於顯示輸贏金額的顏色
                    },
                ],
            };
        });

        // 使用 navigation 跳轉到詳情頁
        navigation?.RecordDetail({
            pageTitle: providerCodeLocalizedName || providerCode,  // 詳情頁標題
            dataList: formattedDataList,                          // 詳情數據列表
        });
    };

    /**
     * 初始化加載產品類別映射（只調用一次）
     * 
     * 組件掛載時執行，獲取所有產品類別的映射關係
     * 依賴項為空數組 []，確保只在組件初始化時執行一次
     */
    useEffect(() => {
        getSettingProductGroupMapping();
    }, []);

    /**
     * 當日期、產品代碼變更時重新獲取數據
     * 
     * 監聽 beforeDate、nowDate、productCode 的變化
     * 當這些值改變時，重新調用 API 獲取對應的投注記錄數據
     * 
     * 注意：只有在 beforeDate 和 nowDate 都存在時才會執行
     */
    useEffect(() => {
        if (beforeDate && nowDate) {
            getBettingData();
        }
    }, [beforeDate, nowDate, productCode]);

    /**
     * 返回 Hook 的狀態和方法
     * 
     * 供組件使用，包括：
     * - 所有狀態值（日期、數據、統計等）
     * - 所有方法（日期選擇、過濾、格式化、導航等）
     */
    return {
        // State - 狀態值
        nowDate,                    // 結束日期
        beforeDate,                 // 開始日期
        bettingData,                // 投注記錄數據列表
        productCode,                // 當前選擇的產品類別代碼
        productCategories,          // 產品類別列表
        totalTurnover,              // 總有效流水
        totalWinLoss,               // 總輸贏
        totalBetAmount,             // 總投注金額
        originData,                 // 原始數據（用於詳情頁）

        // Methods - 方法
        onDateRangeChange,          // 日期範圍選擇變更處理
        onCategoryFilterChange,     // 產品類別過濾變更處理
        onRecordItemPress,          // 投注記錄項目點擊處理
        onFormatRecordItem,         // 格式化投注記錄項目數據
    };
};

