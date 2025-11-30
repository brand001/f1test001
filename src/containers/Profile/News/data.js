import React from "react";

import { translate } from "@/locales/translate";
import ImageMap from "@/locales/Images";
import { ImagesUrl } from "@/images/index";

// 定義翻譯鍵映射，將 key 映射到對應的翻譯鍵
const translationKeys = {
    0: "全部",
    3: "存款",
    4: "提款",
    5: "其它",
    7: "个人(公告类别)",
    8: "产品",
    9: "优惠(公告类别)",
    10: "其它",
};

// 保持原有函數不變
export const getTransferSelsctDate = () => [
    {
        name: translate("全部"),
        key: 0,
        color: "#222222",
        img: ImagesUrl.newsMsgOther,
    },
    {
        name: translate("存款"),
        key: 3,
        color: "#FFA95C",
        get img() {
            return ImageMap.newsMsg3;
        },
    },
    {
        name: translate("提款"),
        key: 4,
        color: "#D97AFC",
        img: ImagesUrl.newsMsg5,
    },
    {
        name: translate("其它"),
        key: 5,
        color: "#FF765E",
        img: ImagesUrl.newsMsg6,
    },
];

export const getPromotionsSelsctDate = () => [
    {
        name: "",
        key: 6,
        color: "transparent",
        img: ImagesUrl.newsMsg6,
    },
];

export const getPersonalSelsctDate = () => [
    {
        name: "",
        key: 2,
        color: "transparent",
        img: ImagesUrl.newsMsgOther,
    },
    {
        name: "",
        key: 1,
        color: "transparent",
        img: ImagesUrl.newsMsgOther,
    },
];

export const getAnnouncementSelsctDate = () => [
    {
        name: translate("全部"),
        key: 0,
        color: "#222222",
        img: ImagesUrl.newsMsgOther,
    },
    {
        name: translate("个人(公告类别)"),
        key: 7,
        color: "#3E84FF",
        img: ImagesUrl.newsAnnouncement7,
    },
    {
        name: translate("产品"),
        key: 8,
        color: "#BB1EB3",
        img: ImagesUrl.newsAnnouncement8,
    },
    {
        name: translate("优惠(公告类别)"),
        key: 9,
        color: "#F44729",
        img: ImagesUrl.newsAnnouncement9,
    },
    {
        name: translate("其它"),
        key: 10,
        color: "#78909C",
        img: ImagesUrl.newsOther,
    },
];

// 為了保持向後兼容
export const TransferSelsctDate = getTransferSelsctDate();
export const PromotionsSelsctDate = getPromotionsSelsctDate();
export const PersonalSelsctDate = getPersonalSelsctDate();
export const AnnouncementSelsctDate = getAnnouncementSelsctDate();

// 創建一個基礎對象，不包含 name
const baseIconColorObj = [...TransferSelsctDate, ...AnnouncementSelsctDate, ...PromotionsSelsctDate, ...PersonalSelsctDate]
    .filter(v => v.key > 0)
    .reduce((obj, v) => {
        obj[v.key] = {
            color: v.color,
            img: v.img,
        };
        return obj;
    }, {});

// 使用 Proxy 創建動態 NewsIconColorTextObj
export const NewsIconColorTextObj = new Proxy(baseIconColorObj, {
    get: function(target, prop) {
        // 如果不是數字鍵或對象不存在，直接返回 undefined
        if (isNaN(prop) || !target[prop]) {
            return target[prop];
        }

        // 返回一個代理對象來攔截 name 屬性的訪問
        return new Proxy(target[prop], {
            get: function(obj, key) {
                if (key === "name") {
                    // 動態獲取翻譯
                    const transKey = translationKeys[prop];
                    return transKey ? translate(transKey) : "";
                }
                return obj[key];
            },
        });
    },
});
