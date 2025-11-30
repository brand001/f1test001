

export const ApiPortSB = {
    Register: "/api/Member/MemberRestricted?", //注册   POST
    GETALLBalance: "/api/Balance/v2.0?",
    ForgetPwd: "/api/Member/Email/ForgetPasswordByEmail?",
    ForgetUsername: "/api/Member/ForgetUsernameByEmail?",
    Logout: "/api/member/Logout?",
    LogoutP4: "/Services/Login.ashx?action=logout",
    getMainsiteDomain: "/api/App/URLs?",
    Domaincheck: "/api/App/AffiliateLM?domain=",
    PhoneOTP: "/api/Member/Phone/Verify?",
    VerifyPhoneOTP: "/api/Member/Phone/TAC?",
    EmailOTP: "/api/Member/Email/Verify?",
    VerifyEmailOTP: "/api/Member/Email/VerifyTac?",
    ResetPassword: "/api/Member/ForgetPassword?",
    ChangePassword: "/api/Member/Password?oldPasswordRequired=false&",
    GETPaymentlistAPI: "/api/Payment/Methods?transactionType=Deposit&",
    GETDepositDetailsAPI: "/api/Payment/Methods/Details?transactionType=deposit&",
    POSTApplications: "/api/Payment/Applications?",
    POSTPaymentConfirmStep: "/api/Payment/Applications/",
    POSTMemberCancelDeposit: "/api/Payment/Applications/MemberCancelDeposit?", //取消交易
    GETWallets: "/api/Transfer/Wallets?",
    POSTTransfer: "/api/Transfer/Application?",
    GetProvidersMaintenanceStatus: "/api/Games/Providers/MaintenanceStatus?",
    GetAnnouncements: "/api/Announcement/Announcements?",
    GetAnnouncementDetail: "/api/Announcement/AnnouncementIndividualDetail",
    GetMessages: "/api/PersonalMessage/InboxMessages",
    GetMessageDetail: "/api/PersonalMessage/InboxMessageIndividualDetail",
    UnreadMessage: "/api/PersonalMessage/UnreadCounts?",
    GetTLCPoint: "/api/Member/MemberRewardDetail?",
    GETMemberlistAPI: "/api/Member?",
    PATCHMemberlistAPI: "/api/Member?",
    PUTMemberlistAPI: "/api/Member?",
    GetQuestions: "/api/Member/SecretQuestions?",
    GETMemberBanksfirst: "/api/Payment/MemberBanks?",
    GETCanWithdrawalPay: "/api/Payment/Methods?transactionType=Withdrawal&",
    GetCryptocurrencyInfo: "/api/Payment/Methods/GetCryptocurrencyInfo?", // 极速虚拟币支付提交
    GetProcessingDepositbyMethod: "/api/Payment/Transactions/GetProcessingDepositbyMethod?", // new 极速虚拟币支付提交
    SuggestedAmount: "/api/Payment/SuggestedAmount?", // 推荐金额
    ProcessInvoiceAutCryptoDeposit: "/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit", //虛擬幣2成功充值
    GetMemberNotificationSetting: "/api/Vendor/GetMemberNotificationSetting?code=SBS&",
    EditMemberNotificationSetting: "/api/Vendor/UpdateMemberNotificationSetting?code=SBS&",
    GetIMToken: "/api/Vendor/GameToken?code=IPSB&",
    GETSBTToken: "/api/Vendor/GameToken?code=SBT&", //BTI舊版
    GetSABAToken: "/api/Vendor/GameToken?code=OWS&",

    ALBStatus: "/api/Payment/UpdateIsQRLocalAliPay?",
    NotifyBettingInfo: "/api/Vendor/NotifyBettingInfo?",

    MiniGamesBanners: "/api/MiniGames/Banners?",

    Bonus: "/api/Bonus", // 存款主賬優惠

    /* 优惠 */
    GetPromotions: "/api/CMS/Promotions?",
    /* 申请优惠 */
    ApplicationsBonus: "/api/CMS/Promotions/Applications?",
    /* 每日好礼 */
    DailyDealsPromotion: "/api/CMS/DailyDealsPromotion?",
    /* 获得城镇地址 */
    AddressTown: "/api/DailyDeals/Town?",
    /* 获得市区地址 */
    AddressDistrict: "/api/DailyDeals/District?",
    /* 获得省份地址 */
    AddressProvince: "/api/DailyDeals/Province?",
    /* 地址相关 */
    ShippingAddress: "/api/DailyDeals/ShippingAddress?",
    /* 删除地址 */
    DeleteShippingAddress: "/api/DailyDeals/ShippingAddress",
    /* 申请每日好礼 */
    ApplyDailyDeals: "/api/CMS/ApplyDailyDeals?",
    /* 好礼记录 */
    DailyDealsHistory: "/api/CMS/DailyDealsHistory?",

    getEuroGroupList: "/api/v2.0/brands/FUN88/groups", // 球隊排名
    getEuroTeamStat: "/api/v2.0/brands/FUN88/teams/stats", // 獲取各隊數據
    getEuroTeamMatches: "/sports-data-gateway/api/v2.0/brands/FUN88/matches",
    getEuroPlayer: "/api/v2.0/brands/FUN88/players/stats/", // 獲取球員數據,
    UpdateMessage: "/api/PersonalMessage/ActionOnInboxMessage?",
    UpdateAnnouncement: "/api/Announcement/ActionOnAnnouncement?",
};
