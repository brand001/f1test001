import ImageEditor from "@react-native-community/image-editor";
import moment from "moment";
import React, { Component } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, PanResponder, Platform, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
import { v4 as uuidv4 } from "uuid";
import { CloseIcon, CheckedIcon, RefreshIcon, InforIcon } from "$Components/icons";

import { translate } from "@/locales/translate";
import { Toasts } from "$Toasts";
import Color from "$Components/Color";
import { ImagesUrl } from "@/images/index";
import { RowCenterCenter, RowCenterBetween, RowCenterStart, ColumnCenterCenter } from "$Components/CustomView";

const { width, height } = Dimensions.get("window");
const cropWidth = 30; // 大圖切割寬度
const cropHeight = 75; // 大圖切割高度
const smallWidth = 60; // 小圖切割寬度
const smallHeight = 60; // 小圖切割高度

let ReladBa = true; // 防止惡意刷新點擊登入

export default class Captcha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 0, // 小圖 位移 y
            left: 0, // 小圖 位移 x
            sortedImgArray: [], // 排序後的大圖
            showDescription: false, // 是否顯示完整提示
            CaptchaData: this.props.CaptchaChart,
            verificationText: "", // 驗證後的提示文字
            verificationResult: null, // 驗證後的狀態結果
            loading: false,
            touchStarted: "",
        };

        // 定时器引用
        this.reloadTimer = null;
        this.successTimer = null;
        this.loadingTimer = null;
        this.errorTimer = null;

        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) => true, // 單機手勢是否可以成爲響應者
            onStartShouldSetPanResponderCapture: (event, gestureState) => true, // 移動手勢是否可以成爲響應者
            onMoveShouldSetPanResponder: (event, gestureState) => true, // 攔截子組件的單擊手勢傳遞,是否攔截
            onMoveShouldSetPanResponderCapture: (event, gestureState) => true, // 攔截子組件的移動手勢傳遞,是否攔截
            onPanResponderGrant: (event, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                this.onStart(event, gestureState);
            },
            onPanResponderMove: (event, gestureState) => {
                // 移动操作, 最近一次的移动距离为gestureState.move{X,Y}
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
                this.onMove(event, gestureState);
            },
            onPanResponderRelease: (event, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                this.onEnd(event, gestureState);
            },
            onPanResponderTerminate: e => {
                // 另一個組件已經成爲了新的響應者，所以當前手勢將被取消
                // console.log('onPanResponderTerminate==>' + '由於某些原因(系統等)，所以當前手勢將被取消')
            },
        });
    }

    componentWillMount() {
        this._crop(); // 大圖 切圖
    }

    componentWillUnmount() {
        // 清除所有定时器
        this.clearAllTimers();
    }

    clearAllTimers() {
        if (this.reloadTimer) {
            clearTimeout(this.reloadTimer);
            this.reloadTimer = null;
        }
        if (this.successTimer) {
            clearTimeout(this.successTimer);
            this.successTimer = null;
        }
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        }
        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
            this.errorTimer = null;
        }
    }

    onStart(e, g) {
        const { left, top } = this.state;

        this._previousTop = top;
        this._previousLeft = left;

        this.setState({
            top: top,
            left: left,
            touchStarted: moment().utc().toISOString(), // 當前時間
        });
    }

    onMove(e, g) {
        let left = g.dx + this._previousLeft;
        let top = g.dy + this._previousTop;

        if (top < 0) {
            top = 0;
        }

        if (left < 0) {
            left = 0;
        }

        if (left + smallWidth > 300) {
            // 不可超過大圖寬度,
            left = 300 - smallWidth;
        }

        if (top + smallHeight > 150) {
            // 不可超過大圖高度,
            top = 150 - smallHeight;
        }

        this.setState({
            top,
            left,
        });
    }

    onEnd(e, g) {
        const { touchStarted, CaptchaData } = this.state;
        const { success } = CaptchaData.currentLocale;
        const { CaptchaChart, apiUrl } = this.props;
        const nowTime = moment().utc().toISOString(); // 當前時間
        const cost = new Date(nowTime).getTime() - new Date(touchStarted).getTime(); // 剩餘時間

        let left = g.dx + this._previousLeft;
        let top = g.dy + this._previousTop;

        if (top < 0) {
            top = 0;
        }

        if (left < 0) {
            left = 0;
        }

        if (left + smallWidth > 300) {
            // 不可超過大圖寬度,
            left = 300 - smallWidth;
        }

        if (top + smallHeight > 150) {
            // 不可超過大圖高度,
            top = 150 - smallHeight;
        }

        const fetchParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicationLanguage: window.DefaultConfig.applicationLanguage,
                challengeUuid: CaptchaChart.challengeUuid,
                activity: {
                    cost,
                    answers: {
                        x: left,
                        y: top,
                    },
                },
                device: {
                    ip: "",
                    language: window.DefaultConfig.applicationLanguage,
                    domain: SBTDomain,
                    userAgent: Platform.OS,
                    udid: uuidv4(),
                },
            }),
        };
        // 驗證
        fetch(`${apiUrl}/api/v1.0/judgement`, fetchParams)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    // alert(`x:${left},\ny:${top},\ncost:${cost},\nAnswer:\nX:${CaptchaChart.answers.x},\nY:${CaptchaChart.answers.y}\nResult:${res.code}`)
                    if (![10001, 10002, 11001].includes(res.code)) {
                        this.setState(
                            {
                                verificationResult: false, // 驗證後的狀態結果
                                verificationText: translate("验证失败，请重新尝试"), // 驗證後的提示文字
                                top: 0,
                                left: 0,
                            },
                            () => {
                                this._previousTop = top;
                                this._previousLeft = left;

                                if ([63403, 63002].includes(res.code)) {
                                    this.reloadTimer = setTimeout(() => {
                                        this.reloadCaptcha();
                                    }, 1500);
                                }
                            },
                        );
                    } else {
                        this.setState(
                            {
                                verificationResult: true, // 驗證後的狀態結果
                                verificationText: success, // 驗證後的提示文字
                                top: 0,
                                left: 0,
                            },
                            () => {
                                this._previousTop = top;
                                this._previousLeft = left;
                                this.successTimer = setTimeout(() => {
                                    this.setState({
                                        verificationResult: null, // 驗證後的狀態結果
                                        verificationText: "", // 驗證後的提示文字
                                    });
                                    this.clearAllTimers(); // 清除所有定时器
                                    this.props.closePopup();
                                    this.props.onMatch();
                                }, 2000);
                            },
                        );
                    }
                }
            })
            .catch(err => {
                Toasts.fail(translate("网络错误，请重试"), 3);
            });
    }

    _crop = () => {
        // 大圖 切圖
        const { CaptchaChart } = this.props;
        const { chartUri, shuffleMatrix } = CaptchaChart;
        const shuffleMatrixLength = shuffleMatrix.length;
        const ArrData = [];
        let counter = 0;

        if (CaptchaChart && chartUri && shuffleMatrixLength) {
            this.setState({ loading: true, sortedImgArray: [] });
            for (let i = 0; i < shuffleMatrixLength; i++) {
                try {
                    ImageEditor.cropImage(chartUri, {
                        offset: {
                            //  裁剪图片的起始位置，x和y为偏移坐标
                            x: i < 10 ? i * cropWidth : (i - 10) * cropWidth,
                            y: i < 10 ? 0 : 75,
                        },
                        size: {
                            // 裁剪图片的大小。就是按照宽高多少来裁剪
                            width: cropWidth,
                            height: cropHeight,
                        },
                        resizeMode: "contain",
                        displaySize: {
                            // 可选值，裁剪完后按照多大尺寸显示
                            width: cropWidth,
                            height: cropHeight,
                        },
                    }).then(Url => {
                        ++counter;
                        let obj = { imgUri: Url, position: shuffleMatrix[i] }; // shuffleMatrix
                        ArrData.push(obj);
                        if (counter == shuffleMatrixLength) {
                            ArrData.sort((a, b) => {
                                return a["position"] - b["position"];
                            });

                            this.setState({ sortedImgArray: ArrData }, () => {
                                this.loadingTimer = setTimeout(() => {
                                    this.setState({ loading: false });
                                }, 1000);
                            });
                        }
                    }).catch(error => {
                        console.log("ImageEditor.cropImage error:", error);
                        this.setState({ loading: false });
                    });
                } catch (error) {
                    console.log("ImageEditor.cropImage try-catch error:", error);
                    this.setState({ loading: false });
                }
            }
        }
    };

    preventReload() {
        //防惡意刷新
        if (ReladBa == false) {
            this.setState(preState => ({
                showErr: true,
            }));

            this.errorTimer = setTimeout(() => {
                ReladBa = true;
                this.setState(preState => ({
                    showErr: false,
                }));
            }, 3000);
            return;
        }

        ReladBa = false;
        this.reloadCaptcha(); // Captcha 開關
    }

    reloadCaptcha() {
        /**
         * 刷新圖形驗證
         * 清空排序過的Arr
         */
        this.setState(
            {
                sortedImgArray: [],
                left: 0,
                top: 0,
                loading: true,
                verificationText: "", // 驗證後的提示文字
                verificationResult: null, // 驗證後的狀態結果
            },
            () => {
                this.props.reloadCaptcha();
            },
        );
    }

    getTitle() {
        // 獲取title
        const { info } = this.state.CaptchaData.currentLocale;
        return <Text style={{ color: "#222", fontSize: 12, width: "85%" }}>{info}</Text>;
    }

    getProvideText() {
        // 獲取提供者
        const { provide } = this.state.CaptchaData.currentLocale;
        return (
            <Text
                style={{
                    color: "#AAAAAA",
                    fontSize: 12,
                    textAlign: "right",
                    width: 240,
                    flexWrap: "wrap"
                }}>
                {provide}
            </Text>
        );
    }

    getDescription() {
        const { CaptchaData } = this.state;
        const { description } = CaptchaData.currentLocale;

        return (
            <View
                style={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,.7)",
                    padding: 20,
                    width: 300,
                    height: 150,
                }}>
                <CloseIcon
                    onPress={() => {
                        this.setState({ showDescription: false });
                    }}
                    wrapStyle={{
                        position: "absolute",
                        right: 5,
                        top: 5,
                    }}
                    width={20}
                    height={20}
                    fill={Color.white} />


                <ColumnCenterCenter
                    style={{
                        flex: 1,
                    }}>
                    <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20 }}>{description}</Text>
                </ColumnCenterCenter>
            </View>
        );
    }

    render() {
        const { sortedImgArray, top, left, showDescription, verificationText, verificationResult, loading, showErr } = this.state;
        const { CaptchaChart, captchaVisible, closePopup } = this.props;

        // 全局重新剪輯圖片
        window.cropImage = () => {
            this._crop();
        };

        return (
            <Modal animationType="none" transparent={true} visible={captchaVisible}>
                <ColumnCenterCenter style={styles.modalActive}>
                    {CaptchaChart &&
                        <ColumnCenterCenter style={[styles.captchaContainer, { backgroundColor: "#FFF" }]}>
                            <RowCenterBetween style={{ width: 300, }}>
                                {/* title */}
                                {this.getTitle()}
                                {/* 關閉彈窗 */}
                                <CloseIcon
                                    onPress={() => {
                                        this.clearAllTimers(); // 清除所有定时器
                                        closePopup();
                                    }}
                                    width={22}
                                    height={22}
                                    fill={"#5F5D5E"} />
                            </RowCenterBetween>

                            <View>
                                {CaptchaChart.message ?  // 錯誤信息
                                    <ColumnCenterCenter
                                        style={{
                                            height: 200,
                                        }}>
                                        {/* Error Icon */}
                                        <Image
                                            style={{
                                                width: 20,
                                                height: 20,
                                                marginVertical: 10,
                                            }}
                                            source={ImagesUrl.captchaIconInternetError}
                                        />
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                lineHeight: 20,
                                            }}>
                                            {CaptchaChart && CaptchaChart.message}
                                        </Text>
                                    </ColumnCenterCenter>
                                    :
                                    // 滑塊驗證
                                    <View style={[styles.puzzleContainer, { zIndex: -1 }]}>
                                        {
                                            // 大圖 UI
                                            sortedImgArray &&
                                            <FlatList
                                                style={styles.bigImageStyle}
                                                extraData={sortedImgArray}
                                                numColumns={10}
                                                scrollEnabled={false}
                                                keyExtractor={(item, index) => String(index)}
                                                renderItem={({ item }) =>
                                                    <Image
                                                        source={{
                                                            uri: item.imgUri,
                                                        }}
                                                        style={{
                                                            width: cropWidth,
                                                            height: cropHeight,
                                                            margin: Platform.OS == "android" ? -0.15 : 0,
                                                        }}
                                                        resizeMode="contain"
                                                    />
                                                }
                                                data={sortedImgArray}
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                            />

                                        }

                                        {
                                            // 小圖 UI
                                            !loading && CaptchaChart && CaptchaChart.keyUri ?
                                                <View
                                                    style={[
                                                        {
                                                            width: smallWidth,
                                                            height: smallHeight,
                                                            zIndex: 1,
                                                            position: "absolute",
                                                            left,
                                                            top,
                                                        },
                                                    ]}
                                                    {...this._panResponder.panHandlers}>
                                                    {/* 小图 */}
                                                    <Image
                                                        source={{
                                                            uri: CaptchaChart && CaptchaChart.keyUri,
                                                        }}
                                                        style={{
                                                            width: smallWidth,
                                                            height: smallHeight,
                                                        }}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                : null
                                        }

                                        {loading &&
                                            <ColumnCenterCenter style={styles.loadingBox}>
                                                <ActivityIndicator size="large" />
                                            </ColumnCenterCenter>
                                        }

                                        {
                                            // 驗證後的提示文字
                                            verificationText ?
                                                <RowCenterStart
                                                    style={[
                                                        styles.ValidationBox,
                                                        {
                                                            backgroundColor: verificationResult ? "rgba(144,238,144,.8)" : "rgba(255,192,203,.7)",
                                                        },
                                                    ]}>
                                                    {
                                                        verificationResult
                                                            ?
                                                            <CheckedIcon width={26} height={28} fill={"#407A50"}></CheckedIcon>
                                                            :
                                                            <CloseIcon width={24} height={24} fill={Color.alertRed} />
                                                    }
                                                    <Text
                                                        style={{
                                                            lineHeight: 25,
                                                            color: verificationResult ? "#008000" : "#B22222",
                                                            marginLeft: 5,
                                                        }}>
                                                        {verificationText}
                                                    </Text>
                                                </RowCenterStart>
                                                : null
                                        }

                                        {showErr ?
                                            <ColumnCenterCenter style={styles.loadingBox}>
                                                <View
                                                    style={{
                                                        backgroundColor: "rgba(0,0,0,.7)",
                                                        position: "absolute",
                                                        top: 30,
                                                        padding: 30,
                                                        borderRadius: 10,
                                                        zIndex: 9,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                        }}>{"这个操作太频繁了，\n请稍后再试。"}</Text>
                                                </View>
                                            </ColumnCenterCenter>
                                            : null}
                                    </View>
                                }

                                {showDescription && this.getDescription()}
                            </View>

                            <RowCenterBetween style={{ width: 300 }}>
                                <RowCenterCenter>
                                    {/* 刷新 */}
                                    <RefreshIcon
                                        spinning={true}
                                        width={14}
                                        height={14}
                                        onPress={() => this.preventReload()}
                                        fill={"#5F5D5E"}></RefreshIcon>

                                    {/* description Icon */}
                                    <InforIcon
                                        fill={"#5F5D5E"}
                                        width={18}
                                        height={18}
                                        style={{ marginLeft: 8 }}
                                        onPress={() =>
                                            this.setState(prevState => ({
                                                showDescription: !prevState.showDescription,
                                            }))
                                        }
                                    />
                                </RowCenterCenter>

                                {/* 由Funpodium提供技术支持 */}
                                {/* {this.getProvideText()} */}
                            </RowCenterBetween>
                        </ColumnCenterCenter>
                    }
                </ColumnCenterCenter>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalActive: {
        paddingBottom: 50,
        height: height,
        width: width,
        backgroundColor: "rgba(0, 0, 0, .4)",
    },
    captchaContainer: {
        width: 330,
        borderRadius: 8,
        paddingTop: 15,
        paddingBottom: 15,
    },
    puzzleContainer: {
        width: 300,
        height: 150,
        marginVertical: 10,
    },
    ValidationBox: {
        position: "absolute",
        bottom: 0,
        zIndex: 10,
        width: 300,
        height: 25,
        paddingHorizontal: 10,
    },
    loadingBox: {
        position: "absolute",
        width: 300,
        height: 150,
        backgroundColor: "rgba(0,0,0,.6)",
        zIndex: 5,
    },
});
