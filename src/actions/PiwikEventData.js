/*
 * @Author: your action
 * @Date: 2023-08-09 16:44:11
 * @LastEditors: your name
 * @LastEditTime: 2023-08-11 16:25:01
 * @Description:
 * @Filepath: /F1-M1-APP-ST/src/actions/PiwikEventData.js
 */

import PiwikProSdk from "@piwikpro/react-native-piwik-pro-sdk";
import { Platform } from "react-native";

export const HomeGameSubProviders = {
    HomeGameSB2: {
        category: "Sports",
        action: "Launch FunSport",
        name: "Sports_C_SaBa",
        path: "sports",
        title: "Home (Sports Listing)",
    },
    HomeGameOWS: {
        category: "Sports",
        action: "Launch Saba",
        name: "Sports_C_SaBa",
        path: "sports",
        title: "Home (Sports Listing)",
    },
    HomeGameIPSB: {
        category: "Sports",
        action: "Launch IM",
        name: "Sports_C_IM",
        title: "Home (Sports Listing)",
        path: "sports",
    },
    HomeGameCML: {
        category: "Sports",
        action: "Launch CMD",
        name: "Sports_C_Cmd",
        title: "Home (Sports Listing)",
        path: "sports",
    },
    HomeGameSBT: {
        category: "Sports",
        action: "Launch BTi",
        name: "Sports_C_BTi",
        title: "Home (Sports Listing)",
        path: "sports",
    },
    HomeGameVTG: {
        category: "Sports",
        action: "Launch V2",
        name: "Sports_C_V2",
        title: "Home (Sports Listing)",
        path: "sports",
    },
    HomeGameSPORTSBOOK: {
        category: "Sports",
        action: "Go to Sports Listing",
        name: "Sports_C_Listing",
        title: "Home (Sports Listing)",
        path: "sports",
    },

    HomeGameTFG: {
        category: "Esports",
        action: "Launch TF",
        name: "Esports_C_TF",
        title: "Home (Esports Listing)",
        path: "esports",
    },
    HomeGameIPES: {
        category: "Esports",
        action: "Launch Fun88 Esports",
        name: "Esports_C_Fun88",
        title: "Home (Esports Listing)",
        path: "esports",
    },
    HomeGameESPORTS: {
        category: "Esports",
        action: "Go to Esports Listings",
        name: "Esports_C_Listing",
        title: "Home (Esports Listing)",
        path: "esports",
    },

    HomeGameSPR: {
        category: "InstantGames",
        action: "Go to InstantGames Lobby",
        name: "InstantGames_C_Spribe",
        title: "Home (InstantGames Listing)",
        path: "instantgames",
    },
    HomeGameGLX: {
        category: "InstantGames",
        action: "Go to GLX Lobby",
        name: "InstantGames_C_GLX",
        title: "Home",
        path: "home",
    },
    HomeGameAVIATOR: {
        category: "InstantGames",
        action: "Launch HotGame",
        name: "InstantGames_C_Hotgame_Game",
        title: "Home (InstantGames Listing)",
        path: "instantgames",
    },
    HomeGameINSTANTGAMES: {
        category: "InstantGames",
        action: "Go to InstantGames Listing",
        name: "InstantGames_C_Listing",
        title: "Home",
        path: "home",
    },

    HomeGameSXY: {
        category: "LiveDealer",
        action: "Launch S Palace",
        name: "LiveDealer_C_S_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameGPI: {
        category: "LiveDealer",
        action: "Launch Fun88 Palace",
        name: "LiveDealer_C_Fun88_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameTG_LIVECASINO: {
        category: "LiveDealer",
        action: "Launch PP Palace",
        name: "LiveDealer_C_PP_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameEVO: {
        category: "LiveDealer",
        action: "Launch EVO Palace",
        name: "LiveDealer_C_EVO_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameWMC: {
        category: "LiveDealer",
        action: "Launch WM Palace",
        name: "LiveDealer_C_WM_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameEBT: {
        category: "LiveDealer",
        action: "Launch E Palace",
        name: "LiveDealer_C_E_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameNLE: {
        category: "LiveDealer",
        action: "Launch HAPPY Palace",
        name: "LiveDealer_C_HAPPY_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameAGL: {
        category: "LiveDealer",
        action: "Launch ROYAL Palace",
        name: "LiveDealer_C_ROYAL_Palace",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameDGG: {
        category: "LiveDealer",
        action: "Go to DGG Lobby",
        name: "LiveDealer_C_DGG",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },
    HomeGameLIVECASINO: {
        category: "LiveDealer",
        action: "Go to LiveDealer Listing",
        name: "LiveDealer_C_Listing",
        title: "Home (LD Listing)",
        path: "live_dealer",
    },

    HomeGameTG: {
        category: "SlotFishing",
        action: "Launch PP",
        name: "SlotFishing_C_PP",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameJIF: {
        category: "SlotFishing",
        action: "Launch Jili Fishing",
        name: "SlotFishing_C_JiliFishing",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGamePGS: {
        category: "SlotFishing",
        action: "Launch PG",
        name: "SlotFishing_C_PG",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameMGSQF: {
        category: "SlotFishing",
        action: "Launch MGS",
        name: "SlotFishing_C_MGS",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameBSG: {
        category: "SlotFishing",
        action: "Launch SG",
        name: "SlotFishing_C_SG",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameSPG: {
        category: "SlotFishing",
        action: "Launch PNG",
        name: "SlotFishing_C_PNG",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameSWF: {
        category: "SlotFishing",
        action: "Launch SW",
        name: "SlotFishing_C_SW",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameCQG: {
        category: "SlotFishing",
        action: "Launch CQ9",
        name: "SlotFishing_C_CQ9",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameIMOPT: {
        category: "SlotFishing",
        action: "Launch PT",
        name: "SlotFishing_C_PT",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameEVOBT: {
        category: "SlotFishing",
        action: "Launch EVOBT",
        name: "SlotFishing_C_EVOBT",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameEVORT: {
        category: "SlotFishing",
        action: "Launch EVORT",
        name: "SlotFishing_C_EVORT",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameHSW: {
        category: "SlotFishing",
        action: "Launch HSW",
        name: "SlotFishing_C_HSW",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameFCG: {
        category: "SlotFishing",
        action: "Go to FCG Lobby",
        name: "SlotFishing_C_FCG",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },
    HomeGameSLOT: {
        category: "SlotFishing",
        action: "Go to SlotFishing Listing",
        name: "SlotFishing_C_Listing",
        title: "Home (Slot/Fishing Listing)",
        path: "slotfishing",
    },

    HomeGameTGP: {
        category: "P2P",
        action: "Launch Game Việt",
        name: "P2P_C_King_Marker",
        title: "Home (P2P Listing)",
        path: "p2p",
    },
    HomeGameKPK: {
        category: "P2P",
        action: "Launch King Porker",
        name: "P2P_C_King_Porker",
        title: "Home (P2P Listing)",
        path: "p2p",
    },
    HomeGameP2P: {
        category: "P2P",
        action: "Go to P2P Listing",
        name: "P2P_C_Listing",
        title: "Home (P2P Listing)",
        path: "p2p",
    },

    HomeGameTCG: {
        category: "Lottery",
        action: "Launch TC",
        name: "Lottery_C_TC",
        title: "Home (Lottery Listing)",
        path: "lottery",
    },
    HomeGameSGW: {
        category: "Lottery",
        action: "Launch SGW",
        name: "Lottery_C_SGW",
        title: "Home (Lottery Listing)",
        path: "lottery",
    },
    HomeGameGPK: {
        category: "Lottery",
        action: "Launch FUN88",
        name: "Lottery_C_FUN88",
        title: "Home (Lottery Listing)",
        path: "lottery",
    },
    HomeGameSLC: {
        category: "Lottery",
        action: "Launch SLC",
        name: "Lottery_C_SLC",
        title: "Home (Lottery Listing)",
        path: "lottery",
    },
    HomeGameKENOLOTTERY: {
        category: "Lottery",
        action: "Go to Lottery Listing",
        name: "Lottery_C_Listing",
        title: "Home (Lottery Listing)",
        path: "lottery",
    },
};

export const DepositName = {
    LB: {
        path: "deposit_local_bank",
        title: "Local Bank Deposit Page",
    },
};

export const ProductIntroData = {
    ProductIntroOWS: {
        category: "SportsListing",
        action: "Launch SB2.0 Saba",
        name: "SportsListing_C_SaBa",
        title: "Sports Listing",
        path: "sports_listing",
    },
    ProductIntroIPSB: {
        category: "SportsListing",
        action: "Launch SB2.0 IM",
        name: "SportsListing_C_IM",
        title: "Sports Listing",
        path: "sports_listing",
    },
    ProductIntroCML: {
        category: "SportsListing",
        action: "Launch CMD",
        name: "SportsListing_C_CMD",
        title: "Sports Listing",
        path: "sports_listing",
    },
    ProductIntroSBT: {
        category: "SportsListing",
        action: "Launch SB2.0 BTi",
        name: "SportsListing_C_BTi",
        title: "Sports Listing",
        path: "sports_listing",
    },
    ProductIntroVTG: {
        category: "SportsListing",
        action: "Launch V2",
        name: "SportsListing_C_V2",
        title: "Sports Listing",
        path: "sports_listing",
    },
    ProductIntrosportsbook: {
        category: "SportsListing",
        action: "Launch Activity",
        name: "SportsListing_C_Banner",
        title: "Sports Listing",
        path: "sports_listing",
    },

    ProductIntroTFG: {
        category: "Esports_Listing",
        action: "Launch TF",
        name: "Esports_Listing_C_TF",
        title: "Esports Listing",
        path: "esports_listing",
    },
    ProductIntroIPES: {
        category: "Esports_Listing",
        action: "Launch Fun88 Esports",
        name: "Esports_Listing_C_Fun88",
        title: "Esports Listing",
        path: "esports_listing",
    },
    ProductIntroesports: {
        category: "Esports_Listing",
        action: "Launch Activity",
        name: "Esports_Listing_C_Banner",
        title: "Esports Listing",
        path: "esports_listing",
    },

    ProductIntroTCG: {
        category: "Lottery_Listing",
        action: "Launch TC",
        name: "Lottery_listing_C_TC",
        title: "Lottery Listing",
        path: "lottery_listing",
    },
    ProductIntroSGW: {
        category: "Lottery_Listing",
        action: "Launch SGW",
        name: "Lottery_listing_C_SGW",
        title: "Lottery Listing",
        path: "lottery_listing",
    },
    ProductIntroGPK: {
        category: "Lottery_Listing",
        action: "Launch FUN88",
        name: "Lottery_listing_C_FUN88",
        title: "Lottery Listing",
        path: "lottery_listing",
    },
    ProductIntroSLC: {
        category: "Lottery_Listing",
        action: "Launch SLC",
        name: "Lottery_listing_C_SLC",
        title: "Lottery Listing",
        path: "lottery_listing",
    },
    ProductIntrolottery: {
        category: "Lottery_Listing",
        action: "Launch Activity",
        name: "Lottery_listing_C_Banner",
        title: "Lottery Listing",
        path: "lottery_listing",
    },

    "RewardPage": {
        category: "MemberCenter",
        action: "View Reward Store Page",
        name: "MemberCenter_C_RewardStore",
        path: "member_center",
        title: "Member Center",
    },
    "RewardPage1": {
        category: "RewardsStore",
        action: "Go to Rewards Centre",
        name: "RewardsStore_C_Exchange",
        path: "reward_points",
        title: "Reward Points"
    },
    "RewardPage2": {
        category: "RewardsStore",
        action: "Go to Help Center",
        name: "RRewardsStore_C_HelpCenter",
        path: "reward_points",
        title: "Reward Points"
    },
    "RewardPage3": {
        category: "RewardsStore",
        action: "Contact CS",
        name: "RewardsStore_C_CS",
        path: "reward_points",
        title: "Reward Points"
    },
};

const PiwikEventData = {
    login1: {
        category: "Login",
        action: "Password Login",
        name: "Login_S_Login",
        path: "login",
        title: "Login",
    },
    "login1.1": {
        category: "Login",
        action: "Fingerprint Login",
        name: "Login_S_FingerPrint",
        path: "login",
        title: "Login",
    },
    "login1.2": {
        category: "Login",
        action: "Pattern Login",
        name: "Login_S_Pattern",
        path: "login",
        title: "Login",
    },
    "login1.3": {
        category: "Login",
        action: "Face ID Login",
        name: "Login_S_FaceID",
        path: "login",
        title: "Login",
    },
    login2: {
        category: "Login",
        action: "Switch to Register",
        name: "Login_C_Register",
        path: "login",
        title: "Login",
    },
    login3: {
        category: "Login",
        action: "Toggle Remember Username",
        name: "Login_C_RememberMe",
        path: "login",
        title: "Login",
    },
    login4: {
        category: "Login",
        action: "Go to Forget Password",
        name: "Login_C_ForgetPassword",
        path: "login",
        title: "Login",
    },
    login5: {
        category: "Login",
        action: "Go to Guest View",
        name: "Login_C_GuestView",
        path: "login",
        title: "Login",
    },
    login6: {
        category: "Login",
        action: "Contact CS",
        name: "Login_C_CS",
        path: "login",
        title: "Login",
    },

    register1: {
        category: "Register",
        action: "Submit Register",
        name: "Register_S_Register",
        path: "register",
        title: "Register",
    },
    register2: {
        category: "Register",
        action: "View TC",
        name: "Register_V_T&C",
        path: "register",
        title: "Register",
    },
    register3: {
        category: "Register",
        action: "Switch to Login",
        name: "Register_C_Login",
        path: "register",
        title: "Register",
    },
    register4: {
        category: "Register",
        action: "Contact CS",
        name: "Register_C_CS",
        path: "register",
        title: "Register",
    },

    changePassword1: {
        category: "Change Password",
        action: "Submit Change Password",
        name: "Account-Info_S_ChangePassword",
        path: "change_password",
        title: "Change Password",
    },

    forgetName1: {
        category: "ForgetUsername",
        action: "Submit Forget Username",
        name: "ForgetUsername_S_Email",
        path: "forget_username",
        title: "Forget User Name",
    },
    forgetName2: {
        category: "ForgetUsername",
        action: "Go to Forget Password",
        name: "ForgetUsername_C_ForgetPassword",
        path: "forget_username",
        title: "Forget User Name",
    },
    forgetName3: {
        category: "ForgetUsername",
        action: "Contact CS",
        name: "ForgetUsername_C_CS",
        path: "forget_username",
        title: "Forget User Name",
    },

    forgetPassword1: {
        category: "ForgetPassword",
        action: "Submit Forget Password",
        name: "ForgetPassword_S_Email&Name",
        path: "forget_password",
        title: "Forget Password",
    },
    forgetPassword2: {
        category: "ForgetPassword",
        action: "Go to Forget Username",
        name: "ForgetPassword_C_ForgetName",
        path: "forget_password",
        title: "Forget Password",
    },
    forgetPassword3: {
        category: "ForgetPassword",
        action: "Contact CS",
        name: "ForgetPassword_C_CS",
        path: "forget_password",
        title: "Forget Password",
    },

    loginOTP1: {
        category: "Login_Security_Verification",
        action: "Learn more",
        name: "Login_Security_Verification_V_More",
        path: "login_otp",
        title: "Login OTP",
    },
    loginOTP2: {
        category: "Login_Security_Verification",
        action: "Select Phone OTP",
        name: "Login_Security_Verification_C_Phone",
        path: "login_otp",
        title: "Login OTP",
    },
    loginOTP3: {
        category: "Login_Security_Verification",
        action: "Select Email OTP",
        name: "Login_Security_Verification_C_Email",
        path: "login_otp",
        title: "Login OTP",
    },
    loginOTP4: {
        category: "Login_Security_Verification",
        action: "Skip Verification",
        name: "Login_Security_Verification_C_Skip",
        path: "login_otp",
        title: "Login OTP",
    },
    loginOTP5: {
        category: "OTP_Verification",
        action: "Contact CS (Text Link)",
        name: "OTP_Verification_C_CS",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    "loginOTP6.1": {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_VoiceOTP",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    "loginOTP6.11": {
        category: "OTP_Verification",
        action: "Send OTP",
        name: "OTP_Verification_C_SMS",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    "loginOTP6.2": {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_SMSOTP",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    "loginOTP6.21": {
        category: "OTP_Verification",
        action: "Send OTP",
        name: "OTP_Verification_C_Voice",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    loginOTP7: {
        category: "OTP_Verification",
        action: "Go to Email Verification",
        name: "OTP_Verification_C_Change_Verification",
        path: "login_security_verification_phone_verification",
        title: "Login Security Verification Phone Verification",
    },
    loginOTP8: {
        category: "OTP_Verification",
        action: "Contact CS (Text Link)",
        name: "OTP_Verification_C_CS",
        path: "login_security_verification_verification",
        title: "Login Security Verification Email Verification",
    },
    loginOTP9: {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_EmailOTP",
        path: "login_security_verification_verification",
        title: "Login Security Verification Email Verification",
    },
    loginOTP10: {
        category: "OTP_Verification",
        action: "Go to Phone Verification",
        name: "OTP_Verification_C_Change_Verificatin",
        path: "login_security_verification_verification",
        title: "Login Security Verification Email Verification",
    },

    otpexceed1: {
        category: "",
        action: "",
        name: "",
        path: "exceed5times_otp",
        title: "Exceed 5 times OTP",
    },
    otpexceed2: {
        category: "",
        action: "",
        name: "",
        path: "exceed5times_otp_cslink",
        title: "Phone&Email Exceed 5 times CS Link",
    },
    otpexceed3: {
        category: "",
        action: "",
        name: "",
        path: "Phone Exceed 5 times OTP Email",
        title: "exceed5times_otp_email",
    },
    otpexceed4: {
        category: "",
        action: "",
        name: "",
        path: "Email Exceed 5 times OTP Phone",
        title: "exceed5times_otp_phone",
    },

    reSetPwd1: {
        category: "Login_Security_Verification",
        action: "Learn more",
        name: "Login_Security_Verification_V_More",
        path: "Reset Password",
        title: "reset_password",
    },
    reSetPwd2: {
        category: "Login_Security_Verification",
        action: "Select Phone OTP",
        name: "Login_Security_Verification_C_Phone",
        path: "Reset Password",
        title: "reset_password",
    },
    reSetPwd3: {
        category: "Login_Security_Verification",
        action: "Select Email OTP",
        name: "Login_Security_Verification_C_Email",
        path: "Reset Password",
        title: "reset_password",
    },
    reSetPwd4: {
        category: "Login_Security_Verification",
        action: "Skip Verification",
        name: "Login_Security_Verification_C_Skip",
        path: "Reset Password",
        title: "reset_password",
    },
    reSetPwd5: {
        category: "OTP_Verification",
        action: "Contact CS (Text Link)",
        name: "OTP_Verification_C_CS",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },
    "reSetPwd6.1": {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_VoiceOTP",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },
    "reSetPwd6.11": {
        category: "OTP_Verification",
        action: "Send OTP",
        name: "OTP_Verification_C_SMS",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },
    "reSetPwd6.2": {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_SMSOTP",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },

    "reSetPwd6.21": {
        category: "OTP_Verification",
        action: "Send OTP",
        name: "OTP_Verification_C_Voice",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },
    reSetPwd7: {
        category: "OTP_Verification",
        action: "Go to Email Verification",
        name: "OTP_Verification_C_Change_Verification",
        path: "reset_password_phone_verification",
        title: "Reset Password Phone Verification",
    },

    reSetPwd8: {
        category: "OTP_Verification",
        action: "Contact CS (Text Link)",
        name: "OTP_Verification_C_CS",
        path: "reset_password_email_verification",
        title: "Reset Password Email Verification",
    },
    reSetPwd9: {
        category: "OTP_Verification",
        action: "Submit OTP",
        name: "OTP_Verification_S_OTP",
        path: "reset_password_email_verification",
        title: "Reset Password Email Verification",
    },
    reSetPwd10: {
        category: "OTP_Verification",
        action: "Go to Phone Verification",
        name: "OTP_Verification_C_Change_Verificatin",
        path: "reset_password_email_verification",
        title: "Reset Password Email Verification",
    },
    Revalidate: {
        category: "Revalidate",
        action: "Submit New Password",
        name: "Revalidate_S_NewPassword",
        path: "revalidate",
        title: "Revalidate",
    },
    // SetPassword screen popups
    SetPasswordSensitivePopup: {
        category: "Revalidate",
        action: "Submit New Password",
        name: "Revalidate_S_NewPassword",
        path: "sensitive-password-popup",
        title: "Sensitive Password",
    },
    SetPasswordDummyPopup: {
        category: "Revalidate",
        action: "Submit New Password",
        name: "Revalidate_S_NewPassword",
        path: "dummy-password-popup",
        title: "Dummy Password",
    },

    // Login screen popups
    LoginSensitivePopup: {
        category: "Register",
        action: "Submit Register",
        name: "Register_S_Register",
        path: "sensitive-password-popup",
        title: "Sensitive Password",
    },
    LoginDummyPopup: {
        category: "Register",
        action: "Submit Register",
        name: "Register_S_Register",
        path: "dummy-password-popup",
        title: "Dummy Password",
    },

    // ChangePassword screen popups
    ChangePasswordSensitivePopup: {
        category: "Change Password",
        action: "Submit Change Password",
        name: "Account-Info_S_ChangePassword",
        path: "sensitive-password-popup",
        title: "Sensitive Password",
    },
    ChangePasswordDummyPopup: {
        category: "Change Password",
        action: "Submit Change Password",
        name: "Account-Info_S_ChangePassword",
        path: "dummy-password-popup",
        title: "Dummy Password",
    },


    NavBar1: {
        category: "NavBar",
        action: "Go to Home",
        name: "NavBar_C_Home",
        path: "home",
        title: "Home",
    },
    NavBar2: {
        category: "NavBar",
        action: "Go to Promotion",
        name: "NavBar_C_Promotion",
        path: "home",
        title: "Home",
    },
    NavBar3: {
        category: "NavBar",
        action: "Go to BetRecord",
        name: "NavBar_C_BetRecord",
        path: "home",
        title: "Home",
    },
    NavBar4: {
        category: "NavBar",
        action: "Go to RewardsCentre",
        name: "NavBar_C_RewardsCentre",
        path: "home",
        title: "Home",
    },
    NavBar5: {
        category: "NavBar",
        action: "Go to Member Center",
        name: "NavBar_C_MemberCenter",
        path: "home",
        title: "Home",
    },
    NavBar6: {
        category: "NavBar",
        action: "Launch Euro2024",
        name: "NavBar_C_Euro2024",
        path: "home",
        title: "Home",
    },

    HomePage1: {
        category: "Home",
        action: "Click Banner",
        name: "Home_C_Banner",
        path: "home",
        title: "Home",
    },
    HomePage2: {
        category: "Home",
        action: "Go to Deposit",
        name: "Home_C_Deposit",
        path: "home",
        title: "Home",
    },
    HomePage3: {
        category: "Home",
        action: "Go to Transfer",
        name: "Home_C_Transfer",
        path: "home",
        title: "Home",
    },
    HomePage4: {
        category: "Home",
        action: "Go to Withdrawal",
        name: "Home_C_Withdraw",
        path: "home",
        title: "Home",
    },
    HomePage5: {
        category: "Home",
        action: "Launch Activity",
        name: "Home_C_FeatureBanner",
        path: "home",
        title: "Home",
    },
    HomePage6: {
        category: "Home",
        action: "Refresh Balance",
        name: "Home_C_Refresh",
        path: "home",
        title: "Home",
    },
    HomePage7: {
        category: "Home",
        action: "Contact CS",
        name: "Home_C_CS",
        path: "home",
        title: "Home",
    },
    HomePage8: {
        category: "Home",
        action: "Go to Login",
        name: "Home_C_Login",
        path: "home",
        title: "Home",
    },
    HomePage9: {
        category: "Home",
        action: "Go to Register",
        name: "Home_C_Register",
        path: "home",
        title: "Home",
    },
    HomePage10: {
        category: "TopNav",
        action: "Go to Deposit",
        name: "TopNav_C_Deposit",
        path: "home",
        title: "Home",
    },
    HomepageGamenav1: {
        category: "Home",
        action: "View Sports Listing",
        name: "Home_GameNav_C_Sports",
        path: "home",
        title: "Home",
    },
    HomepageGamenav2: {
        category: "Home",
        action: "View Esports Listing",
        name: "Home_GameNav_C_Esports",
        path: "home",
        title: "Home",
    },
    HomepageGamenav3: {
        category: "Home",
        action: "View Instant Games Listing",
        name: "Home_GameNav_C_InstantGames",
        path: "home",
        title: "Home",
    },
    HomepageGamenav4: {
        category: "Home",
        action: "View LD Listing",
        name: "Home_GameNav_C_LiveDealer",
        path: "home",
        title: "Home",
    },
    HomepageGamenav5: {
        category: "Home",
        action: "View SlotFishing Listing",
        name: "Home_GameNav_C_SlotFishing",
        path: "home",
        title: "Home",
    },
    HomepageGamenav6: {
        category: "Home",
        action: "View P2P Listing",
        name: "Home_GameNav_C_P2P",
        path: "home",
        title: "Home",
    },
    HomepageGamenav7: {
        category: "Home",
        action: "View Lottery Listing",
        name: "Home_GameNav_C_Lottery",
        path: "home",
        title: "Home",
    },
    ...HomeGameSubProviders,
    ...ProductIntroData,

    ProductGamePageLiveDealer1: {
        category: "",
        action: "",
        name: "",
        path: "",
        title: "",
    },
    ProductGamePageLiveDealer2: {
        category: "LiveDealer_Listing",
        action: "Launch Game",
        name: "LiveDealer_Listing_C_Game",
        path: "live_dealer_listing",
        title: "Live Dealer Listing",
    },
    ProductGamePageLiveDealer3: {
        category: "LiveDealer_Listing",
        action: "Go to Recommended Game Listing",
        name: "LiveDealer_Listing_C_Recommended_More",
        title: "Live Dealer Listing",
        path: "live_dealer_listing",
    },
    ProductGamePageLiveDealer4: {
        category: "LiveDealer_Listing",
        action: "",
        name: "LiveDealer_Listing_C_Vendor",
        path: "live_dealer_listing",
        title: "Live Dealer Listing",
    },
    ProductGamePageLiveDealer5: {
        category: "LiveDealer_Listing",
        action: "",
        name: "LiveDealer_Listing_C_Filter",
        path: "live_dealer_listing",
        title: "Live Dealer Listing",
    },

    ProductGamePageKenoLottery1: {
        category: "",
        action: "",
        name: "",
        path: "",
        title: "",
    },
    ProductGamePageKenoLottery2: {
        category: "Lottery_Listing",
        action: "Launch Game",
        name: "Lottery_Listing_C_Recommended_Vendor",
        path: "lottery_listing",
        title: "Lottery Listing",
    },
    ProductGamePageKenoLottery3: {
        category: "Lottery_Listing",
        action: "Go to Recommended Game Listing",
        name: "Lottery_Listing_C_Recommended_More",
        path: "lottery_listing",
        title: "Lottery Listing",
    },
    ProductGamePageKenoLottery4: {
        category: "Lottery_Listing",
        action: "",
        name: "Lottery_Listing_C_Vendor",
        path: "lottery_listing",
        title: "Lottery Listing",
    },
    ProductGamePageKenoLottery5: {
        category: "Lottery_Listing",
        action: "",
        name: "Lottery_Listing_C_Filter",
        path: "lottery_listing",
        title: "Lottery Listing",
    },

    ProductGamePageInstantGames2: {
        category: "InstantGames_Listing",
        path: "instantgames_listing",
        title: "InstantGames Listing",
    },
    ProductGamePageInstantGames3: {
        category: "InstantGames_Listing",
        action: "Go to Recommended Game Listing",
        name: "InstantGames_Listing_C_Recommended_More",
        path: "instantgames_listing",
        title: "InstantGames Listing",
    },
    ProductGamePageInstantGames4: {
        category: "InstantGames_Listing",
        action: "",
        name: "",
        path: "instantgames_listing",
        title: "InstantGames Listing",
    },
    ProductGamePageInstantGames5: {
        category: "InstantGames_Listing",
        action: "",
        name: "InstantGames_Listing_C_Filter",
        path: "instantgames_listing",
        title: "InstantGames Listing",
    },

    ProductGamePageSlotFishing2: {
        category: "SlotFishing_Listing",
        //action: `Launch Game`,
        name: "SlotFishing_Listing_C_Recommended_Game",
        title: "Slot/Fishing Listing",
        path: "slotfishing_listing",
    },
    ProductGamePageSlotFishing3: {
        category: "SlotFishing_Listing",
        action: "Go to Recommended Game Listing",
        name: "SlotFishing_Listing_C_View",
        title: "Slot/Fishing Listing",
        path: "slotfishing_listing",
    },
    ProductGamePageSlotFishing4: {
        category: "SlotFishing_Listing",
        action: "",
        name: "",
        title: "Slot/Fishing Listing",
        path: "slotfishing_listing",
    },
    ProductGamePageSlotFishing5: {
        category: "SlotFishing_Listing",
        action: "",
        name: "SlotFishing_Listing_C_Vendor",
        title: "Slot/Fishing Listing",
        path: "slotfishing_listing",
    },
    ProductGamePageSlotFishing6: {
        category: "SlotFishing_Listing",
        action: "Go to Game Listing",
        name: "SlotFishing_Listing_C_Filter",
        title: "Slot/Fishing Listing",
        path: "slotfishing_listing",
    },

    ProductGamePageP2P1: {
        category: "",
        action: "",
        name: "",
        path: "",
        title: "",
    },
    ProductGamePageP2P2: {
        category: "P2P_Listing",
        action: "Launch Game",
        name: "P2P_Listing_C_Recommended_Vendor",
        title: "P2P Listing",
        path: "p2p_listing",
    },
    ProductGamePageP2P3: {
        category: "P2P_Listing",
        action: "Go to Recommended Game Listing",
        name: "P2P_Listing_C_Recommended_More",
        title: "P2P Listing",
        path: "p2p_listing",
    },
    ProductGamePageP2P4: {
        category: "P2P_Listing",
        action: "",
        name: "P2P_ Listing_C_Vendor",
        title: "P2P Listing",
        path: "p2p_listing",
    },
    ProductGamePageP2P5: {
        category: "P2P_Listing",
        action: "",
        name: "P2P_Listing_C_Filter",
        title: "P2P Listing",
        path: "p2p_listing",
    },

    ProductGameDetailSPORTSBOOK1: {
        category: "Sports_Lobby",
        action: "Search Game",
        name: "Sports_Lobby_V2Sports_C__Search",
        path: "sports_lobby_VTG",
        title: "Sports Lobby VTG",
    },
    ProductGameDetailSPORTSBOOK2: {
        category: "Sports_Lobby",
        action: "Filter Game",
        name: "Sports_Lobby_V2Sports_C_Filter",
        path: "sports_lobby_VTG",
        title: "Sports Lobby VTG",
    },
    ProductGameDetailSPORTSBOOK3: {
        category: "Sports_Lobby",
        action: "Launch Game",
        name: "Sports_Lobby_V2Sports_C_Game",
        path: "sports_lobby_VTG",
        title: "Sports Lobby VTG",
    },

    ProductGameDetailLIVECASINO1: {
        category: "",
        action: "Search Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailLIVECASINO2: {
        category: "",
        action: "Filter Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailLIVECASINO3: {
        category: "",
        action: "Launch Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailinstantgames1: {
        category: "InstantGames_Lobby",
        action: "Launch Game",
        name: "InstantGames_Lobby_C_SPR",
        path: "InstantGames_lobby",
        title: "InstantGames Lobby",
    },
    ProductGameDetailSlotFishing1: {
        category: "",
        action: "Search Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailSlotFishing2: {
        category: "",
        action: "Filter Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailSlotFishing3: {
        category: "",
        action: "Launch Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailP2P1: {
        category: "",
        action: "Search Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailP2P2: {
        category: "",
        action: "Filter Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailP2P3: {
        category: "",
        action: "Launch Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailkenolottery1: {
        category: "Lottery_Lobby",
        action: "Search Game",
        name: "Lottery_Lobby_C_Search",
        path: "",
        title: "",
    },
    ProductGameDetailkenolottery2: {
        category: "Lottery_Lobby",
        action: "Filter Game",
        name: "Lottery_Lobby_C_Filter",
        path: "",
        title: "",
    },
    ProductGameDetailkenolottery3: {
        category: "Lottery_Lobby",
        action: "Launch Game",
        name: "",
        path: "",
        title: "",
    },
    ProductGameDetailkenolottery4: {
        category: "Lottery_Lobby",
        action: "Launch Game",
        name: "",
        path: "",
        title: "",
    },

    Notification1: {
        category: "MemberCenter",
        action: "View Personal Message",
        name: "MemberCenter_Message_Tab_C_Personal",
        path: "member_center",
        title: "Member Center",
    },
    Notification2: {
        category: "MemberCenter",
        action: "View System Notice",
        name: "MemberCenter_Message_Tab_C_System",
        path: "member_center",
        title: "Member Center",
    },
    Notification3: {
        category: "MemberCenter",
        action: "Contact CS",
        name: "MemberCenter_Message_C_CS",
        path: "member_center",
        title: "Member Center",
    },
    Notification4: {
        category: "MemberCenter",
        action: "View Message (Transaction)",
        name: "MemberCenter_Message_Personal_C_BetRecord",
        path: "member_center",
        title: "Member Center",
    },
    Notification5: {
        category: "MemberCenter",
        action: "View Message (PMA)",
        name: "MemberCenter_Message_Personal_C_Personal",
        path: "member_center",
        title: "Member Center",
    },
    Notification6: {
        category: "MemberCenter",
        action: "Mark All Read",
        name: "MemberCenter_Message_MarkAllRead",
        path: "member_center",
        title: "Member Center",
    },
    Notification7: {
        category: "MemberCenter",
        action: "View Message (Bonus)",
        name: "MemberCenter_Message_Notice_C_Bonus",
        path: "member_center",
        title: "Member Center",
    },
    Notification8: {
        category: "MemberCenter",
        action: "Mark All Read",
        name: "MemberCenter_Message_Tab_C_Read",
        path: "member_center",
        title: "Member Center",
    },
    Notification9: {
        category: "MemberCenter",
        action: "View Message Detail",
        name: "MemberCenter_Message_C_Detail",
        path: "member_center",
        title: "Member Center",
    },
    Notification10: {
        category: "Message",
        action: "View Bonus Detail",
        name: "Message_C_BonusDetail",
        path: "member_center",
        title: "Member Center",
    },

    MemberCenter1: {
        category: "MemberCenter",
        action: "Go to Profile ",
        name: "MemberCenter_C_PersonalInfo",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter2: {
        category: "MemberCenter",
        action: "Go to Shipping Address",
        name: "MemberCenter_C_ShipmentAddress",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter3: {
        category: "MemberCenter",
        action: "Go to Account Management",
        name: "MemberCenter_C_AccountManagement",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter4: {
        category: "MemberCenter",
        action: "Go to Self Exclusion",
        name: "MemberCenter_C_SelfExclusion",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter5: {
        category: "MemberCenter",
        action: "Create Security Code",
        name: "MemberCenter_C_CreateSecurityCode",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter6: {
        category: "MemberCenter",
        action: "Upload PII",
        name: "MemberCenter_C_UploadPII",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter7: {
        category: "MemberCenter",
        action: "Setup Fast Login",
        name: "MemberCenter_C_SetupFastLogin",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter8: {
        category: "MemberCenter",
        action: "Go to Download Page",
        name: "MemberCenter_C_DownloadApp",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter9: {
        category: "MemberCenter",
        action: "View Help Center",
        name: "MemberCenter_C_HelpCenter",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter10: {
        category: "MemberCenter",
        action: "View Version",
        name: "MemberCenter_C_VersionNumber",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter11: {
        category: "MemberCenter",
        action: "Trigger Logout",
        name: "MemberCenter_C_Logout",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter12: {
        category: "MemberCenter",
        action: "Contact CS",
        name: "MemberCenter_C_CS",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter13: {
        category: "MemberCenter",
        action: "Go to Verification",
        name: "MemberCenter_C_Verification",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter14: {
        category: "MemberCenter",
        action: "Go to Deposit",
        name: "MemberCenter_C_Deposit",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter15: {
        category: "MemberCenter",
        action: "Go to Transfer",
        name: "MemberCenter_C_Transfer",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter16: {
        category: "MemberCenter",
        action: "Go to Withdrawal",
        name: "MemberCenter_C_Withdrawal",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter17: {
        category: "MemberCenter",
        action: "View Transaction Record",
        name: "MemberCenter_C_TransactionRecord",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter18: {
        category: "MemberCenter",
        action: "View Message",
        name: "MemberCenter_C_Notification",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter19: {
        category: "MemberCenter",
        action: "View VIP Page",
        name: "MemberCenter_C_VIP ",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter20: {
        category: "MemberCenter",
        action: "View Special Offer",
        name: "MemberCenter_V_DailyDeal",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter21: {
        category: "MemberCenter",
        action: "View Sponsor",
        name: "MemberCenter_C_Sponsor",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter22: {
        category: "MemberCenter",
        action: "Go to Affiliate Page",
        name: "MemberCenter_C_Affiliate",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter23: {
        category: "MemberCenter",
        action: "Go to Refer A Friend",
        name: "MemberCenter_C_Referral",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter24: {
        category: "MemberCenter",
        action: "Go to RewardsCentre",
        name: "MemberCenter_C_RewardsCentre",
        path: "member_center",
        title: "Member Center Page",
    },
    MemberCenter25: {
        category: "InMission_SideMenu",
        action: "Refresh Balance",
        name: "InMission_SideMenu_C_Balance_Refresh",
        path: "inmission",
        title: "InMission",
    },
    MemberCenter26: {
        category: "MemberCenter",
        action: "Go to TC Page",
        name: "MemberCenter_C_T&Cpage",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter27: {
        category: "MemberCenter",
        action: "View USDT Info Page",
        name: "MemberCenter_C_USDTInfo",
        path: "member_center",
        title: "Member Center",
    },
    MemberCenter28: {
        category: "MemberCenter",
        action: "View Help Center",
        name: "MemberCenter_C_HelpCenter",
        path: "member_center",
        title: "Member Center",
    },


    OneWallet1: {
        category: "MemberCenter",
        action: "Click Balance Type",
        name: "MemberCenter_C_BalanceType",
        path: "member_center",
        title: "Member Center"
    },
    OneWallet2: {
        category: "MemberCenter",
        action: "Hide Balance Detail",
        name: "MemberCenter_C_HideBalanceDetail",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet3: {
        category: "MemberCenter",
        action: "View Balance Tooltip",
        name: "MemberCenter_C_BalanceToolTip",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet4: {
        category: "MemberCenter",
        action: "View Locked Balance Tooltip",
        name: "MemberCenter_C_LockedBalanceTooltip",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet5: {
        category: "MemberCenter",
        action: "View Locked Balance Detail",
        name: "MemberCenter_C_LockedBalance",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet6: {
        category: "MemberCenter",
        action: "Unhide Balance Detail",
        name: "MemberCenter_C_UnhideBalanceDetail",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet7: {
        category: "",
        action: "",
        name: "",
        path: "",
        title: "",
    },
    OneWallet8: {
        category: "MemberCenter",
        action: "Refresh Balance",
        name: "MemberCenter_C_RefreshBalance",
        path: "member_center",
        title: "Member Center",
    },

    OneWallet9: {
        category: "MemberCenter_LockedBalance",
        action: "Contact CS",
        name: "MemberCenter_LockedBalance_C_CS",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet10: {
        category: "MemberCenter_LockedBalance",
        action: "View Locked Balance Tooltip",
        name: "MemberCenter_LockedBalance_C_LockedBalanceTooltip",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet11: {
        category: "MemberCenter_LockedBalance",
        action: "View Locked Deposit Tooltip",
        name: "MemberCenter_LockedBalance_C_LockedDepositTooltip",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet12: {
        category: "MemberCenter_LockedBalance",
        action: "View Promotion Locked Balance Tooltip",
        name: "MemberCenter_LockedBalance_C_PromotionLockedBalanceTooltip",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet13: {
        category: "MemberCenter_LockedBalance",
        action: "Go to Home",
        name: "MemberCenter_LockedBalance_C_Bet",
        path: "member_center",
        title: "Member Center",
    },
    OneWallet14: {
        category: "MemberCenter_LockedBalance",
        action: "View Promotion Time Tooltip",
        name: "MemberCenter_LockedBalance_C_PromotionTimeTooltip",
        path: "member_center",
        title: "Member Center",
    },

    OneWallet15: {
        category: "Withdrawal",
        action: "View Balance Detail",
        name: "Withdrawal_C_BalanceDetail",
        path: "",
        title: "",
    },
    OneWallet16: {
        category: "Withdrawal",
        action: "Go to Locked Balance ",
        name: "Withdrawal_C_LockedBalance",
        path: "",
        title: "",
    },

    Betrecord1: {
        category: "Bet_Record",
        action: "Contact CS",
        name: "Bet_Record_C_CS",
        path: "bet_record",
        title: "Bet Record",
    },
    Betrecord2: {
        category: "Bet_Record",
        action: "Filter",
        name: "Bet_Record_C_Filter",
        path: "bet_record_filter",
        title: "Bet Record Filter",
    },

    ShipmentFormAccount1: {
        category: "ShippingAddress",
        action: "Go to Add Address",
        name: "ShippingAddress_C_AddAddress",
        path: "shipping_address",
        title: "Shipping Address",
    },
    ShipmentFormAccount2: {
        category: "ShippingAddress",
        action: "Contact CS",
        name: "ShippingAddress_NewAddress_C_CS",
        path: "new_shipping_address",
        title: "New Shipping Address",
    },
    ShipmentFormAccount3: {
        category: "ShippingAddress",
        action: "Add Address",
        name: "ShippingAddress_S_NewAddress",
        path: "new_shipping_address",
        title: "New Shipping Address",
    },
    ShipmentFormAccount4: {
        category: "ShippingAddress",
        action: "Delete Address",
        name: "ShippingAddress_Edit_C_DeleteAddress",
        path: "edit_shipping_address",
        title: "Edit Shipping Address",
    },
    ShipmentFormAccount5: {
        category: "ShippingAddress",
        action: "Delete Address",
        name: "ShippingAddress_C_DeleteAddres",
        path: "shipping_address",
        title: "Shipping Address",
    },
    ShipmentFormAccount6: {
        category: "ShippingAddress",
        action: "Edit Address",
        name: "ShippingAddress_C_EditAddress",
        path: "shipping_address",
        title: "Shipping Address",
    },
    ShipmentFormAccount7: {
        category: "ShippingAddress",
        action: "Update Address",
        name: "ShippingAddress_Edit_S_UpdateAddress",
        path: "edit_shipping_address",
        title: "Edit Shipping Address",
    },
    ShipmentFormAccount8: {
        category: "ShippingAddress",
        action: "Confirm Delete",
        name: "ShippingAddress_S_DeleteAddress_Confirm",
        path: "",
        title: "",
    },
    ShipmentFormAccount9: {
        category: "ShippingAddress",
        action: "Cancel Delete",
        name: "ShippingAddress_C_DeleteAddress_Cancel",
        path: "",
        title: "",
    },


    ShipmentFormPromotion1: {
        category: "Promotion_ShipmentAddress",
        action: "Go to Add Address",
        name: "Promotion_ShipmentAddress_C_AddAddress",
        path: "promotion_shipment_address",
        title: "Promotion Shipment Address",
    },
    ShipmentFormPromotion3: {
        category: "Promotion_ShipmentAddress",
        action: "Submit Address",
        name: "Promotion_ShipmentAddress_S_Address",
        path: "promotion_shipment_address",
        title: "Promotion Shipment Address",
    },

    AccountManagement1: {
        category: "AccountManagement",
        action: "Switch to Common Tab",
        name: "AccountManagement_C_CommonAccount",
        path: "account_management",
        title: "Account Management Page",
    },
    AccountManagement2: {
        category: "AccountManagement",
        action: "Switch to Crypto ERC20",
        name: "AccountManagement_C_CryptoERC20",
        path: "account_management",
        title: "Account Management Page",
    },
    AccountManagement3: {
        category: "AccountManagement",
        action: "Switch to Crypto TRC20",
        name: "AccountManagement_C_CryptoTRC20",
        path: "account_management",
        title: "Account Management Page",
    },
    AccountManagement4: {
        category: "AccountManagement",
        action: "Contact CS",
        name: "AccountManagement_C_CS",
        path: "account_management",
        title: "Account Management Page",
    },

    ManualDetail1: {
        category: "Promotion_Detail",
        action: "Share Promotion",
        name: "Promotion_Detail_C_Share",
        path: "manual_detail",
        title: "Manual Detail",
    },
    ManualDetail2: {
        category: "Promotion_Detail",
        action: "Apply Promotion",
        name: "Promotion_Detail_C_Apply",
        path: "manual_detail",
        title: "Manual Detail",
    },
    ManualDetail3: {
        category: "Promotion_Detail",
        action: "Submit Promotion Appication",
        name: "Promotion_Detail_S_Apply",
        path: "manual_detail",
        title: "Manual Detail",
    },
    ManualDetail4: {
        category: "Promotion_Detail",
        action: "Contact CS (Text Link)",
        name: "Promotion_Detail_C_CS",
        path: "manual_detail",
        title: "Manual Detail",
    },

    ManualDetailReview1: {
        category: "Manual_Detail",
        action: "Share Promotion",
        name: "Manual_Detail_Review_C_Share",
        path: "manual_detail_review",
        title: "Manual Detail Review",
    },
    ManualDetailReview2: {
        category: "Manual_Detail",
        action: "Apply Promotion",
        name: "Manual_Detail_Review_C_Apply",
        path: "manual_detail_review",
        title: "Manual Detail Review",
    },
    ManualDetailReview3: {
        category: "Manual_Detail",
        action: "Share Promotion  Form",
        name: "Manual_Detail_Review_C_Share",
        path: "manual_detail_review",
        title: "Manual Detail Review",
    },
    ManualDetailReview4: {
        category: "Manual_Detail",
        action: "Contact CS (Text Link)",
        name: "Manual_Detail_C_CS",
        path: "manual_detail_review",
        title: "Manual Detail Review",
    },

    Rebate1: {
        category: "Promotion_Rebate",
        action: "Expand Filter",
        name: "Promotion_Rebate_C_Filter",
        path: "rebate",
        title: "Rebate",
    },
    Rebate2: {
        category: "Promotion_Rebate",
        action: "Expand Period",
        name: "Promotion_Rebate_C_Period",
        path: "rebate",
        title: "Rebate",
    },
    Rebate3: {
        category: "Promotion_Rebate",
        action: "Contact CS",
        name: "BetRecord_C_CS",
        path: "rebate",
        title: "Rebate",
    },

    PromotionDetail1: {
        category: "Promotion",
        action: "Share Promotion",
        name: "Promotion_Detail_C_Share",
        path: "promotion_detail",
        title: "Promotion Detail",
    },
    PromotionDetail2: {
        category: "Promotion",
        action: "Claim Prize",
        name: "Promotion_Detail_C_Claim",
        path: "promotion_detail",
        title: "Promotion Detail",
    },
    PromotionDetail3: {
        category: "Promotion",
        action: "Apply Promotion",
        name: "Promotion_Detail_S_Apply",
        path: "promotion_detail",
        title: "Promotion Detail",
    },
    PromotionDetail4: {
        category: "Promotion",
        action: "Copy Link",
        name: "Promotion_Share_C_Link",
        path: "promotion_detail",
        title: "Promotion Detail",
    },
    PromotionDetail5: {
        category: "Promotion",
        action: "Download Picture",
        name: "Promotion_Share_C_Picture",
        path: "promotion_detail",
        title: "Promotion Detail",
    },

    MyPromo1: {
        category: "Promotion",
        action: "Cancel",
        name: "Promotion_Rebate_C_Filter",
        path: "my_promo",
        title: "My Promo",
    },
    MyPromo2: {
        category: "Promotion_MyPromotion",
        action: "Switch to Applied Promotion",
        name: "Promotion_MyPromotion_C_Applied",
        path: "my_promo",
        title: "My Promo",
    },
    MyPromo3: {
        category: "Promotion_MyPromotion",
        action: "Switch to FreeBet",
        name: "Promotion_MyPromotion_C_FreeBet",
        path: "my_promo",
        title: "My Promo",
    },
    MyPromo4: {
        category: "Promotion_MyPromotion",
        action: "View Tooltip",
        name: "Promotion_MyPromotion_C_Tooltip",
        path: "my_promo",
        title: "My Promo",
    },
    MyPromo5: {
        category: "Promotion_MyPromotion",
        action: "Claim Prize",
        name: "Promotion_MyPromotion_C_Claim",
        path: "my_promo",
        title: "My Promo",
    },
    MyPromo6: {
        category: "Promotion_MyPromotion",
        action: "Toggle to Expired Promotion",
        name: "Promotion_MyPromotion_C_Expired",
        path: "my_promo",
        title: "My Promo",
    },

    PromoPageSPECIAL: {
        category: "Promotion",
        action: "View Promo (specail)",
        name: "Promotion_C_specailPromotion",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageNEWMEMBER: {
        category: "Promotion",
        action: "View Promo (new member)",
        name: "Promotion_C_newMemberPromotion",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageVIP: {
        category: "Promotion",
        action: "View Promo (VIP)",
        name: "Promotion_C_VipPromotion",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageSPORTS: {
        category: "Promotion",
        action: "View Promo (Sports)",
        name: "Promotion_C_Sports",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageESPORTS: {
        category: "Promotion",
        action: "View Promo (Esports)",
        name: "Promotion_C_Esports",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageCASINO: {
        category: "Promotion",
        action: "View Promo (LiveDealer)",
        name: "Promotion_C_LiveDealer",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageINSTANTGAMES: {
        category: "Promotion",
        action: "View Promo (InstantGames)",
        name: "Promotion_C_InstantGame",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageP2P: {
        category: "Promotion",
        action: "View Promo (P2P)",
        name: "Promotion_C_P2P",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPage7: {
        category: "Promotion",
        action: "View Promo (Fishing)",
        name: "Promotion_C_Fishing",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageSLOT: {
        category: "Promotion",
        action: "View Promo (Slot)",
        name: "Promotion_C_Slot",
        path: "promo_page",
        title: "Promo Page",
    },
    PromoPageLOTTERY: {
        category: "Promotion",
        action: "View Promo (Lottery)",
        name: "Promotion_C_Lottery",
        path: "promo_page",
        title: "Promo Page",
    },

    PromoMainPage1: {
        category: "Promotion",
        action: "Switch to Promotion",
        name: "Promotion_Tab_C_Promotion",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage2: {
        category: "Promotion",
        action: "Switch to MyPromotion",
        name: "Promotion_Tab_C_MyPromotion",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage3: {
        category: "Promotion",
        action: "Switch to Rebate",
        name: "Promotion_Tab_C_Rebate", //CXFUN88-4704
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage4: {
        category: "Promotion",
        action: "Switch to Daily Deal",
        name: "Promotion_Tab_C_DailyDeal",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage5: {
        category: "Promotion",
        action: "Expand filter",
        name: "Promotion_C_Filter",
        path: "../bonus",
        title: "Promotion",
    },
    PromoMainPage6: {
        category: "Promotion",
        action: "Contact CS",
        name: "Promotion_C_CS",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage7: {
        category: "Promotion",
        action: "Filter",
        name: "Promotion_C_Search",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage8: {
        category: "Promotion",
        action: "Apply Promotion",
        name: "Promotion_C_ApplyNow",
        path: "promotion",
        title: "Promotion",
    },
    PromoMainPage9: {
        category: "Promotion",
        action: "Submit Promotion Form",
        name: "Promotion_S_Application",
        path: "promotion",
        title: "Promotion",
    },

    BonusHistory1: {
        category: "Bonus",
        action: "View Ready to Start Bonus",
        name: "Bonus_Category_C_ReadytoStart",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory2: {
        category: "Bonus",
        action: "View Ongoing Bonus",
        name: "Bonus_Category_C_Ongoing",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory3: {
        category: "Bonus",
        action: "View Ready to Claim Bonus",
        name: "Bonus_Category_C_Ready",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory4: {
        category: "Bonus",
        action: "View Complete Bonus",
        name: "Bonus_Category_C_Complete",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory5: {
        category: "Bonus",
        action: "View Bonus Detail",
        name: "Bonus_C_Detail",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory6: {
        category: "Bonus",
        action: "Start Promotion",
        name: "Bonus_C_StartPromotion",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory7: {
        category: "Bonus",
        action: "Contact CS (Text Link)",
        name: "Bonus_Empty_C_CS",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory8: {
        category: "Bonus",
        action: "Confirm Rebate Game Type",
        name: "Bonus_C_ConfirmRebateGameType",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory9: {
        category: "Bonus",
        action: "Confirm Bonus Type and Cancel Ongoing",
        name: "Promotion_C_ConfirmType_CancelOnging",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory10: {
        category: "Bonus",
        action: "Confirm Cancel Sign Up Bonus",
        name: "Bonus_C_ConfirmCancelSignUpBonus",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory11: {
        category: "Bonus",
        action: "Choose Bonus Category",
        name: "Bonus_C_FilterCategory",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory12: {
        category: "Bonus",
        action: "Expand Bonus Category",
        name: "Bonus_C_Category",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory13: {
        category: "Bonus",
        action: "Swipe Left to Cancel",
        name: "Bonus_C_SwipeLeftCancel",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory14: {
        category: "Bonus",
        action: "Cancel Bonus",
        name: "Bonus_C_Cancel",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory15: {
        category: "Bonus",
        action: "Confirm Cancel Bonus and Rebate Record",
        name: "Bonus_C_ConfirmCancelBonusAndRebateRecord",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory16: {
        category: "Bonus",
        action: "Contact CS",
        name: "Bonus_ConfirmCancelBonus_C_CS",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory17: {
        category: "Bonus",
        action: "Claim Bonus",
        name: "Bonus_C_ClaimBonus",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory18: {
        category: "Bonus",
        action: "Go to Locked Balance",
        name: "Bonus_ClaimBonusSuccess_C_LockedBalance",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory19: {
        category: "Bonus",
        action: "Filter Archived Bonus",
        name: "Bonus_Archived_C_Category",
        path: "bonus",
        title: "Bonus",
    },
    BonusHistory20: {
        category: "Bonus",
        action: "View Bonus Tooltip",
        name: "Bonus_C_StatusTooltip",
        path: "bonus",
        title: "Bonus",
    },




    Daily1Deal1: {
        category: "Promotion_DailyDeal",
        action: "Switch to Daily Deal",
        name: "Promotion_DailyDeal_C_DailyDeal",
        path: "bonus",
        title: "Bonus",
    },
    Daily1Deal2: {
        category: "Promotion_DailyDeal",
        action: "Switch to Daily Deal Record",
        name: "Promotion_DailyDeal_C_DailyDealRecord",
        path: "bonus",
        title: "Bonus",
    },

    Transfer1: {
        category: "Transfer",
        action: "Switch to One Click Transfer",
        name: "Transfer_C_OneClickTransfer",
        path: "transfer",
        title: "Transfer Page",
    },
    Transfer2: {
        category: "Transfer",
        action: "Switch to Common Transfer",
        name: "Transfer_C_Common_Transfer",
        path: "transfer",
        title: "Transfer Page",
    },
    Transfer3: {
        category: "Transfer",
        action: "Contact CS",
        name: "Transfer_C_CS",
        path: "transfer",
        title: "Transfer Page",
    },
    Transfer4: {
        category: "Transfer",
        action: "Transfer to Wallet",
        name: "Transfer_C_Wallet",
        path: "transfer",
        title: "Transfer Page",
    },
    Transfer5: {
        category: "Transfer",
        action: "Submit Transfer",
        name: "Transfer_S_Wallet",
        path: "transfer",
        title: "Transfer Page",
    },

    AvailabilityProcess1: {
        category: "KYC",
        action: "Submit Real Name/ Go to Deposit Page",
        name: "KYC_S_RealName",
        path: "kyc",
        title: "KYC",
    },
    AvailabilityProcess2: {
        category: "KYC",
        action: "Contact CS",
        name: "KYC_C_CS",
        path: "kyc",
        title: "KYC",
    },
    AvailabilityProcess3: {
        category: "",
        action: "",
        name: "",
        path: "deposit_verification_reminder_popup",
        title: "1st Deposit Verification",
    },

    TransactionRecord1: {
        category: "Transaction",
        action: "Contact CS",
        name: "Transaction_C_CS",
        path: "transaction",
        title: "Transaction Page",
    },
    TransactionRecord2: {
        category: "Transaction",
        action: "Switch to Deposit",
        name: "Transaction_C_Deposit",
        path: "transaction",
        title: "Transaction Page",
    },
    TransactionRecord3: {
        category: "Transaction",
        action: "Switch to Transfer",
        name: "Transaction_C_Transfer",
        path: "transaction",
        title: "Transaction Page",
    },
    TransactionRecord4: {
        category: "Transaction",
        action: "Switch to Withdrawal",
        path: "transaction",
        title: "Transaction Page",
    },
    TransactionRecord5: {
        category: "Transaction",
        action: "Upload Slip",
        name: "Transaction_C_Upload_slip",
        path: "transaction",
        title: "Transaction Page",
    },
    TransactionRecord6: {
        category: "Transaction",
        action: "Resubmit",
        name: "Transaction_C_Resubmit",
        path: "transaction",
        title: "Transaction Page",
    },

    WithdrawalVerification1: {
        category: "KYC",
        action: "Request OTP",
        name: "KYC_C_EmailVerify",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification2: {
        category: "KYC",
        action: "Contact CS (Text Link)",
        name: "KYC_C_CS",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification3: {
        category: "KYC",
        action: "Submit EmailOTP/ Go to Withdrawal",
        name: "KYC_S_EmailVerify",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification4: {
        category: "KYC",
        action: "Request OTP",
        name: "KYC_C_PhoneVerify",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification5: {
        category: "KYC",
        action: "Submit OTP/ Go to Withdrawal",
        name: "KYC_S_PhoneVerify",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification6: {
        category: "KYC",
        action: "Skip Verify",
        name: "KYC_C_Skip",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification7: {
        category: "KYC",
        action: "Contact CS",
        name: "KYC_C_CS",
        path: "kyc",
        title: "KYC",
    },
    WithdrawalVerification8: {
        category: "",
        action: "",
        name: "",
        path: "withdrawal_verify_reminder_popup",
        title: "1st Withdrawal Verification",
    },
    WithdrawalVerification9: {
        category: "",
        action: "",
        name: "",
        path: "withdrawal_verify_exceed_popup",
        title: "Exceed Verification",
    },

    Withdrawal1: {
        category: "Withdrawal",
        action: "Contact CS",
        name: "Withdrawal_C_CS",
        path: "withdrawal",
        title: "Withdrawal",
    },
    Withdrawal2: {
        category: "Withdrawal",
        action: "Expand Balance",
        name: "Withdrawal_C_Balance",
        path: "withdrawal",
        title: "Withdrawal",
    },

    Deposit1: {
        category: "Deposit",
        action: "Contact CS",
        name: "Deposit_C_CS",
        path: "deposit",
        title: "Deposit",
    },
    Deposit2: {
        category: "Deposit",
        action: "", //
        name: "", //
        path: "deposit",
        title: "Deposit",
    },
    Deposit_LB1: {
        category: "Deposit",
        action: "",
        name: "",
        path: "deposit_local_bank",
        title: "Local Bank Deposit Page",
    },

    Welcome_Deposit1: {
        category: "Welcome_Deposit",
        action: "Agree Receive Call",
        name: "Welcome_Deposit_C_Agree",
        path: "welcome_deposit_popup",
        title: "Welcome Deposit Popup",
    },
    Welcome_Deposit2: {
        category: "Welcome_Deposit",
        action: "Disagree Receive Call",
        name: "Welcome_Deposit_C_Disagree",
        path: "welcome_deposit_popup",
        title: "Welcome Deposit Popup",
    },
    Welcome_Deposit3: {
        category: "Welcome_Deposit",
        action: "Go to Deposit",
        name: "Welcome_Deposit_C_Deposit",
        path: "welcome_deposit_popup",
        title: "Welcome Deposit Popup",
    },
    Welcome_Deposit4: {
        category: "Welcome_Deposit",
        action: "Skip Deposit",
        name: "Welcome_Deposit_C_Skip",
        path: "welcome_deposit_popup",
        title: "Welcome Deposit Popup",
    },

    Home: {
        category: "Home",
        action: "",
        name: "",
        path: "home",
        title: "Home",
    },
    NavBar: {
        category: "",
        action: "",
        name: "",
        path: "",
        title: "",
    },

    // SbSportsCN 埋点
    SbSportsCN_SearchSubmit: {
        category: "Game Nav",
        action: "Submit",
        name: "Search_SearchPage_SB2.0",
        path: "search",
        title: "Search",
    },
    SbSportsCN_SearchMatchLaunch: {
        category: "Game Nav",
        action: "Launch",
        name: "Match_Search_SB2.0",
        path: "search",
        title: "Search",
    },
    SbSportsCN_MainpageBanner: {
        category: "Match",
        action: "Launch",
        name: "Mainpage_banner",
        path: "home",
        title: "Home",
    },
    SbSportsCN_BetCartSinglebet: {
        category: "BetCart",
        action: "Click",
        name: "Singlebet_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_BetCartCombobet: {
        category: "BetCart",
        action: "Click",
        name: "Combobet_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_BetCartSystemCombo: {
        category: "BetCart",
        action: "Click",
        name: "SystemCombo_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_ContinueBetCart: {
        category: "Game Feature",
        action: "Click",
        name: "Continue_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_BackMainpage: {
        category: "BetCart",
        action: "Close",
        name: "Back_Mainpage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_MainPageBetcart: {
        category: "Betcart",
        action: "Launch",
        name: "MainPage_Betcart",
        path: "home",
        title: "Home",
    },
    SbSportsCN_OddsMainpageVertical: {
        category: "Odds",
        action: "Submit",
        name: "Odds_mainpage_vertical",
        path: "home",
        title: "Home",
    },
    SbSportsCN_OpenBetCartEUROPage: {
        category: "Betcart",
        action: "Launch",
        name: "Open_BetCart_EUROPage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_MatchPageBetcart: {
        category: "Betcart",
        action: "Launch",
        name: "MatchPage_Betcart",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_OddsMatchpage: {
        category: "Odds",
        action: "Submit",
        name: "Odds_matchpage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_MatchpageOdds: {
        category: "Odds_Filter",
        action: "Click",
        name: "Matchpage_Odds",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_MatchPageViewMore: {
        category: "Match",
        action: "Launch",
        name: "MatchPage_ViewMore",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_MatchMinimize: {
        category: "Match_Feature",
        action: "Click",
        name: "Match_minimize",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsCN_SettingBetAmount: {
        category: "System_Setting",
        action: "Submit",
        name: "Setting_BetAmount",
        path: "setting",
        title: "Setting",
    },
    SbSportsCN_HotMatches: {
        category: "Game Nav",
        action: "Click",
        name: "HotMatches_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsCN_SearchTopNav: {
        category: "Game Nav",
        action: "Launch",
        name: "Search_TopNav_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsCN_DepositNavSidenav: {
        category: "Deposit_Nav",
        action: "Launch",
        name: "Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_TransferNavSidenav: {
        category: "Transfer_Nav",
        action: "Launch",
        name: "Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_NotificationSidenav: {
        category: "Notification",
        action: "Launch",
        name: "Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_HotMatchesSidenav: {
        category: "HotMatches",
        action: "Launch",
        name: "Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_NotificationSettingSidenav: {
        category: "Notification_Setting",
        action: "Launch",
        name: "Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_DepositSidenav: {
        category: "Deposit Nav",
        action: "Click",
        name: "Deposit_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_NotificationSidenavClick: {
        category: "Account",
        action: "Click",
        name: "Notification_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_HotMatchesSidenavClick: {
        category: "Game Nav",
        action: "Click",
        name: "HotMatches_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_VerticalDisplaySidenav: {
        category: "Navigation",
        action: "Click",
        name: "VerticalDisplay_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_HorizontalDisplaySidenav: {
        category: "Navigation",
        action: "Click",
        name: "HorizontalDisplay_Sidenav_ SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_SettingSidenav: {
        category: "Account",
        action: "Click",
        name: "Setting_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_NotificationSettingSidenavClick: {
        category: "Account",
        action: "Click",
        name: "NotificationSetting_Sidenav_ SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_BettingRulesSidenav: {
        category: "Navigation",
        action: "Click",
        name: "BettingRules_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_OddsTutorialSidenav: {
        category: "Navigation",
        action: "Click",
        name: "OddsTutorial_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_BetTutorialSidenav: {
        category: "Navigation",
        action: "Click",
        name: "BetTutorial_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_BackMainSiteSidenav: {
        category: "Navigation",
        action: "Click",
        name: "Back_MainSite_SB2.0_Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsCN_LiveChatBetRecord: {
        category: "CS",
        action: "Launch",
        name: "LiveChat_BetRecord_SB2.0",
        path: "bet_record",
        title: "Bet Record",
    },
    SbSportsCN_ClearBetCartEUROPage: {
        category: "Game Feature",
        action: "Click",
        name: "Clear_BetCart_EUROPage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_ClearBetcart: {
        category: "Game Feature",
        action: "Click",
        name: "ClearBetcart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_PlacebetEUROPage: {
        category: "Game",
        action: "Submit",
        name: "Placebet_EUROPage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_Placebet: {
        category: "Game",
        action: "Submit",
        name: "Placebet_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_ClearBetcartBack: {
        category: "BetCart",
        action: "Back",
        name: "ClearBetcart",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsCN_OddsMainpageHorizontal: {
        category: "Odds",
        action: "Submit",
        name: "Odds_mainpage_horizontal",
        path: "home",
        title: "Home",
    },
    SbSportsCN_BetcartMainPage: {
        category: "Game Nav",
        action: "Click",
        name: "Betcart_MainPage_SB2.0",
        path: "home",
        title: "Home",
    },

    // SbSportsVN 埋点
    SbSportsVN_SearchSubmit: {
        category: "Game Nav",
        action: "Submit",
        name: "Search_SearchPage_SB2.0",
        path: "search",
        title: "Search",
    },
    SbSportsVN_SearchMatchLaunch: {
        category: "Game Nav",
        action: "Launch",
        name: "Match_Search_SB2.0",
        path: "search",
        title: "Search",
    },
    SbSportsVN_MainpageBanner: {
        category: "Match",
        action: "Launch",
        name: "Mainpage_banner",
        path: "home",
        title: "Home",
    },
    SbSportsVN_SingleBetBetCart: {
        category: "Game Feature",
        action: "Click",
        name: "SingleBet_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_ComboBetBetCart: {
        category: "Game Feature",
        action: "Click",
        name: "ComboBet_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_SystemComboBetCart: {
        category: "Game Feature",
        action: "Click",
        name: "SystemCombo_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_ContinueBetCart: {
        category: "Game Feature",
        action: "Click",
        name: "Continue_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_BackMainpage: {
        category: "BetCart",
        action: "Close",
        name: "Back_Mainpage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_MatchpageOdds: {
        category: "Odds_Filter",
        action: "Click",
        name: "Matchpage_Odds",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_ViewMoreMatchPage: {
        category: "Game Nav",
        action: "Click",
        name: "ViewMore_MatchPage_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_HotMatches: {
        category: "Game Nav",
        action: "Click",
        name: "HotMatches_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_DepositSivenav: {
        category: "Deposit_Nav",
        action: "Click",
        name: "Deposit_Sivenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_NotificationSidenav: {
        category: "Account",
        action: "Click",
        name: "Notification_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_SettingSidenav: {
        category: "Account",
        action: "Click",
        name: "Setting_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_BettingRulesSidenav: {
        category: "Navigation",
        action: "Click",
        name: "BettingRules_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_MainPageOdds: {
        category: "Odds_Filter",
        action: "Click",
        name: "MainPage_odds",
        path: "home",
        title: "Home",
    },
    SbSportsVN_BetRecordIM: {
        category: "Account",
        action: "View",
        name: "BetRecord_IM_SB2.0",
        path: "bet_record",
        title: "Bet Record",
    },
    SbSportsVN_BetrecordBTi: {
        category: "Account",
        action: "View",
        name: "Betrecord_BTi_SB2.0",
        path: "bet_record",
        title: "Bet Record",
    },
    SbSportsVN_BetrecordOW: {
        category: "Account",
        action: "View",
        name: "Betrecord_OW_SB2.0",
        path: "bet_record",
        title: "Bet Record",
    },
    SbSportsVN_BetcartMainPage: {
        category: "Game Nav",
        action: "Click",
        name: "Betcart_MainPage_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_BetcartMatchPage: {
        category: "Game Nav",
        action: "Click",
        name: "Betcart_MatchPage_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_OddsMainpageVertical: {
        category: "Odds",
        action: "Submit",
        name: "Odds_mainpage_vertical",
        path: "home",
        title: "Home",
    },
    SbSportsVN_LiveInsightsMatchPage: {
        category: "Match_Feature",
        action: "View",
        name: "LiveInsights_MatchPage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_GameTimelineMatchPage: {
        category: "Match_Feature",
        action: "View",
        name: "GameTimeline_MatchPage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_LineUpMatchPage: {
        category: "Match_Feature",
        action: "View",
        name: "LineUp_MatchPage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_PregameInsightsMatchPage: {
        category: "Match_Feature",
        action: "View",
        name: "PregameInsights_MatchPage",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_MinimizeMatchFeature: {
        category: "Game Feature",
        action: "Click",
        name: "Minimize_MatchFeature_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_LivestreamMatchFeature: {
        category: "Game Feature",
        action: "View",
        name: "Livestream_MatchFeature_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_AnimationMatchFeature: {
        category: "Game Feature",
        action: "View",
        name: "Animation_MatchFeature_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_StatsMatchFeature: {
        category: "Game Feature",
        action: "View",
        name: "Stats_MatchFeature_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_ViewOddsLandscapeMatchFeature: {
        category: "Game Feature",
        action: "View",
        name: "ViewOdds_Landscape_MatchFeature_SB2.0",
        path: "betting_detail",
        title: "Betting Detail",
    },
    SbSportsVN_SettingBetAmount: {
        category: "Game Feature",
        action: "Submit",
        name: "Setting_BetAmount_SB2.0",
        path: "setting",
        title: "Setting",
    },
    SbSportsVN_IMTopNav: {
        category: "Game Nav",
        action: "View",
        name: "IM_TopNav_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_BTiTopNav: {
        category: "Game Nav",
        action: "View",
        name: "BTi_TopNav_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_OWTopNav: {
        category: "Game Nav",
        action: "View",
        name: "OW_TopNav_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_SearchTopNav: {
        category: "Game Nav",
        action: "Launch",
        name: "Search_TopNav_SB2.0",
        path: "home",
        title: "Home",
    },
    SbSportsVN_ClearBetCartEUROPage: {
        category: "Game Feature",
        action: "Click",
        name: "Clear_BetCart_EUROPage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_ClearBetCart: {
        category: "Game Feature",
        action: "Submit",
        name: "Clear_BetCart_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_PlacebetEUROPage: {
        category: "Game",
        action: "Submit",
        name: "Placebet_EUROPage_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_Placebet: {
        category: "Game",
        action: "Submit",
        name: "Placebet_SB2.0",
        path: "bet_cart",
        title: "Bet Cart",
    },
    SbSportsVN_OddsMainpageHorizontal: {
        category: "Odds",
        action: "Submit",
        name: "Odds_mainpage_horizontal",
        path: "home",
        title: "Home",
    },
    SbSportsVN_LoginSidenav: {
        category: "Navigation",
        action: "Click",
        name: "Login_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_RegisterSidenav: {
        category: "Registration Nav",
        action: "Click",
        name: "Register_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_HotMatchesSidenav: {
        category: "Game Nav",
        action: "Click",
        name: "HotMatches_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_VerticalDisplaySidenav: {
        category: "Navigation",
        action: "Click",
        name: "VerticalDisplay_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_HorizontalDisplaySidenav: {
        category: "Navigation",
        action: "Click",
        name: "HorizontalDisplay_Sidenav_ SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_OddsTutorialSidenav: {
        category: "Navigation",
        action: "Click",
        name: "OddsTutorial_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_BetTutorialSidenav: {
        category: "Navigation",
        action: "Click",
        name: "BetTutorial_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_OWSportVendorSidenav: {
        category: "Game",
        action: "Launch",
        name: "OWSportVendor_Sidenav_SB2.0",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_BackMainSiteSidenav: {
        category: "Navigation",
        action: "Click",
        name: "Back_MainSite_SB2.0_Sidenav",
        path: "drawer",
        title: "Drawer",
    },
    SbSportsVN_NotificationSettingSidenav: {
        category: "Account",
        action: "Click",
        name: "NotificationSetting_Sidenav_ SB2.0",
        path: "drawer",
        title: "Drawer",
    },
};

export const LiveChatPagePiwik = type => {
    switch (type) {
        case "Newaddress":
            PiwikEventDataHandle("ShipmentFormAccount2");
            break;
        case "bankcard":
            PiwikEventDataHandle("AccountManagement4");
            break;
        case "Recordes":
            PiwikEventDataHandle("TransactionRecord1");
            break;
        case "withdrawal":
            PiwikEventDataHandle("Withdrawal1");
            break;
        case "Lottery":
            PiwikEventDataHandle({
                category: "LaborDay2024",
                action: "Contact CS",
                name: "LaborDay2024_C_CS",
            });
            break;
        case "LotteryEuro":
            PiwikEventDataHandle({
                category: "Euro2024",
                action: "Contact CS",
                name: "Euro2024_C_CS",
                path: "euro2024",
                title: "Euro Event 2024",
            });
            break;
        case "Notification":
            PiwikEventDataHandle("Notification3");
            break;
        case "LockedBalance":
            PiwikEventDataHandle("OneWallet9");
            break;
        case "RewardPage":
            PiwikEventDataHandle("RewardPage3");
            break;
        case "PromotionsAddress":
            PiwikEventDataHandle("ShipmentFormAccount2");
            break;
        case "PromotionsDetail":
            PiwikEventDataHandle("PromoMainPage6");
            break;
    }
};

function PiwikEventNew(data, fromCentralPayment = false) {
    //console.log(data, 123456);
    try {
        let { category = "", action = "", name = "", path = "", title = "", isSuccess = "", customProperties = {} } = data;
        // 根據平台設置不同的title值
        const isAndroid = Platform.OS === "android";

        const trackScreenOptions = {
            // Android上避免使用'page'作為title
            title: isAndroid ? "" : "page",
            customDimensions: { 1: "some custom dimension value" },
        };

        if (typeof customProperties === "object" && Array.isArray(Object.keys(customProperties)) && Object.keys(customProperties).length) {
            let screenCustomVariables = Object.keys(customProperties).reduce((obj, v, i) => {
                obj[i + 1] = {
                    name: !fromCentralPayment ? v : String(customProperties[v]?.name),
                    value: !fromCentralPayment ? String(customProperties[v]) : String(customProperties[v]?.value),
                };
                return obj;
            }, {});
            trackScreenOptions.screenCustomVariables = screenCustomVariables;
        }

        // 針對Android平台做特殊處理
        if (isAndroid) {
            // 如果path已經包含page，則不需要在Android上特別處理
            if (!path.includes("/page")) {
                // 確保path不會重複添加'/page'
                PiwikProSdk.trackScreen(path, trackScreenOptions);
            } else {
                // 如果已包含'/page'，直接使用原始path
                PiwikProSdk.trackScreen(path, trackScreenOptions);
            }
        } else {
            // iOS平台使用原始設置
            PiwikProSdk.trackScreen(path, trackScreenOptions);
        }

        // 其餘代碼保持不變
        if (category && action && name) {
            const trackCustomEventOptions = {
                name: name,
                path: path,
                customDimensions: { 1: "" },
                visitCustomVariables: {
                    4: { name: "AppRealVersion", value: window.Rb88Version },
                },
            };
            if (Platform.OS === "ios") {
                if (isSuccess == 2) {
                    trackCustomEventOptions.value = String(2);
                }
                if (isSuccess == 1) {
                    trackCustomEventOptions.value = String(1);
                }
            } else {
                if (isSuccess == 2) {
                    trackCustomEventOptions.value = isSuccess;
                }
                if (isSuccess == 1) {
                    trackCustomEventOptions.value = isSuccess;
                }
            }

            PiwikProSdk.trackCustomEvent(category, action, trackCustomEventOptions);
        }
    } catch (error) {

    }
}

export function PiwikEventDataHandle(data, fromCentralPayment = false) {
    if (typeof data === "string") {
        PiwikEventData[data] && PiwikEventNew(PiwikEventData[data], fromCentralPayment);
        return;
    }
    if (typeof data === "object") {
        let { eventTitle, customProperties = {}, isSuccess, category, action, name, title, path } = data;
        let tempData1 = { category, action, name, title, path };
        let tempObj = {};
        for (let i in tempData1) {
            if (tempData1[i]) {
                tempObj[i] = tempData1[i];
            }
        }

        let tempPiwikEventData = {
            ...Object.assign(eventTitle && PiwikEventData[eventTitle] ? PiwikEventData[eventTitle] : {}, tempObj),
            customProperties,
            ...{ isSuccess },
        };

        PiwikEventNew(tempPiwikEventData, fromCentralPayment);
    }
}

export const PiwikInit = async () => {
    try {
        await PiwikProSdk?.destroy?.();
    } catch (f) {}
    //初始化piwik
    const PiwikKey = {
        CN: {
            ST: "9bb81c87-ba4f-4ea1-ae3e-c9e3d4705192",
            LIVE: "2d7472ee-2c34-4426-b638-c73dae1addca"
        },
        TH: {
            ST: "d99ca597-8fbd-4fdd-bc70-2a293f757529",
            LIVE: "10021a77-552b-410e-8017-83de3e347b1b"
        },
        VN: {
            ST: "e6f489f5-cb1f-4fe9-ac60-95bd64083d90",
            LIVE: "864e9d5e-0f60-4cee-acc7-450c33019b71"
        },
    };
    let temp = PiwikKey[window.LANGUAGE];
    const piwikKey = window.isStaging == "ST" ? temp.ST : temp.LIVE;

    await PiwikProSdk.init("https://analytics.ravelz.com", piwikKey).then(r => {
        PiwikProSdk.setAnonymizationState(false);
    }).catch(error => {

    });
};


export const PiwikMemberCode = data => {
    if (!data) return;
    try {
        PiwikProSdk?.setUserId(data);
        PiwikProSdk?.isAnonymizationOn()
            .then(res => {
                if (res) {
                    PiwikProSdk?.setAnonymizationState(false);
                    PiwikProSdk?.setUserId(data);
                }
            })
            .catch(() => {});
    } catch (error) {

    }
};

