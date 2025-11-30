import { Alert, Platform } from "react-native";
import { Actions } from "react-native-router-flux";

import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";
import { processImageFormats, ServerErrorHandle } from "$Utils";
import { timeout_fetch } from "$Utils/SportRequest";

import { loggingPramsHandle } from "./Log";
const REG_CMS_STATIC_ASSET_DOMAINS = ["cache\.uiwhed\.com", "cmsapisl[2]?\.fun88\.biz", "cmsapistag[1-4]?\\.fun88\\.biz"];


//window.common_url = 'https://gatewayrb88sl.gamealiyun.com';   //live

let apiversion = "api-version=1.0&Platform=" + Platform.OS.toUpperCase();
// let apiversion = "api-version=2.0&brand=tlc&Platform=" + Platform.OS;
/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @param {JSON} errorPopupStyle 錯誤訊息提示用Toast還是Toasts，默認Toast
 * @return 返回Promise
 */
//使用Febff api
const useFebff = [
    // payment
    "/api/Payment/DepositAccountByAmount",
    "/api/Payment/v2.0/Methods/Details",
    "/api/Payment/MemberBanks/GetMemberBankAccountsByType", // 现行Live M2 银行卡管理， 充值 和 （提款 银行卡管理）不同， ohohohohhoh

    "/api/Payment/DepositAccountByAmount",
    "/api/Payment/BindReverseDepositAccount",
    "/api/Payment/GetDepositStepTwoInProgressDetails",
    "/api/Payment/Transaction/GetDepositStepTwoInProgressDetails",
    "/api/Payment/InsertMemberDepositStepTwoAccessRecord",
    "/api/Payment/UpdateMemberDepositStepTwoCompleted",
];

window.siteId = Platform.OS === "android" ? 39 : 40;
window.fetchRequest = (url, method, params = "") => {
    /* ----------------------------------------------------------------------------
   1. febff api 使用xbffKey：'FvCImRbajDiysV9ttN728w=='，
   2. febff api中只有 Login || member || febff game module相關api使用 version8.0
   3. febff中的 Payment api 不使用 version8.0跟 8.0 xbffKey
  ---------------------------------------------------------------------------- */

    // 检查 URL 是否在 useFebff 列表中且不是 /api/Payment 开头
    const isPayment = url?.toLocaleLowerCase()?.startsWith("/api/payment");
    let domainApi = isPayment ? window.common_url : window.bffsc_url;
    const xbffKey = isPayment ? ApiPort.X_Biff_key : "FvCImRbajDiysV9ttN728w==";
    const apiversion = isPayment ? "api-version=1.0&Platform=" + Platform.OS : "api-version=8.0&Platform=" + Platform.OS;
    if (useFebff?.includes(url?.split("?")[0])) {
        domainApi = window.bffsc_url;
    }

    let header = {
        "Content-Type": "application/json charset=utf-8",
        Culture: window.DefaultConfig?.Culture,
        "x-bff-key": xbffKey,
    };
    if (ApiPort.UserLogin == true) {
        header.Authorization = ApiPort.Token;
    }

    let headerData;

    let fetchParams = {
        method: method,
        headers: header,
    };

    let logData = {
        method: method,
        requestTime: new Date(),
        responseData: null,
        fetchParams,
        api_url: domainApi + url + apiversion,
        api_category: "Flash api",
    };

    return new Promise(function(resolve, reject) {
        if (params !== "") {
            fetchParams.body = JSON.stringify(params);
        }

        timeout_fetch(fetch(domainApi + url + apiversion, fetchParams))
            .then(response => ((logData.responseObj = response), (headerData = response.json())))
            .then(responseData => {
                logData.responseData = responseData;
                loggingPramsHandle(logData);
                resolve(responseData);
                ServerErrorHandle({ responseData, params });
            })
            .catch(err => {
                // console.log('回调 失败err:', JSON.stringify(err)); //网络请求失败返回的数据
                reject(err);
                Toasts.removeAll();
                logData.error = err;
                loggingPramsHandle(logData);
            });
    });
};

// fetch CMS API
window.fetchRequestCMS = (url, method, params = "", timeout = 50000) => {
    return new Promise(function(resolve, reject) {
        let fetchParams = {
            method: method,
            headers: {
                token: window.CMS_token,
            },
        };
        if (params !== "") {
            fetchParams.body = JSON.stringify(params);
        }
        if (ApiPort.UserLogin) {
            fetchParams.headers.Authorization = ApiPort.Token;
        }

        let headerData;
        let logData = {
            method: method,
            requestTime: new Date(),
            responseData: null,
            fetchParams,
            api_url: url + apiversion,
            api_category: "CMS api",
        };

        timeout_fetch(fetch(url, fetchParams), timeout)
            .then(response => ((logData.responseObj = response), (headerData = response.json())))
            .then(async responseData => {
                console.log("window.fetchRequestCMS responseData ------------>", responseData);
                // 只有GET並且API成功，才去替換 image path
                if (method === "GET" && logData.responseObj.status === 200) {
                    try {
                        let s = JSON.stringify(responseData);
                        for (let v of REG_CMS_STATIC_ASSET_DOMAINS) {
                            let re = new RegExp("http(s)?:\\/\\/" + v, "gi");
                            if (re.test(s)) {
                                responseData = JSON.parse(s.replace(re, window.Strapi_Domain));
                                break;
                            }
                        }
                    } catch (error) {
                        console.error("Error processing response:", error);
                    }
                }
                responseData = await processImageFormats(responseData);
                resolve(responseData);

                logData.responseData = responseData;
                loggingPramsHandle(logData);
            })
            .catch(err => {
                reject(err);
                logData.error = err;
                loggingPramsHandle(logData);
            });
    });
};

export default {
    timeout_fetch,
};
