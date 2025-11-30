/*
 * mobile logging
 */
import { cloneDeep } from "lodash";
import moment from "moment/moment";
import { Platform } from "react-native";
import store from "@/lib/redux/store/index.js";

import { apiCategoryToApiMapping } from "./logConfig";
import { timeout_fetch } from "$Utils/SportRequest";

// 涉及到會員隱私的api，需過濾
const API_PRIVACY_PATHS = [
    "/api/Auth/Login",
    "/api/Payment/MemberBanks",
    "/api/Member?api-version",
    "/api/Auth/ChangePassword",
    "api/mobile/GETMEMBERBYTOKEN", // IM GETMEMBERBYTOKEN
    "api/sportsdata/auth/v2/login", // BTI 登入
    "api/Vendor/GameToken", // 一般 get GameToken
    "api/sportsdata/auth/v2/renew", // BTI renew
    "/v1/login",
];

const formatString = "YYYY-MM-DD HH:mm:ss SSS";
const timeZoneOffset = 8;

export function loggingPramsHandle(data) {
    if (__DEV__) return;
    if (window.isStaging == "ST" || window.isStaging == "SL") return;
    try {
        let { api_url, api_category, responseData, method, responseObj, requestTime, fetchParams, error = null, from = "" } = data;

        let processedResponseData;
        const response_time = moment(new Date()).utcOffset(timeZoneOffset).format(formatString);
        const request_time = moment(new Date(requestTime)).utcOffset(timeZoneOffset).format(formatString);
        let isCms = api_category === "CMS api";
        let appVersion = window.Rb88Version;
        // let appVersion = "2.0";

        // 涉及到會員隱私的api，需過濾
        const FilterApiData = Boolean(API_PRIVACY_PATHS.find(v => api_url.includes(v)));

        let errorData = null;

        if (error) {
            //避免日誌拿到空的error
            if (error && JSON.stringify(error) === "{}") {
                let newError = {};
                if (error.message) {
                    newError.message = error.message;
                }
                if (error.stack) {
                    newError.stack = error.stack;
                }
                if (JSON.stringify(newError) !== "{}") {
                    errorData = newError;
                }
            } else {
                errorData = error;
            }
        }

        if (FilterApiData) {
            processedResponseData = !responseData ? responseData : filterloggingObj(responseData);
            if (fetchParams.body) {
                const parsedBody = JSON.parse(fetchParams.body);
                fetchParams.body = filterloggingObj(parsedBody);
            }
        } else {
            processedResponseData = responseData;
        }

        if (errorData) {
            processedResponseData = { processedResponseData, error: errorData };
        }

        // Flash app_version
        // if (!isCms && from === "SB") {
        //   appVersion = getApiVersion(api_url);
        // }

        const tokenParts = ApiPort.Token ? ApiPort.Token?.split(" ") : [];

        const maskFieldKeys = {
            password: "***MASK BY FE***",
        };

        // Apply masking to fetchParams if it contains sensitive data
        let maskedFetchParams = fetchParams;
        if (fetchParams.body) {
            try {
                const parsedBody = JSON.parse(fetchParams.body);
                const maskedBody = { ...parsedBody, ...maskFieldKeys };
                maskedFetchParams = { ...fetchParams, body: JSON.stringify(maskedBody) };
            } catch (e) {
                // If parsing fails, use original fetchParams
                console.warn("Failed to parse fetchParams.body for masking:", e);
            }
        }

        let userName = store.getState()?.userInfo?.userName;
        let postData = {
            method,
            api_url,
            api_category,
            app_version: appVersion,
            duration: parseInt(Date.now() - requestTime),
            status_code: (responseObj && responseObj.status) || 0,
            response_time,
            response: JSON.stringify(processedResponseData),
            request_time,
            request: JSON.stringify(maskedFetchParams),
            log_level: determineLogLevel(responseObj),
            //共同參數
            brand: "fun88",
            client_id: window.DefaultConfig.logAppName,
            user_id: window.memberCode || "",
            global_session_id: tokenParts[1] || "",
            user_name: userName || "",
            device_brand: window.deviceBrand,
            device_model: window.deviceModel,
            os_version: window.osVersion,
            os_type: Platform.OS === "ios" ? "iOS" : "Android",
        };

        // SB log特殊需求，做api_category分類
        if (from === "SB") {
            postData.api_category = findApiCategory(api_url);
        }
        POSTLogging(postData);
    } catch (e) {
        console.log("loggingPramsHandle ", e);
    }
}

// 發送logging
function POSTLogging(obj) {
    const headers = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Culture: window.DefaultConfig?.Culture,
        },
        body: JSON.stringify([obj]),
    };
    timeout_fetch(
        fetch(window.appLogging_url, headers).catch(err => {
            console.log("POSTLogging err ", err);
        }),
        50000,
    );
}

// 過濾會員隱私資料
const keyWord = [
    "firstName",
    "lastName",
    "documentID",
    "contacts",
    "identityCard",
    "securityAnswer",
    "password",
    "banks",
    "bankAccounts",
    "accountHolderName",
    "accountNumber",
    "bankAccountID",
    "name",
    "cellphoneNo",
    "address",
    "postalCode",
    "newPassword",
    "oldPassword",
];
function filterloggingObj(obj) {
    const result = cloneDeep(obj); // 深拷貝複製物件
    if (result === null) {
        return;
    }
    const properties = Object.keys(result); // 取得物件中的所有屬性名稱

    for (const property of properties) {
        if (keyWord.includes(property)) {
            // 檢查屬性名稱是否在 keyWord 陣列中
            delete result[property]; // 刪除該屬性
        } else if (typeof result[property] === "object") {
            // 如果該屬性是物件，則遞迴檢查
            result[property] = filterloggingObj(result[property]);
        }
    }

    return result;
}

// 查找SB對應的api_category
const findApiCategory = apiUrl => {
    const pathPart = apiUrl.split("?")[0];
    let foundCategory = "SB2.0_Others";

    for (const apiCategory in apiCategoryToApiMapping) {
        const found = apiCategoryToApiMapping[apiCategory].some(apiName => pathPart.endsWith(apiName));

        if (found) {
            foundCategory = apiCategory;
            break;
        }
    }

    return foundCategory;
};

const getApiVersion = url => {
    try {
        const apiVersionRegex = /[?&]api-version=([^&#]*)/;
        const match = url.match(apiVersionRegex);

        if (match && match[1]) {
            return match[1];
        } else {
            return "2.0";
        }
    } catch (error) {
        return "2.0";
    }
};

function determineLogLevel(responseObj) {
    if (!responseObj) {
        return "error";
    }

    // 有直接指定log_level的話，就直接用
    if ("log_level" in responseObj) {
        return responseObj.log_level;
    }

    return responseObj.ok ? "info" : "error";
}
