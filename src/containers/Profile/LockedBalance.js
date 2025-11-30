import moment from "moment";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";

import { getMoneyFormat, GetBonusGmt, FormatDate } from "$Utils";
import { ProductMapWalletCode } from "@/images/index";
import CustomTooltip from "$Components/CustomTooltip";
import LoadingBone from "$Components/LoadingBone";
const { width, height } = Dimensions.get("window");
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { GetGlobalModal } from "$Utils/globalModal";
import NoRecord from "$Components/NoRecord";
import Progress from "$Components/Progress";
import { RowCenterBetween, RowCenterCenter, RowCenterStart } from "$Components/CustomView";
import { LockIcon, WarningIcon } from "$Components/icons/index.js";

class LockedBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            depositList: [],
            loading: true,
            scrollViewKey: 0
        };
    }

    componentDidMount() {
        this.getBonusProgress("DEPOSIT");
        GetGlobalModal({
            name: "OneWalletTipModal",
            modalData: { page: "Locked" },
            wrapStyle: { width: "100%" },
        });
    }

    getBonusProgress = tabs => {
        fetchRequest(ApiPort.BonusProgress, "GET")
            .then(res => {
                if (res && res.isSuccess) {
                    const dataList = (res.result && res.result) || [];
                    this.setState({ depositList: dataList, loading: false });
                }
            })
            .catch(() => {});
    };

    getCategoryType = (categories, title) => {
        let name = "",
            type = "";

        switch (categories?.toUpperCase()) {
            case "POSTBONUS":
                name = title;
                type = translate("彩金金额");
                break;
            case "PREBONUS":
                name = title;
                type = translate("彩金金额");
                break;
            case "REBATE":
                name = translate("返水彩金"); //返水彩金
                type = translate("彩金金额");
                break;
            case "ADJUSTMENT":
                name = translate("自动派彩系统"); // 系统派发
                type = translate("调整金额");
                break;
            case "REFERRAL":
                name = translate("推荐好友2"); //推荐好友
                type = translate("彩金金额");
                break;
            default:
                break;
        }

        return {
            name,
            type,
        };
    };

    render() {
        const { depositList, loading, scrollViewKey } = this.state;

        const { lastDepositContractUpdatedDate, totalDepositContractBalance, totalContractBalance, } = depositList || {};
        return (
            <View style={styles.viewContainer}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={e => {
                        let offsetY = e.nativeEvent.contentOffset.y; // 滑动距离

                        this.setState({
                            scrollViewKey: offsetY
                        });
                    }}
                >
                    <View style={styles.totalBox}>
                        <RowCenterBetween style={styles.total}>
                            <RowCenterStart style={[styles.bonusRow, { marginBottom: 0 }]}>
                                <Text style={[styles.bonusMoney, { color: Color.gray }]}>{translate("未完成流水总金额")}</Text>
                                <CustomTooltip
                                    timeOut={4000}
                                    key={scrollViewKey}
                                    Icon={
                                        <LockIcon
                                            fill={Color.gray}
                                            width={18}
                                            height={18}
                                        ></LockIcon>
                                    }
                                    callBack={() => {
                                        PiwikEventDataHandle("OneWallet10");
                                    }}
                                    text={translate("完成流水要求，以解锁符合条件的存款和优惠金额至可提款金额")}
                                />
                            </RowCenterStart>

                            <Text style={styles.bonusMoneyItem}>{getMoneyFormat(totalContractBalance)}</Text>
                        </RowCenterBetween>
                    </View>

                    <View style={{ marginHorizontal: 15 }}>
                        <View style={styles.bonusList}>
                            <Text style={styles.bonusTitle}>{translate("存款")}</Text>
                            <RowCenterBetween style={[styles.bonusRow, { marginTop: 10, marginBottom: 0 }]}>
                                <RowCenterBetween style={styles.bonusRow}>
                                    <Text style={styles.bonusMoney}>{translate("未完成流水金额3")}</Text>
                                    <CustomTooltip
                                        timeOut={4000}
                                        key={scrollViewKey}
                                        Icon={
                                            <LockIcon
                                                fill={Color.gray}
                                                width={18}
                                                height={18}
                                            ></LockIcon>
                                        }
                                        callBack={() => {
                                            PiwikEventDataHandle("OneWallet11");
                                        }}
                                        text={translate("完成一倍流水即可解锁至可提款金额")}
                                    />
                                </RowCenterBetween>
                                <Text style={styles.bonusMoneyItem}>{getMoneyFormat(totalDepositContractBalance)}</Text>
                            </RowCenterBetween>

                            {lastDepositContractUpdatedDate && (
                                <Text style={[styles.bonusMoney, { color: Color.gray }]}>
                                    {translate("最后更新时间")} {FormatDate(moment(lastDepositContractUpdatedDate).utcOffset("+0800"))} {GetBonusGmt()}
                                </Text>
                            )}
                        </View>

                        <>
                            {depositList?.contract?.length > 0 &&
                                depositList?.contract?.map((item, index, self) => {
                                    let { contractBalance, currentTurnover, requiredTurnover, title, contractCategory, initialBalance } = item || {};
                                    const { name, type } = this.getCategoryType(contractCategory, title);
                                    const postAndRebate = ["POSTBONUS", "REBATE"].includes(contractCategory?.toUpperCase());
                                    const preBonus = ["PREBONUS"].includes(contractCategory?.toUpperCase());
                                    let imgIcon = Object.values(ProductMapWalletCode).find(v => v.walletProductGroupId === item.walletProductGroupId)?.imgIcon;

                                    return (
                                        <View
                                            style={[
                                                styles.bonusList,
                                                {
                                                    marginBottom: index == self.length - 1 ? 120 : 15,
                                                },
                                            ]}
                                            key={index}>
                                            <RowCenterBetween style={[styles.bonusRow]}>
                                                <Text style={styles.bonusTitle} numberOfLines={2} ellipsizeMode="tail">
                                                    {name}
                                                </Text>

                                                <Image
                                                    resizeMode={"contain"}
                                                    source={imgIcon}
                                                    style={[
                                                        styles.productImage,
                                                        {
                                                            opacity: !preBonus ? 0 : 1,
                                                        },
                                                    ]}
                                                />
                                            </RowCenterBetween>

                                            <RowCenterBetween style={[styles.bonusRow]}>
                                                <Text style={[styles.bonusMoney, { fontSize: 14 }]}>{type}</Text>
                                                <Text style={styles.bonusMoneyItem}>{getMoneyFormat(initialBalance || "0")}</Text>
                                            </RowCenterBetween>

                                            <DateView item={item} key={scrollViewKey} />

                                            <View style={styles.borders} />

                                            <RowCenterBetween style={[styles.bonusRow]}>
                                                <RowCenterStart style={[styles.bonusRow, { marginBottom: 0 }]}>
                                                    <Text style={styles.bonusMoney}>{translate("未完成流水金额3")}</Text>
                                                    <CustomTooltip
                                                        timeOut={4000}
                                                        key={scrollViewKey}
                                                        Icon={
                                                            <LockIcon
                                                                fill={Color.gray}
                                                                width={18}
                                                                height={18}
                                                            ></LockIcon>
                                                        }
                                                        callBack={() => {
                                                            PiwikEventDataHandle("OneWallet12");
                                                        }}
                                                        text={translate("完成流水进度才可解锁至可提现金额")}
                                                    />
                                                </RowCenterStart>

                                                <Text style={[styles.bonusMoneyItem, { fontSize: 16 }]}>{getMoneyFormat(contractBalance || "0")}</Text>
                                            </RowCenterBetween>

                                            <View style={[styles.bonusRow]}>
                                                <Text style={[styles.bonusMoney]}>{translate("流水进度")}</Text>
                                            </View>

                                            <RowCenterBetween style={[styles.bonusRow]}>
                                                <Text style={[styles.bonusMoney]}>
                                                    <Text
                                                        style={[
                                                            styles.bonusMoney,
                                                            {
                                                                color: Color.theme,
                                                            },
                                                        ]}>
                                                        {postAndRebate ? getMoneyFormat(Math.floor(currentTurnover || "0"), "") : parseInt(currentTurnover)}
                                                    </Text>{" "}
                                                    / {postAndRebate ? getMoneyFormat(Math.floor(requiredTurnover), "") : parseInt(requiredTurnover)}
                                                </Text>

                                                <Text style={[styles.bonusMoney]}>{Math.floor(parseFloat(item.turnoverProgress || 0))}%</Text>
                                            </RowCenterBetween>

                                            <Progress width={Math.floor(parseFloat(item.turnoverProgress || 0))} />
                                        </View>
                                    );
                                })}

                            {!loading && depositList.length == 0 && <NoRecord></NoRecord>}

                            {loading && <LoadingBone />}
                        </>
                    </View>
                </ScrollView>

                <View style={styles.btnView}>
                    <FilledButton
                        text={translate("立即投注")}
                        onPress={() => {
                            Actions.Home();

                            PiwikEventDataHandle("OneWallet13");
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default LockedBalance;

class DateView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { applyDateTime, contractCategory, expiredDateTime } = this.props.item || {};
        return (
            <RowCenterStart style={[styles.bonusRow]}>
                <Text style={[styles.bonusMoney, { color: Color.gray }]}>{translate("派发时间:")} {applyDateTime && FormatDate(moment(applyDateTime).utcOffset("+0800"))} {GetBonusGmt()}</Text>
                {
                    contractCategory == "PREBONUS" &&
                    <CustomTooltip
                        timeOut={4000} // https://arcadie.atlassian.net/browse/FSC-466
                        key={this.props.scrollViewKey}
                        Icon={
                            <WarningIcon
                                type='ring'
                                fill={Color.gray}
                                width={16}
                                height={16}
                                direction="bottom"
                            ></WarningIcon>
                        }
                        callBack={() => {
                            PiwikEventDataHandle("OneWallet14");
                        }}
                        containerStyle={{ left: 0 }}
                        text={`${translate("结束时间:")} ${window.LANGUAGE == "VN" ? "\n" : ""} ${expiredDateTime && FormatDate(moment(expiredDateTime).add(8, "h").utc(), { timeLevel: "full" })}`}
                    />
                }
            </RowCenterStart>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Color.lightGray,
    },
    totalBox: {
        backgroundColor: Color.theme,
        marginBottom: 15,
    },
    total: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 15,
        marginVertical: 10,
        backgroundColor: Color.white,
    },

    bonusList: {
        borderRadius: 6,
        padding: 15,
        marginBottom: 15,
        backgroundColor: Color.white,
        width: width - 30,
        paddingVertical: 12
    },
    bonusRow: {
        marginBottom: 10,
    },
    bonusTitle: {
        width: width * 0.6,
        fontSize: 16,
        fontWeight: "600",
        color: Color.charcoal,
    },
    bonusMoney: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkGray,
    },
    bonusMoneyItem: {
        fontSize: 16,
        fontWeight: "600",
        color: Color.charcoal,
    },
    productImage: {
        width: 24,
        height: 24,
    },

    borders: {
        height: 1,
        marginBottom: 10,
        backgroundColor: Color.mediumGray,
    },
    btnView: {
        width: width,
        backgroundColor: Color.lightGray,
        position: "absolute",
        zIndex: 9,
        bottom: 0,
        paddingHorizontal: 10,
        paddingVertical: 20,
        shadowColor: Color.black,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
});
