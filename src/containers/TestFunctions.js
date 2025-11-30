import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { LogoutUtil } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { toggleCentralPayment, ACTION_ForceToggleCentralPayment } from "$LIB/redux/actions/CentralPaymentAction";
import IconList from "$Components/icons/IconList";
import { Toasts } from "$Toasts";

const { width, height } = Dimensions.get("window");

class TestFunctions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Bobf_domian_branch: "default",
            Bffc_domian_branch: "default",
            Str_domian_branch: "default",
        };
    }

    goHome() {
        LogoutUtil({
            callBack: () => {
                Actions.jump("Home");
            }
        });
    }

    //  https://gateway-idcf5vn.f238732oi.com/api/Vendor/NotificationSetting/SBS?api-version=3.0&brand=FUN88&siteId=46&Platform=SB2IOS
    //  https://gateway-idcf5vn.f817292er.com/api/Vendor/NotificationSetting/SBS?api-version=3.0&brand=FUN88&siteId=46&Platform=SB2IOS

    // https://gatewayvn-scf1.f817292er.com/api/Games/Providers/MaintenanceStatus?providerCode=SBT&api-version=8.0&Platform=ios
    async changeDomain(key, lang) {
        try {
            this.goHome();
            switch (key) {
                case "SL":
                    window.isStaging = "SL";
                    window.common_url = "https://gateway-idcslf5vn.gamealiyun.com";
                    window.SBTDomain = "https://p5sl.fun88.biz";
                    window.bffsc_url = "https://gatewayvnsl-scf1.fun88.biz";
                    window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
                    window.Strapi_Domain = "https://cache.p5sl.fun88.biz";
                    break;
                case "Prod":
                    window.isStaging = "LIVE";
                    if (typeof window.ChangeLanguag === "function" && lang) {
                        await window.ChangeLanguag(lang);
                    }
                    break;
                case "version":
                    if (typeof window.CheckUptateGlobe === "function") {
                        window.CheckUptateGlobe();
                    }
                    break;
                case "storage":
                    StorageUtil.removeAll();
                    Toasts.success("已清除");
                    break;
                default:
                    break;
            }
            this.reloadPage();
        } catch (error) {
            console.error("Error in changeDomain:", error);
        }
    }

    changeStBobfDomain(v) {
        try {
            this.setState({
                Bobf_domian_branch: v,
            });
            window.isStaging = "ST";
            const lang = window.LANGUAGE?.toLocaleLowerCase() || "vn";
            window.common_url = `https://gateway-idcstgf1p5${lang}${v === "default" ? "" : v}.gamealiyun.com`;
            this.reloadPage();
            alert(`change Bobf_domian to ${v === "default" ? "default" : v}`);
        } catch (error) {
            console.error("Error in changeStBobfDomain:", error);
        }
    }

    changeStBffcDomain(v) {
        try {
            this.setState({
                Bffc_domian_branch: v,
            });
            window.isStaging = "ST";
            const langType = window.DefaultConfig?.languageType?.toLocaleLowerCase() || "vn";
            window.bffsc_url = `https://febff-api-staging-${langType}${v === "default" ? "" : "-instance" + `0${v}`}.fun88.biz`;
            this.reloadPage();
            alert(`change Bffc_domain to ${v === "default" ? "default" : v}`);
        } catch (error) {
            console.error("Error in changeStBffcDomain:", error);
        }
    }

    changeStStrDomain(v) {
        try {
            this.setState({
                Str_domian_branch: v,
            });
            window.isStaging = "ST";
            window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
            window.Strapi_Domain = `https://cache.p5stag${v === "default" ? "" : `0${v}`}.fun88.biz`;
            alert(`change Str_domain to ${v === "default" ? "default" : v}`);
        } catch (error) {
            console.error("Error in changeStStrDomain:", error);
        }
    }

    reloadPage() {
        try {
            this.changeSBdomain();
        } catch (error) {
            console.error("Error in reloadPage:", error);
        }
    }

    changeSBdomain() {
        try {
            const commonConfig = {
                SportImageUrl: "https://simg.leyouxi211.com",
                CacheApi: "https://sapivn.leyouxi211.com",
                SmartCoachApi: "https://api.live.smartcoach.club",
                IMAccessCode: "2cc03acc80b3693c",
                IMApi: "https://gatewayim.bbentropy.com/api/mobile/",
                EuroCup2021FirstEventTime: "2021-06-11T15:00:00.0000000-04:00",
                EuroCup2021FinalEventTime: "2021-07-11T15:00:00.0000000-04:00",
                WorldCup_Domain: "https://cache.funlove88.com",
                BTIAuthApiProxy: "https://leyouxi211.com/api/sportsdata/",
                BTIApi: "https://prod213.1x2aaa.com/api/sportsdata/",
                BTIRougeApi: "https://prod213.1x2aaa.com/api/rogue/",
                BTIAnnouncements: "https://gatewayim.bbentropy.com/json_announcements.aspx",
                SABAAuthApi: "https://sabaauth.leyouxi211.com/",
                SABAApi: "https://api.wx7777.com/"
            };

            Object.entries(commonConfig).forEach(([key, value]) => {
                window[key] = value;
            });

            if (typeof window.EuroCup2021CountDownEndTime !== "undefined") {
                window.EuroCup2021CountDownEndTime = "2021-06-12T00:00:00.0000000+08:00";
            }
        } catch (error) {
            console.error("Error in changeSBdomain:", error);
        }
    }

    render() {
        const { Bobf_domian_branch, Bffc_domian_branch, Str_domian_branch } = this.state;
        const { useCentralPayment, forceToggleCentralPayment } = this.props.centralPayment;

        const isDevOrStaging = window.isStaging === "ST" || window.isStaging === "SL" || __DEV__;

        if (!isDevOrStaging) return null;

        return (
            <View style={styles.container}>
                <Text style={{ color: "red", fontWeight: "bold", marginBottom: 20 }}>Piwik does not support title, but supports path</Text>
                <Text style={{ color: "red", fontWeight: "bold", marginBottom: 20 }}>When testing piwik on ios, after switching the language, you need to restart the app. This is not required on Android.</Text>
                {/* 切換 CentralPayment 開關 */}
                <Touch style={[styles.managerLists]} onPress={() => this.props.toggleCentralPayment(!useCentralPayment)}>
                    <Text style={{ fontWeight: "bold" }}>Current CentralPayment switch  <Text style={{ color: "red", }}>{useCentralPayment ? "on" : "off"}</Text></Text>
                    <View style={[styles.managerListsTouch, { backgroundColor: "transparent" }]} >
                        <View style={styles.managerListsLeft}>
                            {/* <Image resizeMode='stretch' source={managerImg8} style={styles.managerListsImg}></Image> */}
                            <Text style={styles.ListsText}>切换到 CentralPayment 开关</Text>
                        </View>
                        {/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
                    </View>
                </Touch>

                {/* 強制切換 CentralPayment 開關 */}
                {/* <Touch style={[styles.managerLists]} onPress={() => this.props.centralPayment_SetForceUseCentralPayment(!forceToggleCentralPayment)}>
                    <Text style={{ fontWeight: "bold" }}>Current CentralPayment switch  <Text style={{ color: "red", }}>{forceToggleCentralPayment ? "on" : "off"}</Text></Text>
                    <View style={[styles.managerListsTouch, { backgroundColor: "transparent" }]} >
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>強制切換 CentralPayment 开关</Text>
                        </View>
                    </View>
                </Touch> */}

                <View style={styles.managerLists}>
                    <Touch style={styles.managerListsTouch} onPress={() => this.changeDomain("storage")}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>Clear the app cache 清除缓存</Text>
                        </View>
                    </Touch>
                </View>

                <View style={styles.managerListss}>
                    <Text style={styles.environmentText}>Current environment {window.isStaging}</Text>
                </View>

                <View style={styles.managerListss}>
                    <Text style={styles.ListsText}>Bobf_domian: {Bobf_domian_branch} branch</Text>
                    <Text style={styles.domainText}>{window.common_url}</Text>
                </View>

                <View style={styles.managerListss}>
                    <Text style={styles.ListsText}>Bffc_domain: {Bffc_domian_branch} branch</Text>
                    <Text style={styles.domainText}>{window.bffsc_url}</Text>
                </View>

                <View style={styles.managerListss}>
                    <Text style={styles.ListsText}>Str_domain: {Str_domian_branch} branch</Text>
                    <Text style={styles.domainText}>{window.Strapi_Domain}</Text>
                </View>

                <View style={styles.separator} />

                {["CN", "TH", "VN"].map((v, i) => (
                    <Touch
                        key={i}
                        style={styles.managerListsTouch}
                        onPress={() => {
                            window.isStaging = "ST";
                            if (typeof window.ChangeLanguag === "function") {
                                window.ChangeLanguag(v);
                            }
                        }}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change ST Language {v}</Text>
                        </View>
                    </Touch>
                ))}

                {["CN", "TH", "VN"].map((v, i) => (
                    <Touch
                        key={i}
                        style={[styles.managerListsTouch, { backgroundColor: "pink" }]}
                        onPress={() => {
                            window.isStaging = "SL";
                            if (typeof window.ChangeLanguag === "function") {
                                window.ChangeLanguag(v);
                            }
                        }}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change SL Language {v}</Text>
                        </View>
                    </Touch>
                ))}

                {["CN", "TH", "VN"].map((v, i) => (
                    <Touch
                        key={i}
                        style={[styles.managerListsTouch, styles.liveLanguageTouch]}
                        onPress={() => {
                            window.isStaging = "LIVE";
                            if (typeof window.ChangeLanguag === "function") {
                                window.ChangeLanguag(v);
                            }
                        }}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change LIVE Language {v} For test SB2.0</Text>
                        </View>
                    </Touch>
                ))}

                <View style={styles.separator} />

                {["default", "01", "02", "03", "04", "05"].map((v, i) => (
                    <Touch
                        key={i}
                        style={[styles.managerListsTouch, styles.bobfDomainTouch]}
                        onPress={() => this.changeStBobfDomain(v)}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change to ST Bobf_domian {v}</Text>
                        </View>
                    </Touch>
                ))}

                <View style={styles.separator} />

                {["default", "1", "2", "3", "4", "5", "6", "7", "8"].map((v, i) => (
                    <Touch
                        key={i}
                        style={[styles.managerListsTouch, styles.bffcDomainTouch]}
                        onPress={() => this.changeStBffcDomain(v)}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change to ST Bffc_domain {v}</Text>
                        </View>
                    </Touch>
                ))}

                <View style={styles.separator} />

                {["default", "1", "2", "3", "4", "5", "6", "7", "8"].map((v, i) => (
                    <Touch
                        key={i}
                        style={[styles.managerListsTouch, styles.strDomainTouch]}
                        onPress={() => this.changeStStrDomain(v)}>
                        <View style={styles.managerListsLeft}>
                            <Text style={styles.ListsText}>change to ST Str_domain {v}</Text>
                        </View>
                    </Touch>
                ))}

                <IconList></IconList>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    centralPayment: state.centralPayment,
    useCentralPayment: state.centralPayment.useCentralPayment,
});
const mapDispatchToProps = (dispatch) => ({
    toggleCentralPayment: (val) => dispatch(toggleCentralPayment(val)),
    centralPayment_SetForceUseCentralPayment: (pageType = "") => dispatch(ACTION_ForceToggleCentralPayment(pageType)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TestFunctions);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: 16,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
    managerLists: {},
    ListsText: {
        color: "#000",
    },
    environmentText: {
        color: "red",
        fontWeight: "bold"
    },
    domainText: {
        color: "red",
        fontWeight: "bold"
    },
    separator: {
        height: 10,
        backgroundColor: "#00A6FF"
    },
    managerListss: {
        marginBottom: 15,
    },
    managerListsTouch: {
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
        backgroundColor: "red"
    },
    liveLanguageTouch: {
        backgroundColor: "yellow"
    },
    bobfDomainTouch: {
        backgroundColor: "green"
    },
    bffcDomainTouch: {
        backgroundColor: "pink"
    },
    strDomainTouch: {
        backgroundColor: "orange"
    },
    managerListsTouchLast: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    managerListsLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
});
