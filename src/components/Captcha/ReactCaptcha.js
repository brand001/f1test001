import React from "react";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";

import Captcha from "./Captcha";
class ReactCaptcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnabled: false,
            attempts: 0,
            apiUrl: "",
            challengeUuid: "",
            CaptchaChart: "",
        };
    }

    componentDidMount() {
        this.props.getCaptchaInfo(this);
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.captchaVisible !== this.props.captchaVisible && this.props.captchaVisible === true) {
    //         this.getRequestCaptchaChallengeId(true);
    //     }
    // }

    getCaptchaInfo(name) {
        fetchRequest(window.ApiPort.CaptchaInfo + `username=${name}&`, "GET")
            .then((data) => {
                if (data.isSuccess) {
                    this.setState({
                        attempts: data.result.attempts,
                        apiUrl: data.result.serviceUrl,
                        isEnabled: data.result.isEnabled //是否开启了 滑动验证
                    }, () => {
                        if (data.result.isEnabled) {
                            this.getRequestCaptchaChallengeId(false);
                        } else {
                            this.props.captchaIsDisabled && this.props.captchaIsDisabled();
                        }
                    });
                }
            })
            .catch((error) => {
                // CXF1-7930 如果api return error，show captcha and pass challengeUuid
                // Toasts.fail("网络错误，请重试", 3);
                console.log(error);
                this.getRequestCaptchaChallengeId(true);
            });
    }

    // 獲取 Captcha id and api
    getRequestCaptchaChallengeId = (isShow = false) => {
        const ParamData = {
            captchaType: "SLIDE",
            applicationLanguage: window.DefaultConfig.applicationLanguage,
            siteId: Platform.OS == "ios" ? 40 : 39,
        };

        isShow && Toasts.loading(translate("加载中,请稍候..."), 10);
        fetchRequest(window.ApiPort.CaptchaChallengeId, "POST", ParamData)
            .then(res => {
                if (res.isSuccess) {
                    Toasts.removeAll();
                    this.setState(
                        {
                            challengeUuid: res.result.challengeUuid,
                            apiUrl: res.result.apiURL,
                        },
                        () => {
                            this.getCaptchaChart(isShow);
                        },
                    );
                }
            })
            .catch(e => {
                Toasts.fail(translate("网络错误，请重试"), 3);
            });
    };

    // 獲取 captcha 圖片
    getCaptchaChart = (isShow = false) => {
        const { challengeUuid, apiUrl } = this.state;

        if (!apiUrl || !challengeUuid) return;
        const fetchParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicationLanguage: window.DefaultConfig.applicationLanguage,
                device: {
                    ip: "",
                    language: window.DefaultConfig.applicationLanguage,
                    domain: SBTDomain,
                    userAgent: Platform.OS,
                    udid: uuidv4(),
                },
                captchaType: "SLIDE",
            }),
        };

        fetch(`${apiUrl}/api/v1.0/challenge/${challengeUuid}`, fetchParams)
            .then(res => res.json())
            .then(res => {
                if (["10001", "10002", "11001"].includes(res.code && res.code.toString())) {
                    if (isShow) {
                        this.setState({ captchaVisible: true });
                    }
                    this.setState({ CaptchaChart: res }, () => {
                        window.cropImage && window.cropImage();
                    });
                } else {
                    this.getRequestCaptchaChallengeId();
                }
            })
            .catch(e => {
                Toasts.fail(translate("网络错误，请重试"), 3);
            });
    };

    reloadCaptchaChart() {
        // 刷新 captcha 圖片
        this.getCaptchaChart();
    }

    render() {
        let { isEnabled, CaptchaChart, apiUrl } = this.state;
        return (
            CaptchaChart &&
            <Captcha
                apiUrl={apiUrl}
                captchaVisible={this.props.captchaVisible} // 是否顯示
                closePopup={this.props.closePopup} // 關閉彈窗
                CaptchaChart={this.state.CaptchaChart} // 滑塊圖片數據
                reloadCaptcha={() => this.reloadCaptchaChart()} // 重新載入
                onMatch={this.props.onMatch}
            />

        );
    }
}

export default ReactCaptcha;
