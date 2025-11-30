import React from "react";
import { Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import BettingCalendar from "$Components/BettingCalendar";
import { RowCenterBetween } from "$Components/CustomView";
import CustomFlatList from "$Components/CustomFlatList";
import { RecordItem } from "$Components/RecordItem";
import PromotionsFilter from "$Components/PromotionsFilter";
import { getMoneyFormat } from "$Utils";
import { GetWalletProductGroupNameMapImg } from "@/images/index.js";
import { translate } from "@/locales/translate";
import { InforIcon } from "$Components/icons/index";
import Styles from "./Styles";
import { usePromotionsRebate } from "$Hooks";

/**
 * 渲染返水記錄列表頭部統計信息
 * 
 * @param {Object} params - 參數對象
 * @param {number} params.rebateTotal - 總返水金額
 * @param {Array} params.rebateData - 返水記錄數據列表
 * @returns {JSX.Element|null} 渲染的頭部組件
 */
const renderRebateHeader = ({ rebateTotal, rebateData }) => {
    if (!Array.isArray(rebateData) || rebateData.length === 0) {
        return null;
    }

    return (
        <RowCenterBetween style={Styles.list}>
            <Text style={Styles.headerListTitle}>{translate("总得返水")}</Text>
            <Text style={Styles.headerListInfor}>{getMoneyFormat(rebateTotal)}</Text>
        </RowCenterBetween>
    );
};

/**
 * 渲染返水記錄列表項
 * 
 * @param {Object} params - 參數對象
 * @param {Object} params.recordItem - 返水記錄項目
 * @param {number} params.index - 項目索引
 * @param {string} params.startDate - 開始日期
 * @param {string} params.endDate - 結束日期
 * @param {Function} params.calculateCategoryAmounts - 計算類別金額的函數
 * @param {Function} params.onRecordItemPress - 記錄項目點擊處理函數
 * @returns {JSX.Element|null} 渲染的記錄項目組件
 */
const renderRebateItem = ({ recordItem, index, startDate, endDate, calculateCategoryAmounts, onRecordItemPress }) => {
    if (!recordItem) return null;

    const dateRangeDays = moment(new Date(endDate)).diff(moment(new Date(startDate)), "days");
    const { data: rebateDetails = [], PromoCatCode, promoCatImageUrl, resourcesName = "" } = recordItem;
    const { totalBetAmount, totalRebateAmount } = calculateCategoryAmounts(rebateDetails);
    const categoryIconSource =
        GetWalletProductGroupNameMapImg(PromoCatCode) ||
        (promoCatImageUrl ? { uri: promoCatImageUrl } : null);

    return (
        <RecordItem
            key={index}
            titleText={resourcesName}
            iconSource={categoryIconSource}
            bottomLeftText={translate("总达流水{x}", { x: dateRangeDays })}
            bottomRightText={translate("总得返水{x}", { x: dateRangeDays })}
            bottomLeftValue={totalBetAmount === "0" ? "-" : getMoneyFormat(totalBetAmount)}
            bottomRightValue={totalRebateAmount === "0" ? "-" : getMoneyFormat(totalRebateAmount)}
            bottomRightValueColor="#42D200"
            onPress={() => onRecordItemPress(recordItem)}
        />
    );
};

/**
 * 渲染過濾器區域
 * 
 * @param {Object} params - 參數對象
 * @param {Array} params.categories - 產品類別列表
 * @param {boolean} params.sportSB - 是否為體育 SB
 * @param {string} params.startDate - 開始日期
 * @param {string} params.endDate - 結束日期
 * @param {Function} params.onCategoryFilterChange - 產品類別過濾變更處理函數
 * @param {Function} params.onDateSelectChange - 日期選擇變更處理函數
 * @returns {JSX.Element} 渲染的過濾器組件
 */
const renderFilterHeader = ({ categories, sportSB, startDate, endDate, onCategoryFilterChange, onDateSelectChange }) => {
    return (
        <View>
            <PromotionsFilter
                showFilter={!sportSB}
                realName="resourcesName"
                data={categories}
                onFiltter={onCategoryFilterChange}>
                {/*可搜尋90天內 最多30天*/}
                <BettingCalendar
                    showInforText={true}
                    type="modalDropdown"
                    startDate={startDate}
                    endDate={endDate}
                    selectChange={onDateSelectChange}
                />
            </PromotionsFilter>

            <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
                <View style={{ alignSelf: "flex-start" }}>
                    <InforIcon fill={"#999999"} width={16} height={16} marginRight={4} />
                </View>
                <Text style={Styles.promoText}>
                    {translate("有效流水将优先用于满足彩金优惠流水需求, 剩余的有效流水将随后计入您的返水")}
                </Text>
            </View>
        </View>
    );
};

const PromotionsRebate = ({ categories = [], sportSB = false }) => {
    // 從 Hook 獲取返水記錄相關的狀態和方法
    const {
        // State - 狀態值
        dateFrom,                   // 當前選擇的開始日期
        dateTo,                     // 當前選擇的結束日期
        rebateData,                 // 返水記錄數據列表（格式化後的數據）
        rebateTotal,                // 總返水金額

        // Methods - 方法
        onCategoryFilterChange,     // 產品類別過濾選擇處理函數
        onRecordItemPress,          // 返水記錄項目點擊處理函數
        onDateSelectChange,         // 日期選擇變更處理函數
        calculateCategoryAmounts,   // 計算類別的總投注金額和總返水金額的函數
    } = usePromotionsRebate({
        navigation: Actions,
        categories,
        sportSB,
    });

    return (
        <View style={Styles.viewContainer}>
            <CustomFlatList
                data={rebateData}
                showHeaderOnScroll={false}
                numColumns={1}
                ListHeaderComponent={() => renderRebateHeader({ rebateTotal, rebateData })}
                renderItem={({ item, index }) => renderRebateItem({
                    recordItem: item,
                    index,
                    startDate: dateFrom,
                    endDate: dateTo,
                    calculateCategoryAmounts,
                    onRecordItemPress,
                })}
                itemsPerPage={3}
                emptyText={translate("暂无记录PromotionsRebate")}
                loadingMoreText={translate("加载更多…")}
                noMoreText={translate("没有更多了")}
                header={() => renderFilterHeader({
                    categories,
                    sportSB,
                    startDate: dateFrom,
                    endDate: dateTo,
                    onCategoryFilterChange,
                    onDateSelectChange,
                })}
            />
        </View>
    );
};

export default PromotionsRebate;
