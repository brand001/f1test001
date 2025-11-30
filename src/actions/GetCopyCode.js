import { Clipboard, NativeModules, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import StorageUtil from "$Utils/Storage";
const { Openinstall } = NativeModules;

let CopyData = {};
let isAppStore = false;

//开启app获取黏贴版，将affcode等数据保存，防止用户去复制其他东西
//key=value&affcode=123qwe&raf=000000
export const GetCopyData = async () => {
    try {
        const content = await Clipboard.getString();
        if (content) {
            let str = content;
            let param = {};
            if (content.includes("#ITFedev#")) {
                //马甲包处理
                isAppStore = true;
                str = content?.split("#ITFedev#")[2] ? content?.split("#ITFedev#")[2] : "";
            }
            str?.split("&").forEach(item => {
                param[item?.split("=")[0]] = item?.split("=")[1] ? item?.split("=")[1] : "";
            });
            CopyData = param;
        }
        setTimeout(() => {
            GetAffCode();
            GetRafCode();
        }, 500);
    } catch (error) {
        console.error("Error in GetCopyData:", error);
    }
};



// 语言映射表
const LangMap = {
    "zh": "CN",
    "zh-hans": "CN",
    "zh-hans-cn": "CN",
    "zh-sg": "CN",
    "zh-my": "CN",
    "th": "TH",
    "vi": "VN",
    "zh-cn": "CN",
    "th-th": "TH",
    "vi-vn": "VN"
};

const LanguageArr = ["CN", "TH", "VN"];

/**
 * 纯JS获取系统语言 - 内部函数
 */
const getSystemLanguage = () => {
    // 方法1: 从Intl API获取语言
    try {
        const locale = Intl?.DateTimeFormat()?.resolvedOptions()?.locale;
        if (locale) {
            const normalized = locale?.toLowerCase?.().trim();

            // 精确匹配
            if (LangMap[normalized]) return LangMap[normalized];

            // 前缀匹配
            for (const [key, value] of Object.entries(LangMap)) {
                if (normalized?.startsWith(key + "-") || normalized?.startsWith(key + "_")) {
                    return value;
                }
            }
        }
    } catch {
        // Silent fail
    }

    // 方法2: 从时区推测语言
    try {
        const tz = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone;
        const tzMap = {
            "Asia/Shanghai": "CN",
            "Asia/Hong_Kong": "CN",
            "Asia/Taipei": "CN",
            "Asia/Bangkok": "TH",
            "Asia/Ho_Chi_Minh": "VN",
            "Asia/Saigon": "VN"
        };
        if (tzMap[tz] && LanguageArr?.includes(tzMap[tz])) {
            return tzMap[tz];
        }
    } catch {
        // Silent fail
    }

    // 默认返回中文
    return "CN";
};

// Android：Tinstall > copy > storage > 系统
// iOS：copy > storage > 系统
export const GetLanguage = async () => {
    try {
        let lang = "CN";

        let lang0 = "";
        if (Openinstall?.getLanguage) {
            lang0 = await new Promise((resolve) => {
                Openinstall?.getLanguage?.(code => resolve(code));
            });
            lang0 = lang0?.toLocaleUpperCase();
        }

        if (lang0) {
            lang = lang0;
        } else {

            // 第一优先级：从剪贴板数据获取语言设置
            let lang1 = CopyData?.language?.toLocaleUpperCase();

            // 第二优先级：从本地存储获取用户设置的语言
            let lang2 = "";
            try {
                lang2 = await StorageUtil.load("F1APPLANGUAGE") || "";
            } catch (error) {
                // Silent fail
            }

            // 第三优先级：使用系统语言检测（纯JS实现）
            let lang3 = getSystemLanguage();

            // 按优先级选择语言
            lang = (lang1 || lang2 || lang3 || "CN")?.toLocaleUpperCase();

            // 确保语言在支持列表中
            if (!LanguageArr.includes(lang)) {
                lang = "CN";
            }
        }

        window.DeviceLanguage = lang;
        StorageUtil.save({
            key: "F1APPLANGUAGE",
            data: lang,
        });

        await window.ChangeLanguag(lang);
    } catch (error) {
        // 出错时使用默认语言
        try {
            await window.ChangeLanguag("CN");
        } catch (fallbackError) {
            // Silent fail
        }
    }
};


//获取affcode
export const GetAffCode = async () => {
    try {
        if (isAppStore) {
            //马甲包处理
            window.affCodeKex = CopyData.affcode || "";
            await getAff();
        } else {
            window.affCodeKex = CopyData.affcode || "";
            if (Openinstall?.getAffCode) {
                const CODE = await new Promise((resolve) => {
                    Openinstall?.getAffCode?.(code => resolve(code));
                });
                if (CODE && CODE != "err" && CODE != "IT6666") {
                    window.affCodeKex = CODE;
                } else {
                    await getAff();
                }
            }
        }
    } catch (error) {
        console.error("Error in GetAffCode:", error);
    }
};

const getAff = async () => {
    try {
        const ret = await StorageUtil.load("affCodeSG");
        window.affCodeKex = ret;
    } catch (err) {
        if (window.affCodeKex) {
            StorageUtil.save({
                key: "affCodeSG",
                data: window.affCodeKex,
            });
        }
    }
};

//推荐好友code
export const GetRafCode = async () => {
    try {
        if (isAppStore) {
            window.rafCodeKex = CopyData.rafcode || "";
        } else {
            window.rafCodeKex = CopyData.rafcode || "";
            if (Openinstall?.getRafCode) {
                const CODE = await new Promise((resolve) => {
                    Openinstall?.getRafCode?.(code => resolve(code));
                });
                if (CODE && CODE != "err") {
                    window.rafCodeKex = CODE;
                }
            }
        }
    } catch (error) {
        console.error("Error in GetRafCode:", error);
    }
};
