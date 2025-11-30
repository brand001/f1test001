// import { ReactSVG } from '@/ReactSVG';
// import Router from 'next/router';
// import LazyImageForTeam from "@/LazyLoad/LazyImageForTeam";
import { VendorMarkets } from "../../lib/vendor/data/VendorConsts";
// import { getStyle } from "$LIB/js/Helper";
import { connect } from "react-redux";
// import { Textfit } from 'react-textfit';
// import VideoPlayer from './Player';
import Orientation from "react-native-orientation-locker";
import Video from "react-native-video";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import { ImagesUrl } from "@/images/index";
import { Flex, WingBlank, WhiteSpace, Tabs, Drawer } from "@ant-design/react-native";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import { WebView } from "react-native-webview";
import React, { Component } from "react";
import ImageForTeam from "../RNImage/ImageForTeam";
import { ArrowIcon, CloseIcon } from "$Components/icons/index";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { Toasts } from "$Toasts";
class DetailHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showType: this.props.defaultShowType ? parseInt(this.props.defaultShowType) : 0, // 0: 主Header  1: 视频  2: 动画  3: 分析
            src: null,
            isFullScreenSlider: false,
            isLandscape: false,
            showScaleIcon: false,
            fixedStatus: this.props.fixedStatus,
        };
    }

    render() {
        const { EventData, Vendor, headerWidth, headerHeight, isLandscape, isLandscapeShow, MiniEvent } = this.props;
        let width = isLandscapeShow && isLandscape ? headerWidth * 0.6 : headerWidth;
        let height = headerHeight;
        const htmls = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge \"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0 user-scalable=no\"><title>Document</title></head><body style=\"background-color: #000;overflow: hidden;\">";
        return (
            <View style={[MiniEvent ? styles.MiniEvent : styles.noMiniEvent]}>
                <ImageBackground
                    style={
                        [
                            { width: width, height: height, display: "flex", justifyContent: "center", alignItems: "center" },
                            MiniEvent ? { position: "absolute", top: 0, left: 0 } : {}
                        ]
                    }
                    resizeMode="stretch"
                    source={this.props.EuroCupBet ? ImagesUrl.bannerBg : ImagesUrl.pkbg}
                >
                    {
                        !this.props.thumbStatus && (
                            <View style={[styles.Betting_header, { width: width }]}>
                                <Touch
                                    onPress={() => {
                                        PiwikEventDataHandle("SbSportsCN_MatchMinimize");
                                        this.props.backToListWithMinifyWindow(true, this.state.showType);
                                    }}
                                    style={{ padding: 5, paddingRight: 30 }}
                                >
                                    <ArrowIcon direction={"bottom"} fill="#fff" width={18} height={18}></ArrowIcon>
                                </Touch>
                                {this.state.showType !== 0 ?
                                    <Touch
                                        onPress={() => {
                                            this.props.setDefaultShowType(0);
                                            this.setState({ showType: 0 });
                                            //關閉視頻播放
                                            // if (this.state.showType === 1 && this.player) {
                                            // 	this.player.pause();
                                            // }
                                        }}
                                        style={{ paddingRight: DeviceInfoIos ? 20 : 0 }}
                                    >
                                        <CloseIcon width={20} height={20} />
                                    </Touch>
                                    : <Text style={{ color: "transparent" }}>1</Text>}
                            </View>
                        )
                    }
                    <View style={[styles.Betting_header, { width: this.props.headerWidth }]}>
                    </View>
                    {this.state.showType === 0 ? <View style={{ height: height, display: "flex", justifyContent: "center", alignItems: "center", width: width }}>
                        <View style={[styles.Betting_header_score, { width: width }]}>
                            <View style={[styles.itemTimes, { width: width * 0.3 }]}>
                                <ImageForTeam TeamId={EventData.HomeTeamId} Vendor={Vendor} IconUrl={EventData.HomeIconUrl} imgSize={48} />
                                <Text style={{ color: "#fff", width: width * 0.3, textAlign: "center", fontSize: 12, lineHeight: 17, marginTop: 12 }} >{EventData.HomeTeamName}</Text>
                                {
                                    (EventData.IsRB && EventData.HomeRedCard && parseInt(EventData.HomeRedCard) > 0) ?
                                        <View style={{ backgroundColor: "red", borderRadius: 5, padding: 2, marginTop: 4 }}>
                                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{EventData.HomeRedCard}</Text>
                                        </View>
                                        : <View style={{ height: 20, width: 20, padding: 2, marginTop: 4 }} />
                                }
                            </View>
                            <View >
                                {
                                    EventData.IsRB ? <View style={styles.itemCenter}>
                                        <View style={styles.Game_info}>
                                            <Text style={{ color: EventData.HomeScore > 0 ? "#fff" : "#c8bfbe", fontSize: 36, lineHeight: 50 }}>{EventData.HomeScore}</Text>
                                            <Text style={{ color: "#fff", paddingHorizontal: 16, fontSize: 40 }}>-</Text>
                                            <Text style={{ color: EventData.AwayScore > 0 ? "#fff" : "#c8bfbe", fontSize: 36, lineHeight: 50 }}>{EventData.AwayScore}</Text>
                                        </View>
                                        {
                                            EventData.RBMinute > 0 &&
                                            <View style={styles.dateFen}>
                                                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}> {EventData.RBMinute}' </Text>
                                            </View>
                                        }
                                        {
                                            EventData.HasCornerData &&
                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 14 }}>
                                                <Image resizeMode='stretch' source={ImagesUrl.redJ} style={{ width: 20, height: 20 }} />
                                                <Text style={{ fontSize: 12, color: "#FFFFFF" }}>{EventData.HomeCorner ?? 0}-{EventData.AwayCorner ?? 0}</Text>
                                            </View>
                                        }
                                    </View>
                                        : <View style={styles.noGame_info}>
                                            <Text style={{ color: "#fff" }}>{EventData.getEventDateMoment().format("MM/DD HH:mm")}</Text>
                                            <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 36, fontWeight: "bold" }}>VS</Text>
                                            <Text style={{ color: "#fff" }}>未开始</Text>
                                        </View>
                                }
                            </View>
                            <View style={[styles.itemTimes, { width: width * 0.3 }]}>
                                <ImageForTeam TeamId={EventData.AwayTeamId} Vendor={Vendor} IconUrl={EventData.AwayIconUrl} imgSize={48} />
                                <Text style={{ color: "#fff", width: width * 0.3, textAlign: "center", fontSize: 12, lineHeight: 17, marginTop: 12 }} >{EventData.AwayTeamName}</Text>
                                {
                                    (EventData.IsRB && EventData.AwayRedCard && parseInt(EventData.AwayRedCard) > 0) ?
                                        <View style={{ backgroundColor: "red", borderRadius: 5, padding: 2, marginTop: 4 }}>
                                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{EventData.AwayRedCard}</Text>
                                        </View>
                                        : <View style={{ height: 20, width: 20, padding: 2, marginTop: 4 }} />
                                }
                            </View>
                        </View>
                        <View style={styles.Footer_menu}>
                            {
                                EventData.HasLiveStreaming ?
                                    <Touch
                                        style={{ minWidth: 50, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                                        onPress={() => {
                                            if (global.localStorage.getItem("loginStatus") != 1) {
                                                Orientation.lockToPortrait();
                                                Actions.Login({ from: "Betting-detail" });
                                                return;
                                            }
                                            this.props.setDefaultShowType(1);
                                            this.setState({ showType: 1 });
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>视频</Text>
                                    </Touch>
                                    : null
                            }
                            {
                                EventData.HasLiveStreaming && EventData.HasVisualization &&
                                <View style={{ width: 1, height: 20, backgroundColor: "#999", marginLeft: 10, marginRight: 10 }} />
                            }
                            {
                                EventData.HasVisualization ?
                                    <Touch
                                        style={{ minWidth: 50, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                                        onPress={() => {
                                            if (global.localStorage.getItem("loginStatus") != 1) {
                                                Orientation.lockToPortrait();
                                                Actions.Login({ from: "Betting-detail" });
                                                return;
                                            }
                                            this.props.setDefaultShowType(2);
                                            this.setState({ showType: 2 });
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>动画</Text>
                                    </Touch>
                                    : null
                            }
                            {
                                EventData.HasStatistic ?
                                    <Touch
                                        style={{ minWidth: 50, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                                        onPress={() => {
                                            if (global.localStorage.getItem("loginStatus") != 1) {
                                                Orientation.lockToPortrait();
                                                Actions.Login({ from: "Betting-detail" });
                                                return;
                                            }
                                            Toasts.info("暂未开放！");
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>数据</Text>
                                    </Touch>
                                    : null
                            }
                            {
                                !EventData.HasLiveStreaming && !EventData.HasVisualization && !EventData.HasStatistic &&
                                <Text style={{ color: "#bcbec3", fontSize: 12, fontWeight: "600" }}>暂无视频/动画/数据</Text>
                            }
                        </View>
                    </View> : null}
                    {
                        !this.props.thumbStatus && <View style={styles.Bettingfotter}>
                            {
                                isLandscape ?
                                    <Touch
                                        onPress={() => {
                                            this.props.setIsLandscape();
                                        }}
                                        style={{ paddingRight: DeviceInfoIos ? 20 : 10 }}>
                                        <Image resizeMode='stretch' source={ImagesUrl.detailBetRecord} style={{ width: 20, height: 20 }} />
                                    </Touch>
                                    :
                                    <Touch
                                        onPress={() => { this.setState({ fixedStatus: !this.state.fixedStatus }, () => { this.props.setFixed(this.state.fixedStatus); }); }}>
                                        <Image resizeMode='stretch' source={
                                            this.state.fixedStatus ? ImagesUrl.tagEntry : ImagesUrl.tagCancel
                                        } style={{ width: 20, height: 20 }} />
                                    </Touch>
                            }
                        </View>
                    }
                    {
                        EventData.HasLiveStreaming && this.state.showType == 1 &&
                        <View style={{ backgroundColor: "#000" }}>
                            <Video
                                source={{ uri: (EventData.LiveStreamingUrl && EventData.LiveStreamingUrl[0] && EventData.LiveStreamingUrl[0].Url) ? EventData.LiveStreamingUrl[0].Url : null }}
                                rate={1.0}
                                muted={false}
                                onLoad={(p) => { console.log("play video onLoad:", EventData.LiveStreamingUrl, p); }}
                                onLoadStart={(p) => { console.log("play video onLoadStart:", EventData.LiveStreamingUrl, p); }}
                                resizeMode={"contain"}
                                repeat
                                style={{ width: width, height: height }}
                                playWhenInactive={true}
                                onError={(e) => { console.log("play video has error:", EventData.LiveStreamingUrl, e); }}
                            />
                        </View>
                    }
                    {
                        this.state.showType === 2 ?
                            <View style={{ width: width, height: height, backgroundColor: "#000" }}>
                                <View style={{ position: "absolute" }}>
                                    <WebView
                                        onLoadStart={e => this.setState({ loadD: true })}
                                        onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
                                        source={{
                                            html: `${htmls}<iframe
											src="https://www.zbxz88.com/cms/F1/brevent.html?lang=zh&timezone=Asia:Hong_Kong&layout=single&brEventId=${EventData.BREventId}"
											frameBorder="0" width="100%" height="${height}px"></iframe></body></html>`
                                        }}
                                        mixedContentMode="always"
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        allowsInlineMediaPlayback
                                        mediaPlaybackRequiresUserAction={false}
                                        allowFileAccess
                                        style={{ width: width, height: height }}
                                    />
                                </View>
                            </View>
                            : null
                    }
                </ImageBackground>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    MiniEvent: {
        transform: [{ scale: 0.38 }],
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 99,
    },
    noMiniEvent: {

    },
    Betting_header: {
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        zIndex: 99,
    },
    Bettingfotter: {
        position: "absolute",
        bottom: 0,
        right: 0,
        padding: 10,
        zIndex: 99,
    },
    Betting_header_score: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "row",
        paddingTop: 40,
    },
    itemTimes: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    itemCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    Game_info: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    noGame_info: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    dateFen: {
        borderRadius: 8,
        backgroundColor: "#eb2121",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 25,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    Footer_menu: {
        marginTop: 18,
        backgroundColor: "#0006",
        borderRadius: 45,
        paddingHorizontal: 25,
        paddingVertical: 9,
        zIndex: 9,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    }
});

const mapStateToProps = state => ({
    routerLog: state.routerLog
});

export default connect(
    mapStateToProps,
    null,
)(DetailHeader);
