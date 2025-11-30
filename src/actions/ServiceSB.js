import { Alert, Platform } from "react-native";
import { Toasts } from "$Toasts";
import {
    Actions,
} from "react-native-router-flux";
import { loggingPramsHandle } from "@/actions/Log";
import { timeout_fetch } from "$Utils/SportRequest";
import { getSbToken } from "../containers/SbSportsCN/lib/js/util";
import { ServerErrorHandle } from "$Utils";
const from = "SB";

export default function ServiceSB() {
    window.fetchRequestSBNew = async (url, method, params = "", withAuth = false, timeout = 600000) => {
        let header = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        // 新api的token
        let parsedToken = JSON.parse(localStorage.getItem("newSbToken"));
        if (parsedToken && !url.includes("login")) {
            header.Authorization = "Bearer " + parsedToken;
        } else if (!parsedToken && !url.includes("login")) {
            // Get the token and wait for the Promise to resolve
            const tokenData = await getSbToken();
            parsedToken = tokenData ? tokenData : null;
            if (parsedToken) {
                header.Authorization = "Bearer " + parsedToken.Data.Token;
            }
        }

        let fetchParams = {
            method: method,
            headers: header,
        };

        let logData = {
            method: method,
            requestTime: new Date(),
            responseData: null,
            fetchParams,
            api_url: window.sbNewHostApi + url,
            api_category: "",
            from
        };


        return new Promise(function(resolve, reject) {
            if (params) {
                fetchParams.body = JSON.stringify(params);
            }

            let apiUrl = window.sbNewHostApi + url;
            const neeedLog = needLogApis.includes(url);
            let responseObj;
            timeout_fetch(fetch(apiUrl, fetchParams), timeout)
                .then(response => {
                    //記下 responseStatus
                    if (response && response.status) {
                        logData.responseStatus = response.status;
                    }
                    responseObj = response;
                    return response.json();
                })
                .then((responseData) => {
                    logData.responseData = responseData;
                    if (!responseObj.ok) {
                        throw responseData;
                    }
                    resolve(responseData);
                    neeedLog && loggingPramsHandle(logData); //特殊/報錯流程先log
                })
                .catch((err) => {
                    console.log("只要有錯誤都記Log");
                    sbErrorHandle(err)
                        .then(() => {
                            // 如果 sbErrorHandle 成功返回，说明token过期并已刷新，重试API请求
                            if (!url.includes("login")) {
                                window.fetchRequestSBNew(url, method, params, withAuth, timeout).then(resolve).catch(reject);
                            }
                        })
                        .catch((err) => {
                            console.log("fetchRequest err:", JSON.stringify(err));
                            reject(err);
                        });
                    console.log("只要有錯誤都記Log 2");
                    // 只要有錯誤都記Log
                    logData.error = err;
                    loggingPramsHandle(logData);
                });
        });
    };

    const needLogApis = ["login"];
    const sbErrorHandle = (err) => {
        const errorCode = Number(err?.Error?.code);
        // token過期
        if (!isNaN(errorCode) && errorCode === 61017) {
            return getSbToken(true, true)
                .catch(() => {
                    console.error("get token失敗");
                    return Promise.reject(err);
                });
        } else {
            console.log(err);
            return Promise.reject(err);
        }
    };
}


