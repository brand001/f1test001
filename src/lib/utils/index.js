import React from "react";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Clipboard from "@react-native-clipboard/clipboard";
import moment from "moment";
import Qs from "qs";
import { Alert, Dimensions, Image, Linking, Platform, SafeAreaView, Text, View, StatusBar } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import ImageEditor from "@react-native-community/image-editor";
import CryptoJS from "crypto-js";
import base64 from "crypto-js/enc-base64";
import { v4 as uuidv4 } from "uuid";
import { parses } from "@/actions/parses";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetWalletProductGroupNameMapImg, PromoProductGroupNameMapImg } from "@/images/index.js";
import actions from "@/lib/redux/actions/index";
import CustomLinkText from "$Components/CustomLinkText";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { AnnouncementOptionType, sportsName } from "../data/game";
import store from "@/lib/redux/store/index.js";
import { CLEAR_COOKIE_KEY } from "./constantsData";
import { setSmarticoParams } from "@/containers/Smartico/SmarticoContext";
import StorageUtil from "./Storage";
const { width, height } = Dimensions.get("window");


export function Cookie(name, value, options) {
    // 如果第二个参数存在
    if (typeof value !== "undefined") {
        options = options || {};
        if (value === null) {
            // 设置失效时间
            options.expires = -1;
        }
        var expires = "";
        // 如果存在事件参数项，并且类型为 number，或者具体的时间，那么分别设置事件
        if (options.expires && (typeof options.expires === "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires === "number") {
                date = new Date();
                date.setTime(date.getTime() + options.expires * 60 * 1000);
            } else {
                date = options.expires;
            }
            expires = "; expires=" + date.toUTCString();
        }
        // var path = options.path ? '; path=' + options.path : '', // 设置路径
        var domain = options.domain ? "; domain=" + options.domain : "", // 设置域
            secure = options.secure ? "; secure" : ""; // 设置安全措施，为 true 则直接设置，否则为空

        // 如果第一个参数不存在则清空所有Cookie
        if (name === null) {
            const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (let i = keys.length; i--;) {
                    if (~CLEAR_COOKIE_KEY.indexOf(keys[i])) {
                        document.cookie = [keys[i], "=", encodeURIComponent(value), expires, "; path=/", domain, secure].join("");
                    }
                }
            }
        } else {
            // 把所有字符串信息都存入数组，然后调用 join() 方法转换为字符串，并写入 Cookie 信息
            document.cookie = [name, "=", encodeURIComponent(value), expires, "; path=/", domain, secure].join("");
        }
    } else {
        // 如果第二个参数不存在
        var CookieValue = null;
        if (document.cookie && document.cookie != "") {
            var Cookie = document.cookie.split(";");
            for (var i = 0; i < Cookie.length; i++) {
                var CookieIn = (Cookie[i] || "").replace(/^\s*|\s*$/g, "");

                if (CookieIn.substring(0, name.length + 1) == name + "=") {
                    CookieValue = decodeURIComponent(CookieIn.substring(name.length + 1));
                    break;
                }
            }
        }
        return CookieValue;
    }
}

// 浮点数计算
export function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c);
}
export function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}
export function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

//比較兩個object，指定要比較的prop
export function dataIsEqual(left, right, selectedProps = [], log = false, name = "") {
    let isEqual = true;

    if (left === right) {
        return true;
    }

    if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) {
        if (log) {
            if (typeof left !== "object" || left === null) {
                console.log("===", name, "=== is not equal by left", left);
            }
            if (typeof right !== "object" || right === null) {
                console.log("===", name, "=== is not equal by right", right);
            }
        }

        return false;
    }

    for (let prop of selectedProps) {
        const r = left[prop] === right[prop];
        if (!r) {
            if (log) {
                console.log("===", name, "=>", prop, "=== is not equal", left[prop], " vs ", right[prop]);
            }
            isEqual = false;
            break;
        }
    }
    return isEqual;
}

// 檢查奪金戰機小遊戲是否在維護
export function checkGameMaintainStatus() {
    return store.getState().gameInfo.maintainStatus.isComingSoon;
}

//每三位加逗號
export function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const isSafeAreaViewOrView = () => {
    const GameWrapComponent = Platform.OS === "ios" ? SafeAreaView : View;

    return GameWrapComponent;
};
export const WrapView = isSafeAreaViewOrView();

export const isIphoneX = () => {
    return Platform.OS == "ios" && window.DeviceInfoIos ? 90 : 60;
};

// 時間轉換x小時y分鐘
export function getDurationString(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const remainingMinutes = durationInMinutes % 60;
    let duration = "";

    if (hours > 0) {
        duration += `${hours}小时`;
    }

    if (remainingMinutes > 0) {
        duration += `${remainingMinutes}分钟`;
    }

    return duration;
}

/**
 * 將輸入值向上取整到兩位小數
 * @param {Number|String} value
 * @returns {Number}
 */
export function roundUpToTwoDecimals(value) {
    if (isNaN(value)) {
        return value;
    }
    const num = Number(value);
    return Math.ceil(num * 100) / 100;
}

let supportFormats = null;

const makeFormatSupportValue = (avif, webp) => ({ avif, webp });

function prioritizeImageFormats(obj, supportFormats = makeFormatSupportValue(false, true)) {
    if (Array.isArray(obj)) {
        return obj.map(item => prioritizeImageFormats(item, supportFormats));
    } else if (obj && typeof obj === "object") {
        const keys = Object.keys(obj);
        const priorityExt = ["avif", "webp"];

        for (let key of keys) {
            const camelCaseKeys = [key + "Avif", key + "Webp"];
            const snakeCaseKeys = [key + "_avif", key + "_webp"];
            const isCamelCase = camelCaseKeys.every(k => keys.includes(k));
            const isSnakeCase = snakeCaseKeys.every(k => keys.includes(k));

            let formatKeys, currentExt;
            if (isCamelCase) {
                formatKeys = camelCaseKeys;
            } else if (isSnakeCase) {
                formatKeys = snakeCaseKeys;
            } else {
                continue;
            }

            currentExt = typeof obj[key] === "string" ? obj[key].split(".").pop()?.toLowerCase() : "";

            // 如果是gif格式，跳过转换
            if (currentExt === "gif") {
                continue;
            }

            for (let i = 0; i < priorityExt.length; i++) {
                const ext = priorityExt[i];

                if (ext === currentExt && obj[key]) {
                    obj[formatKeys[i]] = obj[key];
                }

                if (supportFormats[ext] && obj[formatKeys[i]]) {
                    obj[key] = obj[formatKeys[i]];
                    break;
                }
            }
        }

        for (let key of Object.keys(obj)) {
            obj[key] = prioritizeImageFormats(obj[key], supportFormats);
        }
        return obj;
    }
    return obj;
}

export async function processImageFormats(response) {
    // 初始化图片格式支持信息（只在首次调用时执行）
    if (!supportFormats) {
        const [avif, webp] = await Promise.all([Platform.OS === "ios" && parseFloat(Platform.Version + "") >= 16, true]);
        supportFormats = makeFormatSupportValue(avif, webp);
    }

    // 图片格式优先级调整
    return prioritizeImageFormats(response, supportFormats);
}

export const GoSmartico = (
    {
        isMaintain = false,
        isLoginCallBack = false,
        deepLink = "dp:gf"
    } = {
            isMaintain: false,
            isLoginCallBack: false,
            deepLink: "dp:gf"
        },
) => {
    const state = store.getState(); // 获取当前的 Redux 状态
    const userSetting = state?.userSetting;
    let Maintain = !userSetting?.cmsMainsiteStatus?.smarticoIsActive || isMaintain;
    if (CheckLogin()) {
        if (isLoginCallBack) {
            let data = {
                callBack: () => {
                    if (!Maintain) {
                        Actions.jump("Smartico");
                        setSmarticoParams({ deepLink });
                    }
                },
            };
            store.dispatch(actions.ACTION_LoginAfterCallBack(data));
        }
        return;
    }

    if (Maintain) {
        GetGlobalModal({
            title: translate("提醒"),
            iconName: "warning",
            message: translate("彩金殿堂目前正在维护中，请稍后再访问"),
            confirmText: translate("我知道了"),
            onConfirm: () => {
                PiwikEventDataHandle({
                    path: "reward_center_system_maintenance_popup",
                    title: "Reward Center System Maintenance Popup",
                });
            },
        });
        return;
    }

    // 先跳轉，確保 SmarticoProvider 已掛載，然後再設置參數
    Actions.jump("Smartico");
    setSmarticoParams({ deepLink });
};


export const convertKeysToUpperCaseCamelCase = obj => {
    // 確保輸入是有效的對象
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    // 將鍵名首字母大寫並構造新對象
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = key.charAt(0).toUpperCase() + key.slice(1);
        acc[newKey] = value;
        return acc;
    }, {});
};

export function GetPromoProductGroupNameMapImg({ productGroup = "" }) {
    if (productGroup == "MAIN" || productGroup == "") return;
    let isArray = Array.isArray(productGroup) && productGroup.length > 0;
    let imgArr = !isArray ? PromoProductGroupNameMapImg[(productGroup || "SB")?.toLocaleUpperCase()?.replace(/\s+/g, "")] : productGroup;
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {Array.isArray(imgArr) &&
                imgArr.length > 0 &&
                imgArr.map((v, i) => {
                    return (
                        <Image
                            key={i}
                            resizeMode={"contain"}
                            source={!isArray ? v : GetWalletProductGroupNameMapImg(v?.productGroup)}
                            style={{
                                width: 24,
                                height: 24,
                                marginLeft: 2,
                            }}
                        />
                    );
                })}
        </View>
    );
}

import { emailReg, nameReg } from "@/actions/Reg.js";
import Color from "$Components/Color";

export function checkEmail(value) {
    let error = "";
    if (value == "") {
        error = translate("请输入电子邮箱");
    } else if (!emailReg.test(value)) {
        error = translate("请输入有效的电子邮箱");
    }
    return error;
}

export function checkLoginUserName(value) {
    let error = "";
    if (value == "") {
        error = translate("请输入您的用户名");
    }
    return error;
}

export function checkLoginPassword(value) {
    let error = "";
    if (value == "") {
        error = translate("请输入密码");
    }
    return error;
}

export function checkUserName(value) {
    let error = "";
    if (value == "") {
        error = translate("请输入您的用户名");
    } else if (!nameReg.test(value)) {
        error = translate("用户名长度必须至少有6个字符，不能超过14个字符，仅可使用字母 'A-Z', 'a-z' , 数字 '0-9'。");
    }
    return error;
}

export function checkPhone(value) {
    let prefixes = store.getState().userSetting?.phonePrefix;
    let obj = {
        error: "",
        prefixesMaxLength: window.LANGUAGE == "CN" ? 11 : 9,
    };
    if (value == "") {
        obj.error = translate("请输入电话号码");
    } else {
        if (!(Array.isArray(prefixes) && prefixes.length)) {
            return obj;
        }

        let prefixIndex = prefixes.findIndex(v => v?.prefixes?.some(a => value.startsWith(a)));

        if (prefixIndex >= 0) {
            let prefixesMaxLength = prefixes[prefixIndex]?.maxLength;
            obj.prefixesMaxLength = prefixesMaxLength;

            const lengthCheck = value?.length >= prefixes[prefixIndex]?.minLength && value?.length <= prefixesMaxLength;
            if (!lengthCheck) {
                obj.error = translate("有效手机号码必须为{X}位数", {
                    X: prefixesMaxLength,
                });
            }
        } else {
            obj.error = translate("此电话号码无效或属于网络运营商。");
        }
    }
    return obj;
}


/**
 * @param optionType optionType，必傳 公告api需要
 * @param gameData 關公告彈窗後，才開遊戲的要傳
 * @param showLoading 是否顯示loading效果
 */

export async function GetAnnouncementPopup({ type = "", gameData = {}, showLoading = false }) {
    return new Promise((resolve) => {
        if (!type || !ApiPort.UserLogin) {
            resolve();
            return;
        }

        type = type.toLowerCase();
        let optionType = AnnouncementOptionType[type];
        if (!optionType) {
            resolve();
            return;
        }

        let playGame = data => {
            if (Object.keys(data).length <= 0) return;
            store.dispatch(actions.ACTION_PlayGame(data));
        };

        // 创建内部的 async 函数
        const checkCache = async () => {
            try {
                let userName = store.getState()?.userInfo?.userName;
                let key = `222ann${userName}` + optionType;
                let havaCache = await StorageUtil.load(key);


                if (havaCache) {
                    playGame(gameData);
                    resolve();
                } else {
                    showLoading && Toasts.loading(translate("加载中,请稍候..."), 999999);
                    fetchRequest(`${ApiPort.AnnouncementPopup}optionType=${optionType}&`, "GET")
                        .then(async res => {
                            Toasts.removeAll();
                            let { isSuccess = false, result = [] } = res;
                            if (isSuccess && Array.isArray(result) && result.length) {
                                const { content, topic } = result[0];

                                let currentScene = Actions.currentScene?.toLowerCase();
                                if (!currentScene.includes("game") &&
                                    !currentScene.includes("deposit") &&
                                    !currentScene.includes("withdrawal") &&
                                    !currentScene.includes("product") &&
                                    !currentScene.includes("sbsport")) {
                                    resolve();
                                    return;
                                }

                                await GetGlobalModal({
                                    name: "AnnouncementModal",
                                    title: translate("重要公告"),
                                    showCloseIcon: true,
                                    wrapStyle: { width: "90%" },
                                    modalData: { content, topic, optionType },
                                });
                            } else {
                                playGame(gameData);
                            }
                            resolve();
                        })
                        .catch(() => {
                            Toasts.removeAll();
                            playGame(gameData);
                            resolve();
                        });
                }
            } catch (error) {
                console.error("Error in checkCache:", error);
                playGame(gameData);
                resolve();
            }
        };

        // 调用 async 函数
        checkCache();

    });
}

export function GetSelfExclusionStatus() {
    const selfExclusions = store.getState()?.userSetting?.selfExclusions || {};
    const {
        disableBetting = false,
        disableFundIn = false,
        disableDeposit = false,
    } = selfExclusions;

    return disableBetting || disableFundIn || disableDeposit;
}

export function GetSelfExclusionPopup() {
    return new Promise(resolve => {
        if (!ApiPort.UserLogin) {
            resolve(false);
            return;
        }

        const selfExclusions = store.getState()?.userSetting?.selfExclusions || {};
        const {
            selfExclusionSettingID = "",
            selfExcludeDuration = "",
            selfExcludeSetDate = new Date()
        } = selfExclusions;

        const isSlef = GetSelfExclusionStatus();

        if (isSlef) {
            const excludeDay = selfExclusionSettingID == 3 ? translate("永久") : selfExcludeDuration + translate("天");

            GetGlobalModal({
                title: translate("自我限制"),
                wrapStyle: { width: width * 0.8 },
                renderMessage: ({ hideModalWithAnimation = () => {} }) => {
                    return <CustomLinkText
                        onPressList={[]}
                        norMaltextStyle={{ color: Color.gray, fontSize: 14, lineHeight: 20 }}
                        themeTextStyle={{ color: Color.gray, fontSize: 14, lineHeight: 20, fontWeight: "400" }}
                        textAlign="center"
                        wrapStyle={{ marginTop: 0 }}
                        text={translate("您在 {x} 已成功设定({y})自我行为控制，如需要任何帮助，请联系{在线客服}", {
                            x: FormatDate(moment(new Date(selfExcludeSetDate)), { timeLevel: "onlyDate" }),
                            y: excludeDay,
                        })}
                    />;
                },
                confirmText: translate("我知道了"),
                onConfirm: () => {
                    Actions.pop();
                    resolve(true); // ✅ 用户点击"我知道了"后才继续执行后面的逻辑
                },
                cancelText: translate("联系客服(自我限制弹窗)"),
                onCancel: () => {
                    Actions.pop();
                    LiveChatOpenGlobe();
                    resolve(true); // ✅ 用户点击"联系客服"后也继续
                },
            });
        } else {
            resolve(false);
        }
    });
}

export function CheckLogin(
    { showInfor = true, tabType = "login" } = {
        showInfor: true,
        tabType: "login",
    },
) {
    if (!window.ApiPort.UserLogin) {
        showInfor && Toasts.fail(translate("请先登陆"));
        Actions.Login({
            tabType,
            from: "CheckLogin",
        });
        return true;
    }
}

export function LiveChatOpenGlobe(params) {
    let { csp = false, articleNumber = "" } = params || {};
    if (csp) {
        GetGlobalModal({
            title: translate("温馨提醒"),
            showCloseIcon: true,
            message: translate("页面将会开启另一个窗口"),
            confirmText: translate("好的"),
            onConfirm: () => {
                let key = Math.random();
                let query = Qs.stringify({
                    platform: "App",
                    token: ApiPort?.UserLogin ? ApiPort?.Token : "",
                    key,
                    fromUrl: window.SBTDomain,
                    language: window.LANGUAGE.toLocaleLowerCase(),
                    articleNumber
                });
                // 移除 SBTDomain 中的端口号（例如 :9009）
                let cleanSBTDomain = window.SBTDomain?.replace(/:\d+/, "") || "";
                let url = (window.isStaging == "ST" ? "https://f1cspstg.fun88.biz/" : "" + cleanSBTDomain.replace(/^(https?:\/\/)(www\.)?/, "$1csp.")) + "?" + query;
                Linking.openURL(url);
            },
        });

        PiwikEventDataHandle({
            path: "helpcenter_newwindow_popup",
            title: "HelpCenter New Window Popup",
        });
    } else {
        Actions.LiveChat({
            query: params,
        });
    }
}

async function checkPhotoSavePermission() {
    if (Platform.OS === "ios") {
        try {
            const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
            if (result === RESULTS.DENIED) {
                try {
                    const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
                    if (requestResult !== RESULTS.GRANTED) {
                        Alert.alert(translate("权限提示"), translate("请在 iPhone 的 “设置-隐私-照片” 中允许应用保存图片"), [
                            { text: "取消", style: "cancel" },
                            {
                                text: "去设置",
                                onPress: () => Linking.openSettings(),
                            },
                        ]);
                        return false;
                    }
                } catch (requestError) {
                    console.log("permissions request error:", requestError);
                    return false;
                }
            } else if (result === RESULTS.BLOCKED) {
                Alert.alert(translate("权限提示"), translate("请在 iPhone 的 “设置-隐私-照片” 中允许应用保存图片"), [
                    { text: "取消", style: "cancel" },
                    { text: "去设置", onPress: () => Linking.openSettings() },
                ]);
                return false;
            }
        } catch (checkError) {
            console.log("permissions check error:", checkError);
            return false;
        }
    }
    return true;
}

export async function SaveImg(ViewShotRef, successTip = translate("保存成功！")) {
    const hasPermission = await checkPhotoSavePermission();
    if (!hasPermission) return;

    ViewShotRef.capture()
        .then(uri => {
            try {
                let promise = CameraRoll.save(uri);
                promise
                    .then(result => {
                        Toasts.success(successTip);
                    })
                    .catch(function(error) {
                        console.log("CameraRoll.save promise error:", error);
                        Alert.alert(translate("二维码保存失败"));
                    });
            } catch (error) {
                console.log("CameraRoll.save try-catch error:", error);
                Alert.alert(translate("二维码保存失败"));
            }
        })
        .catch(() => {
            Alert.alert(translate("二维码保存失败"));
        });
}

export function openEmail(url) {
    let param = "mailto:" + url;
    Linking.canOpenURL(param)
        .then(flag => {
            Linking.openURL(param);
        })
        .catch(err => {
            Alert.alert(translate("温馨提醒"), translate("您的设备不支持此功能，请使用其他电子邮件应用"), [{ text: translate("确认") }]);
        });
}

export function openPhone(url) {
    let param = "tel:" + url;
    Linking.canOpenURL(param)
        .then(flag => {
            Linking.openURL(param);
        })
        .catch(err => {
            Alert.alert(translate("温馨提醒"), `${translate("您的设备不支持此功能，请手动拨号")} ${url}`, [{ text: translate("确认") }]);
        });
}

export function CopyText(text, toast = translate("链接已复制")) {
    try {
        const value = String(text);
        Clipboard.setString(value);
        Toasts.success(toast);
    } catch (error) {
        console.log(error);
    }
}

export function GameLockToast() {
    let { isGameLock = false } = store.getState()?.userInfo?.memberInfo || {};
    if (ApiPort.UserLogin && isGameLock) {
        Toasts.fail(translate("您的账户已被锁，请联系在线客服。"), 2);
        return true;
    } else {
        false;
    }
}

export function UpdateMemberSuperdoorShownStatus() {
    fetchRequest(window.ApiPort.UpdateMemberSuperdoorShownStatus, "PUT");
}
export async function GetSuperDoor() {
    let res = await fetchRequest(window.ApiPort.GetMemberSuperdoorShownStatus, "GET");
    let { result = {}, isSuccess = false } = res || {};
    let { isSuperdoorShown = false, domainList = [] } = result;
    // isSuperdoorShown = true;
    // domainList = ["www.funvip18.com", "www.funvip18.com", "www.funvip18.com", "www.funvip18.com", "www.funvip18.com"];
    if (!(isSuccess && Array.isArray(domainList) && domainList.length && isSuperdoorShown)) return;
    // 獲取上次關閉 superdoor 時間
    let data = await StorageUtil.load("lastCloseSuperdoor");

    if (data) {
        const nextDayMidnight = moment(data).clone().add(1, "days");
        const now = moment();
        if (now.isAfter(nextDayMidnight)) {
            GetGlobalModal({
                name: "SuperDoorModal",
                wrapStyle: { width: "90%" },
                title: "贴心提示",
                confirmText: "知道了",
                onConfirm: () => {},
                modalData: domainList,
            });
        }
    } else {
        GetGlobalModal({
            name: "SuperDoorModal",
            wrapStyle: { width: "90%" },
            title: "贴心提示",
            confirmText: "知道了",
            onConfirm: () => {},
            modalData: domainList,
        });
    }
}

export const CheckYBSGame = async () => {
    if (!ApiPort.UserLogin) return false;
    if (window.LANGUAGE != "CN") return false;
    let params = {
        providerCode: "YBS",
        memberCode: memberCode,
        hostName: common_url,
    };
    let res = await fetchRequest(ApiPort.GETIsMemberWhiteListed + Qs.stringify(params) + "&", "GET");
    if (res?.isSuccess) {
        return Boolean(res?.result);
    } else {
        return true;
    }
};

export const GetBonusName = ({ bonusGivenType, bonusRuleType }) => {
    if (bonusGivenType === "REWARDSPOINT") {
        return translate("乐币");
    } else if (bonusGivenType === "FREESPIN") {
        return translate("免费旋转");
    } else if (bonusGivenType === "FREEBET") {
        return translate("免费投注");
    } else {
        return bonusRuleType == "PRE" ? translate("彩金金额") : translate("可得彩金2");
    }
};

export const GetBonusGmt = () => {
    return window.LANGUAGE == "CN" ? "" : " GMT+8";
};


export function CapitalizeFirstLetter(str = "") {
    return str.charAt(0).toUpperCase() + str.slice(1);
}




let hasRestrictPage = false;
export function ServerErrorHandle({ responseData, params }) {
    let code = responseData?.result?.error_details?.code || responseData?.result?.errorCode || responseData?.errors?.[0]?.errorCode;
    // 維護
    if (code == "GEN0001") {
        Toasts.removeAll();
        if (!hasRestrictPage) {
            ApiPort.UserLogin == false;
            Toasts.fail(translate("系统正在更新中，请您稍后再尝试登入"), 2);
            Actions.RestrictPage({
                from: "maintenance",
                error_details: responseData,
            });
            hasRestrictPage = true;
            return;
        }
        return;
    }

    // ip 限制
    if (code == "GEN0002") {
        Toasts.removeAll();
        if (!hasRestrictPage) {
            ApiPort.UserLogin == false;
            Actions.RestrictPage({
                from: "restrict",
                RetryAfter: "",
                error_details: responseData,
            });
            hasRestrictPage = true;
            return;
        }
        return;
    }

    //重复登录
    if (code == "GEN0005" || code == "VAL99902") {
        Toasts.removeAll();
        if (ApiPort.UserLogin == true) {
            LogoutUtil({
                text: translate("重复登录,系统检测到您重复登录"),
                callBack: () => {
                    Actions.jump("Home");
                }
            });
        }
        return;
    }

    // 登录过期
    if (code == "GEN0006") {
        Toasts.removeAll();
        if (ApiPort.UserLogin == true) {
            LogoutUtil({ text: translate("请重新登录,访问过期") });
        }
        return;
    }

    if (code === "MEM00059") {
        StorageUtil.save({
            key: "lockLogin" + params?.userName,
            data: (window.lockLogin += 1),
        });

        if (window.FastLoginErr) {
            //快速登陆提示
            // Toasts.removeAll();
            Alert.alert(translate("密码错误"), translate("请重新输入，错误5次将强制登出账号。"), [
                {
                    text: translate("确认3"),
                    onPress: () => {
                        window.FastLoginErr > 4 && Actions.pop();
                    },
                },
            ]);
            return;
        }
        return;
    }

    //超过5次登陆失败不饿能登陆，跳到客服页面
    if (code === "MEM00060") {
        StorageUtil.save({
            key: "lockLogin" + params?.userName,
            data: 6,
        });
        return;
    }

    if (code === "MEM00004") {
        StorageUtil.save({
            key: "lockLogin" + params.userName,
            data: (window.lockLogin += 1),
        });
        if (window.FastLoginErr) {
            //快速登陆提示
            // Toasts.removeAll();
            Alert.alert(translate("密码错误"), translate("请重新输入，错误5次将强制登出账号。"), [
                {
                    text: translate("确认3"),
                    onPress: () => {
                        window.FastLoginErr > 4 && Actions.pop();
                    },
                },
            ]);
            return;
        }
        return;
    }
}

import { logout } from "@/lib/redux/actions/AuthAction";
export const LogoutUtil = ({ callBack = () => {}, text = "", skipHomeNavigation = false } = { callBack: () => {}, text: "", skipHomeNavigation: false }) => {
    if (!skipHomeNavigation) {
        Actions.jump("Home");
    }

    if (ApiPort.UserLogin) {
        let data = {
            clientId: window.DefaultConfig.clientId,
            clientSecret: window.DefaultConfig.clientSecret,
            refreshToken: ApiPort.ReToken,
            deviceToken: window.Devicetoken,
            packageName: DeviceInfo?.getBundleId?.() || "",
            imei: "",
            macAddress: window.userMAC,
            serialNumber: "",
            pushNotificationPlatform: "umeng+",
            os: Platform.OS === "android" ? "Android" : "iOS",
            siteId: window.siteId,
            ipAddress: "",
        };
        fetchRequest(ApiPort.logout, "POST", data);
    }


    ApiPort.UserLogin = false;
    ApiPort.Token = "";
    global.localStorage.setItem("loginStatus", 0);
    window.isMobileOpen = false;
    //清理vendor緩存
    localStorage.removeItem("IM_Token");
    localStorage.removeItem("IM_MemberCode");
    localStorage.removeItem("IM_MemberType");
    localStorage.removeItem("IM_Token_ExpireTime");
    localStorage.removeItem("BTI_Token");
    localStorage.removeItem("BTI_MemberCode");
    localStorage.removeItem("BTI_JWT");
    localStorage.removeItem("BTI_Token_ExpireTime");
    localStorage.removeItem("SABA_Token");
    localStorage.removeItem("SABA_MemberCode");
    localStorage.removeItem("SABA_JWT");
    localStorage.removeItem("SABA_Token_ExpireTime");

    if (text) {
        Toasts.fail(text);
    }

    store.dispatch(actions.ACTION_ClearSelfExclusions());
    store.dispatch(actions.ACTION_UserInfo_logout());
    store.dispatch(actions.ACTION_LoginAfterCallBack({}));
    store.dispatch(logout("logout"));
    callBack();
};

export const OpenVIPCS = () => {
    GetGlobalModal({
        name: "VipCsCallModal",
        wrapStyle: { width: "90%" },
        title: "回拨服务",
        showCloseIcon: true,
        allowKeyboardAwareScrollView: true,
    });
};


export const DateFormats = {
    CN: {
        slash: "YYYY/MM/DD",
        dash: "YYYY-MM-DD"
    },
    TH: {
        slash: "DD/MM/YYYY",
        dash: "DD-MM-YYYY"
    },
    VN: {
        slash: "DD/MM/YYYY",
        dash: "DD-MM-YYYY"
    }
};

export const MonthFormat = {
    CN: "YYYY-MM",
    TH: "MM-YYYY",
    VN: "MM-YYYY"
};

export const FormatDate = (date, options = {}) => {
    if (!date) return "";

    const language = window.LANGUAGE || "CN";
    const { formatType = "slash", timeLevel = "minute" } = options;

    const momentDate = moment.isMoment(date) ? date : moment(date);

    const timeFormats = {
        full: "HH:mm:ss",
        minute: "HH:mm",
        onlyTimeFull: "HH:mm:ss",
        onlyTimeMinute: "HH:mm"
    };

    const dateFormat = DateFormats[language]?.[formatType] || DateFormats.CN[formatType];

    let format = dateFormat;

    if (timeLevel) {
        if (timeLevel.startsWith("onlyTime")) {
            format = timeFormats[timeLevel];
        } else if (timeLevel === "onlyDate") {
            // 保持 format 为 dateFormat
        } else {
            format += ` ${timeFormats[timeLevel]}`;
        }
    }

    return momentDate.format(format);
};



export const ShowLiveTestGame = (isLive = false) => {
    let housePlayer = store.getState()?.userInfo?.memberInfo?.housePlayer || false;
    if (!housePlayer && !isLive) {
        return false;
    } else {
        return true;
    }
};

export const GetLaunchGameCode = async (game) => {
    const targetCode = game.code || game.providerCode || game.provider;

    // Try loading ProvidersSequence from storage first
    let ProvidersSequence = [];
    try {
        ProvidersSequence = await StorageUtil.load("GameSequence");
        if (!ProvidersSequence) {
            throw new Error("No data");
        }
    } catch (err) {
        console.warn("Storage load failed, fallback to CMS", err);
        try {
            const res = await fetchRequestCMS(Strapi_Domain + ApiPort.CMS_Sequence, "GET");
            ProvidersSequence = res?.result || [];
        } catch (e) {
            console.warn("Failed to load GameSequence from CMS", e);
        }
    }

    // Try getting from ProvidersSequence
    for (const provider of ProvidersSequence) {
        const matchedSubProvider = provider?.subProviders?.find(
            (sp) => sp?.code === targetCode && sp.isLaunchLobbyAvailable
        );

        if (matchedSubProvider?.launchLobbyGameCode) {
            return matchedSubProvider.launchLobbyGameCode;
        }
    }

    return game?.launchGameCode;
};


export const OpenSbSports = () => {
    Actions.SbSports({
        sbType: window.LANGUAGE == "CN" ? "IPSB" : "OWS",
    });
};


export const HideNavBar = (hideNavBar) => {
    if (Platform.OS === "android") {
        if (hideNavBar) {
            SystemNavigationBar?.navigationHide();
        } else {
            SystemNavigationBar?.navigationShow();
        }

    }
    StatusBar?.setHidden(hideNavBar);
};

export const GetDownloadUrl = () => {
    let languageMap = {
        CN: "Appinstall",
        TH: "ดาวน์โหลด-fun88",
        VN: "download-app"
    };
    // 移除 SBTDomain 中的端口号（例如 :9009）
    let cleanSBTDomain = window.SBTDomain?.replace(/:\d+/, "") || "";
    Linking.openURL(`${cleanSBTDomain}/${window.LANGUAGE?.toLocaleLowerCase()}/${languageMap[window.LANGUAGE]}/?language=${window.LANGUAGE}&aff=${window.affCodeKex || ""}`);
};


export const GetSeonFingerprint = async () => {
    try {
        let seonFingerprint = await StorageUtil.load("seonFingerprint");

        return seonFingerprint || "";
    } catch (error) {
        console.error("Failed to get SEON fingerprint:", error);
        return "";
    }
};

/**
 * 獲取設備簽名黑盒值
 * @returns {Promise<string>} 設備簽名黑盒值
 */
export const getDeviceSignatureBlackBox = async () => {
    // 嘗試從存儲中獲取 uniqueId
    let uniqueId = "";
    try {
        uniqueId = await StorageUtil.load("getUniqueId") || "";
    } catch (error) {
        // 如果獲取失敗，繼續使用空字符串
    }

    // 如果沒有存儲的 uniqueId，從設備獲取
    if (!uniqueId || uniqueId === "") {
        uniqueId = DeviceInfo.getUniqueId();
    }

    // 如果 uniqueId 長度小於等於 15，在前面加 0
    if (uniqueId && uniqueId.length <= 15) {
        uniqueId = "0" + DeviceInfo.getUniqueId();
    }

    // 生成 GUID
    const GUID = uuidv4();

    // 根據環境選擇加密密鑰
    let keyHex = CryptoJS.enc.Utf8.parse("@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkYp");
    if (window.isStaging == "ST") {
        // 測試 key
        keyHex = CryptoJS.enc.Utf8.parse("WmZq4t7w!z%C*F-JaNdRgUkXp2r5u8x/");
    } else if (window.isStaging == "SL") {
        keyHex = CryptoJS.enc.Utf8.parse("$B&E)H@McQfTjWnZr4u7x!A%C*F-JaNd");
    }

    // 創建 IV
    const ivHex = CryptoJS.lib.WordArray.create(new Uint8Array(parses(GUID)));

    // 構建要加密的文本：UTC 時間 + Z + uniqueId
    const texts = moment().utc().toISOString().split(".")[0] + "Z" + uniqueId;
    const messageHex = CryptoJS.enc.Utf8.parse(texts);

    // AES 加密
    const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // 組合結果：GUID + 加密後的密文（base64 編碼）
    const boxValue = GUID + encrypted.ciphertext.toString(base64);

    // 保存 uniqueId 到存儲
    if (uniqueId) {
        StorageUtil.save({
            key: "getUniqueId",
            data: uniqueId,
        });
    }

    return boxValue;
};

/**
 * 檢測 ImageEditor.cropImage 是否可用
 * @returns {Promise<boolean>} ImageEditor 是否可用
 */
export const checkImageEditorAvailability = () => {
    return new Promise((resolve) => {
        try {
            if (ImageEditor && typeof ImageEditor.cropImage === "function") {
                // 實際調用測試 ImageEditor.cropImage 是否能正常工作
                // 參考 Captcha.js 中的正確使用方式進行測試
                const testParams = {
                    offset: { x: 0, y: 0 },
                    size: { width: 10, height: 10 },
                    resizeMode: "contain",
                    displaySize: { width: 10, height: 10 }
                };

                // 使用空字符串或無效URI進行測試，檢測原生代碼是否正常響應
                ImageEditor.cropImage("invalid_test_uri", testParams)
                    .then(() => {
                        // 意外成功，說明方法可用
                        console.log("ImageEditor.cropImage test succeeded unexpectedly - method is available");
                        resolve(true);
                    })
                    .catch((error) => {
                        // 分析錯誤類型來判斷方法是否可用
                        const errorStr = error?.message || error?.toString() || "";
                        console.log("ImageEditor.cropImage test error:", errorStr);

                        // 這些錯誤說明方法可用，只是測試參數的問題
                        if (errorStr.includes("Image could not be loaded") ||
                            errorStr.includes("Invalid image") ||
                            errorStr.includes("Unable to load") ||
                            errorStr.includes("file not found") ||
                            errorStr.includes("Failed to load") ||
                            errorStr.includes("bad url") ||
                            errorStr.includes("null") ||
                            errorStr.match(/invalid.*uri/i)) {

                            console.log("ImageEditor.cropImage is working - got expected parameter error");
                            resolve(true);
                        } else {
                            // 其他錯誤可能是原生實現問題
                            console.log("ImageEditor.cropImage native implementation may be broken:", error);
                            resolve(false);
                        }
                    });
            } else {
                console.log("ImageEditor.cropImage method not found");
                resolve(false);
            }
        } catch (error) {
            // 同步異常，說明原生代碼有嚴重問題
            console.log("ImageEditor.cropImage threw synchronous error:", error);
            resolve(false);
        }
    });
};

/**
 * 遮罩姓名
 * @param {string} name - 姓名
 * @param {string} locale - 語言代碼 (CN/TH/VN)
 * @returns {string} 遮罩後的姓名
 */
export const maskName = (name) => {
    let locale = window.LANGUAGE;
    if (!name || typeof name !== "string") {
        return "";
    }

    // 中文處理
    if (locale === "CN") {
        const chineseRegex = /[\u4e00-\u9fff]/;
        if (chineseRegex.test(name)) {
            const length = name.length;
            if (length === 2) {
                // 兩個字：測試 -> 測*試
                return name[0] + "*" + name[1];
            } else if (length >= 3) {
                // 三個字以上：諸葛孔明 -> 諸*明
                return name[0] + "*" + name[length - 1];
            }
        }
    }

    // 越南和泰國處理
    if (locale === "VN" || locale === "TH") {
        const words = name.trim().split(/\s+/);
        return words.map(word => {
            if (word.length === 0) return word;
            return word[0] + "***";
        }).join(" ");
    }

    // 預設處理（其他語言）
    return name;
};


/**
 * 根據輸贏金額獲取對應的顏色和符號
 * @param {number|string|null|undefined} winLoss - 輸贏金額
 * @returns {Object} 包含 color（顏色值）和 sign（符號：+/- 或空字符串）的對象
 */
export const getWinLossColor = (winLoss) => {
    // 處理 null、undefined 或空值的情況
    if (winLoss == null || winLoss === "" || winLoss === undefined) {
        return {
            color: "#222222", // 灰色：無輸贏
            sign: "", // 無符號
        };
    }

    // 將 winLoss 轉換為數字進行比較
    const winLossNum = typeof winLoss === "string" ? parseFloat(winLoss) : winLoss;

    // 處理 NaN 的情況（parseFloat 失敗時）
    if (isNaN(winLossNum) || winLossNum == 0) {
        return {
            color: "#222222", // 灰色：無輸贏
            sign: "", // 無符號
        };
    }

    const isChinese = window.LANGUAGE == "CN";
    const isPositive = winLossNum > 0;

    let color;
    if (isChinese) {
        // 中文：盈利紅色，虧損綠色
        color = isPositive ? "#F92D2D" : "#42D200";
    } else {
        // 其他語言：盈利綠色，虧損紅色
        color = isPositive ? "#42D200" : "#F11818";
    }

    return {
        color,
        sign: isPositive ? "+" : "-",
    };
};

export const getMoneyFormat = (num, type) => {
    let currencySymbol = "";
    let position = "after"; // 默認貨幣符號位置：後面

    // 設置默認貨幣符號和位置
    if (type === undefined || type === null) {
        switch (window.LANGUAGE) {
            case "CN":
                currencySymbol = "¥";
                position = "before"; // 人民幣符號在前面
                break;
            case "TH":
                currencySymbol = "฿";
                position = "before"; // 泰銖符號在前面
                break;
            default:
                currencySymbol = "đ";
                position = "after"; // 越南盾符號在後面
        }
    } else {
        currencySymbol = type; // 自定義符號
    }

    // 如果沒有數值，返回 0
    if (!num && num !== 0) {
        if (currencySymbol === "") return "0";
        return position === "before" ? `${currencySymbol} 0` : `0 ${currencySymbol}`;
    }

    // 防閃退：檢查輸入是否為有效數字或字符串數字
    if (num === null || num === undefined || num === "") {
        return "0"; // 空值
    }

    // 檢查是否為字符串數字或純數字
    const numStr = String(num).trim();
    if (numStr === "" || numStr === "null" || numStr === "undefined" || numStr === "NaN") {
        return "0"; // 無效字符串
    }

    // 檢查是否為有效的數字格式（包括負數、小數）
    const validNumberRegex = /^-?\d+(\.\d+)?$/;
    if (!validNumberRegex.test(numStr)) {
        return "0"; // 非數字格式
    }

    // 處理為數字
    const numValue = parseFloat(num);
    if (isNaN(numValue) || !isFinite(numValue)) {
        return "0"; // 無效數字
    }

    // 使用字符串處理，避免浮點誤差
    const numStr2 = numValue.toString();
    const dotIndex = numStr2.indexOf(".");
    let formattedNum;

    if (dotIndex === -1) {
        // 整數
        formattedNum = numStr2 + ".00";
    } else {
        // 截斷至兩位
        const integerPart = numStr2.substring(0, dotIndex);
        const decimalPart = numStr2.substring(dotIndex + 1);
        const truncatedDecimal = decimalPart.substring(0, 2).padEnd(2, "0");
        formattedNum = integerPart + "." + truncatedDecimal;
    }

    let [integer, decimal] = formattedNum.split(".");
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 小數部分清理
    let cleanDecimal = decimal;
    if (dotIndex === -1) {
        // 整數，沒有小數部分
        cleanDecimal = "";
    } else {
        // 檢查原始數字的小數位數
        const originalDecimalPart = numStr2.substring(dotIndex + 1);
        if (originalDecimalPart.length === 1) {
            // 原始只有1位小數，補0到2位
            cleanDecimal = originalDecimalPart + "0";
        } else if (originalDecimalPart.length === 2) {
            // 原始有2位小數，保持不變
            cleanDecimal = originalDecimalPart;
        } else {
            // 原始有3位+小數，截取前2位，但如果是浮點精度問題導致的，需要特殊處理
            if (originalDecimalPart.length > 10) {
                // 很可能是浮點精度問題，保持截取後的2位
                cleanDecimal = decimal;
            } else {
                // 正常截取，去掉末尾的0
                cleanDecimal = decimal;
            }
        }
    }

    // 空符號
    if (currencySymbol === "") {
        return cleanDecimal === "" ? integer : `${integer}.${cleanDecimal}`;
    }

    // 最終返回
    if (cleanDecimal === "") {
        return position === "before"
            ? `${currencySymbol} ${integer}`
            : `${integer} ${currencySymbol}`;
    } else {
        return position === "before"
            ? `${currencySymbol} ${integer}.${cleanDecimal}`
            : `${integer}.${cleanDecimal} ${currencySymbol}`;
    }
};

/**
 * 一個用於處理分頁中載入更多數據的工具函數。
 *
 * @param {Object} params - 參數對象。
 * @param {number} params.page - 當前頁碼。
 * @param {number} params.pageSize - 每頁的項目數量。
 * @param {Array} params.data - 要分頁的完整數據集。
 * @param {Function} params.setLoadingMore - 用於設置載入更多狀態的函數。
 * @param {Function} params.updateData - 用於更新當前數據狀態的函數。
 */
export const loadMoreData = ({ page, pageSize, data, setLoadingMore, setLoadingMoreAndData }) => {
    const displayData = data;

    if (page * pageSize >= displayData.length) return; // 檢查是否還有更多數據可以載入

    setLoadingMore(true);

    setTimeout(() => {
        const nextPage = page + 1;
        const nextData = displayData.slice(0, nextPage * pageSize); // 獲取下一部分數據

        setLoadingMoreAndData(false, nextPage, nextData); // 將載入狀態設回false並更新數據狀態
    }, 1000);
};


export const isManualType = promotionType => {
    // 如果 promotionType 無效，直接返回 false
    if (!promotionType || typeof promotionType !== "string") {
        return false;
    }
    // 如果有，去除空格和符號後轉換成大寫
    const normalizedType = promotionType.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const validTypes = ["MANUALPREBONUS", "MANUAL", "MANUALITEM"]; // 可接受的類型
    return validTypes.includes(normalizedType);
};



