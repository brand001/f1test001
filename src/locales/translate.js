import { StApiConfig, LiveApiConfig, DefaultConfig } from "../../platform.es.config";
import { SetApiPort } from "../actions/Api"; //api
import translations from "./translation.json";
import { GetDomain } from "./../actions/DomainJson";
import StorageUtil from "$Utils/Storage";

//translate("您还有 {X} 次尝试机会", { X: 8 }); X占位符
export const translate = (str = "", values = {}) => {
    const language = window.LANGUAGE || "CN";
    let res = str;
    res = translations[str] && translations[str][language] ? translations[str][language] : str;

    // ✅ 修复点：保留 falsy 值，比如 0
    res = res.replace(/\{(\w+)\}/g, (match, key) => {
        return key in values ? String(values[key]) : match;
    });

    return res || "";
};

export const SetDefaultConfig = async (res = "CN") => {
    window.LANGUAGE = res;
    let ApiConfig = window.isStaging == "ST" ? StApiConfig : LiveApiConfig;
    const apiDomain = ApiConfig[window.LANGUAGE];
    window.DefaultConfig = DefaultConfig[window.LANGUAGE];
    window.common_url = apiDomain.common_url;
    window.SBTDomain = apiDomain.SBTDomain;
    window.bffsc_url = apiDomain.bffsc_url;
    window.Strapi_Domain = apiDomain.Strapi_Domain;

    if (window.isStaging == "ST") {
        StorageUtil.save({
            key: "F1APPLANGUAGE",
            data: res,
        });
    } if (window.isStaging == "SL") {
        StorageUtil.save({
            key: "F1APPLANGUAGE",
            data: res,
        });


        window.common_url = `https://gateway-idcslf5${res.toLowerCase()}.gamealiyun.com`;
        window.SBTDomain = "https://p5sl.fun88.biz";
        window.bffsc_url = `https://gateway${res.toLowerCase()}-scf1.fun88.biz`;
        window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
        window.Strapi_Domain = "https://cache.p5sl.fun88.biz";
    } else {
        await GetDomain();
    }
    window.appLogging_url = apiDomain.appLogging_url;
    window.CMS_token = apiDomain.CMS_token;

    SetApiPort({
        cmsCulture: window.DefaultConfig.cmsCulture,
        cmsLanguage: window.DefaultConfig.cmsLanguage,
    });
};
