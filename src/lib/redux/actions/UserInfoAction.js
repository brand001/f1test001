import { Decimal } from "decimal.js";
import { translate } from "$locales/translate";
import { judgeMemberStatus } from "$Utils/quelea.js";

import { getInitialState } from "../reducers/UserInfoReducer";
import Types from "./types";

//用戶登入
export const ACTION_UserInfo_login = userName => {
    const payload = { ...getInitialState(), isLogin: true, userName: userName };
    const action = {
        type: Types.ACTION_USERINFO_UPDATE,
        payload: payload,
    };
    return action;
};

//用戶登出
export const ACTION_UserInfo_logout = () => {
    // 登出時清空快取的錢包分組，確保下次登入首次查餘額會重新拉取並合併
    walletData = [];
    hasFetchedWalletGroup = false;
    isFetchingWalletGroup = false;
    pendingWalletGroupPromise = null;
    const action = {
        type: Types.ACTION_USERINFO_UPDATE,
        payload: getInitialState(),
    };

    return action;
};

function hasContactStatusChangedToVerified(oldContacts = [], newContacts = []) {
    const getStatus = (contacts, type) => contacts?.find(c => c?.contactType === type)?.status?.toLocaleLowerCase();
    const unverified = "unverified"?.toLocaleLowerCase();
    const verified = "verified"?.toLocaleLowerCase();

    const oldPhoneStatus = getStatus(oldContacts, "Phone");
    const oldEmailStatus = getStatus(oldContacts, "Email");
    const newPhoneStatus = getStatus(newContacts, "Phone");
    const newEmailStatus = getStatus(newContacts, "Email");

    const oldHasUnverified = oldPhoneStatus === unverified || oldEmailStatus === unverified;
    const newAllVerified = newPhoneStatus === verified && newEmailStatus === verified;

    return {
        phoneStatus: newPhoneStatus === verified,
        emailStatus: newEmailStatus === verified,
        allStatus: oldHasUnverified && newAllVerified
    };
}

// 更新用戶資料
export function ACTION_UserInfo_updateMemberInfo({ result = {}, showDisplayReferee = false } = { result: {}, showDisplayReferee: false }) {
    return async (dispatch, getState) => {
        // 如果没有数据，则请求 API 获取最新的 `memberInfo`
        if (Object.keys(result).length <= 0) {
            try {
                const data = await fetchRequest(window.ApiPort.Member, "GET");
                result = data?.result;
            } catch (error) {
                return;
            }
        }

        let oldContacts = getState()?.userInfo?.memberInfo?.contacts;
        let newContacts = result?.memberInfo?.contacts;
        let { phoneStatus, emailStatus, allStatus } = hasContactStatusChangedToVerified(oldContacts, newContacts);
        result.memberInfo.phoneStatus = phoneStatus;
        result.memberInfo.emailStatus = emailStatus;

        dispatch({
            type: Types.ACTION_USERINFO_UPDATE,
            payload: result,
        });


        if (showDisplayReferee) {
            await judgeMemberStatus();
        }



        if (allStatus) {
            await judgeMemberStatus();
        }
        return Promise.resolve();
    };
}

const TempBalances = [
    {
        walletProductGroupId: 1,
        get walletProductGroupName() {
            return translate("总余额");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "MAIN",
    },
    {
        walletProductGroupId: 2,
        get walletProductGroupName() {
            return translate("体育/电竞");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "SB",
    },
    {
        walletProductGroupId: 4,
        get walletProductGroupName() {
            return translate("真人");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "LD",
    },
    {
        walletProductGroupId: 24,
        get walletProductGroupName() {
            return translate("棋牌/小游戏/捕鱼");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "P2P",
    },
    {
        walletProductGroupId: 32,
        get walletProductGroupName() {
            return translate("老虎机");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "SLOT",
    },
    {
        walletProductGroupId: 64,
        get walletProductGroupName() {
            return translate("彩票");
        },
        balance: 0,
        lockedBalance: 0,
        usableAmount: 0,
        walletProductGroupCode: "KENO",
    },
];

// 以預設配置建立 id -> code 的映射，作為 getWalletGroup 失敗時的回退
const idToCodeMap = TempBalances.reduce((acc, item) => {
    acc[item.walletProductGroupId] = item.walletProductGroupCode;
    return acc;
}, {});

export const ACTION_UserInfo_updateBalance = newBalance => {
    const action = {
        type: Types.ACTION_USERINFO_UPDATE,
        payload: { balanceTotal: newBalance },
    };
    return action;
};

//查詢SB餘額(因為需要展示 總餘額，所以這個API直接 改查全部餘額)
export const ACTION_UserInfo_getBalanceSB = (forceUpdate = false) => {
    //直接改查全部
    return ACTION_UserInfo_getBalanceAll(forceUpdate);
};

let walletData = [];
let hasFetchedWalletGroup = false; // 僅當成功獲取且可用時才標記為已獲取
let isFetchingWalletGroup = false; // 併發控制
let pendingWalletGroupPromise = null;
async function getWalletGroup() {
    try {
        const data = await fetchRequest(ApiPort.WalletGroup, "GET");
        if (!data?.isSuccess) return [];
        return data?.result || [];
    } catch (error) {
        return [];
    }
}

// 確保僅在成功獲取後才標記 hasFetchedWalletGroup，失敗則保留為 false 以便下次重試
async function ensureWalletGroupFetched() {
    if (hasFetchedWalletGroup && Array.isArray(walletData) && walletData.length > 0) {
        return walletData;
    }
    if (isFetchingWalletGroup && pendingWalletGroupPromise) {
        return pendingWalletGroupPromise;
    }
    isFetchingWalletGroup = true;
    pendingWalletGroupPromise = getWalletGroup()
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                walletData = data;
                hasFetchedWalletGroup = true; // 只有成功取得有效資料時才標記
            }
            isFetchingWalletGroup = false;
            return walletData;
        })
        .catch(() => {
            isFetchingWalletGroup = false;
            return [];
        });
    return pendingWalletGroupPromise;
}

function transformWalletData(walletData) {
    const result = {};
    walletData.forEach(item => {
        const code = item.walletProductGroupCode || idToCodeMap[item.walletProductGroupId];
        if (!code) return; // 無法識別則跳過，避免出現 undefined key
        result[code] = { ...item, walletProductGroupCode: code };
    });
    return result;
}

//查詢全部餘額
export function ACTION_UserInfo_getBalanceAll(forceUpdate = false) {
    return (dispatch) => {
        if (!ApiPort.UserLogin) return Promise.resolve(); //沒登入不用處理
        //10秒節流，避免短時間頻繁調用
        if (global._getBalanceAll_throttle_handle && !forceUpdate) {
            //console.log('===太頻繁...跳過getBalanceAll...')
            return Promise.resolve({ type: "throttled" });
        }
        if (!forceUpdate) {
            global._getBalanceAll_throttle_handle = setTimeout(function() {
                clearTimeout(global._getBalanceAll_throttle_handle);
                global._getBalanceAll_throttle_handle = null;
                //console.log('===clear getBalanceAll handle', JSON.stringify(global._getBalanceAll_throttle_handle));
            }, 10 * 1000); //10秒節流
        }
        const updateGettingBalance = {
            type: Types.ACTION_USERINFO_UPDATE,
            payload: { isGettingBalance: true },
        };
        dispatch(updateGettingBalance);
        return fetchRequest(window.ApiPort.Balance, "GET")
            .then(async res => {
                let payload = {
                    allBalance: [],
                    balanceTotal: 0,
                    balanceSB: 0,
                    isGettingBalance: false,
                    totalContractBalance: 0,
                    withdrawableBalance: 0,
                    isToggleBalance: false,
                    balanceObj: {},
                };

                let result = res?.result;

                if (result) {
                    let balances = result?.balances;
                    if (!(Array.isArray(balances) && balances.length)) return;

                    // 僅在成功獲取後才會標記為已獲取，否則下次 balance 會再次嘗試
                    await ensureWalletGroupFetched();

                    let tempBalances = balances || TempBalances;
                    if (walletData && walletData.length > 0) {
                        tempBalances = balances.map(itemA => {
                            const matchB = walletData.find(itemB => itemB.walletProductGroupId === itemA.walletProductGroupId);
                            if (matchB) {
                                // Keep name from Balance API (itemA), supplement other fields from WalletGroup (matchB)
                                return { ...matchB, ...itemA };
                            }
                            return itemA;
                        });
                    }

                    if (tempBalances?.[0]) {
                        tempBalances[0].walletProductGroupName = translate("总余额");
                    }
                    payload.allBalance = tempBalances;

                    //更新總餘額
                    payload.balanceTotal = result?.totalBalance;
                    // 鎖定金額
                    payload.totalContractBalance = result?.totalContractBalance;
                    // 可提款金額
                    payload.withdrawableBalance = result?.withdrawableBalance;
                    // 顯示金額
                    payload.isToggleBalance = result?.isWithdrawalContractBalanceBlocking;
                    payload.balanceObj = transformWalletData(tempBalances);
                    payload.uasbleAmount = result?.uasbleAmount || 0;

                    //返回是數組
                    //balance: 3795.51
                    //category: "TotalBal"
                    //localizedName: "总余额"
                    //name: "TotalBal"
                    //state: "Available"

                    payload.balanceSB = tempBalances.find(v => v?.walletProductGroupId == 2 || v?.walletProductGroupCode == "SB")?.balance;
                }

                const action = {
                    type: Types.ACTION_USERINFO_UPDATE,
                    payload: payload,
                };

                dispatch(action);
                return Promise.resolve(action);
            })
            .catch((error) => {
                const updateGettingBalance = {
                    type: Types.ACTION_USERINFO_UPDATE,
                    payload: { isGettingBalance: false },
                };
                dispatch(updateGettingBalance);
                return Promise.reject(error);
            });
    };
}