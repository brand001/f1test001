import Home from "./ImagesModule/Home";
import Profile from "./ImagesModule/Profile";
import recommendImages from "./ImagesModule/Recommend";
import SelfExclusion from "./ImagesModule/SelfExclusion";
import Sponsor from "./ImagesModule/Sponsor";
import Upload from "./ImagesModule/Upload";
import vipImages from "./ImagesModule/VIP";
import AboutUSDT from "./ImagesModule/AboutUSDT";
import Promotion from "./ImagesModule/PromotionImages";

// 合併所有圖片模塊
const allImageModules = [vipImages, recommendImages, Sponsor, SelfExclusion, Upload, Profile, Home, AboutUSDT, Promotion];

const ImageMap = new Proxy(
    {},
    {
        get(target, prop) {
            // 遍歷所有模塊尋找對應的圖片
            for (const module of allImageModules) {
                const langModule = module[window.LANGUAGE] || module["CN"];
                if (langModule && prop in langModule) {
                    return langModule[prop];
                }
            }
            return {};
        },
    },
);

export default ImageMap;
