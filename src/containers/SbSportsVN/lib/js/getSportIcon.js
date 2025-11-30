import { ImagesUrl } from "@/images/index";

//體育id對應體育圖的x-y座標
//已按座標設置好文件名，選中加s  例：足球: 1-1.png 選中 1-1s.png
const sporticonMap = {
    NOTFOUND: "6-7", //找不到一律用 其他
    IM: {
        // 體育列表 參考lib/vendor/im/IMConsts.js
        S_1: "1-1", //   SOCCER: 1, //足球
        S_2: "1-2", //   BASKETBALL: 2, //篮球
        S_3: "1-3", //   TENNIS: 3, //网球
        S_6: "4-6", //   ATHLETICS: 6, //田径
        S_7: "2-3", //   BADMINTON: 7, //羽毛球
        S_8: "2-1", //   BASEBALL: 8, //棒球
        S_11: "2-5", //   BOXING: 11, //拳击
        S_13: "2-7", //   Cricket: 13, 板球(額外追加)
        S_15: "3-6", //   DARTS: 15,  //飞镖
        S_18: "1-7", //   LAWNHOCKEY: 18, //草地曲棍球
        S_19: "1-6", //   FOOTBALL: 19, //美式足球
        S_21: "7-7", //   GOLF: 21, //高尔夫球
        S_23: "3-1", //   HANDBALL: 23, //手球
        S_25: "1-7", //   ICEHOCKEY: 25, //冰上曲棍球
        S_29: "12-1", //   MOTOR: 29, //赛车运动
        S_31: "2-6", //   RUGBY: 31, //橄榄球
        S_32: "6-4", //   SAILING: 32, //帆船
        S_34: "2-4", //   SNOOKER: 34, //斯诺克 / 英式台球, 包括亚洲 9 球和台球
        S_36: "4-5", //   TABLETENNIS: 36, //乒乓球
        S_39: "7-1", //   VIRTUALSOCCER: 39, //虚拟足球
        S_40: "2-2", //   VOLLEYBALL: 40, //排球, 包括沙滩排球
        S_41: "3-7", //   WATERPOLO: 41, //水球
        S_43: "7-3", //   VIRTUALBASKETBALL: 43, //虚拟篮球
        S_44: "12-3", //   VIRTUALWORLDCUP: 44, //虚拟世界杯
        S_45: "17-4", //   ENTERTAINMENTBETTING: 45, //娱乐投注
        S_46: "12-5", //   VIRTUALNATIONALCUP: 46, //虚拟国家杯
        S_47: "14-6", //Virtual Soccer England League: 47, //虚拟足球英国联赛(額外追加)
        S_49: "14-7", //Virtual Soccer Spain Friendly: 49, //虚拟足球西班牙友谊赛(額外追加)
        //S_51: '', //Financial Bets: 51, //金融投注(額外追加) (找不到)
        S_52: "15-3", //Virtual Soccer Spain League: 52, //虚拟足球西班牙联赛(額外追加)
        S_53: "15-2", //Virtual Soccer Italy League: 53, //虚拟足球意大利联赛(額外追加)
        //   ALLEXCEPTSOCCER: -1, //所有非足球体育 (只应用于索取赛事信息)
        //   ALL: 98, //所有体育项目(只应用于Search,GetMArketEventCount)
    },
    BTI: {
        // 體育列表 參考lib/vendor/bti/BTIConsts.js
        S_1: "1-1", // SOCCER: 1, //足球
        S_2: "1-2", // BASKETBALL: 2, //篮球
        S_3: "1-6", // FOOTBALL: 3, //美式足球
        S_6: "1-3", // TENNIS: 6, //网球
        S_7: "2-1", // BASEBALL: 7, //棒球
        S_8: "1-7", // ICEHOCKEY: 8, //冰上曲棍球
        S_10: "3-1", // HANDBALL: 10, //手球
        S_11: "7-6", // RUGBYLEAGUE: 11, //橄榄球(聯盟式)
        S_12: "7-7", // GOLF: 12, //高尔夫球
        S_13: "2-4", // SNOOKER: 13, //斯诺克 / 英式台球, 包括亚洲 9 球和台球
        S_14: "12-1", // MOTOR: 14, //赛车运动
        S_15: "3-6", // DARTS: 15,  //飞镖
        S_16: "4-2", // CYCLING: 16, //不清楚(單車競速?)
        S_19: "2-2", // VOLLEYBALL: 19, //排球
        S_20: "2-5", // BOXING: 20, //拳击
        S_25: "1-1", // FUTSAL: 25, //5人制足球
        S_26: "4-5", // TABLETENNIS: 26, //乒乓球
        S_27: "8-4", // BOWLS: 27, //保齡球
        S_28: "8-5", // WINTERSPORTS: 28, //冬季運動
        S_29: "8-6", // HURLING: 29, //板棍球，又称爱尔兰式曲棍球
        S_31: "3-7", // WATERPOLO: 31, //水球
        S_32: "4-3", // BEACHVOLLEYBALL: 32, //沙滩排球
        S_33: "8-7", // BEACHSOCCER: 33, //沙灘足球
        S_34: "2-3", // BADMINTON: 34, //羽毛球
        S_35: "9-1", // RUGBYUNION: 35, //橄榄球(聯合式)
        S_37: "9-3", // CURLING: 37, //冰壺
        S_39: "9-4", // BANDY: 39, //班迪球
        S_41: "9-6", // AUSSIERULES: 41, //澳式足球
        S_43: "10-1", // MMA: 43, //綜合格鬥
        S_59: "2-7", // CRICKET: 59, //板球
        S_63: "11-1", // NETBALL: 63, //籃網球，英式籃球
        S_21: "4-6", // ATHLETICS: 21, //田径
        S_45: "5-6", // SWIMMING: 45, //游泳
        S_42: "9-7", // WINTEROLYMPIC: 42, //冬奧
        S_64: "11-2", // ESPORTS: 64, //電競?
    },
    SABA: {
        // 體育列表 參考lib/vendor/saba/SABAConsts.js
        S_1: "1-1", // SOCCER: 1, //足球
        S_2: "1-2", // BASKETBALL: 2, //篮球
        S_3: "1-6", // FOOTBALL: 3, //美式足球
        S_4: "1-7", // ICEHOCKEY: 4, //冰上曲棍球
        S_5: "1-3", // TENNIS: 5, //网球
        S_6: "2-2", // VOLLEYBALL: 6, //排球
        S_7: "3-5", // BILLIARDS: 7, //台球
        S_8: "2-1", // BASEBALL: 8, //棒球
        S_9: "2-3", // BADMINTON: 9, //羽毛球
        S_10: "7-7", // GOLF: 10, //高尔夫球
        S_11: "12-1", // MOTORSPORTS: 11, //赛车运动
        S_12: "5-6", // SWIMMING: 12, //游泳
        S_13: "15-1", // POLITICS: 13, //政治
        S_14: "3-7", // WATERPOLO: 14, //水球
        S_15: "10-5", // DIVING: 15, //潛水
        S_16: "2-5", // BOXING: 16, //拳击
        S_17: "4-7", // ARCHERY: 17, //射箭
        S_18: "4-5", // TABLETENNIS: 18, //乒乓球
        S_19: "5-1", // WEIGHTLIFTING: 19, //舉重
        S_20: "5-2", // CANOEING: 20, //皮划艇
        S_21: "5-3", // GYMNASTICS: 21, //體操
        S_22: "4-6", // ATHLETICS: 22, //田径
        S_23: "5-4", // EQUESTRIAN: 23, //馬術
        S_24: "3-1", // HANDBALL: 24, //手球
        S_25: "3-6", // DARTS: 25,  //飞镖
        S_26: "2-6", // RUGBY: 26, //英式橄榄球
        S_28: "1-7", // FIELDHOCKEY: 28, //曲棍球
        S_29: "8-5", // WINTERSPORT: 29, //冬季比賽
        S_30: "7-4", // SQUASH: 30, //壁球
        S_31: "17-4", // ENTERTAINMENT: 31, //娛樂
        S_32: "11-1", // NETBALL: 32, //籃網球，英式籃球
        S_33: "4-2", // CYCLING: 33, //自行車
        S_34: "5-7", // FENCING: 34, //击剑
        S_35: "6-1", // JUDO: 35, //柔道
        S_36: "6-2", // MPENTATHLON: 36, //现代五项比赛
        S_37: "6-3", // ROWING: 37, //赛艇
        S_38: "6-4", // SAILING: 38, //帆船
        S_39: "6-5", // SHOOTING: 39, //射擊
        S_40: "6-6", // TAEKWONDO: 40, //跆拳道
        S_41: "5-5", // TRIATHLON: 41, //铁人三项
        S_42: "10-3", // WRESTLING: 42, //摔跤
        S_43: "11-2", // ESPORTS: 43, //電競?
        S_44: "13-1", // MUAYTHAI: 44, //泰拳
        S_45: "4-3", // BEACHVOLLEYBALL: 45, //沙滩排球
        S_50: "2-7", // CRICKET: 50, //板球
        // FINANCE: 55, //商業 (找不到)
        S_56: "17-1", //56 樂透(列表上沒有，額外追加)
        // OTHERS: 99, //其他
    },
};

//預先require上面配置的圖片
const sporticons = {
    "img_6-7": {
        img: ImagesUrl.sporticon6_7,
        simg: ImagesUrl.sporticon6_7s,
    },
    "img_1-1": {
        img: ImagesUrl.sporticon1_1,
        simg: ImagesUrl.sporticon1_1s,
    },
    "img_1-2": {
        img: ImagesUrl.sporticon1_2,
        simg: ImagesUrl.sporticon1_2s,
    },
    "img_1-3": {
        img: ImagesUrl.sporticon1_3,
        simg: ImagesUrl.sporticon1_3s,
    },
    "img_4-6": {
        img: ImagesUrl.sporticon4_6,
        simg: ImagesUrl.sporticon4_6s,
    },
    "img_2-3": {
        img: ImagesUrl.sporticon2_3,
        simg: ImagesUrl.sporticon2_3s,
    },
    "img_2-1": {
        img: ImagesUrl.sporticon2_1,
        simg: ImagesUrl.sporticon2_1s,
    },
    "img_2-5": {
        img: ImagesUrl.sporticon2_5,
        simg: ImagesUrl.sporticon2_5s,
    },
    "img_3-6": {
        img: ImagesUrl.sporticon3_6,
        simg: ImagesUrl.sporticon3_6s,
    },
    "img_1-7": {
        img: ImagesUrl.sporticon1_7,
        simg: ImagesUrl.sporticon1_7s,
    },
    "img_1-6": {
        img: ImagesUrl.sporticon1_6,
        simg: ImagesUrl.sporticon1_6s,
    },
    "img_7-7": {
        img: ImagesUrl.sporticon7_7,
        simg: ImagesUrl.sporticon7_7s,
    },
    "img_3-1": {
        img: ImagesUrl.sporticon3_1,
        simg: ImagesUrl.sporticon3_1s,
    },
    "img_1-4": {
        img: ImagesUrl.sporticon1_4,
        simg: ImagesUrl.sporticon1_4s,
    },
    "img_2-6": {
        img: ImagesUrl.sporticon2_6,
        simg: ImagesUrl.sporticon2_6s,
    },
    "img_6-4": {
        img: ImagesUrl.sporticon6_4,
        simg: ImagesUrl.sporticon6_4s,
    },
    "img_2-4": {
        img: ImagesUrl.sporticon2_4,
        simg: ImagesUrl.sporticon2_4s,
    },
    "img_4-5": {
        img: ImagesUrl.sporticon4_5,
        simg: ImagesUrl.sporticon4_5s,
    },
    "img_7-1": {
        img: ImagesUrl.sporticon7_1,
        simg: ImagesUrl.sporticon7_1s,
    },
    "img_2-2": {
        img: ImagesUrl.sporticon2_2,
        simg: ImagesUrl.sporticon2_2s,
    },
    "img_3-7": {
        img: ImagesUrl.sporticon3_7,
        simg: ImagesUrl.sporticon3_7s,
    },
    "img_7-3": {
        img: ImagesUrl.sporticon7_3,
        simg: ImagesUrl.sporticon7_3s,
    },
    "img_12-3": {
        img: ImagesUrl.sporticon12_3,
        simg: ImagesUrl.sporticon12_3s,
    },
    "img_17-4": {
        img: ImagesUrl.sporticon17_4,
        simg: ImagesUrl.sporticon17_4s,
    },
    "img_12-5": {
        img: ImagesUrl.sporticon12_5,
        simg: ImagesUrl.sporticon12_5s,
    },
    "img_7-6": {
        img: ImagesUrl.sporticon7_6,
        simg: ImagesUrl.sporticon7_6s,
    },
    "img_4-2": {
        img: ImagesUrl.sporticon4_2,
        simg: ImagesUrl.sporticon4_2s,
    },
    "img_8-4": {
        img: ImagesUrl.sporticon8_4,
        simg: ImagesUrl.sporticon8_4s,
    },
    "img_8-5": {
        img: ImagesUrl.sporticon8_5,
        simg: ImagesUrl.sporticon8_5s,
    },
    "img_8-6": {
        img: ImagesUrl.sporticon8_6,
        simg: ImagesUrl.sporticon8_6s,
    },
    "img_4-3": {
        img: ImagesUrl.sporticon4_3,
        simg: ImagesUrl.sporticon4_3s,
    },
    "img_8-7": {
        img: ImagesUrl.sporticon8_7,
        simg: ImagesUrl.sporticon8_7s,
    },
    "img_9-1": {
        img: ImagesUrl.sporticon9_1,
        simg: ImagesUrl.sporticon9_1s,
    },
    "img_9-3": {
        img: ImagesUrl.sporticon9_3,
        simg: ImagesUrl.sporticon9_3s,
    },
    "img_9-4": {
        img: ImagesUrl.sporticon9_4,
        simg: ImagesUrl.sporticon9_4s,
    },
    "img_9-6": {
        img: ImagesUrl.sporticon9_6,
        simg: ImagesUrl.sporticon9_6s,
    },
    "img_10-1": {
        img: ImagesUrl.sporticon10_1,
        simg: ImagesUrl.sporticon10_1s,
    },
    "img_2-7": {
        img: ImagesUrl.sporticon2_7,
        simg: ImagesUrl.sporticon2_7s,
    },
    "img_11-1": {
        img: ImagesUrl.sporticon11_1,
        simg: ImagesUrl.sporticon11_1s,
    },
    "img_5-6": {
        img: ImagesUrl.sporticon5_6,
        simg: ImagesUrl.sporticon5_6s,
    },
    "img_9-7": {
        img: ImagesUrl.sporticon9_7,
        simg: ImagesUrl.sporticon9_7s,
    },
    "img_11-2": {
        img: ImagesUrl.sporticon11_2,
        simg: ImagesUrl.sporticon11_2s,
    },
    "img_3-5": {
        img: ImagesUrl.sporticon3_5,
        simg: ImagesUrl.sporticon3_5s,
    },
    "img_12-1": {
        img: ImagesUrl.sporticon12_1,
        simg: ImagesUrl.sporticon12_1s,
    },
    "img_15-1": {
        img: ImagesUrl.sporticon15_1,
        simg: ImagesUrl.sporticon15_1s,
    },
    "img_10-5": {
        img: ImagesUrl.sporticon10_5,
        simg: ImagesUrl.sporticon10_5s,
    },
    "img_4-7": {
        img: ImagesUrl.sporticon4_7,
        simg: ImagesUrl.sporticon4_7s,
    },
    "img_5-1": {
        img: ImagesUrl.sporticon5_1,
        simg: ImagesUrl.sporticon5_1s,
    },
    "img_5-2": {
        img: ImagesUrl.sporticon5_2,
        simg: ImagesUrl.sporticon5_2s,
    },
    "img_5-3": {
        img: ImagesUrl.sporticon5_3,
        simg: ImagesUrl.sporticon5_3s,
    },
    "img_5-4": {
        img: ImagesUrl.sporticon5_4,
        simg: ImagesUrl.sporticon5_4s,
    },
    "img_7-4": {
        img: ImagesUrl.sporticon7_4,
        simg: ImagesUrl.sporticon7_4s,
    },
    "img_5-7": {
        img: ImagesUrl.sporticon5_7,
        simg: ImagesUrl.sporticon5_7s,
    },
    "img_6-1": {
        img: ImagesUrl.sporticon6_1,
        simg: ImagesUrl.sporticon6_1s,
    },
    "img_6-2": {
        img: ImagesUrl.sporticon6_2,
        simg: ImagesUrl.sporticon6_2s,
    },
    "img_6-3": {
        img: ImagesUrl.sporticon6_3,
        simg: ImagesUrl.sporticon6_3s,
    },
    "img_6-5": {
        img: ImagesUrl.sporticon6_5,
        simg: ImagesUrl.sporticon6_5s,
    },
    "img_6-6": {
        img: ImagesUrl.sporticon6_6,
        simg: ImagesUrl.sporticon6_6s,
    },
    "img_5-5": {
        img: ImagesUrl.sporticon5_5,
        simg: ImagesUrl.sporticon5_5s,
    },
    "img_10-3": {
        img: ImagesUrl.sporticon10_3,
        simg: ImagesUrl.sporticon10_3s,
    },
    "img_13-1": {
        img: ImagesUrl.sporticon13_1,
        simg: ImagesUrl.sporticon13_1s,
    },
    "img_17-1": {
        img: ImagesUrl.sporticon17_1,
        simg: ImagesUrl.sporticon17_1s,
    },
    "img_14-6": {
        img: ImagesUrl.sporticon14_6,
        simg: ImagesUrl.sporticon14_6s,
    },
    "img_14-7": {
        img: ImagesUrl.sporticon14_7,
        simg: ImagesUrl.sporticon14_7s,
    },
    "img_15-3": {
        img: ImagesUrl.sporticon15_3,
        simg: ImagesUrl.sporticon15_3s,
    },
    "img_15-2": {
        img: ImagesUrl.sporticon15_2,
        simg: ImagesUrl.sporticon15_2s,
    },
};

const getSportIcon = (vendorName, sportId, isSelected) => {
    //獲取圖片
    let targetIcon = null;
    const vendorMap = sporticonMap[vendorName];
    if (vendorMap) {
        let imgName = vendorMap["S_" + sportId];
        if (imgName) {
            targetIcon = sporticons["img_" + imgName];
        }
    }

    if (!targetIcon) {
        targetIcon = sporticons["img_" + sporticonMap.NOTFOUND];
    }

    if (isSelected) {
        return targetIcon.simg;
    } else {
        return targetIcon.img;
    }
};

export default getSportIcon;
