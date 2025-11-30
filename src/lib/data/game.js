// 游戏供应商介绍
import { translate } from "$locales/translate";

// 小標籤
export const labelText = {
    JIR: { text: "JIR", bgColor: "#2230FF", color: "#ffffff" },
    JIF: { text: "JILI", bgColor: "#2230FF", color: "#fff" }, //https://arcadie.atlassian.net/browse/SSF-37
    TG_SLOT: { text: "PP", bgColor: "#F49239", color: "#fff" },
    TG: { text: "PP", bgColor: "#F49239", color: "#fff" },
    MGP: { text: "MG", bgColor: "#2ACA8E", color: "#fff" },
    BSG: { text: "BSG", bgColor: "#000000", color: "#fff" },
    PGS: { text: "PG", bgColor: "#12B2A1", color: "#fff" },
    PT: { text: "PT", bgColor: "#2C3F7E", color: "#fff" },
    IMOPT: { text: "PT", bgColor: "#2C3F7E", color: "#fff" },
    CQG: { text: "CG9", bgColor: "#FFFFFF", color: "#FF7700" },
    PNG: { text: "PNG", bgColor: "#0182C3", color: "#fff" },
    SWF: { text: "SWF", bgColor: "#6978DF", color: "#fff" }, // https://arcadie.atlassian.net/browse/SSF-16
    SPG: { text: "SPG", bgColor: "#F30000", color: "#fff" }, //https://arcadie.atlassian.net/browse/SSF-16
    EVP: { text: "EVP", bgColor: "#1E5F95", color: "#fff" },
    HBN: { text: "HBN", bgColor: "#FB5D42", color: "#fff" },
    BNG: { text: "BNG", bgColor: "#19E4A4", color: "#fff" },
    EVORT: { text: "RT", bgColor: "#D9E2DB", color: "#FF0000" },
    EVOBT: { text: "BTG", bgColor: "#171717", color: "#FF0000" },
    HSW: { text: "HSW", bgColor: "#5FB174", color: "#fff" },
    FCG: { text: "FCG", bgColor: "#2828B2", color: "#FF8519" },
    TPF: { text: "TPF", bgColor: "#16368E", color: "#fff" },
    NTL: { text: "NTL", bgColor: "#00a6ff", color: "#fff" },

    // 真人
    WEC: { text: "WE", bgColor: "#A88241", color: "#fff" },
    GPI: { text: "FUN", bgColor: "#00A6FF", color: "#fff" },
    EVO: { text: "EVO", bgColor: "#679DB9", color: "#fff" },
    EBT: { text: "EBT", bgColor: "#2E67B1", color: "#222" },
    AG: { text: "PA", bgColor: "#F98436", color: "#fff" },
    AGL: { text: "PA", bgColor: "#F98436", color: "#fff" },
    SXY: { text: "SXY", bgColor: "#FD3684", color: "#fff" },
    NLE: { text: "N2", bgColor: "#fff", color: "#000" },
    WMC: { text: "WMC", bgColor: "#0E1544", color: "#fff" },
    TG_LIVECASINO: { text: "PP", bgColor: "#FFFFFF", color: "#F08B08" },
    DGG: { text: "DG", bgColor: "#EBEBEB", color: "#9F8247" },
    YBL: { text: "ZUI", bgColor: "#E4D3B2", color: "#000" },
    ABT: { text: "ABT", bgColor: "#212121", color: "#D1C5AD" },
    BGG: { text: "BG", bgColor: "#2424B4", color: "#fff" },
    YBT: { text: "YBT", bgColor: "#8A0000", color: "#FFFFFF" },
    NGS: { text: "NGS", bgColor: "#613AB2", color: "#fff" },
    EAL: { text: "EAL", bgColor: "#0d49ff", color: "#fff" },

    // 體育
    VTG: { text: "V2G", bgColor: "#F39F12", color: "#fff" },

    // 小遊戲
    SPR: { text: "SPR", bgColor: "#E5073A", color: "#fff" },
    GLX: { text: "GLX", bgColor: "#0668FF", color: "#fff" },

    //棋牌P2P
    TGP: { text: window.LANGUAGE == "CN" ? "TGP" : "KM", bgColor: "#F09A01", color: "#fff" },
    KPK: { text: "KPK", bgColor: "#047B6C", color: "#fff" },
    JBP: { text: "TGP", bgColor: "#F09A01", color: "#fff" },
    KYS: { text: "KYS", bgColor: "#E45940", color: "#fff" },
    DBP: { text: "DBP", bgColor: "#00A6FF", color: "#fff" },
    VEP: { text: "VEP", bgColor: "#A552C2", color: "#fff" },

    //lottery
    SLC: { text: "SLC", bgColor: "#44B1D5", color: "#fff" },
    SLS: { text: "SLC", bgColor: "#44B1D5", color: "#fff" },
    TCG: { text: "TC", bgColor: "#A40000", color: "#fff" },
    SGW: { text: "SGW", bgColor: "#4923D7", color: "#fff" },
    GPK: { text: "FUN", bgColor: "#1495DA", color: "#fff" },


    JKR: { text: "JKR", bgColor: "#EBB600", color: "#fff" },
    SPX: { text: "SPX", bgColor: "#171717", color: "#F8AA1A" },
    AMB: { text: "AMB", bgColor: "#309246", color: "#fff" },
    IMONET: { text: "NET", bgColor: "#fff", color: "#46BF00" },
    SAL: { text: "SA", bgColor: "#14594E", color: "#fff" },
    AMK: { text: "AMK", bgColor: "#FFFFFF", color: "#3E8D6E" },

    // 捕魚遊戲
    DBF: { text: "ZUI", bgColor: "#BF401A", color: "#fff" },
};


// 體育遊戲
export const sportsName = ["IPSB", "OWS", "SBT"];

export const AllowRotationGame = {
    get CN() {
        return ["YBS", "AGL", "BGG", "WEC", "TG", "HSW", "SWF", "BSG", "BNG", "DBF", "DBP", "KYS", "JBP", "SWF", "SPG", "CQG"];
    },
    get TH() {
        return ["SXY", "GPI", "TG", "AGL", "DGG", "WMC", "WEC", "SAL", "TG", "BNG", "BSG", "MGP", "HSW", "CQG", "SWF", "PNG", "EVOBT", "HBN", "EVP", "JIF", "TGP_P2P", "KPK", "SWF", "JKR", "SPG"];
    },
    get VN() {
        return ["SXY", "GPI", "DGG", "AGL", "TG", "TG_LIVECASINO", "WMC", "WEC", "TG_SLOT", "SWF", "HSW", "MGP", "BNG", "BSG", "CQG", "SPG", "EVP", "PNG", "HBN", "JIF", "TPF", "SWF"];
    },
};
export const categoryAnn = {
    esports: "IMSportsbook",
    sportsbook: "Sportsbook",
    lottery: "Keno",
    slot: "Slot",
    casino: "Casino",
    p2p: "Poker",
    instantgames: "spr",
};
export const LaunchGameMap = {
    get CN() {
        return ["SPORTSBOOK", "ESPORTS", "KENOLOTTERY"];
    },
    get TH() {
        return ["SPORTSBOOK", "ESPORTS"];
    },
    get VN() {
        return ["SPORTSBOOK", "ESPORTS"];
    }
};

export const ProductGameDetailGameMap = {
    get CN() {
        return ["CASINO", "P2P", "SLOT", "LIVECASINO", "INSTANTGAMES", "FISHING"];
    },
    get TH() {
        return ["CASINO", "P2P", "SLOT", "LIVECASINO", "INSTANTGAMES", "KENOLOTTERY", "FISHING"];
    },
    get VN() {
        return ["CASINO", "P2P", "SLOT", "LIVECASINO", "INSTANTGAMES", "KENOLOTTERY", "FISHING"];
    },
};

export const ProductGamePageGameMap = {
    get CN() {
        return ["SLOT", "P2P", "LIVECASINO", "FISHING"];
    },
    get TH() {
        return ["SLOT", "P2P", "LIVECASINO", "KENOLOTTERY", "INSTANTGAMES", "FISHING"];
    },
    get VN() {
        return ["SLOT", "P2P", "LIVECASINO", "KENOLOTTERY", "INSTANTGAMES", "FISHING"];
    },
};

export const allowGuestCode = ["IPSB", "OWS", "CML", "IPES", "TFG", "SBT"];
// CXFUN88-3940  只有SB 有guest view

//遊戲列表排序
export const slotDropdown = [
    {
        id: 0,
        get title() {
            return translate("默认");
        },
        value: "Default",
    },
    {
        id: 1,
        get title() {
            return translate("最新");
        },
        value: "IsNew",
    },
    {
        id: 2,
        get title() {
            return translate("推荐");
        },
        value: "Recommended",
    },
    {
        id: 3,
        get title() {
            return translate("A-Z");
        },
        value: "AToZ",
    },
];


export const AnnouncementOptionType = {
    sportsbook: "Sportsbook",
    livecasino: "Casino",
    slot: "Slot",
    p2p: "Poker",
    kenolottery: "Keno",
    SB2: "Sportsbook",
    vendorsportsbook: "Vendorsportsbook",
    withdrawal: "Withdrawal",
    deposit: "Deposit",
};

const OTHER = "OTHER";
export const WalletMappingGame = {
    SPORTSBOOK: "SB",
    ESPORTS: "SB",
    INSTANTGAMES: "P2P",
    P2P: "P2P",
    LIVECASINO: "LD",
    KENOLOTTERY: "KENO",
    SLOT: "SLOT",
    FISHING: "SLOT",
};

let gameCodeObj = {};
export const SetGameCodeObjValues = function(data) {
    data.forEach((v1, i1) => {
        let categoryCode = v1?.code?.toLocaleUpperCase();
        let categoryName = v1?.name;
        gameCodeObj[categoryCode] = {
            categoryName,
        };
        v1.subProviders.forEach((v2, i2) => {
            let gameCode = v2?.code?.toLocaleUpperCase();
            let gameWalletCode = "SB";
            if (["SLOT"].includes(categoryCode)) {
                gameWalletCode = WalletMappingGame[categoryCode][gameCode] || WalletMappingGame[categoryCode][`${OTHER}`];
            } else {
                gameWalletCode = WalletMappingGame[categoryCode];
            }

            let tempData = {
                categoryName,
                categoryCode,
                categoryGameCode: v1?.code, // api 不支持全大小写
                gameCode,
                gameWalletCode,
            };
            if (gameCode == "TG") {
                gameCodeObj[gameCode + "-" + categoryCode] = tempData;
            } else {
                gameCodeObj[gameCode] = tempData;
            }
        });
    });
};
export const GetGameCodeObjValues = function(code) {
    return gameCodeObj[code?.toLocaleUpperCase()] || {};
};

export const GetTgGameWallet = async function(gameId) {
    if (!gameId) return;
    let categoryGameCode = ["LiveCasino", "Slot"];
    for (let i = 0; i < categoryGameCode.length; i++) {
        let fetchurl = `${Strapi_Domain}${ApiPort.CMS_GetGame}gameType=${categoryGameCode[i]}&gameSortingType=Default&category=&platform=app`;
        let data = [];
        try {
            let res = await fetchRequestCMS(fetchurl, "GET");
            data = res?.result?.gameDetails || [];
            if (!(Array.isArray(data) && data.length)) return;
            let tempData = data.find(v => v.gameId == gameId);
            if (tempData) {
                return categoryGameCode[i];
            }
        } catch (err) {}
    }
};

/**
 * 合併兩個 URL 的參數，保留原有 URL 中的 lang 和 token 參數，並添加新的參數。
 *
 * @param {string} gameLobbyUrl - 原始的遊戲大廳 URL。
 * @param {string} newParams - 新的 URL 參數，以字符串形式提供。
 * @returns {string} - 合併后的 URL。
 */
export const mergeUrls = function(gameLobbyUrl) {
    const newParams = "&skin=7&types=promotion&childType=jackpot&childtab=1&isApp=True";
    // 提取 lang 和 token
    const baseUrl = gameLobbyUrl.split("?")[0];

    // 提取 lang 和 token
    const langMatch = gameLobbyUrl.match(/lang=([^&]*)/);
    const tokenMatch = gameLobbyUrl.match(/token=([^&]*)/);
    const langParam = langMatch ? langMatch[0] : "";
    const tokenParam = tokenMatch ? tokenMatch[0] : "";

    // 合併 lang 和 token 參數，過濾掉空字串
    const extractedParams = [langParam, tokenParam].filter(param => param).join("&");

    // 組新的 URL
    const mergedParams = extractedParams ? `${extractedParams}&${newParams}` : newParams;

    return `${baseUrl}?${mergedParams}`;
};


export const MIN_LIMIT_MONEY = {
    CN: 10,
    TH: 50,
    VN: 30,
};

