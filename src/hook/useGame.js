import { useApp, ActionTypes } from "@/contexts/AppContext";

/**
 * 遊戲相關的自定義 Hook
 * 提供遊戲序列、分類、提供商等相關功能
 */
export const useGame = () => {
    const { gameSequences, _dispatch } = useApp();

    // 更新遊戲序列到 Context
    const updateGameSequences = (sequences) => {
        _dispatch({
            type: ActionTypes.SET_GAME_SEQUENCES,
            payload: sequences
        });
    };

    // 通过code获取分类名称（返回最外层分类的name）
    const getCategoryName = (code) => {
        if (!gameSequences || !code) return "";

        const normalizedCode = code?.toLowerCase?.()?.trim?.();

        // 先在主分类中查找
        const category = gameSequences?.find(item =>
            item?.code?.toLowerCase() === normalizedCode
        );
        if (category?.name) return category?.name;

        // 如果主分类中没找到，查找包含该子提供商的分类
        for (const category of gameSequences) {
            if (category?.subProviders) {
                const subProvider = category?.subProviders?.find(item =>
                    item?.code?.toLowerCase() === normalizedCode
                );
                if (subProvider) return category?.name; // 返回父分类的name
            }
        }

        return "";
    };

    // 通过子提供商code获取分类code
    const getCategoryCode = (subProviderCode) => {
        if (!gameSequences || !subProviderCode) return "";

        // First try to find direct category match
        const directCategory = gameSequences?.find(item =>
            item?.code?.toLowerCase() === subProviderCode?.toLowerCase()
        );
        if (directCategory?.code) return directCategory.code;

        // If no direct match, look in subProviders
        const category = gameSequences?.find(item =>
            item?.subProviders?.some(sub =>
                sub?.code?.toLowerCase() === subProviderCode?.toLowerCase()
            )
        );

        return category?.code || "";
    };

    // 通过code获取子提供商列表
    const getSubProviders = (code) => {
        if (!gameSequences || !code) return [];

        // 先尝试作为分类code查找
        const category = gameSequences?.find(item =>
            item?.code?.toLowerCase() === code?.toLowerCase()
        );
        if (category?.subProviders) return category?.subProviders;

        // 如果不是分类code，则作为子提供商code查找
        const parentCategory = gameSequences?.find(item =>
            item?.subProviders?.some(sub =>
                sub?.code?.toLowerCase() === code?.toLowerCase()
            )
        );
        return parentCategory?.subProviders || [];
    };

    // 获取子提供商映射对象
    const getSubProvidersMap = (code) => {
        const providers = getSubProviders(code);

        const providersMap = {}; //  providers 原本是数据， 特转化为对象
        providers.forEach(provider => {
            let { code = "" } = provider;
            if (code) {
                providersMap[code] = provider;
            }
        });

        return providersMap;
    };

    // 通过任意code获取对应的name
    const getProviderName = (code) => {
        if (!gameSequences || !code) return "";

        const normalizedCode = code?.toLowerCase?.()?.trim?.();

        // 在所有层级中查找匹配的code
        for (const category of gameSequences) {
            // 检查主分类
            if (category?.code?.toLowerCase() === normalizedCode) {
                return category?.name;
            }

            // 检查子提供商
            if (category?.subProviders) {
                const subProvider = category?.subProviders?.find(sub =>
                    sub?.code?.toLowerCase() === normalizedCode
                );
                if (subProvider?.name) {
                    return subProvider?.name;
                }
            }

            // 检查游戏列表（如果存在）
            if (category?.games) {
                const game = category?.games?.find(g =>
                    g?.code?.toLowerCase() === normalizedCode
                );
                if (game?.name) {
                    return game?.name;
                }
            }

            // 检查子提供商的游戏列表（如果存在）
            if (category?.subProviders) {
                for (const sub of category.subProviders) {
                    if (sub?.games) {
                        const game = sub?.games?.find(g =>
                            g?.code?.toLowerCase() === normalizedCode
                        );
                        if (game?.name) {
                            return game?.name;
                        }
                    }
                }
            }
        }

        return "";
    };

    return {
        gameSequences,
        updateGameSequences,
        getCategoryName,
        getCategoryCode,
        getSubProviders,
        getSubProvidersMap,
        getProviderName
    };
};

export default useGame;