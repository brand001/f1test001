/**
 * Promotions 优惠列表页面组件
 * 
 * 功能：
 * - 展示优惠列表，支持分类筛选
 * - 支持横向滚动查看分类下的优惠
 * - 支持点击查看优惠详情
 * - 集成 Piwik 事件追踪
 */
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { Toasts } from "$Toasts";
const { width } = Dimensions.get("window");
import { DefaultHomeIcon, PromotionsTypeObj } from "./PromotionStatus";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomFlatList from "$Components/CustomFlatList";
import { RowCenterCenter, RowCenterBetween, RowCenterStart, ColumnBetweenStart } from "$Components/CustomView";
import { ArrowIcon, TimeIcon } from "$Components/icons/index.js";
import PromotionsFilter from "$Components/PromotionsFilter";
import { FormatDate } from "$Utils";
import ImageMap from "@/locales/Images";
import { ImagesUrl } from "@/images/index";
import { usePromotions } from "$Hooks";

// 卡片宽度（屏幕宽度的 86.5%）
const CardWidth = width * 0.865;
// 卡片右边距
const CardMright = 10;

/**
 * Promotions 组件
 * @param {Object} props - 组件属性
 * @param {Array} props.categories - 优惠分类列表
 * @param {boolean} props.sportSB - 是否为体育投注模式
 * @param {Array|string} props.promotions - 优惠列表数据
 * @param {Object} props.classifiedPromotions - 按分类组织的优惠数据
 * @param {Function} props.getPromotions - 获取优惠列表的方法
 * @param {Function} props.setPromoData - 设置优惠数据的方法
 * @param {Function} props.initialization - 初始化方法
 */
const Promotions = (props) => {
    // 从自定义 Hook 获取业务逻辑和状态
    const {
        selectedCategoryId,
        selectedCategoryName,
        showFilteredRes,
        getPromotionContent,
        selectCategory,
        getFlatListData,
        onCategoryFilter,
        onFilterCallback,
    } = usePromotions({
        ...props,
        navigateToPromotionsDetail: Actions.PromotionsDetail,
        navigateToPromotion: () => Actions.jump("Promotion"),
        toasts: Toasts,
    });

    const { categories, sportSB, getPromotions } = props;

    /**
     * 渲染优惠行
     * @param {Object} params - 参数对象
     * @param {Object} params.item - 优惠项数据
     * @param {number} params.index - 索引
     * @param {boolean} params.isHorizontalList - 是否为横向列表（默认 false）
     * @param {string} params.categoryCode - 分类代码
     * @returns {JSX.Element} 优惠行组件
     */
    const renderPromRow = ({ item: promotionItem, index, isHorizontalList = false, categoryCode }) => {
        const { displayStatus = "", promotionType = "" } = promotionItem;

        // 默认图标和状态项
        let HomeIcon = DefaultHomeIcon;
        let promotionStatusItem = {};

        const { bonusData = {} } = promotionItem;

        // 处理充值优惠的特殊状态（已应用）
        if (promotionItem.actionType == "FUND_IN" && Object.keys(bonusData).length && bonusData?.isApplied) {
            const reloadBonusStatusData = (promotionStatusItem = PromotionsTypeObj[promotionType][promotionItem.actionType]?.ReloadBonusStatus?.isApplied || {});
            if (Object.keys(reloadBonusStatusData).length) {
                promotionStatusItem = reloadBonusStatusData;
                HomeIcon = promotionStatusItem?.HomeIcon;
            }
        } else {
            // 根据优惠类型和显示状态获取对应的状态项和图标
            if (Boolean(promotionType) && Boolean(displayStatus) && Boolean(PromotionsTypeObj[promotionType]) && Boolean(PromotionsTypeObj[promotionType][displayStatus])) {
                promotionStatusItem = PromotionsTypeObj[promotionType][displayStatus];
                HomeIcon = promotionStatusItem?.HomeIcon;
            }
        }

        return (
            <Touch
                key={index}
                onPress={() => {
                    // 获取并跳转到优惠详情页
                    getPromotionContent({
                        promoId: promotionItem.promoId,
                        promotionItem,
                        promotionStatusItem,
                    });

                    // 追踪 Piwik 事件：查看优惠
                    const currentCategoryCode = showFilteredRes ? selectedCategoryName : categoryCode;
                    const categoryCodeWithoutSpaces = currentCategoryCode.replace(/\s/g, "");
                    PiwikEventDataHandle({
                        category: "Promotion",
                        action: "View Promo",
                        name: "Promotion_V_Promotion",
                        path: "promotion",
                        title: "Promotion",
                        customProperties: {
                            [`Promotion_V_${categoryCodeWithoutSpaces}_PromoName_PrmoID`]: promotionItem?.promoTitle + "_" + promotionItem?.promoId,
                        },
                    });
                }}
                style={[styles.promItemItemViewCom, isHorizontalList ? styles.promListItemItemView : styles.promItemItemView]}>
                <Image
                    resizeMode="stretch"
                    source={{ uri: promotionItem.promoImage }}
                    defaultSource={ImagesUrl.loadinglight}
                    style={isHorizontalList ? styles.promListItemImg : styles.promItemImg}
                />

                <ColumnBetweenStart style={styles.pomoInforBox}>
                    <RowCenterBetween style={styles.pomoInforTop}>
                        <Text style={styles.promItemNameStyle} numberOfLines={2} ellipsizeMode="tail">
                            {promotionItem.promoTitle}
                        </Text>

                        {Boolean(HomeIcon) && <HomeIcon enable={false} />}
                    </RowCenterBetween>
                    <RowCenterStart>
                        <TimeIcon width={16} height={16} />
                        <Text
                            style={styles.timeText}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}>
                            {FormatDate(promotionItem?.startDate)} - {FormatDate(promotionItem?.endDate)}
                        </Text>
                    </RowCenterStart>
                </ColumnBetweenStart>
            </Touch>
        );
    };

    /**
     * 渲染分类头部
     * @param {Object} categoryItem - 分类项数据
     * @param {string} categoryItem.promoCatImageUrl - 分类图标 URL
     * @param {string} categoryItem.resourcesName - 分类名称
     * @param {string} categoryItem.PromoCatCode - 分类代码
     * @returns {JSX.Element} 分类头部组件
     */
    const SubCateHeader = (categoryItem) => {
        return (
            <RowCenterBetween style={{ marginBottom: 15 }}>
                <RowCenterCenter>
                    <Image resizeMode="stretch" source={{ uri: categoryItem.promoCatImageUrl }} style={styles.subCateIcon} />
                    <Text style={styles.subCateTitle}>{categoryItem?.resourcesName || ""}</Text>
                    {/* Sports 分类显示特殊标签 */}
                    {categoryItem.PromoCatCode === "Sports" && (
                        <Image resizeMode="stretch" source={ImageMap.WCLabel} style={styles.wcLabel} />
                    )}
                </RowCenterCenter>

                {/* 点击"更多"按钮选择该分类 */}
                <RowCenterCenter
                    onPress={() => {
                        selectCategory(categoryItem);
                    }}>
                    <Text style={styles.moreText}>{translate("更多")}</Text>
                    <ArrowIcon fill={Color.gray} width={15} height={15} wrapStyle={styles.arrowIcon} direction="right" />
                </RowCenterCenter>
            </RowCenterBetween>
        );
    };

    /**
     * 渲染筛选头部
     * @returns {JSX.Element} 筛选头部组件
     */
    const renderPromotionsHeader = () => {
        // 体育投注模式不显示筛选器
        if (sportSB) {
            return <View style={{ height: 16 }}></View>;
        }

        return <>
            <PromotionsFilter
                realName="resourcesName"
                name={selectedCategoryId > 0 && (categories.find(category => category?.PromoCatID == selectedCategoryId)?.resourcesName || "")}
                data={categories}
                callBack={onFilterCallback}
                onFiltter={onCategoryFilter}
                wrapStyle={{ backgroundColor: "#efeff4" }}
            />
            <View style={{ height: 6 }}></View>
        </>;
    };

    /**
     * FlatList 的 renderItem
     * @param {Object} params - 参数对象
     * @param {Object} params.item - 列表项数据
     * @param {string} params.item.type - 项类型（"category" 或普通优惠项）
     * @returns {JSX.Element} 列表项组件
     */
    const renderFlatListItem = ({ item: listItem }) => {
        // 分类项：显示分类头部和横向滚动的优惠列表
        if (listItem.type === "category") {
            return (
                <View key={listItem.key}>
                    {SubCateHeader(listItem.category)}
                    <View style={styles.promItemBox}>
                        {/* 泰语环境下启用分页滚动 */}
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            decelerationRate="normal"
                            snapToAlignment="center"
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            // 确保内容容器有足够的宽度以支持横向滚动
                            contentContainerStyle={{
                                paddingRight: CardMright,
                                // 计算总宽度：卡片数量 * (卡片宽度 + 右边距)
                                minWidth: listItem.promotions.length > 0
                                    ? listItem.promotions.length * (CardWidth + CardMright)
                                    : width
                            }}
                            {...window.LANGUAGE == "TH"
                                ? {
                                    snapToInterval: CardWidth + CardMright,
                                    pagingEnabled: true
                                }
                                : undefined
                            }
                        >
                            {listItem.promotions.map((promotion, index) => {
                                return renderPromRow({
                                    item: promotion,
                                    index: index,
                                    isHorizontalList: true,
                                    categoryCode: listItem.PromoCatCode,
                                });
                            })}
                        </ScrollView>
                    </View>
                </View>
            );
        } else {
            // 筛选后的单个优惠项：垂直列表显示
            return renderPromRow({
                item: listItem,
                index: listItem.promoId || 0,
                isHorizontalList: false,
            });
        }
    };

    // 获取 FlatList 数据（空字符串表示加载中）
    const flatListData = getFlatListData();

    return (
        <CustomFlatList
            key={selectedCategoryName}
            data={flatListData}
            renderItem={renderFlatListItem}
            header={renderPromotionsHeader}
            showHeaderOnScroll={false}
            keyExtractor={(item, index) => {
                // 优先使用 item.key，其次使用 promoId，最后使用索引
                if (item.key) return item.key;
                if (item.promoId) return `promo-${item.promoId}`;
                return `item-${index}`;
            }}
            emptyText={translate("暂时没有任何优惠")}
            itemsPerPage={10}
            onRefresh={getPromotions}
            showNoMoreText={false}
        />
    );
};

const styles = StyleSheet.create({
    subCateIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    subCateTitle: {
        color: "#1A1A1A",
        fontSize: 16,
        fontWeight: "bold"
    },
    promItemBox: {
        overflow: "hidden",
        borderRadius: 12,
        marginBottom: 20,
    },
    promItemItemViewCom: {
        marginRight: CardMright,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    promItemItemView: {
        width: "100%",
        height: 0.54 * width,
        maxHeight: 0.54 * width,
        marginBottom: 16,
    },
    promListItemItemView: {
        width: CardWidth,
        height: 0.54 * width,
        maxHeight: 0.54 * width,
    },
    promItemImg: {
        width: 0.95 * width,
        height: 0.345 * width,
    },
    promListItemImg: {
        width: CardWidth,
        height: 0.345 * width,
    },
    promItemNameStyle: {
        color: Color.charcoal,
        textAlign: "left",
        fontWeight: "600",
        fontSize: 14,
        maxWidth: "60%",
        lineHeight: 16,
    },
    pomoInforBox: {
        paddingHorizontal: 10,
        height: 74,
        paddingVertical: 8
    },
    pomoInforTop: {
        width: "100%",
        marginBottom: 8,
    },
    timeText: {
        fontSize: 10,
        color: "#999999",
        fontWeight: "400",
        marginLeft: 4
    },
    wcLabel: {
        height: 20,
        width: 70,
        marginLeft: 10
    },
    moreText: {
        color: "#666666"
    },
    arrowIcon: {
        marginLeft: 5
    }
});

export default Promotions;