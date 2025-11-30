// src/utils/SbSportsBridge.js

// ========== UI 组件集合 ==========
const componentsMap = {
    CN: {
        SbTabBar: require("$SBCN/SbTabBar").default,
        SbSports: require("$SBCN/containers/index").default,
        Rules: require("$SBCN/containers/Help/Rules").default,
        BetTutorial: require("$SBCN/containers/Betting/tutorial").default,
        Betting_detail: require("$SBCN/game/Betting-detail/index").default,
        betRecord: require("$SBCN/containers/Betting/betRecord").default,
        search: require("$SBCN/containers/search/index").default,
        Setting: require("$SBCN/containers/Setting/Setting").default,
        SetTingModle: require("$SBCN/containers/Setting/SetTingModle").default,
        NewsSb: require("$SBCN/containers/News").default,
        NewsDetailSb: require("$SBCN/containers/NewsDetail").default,
        DrawerContent: require("$SBCN/containers/DrawerContent").default,
    },
    VN: {
        SbTabBar: require("$SBVN/SbTabBar").default,
        SbSports: require("$SBVN/containers/index").default,
        Rules: require("$SBVN/containers/Help/Rules").default,
        BetTutorial: require("$SBVN/containers/Betting/tutorial").default,
        Betting_detail: require("$SBVN/game/Betting-detail/index").default,
        betRecord: require("$SBVN/containers/Betting/betRecord").default,
        search: require("$SBVN/containers/search/index").default,
        Setting: require("$SBVN/containers/Setting/Setting").default,
        SetTingModle: require("$SBVN/containers/Setting/SetTingModle").default,
        NewsSb: require("$SBVN/containers/News").default,
        NewsDetailSb: require("$SBVN/containers/NewsDetail").default,
        DrawerContent: require("$SBVN/containers/DrawerContent").default,
    },
};

export const GetSbComponents = (lang = window.LANGUAGE || "VN") => {
    return componentsMap[lang] || componentsMap["VN"];
};

// ========== lib 模块 ==========
let EventData,
    EventInfo,
    HostConfig,
    VendorIM,
    VendorSABA,
    VendorBTI,
    getAllVendorToken,
    ApiPortSB,
    EventChangeType,
    SpecialUpdateType,
    removeVendorToken,
    VendorMarkets;

if (window.LANGUAGE === "CN") {
    EventData = require("$SBCN/lib/vendor/data/EventData").default;
    EventInfo = require("$SBCN/lib/vendor/data/EventInfo").default;
    HostConfig = require("$SBCN/lib/Host.config").default;
    VendorIM = require("$SBCN/lib/vendor/im/VendorIM").default;
    VendorSABA = require("$SBCN/lib/vendor/saba/VendorSABA").default;
    VendorBTI = require("$SBCN/lib/vendor/bti/VendorBTI").default;
    getAllVendorToken = require("$SBCN/lib/js/util").getAllVendorToken;
    removeVendorToken = require("$SBCN/lib/js/util").removeVendorToken;
    ApiPortSB = require("$SBCN/lib/SPORTAPI").ApiPortSB;

    const vendorConsts = require("$SBCN/lib/vendor/data/VendorConsts");
    EventChangeType = vendorConsts.EventChangeType;
    SpecialUpdateType = vendorConsts.SpecialUpdateType;
    VendorMarkets = vendorConsts.VendorMarkets;
} else {
    EventData = require("$SBVN/lib/vendor/data/EventData").default;
    EventInfo = require("$SBVN/lib/vendor/data/EventInfo").default;
    HostConfig = require("$SBVN/lib/Host.config").default;
    VendorIM = require("$SBVN/lib/vendor/im/VendorIM").default;
    VendorSABA = require("$SBVN/lib/vendor/saba/VendorSABA").default;
    VendorBTI = require("$SBVN/lib/vendor/bti/VendorBTI").default;
    getAllVendorToken = require("$SBVN/lib/js/util").getAllVendorToken;
    removeVendorToken = require("$SBVN/lib/js/util").removeVendorToken;
    ApiPortSB = require("$SBVN/lib/SPORTAPI").ApiPortSB;

    const vendorConsts = require("$SBVN/lib/vendor/data/VendorConsts");
    EventChangeType = vendorConsts.EventChangeType;
    SpecialUpdateType = vendorConsts.SpecialUpdateType;
    VendorMarkets = vendorConsts.VendorMarkets;
}

// ========== 导出 ==========
export {
    EventData,
    EventInfo,
    HostConfig,
    VendorIM,
    VendorSABA,
    VendorBTI,
    getAllVendorToken,
    ApiPortSB,
    EventChangeType,
    SpecialUpdateType,
    VendorMarkets,
    removeVendorToken
};
