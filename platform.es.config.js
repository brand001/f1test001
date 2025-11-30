import { Platform } from "react-native";

export const StApiConfig = {
    CN: {
        common_url: "https://gateway-idcstgf1p5cn.gamealiyun.com",
        SBTDomain: "https://p5stag7.fun88.biz",
        bffsc_url: "https://febff-api-staging-m1.fun88.biz",
        Strapi_Domain: "https://cache.p5stag.fun88.biz",


        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",

        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
    TH: {
        common_url: "https://gateway-idcstgf1p5th.gamealiyun.com",
        SBTDomain: "https://p5stag7.fun88.biz",
        bffsc_url: "https://febff-api-staging-m2.fun88.biz",
        // bffsc_url: "https://febff-api-staging-m2-instance02.fun88.biz",
        Strapi_Domain: "https://cache.p5stag.fun88.biz",


        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",
        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
    VN: {
        common_url: "https://gateway-idcstgf1p5vn.gamealiyun.com",
        SBTDomain: "https://p5stag7.fun88.biz",
        bffsc_url: "https://febff-api-staging-m3.fun88.biz",
        // bffsc_url: "https://febff-api-staging-m3-instance02.fun88.biz",
        Strapi_Domain: "https://cache.p5stag.fun88.biz",


        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",
        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
};



export const LiveApiConfig = {
    CN: {
        common_url: "https://gateway-idcf5.gamealiyun.com",
        SBTDomain: "https://www.cheer58.com",
        bffsc_url: "https://gatewaycn-scf1.336fun.com",
        Strapi_Domain: "https://cache.apistrapiitcxcmsb.com",


        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",
        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
    TH: {
        common_url: "https://gateway-idcf5th.fun510.com",
        SBTDomain: "https://www.fun510.com",
        bffsc_url: "https://gatewayth-scf1.fun510.com",
        Strapi_Domain: "https://cache.apistrapiitcxcmsb.com",


        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",
        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
    VN: {
        common_url: "https://gateway-idcf5vn.fun202.com",
        SBTDomain: "https://www.fun202.com",
        bffsc_url: "https://gatewayvn-scf1.fun202.com",
        Strapi_Domain: "https://cache.apistrapiitcxcmsb.com",



        appLogging_url: "https://logging-gateway.gamealiyun.com/api/v1.0/logs",
        CMS_token: "71b512d06e0ada5e23e7a0f287908ac1",
    },
};

export const DefaultConfig = {
    CN: {
        siteId: Platform.OS === "android" ? 39 : 40,
        Culture: "zh-cn",
        cmsCulture: "zh-hans",
        language: "zh",
        currency: "CNY",
        countryCallingCode: "86",
        clientId: "Fun88.CN.App",
        clientSecret: "FUNmuittenCN",
        xbffKey: "FvCImRbajDiysV9ttN728w==",
        cmsLanguage: "m1",
        applicationLanguage: "zh",
        logAppName: "F1M1.APP",
        languageType: "M1"
    },
    TH: {
        siteId: Platform.OS === "android" ? 39 : 40,
        Culture: "th-th",
        cmsCulture: "th-th",
        language: "th",
        currency: "THB",
        countryCallingCode: "66",
        clientId: "Fun88.TH.App",
        clientSecret: "FUNmuittenTH",
        xbffKey: "FvCImRbajDiysV9ttN728w==",
        cmsLanguage: "m2",
        applicationLanguage: "th",
        logAppName: "F1M2.APP",
        languageType: "M2"
    },
    VN: {
        siteId: Platform.OS === "android" ? 39 : 40,
        Culture: "vi-vn",
        cmsCulture: "vi-vn",
        language: "vi",
        currency: "VND",
        countryCallingCode: "84",
        clientId: "Fun88.VN.App",
        clientSecret: "FUNmuittenVN",
        xbffKey: "FvCImRbajDiysV9ttN728w==",
        cmsLanguage: "m3",
        applicationLanguage: "vi",
        logAppName: "F1M3.APP",
        languageType: "M3"
    },
};
