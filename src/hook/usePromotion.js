import { useState } from "react";
import { useApp, ActionTypes } from "@/contexts/AppContext";
import { PromotionList, PromotionDetail } from "@/actions/CmsApi";
import { Actions } from "react-native-router-flux";
import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";
import { PromotionsTypeObj } from "@/containers/PromoTab/PromotionStatus";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

/**
 * 促銷相關的自定義 Hook
 * 提供促銷數據獲取和處理功能
 */
const usePromotion = () => {
    const { promotionData, _dispatch } = useApp();

    /**
     * 從 API 獲取促銷數據並更新到 Context
     * @param {boolean} forceUpdate - 是否強制更新，默認 false
     * @returns {Promise<Array>} 促銷數據數組
     */
    const updatePromotionData = async (forceUpdate = false) => {
        // 如果不強制更新且已有數據，直接返回緩存數據
        if (!forceUpdate && promotionData) {
            return promotionData;
        }

        try {
            const params = {
                type: "general",
                transactionType: "",
                wallet: "",
            };
            const data = await PromotionList?.(params);
            // 更新 Context 中的數據
            _dispatch({
                type: ActionTypes.SET_PROMOTION_DATA,
                payload: data
            });
            return data || [];
        } catch (error) {
            console?.log?.("獲取促銷數據失敗:", error);
            return promotionData || [];
        }
    };

    /**
     * 獲取某一類型的優惠（從 Context 中過濾）
     * @param {string|null} type - 促銷類型，為空時返回全部數據
     * @returns {Array} 過濾後的促銷數據數組
     */
    const getPromotionData = (type = null) => {
        // 如果type為空，返回全部數據
        if (!type) {
            return promotionData || [];
        }

        // 如果指定了type，返回過濾後的數據
        const upperType = type?.toUpperCase?.();
        return promotionData?.filter?.(promo => {
            // 檢查是否有 category 數組且包含指定類型
            return Array?.isArray?.(promo?.category) &&
                promo?.category?.some?.(cat => cat?.toUpperCase?.() === upperType);
        }) || [];
    };

    const getPromotionStatusDetail = async ({ promotionId }) => {
        let params = {
            id: promotionId,
            jumpfrom: "BANNER",
        };

        let promotionData = await getPromotionData(null, false);
        let promotionDataItem = promotionData.find(v => v?.campaignId == promotionId || v?.entryPeriodId == promotionId || v?.promoId == promotionId);
        let { promotionType = "", displayStatus = "" } = promotionDataItem || {};
        let PromotionsItem = null;
        if (promotionType && displayStatus) {
            PromotionsItem = PromotionsTypeObj[promotionType][displayStatus];
        }

        Toasts.loading(translate("加载中..."), 20);
        PromotionDetail(params)
            .then(data => {
                Toasts.removeAll();

                Actions.PromotionsDetail({
                    StrApiDetail: data,
                    BoffApiDetail: promotionDataItem,
                    PromotionsItem,
                    callBack: () => {
                        getPromotionData(null, true);
                        Actions.pop();
                        Actions.pop();
                    },
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    return {
        promotionData,
        updatePromotionData,
        getPromotionData,
        getPromotionStatusDetail
    };
};

export default usePromotion;
export { usePromotion };

/**
 * Promotions 页面的业务逻辑 Hook
 * 
 * @param {Object} props - Hook 参数对象
 * @param {boolean} props.sportSB - 是否为体育投注模式
 * @param {Array|string} props.promotions - 优惠列表数据（空字符串表示加载中）
 * @param {Object} props.classifiedPromotions - 按分类组织的优惠数据
 * @param {Array} props.categories - 优惠分类列表
 * @param {Function} props.getPromotions - 获取优惠列表的方法
 * @param {Function} props.setPromoData - 设置优惠数据的方法
 * @param {Function} props.initialization - 初始化方法
 * @param {Function} props.navigateToPromotionsDetail - 导航到优惠详情页的方法
 * @param {Function} props.navigateToPromotion - 导航到优惠列表页的方法
 * @param {Object} props.toasts - Toast 提示对象
 * 
 * @returns {Object} Hook 返回值对象
 * @returns {number|null} returns.selectedCategoryId - 当前选中的分类ID
 * @returns {string} returns.selectedCategoryName - 当前选中的分类名称（小写）
 * @returns {boolean} returns.showFilteredRes - 是否显示筛选后的结果
 * @returns {Function} returns.getPromotionContent - 获取优惠详情的方法
 * @returns {Function} returns.selectCategory - 选择分类的方法
 * @returns {Function} returns.getFlatListData - 获取 FlatList 数据的方法
 * @returns {Function} returns.onCategoryFilter - 分类筛选事件处理方法
 * @returns {Function} returns.onFilterCallback - 筛选按钮点击事件处理方法
 */
export const usePromotions = (props) => {
    const {
        sportSB,
        promotions,
        classifiedPromotions,
        categories,
        getPromotions,
        setPromoData,
        initialization,
        navigateToPromotionsDetail,
        navigateToPromotion,
        toasts,
    } = props;

    // 当前选中的分类ID
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    // 当前选中的分类名称（小写）
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    // 是否显示筛选后的结果
    const [showFilteredRes, setShowFilteredRes] = useState(Boolean(sportSB));

    /**
     * 获取优惠详情
     * @param {Object} params - 参数对象
     * @param {string|null} params.promoId - 优惠ID
     * @param {Object} params.promotionItem - 优惠项数据
     * @param {Object} params.promotionStatusItem - 优惠状态项数据
     */
    const getPromotionContent = ({ promoId = null, promotionItem = {}, promotionStatusItem = {} }) => {
        toasts.loading(translate("加载中,请稍候..."), 10);
        const requestParams = {
            id: promoId,
        };

        PromotionDetail(requestParams)
            .then(promotionDetail => {
                toasts.removeAll();

                navigateToPromotionsDetail({
                    StrApiDetail: promotionDetail,
                    BoffApiDetail: promotionItem,
                    PromotionsItem: promotionStatusItem,
                    sportSB: sportSB,
                    callBack: () => {
                        navigateToPromotion();
                        initialization(selectedCategoryName);
                    },
                });
            })
            .catch(_error => {
                toasts.removeAll();
            });
    };

    /**
     * 选择分类
     * @param {Object} categoryItem - 分类项数据
     * @param {number} categoryItem.PromoCatID - 分类ID
     * @param {string} categoryItem.PromoCatCode - 分类代码
     */
    const selectCategory = (categoryItem) => {
        const { PromoCatID, PromoCatCode } = categoryItem;
        const newCategoryName = PromoCatCode.toLocaleLowerCase();

        setSelectedCategoryId(PromoCatID);
        setSelectedCategoryName(newCategoryName);

        // 直接执行筛选逻辑，使用新的值
        if (PromoCatID === null) {
            setShowFilteredRes(false);
            return;
        }
        if (PromoCatID == 0) {
            // 全部优惠分类
            if (!promotions) {
                getPromotions();
            }
            setShowFilteredRes(false);
            return;
        } else {
            // 指定优惠分类
            setPromoData(classifiedPromotions[newCategoryName]);
        }
        setShowFilteredRes(true);
    };

    /**
     * 将分类数据转换为 FlatList 需要的数组格式
     * @returns {Array|string} FlatList 数据数组，空字符串表示加载中
     */
    const getFlatListData = () => {
        // 如果 promotions 是空字符串，表示正在加载，返回空字符串以触发 CustomFlatList 的 loading 状态
        if (promotions === "") {
            return "";
        }

        // 如果显示筛选后的结果，直接返回 promotions 数组
        if (showFilteredRes) {
            return Array.isArray(promotions) ? promotions : [];
        }

        // 否则，将分类数据转换为数组格式
        if (!classifiedPromotions || !categories) {
            return [];
        }

        if (!Array.isArray(promotions) || promotions.length === 0) {
            return [];
        }

        const flatListData = [];
        categories.forEach(categoryItem => {
            if (categoryItem.PromoCatID !== 0 && categoryItem.resourcesName) {
                const categoryCode = categoryItem.PromoCatCode.toLocaleLowerCase();
                const categoryPromotions = classifiedPromotions[categoryCode];
                if (categoryPromotions && categoryPromotions.length > 0) {
                    // 添加分类项（包含 header 和该分类的所有优惠）
                    flatListData.push({
                        type: "category",
                        category: categoryItem,
                        promotions: categoryPromotions,
                        PromoCatCode: categoryItem.PromoCatCode,
                        key: `category-${categoryItem.PromoCatID}`,
                    });
                }
            }
        });

        return flatListData;
    };

    /**
     * 分类筛选事件处理方法
     * @param {Object} selectedCategory - 选中的分类数据
     * @param {string} selectedCategory.PromoCatCode - 分类代码
     */
    const onCategoryFilter = (selectedCategory) => {
        selectCategory(selectedCategory);

        PiwikEventDataHandle({
            eventTitle: "PromoMainPage7",
            customProperties: {
                "Promotion_C_Search_Category": selectedCategory.PromoCatCode,
            },
        });
    };

    /**
     * 筛选按钮点击事件处理方法
     */
    const onFilterCallback = () => {
        PiwikEventDataHandle("PromoMainPage5");
    };

    return {
        // State
        selectedCategoryId,
        selectedCategoryName,
        showFilteredRes,
        // Methods
        getPromotionContent,
        selectCategory,
        getFlatListData,
        // Event Handlers
        onCategoryFilter,
        onFilterCallback,
    };
};