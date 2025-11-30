import { useState, useEffect } from "react";
import { PromotionList } from "@/actions/CmsApi";
import { GetWalletProductGroupNameMapImg } from "@/images/index.js";
import { translate } from "@/locales/translate";

/**
 * PromoTab 页面的业务逻辑 Hook
 * 
 * @param {Object} props - Hook 参数对象
 * @param {boolean} props.sportSB - 是否为体育投注模式
 * 
 * @returns {Object} Hook 返回值对象
 * @returns {number} returns.activetab - 当前激活的 tab 索引
 * @returns {string|Array} returns.promotionsData - 优惠列表数据（空字符串表示加载中）
 * @returns {Array} returns.generalCategories - 通用分类列表
 * @returns {Array} returns.rebateCategories - 返水分类列表
 * @returns {Object} returns.classifiedPromotions - 按分类组织的优惠数据
 * @returns {number} returns.bonusListTabsActive - 我的优惠 tab 的激活索引
 * @returns {Function} returns.setPromoData - 设置优惠数据的方法
 * @returns {Function} returns.getPromotions - 获取优惠列表的方法
 * @returns {Function} returns.initialization - 初始化方法
 * @returns {Function} returns.onTabChange - Tab 切换处理方法
 * @returns {Function} returns.onBonusTabChange - 更改我的优惠 tab 的方法
 */
export const usePromoTab = ({ sportSB }) => {
    // 当前激活的 tab 索引
    const [activetab, setActivetab] = useState(0);
    // 优惠列表数据（空字符串表示加载中）
    const [promotionsData, setPromotionsData] = useState("");
    // 通用分类列表
    const [generalCategories, setGeneralCategories] = useState([]);
    // 返水分类列表
    const [rebateCategories, setRebateCategories] = useState([]);
    // 按分类组织的优惠数据
    const [classifiedPromotions, setClassifiedPromotions] = useState({});
    // 我的优惠 tab 的激活索引
    const [bonusListTabsActive, setBonusListTabsActive] = useState(1);

    /**
     * 獲取CMS優惠分類
     * @return {Promise<Array>} 優惠分類
     */
    const getCategory = () => {
        return window.fetchRequestCMS(window.Strapi_Domain + window.ApiPort.CMS_PromotionCategory, "GET")
            .then(data => {
                return Promise.resolve(data);
            })
            .catch(_error => {
                return Promise.reject();
            });
    };

    /**
     * 設置分類數據
     * @param {Array} categoryData - 分類數據
     * @return {Promise<void>}
     */
    const setCategory = (categoryData) => {
        if (categoryData.length === 0) {
            return Promise.reject("array is empty");
        }

        const allCategory = {
            PromoCatID: 0,
            PromoCatCode: "all",
            languageCode: "",
            resourcesName: translate("全部"),
            promoCatImageUrl: GetWalletProductGroupNameMapImg("ALL"),
        };
        const categories = categoryData;
        const classifiedPromotionsMap = {};
        const generalCategoriesList = categories.filter(categoryItem => categoryItem?.parentName?.toLocaleLowerCase() === "General"?.toLocaleLowerCase());
        const rebateCategoriesList = categories.filter(categoryItem => categoryItem?.parentName?.toLocaleLowerCase() === "Rebate"?.toLocaleLowerCase());
        generalCategoriesList.unshift(allCategory);
        rebateCategoriesList.unshift(allCategory);
        //先按api排序好
        categoryData.forEach(categoryItem => {
            classifiedPromotionsMap[categoryItem.PromoCatCode.toLocaleLowerCase()] = new Array();
        });

        setClassifiedPromotions(classifiedPromotionsMap);
        setGeneralCategories(generalCategoriesList);
        setRebateCategories(rebateCategoriesList);

        return Promise.resolve();
    };

    /**
     * 分类整理所有优惠数据
     * @param {Array} promotionDataList - 优惠数据列表
     * @param {string} selectedCategoryCode - 选中的分类代码
     * @return {Promise<void>}
     */
    const sortPromotions = (promotionDataList, selectedCategoryCode) => {
        if (!promotionDataList) {
            return Promise.reject("error in sortPromotions");
        }

        setClassifiedPromotions(prevClassifiedPromotions => {
            const newClassifiedPromotionsMap = {};
            // 先初始化所有分类的空数组
            Object.keys(prevClassifiedPromotions).forEach(categoryKey => {
                newClassifiedPromotionsMap[categoryKey] = [];
            });

            // 分类整理优惠数据
            promotionDataList.forEach(promotionItem => {
                for (var categoryCode in prevClassifiedPromotions) {
                    const categoryMatch = sportSB ? "sports" : categoryCode.toLocaleLowerCase();
                    if (promotionItem.category && promotionItem.category.find(category => category.toLocaleLowerCase() === categoryMatch.toLocaleLowerCase())) {
                        newClassifiedPromotionsMap[categoryCode].push(promotionItem);
                    }
                }
            });

            // 设置优惠数据
            const selectedCategoryPromotions = newClassifiedPromotionsMap[selectedCategoryCode];
            setPromotionsData(selectedCategoryPromotions ? selectedCategoryPromotions : promotionDataList);

            return newClassifiedPromotionsMap;
        });

        return Promise.resolve();
    };

    /**
     * 初始頁面加載
     * @param {string} selectedCategoryCode - 选中的分类代码
     */
    const initialization = async (selectedCategoryCode = "") => {
        const requestParams = {
            type: "general",
            transactionType: "",
            wallet: "",
        };

        try {
            const [categoryData, promotionDataList] = await Promise.all([getCategory(), PromotionList(requestParams)]);
            // 整理分類數據
            await setCategory(categoryData);
            // 整理優惠數據
            await sortPromotions(promotionDataList, selectedCategoryCode);
        } catch (error) {
            console.error("初始化失败:", error);
        }
    };

    /**
     * 获取优惠数据
     * @return {Promise<Array>} 优惠列表
     */
    const getPromotions = () => {
        const requestParams = {
            type: "general",
            transactionType: "",
            wallet: "",
        };
        return PromotionList(requestParams)
            .then(promotionListData => {
                return Promise.resolve(promotionListData);
            })
            .catch(_error => {});
    };

    /**
     * 设置优惠数据
     * @param {Array|string} promotionData - 优惠数据
     */
    const setPromoData = (promotionData) => {
        setPromotionsData(promotionData);
    };

    /**
     * Tab 切换处理方法
     * @param {number} tabIndex - Tab 索引
     * @param {number|null} bonusTabIndex - 可选的 bonusListTabsActive 值，如果不提供则重置为 1
     */
    const onTabChange = (tabIndex, bonusTabIndex = null) => {
        if (tabIndex == 0) {
            // 切换到第一个 tab 时重新初始化
            const selectedCategoryCode = sportSB ? "sports" : "";
            initialization(selectedCategoryCode);
        }
        setActivetab(tabIndex);
        setBonusListTabsActive(bonusTabIndex !== null ? bonusTabIndex : 1);
    };

    /**
     * 更改我的优惠 tab 的方法
     * @param {number} bonusTabIndex - Tab 索引
     */
    const onBonusTabChange = (bonusTabIndex) => {
        setBonusListTabsActive(bonusTabIndex);
    };

    // 初始化数据加载
    useEffect(() => {
        const selectedCategoryCode = sportSB ? "sports" : "";
        initialization(selectedCategoryCode);
    }, []);

    return {
        // State
        activetab,
        promotionsData,
        generalCategories,
        rebateCategories,
        classifiedPromotions,
        bonusListTabsActive,
        // Methods
        setPromoData,
        getPromotions,
        initialization,
        onTabChange,
        onBonusTabChange,
    };
};

