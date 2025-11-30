const { versionCode } = require("./Api.json");
import { Toasts } from "$Toasts";
window.LANGUAGE = "CN";


window.common_url = "";
window.userNameDB = ""; //
window.memberCode = ""; //用戶memberCode
window.Rb88Version = versionCode; //版本號
window.SBTDomain = "";
window.bffsc_url = "";
window.Strapi_Domain = "";
window.appLogging_url = "";
window.affCodeKex = ""; //代理號
window.rafCodeKex = ""; //推薦好友碼
window.E2Backbox = "No dataBase"; // 黑盒子
window.IovationVal = "No dataBase"; // 黑盒子
window.DeviceInfoIos = true; //ios手机型号是没有指纹的
window.Devicetoken = "";
window.userMAC = "";
window.IM_Token = "";
window.IM_MemberCode = "";
window.VendorData = ""; //当前的Vendor，
window.lowerV = "IM"; //当前游戏
window.notificationInfo = ""; //游戏推送
window.notificationRecommend = ""; //消息推送
window.GameListNum = 0; //游戏个数
window.isMobileOpen = false; //是否mobile跳转过来，带token
window.LoginTouchNum = 0; //指纹脸部错误次数，3次不能使用
window.LoginPatternNum = 0; //九宫格错误次数，3次不能使用
window.FastLoginErr = 0; //是否快速登陆
window.lockLogin = 0; //登陆错误锁定账号次数
window.passHome = false; // 判斷是否到過home
window.deviceModel = "";
window.deviceBrand = "";
window.osVersion = "";
window.isBlue = true;
window.SBRecommendCheckDone = false;
window.isDynamicIslandIOS = false;

export const SentryVersion = window.Rb88Version;

window.ApiPort = {};

export const SetApiPort = (res = {}) => {
    const { cmsCulture, cmsLanguage } = res;
    const apis = {
        Token: null, // 用戶token
        ReToken: null, // 用戶REtoken
        "ReTokenApi": "/api/Auth/RefreshToken?",
        X_Biff_key: "I8lVSVRQNUSGY8Tg1WoEzQ==",
        UserLogin: false, //用戶登錄狀態
        login: "/api/Auth/Login?", //獲取登入地址  POST
        MemberRegister: "/api/Member/Register?", //註冊
        CallBack: "/api/Member/VIP/CallBack?", // vip cs call
        logout: "/api/Auth/Logout?", //登出    POST
        TagMemberSubscription: "/api/Notification/TagMemberSubscription?", //PATCH 第一次開app 註冊友盟個推
        BindNotificationDevice: "/api/Notification/BindNotificationDevice?",
        LiveChat: "/api/LiveChat/Url?", //克服
        ForgetPasswordByEmail: "/api/Auth/ForgetPassword/Email?", //忘记密码
        ForgetUsernameByEmail: "/api/Auth/ForgetUsername/Email?", //忘记账户
        PhoneVerify: "/api/Verification/Phone?", //获取手机验证码
        PhoneTAC: "/api/Verification/Phone?", //验证手机

        VoiceVerify: "/api/Verification/Voice?", //获取手机语音
        VoiceTAC: "/api/Verification/Voice?", //验证手机语音

        //SuperDoor API
        GetMemberSuperdoorShownStatus: "/api/Auth/MemberSuperdoorShownStatus?",
        UpdateMemberSuperdoorShownStatus: "/api/Member/UpdateMemberSuperdoorShownStatus?",

        GetAmityToken: "/api/Auth/GetAmityToken?",
        EmailVerify: "/api/Verification/Email?", //获取邮箱验证码
        EmailTAC: "/api/Verification/Email?", //验证手机验证码
        ResendAttempt: "/api/Verification/ResendAttempts", //获取手机验证码到期时间
        VerificationAttempt: "/api/Verification/OTPAttempts", //邮箱电话获取剩余验证次数
        Balance: "/api/Balance/v2.0?", //获取金额
        MemberDailyTurnoverByProductTypeV2: "/api/Member/DailyTurnover/v2.0", //新投注記錄
        MemberTurnoverHistory: "/api/BI/MemberTurnoverHistory?", //  //新投注記錄 20210319
        MemberDailyTurnoverDetail: "/api/BI/MemberDailyTurnoverItem", //  //新投注記錄详情
        SettingProductGroupMapping: "/api/Setting/ProductGroupMapping?",
        UnreadMessage: "/api/PersonalMessage/UnreadCounts?", //获取未读消息
        ProductCategories: "/api/BI/ProductCategories?", //反水，投注记录筛选
        GetAnnouncements: "/api/Announcement/Announcements?",
        GetAnnouncementDetail: "/api/Announcement/AnnouncementIndividualDetail",
        GetMessages: "/api/PersonalMessage/InboxMessages",
        GetMessageDetail: "/api/PersonalMessage/InboxMessageIndividualDetail",
        UpdateMessage: "/api/PersonalMessage/ActionOnInboxMessage?",
        UpdateAnnouncement: "/api/Announcement/ActionOnAnnouncement?",
        GetMemberNotificationSetting: "/api/Vendor/NotificationSetting/SBS?",
        EditMemberNotificationSetting: "/api/Vendor/NotificationSetting/SBS?",
        Wallets: "/api/Transfer/Wallets?", //獲取目標帳戶
        Member: "/api/Member?", // 會員數據 Get
        Transfer: "/api/Transfer/Application?", //轉帳
        POST_Transfer: "/api/Transfer/Applications?",
        PaymentApplications: "/api/Payment/Application?", //付款
        GET_PaymentApplications: "/api/Application/Histories?", //付款
        GetSubWithdrawalTransactionDetails: "/api/Payment/Applications", // 獲取提款LB 交易明細 狀態
        GetCryptocurrencyInfo: "/api/Payment/Cryptocurrency/Details", //极速虚拟币支付
        GetProcessingDepositbyMethod: "/api/Payment/Transaction/ProcessingDepositbyMethod?", // new 极速虚拟币支付提交
        ProcessInvoiceAutCryptoDeposit: "/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit", //虛擬幣2成功充值
        POSTMemberCancelDeposit: "/api/Payment/Application/MemberCancelDeposit?", //取消交易
        Payment: "/api/Payment/Methods", //存款
        SuggestedAmount: "/api/Payment/SuggestedAmounts?", // 充值檢測SuggestedAmount
        PaymentDetails: "/api/Payment/Method/Details", //充值細節
        BonusCalculate: "/api/Bonus/RefreshBonusPreview?", //存款轉帳優惠 檢測
        ConfirmStep: "/api/Payment/Application/ConfirmStep?", //本銀 在線支付 完成請求
        GetIMToken: "/api/Vendor/IPSB/Token?",
        PostSosBonusVerifications: "/api/Bonus/Verification/SOS",
        PostSosBonusApplications: "/api/Bonus/Application/SOS",
        BonusApplications: "/api/Bonus/v2.0/Applications?",
        GETSBTToken: "/api/Vendor/SBT/Token?", //BTI舊版
        GETBTIToken: "/api/Vendor/BTI/Token?", //BTI新版
        GETBalanceSB: "/api/Balance?wallet=SB&",
        BankCardVerification: "/api/Verification/Payment/BankCard?", //提交身份证银行卡姓名
        GetSelfExclusionRestriction: "/api/Member/GetSelfExclusionRestriction?",
        GetMemberBanks: "/api/Payment/MemberBanks?", //用戶銀行卡
        DELETEMemberBanksDefault: "/api/Payment/MemberBank",
        POST_MemberBanks: "/api/Payment/MemberBank?", //用戶銀行卡
        PATCHMemberBanksDefault: "/api/Payment/MemberBanks/",
        ClosestPrefixAmount: "/api/Payment/ClosestPrefixAmount?", //SR 快速提款建議金額
        GETMaintenanceInfo: "/api/Payment/Banks/MaintenanceInfo?",

        GetProvidersMaintenanceStatus: "/api/Games/Providers/MaintenanceStatus?",
        Password: "/api/Auth/ChangePassword?oldPasswordRequired=false&",
        ChangePassword: "/api/Auth/ChangePassword?oldPasswordRequired=true&",
        NotifyBettingInfo: "/api/Vendor/NotifyBettingInfo/SBS?",
        CancelPaybnbDeposit: "/api/Payment/Applications/Transactions/CancelPaybnbDeposit?",
        Games: "/api/Games/Launch?",
        GETIsMemberWhiteListed: "/api/Games/IsMemberWhiteListed?",



        GameMaintenanceStatus: "/api/Games/NavigationBarStatus?",
        AccountHolderName: "/api/Verification/AccountHolderName?", //提款SNC0001 call，再去上传身份证
        WalletProviderMapping: "/api/Transfer/WalletProviderMapping?", //游戏对应的钱包
        PostWelcomeCall: "/api/Member/WelcomeCall?", // 用户首次注册，出现的弹窗

        ConfiscatedMemberVerification: "/api/Member/ConfiscatedMemberVerification?",
        ConfiscatedMemberVerifyAttempts: "/api/Member/ConfiscatedMemberVerifyAttempts?",
        ConfiscatedAccountInfoValidation: "/api/Member/ConfiscatedAccountInfoValidation?",

        // 欧洲杯
        getEuroTeamStat: "/api/v1.0/brands/FUN88/teams/stats?", // 球队数据
        getEuroGroupList: "/api/v1.0/brands/FUN88/groups?", // 球队排名
        getEuroPlayer: "/api/v1.0/brands/FUN88/players/stats/", // 球员数据

        /* 优惠 */
        GetPromotions: "/api/CMS/Promotions?",
        /* 申请优惠 */
        ApplicationsBonus: "/api/Promotion/ManualPromo?",
        /* 领取红利 */
        ClaimBonus: "/api/Bonus/Claim?",
        /* 取消优惠 */
        CancelPromotion: "/api/Bonus/Cancellation",
        /* 每日好礼 */
        DailyDealsPromotion: "/api/Promotion?type=DailyDeals&",

        /* 获得城镇地址 */
        AddressTown: "/api/Setting/MasterData/ShippingAddress?type=Town&",
        /* 获得市区地址 */
        AddressDistrict: "/api/Setting/MasterData/ShippingAddress?type=District&",
        /* 获得省份地址 */
        AddressProvince: "/api/Setting/MasterData/ShippingAddress?type=Province&",
        /* 地址相关 */
        ShippingAddress: "/api/Member/ShippingAddress/v2.0?",
        /* 删除地址 */
        DeleteShippingAddress: "/api/Member/ShippingAddress/v2.0",
        /* 申请每日好礼 */
        ApplyDailyDeals: "/api/Promotion/Application?",
        /* 好礼记录 */
        DailyDealsHistory: "/api/CMS/DailyDealsHistory?",
        /* 取消存款 */
        MemberRequestDepositReject: "/api/Payment/Application/MemberRequestDepositReject?",

        GetProfileMasterData: "/api/Setting/MasterData/Nations?",

        BankingHistory: "/api/Payment/Application/BankingHistory?",
        CryptoExchangeRate: "/api/Payment/Cryptocurrency/ExchangeRate?", //加密貨幣匯率
        TransferApplicationsByDate: "/api/Transfer/Histories", //轉賬紀錄
        CryptoWallet: "/api/Payment/Cryptocurrency/WalletAddress", //加密貨幣錢包
        CryptoWalletSetDefault: "/api/Payment/Cryptocurrency/WalletAddress/Default?",
        SetDefault: "/api/Payment/MemberBank/SetDefault?", //預設銀行卡
        SendSmsOTP: "/api/Verification/Payment/Phone?",
        Register: "/api/Member?", //註冊   POST
        InfoValidity: "/api/Member/InfoValidity?",
        Banner: "/api/CMS/Banners?", //banner 數據 Get
        GetEmailVerifyCode: "/api/Verification/Email?",
        PostEmailVerifyTac: "/api/Verification/Email?",
        GetPhoneVerifyCode: "/api/Verification/Phone?",
        POSTNoCancellation: "/api/Payment/Application/Cancellation?", //提款記錄取消
        GetResubmitOnlineDepositDetails: "/api/Payment/Transaction/ResubmitDepositDetails?",
        PostPhoneVerifyCode: "/api/Verification/Phone?",
        CreateResubmitOnlineDeposit: "/api/Payment/Transaction/CreateResubmitOnlineDeposit?",
        GetTransactionHistory: "/api/Payment/Transaction/History?",
        UploadAttachment: "/api/Payment/Application/UploadAttachment?",
        GetSecretQuestions: "/api/Setting/MasterData/SecurityQuestions?",
        GetDepositStepTwoInProgressDetails: "/api/Payment/Transaction/GetDepositStepTwoInProgressDetails?", // 獲取充值二階段狀態 and data

        PhonePrefix: "/api/Setting/Phone/Prefix?",

        worldCupTeams: "/api/Member/FootballTournamentTeam?",

        // one wallet
        BonusProgress: "/api/Bonus/Progress?",
        WalletGroup: "/api/Balance/WalletGroup?", //获取钱包分类
        BonusApplicationsByDate: "/api/Bonus/ApplicationsByDate?", //按照日期获取红利
        CampaignAssignedClaims: "/api/Campaign/AssignedClaims?", //獲取待開始之紅利優惠
        CampaignApplications: "/api/Campaign/Applications?", //申請优惠
        CancellationEligibility: "/api/Bonus/CancellationEligibility?", //获取红利取消资格
        Cancellation: "/api/Bonus/Cancellation?", //取消红利
        BonusClaim: "/api/Bonus/Claim?", //领取优惠
        CampaignEnrollments: "/api/Campaign/Enrollments?",
        GetMemberServingSignupBonusStatus: "/api/Bonus/GetMemberServingSignupBonusStatus?",
        BonusApplications1: "/api/Bonus/Applications?",
        BonusEligible: "/api/Bonus/Applications/Eligible?",
        BonusApplicationsV2: "/api/Bonus/v2.0/Applications?",
        CalculateV2: "/api/Bonus/v2.0/Calculate?",
        BonusV2: "/api/Bonus/v2.0?",
        BFFSCBonusCalculate: "/api/Bonus/RefreshBonusPreview?",

        // strapi整合API
        CMS_PromotionList: `/${cmsCulture}/api/v1/app/promotions?`,
        CMSRebateHistory: `/cms/promotions-${cmsLanguage}/rebateids/`,
        CMSAppliedHistory: `/cms/promotions-${cmsLanguage}/`,
        BonusList: "/api/Bonus/v2.0?", // cmsApi 前端整合邏輯使用
        Bonus: "/api/Bonus/v2.0", // 存款主賬優惠
        AppliedHistory: "/api/Bonus/AppliedHistory?",
        DailyDealsHistories: "/api/Promotion/Histories?type=DailyDeals&",
        FreebetBonusGroups: "/api/Promotion/Freebet/BonusGroups?",
        RebateRunningDetails: "/api/Promotion?type=Rebate&subtype=RunningDetails&",
        RebateHistories: "/api/Promotion/Histories?type=Rebate&",
        MemberPromoHistories: "/api/Promotion/Histories?type=ManualPromo&",
        GETcsjackpotStatus: `/cms/mainsite-config-${cmsLanguage}`,
        centralPaymentActive: `/cms/central-payment-is-active/f1/${cmsLanguage}/`,
        GETCampaignList: "/api/Campaign/List?",

        // Strapi CGMS
        CMS_Sequence: `/${cmsCulture}/Games/Providers/Sequence`,
        CMS_ProductLobby: `/${cmsCulture}/api/v1/app/webbanners/position/product_lobby`,
        CMS_GameProvidersDetails: `/${cmsCulture}/Games/Providers/Details?`,
        CMS_GameCategories: `/${cmsCulture}/Games/Categories/Details?`,
        CMS_GetGame: `/${cmsCulture}/Games?`,
        CMS_GameProviders: `/${cmsCulture}/api/v1/app/game/provider`,
        CMS_Game: `/${cmsCulture}/api/v1/`, //获取游戏列表api，需要加ios和android字段
        CMS_Sponsorship: `/${cmsCulture}/api/v1/app/webbanners/position/sponsorship`,
        CMS_BannerCategory: `/${cmsCulture}/api/v1/app/webbanners/position`,
        CMS_PromotionCategory: `/${cmsCulture}/api/v1/promotion/categories`,
        CMS_Promotion: `/${cmsCulture}/api/v1/app/promotion`,

        CMS_LoginRegisterBanner: `/${cmsCulture}/api/v1/app/webbanners/position/`,
        CMS_LoginRegisterFooter: `/cms/footer-${cmsLanguage}/mobile`,
        CMS_Banner: `/${cmsCulture}/api/v1/app/webbanners/position/home_main`,
        CMS_BannerFeature: `/${cmsCulture}/api/v1/app/webbanners/position/home_feature`,
        CMS_BannerProfile: `/${cmsCulture}/api/v1/app/webbanners/position/profile_feature`,
        CMS_BannerDeposit: `/${cmsCulture}/api/v1/app/webbanners/position/deposit`,
        CMS_BannerWithdraw: `/${cmsCulture}/api/v1/app/webbanners/position/withdraw`,
        CMS_BannerWorldCupMain: `/${cmsCulture}/api/v1/app/webbanners/position/euro_main`,
        CMS_BannerWorldCupGame: `/${cmsCulture}/api/v1/app/webbanners/position/euro_game`,
        CMS_BannerWorldCupFooter: `/${cmsCulture}/api/v1/app/webbanners/position/euro_footer`,
        worldCupNews: `/${cmsCulture}/api/v1/news`,
        CMS_ReferBanner: `/${cmsCulture}/api/v1/app/webbanners/position/referfriend`,

        feedbackForm: "/api/LiveChat/USDT/Feedback", // 問題反饋

        SelfExclusions: "/api/Member/SelfExclusion?", //自我限制
        Generate: "/api/Auth/GeneratePasscode?", //获取安全码

        //推薦好友
        QueleaActiveCampaign: "/api/Quelea/ActiveCampaign?", //获取彩金信息
        QueleaReferrerInfo: "/api/Quelea/ReferrerInfo?",
        ReferrerEligible: "/api/Quelea/ReferrerEligible?",
        ReferrerSignUp: "/api/Quelea/ReferrerSignUp?",
        ReferrerActivity: "/api/Quelea/ReferrerActivity?",
        ReferrerRewardStatus: "/api/Quelea/ReferrerRewardStatus?",

        MemberDocuments: "/api/Verification/MemberDocuments?",
        PostVerification: "/api/Verification/MemberDocument/Upload?",
        WithdrawalNotification: "/api/Verification/WithdrawalNotification?",
        MemberKYCToggle: "/api/Verification/MemberKYCToggle?",
        MemberKycVerification: "/api/Verification/MemberKycVerification?",
        SumsubToken: "/api/Verification/Sumsub/Token?",
        SumsubVerifyFaceAuth: "/api/Verification/Sumsub/VerifyFaceAuth?",

        CustomFlag: "/api/Member/CustomFlag?", //判断是否需要验证手机和银行卡信息，是否可以修改号码
        TeamPreferences: "/api/Member/TeamPreferencesWC22?", //判断是否需要验证手机和银行卡信息，是否可以修改号码
        ConfirmWithdrawalComplete: "/api/Payment/Applications/ConfirmWithdrawalComplete?",

        MemberWithdrawalThreshold: "/api/Payment/Transaction/MemberWithdrawalThreshold?", // 獲取提款卡額度 detail
        GetWithdrawalThresholdLimit: "/api/Payment/Transaction/WithdrawalThresholdLimit?", // 更新提款卡限額信息
        GetWithdrawalThresholdHistory: "/api/Payment/Transaction/WithdrawalThresholdHistories?", // 更新提款卡限額信息

        // Mini game
        MiniGames: "/api/MiniGames?",
        MiniGamesBanners: "/api/MiniGames/Banners?",
        SnatchPrize: "/api/Event/MiniGames/SnatchPrize?",
        PrizeHistory: "/api/Event/MiniGames/PrizeHistory?",
        MiniGamesActiveGame: "/api/Event/MiniGames/ActiveGame?",
        MemberProgress: "/api/Event/MiniGames/MemberProgress?",
        AnnouncementPopup: "/api/Announcement/Popup?", //判断是否需要验证手机和银行卡信息，是否可以修改号码

        // Quelea
        GetQueleaActiveCampaign: "/api/Quelea/GetQueleaActiveCampaign?",
        GetQueleaReferrerInfo: "/api/Quelea/GetQueleaReferrerInfo?",
        GetQueleaReferrerEligible: "/api/Quelea/ReferrerEligible?",
        PostQueleaReferrerSignUp: "/api/Quelea/ReferrerSignUp?",
        GetQueleaReferreeTaskStatus: "/api/Quelea/RefereeTaskStatus?",
        GetQueleaReferrerActivity: "/api/Quelea/ReferrerActivity?",
        GetQueleaReferreeList: "/api/Quelea/RefereeList?",
        PostThroughoutVerification: "/api/Quelea/ThroughoutVerification?",

        ManualPromo: "/api/Promotion/Application?",
        CheckMaxApplicant: "/api/Promotion/ApplicationInfo/ManualPromo?info=CheckMaxApplicant&",

        LOGIN_SB: "login",
        sbDataVersion: "/cms/sb-data-api/",
        downloadApp: "/cms/download-app-m1",

        getMainsiteDomain: "/api/App/URLs?", //获取代理推广页面

        // Captcha verification
        CaptchaInfo: "/api/Verification/Captcha/Info?",
        CaptchaChallengeId: "/api/Verification/Captcha/ChallengeId?",

        GetTeamsWC22: "/api/Member/FootballTournamentTeam?",
        GetCustomFlag: "/api/Member/CustomFlag?",
        PostTeamPreferencesWC22: "/api/Member/TeamPreferencesWC22?",



        "GetCspDetail": "/api/CustomerService/Knowledge/", // 1111
        // Strapi BBU / Bullstreet banners & Links
        "ExternalPromotions": "/cms/f1m1-external-promotion/",
        "ExternalPromotionLink": "/cms/f1m1-external-promolink/",
        "ExternalPromotionLinkApi": "/api/Promotion/ExternalPromotionLink",
    };

    window.ApiPort = apis;
};

export default {
    SetApiPort,
    SentryVersion,
};
