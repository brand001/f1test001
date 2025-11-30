import moment from "moment/moment";

import { isManualType } from "$Utils";

/**
 * ==== 注意：freebet F1 全部沒使用，所以如果要開，下面相關code都要重新對接 ===
 */

/**
 * 只適用 type = general 和 dailydeal
 */
export async function PromotionList(params) {
    // type = 'general'
    let { type } = params;

    let cmsRows;
    let cmsRowsData = [];
    let bffBonusV1 = {};
    let bffBonusV2 = {};
    let bffHistoriesV1 = {};
    let bffHistoriesV2 = {};

    await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_PromotionList}type=${type}&`, "GET")
        .then(res => {
            cmsRows = res;
            cmsRowsData = res.data;
        })
        .catch(error => {
            console.log("CMSPromotionList error: ", error);
        });

    let IS_LOGIN_MEMBER = ApiPort.UserLogin;
    let promotionType = type;
    let IS_DAILY_DEAL_TYPE = promotionType === "daily";
    if (IS_LOGIN_MEMBER || IS_DAILY_DEAL_TYPE) {
        let startEndDate = [];
        if (cmsRowsData && cmsRowsData.length > 0) {
            let earlierStartDate = cmsRowsData[0].startDate; // "2022-03-28T04:00:00Z"
            let laterEndDate = cmsRowsData[0].endDate;

            for (let k = 0; k < cmsRowsData.length; k++) {
                if (k === 0) {
                    continue;
                }

                let data = cmsRowsData[k];

                if (earlierStartDate > data.startDate) {
                    earlierStartDate = data.startDate;
                }

                if (laterEndDate < data.endDate) {
                    laterEndDate = data.endDate;
                }
            }

            let earlierStartDateOnly = earlierStartDate.substr(0, earlierStartDate.indexOf("T"));
            let laterEndDateOnly = laterEndDate.substr(0, laterEndDate.indexOf("T"));
            startEndDate = [earlierStartDateOnly, laterEndDateOnly];
        }

        if (!startEndDate || startEndDate.length <= 0) {
            startEndDate = [moment().subtract(180, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")];
        }

        // start to setup bffBonus and bffHistories

        if (promotionType === "general") {
            const BONUS_TRANSACTION_TYPES = ["Deposit", "Transfer"];
            let transactionTypes = BONUS_TRANSACTION_TYPES;

            let response;
            let bonusDataV1 = {}; //跑for迴圈所以放外層
            let bonusDataV2 = {};

            await fetchRequest(ApiPort.BonusV2, "GET")
                .then(res => {
                    response = res;
                })
                .catch(error => {
                    console.log("V2GETBonuslistAPI error: ", error);
                });

            if (response && response.isSuccess) {
                for (let bonus of response.result) {
                    bonusDataV1[bonus?.id] = bonus;
                    if (bonus?.groupID) {
                        bonusDataV2[bonus.groupID] = bonus;
                    }
                }
            } // end of 200

            bffBonusV1 = bonusDataV1;
            bffBonusV2 = bonusDataV2;
            if (startEndDate[0] && startEndDate[1]) {
                await fetchRequest(ApiPort.AppliedHistory + `dateFrom=${startEndDate[0]} 00:00:00&dateTo=${startEndDate[1]} 23:59:59&`, "GET")
                    .then(res => {
                        response = res;
                    })
                    .catch(error => {
                        console.log("AppliedHistory error:", error);
                    });

                if (response && response.isSuccess) {
                    //按申請時間 遠->近 排序
                    if (response && response.result && response.result.length > 0) {
                        response.result.sort((a, b) => (a.appliedDate > b.appliedDate ? 1 : a.appliedDate == b.appliedDate ? 0 : -1));
                    }

                    let historyDataV1 = {};
                    let historyDataV2 = {};
                    for (let bonus of response.result) {
                        historyDataV1[bonus.bonusRuleGroupId] = bonus;
                        if (bonus.bonusRuleGroupId) {
                            historyDataV2[bonus.bonusRuleGroupId] = bonus;
                        }
                    }
                    bffHistoriesV1 = historyDataV1;
                    bffHistoriesV2 = historyDataV2;
                }
            }
        }
    }

    let rows = [];
    let mappingCampaignId = {};

    for (let i = 0; i < cmsRowsData.length; i++) {
        let dataRow = cmsRowsData[i];
        const thisBonusVersion = dataRow.bonusVersion ?? "1"; //FBM新版是2用groupID  舊版是1用bonusId
        const thisBffBonus = thisBonusVersion == 2 ? bffBonusV2[dataRow.bonus_id] : bffBonusV1[dataRow.bonus_id];
        const thisBffHistory = thisBonusVersion == 2 ? bffHistoriesV2[dataRow.bonus_id] : bffHistoriesV1[dataRow.bonus_id];

        let shouldFilterBonus = false; // default
        if (dataRow.visibility === "public") {
            shouldFilterBonus = false;
        } else {
            if (IS_LOGIN_MEMBER) {
                if (dataRow.visibility === "member" && dataRow.memberLevel === "eligible") {
                    let isHideForFrontend = !thisBffBonus && !thisBffHistory;
                    if (isHideForFrontend) {
                        shouldFilterBonus = true;
                    }
                } else if (promotionType === "daily") {
                    if (dataRow.memberLevel && dataRow.memberLevel === "predefined") {
                        if (!thisBffBonus?.isPredefinedMember) {
                            shouldFilterBonus = true;
                        }
                    }
                }
            } else {
                if (dataRow.visibility !== "public") {
                    shouldFilterBonus = true;
                }
            }
        }

        if (shouldFilterBonus) {
            continue;
        }

        const isManualPromo = isManualType(dataRow?.promotionType);
        const campaignId = dataRow?.campaignId || null;
        const needCampaignList = (dataRow.actionType === "APPLY_FORM" || dataRow.actionType === "NO_FORM") && campaignId;

        // 收集符合條件的 promoId 和 campaignId
        if (isManualPromo && needCampaignList) {
            mappingCampaignId[String(dataRow.promoId)] = String(campaignId); // 確保鍵和值都是字串
        }

        let row = {
            // 1Waleet Value
            displayStatus: dataRow?.promotionType == "Bonus" ? dataRow?.actionType : "NO_ACTION",
            campaignId: campaignId,
            isManualPreBonus: false,
            isManualItem: false,
            entryPeriodId: null,
            isReloadBonus: !dataRow.campaignId && !isManualPromo,
            givenAmount: null,

            // normal Value
            // bonus_id: dataRow?.bonus_id,
            promoTitle: dataRow.promoTitle,
            promoImage: dataRow.promoImage,
            promoImageAvif: dataRow.promoImageAvif || "",
            promoImageWebp: dataRow.promoImageWebp || "",
            promoId: dataRow.promoId,
            isSticky: dataRow.isSticky === 1,
            parentTid: dataRow.rootParentTid,
            parentName: dataRow.rootParentName,
            promotionType: dataRow?.promotionType || "",
            actionType:
                dataRow.actionType ||
                {
                    "-1": "NO_ACTION",
                    1: "FUND_IN",
                    2: "APPLY_FORM",
                    3: "SOS",
                    4: "LIVECHAT",
                    5: "DEPOSIT_PAGE_ONLY",
                }[dataRow.action_type],
            category: dataRow.category,
            labels: dataRow.labels,
            eligibilityOverride: dataRow.eligibilityOverride,
            visibility: dataRow.visibility || "",
            memberLevel: dataRow.memberLevel || "",
            startDate: dataRow.startDate,
            endDate: dataRow.endDate,
            bonusData: thisBffBonus, // BFF
            history: thisBffHistory, // BFF
        };
        rows.push(row);
    }

    // 提取所有的 campaignId
    const campaignIds = Object.values(mappingCampaignId).join(",");

    if (campaignIds) {
        try {
            const res = await fetchRequest(ApiPort.GETCampaignList + `campaignId=${campaignIds}&`);
            if (res?.isSuccess && res?.result?.data?.length > 0) {
                const campaignListData = res.result.data;

                // 使用 map 更新 rows
                rows = rows.map(row => {
                    const campaignData = campaignListData.find(campaign => String(campaign.campaignId) === String(row.campaignId));

                    if (campaignData) {
                        const entryPeriod = campaignData?.entryPeriod || {};
                        const campaignManualType = campaignData?.campaignManualType || "";

                        const givenAmount = campaignData?.participant?.givenAmount || null;
                        const displayStatus = entryPeriod?.displayStatus || null;
                        const entryPeriodId = entryPeriod?.id || null;
                        const isManualPreBonus = campaignManualType === "MANUAL_PRE_BONUS";
                        const isManualItem = campaignManualType === "MANUAL_ITEM";

                        // 返回更新後的 row
                        return {
                            ...row,
                            displayStatus,
                            entryPeriodId,
                            isManualPreBonus,
                            isManualItem,
                            givenAmount,
                        };
                    }

                    // 如果沒有匹配到，返回原始的 row
                    return row;
                });
            }
            rows.forEach(v => {
                let promotionType = v?.promotionType?.toLocaleUpperCase() || "";
                if (promotionType?.includes("MANUAL")) {
                    if (promotionType?.includes("PRE")) {
                        v.promotionType = "ManualPreBonus";
                    } else if (promotionType?.includes("ITEM")) {
                        v.promotionType = "ManualItem";
                    }
                } else if (promotionType?.includes("RELOAD")) {
                    v.promotionType = "ReloadBonus";
                }
            });
        } catch (error) {
            return rows;
        }
    }

    return rows;
}

/**
 * 只適用 type = general 和 dailydeal(且dailydeal的返回資料 .history會沒有數據)
 */
export async function PromotionDetail(params) {
    let IS_LOGIN_MEMBER = ApiPort.UserLogin;
    let { id, jumpfrom, campaignId } = params;
    let row = [];
    //API不再支援jumpfrom參數
    await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMS_Promotion}${campaignId ? "/campaign" : ""}?id=${campaignId ? campaignId : id}&`, "GET")
        .then(res => {
            row = res;
        })
        .catch(error => {
            console.log("CMSPromotionDetailOrList error:", error);
        });

    console.log("CMSPromotionDetail: ", row);

    if (Object.keys(row).length === 0) {
        return {}; // 如果返回为空，
    }

    //2024/05/14補充：
    //這個欄位promotionMainType 之前對接時，在 strapi 有改名字(改為 promoMainCategory )，但這裡沒改到，所以下面 if (isExistPromoData) { 這段一直都沒有用處
    //猜測應該是 promotion list 就有給到bonus和history了，所以detail沒給也沒關係
    //後面如果有需要，可以配置到正確值把他打開(type=general/dailydeal我有改到fbmv2版本，freebet和rebate沒動，需要額外處理)
    //另外注意: 這段裡面還有一個if => 只有從banner跳過來的，才會拿bonus

    // eslint-disable-next-line no-prototype-builtins
    let isExistPromoData = row && row.hasOwnProperty("promotionMainType");
    // console.log('isExistPromoData===', isExistPromoData);

    const thisBonusVersion = row.bonusVersion ?? "1"; //FBM新版是2用groupID  舊版是1用bonusId
    console.log("===promo", id, " is version: ", thisBonusVersion);

    //從banner跳轉的，額外拿bonusData(因為不是從promolist跳的，沒有promolist資料)
    if (isExistPromoData) {
        let bffBonus = {};
        let qs = params; // querystring object here from browser url
        if (qs.jumpfrom === "BANNER") {
            // append .bonusData into row

            const parentsName = row.promotionMainType;

            console.log("parentsName: ", parentsName);
            if (parentsName === "General") {
                const BONUS_TRANSACTION_TYPES = ["Deposit", "Transfer"];
                let transactionTypes = BONUS_TRANSACTION_TYPES;

                let bffResponse = [];
                // start of (var type_ of transactionTypes)
                let bonusData = {}; //跑for迴圈所以放外層
                for (let type_ of transactionTypes) {
                    await fetchRequest(ApiPort.BonusList + `transactionType=${type_}&`, "GET")
                        .then(res => {
                            bffResponse = res;
                        })
                        .catch(error => {
                            console.log("ApiPort.BonusList error:", error);
                        });

                    //console.log('bffResponse :', bffResponse);

                    if (bffResponse && bffResponse.isSuccess) {
                        let data = bffResponse.result;

                        for (let i = 0; i < data.length; i++) {
                            let bonus = data[i];
                            if (thisBonusVersion == 2) {
                                bonusData[bonus.groupID] = bonus;
                            } else {
                                bonusData[bonus.id] = bonus;
                            }
                        }
                    }
                } // end of (var type_ of transactionTypes)
                bffBonus = bonusData;
            } else if (parentsName === "Daily Deal") {
            } else if (parentsName == "Rebate") {
                //應該是用不到? //CXCMS-261 BEA-80885 FBMv2 補充：反水沒有用到這個function，且反水不在這次修改範圍，所以先不動，如果需要使用，再改成和其他類型一樣，返回用bonusid/groupid當key的map
                const dateRange = row.dateRange.split(" - "); // ['10/07/2021', '16:34', '11/01/2022', '15:10']

                let sdate = dateRange[0].split("/"); // ['10', '07', '2021']
                let sortSdate = sdate.pop();
                sdate.unshift(sortSdate);
                let startDate = sdate.join("-"); // '2021-10-07'

                let edate = dateRange[2].split("/");
                let sortEdate = edate.pop();
                edate.unshift(sortEdate);
                let endDate = edate.join("-");

                let response = [];
                let data = [];

                if (IS_LOGIN_MEMBER) {
                    if (startDate == endDate) {
                        await fetchRequest(ApiPort.RebateRunningDetails, "GET")
                            .then(res => {
                                response = res;
                                data = res;
                            })
                            .catch(error => {
                                console.log("RebateRunningDetails error:", error);
                            });
                    } else {
                        await fetchRequest(ApiPort.RebateHistories + `startDate=${startDate}&endDate=${endDate}&`, "GET")
                            .then(res => {
                                response = res;
                                data = res;
                            })
                            .catch(error => {
                                console.log("RebateHistories error:", error);
                            });
                    }
                    if (data) {
                        bffBonus = data?.result?.["rebateDetails"] || [];
                    }
                }
                //console.log('Rebate bffBonus :', bffBonus);
            }
            row.bonusData = bffBonus[row.bonusId];
        }
    }

    //daily deal和rebate用不到下面的(補拿history)

    // starting cloning PHP setBFFBonus function logic
    let DateRange = row.dateRange;
    let Date = DateRange.split("-");
    let Date0 = Date[0].trim().split("/");
    let StartDate = [Date0[2], Date0[0], Date0[1]].join("-");
    let Date2 = Date[2].trim().split("/");
    let EndDate = [Date2[2], Date2[0], Date2[1]].join("-");
    if (IS_LOGIN_MEMBER) {
        let resp;

        await fetchRequest(ApiPort.AppliedHistory + `dateFrom=${StartDate} 00:00:00&dateTo=${EndDate} 23:59:59&`, "GET")
            .then(res => {
                resp = res;
            })
            .catch(error => {
                console.log("AppliedHistory error: ", error);
            });

        // console.log('resp :', resp);

        if (resp && resp.isSuccess) {
            //按申請時間 遠->近 排序
            if (resp && resp.result && resp.result.length > 0) {
                resp.result.sort((a, b) => (a.appliedDate > b.appliedDate ? 1 : a.appliedDate == b.appliedDate ? 0 : -1));
            }

            let historyData = {};
            for (let bonus of resp.result) {
                if (thisBonusVersion == 2) {
                    historyData[bonus.bonusRuleGroupId] = bonus;
                } else {
                    historyData[bonus.bonusRuleId] = bonus;
                }
            }
            row.history = historyData[row.bonusId];
        }
    }
    return row;
}

/**
 * 只適用 type = general (包含manual promo)
 */
export async function GetAppliedHistory(params) {
    let IS_LOGIN_MEMBER = ApiPort.UserLogin;

    if (!IS_LOGIN_MEMBER) {
        return {
            isSuccess: true,
            result: [],
        };
    }

    // startDate && endDate = '2022-01-01'
    const { startDate, endDate, wallet } = params;
    console.log("CMSAPI 開始日期 ＝＝＝＝＝＝＝＝＝>", startDate);
    console.log("CMSAPI 結束日期 ＝＝＝＝＝＝＝＝＝>", endDate);
    function ksort(obj) {
        const keys = Object.keys(obj).sort(),
            sortedObj = {};
        for (let i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
    }

    let rows = [];
    let appliedHistoryResponse = []; //一般Promo申請紀錄(需要對應bonus)
    let manualHistoryResponse; //manual promo申請紀錄(沒有對應bonus)
    let bonusResponses = {};
    let page = 1; // 当前页码
    const pageSize = 200; // 每页大小

    for (let hasMorePages = true; hasMorePages; page++) {
        try {
            // Fetch 当前页的数据
            const res = await fetchRequest(ApiPort.AppliedHistory + `dateFrom=${startDate} 00:00:00&dateTo=${endDate} 23:59:59&pageIndex=${page}&perPageSize=${pageSize}&wallet=${wallet}&`, "GET");

            if (res.isSuccess && Array.isArray(res.result.bonusAppliedHistories)) {
                const currentData = res.result.bonusAppliedHistories;

                // 累加当前页数据到 appliedHistoryResponse
                appliedHistoryResponse = [...appliedHistoryResponse, ...currentData];

                // 如果当前页数据量小于每页大小，说明没有更多页了
                if (currentData.length < pageSize) {
                    hasMorePages = false;
                }
            } else {
                hasMorePages = false; // 请求失败或数据结构异常，停止请求
            }
        } catch (error) {
            console.log(`AppliedHistory error on page ${page}:`, error);
            break; // 遇到错误时退出循环
        }
    }

    // 按申请时间从远到近排序
    appliedHistoryResponse.sort((a, b) => (a.appliedDate > b.appliedDate ? 1 : a.appliedDate === b.appliedDate ? 0 : -1));

    console.log("Final Applied History Data: *****************************************", appliedHistoryResponse);

    if (Array.isArray(appliedHistoryResponse) && appliedHistoryResponse.length > 0) {
        //bff資料按v1/v2分組 (v1 用 bonusRuleId, v2 用 bonusRuleGroupId);
        let bffBonusAppliedDataV1 = appliedHistoryResponse.filter(v => !v.bonusRuleGroupId);
        let bffBonusAppliedDataV2 = appliedHistoryResponse.filter(v => v.bonusRuleGroupId);

        console.log("bffBonusAppliedDatas :", bffBonusAppliedDataV1, bffBonusAppliedDataV2);

        const bonusIdv1Arr = bffBonusAppliedDataV1.map(v => v.bonusRuleId);
        //v2因為後端已經先上了，會因為資料有groupId，被歸類到v2，但實際在strapi是存bonusRuleId，這樣會對不上，所以遇到v2資料，group id 和 bonus id 都要嘗試查看看
        const bonusIdv2Arr1 = bffBonusAppliedDataV2.map(v => v.bonusRuleId);
        const bonusIdv2Arr2 = bffBonusAppliedDataV2.map(v => v.bonusRuleGroupId);
        //去重複
        const unique_bonusIdv1Arr = bonusIdv1Arr.filter((item, index) => bonusIdv1Arr.indexOf(item) === index);
        const unique_bonusIdv2Arr1 = bonusIdv2Arr1.filter((item, index) => bonusIdv2Arr1.indexOf(item) === index);
        const unique_bonusIdv2Arr2 = bonusIdv2Arr2.filter((item, index) => bonusIdv2Arr2.indexOf(item) === index);

        //獲取promo資料by bonus id/group id
        const getCmsPromoDataByBffBonusAppliedHistory = async (idArr, apiUrl) => {
            let cmsRes = { success: false, data: [] };
            if (idArr && idArr.length > 0) {
                //分頁查詢,上限100
                const pageSize = 90; //取少一點
                const maxPageNo = Math.ceil(idArr.length / pageSize);
                for (let currentPageNo = 1; currentPageNo <= maxPageNo; currentPageNo++) {
                    const startIndex = (currentPageNo - 1) * pageSize;
                    const endIndex = Math.min(startIndex + pageSize, idArr.length);
                    const currentIdsArr = idArr.slice(startIndex, endIndex);
                    const currentIdsString = currentIdsArr.join(",");

                    let thisTmpResult = { success: false, data: [] };
                    await fetchRequestCMS(`${Strapi_Domain + apiUrl}${currentIdsString}&`, "GET")
                        .then(res => {
                            thisTmpResult = res;
                        })
                        .catch(error => {
                            console.log("AppliedHistory error: ", apiUrl, error, error?.message);
                        });

                    if (thisTmpResult && thisTmpResult.success && Array.isArray(thisTmpResult.data)) {
                        cmsRes.success = true;
                        cmsRes.data = cmsRes.data.concat(thisTmpResult.data);
                    }
                }
            }

            console.log("CMSresponse for :", apiUrl, JSON.parse(JSON.stringify(cmsRes)));
            return cmsRes;
        };

        const v1PromoDatas = await getCmsPromoDataByBffBonusAppliedHistory(unique_bonusIdv1Arr, ApiPort.CMSAppliedHistory + "bonusids/");
        const v2PromoDatas1 = await getCmsPromoDataByBffBonusAppliedHistory(unique_bonusIdv2Arr1, ApiPort.CMSAppliedHistory + "bonusids/");
        const v2PromoDatas2 = await getCmsPromoDataByBffBonusAppliedHistory(unique_bonusIdv2Arr2, ApiPort.CMSAppliedHistory + "bonusids/v2/");

        let null_index = 1; //用於找不到cms資料時，給一個不重複id
        //組成數據
        const makeBonusDatas = (cmsPromoData, bffBonusAppliedData, cmsPromoData2 = null) => {
            if (cmsPromoData && cmsPromoData.success && cmsPromoData.data) {
                let cmsResData = cmsPromoData.data;
                let cmsResData2 = null;
                if (cmsPromoData2 && cmsPromoData2.success && cmsPromoData2.data) {
                    cmsResData2 = cmsPromoData2.data;
                }
                for (let key = 0; key < bffBonusAppliedData.length; key++) {
                    const thisBonusAppliedData = bffBonusAppliedData[key];
                    let _nid = "";
                    let _title = "";
                    let _category = "";
                    let _type = "";

                    if (cmsResData2) {
                        //v2優先使用group id
                        for (let j = 0; j < cmsResData2.length; j++) {
                            const thisPromoData2 = cmsResData2[j];
                            if (thisPromoData2.bonus_id_val == thisBonusAppliedData.bonusRuleGroupId) {
                                _nid = thisPromoData2.nid;
                                _title = thisPromoData2.title;
                                _category = thisPromoData2.category;
                                _type = thisPromoData2.promotion_type;
                                break;
                            }
                        }
                    }
                    if (!_nid) {
                        //v1 或 v2用group id 找不到 => 用bonus Id
                        for (let j = 0; j < cmsResData.length; j++) {
                            const thisPromoData = cmsResData[j];
                            if (thisPromoData.bonus_id_val == thisBonusAppliedData.bonusRuleId) {
                                _nid = thisPromoData.nid;
                                _title = thisPromoData.title;
                                _category = thisPromoData.category;
                                _type = thisPromoData.promotion_type;
                                break;
                            }
                        }
                    }

                    bffBonusAppliedData[key].promotionId = _nid;
                    bffBonusAppliedData[key].promotionTitle = _title;
                    bffBonusAppliedData[key].promotionCategory = _category;
                    bffBonusAppliedData[key].promotionType = _type;
                    if (!_nid || bonusResponses[_nid]) {
                        _nid = "null" + null_index++;
                    }
                    bonusResponses[_nid] = bffBonusAppliedData[key];
                }
            }
        };

        makeBonusDatas(v1PromoDatas, bffBonusAppliedDataV1);
        makeBonusDatas(v2PromoDatas1, bffBonusAppliedDataV2, v2PromoDatas2);
    }

    // console.log('cmsApi bonusResponses : ', bonusResponses);

    await fetchRequest(ApiPort.MemberPromoHistories + `startDate=${startDate}&endDate=${endDate}&`)
        .then(res => {
            manualHistoryResponse = res;
        })
        .catch(error => {
            console.log("MemberPromoHistories error: ", error);
        });

    // console.log('MemberPromoHistories response :', response);

    let manualResponses = {};
    let promotionInfos = {};
    if (manualHistoryResponse && manualHistoryResponse.isSuccess) {
        for (let i = 0; i < manualHistoryResponse.result.manualPromoHistory.length; i++) {
            let data = manualHistoryResponse.result.manualPromoHistory;

            if (manualResponses[data[i].promoId]) {
                let manualSids = data[i].promoId + "_" + i;
                manualResponses[manualSids] = data[i];
            } else {
                manualResponses[data[i].promoId] = data[i];
            }
        }

        console.log("manualResponses :", manualResponses);
        const manualIdArr = manualHistoryResponse.result.manualPromoHistory.map(v => v.promoId);
        //去重複
        let unique_manualIdArr = manualIdArr.filter((item, index) => manualIdArr.indexOf(item) === index);
        let cmsRes = { success: false, data: [] };
        if (unique_manualIdArr && unique_manualIdArr.length > 0) {
            //分頁查詢,上限100
            const pageSize = 90; //取少一點
            const maxPageNo = Math.ceil(unique_manualIdArr.length / pageSize);
            for (let currentPageNo = 1; currentPageNo <= maxPageNo; currentPageNo++) {
                const startIndex = (currentPageNo - 1) * pageSize;
                const endIndex = Math.min(startIndex + pageSize, unique_manualIdArr.length);
                const currentIdsArr = unique_manualIdArr.slice(startIndex, endIndex);
                const currentIdsString = currentIdsArr.join(",");

                let thisTmpResult = { success: false, data: [] };
                await fetchRequestCMS(`${Strapi_Domain + ApiPort.CMSAppliedHistory}ids/${currentIdsString}&`, "GET")
                    .then(res => {
                        thisTmpResult = res;
                    })
                    .catch(error => {
                        console.log("CMSAppliedHistory error: ", error);
                    });

                if (thisTmpResult && thisTmpResult.success && Array.isArray(thisTmpResult.data)) {
                    cmsRes.success = true;
                    cmsRes.data = cmsRes.data.concat(thisTmpResult.data);
                }
            }
        }
        // console.log('CMSAppliedHistory cmsRes', cmsRes);

        if (cmsRes && cmsRes.success && cmsRes.data) {
            let data = cmsRes.data;
            for (let i = 0; i < data.length; i++) {
                let promotion = data[i];
                promotionInfos[promotion.nid] = promotion;
            }

            // console.log('promotionInfos : ', promotionInfos);

            for (let k in manualResponses) {
                let manualResp = manualResponses[k];
                if (!promotionInfos[manualResp.promoId]) {
                    continue;
                }
                let promoInfo = promotionInfos[manualResp.promoId];

                console.log("promoInfo : ", promoInfo);
                console.log("manualResponses : ", manualResponses);
                manualResponses[k].promotionId = promoInfo.nid;
                manualResponses[k].promotionTitle = promoInfo.title;
                manualResponses[k].promotionStartDate = promoInfo.startDate;
                manualResponses[k].promotionEndDate = promoInfo.endDate;
                manualResponses[k].promotionCategory = promoInfo.category;
                manualResponses[k].promotionType = {
                    bonusbutton: "Bonus",
                    applyform: "Manual",
                }[promoInfo.promotionType];
            }
        }
    }

    let sortBonusResponses = ksort(bonusResponses);
    let sortManualResponses = ksort(manualResponses);
    let rowBonus = Object.values(sortBonusResponses);
    let rowManual = Object.values(sortManualResponses);
    rows = rowBonus.concat(rowManual);
    console.log("GetAppliedHistory FINALY rowBonus ***************************", rowBonus);
    console.log("GetAppliedHistory FINALY rowManual ***************************", rowManual);
    console.log("GetAppliedHistory FINALY rows ***************************", rows);
    return rows;
}

/**
 * 只適用 type = rebate
 */
export async function GetRebateList(params) {
    let { startDate, endDate } = params;
    // 獲取當前日期
    const currentFormattedDate = moment(new Date()).utcOffset(8).format("YYYY-MM-DD");
    let bffData = {};
    if (startDate && endDate) {
        startDate = startDate.split(" ")[0];
        endDate = endDate.split(" ")[0];

        if (startDate === endDate && startDate === currentFormattedDate) {
            await fetchRequest(ApiPort.RebateRunningDetails, "GET")
                .then(res => {
                    bffData = res;
                })
                .catch(error => {
                    console.log("RebateRunningDetails error:", error);
                });
        } else {
            await fetchRequest(ApiPort.RebateHistories + `startDate=${startDate}&endDate=${endDate}&`, "GET")
                .then(res => {
                    bffData = res;
                })
                .catch(error => {
                    console.log("RebateHistories error:", error);
                });
        }
        // 如果沒帶日期，給default data
    } else {
        await fetchRequest(ApiPort.RebateRunningDetails, "GET")
            .then(res => {
                bffData = res;
            })
            .catch(error => {
                console.log("RebateRunningDetails error:", error);
            });
    }

    console.log("bffData: ", bffData);

    // if (!bffData) {
    //     return { result: [] };
    // }

    const rebateData = bffData?.result?.["rebateDetails"] || bffData?.result?.["memberRebateHistory"] || [];
    const rebateIdv1Arr = rebateData.filter(v => !v.groupId).map(v => v.rebateId);
    const rebateIdv2Arr = rebateData.filter(v => v.groupId).map(v => v.groupId);
    //去重複
    const unique_rebateIdv1Arr = rebateIdv1Arr.filter((item, index) => rebateIdv1Arr.indexOf(item) === index);
    const unique_rebateIdv2Arr = rebateIdv2Arr.filter((item, index) => rebateIdv2Arr.indexOf(item) === index);

    //獲取promo資料by rebate id
    const getRebatePromoDatas = async (idArr, apiUrl) => {
        let CMSresponse = { success: false, data: [] };
        if (idArr && idArr.length > 0) {
            //分頁查詢,上限100
            const pageSize = 90; //取少一點
            const maxPageNo = Math.ceil(idArr.length / pageSize);
            for (let currentPageNo = 1; currentPageNo <= maxPageNo; currentPageNo++) {
                const startIndex = (currentPageNo - 1) * pageSize;
                const endIndex = Math.min(startIndex + pageSize, idArr.length);
                const currentIdsArr = idArr.slice(startIndex, endIndex);
                const currentIdsString = currentIdsArr.join(",");

                let thisTmpResult = { success: false, data: [] };
                await fetchRequestCMS(apiUrl + currentIdsString + "&", "GET")
                    .then(res => {
                        thisTmpResult = res;
                    })
                    .catch(error => {
                        console.log("CMSRebateHistory error: ", apiUrl, error, error?.message);
                    });
                if (thisTmpResult && thisTmpResult.success && Array.isArray(thisTmpResult.data)) {
                    CMSresponse.success = true;
                    CMSresponse.data = CMSresponse.data.concat(thisTmpResult.data);
                }
            }
        }
        console.log("CMSresponse for :", apiUrl, JSON.parse(JSON.stringify(CMSresponse)));
        return CMSresponse;
    };

    const v1RebatePromoDatas = await getRebatePromoDatas(unique_rebateIdv1Arr, `${Strapi_Domain + ApiPort.CMSRebateHistory}`);
    const v2RebatePromoDatas = await getRebatePromoDatas(unique_rebateIdv2Arr, `${Strapi_Domain + ApiPort.CMSRebateHistory}` + "v2/");

    // if BFF 200 success
    let rebateDataV1 = {};
    let rebateDataV2 = {};
    const bffDataResult = rebateData;
    for (let i = 0; i < bffDataResult.length; i++) {
        let rebate = { ...bffDataResult[i] };
        let noRebateRecord = rebate.totalBetAmount == 0 && rebate.totalGivenAmount == 0;
        if (noRebateRecord) {
            continue;
        }
        if (rebate.groupId) {
            if (!rebateDataV2[rebate.groupId]) {
                rebateDataV2[rebate.groupId] = [];
            }
            rebateDataV2[rebate.groupId].push(rebate);
        } else {
            if (!rebateDataV1[rebate.rebateId]) {
                rebateDataV1[rebate.rebateId] = [];
            }
            rebateDataV1[rebate.rebateId].push(rebate);
        }
    }

    console.log("rebateDatas :", rebateDataV1, rebateDataV2);

    //使用promo + rebate紀錄，組成rebate數據
    const makeRebateDatas = (CMSresponse, rebateData, rows) => {
        if (CMSresponse && CMSresponse.data) {
            for (let bonusId in rebateData) {
                let promoForThisRebate = null;
                for (let i = 0; i < CMSresponse.data?.length; i++) {
                    const thisPromo = CMSresponse.data[i];
                    if (thisPromo?.bonus_id_val == bonusId) {
                        promoForThisRebate = thisPromo;
                    }
                }

                //找不到對應promo就不展示
                if (!promoForThisRebate) {
                    continue;
                }

                let rebateArray = rebateData[bonusId];
                for (let r of rebateArray) {
                    let row = {
                        ...r,
                        promotionId: promoForThisRebate.nid,
                        promotionTitle: promoForThisRebate.title,
                        promotionCategory: promoForThisRebate.category,
                    };
                    rows.result.push(row);
                }
            }
        }
    };

    let rows = { result: [] };
    makeRebateDatas(v1RebatePromoDatas, rebateDataV1, rows);
    makeRebateDatas(v2RebatePromoDatas, rebateDataV2, rows);

    console.log("RebateList rows : ", rows);
    return rows;
}
