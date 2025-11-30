import React from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import moment from "moment";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { convertKeysToUpperCaseCamelCase, FormatDate } from "$Utils";
const { width } = Dimensions.get("window");
import { GetGlobalModal } from "$Utils/globalModal";
import Color from "$Components/Color";
import { ColumnCenterCenter, RowCenterCenter, RowCenterBetween, ColumnCenterStart } from "$Components/CustomView";
import DropDownSelectArray from "$Components/DropDownSelectArray";
import NavTab from "$Components/Nav/NavTab";
import NoRecord from "$Components/NoRecord";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";

import { AnnouncementSelsctDate, getAnnouncementSelsctDate, getTransferSelsctDate, NewsIconColorTextObj, TransferSelsctDate } from "./data";

const UnreadCount = "UnreadCount";
const Transfer = "Transfer";
const Personal = "Personal";
const Promotions = "Promotions";
const Announcement = "Announcement";
const Data = "Data";
const PageInfo = "PageInfo";

const newsTabData = [
    {
        // 對寫死的資料引用處理: 字串或者陣列都使用函數處理
        get title() {
            return translate("个人通知");
        },
        newsTypeArr: [Transfer, Personal, Promotions],
        callBack: ({ self }) => {
            self.GetTransferData();
            PiwikEventDataHandle("Notification1");
        },
        get selsctDate() {
            return getTransferSelsctDate();
        },
        secondItemData: [
            {
                get title() {
                    return translate("交易记录(个人通知)");
                },
                callBack: ({ PMATab, self }) => {
                    self.onClickInfoTabs(PMATab);
                    self.GetTransferData();
                    PiwikEventDataHandle("Notification4");
                },
                newsType: Transfer,
                readAllParams: {
                    messageTypeId: "2",
                    messageTypeOptionIdList: [3, 4, 5],
                },
            },
            {
                get title() {
                    return translate("个人(个人通知)");
                },
                callBack: ({ PMATab, self }) => {
                    self.onClickInfoTabs(PMATab);
                    self.GetPersonalData();
                    PiwikEventDataHandle("Notification5");
                },
                newsType: Personal,
                readAllParams: {
                    messageTypeId: "1",
                },
            },
            {
                get title() {
                    return translate("优惠(个人通知)");
                },
                callBack: ({ PMATab, self }) => {
                    self.onClickInfoTabs(PMATab);
                    self.GetPromotionsData();
                    PiwikEventDataHandle("Notification7");
                },
                newsType: Promotions,
                readAllParams: {
                    messageTypeId: "2",
                    messageTypeOptionIdList: [6],
                },
            },
        ],
    },
    {
        get title() {
            return translate("公告");
        },
        newsTypeArr: [Announcement],
        newsType: Announcement,
        callBack: ({ self }) => {
            self.GetAnnouncementData();
            PiwikEventDataHandle("Notification2");
        },
        get selsctDate() {
            return getAnnouncementSelsctDate();
        },
        secondItemData: [],
    },
];

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 0, // 0.通知 1.公告
            PMATab: 0, // 0.Personal 1.Transfer 2.优惠
            // 公告
            [`${Announcement}${Data}`]: [],
            [`${Announcement}${UnreadCount}`]: 0,
            // page info
            [`${Announcement}${PageInfo}`]: {
                currentIndex: 1,
                lastPage: 1,
            },

            // 通知
            [`${Transfer}${Data}`]: [], //交易
            [`${Transfer}${UnreadCount}`]: 0, // 未读次数
            // page info
            [`${Transfer}${PageInfo}`]: {
                currentIndex: 1,
                lastPage: 1,
            },

            //个人
            [`${Personal}${Data}`]: [],
            [`${Personal}${UnreadCount}`]: 0, // 未读次数
            // page info
            [`${Personal}${PageInfo}`]: {
                currentIndex: 1,
                lastPage: 1,
            },

            //优惠
            [`${Promotions}${Data}`]: [],
            [`${Promotions}${UnreadCount}`]: 0, // 未读次数
            // page info
            [`${Promotions}${PageInfo}`]: {
                currentIndex: 1,
                lastPage: 1,
            },
            moreLoading: false,
            inboxMessagesKey: 0, //通知==》交易选择key
            announcementsKey: 0, //公告key
        };
    }

    componentDidMount() {
        this.renderHeader();
        if (ApiPort.UserLogin) {
            this.initData();
        }
    }

    componentWillUnmount() {
        this?.props?.getMessageCount({});
        window.GetMessageCounts && window.GetMessageCounts();
    }

    initData = () => {
        Toasts.loading(translate("加载中,请稍候..."), 200);
        let processed = [this.GetAnnouncementData(), this.GetTransferData(), this.GetPersonalData(), this.GetPromotionsData()];
        Promise.all(processed)
            .then(res => {
                if (res) {
                    Toasts.removeAll();

                    this.renderHeader();
                }
            })
            .catch(error => {
                Toasts.removeAll();
            });
    };

    renderHeader() {
        this.props.navigation.setParams({
            title: () => {
                return (
                    <NavTab
                        tabData={newsTabData.map(v => v.title)}
                        callBack={({ key }) => {
                            this.setState(
                                {
                                    tabType: key,
                                    PMATab: 0,
                                    inboxMessagesKey: 0, //通知==》交易选择key
                                    announcementsKey: 0, //公告key
                                },
                                () => {
                                    this.renderHeader();
                                    let { callBack } = newsTabData[key];
                                    callBack({ self: this });
                                },
                            );
                        }}
                        renderIcon={key => {
                            let { newsTypeArr } = newsTabData[key];
                            let count = newsTypeArr.reduce((num, v) => {
                                return this.state[`${v}${UnreadCount}`] + num;
                            }, 0);
                            return count > 0 && <View style={styles.redIcon} />;
                        }}></NavTab>
                );
            },
        });
    }

    GetAnnouncementData = val => {
        let { announcementsKey } = this.state;
        let key = val || announcementsKey;
        let fetchurl = `${ApiPort.GetAnnouncements}messageTypeOptionId=${key}&PageSize=8&PageIndex=1&`;
        return fetchRequest(fetchurl, "GET").then(
            res =>
                res?.result &&
                res?.result?.announcementsByMember &&
                Array.isArray(res?.result?.announcementsByMember) &&
                res?.result?.announcementsByMember.length > 0 &&
                this.SetNews(Announcement, res.result),
        );
    };

    GetTransferData = val => {
        let { inboxMessagesKey } = this.state;
        let key = val || inboxMessagesKey;
        let fetchurl = ApiPort.GetMessages + `?MessageTypeID=2&messageTypeOptionIdList=${key == 0 ? "3,4,5" : key}&pageSize=8&pageIndex=1&`;
        return fetchRequest(fetchurl, "GET").then(
            res =>
                res?.result &&
                res?.result?.inboxMessagesListItem &&
                Array.isArray(res?.result?.inboxMessagesListItem) &&
                res?.result?.inboxMessagesListItem.length > 0 &&
                this.SetNews(Transfer, res.result),
        );
    };

    GetPersonalData = () => {
        let fetchurl = ApiPort.GetMessages + "?MessageTypeID=1&messageTypeOptionIdList=0&pageSize=8&pageIndex=1&";
        return fetchRequest(fetchurl, "GET").then(
            res =>
                res?.result &&
                res?.result?.inboxMessagesListItem &&
                Array.isArray(res?.result?.inboxMessagesListItem) &&
                res?.result?.inboxMessagesListItem.length > 0 &&
                this.SetNews(Personal, res.result),
        );
    };

    GetPromotionsData = () => {
        let fetchurl = ApiPort.GetMessages + "?MessageTypeID=2&messageTypeOptionIdList=6&pageSize=8&pageIndex=1&";
        return fetchRequest(fetchurl, "GET").then(
            res =>
                res?.result &&
                res?.result?.inboxMessagesListItem &&
                Array.isArray(res?.result?.inboxMessagesListItem) &&
                res?.result?.inboxMessagesListItem.length > 0 &&
                this.SetNews(Promotions, res.result),
        );
    };

    SetNews = (type, res) => {
        let data = type === Announcement ? res?.announcementsByMember : res?.inboxMessagesListItem;
        let pageTotal = Math.ceil((res.totalGrandRecordCount * 1) / 8);
        this.setState({
            [`${type}${Data}`]: data,
            [`${type}${UnreadCount}`]: res.totalUnreadCount,
            [`${type}${PageInfo}`]: {
                currentIndex: 1,
                lastPage: pageTotal,
            },
        });
    };

    goDetail = (type, data) => {
        !data?.isRead && this.updateMessageRead(type, data);
        this.getDetail(type, data);
        return;
    };

    getDetail = (type, data) => {
        this.renderHeader();
        if (parseInt(data?.messageID) == 0 || parseInt(data?.messageId) == 0) {
            let { PMATab, tabType } = this.state;
            let { secondItemData } = newsTabData[tabType];
            //https://arcadie.atlassian.net/browse/FOW-1861
            let memberNotificationCategoryId = data?.MemberNotificationCategoryId || data.memberNotificationCategoryId;
            let playerBonusId = data?.PlayerBonusId || data?.playerBonusId;
            let bonusGivenType = data?.bonusGivenType || data?.BonusGivenType;


            let flag =
                ([5, 6].includes(memberNotificationCategoryId) && Boolean(playerBonusId))
                ||
                [201, 202].includes(memberNotificationCategoryId)
                ||
                ([7, 8, 999].includes(memberNotificationCategoryId) && bonusGivenType && playerBonusId);


            if (secondItemData.length - 1 == PMATab && flag) {
                const convertData = convertKeysToUpperCaseCamelCase(data);
                Actions.PromotionMsgDetail({
                    detail: convertData,
                    userInfo: this.props.userInfo,
                });
            } else {
                Actions.NewsDetail({ data: data, megType: type });
            }

            PiwikEventDataHandle("Notification9");

            return;
            //[個人]有可能包含帳戶信息(MessageID===0)，但是會沒有detail可查，直接使用當前數據展示
        }
        let fetchurl = "";
        if (type === Announcement) {
            fetchurl = ApiPort.GetAnnouncementDetail + "?AnnouncementID=" + data?.announcementID + "&";
        } else {
            fetchurl = ApiPort.GetMessageDetail + "?messageId=" + data?.messageId + "&";
        }
        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(fetchurl, "GET")
            .then(data => {
                Toasts.removeAll();
                if (data && data?.result) {
                    let res = data?.result;
                    let detail = type == Announcement ? res.announcementResponse : res.inboxMessagesDetail;

                    let dataList = {
                        type,
                        detail,
                    };
                    PiwikEventDataHandle("Notification9");
                    Actions.NewsDetail({ data: detail, megType: type });
                }
            })
            .catch(error => {
                Toasts.removeAll();
            })
            .finally(() => {
                Toasts.removeAll();
            });
    };

    update = (type, fetchData, data, isSingle) => {
        const siteId = window.siteId;
        let fetchstring = type === Announcement ? Announcement : "Message";
        const url = ApiPort[`Update${fetchstring}`];
        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(`${url}siteId=${siteId}&`, "PATCH", fetchData)
            .then(res => {
                this.initData();
                Toasts.removeAll();
                if (res && res.result) {
                    if (isSingle) {
                        let tempArr = this.state[`${type}${Data}`];
                        let index = tempArr.findIndex(item => {
                            if (type === Announcement) {
                                return data?.announcementID === item.announcementID;
                            } else {
                                return data?.memberNotificationId === item.memberNotificationId;
                            }
                        });
                        tempArr[index].isRead = true;
                        this.setState({
                            [`${type}${Data}`]: tempArr,
                            [`${type}${UnreadCount}`]: this.state[`${type}${UnreadCount}`] - 1,
                        });
                    } else {
                        this[`Get${type}${Data}`]();
                    }
                }
            })
            .catch(error => {})
            .finally(() => {
                Toasts.removeAll();
            });
    };

    getSingleFetchData = data => {
        return {
            personalMessageUpdateItem: [
                {
                    messageId: data?.messageId,
                    memberNotificationId: data?.memberNotificationId,
                    isRead: true,
                    isOpen: data?.isOpen,
                },
            ],
            actionBy: memberCode,
            timestamp: new Date().toJSON(),
        };
    };

    // 統一更新消息已讀方法
    updateMessageRead = (type, data) => {
        let fetchData;
        if (type === Announcement) {
            // 公告類型的更新
            fetchData = {
                announcementUpdateItems: [
                    {
                        announcementID: data?.announcementID,
                        isRead: true,
                        isOpen: data?.isOpen,
                    },
                ],
                actionBy: memberCode,
                readAll: false,
                timestamp: new Date().toJSON(),
            };
        } else {
            // 一般消息類型的更新格式
            fetchData = this.getSingleFetchData(data);
        }

        // 當 type 為 Promotions 時，使用 Transfer
        const targetType = type === Promotions ? Transfer : type;
        this.update(targetType, fetchData, data, true);
    };

    getType = () => {
        return this.state.tabType == 1 ? Announcement : this.state.PMATab == 0 ? Transfer : Personal;
    };

    doReadAllMessage = () => {
        let { tabType, PMATab } = this.state;
        let readAllParams = newsTabData[tabType]?.secondItemData[PMATab]?.readAllParams || {};
        const type = this.getType();
        let fetchData = {
            actionBy: memberCode,
            readAll: true,
            timestamp: new Date().toJSON(),
            ...readAllParams,
        };
        this.update(type, fetchData);
    };

    onClickInfoTabs = key => {
        this.setState({
            PMATab: key,
            inboxMessagesKey: 0,
        });
    };

    // 顯示更多訊息
    moreMessage = type => {
        return (
            <View style={{ marginBottom: 40 }}>
                {this.isLastPage(type) ? (
                    <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
                        <View style={styles.driver} />
                        <Text style={styles.noMoreText}>{translate("没有更多消息了！")}</Text>
                        <View style={styles.driver} />
                    </View>
                ) : (
                    <Touch onPress={() => this.getNextPage(type)}>
                        <Text style={styles.moreText}>{translate("点击显示更多信息")}</Text>
                    </Touch>
                )}
            </View>
        );
    };

    isLastPage = type => {
        if (this.state[[`${type}${PageInfo}`]]["lastPage"] === 1) {
            return true;
        } else {
            return this.state[`${type}${PageInfo}`]["currentIndex"] >= this.state[[`${type}${PageInfo}`]]["lastPage"];
        }
    };

    getNextPage = type => {
        let fetchurl = "";
        const { announcementsKey, inboxMessagesKey } = this.state;
        if (this.isLastPage(type)) return;

        switch (type) {
            case Personal:
                fetchurl = `${ApiPort.GetMessages}?MessageTypeID=1&messageTypeOptionIdList=${inboxMessagesKey}&pageSize=8&pageIndex=${this.state[`${Personal}${PageInfo}`]?.currentIndex * 1 + 1}&`;
                break;
            case Transfer:
                fetchurl = `${ApiPort.GetMessages}?MessageTypeID=2&messageTypeOptionIdList=${inboxMessagesKey == 0 ? "3,4,5" : inboxMessagesKey}&pageSize=8&pageIndex=${this.state[`${Transfer}${PageInfo}`]?.currentIndex * 1 + 1}&`;
                break;
            case Promotions:
                fetchurl = `${ApiPort.GetMessages}?MessageTypeID=2&messageTypeOptionIdList=${inboxMessagesKey}&pageSize=8&pageIndex=${this.state[`${Promotions}${PageInfo}`]?.currentIndex * 1 + 1}&`;
                break;
            case Announcement:
                fetchurl = `${ApiPort.GetAnnouncements}messageTypeOptionId=${announcementsKey}&PageSize=8&PageIndex=${this.state[`${Announcement}${PageInfo}`].currentIndex * 1 + 1}&`;
                break;
            default:
                return;
        }

        this.setState(
            {
                moreLoading: true,
            },
            () => {
                Toasts.loading(translate("加载中,请稍候..."), 200);
                fetchRequest(fetchurl, "GET")
                    .then(result => {
                        Toasts.removeAll();
                        if (result) {
                            let res = result.result;
                            let data = type === Announcement ? res?.announcementsByMember : res?.inboxMessagesListItem;
                            this.setState((prevState, props) => {
                                return {
                                    [`${type}${Data}`]: [...this.state[[`${type}${Data}`]], ...data],
                                    [`${type}${PageInfo}`]: {
                                        ...this.state[`${type}${PageInfo}`],
                                        currentIndex: prevState[`${type}${PageInfo}`]["currentIndex"] * 1 + 1,
                                    },
                                };
                            });
                        } else {
                            Toasts.fail(translate("系统忙碌中，请稍后再试"));
                        }
                    })
                    .catch(error => {})
                    .finally(() => {
                        this.setState({
                            moreLoading: false,
                        });
                    });
            },
        );
    };

    getTime = item => {
        const { sendOn } = item;

        return FormatDate(moment.utc(sendOn).utcOffset(8));
    };

    getTitle(type, props) {
        if (type === Announcement) {
            return props.topic;
        } else if (type === Transfer) {
            switch (props.memberNotificationCategoryID) {
                default:
                    return props?.appTitle || props?.title;
            }
        } else {
            return props?.appTitle || props?.title;
        }
    }


    MessageItem(item, type) {
        let { PMATab = 0, tabType = 0 } = this.state;
        let isPromoMessage = (PMATab === 2 && tabType === 0) || (PMATab === 1 && tabType === 0);
        let key = item?.messageTypeOptionId || item?.newsTemplateCategory;
        let { name = "", color = "transparent", img = null } = NewsIconColorTextObj[key] || {};

        return (
            <Touch
                onPress={() => {
                    this.goDetail(type, item);
                }}
                style={styles.messageItem}>
                {/* 訊息ICON */}
                <View style={{ position: "relative" }}>
                    <Image resizeMode="stretch" source={img} style={{ width: 40, height: 40 }} />
                    {/* 未讀紅點 */}
                    {!item.isRead && <View style={styles.isRead} />}
                </View>

                {/* 訊息內容 */}
                <ColumnCenterStart style={[styles.messageInner, isPromoMessage && styles.promoItem]}>
                    <RowCenterBetween style={{ marginBottom: 4 }}>
                        <Text style={[styles.msgTitle, { width: isPromoMessage ? "100%" : "70%" }]} numberOfLines={isPromoMessage ? undefined : 1}>
                            {Boolean(name) && !isPromoMessage && (
                                <Text
                                    style={{
                                        color,
                                        fontSize: 12,
                                        fontWeight: "bold",
                                    }}>
                                    [{name}]{" "}
                                </Text>
                            )}
                            {this.getTitle(type, item)}
                        </Text>
                        {!isPromoMessage && <Text style={styles.timeText}>{item.sendOn !== "" ? this.getTime(item) : ""}</Text>}
                    </RowCenterBetween>

                    {isPromoMessage ? (
                        <Text style={styles.timeText}>{item.sendOn !== "" ? this.getTime(item) : ""}</Text>
                    ) : (
                        <HTMLView value={`<div>${item?.appContent || item?.content}</div>`} style={{ width: width - 100 }} stylesheet={styleHtmls} />
                    )}
                </ColumnCenterStart>
            </Touch>
        );
    }

    readAllUI({ newsType }) {
        let { tabType } = this.state;
        let { selsctDate } = newsTabData[tabType];
        let flag = newsType === Transfer || newsType === Announcement;
        return (
            <RowCenterCenter
                style={{
                    justifyContent: flag ? "space-between" : "flex-end",
                    padding: 15,
                }}>
                {flag && (
                    <DropDownSelectArray
                        key={newsType}
                        title={translate("选择类别")}
                        mainWalletName={translate("全部")}
                        onChange={({ key }) => {
                            this.newActive({ index: key, newsType });
                        }}
                        data={selsctDate}
                        realKey="name"
                        buttonStyle={styles.buttonStyle}
                        buttonTextStyle={{
                            color: Color.darkGray,
                            fontSize: 12,
                            fontWeight: "400"
                        }}
                    />
                )}

                <ColumnCenterCenter
                    style={styles.buttonStyle}
                    onPress={() => {
                        GetGlobalModal({
                            title: translate("标示为已读"),
                            message: translate("确认要将所有信息标示为已读吗？"),
                            cancelText: translate("取消(个人通知)"),
                            onCancel: () => {},
                            confirmText: translate("已读"),
                            onConfirm: () => {
                                this.doReadAllMessage();
                            },
                        });
                        PiwikEventDataHandle("Notification8");
                    }}>
                    <Text style={styles.allRedTxt}>{translate("标示全部已读")}</Text>
                </ColumnCenterCenter>
            </RowCenterCenter>
        );
    }

    // 公告選擇分類
    newActive = ({ index, newsType }) => {
        let flag = newsType === "Transfer";
        let data = flag ? TransferSelsctDate : AnnouncementSelsctDate;
        let key = data[index].key;
        let property = flag ? "inboxMessagesKey" : "announcementsKey";

        this.setState(
            {
                [`${Transfer}${Data}`]: "",
                [`${Personal}${Data}`]: "",
                [`${Promotions}${Data}`]: "",
                [`${Announcement}${Data}`]: "",

                [`${property}`]: key,
            },
            async () => {
                Toasts.loading(translate("加载中,请稍候..."));
                await this[`Get${newsType}Data`](key);
                Toasts.removeAll();
            },
        );
    };

    render() {
        const { tabType, PMATab } = this.state;

        let { secondItemData } = newsTabData[tabType];
        let tempNewsType = tabType == 0 ? secondItemData[PMATab]?.newsType : newsTabData[1]?.newsType;
        let newsData = this.state[`${tempNewsType}${Data}`];

        return (
            <View style={{ flex: 1, backgroundColor: "#efeff4" }}>
                {Array.isArray(secondItemData) && secondItemData.length > 0 && (
                    <View style={styles.magTabContainer}>
                        {secondItemData.map((v, i, self) => {
                            let { title, callBack, newsType } = v;
                            let flag = PMATab == i;
                            let count = this.state[`${newsType}${UnreadCount}`];
                            return (
                                <RowCenterCenter
                                    key={i}
                                    style={[
                                        styles.magTabList,
                                        {
                                            width: width / self.length,
                                            borderBottomColor: flag ? Color.theme : "transparent",
                                        },
                                    ]}
                                    onPress={() => {
                                        callBack({ PMATab: i, self: this });
                                    }}>
                                    <Text style={[
                                        styles.magTabText,
                                        {
                                            color: flag ? Color.theme : Color.darkGray,
                                            fontWeight: flag ? "600" : "400"
                                        }
                                    ]}>{title}</Text>
                                    {count > 0 && (
                                        <ColumnCenterCenter style={[styles.circleTip, (count + "").length == 1 && styles.circleTipNum]}>
                                            <Text style={styles.circleTipText}>{count}</Text>
                                        </ColumnCenterCenter>
                                    )}
                                </RowCenterCenter>
                            );
                        })}
                    </View>
                )}

                {this.readAllUI({ newsType: tempNewsType })}

                <ScrollView style={{ flex: 1 }} automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        {Array.isArray(newsData) && newsData.length > 0 && (
                            <>
                                {(window.LANGUAGE === "VN" || window.LANGUAGE === "TH") && (
                                    <RowCenterCenter>
                                        <Text style={styles.dateText}>{translate("显示时间为GMT+8")}</Text>
                                    </RowCenterCenter>
                                )}

                                {newsData.map((item, index) => {
                                    return <View key={index}>{this.MessageItem(item, tempNewsType)}</View>;
                                })}
                            </>
                        )}
                    </View>
                    {newsData.length > 0 ? this.moreMessage(tempNewsType) : <NoRecord text={translate("暂无记录")} />}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(News);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    redIcon: {
        width: 6,
        height: 6,
        borderRadius: 5,
        backgroundColor: "red",
        marginLeft: 8,
    },
    magTab: {
        width: width,
        backgroundColor: "#00a6ff",
        paddingHorizontal: 15,
    },
    magTabContainer: {
        flexDirection: "row",
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: Color.mediumGray
    },
    magTabList: {
        flex: 1, // 確保每個元素佔據相等的空間
        height: 40,
        borderBottomWidth: 3,
    },
    magTabText: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 12,
        color: Color.gray,
        marginTop: 5,
        marginBottom: 12,
    },
    timeText: {
        fontSize: 10,
        color: Color.gray,
    },
    lineBottom: {
        width: 34,
        height: 3,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: -1,
    },
    messageItem: {
        width: "100%",
        alignItems: "flex-start",
        flexDirection: "row",
        marginBottom: 15,
        borderRadius: 8,
        padding: 15,
        backgroundColor: "#fff",
    },
    messageInner: {
        width: "85%",
        flex: 1,
        marginLeft: 15,
    },
    promoItem: {
        justifyContent: "space-between",
        height: 40,
    },
    noallRed: {
        width: 102,
        height: 27,
        borderRadius: 20,
        backgroundColor: "#bcbec3",
    },
    allRedTxt: {
        color: "#666666",
        textAlign: "center",
        fontSize: 12,
        fontWeight: "500",
    },
    noallRedTxt: {
        color: "#bcbec3",
        lineHeight: 28,
        textAlign: "center",
        fontSize: 12,
    },
    gonggaoList: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
    },
    dropdown_D_text: {
        paddingBottom: 3,
        fontSize: 12,
        color: "#666666",
        fontWeight: "500",
        textAlign: "center",
    },
    dropdown_state_dropdown: {
        height: 206,
        borderRadius: 8,
        overflow: "hidden",
        width: 140,
        marginTop: 10,
    },
    circleTip: {
        padding: 4,
        backgroundColor: "#EB2121",
        borderRadius: 99999,
        marginLeft: 5,
    },
    circleTipNum: {
        width: 20,
        height: 20,
    },
    circleTipText: {
        fontSize: 10,
        fontWeight: "400",
        color: "#fff",
    },
    isRead: {
        width: 12,
        height: 12,
        borderRadius: 12 / 2,
        backgroundColor: "#F53D3D",
        borderColor: "#fff",
        borderWidth: 2,
        position: "absolute",
        right: 0,
        top: 0,
    },
    msgTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: Color.charcoal,
    },
    moreText: {
        color: "#00a6ff",
        textAlign: "center",
        fontSize: 12,
        paddingBottom: 25,
    },
    noMoreText: {
        alignSelf: "center",
        paddingHorizontal: 17,
        color: Color.gray,
        textAlign: "center",
        fontSize: 12,
    },
    driver: {
        backgroundColor: "#D2D0D0",
        height: 1,
        flex: 1,
        alignSelf: "center",
    },
    buttonStyle: {
        height: 32,
        borderColor: "transparent",
        borderRadius: 8,
        backgroundColor: Color.white,
        paddingHorizontal: 15
    },
});

const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    p: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    span: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    h1: {
        fontSize: 12,
        lineHeight: 22,
        color: "#666",
    },
    h2: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    h3: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    h4: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
    h5: {
        fontSize: 12,
        lineHeight: 16,
        color: "#666",
    },
});
