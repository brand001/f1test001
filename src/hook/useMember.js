import { useApp, ActionTypes } from "@/contexts/AppContext";

/**
 * 會員相關的自定義 Hook
 * 提供會員資料管理功能
 */
export const useMember = () => {
    const { memberData, _dispatch } = useApp();
    // 更新會員資料到 Context（通過 API 獲取）
    const updateMemberData = async () => {
        try {
            const data = await window.fetchRequest(window.ApiPort.Member, "GET");

            // 只取 memberInfo 數據
            const memberInfo = data?.result?.memberInfo;
            if (!memberInfo) {
                console.warn("No memberInfo found in response");
                return null;
            }

            // 合併 memberNewInfo 到 memberInfo
            if (data?.result?.memberNewInfo) {
                Object.assign(memberInfo, data.result.memberNewInfo);
            }

            // 處理 contacts 數組，轉換為 contactsMap 對象
            if (memberInfo?.contacts) {
                const contacts = memberInfo.contacts;
                const contactsMap = {};

                contacts.forEach(contact => {
                    const { contactType, status } = contact;
                    const key = contactType.toLowerCase();
                    contactsMap[key] = {
                        ...contact,
                        verified: status === "Verified"
                    };
                });

                // 將 contactsMap 添加到 memberInfo 中
                memberInfo.contactsMap = contactsMap;
            }

            _dispatch({
                type: ActionTypes.SET_MEMBER_DATA,
                payload: memberInfo
            });
            console.log("Member data stored:", memberInfo, 123456);
            console.log("displayReferee value:", memberInfo.displayReferee);
            return memberInfo;
        } catch (error) {
            console.error("Failed to fetch member data:", error);
            throw error;
        }
    };

    // 獲取會員資料，支援巢狀路徑
    const getMemberData = (key) => {
        // 不傳參數時返回所有數據
        if (!key) return memberData;

        const keys = key.split(".");
        let result = memberData;

        for (const k of keys) {
            result = result?.[k];
            if (result === undefined || result === null) {
                return undefined;
            }
        }

        return result;
    };

    return {
        memberData,
        updateMemberData,
        getMemberData
    };
};

export default useMember;
