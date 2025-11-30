import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import BettingCalendar from "$Components/BettingCalendar";
import CustomTooltip from "$Components/CustomTooltip";
import { FormatDate, getMoneyFormat, getWinLossColor } from "$Utils";
import { RecordItem } from "$Components/RecordItem";
const { width } = Dimensions.get("window");
import { translate } from "@/locales/translate";
import LiveChat from "$Components/LiveChat";

import { RowCenterBetween } from "$Components/CustomView";
import DropDownSelectArray from "$Components/DropDownSelectArray";

import Styles from "./Styles";
import { InforIcon, ArrowIcon } from "$Components/icons/index";
import Color from "$Components/Color";
import CustomFlatList from "$Components/CustomFlatList";
import { useBettingRecord } from "$Hooks";

/**
 * 渲染投注記錄列表項
 * 
 * @param {Object} params - 參數對象
 * @param {Object} params.item - 投注記錄項目
 * @param {number} params.index - 項目索引
 * @param {string} params.startDate - 開始日期
 * @param {string} params.endDate - 結束日期
 * @param {Function} params.onFormatRecordItem - 格式化記錄項目的函數
 * @param {Function} params.onRecordItemPress - 記錄項目點擊處理函數
 * @returns {JSX.Element|null} 渲染的記錄項目組件
 */
const renderRecordItem = ({ item, index, startDate, endDate, onFormatRecordItem, onRecordItemPress }) => {
    const formattedItem = onFormatRecordItem(item);
    if (!formattedItem) return null;

    return (
        <RecordItem
            key={index}
            titleText={formattedItem.providerCodeLocalizedName}
            subtitleText={(startDate && endDate) ? (FormatDate(startDate, { timeLevel: "onlyDate" }) + " ~ " + FormatDate(endDate, { timeLevel: "onlyDate" })) : ""}
            iconSource={formattedItem.imageUrl}
            bottomLeftText={translate("总投注金额")}
            bottomRightText={translate("总输赢")}
            bottomLeftValue={formattedItem.turnoverValue}
            bottomRightValue={formattedItem.bottomRightValue}
            bottomRightValueColor={formattedItem.winLossColor}
            onPress={() => item && onRecordItemPress(item)}
        />
    );
};

/**
 * 渲染過濾器區域
 * 
 * @param {Object} params - 參數對象
 * @param {Array} params.productCategories - 產品類別列表
 * @param {string} params.startDate - 開始日期
 * @param {string} params.endDate - 結束日期
 * @param {Function} params.onCategoryFilterChange - 產品類別過濾變更處理函數
 * @param {Function} params.onDateRangeChange - 日期範圍變更處理函數
 * @returns {JSX.Element} 渲染的過濾器組件
 */
const renderFilterHeader = ({ productCategories, startDate, endDate, onCategoryFilterChange, onDateRangeChange }) => {
    return (
        <View style={Styles.filterContainer}>
            <RowCenterBetween style={Styles.filterRow}>
                <DropDownSelectArray
                    title={translate("选择游戏类别")}
                    data={productCategories}
                    realKey="providerName"
                    imageKey="promoCatImageUrl"
                    onChange={async ({ key }) => {
                        const selectedCategory = productCategories[key];
                        await onCategoryFilterChange(selectedCategory);
                    }}
                    RenderButton={({ value, onPress, flag }) => (
                        <View style={{ flexShrink: 1, marginRight: 10 }}>
                            <RowCenterBetween
                                style={Styles.filterButton}
                                onPress={onPress}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={Styles.filterButtonText}>
                                    {value}
                                </Text>
                                <ArrowIcon fill={Color.gray} width={12} height={12} direction={flag ? "top" : "bottom"} />
                            </RowCenterBetween>
                        </View>
                    )}
                />

                <BettingCalendar
                    showInforText={true}
                    type="modalDropdown"
                    startDate={startDate}
                    endDate={endDate}
                    selectChange={onDateRangeChange}
                />
            </RowCenterBetween>
        </View>
    );
};

const BettingRecord = () => {
    // 從 Hook 獲取投注記錄相關的狀態和方法
    const {
        // State - 狀態值
        nowDate,                    // 當前選擇的結束日期
        beforeDate,                 // 當前選擇的開始日期
        bettingData,                // 投注記錄數據列表（格式化後的數據）
        productCategories,          // 產品類別列表（包含所有可選的產品類別）
        totalTurnover,              // 總有效流水金額
        totalWinLoss,               // 總輸贏金額
        totalBetAmount,             // 總投注金額

        // Methods - 方法
        onDateRangeChange,          // 日期範圍選擇變更處理函數
        onCategoryFilterChange,     // 產品類別過濾變更處理函數
        onRecordItemPress,          // 投注記錄項目點擊處理函數
        onFormatRecordItem,         // 格式化投注記錄項目數據的函數
    } = useBettingRecord(Actions);

    // 渲染列表頭部統計信息
    const renderHeader = () => {
        const { color: winLossColor, sign: winLossSign } = getWinLossColor(totalWinLoss ?? 0);

        return (
            bettingData.length > 0 && (
                <View style={Styles.list}>
                    <RowCenterBetween>
                        <Text style={Styles.headerListTitle}>{translate("总投注金额")}</Text>
                        <Text style={Styles.headerListInfor}>{getMoneyFormat(totalBetAmount)}</Text>
                    </RowCenterBetween>

                    <RowCenterBetween>
                        <Text style={Styles.headerListTitle}>{translate("总输赢")}</Text>
                        <Text
                            style={[
                                Styles.headerListInfor,
                                { color: winLossColor },
                            ]}>
                            {winLossSign}
                            {getMoneyFormat(totalWinLoss && (totalWinLoss + "").replace("-", ""))}
                        </Text>
                    </RowCenterBetween>

                    <RowCenterBetween>
                        <Text style={Styles.headerListTitle}>{translate("总有效流水")}</Text>
                        <Text style={Styles.headerListInfor}>{getMoneyFormat(totalTurnover)}</Text>
                    </RowCenterBetween>
                </View>
            )
        );
    };

    return (
        <View style={Styles.viewContainer}>
            <RowCenterBetween style={Styles.headerWrap}>
                <RowCenterBetween>
                    <Text style={Styles.headerTitle}>{translate("投注记录")}</Text>

                    <CustomTooltip
                        isShowCloseImg={true}
                        textStyle={Styles.tipText}
                        containerStyle={{
                            width: 0.9 * width,
                            paddingTop: 15,
                            left: window.LANGUAGE == "TH" ? 0 : 20,
                            paddingRight: 25,
                        }}
                        Icon={
                            <InforIcon fill={Color.white} width={18} height={18}></InforIcon>
                        }
                        text={translate("[总投注金额] 为您在本站所有游戏平台的下注总额。[总输/赢] 为您在本站所有游戏平台的输赢总额")}></CustomTooltip>
                </RowCenterBetween>

                <LiveChat
                    callBack={() => {
                        PiwikEventDataHandle("Betrecord1");
                    }}
                    showVip={true}
                />
            </RowCenterBetween>

            <CustomFlatList
                data={bettingData}
                showHeaderOnScroll={false}
                numColumns={1}
                ListHeaderComponent={renderHeader}
                renderItem={({ item, index }) => renderRecordItem({
                    item,
                    index,
                    startDate: beforeDate,
                    endDate: nowDate,
                    onFormatRecordItem,
                    onRecordItemPress,
                })}
                header={() => renderFilterHeader({
                    productCategories,
                    startDate: beforeDate,
                    endDate: nowDate,
                    onCategoryFilterChange,
                    onDateRangeChange,
                })}
            />
        </View>
    );
};

export default BettingRecord;