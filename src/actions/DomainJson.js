import { loggingPramsHandle } from "./Log";

export async function GetDomain(data) {
    //domain测速
    //ST、SL不进行测速
    if (window.isStaging != "LIVE") {
        return;
    }
    let activeDomain = "";
    let apiCount = 0;
    const jsonStart = Date.now();
    let responseObj = {};


    const Url = {
        CN: "https://yw7bsf62.moe/CMSFiles/F1APP/P5New/F1M1Domains.json?v=",
        TH: "https://yw7bsf62.moe/CMSFiles/F1APP/M2domain/F1M2Domains.json?v=",
        VN: "https://yw7bsf62.moe/CMSFiles/F1APP/M3domain/F1M3Domains.json?v="
    };
    const jsonUrl = Url[window.LANGUAGE] + Math.random();
    await fetch(jsonUrl, { method: "GET" })
        .then(async response => response.json())
        .then(async data => {
            const urlsList =
                data &&
                data.apiDomains.map(item => {
                    let url = (item && item.replace("www.", "")) || "";
                    // https://www.jb631.com/cn/10kb.jpg
                    url = "https://www." + url + "/10kb.jpg?v=" + Math.random();
                    return {
                        url: url,
                        domain: (item && item.replace("www.", "")) || "",
                    };
                });
            try {
                loggingPramsHandle({
                    responseDuration: Date.now() - jsonStart,
                    requestTime: jsonStart,
                    api_url: jsonUrl,
                    api_category: "Flash api",
                    responseData: data,
                    responseObj,
                    method: "GET",
                    fetchParams: {},
                });


            } catch (error) {}

            const domainStart = Date.now();
            urlsList.forEach((item, index) => {
                fetch(item.url)
                    .then(response => {
                        //可能出现302重定向
                        const redirect = response && response.url && response.url.includes(item.domain);
                        if (response && response.status >= 200 && response.status < 300 && redirect) {
                            apiCount += 1;
                            let common_urlLang = window.LANGUAGE == "CN" ? "" : window.LANGUAGE.toLocaleLowerCase();
                            if (activeDomain == "") {
                                activeDomain = item.domain;
                                window.common_url = `https://gateway-idcf5${common_urlLang}.${item.domain}`;
                                window.Strapi_Domain = `https://cache.${item.domain}`;
                                window.SBTDomain = `https://www.${item.domain}`;
                                window.bffsc_url = `https://gateway${window.LANGUAGE.toLocaleLowerCase()}-scf1.${item.domain}`;
                            }
                            //成功
                            try {
                                loggingPramsHandle({
                                    responseDuration: Date.now() - domainStart,
                                    requestTime: domainStart,
                                    api_url: item.url,
                                    api_category: "Flash api",
                                    responseData: {},
                                    responseObj: response,
                                    method: "GET",
                                    fetchParams: {},
                                });
                            } catch (error) {}
                        }
                        return response.text();
                    })
                    .then(redirect => {})
                    .catch(err => {
                        //失败
                        try {
                            loggingPramsHandle({
                                responseDuration: Date.now() - domainStart,
                                requestTime: domainStart,
                                api_url: item.url,
                                api_category: "Flash api",
                                responseData: {
                                    message: "Network request failed",
                                },
                                responseObj: {},
                                method: "GET",
                                fetchParams: {},
                            });
                        } catch (error) {}
                    });
            });
        })
        .catch(error => {
            try {
                loggingPramsHandle({
                    responseDuration: Date.now() - jsonStart,
                    requestTime: jsonStart,
                    api_url: jsonUrl,
                    api_category: "Flash api",
                    responseData: { message: "Network request failed" },
                    responseObj,
                    method: "GET",
                    fetchParams: {},
                });
            } catch (error) {}
        });

    setTimeout(() => {
        if (apiCount == 0) {
            alert("ERR DOMAIN BLOCKED");
            try {
                loggingPramsHandle(
                    {
                        responseDuration: Date.now() - jsonStart,
                        requestTime: jsonStart,
                        api_url: jsonUrl,
                        api_category: "Flash api",
                        responseData: { code: "ERR_DOMAIN_BLOCKED", message: "JSON 文件中的域全數失效被封鎖，請聯繫NOC更換可用域名。" },
                        responseObj,
                        method: "GET",
                        fetchParams: {},
                    }
                );
            } catch (error) {

            }
        }
    }, 15000);
}
