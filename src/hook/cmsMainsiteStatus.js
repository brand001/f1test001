import { useApp, ActionTypes } from "@/contexts/AppContext";

/**
 * CMS 主站狀態相關的自定義 Hook
 * 提供 CMS 主站狀態管理功能
 */
export const useCmsMainsiteStatus = () => {
    const { cmsMainsiteStatus, _dispatch } = useApp();

    // 更新 CMS 主站狀態到 Context
    const updateCmsMainsiteStatus = (status) => {
        _dispatch({
            type: ActionTypes.SET_CMS_MAINSITE_STATUS,
            payload: status
        });
    };

    // 獲取 CMS 主站狀態，支援巢狀路徑
    const getCmsMainsiteStatus = (key) => {
        // 不傳參數時返回所有數據
        if (!key) return cmsMainsiteStatus;

        const keys = key.split(".");
        let result = cmsMainsiteStatus;

        for (const k of keys) {
            result = result?.[k];
            if (result === undefined || result === null) {
                return undefined;
            }
        }

        return result;
    };

    return {
        cmsMainsiteStatus,
        updateCmsMainsiteStatus,
        getCmsMainsiteStatus
    };
};

export default useCmsMainsiteStatus;

