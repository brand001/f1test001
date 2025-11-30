//推送信息详情
import moment from "moment";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import HTMLView from "react-native-htmlview";
const { width, height } = Dimensions.get("window");
import { Toasts } from "$Toasts";

class NotificationDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detailData: null,
        };
    }
    componentDidMount() {
        this.getDetail();
    }
    componentWillUnmount() {
        window.GetMessageCounts && window.GetMessageCounts();
    }
    getDetail = () => {
        let id, types;
        if (this.props.id && this.props.types) {
            id = this.props.id;
            types = this.props.types;
        } else {
            return;
        }
        const fetchurl = ApiPort.GetMessageDetail + "?MessageID=" + id + "&";
        Toasts.loading("Đang tải...", 200);
        fetchRequest(fetchurl, "GET")
            .then(data => {
                Toasts.removeAll();
                const res = data.result;
                if (res) {
                    if (res.personalMessage.sendOn && res.personalMessage.sendOn.indexOf("T") !== -1 && res.personalMessage.sendOn.indexOf("Z") === -1) {
                        //有T沒Z 補Z 並format
                        res.personalMessage.sendOn = moment(res.personalMessage.sendOn + "Z").format("YYYY-MM-DD HH:mm:ss");
                    }
                    this.setState(
                        {
                            detailData: res.personalMessage,
                        },
                        () => {
                            this.UpdatePersonalData(res.personalMessage);
                        },
                    );
                }
            })
            .catch(error => {
                Toasts.removeAll();
            });
    };

    // 更新消息已读
    UpdatePersonalData = data => {
        let fetchData = this.getSingleFetchData(data);
        this.update("Personal", fetchData, data, true);
    };

    getSingleFetchData = data => {
        return {
            personalMessageUpdateItem: [
                {
                    MessageID: data.MessageID,
                    MemberNotificationID: data.MemberNotificationID,
                    IsRead: true,
                    IsOpen: data.IsOpen,
                },
            ],
            actionBy: JSON.parse(localStorage.getItem("memberCode")),
            timestamp: new Date().toJSON(),
        };
    };

    update = (types, fetchData, data, isSingle) => {
        let fetchstring = types === "Announcement" ? "Announcement" : "Message";
        fetchRequest(ApiPort[`Update${fetchstring}`], "PATCH", fetchData)
            .then(res => {})
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#efeff4", padding: 15 }}>
                {this.state.detailData ? (
                    <View>
                        <View>
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    color: "#000",
                                    lineHeight: 35,
                                }}>
                                {this.state.detailData.Title || this.state.detailData.Topic || ""}
                            </Text>
                            <Text style={{ color: "#999", fontSize: 12 }}>{this.state.detailData.SendOn}</Text>
                        </View>
                        <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                            <HTMLView style={{ width: width - 40 }} value={`<div>${this.state.detailData.Content}</div>`} stylesheet={styleHtmls} />
                        </View>
                        <Text style={{ color: "#999", fontSize: 12 }}>情报推荐内容来源于第三方，仅供参考,会员产生输赢与乐天堂无关！</Text>
                    </View>
                ) : null}
            </View>
        );
    }
}
const styleHtmls = StyleSheet.create({
    div: {
        fontSize: 12,
        lineHeight: 22,
    },
});
export default NotificationDetail;
