import moment from "moment";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { connect } from "react-redux";

import { getMoneyFormat, CapitalizeFirstLetter, GetBonusName, GetPromoProductGroupNameMapImg, GetBonusGmt, FormatDate, MonthFormat } from "$Utils";
import CustomTooltip from "$Components/CustomTooltip";
import DateModal from "$Components/DateModal";
import DropDownSelectArray from "$Components/DropDownSelectArray";
import { Toasts } from "$Toasts";
const { width } = Dimensions.get("window");
import { GetAppliedHistory } from "@/actions/CmsApi";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { ImagesUrl } from "@/images/index";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import NoRecord from "$Components/NoRecord";
import { WarningIcon } from "$Components/icons/index.js";
import styles from "./styles";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";

const pageSize = 50;

const bonusStatusIdObj = {
    5: {
        //'Force to served'
        // text: `Đã hoàn thành`,
        color: Color.vibrantGreen,
    },
    6: {
        // text: `Đã hoàn thành`,
        color: Color.vibrantGreen,
    },
    2: {
        // text: `Đã hủy`,
        color: Color.alertRed,
    },
};

class BonusFinish extends React.Component {
    constructor(props) {
        super(props);
        let accountModalKey = this.props.sportSB ? this.props.moneyData.findIndex(v => v?.walletProductGroupCode == "SB") : 0;
        this.state = {
            dateSelect: new Date(),
            accountModalVisible: false,
            accountModalKey,
            selectBonusList: [],

            currentPage: 1,
        };
    }
    componentWillMount() {
        this.getBonusApplications();
    }

    getBonusApplications = () => {
        this.setState({
            currentPage: 1,
        });
        const { dateSelect } = this.state;

        const dateFrom = moment(dateSelect).startOf("month").format("YYYY-MM-DD");
        const dateTo = moment(dateSelect).endOf("month").format("YYYY-MM-DD");
        const params = {
            startDate: dateFrom,
            endDate: dateTo,
            wallet: "",
        };

        Toasts.loading(translate("加载中,请稍候..."), 100);
        GetAppliedHistory(params)
            .then(res => {
                Toasts.removeAll();
                this.setState({ selectBonusList: res });
            })
            .catch(err => {
                Toasts.removeAll();
            });
    };

    //选择时间
    dateSelect = date => {
        let dateSelect = "";
        if (date) {
            dateSelect = moment(new Date(date)).format("YYYY-MM-DD");
        }
        this.setState({ dateSelect, dateModalVisible: false }, () => {
            this.getBonusApplications();
        });
    };

    // 选择账户
    accountModalKey = accountModalKey => {
        this.setState({ accountModalKey }, () => {
            this.getBonusApplications();
        });
    };

    //筛选显示list
    bonusListShow = () => {
        //bonusStatusId状态
        // 0: 'M3 全部状态'
        // 1: 'M3 待处理'
        // 2: 'M3 已取消'
        // 3: 'M3 进行中'
        // 4: 'M3 审核中'
        // 5: ForceToServed = 5,
        // 6: 'M3 完成'
        // 7: 'M3 领取'
        // 8: 'M3 已过期'
        // 9: 'M3 等待查询'
        const { moneyData = [] } = this.props;
        const { selectBonusList, accountModalKey } = this.state;
        const wallet = moneyData[accountModalKey]?.walletProductGroupCode;

        const bonusListShow = selectBonusList.filter(v => {
            const isShow = v.bonusStatusId == 2 || v.bonusStatusId == 5 || v.bonusStatusId == 6 || v.bonusStatusId == 8 || v.bonusStatusId == 11;
            return isShow;
        });
        return accountModalKey == 0 ? bonusListShow : bonusListShow.filter(item => item.productGroup == wallet);
    };

    tipMessage = (message = "") => {
        message = message.replace(/(\d+\.\d+)/g, match => {
            return getMoneyFormat(parseFloat(match), "đ").replace(/\s?đ$/, ""); // 去掉 " đ"
        });
        return message;
    };

    handlePageChange = pageNumber => {
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const { dateSelect, accountModalKey, currentPage } = this.state;

        const { sportSB, moneyData } = this.props;

        //筛选显示
        const bonusListShow = this.bonusListShow();

        // 获取当前页的数据
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return (
            <View>
                <RowCenterBetween style={styles.herderSelect}>
                    {/* 日期选择 */}
                    <DateModal
                        confirmText={translate("确认4")}
                        minDate={new Date(moment().subtract(4, "months"))}
                        defaultDate={dateSelect}
                        type={MonthFormat[window.LANGUAGE]}
                        title={translate("选择月份")}
                        onChange={value => {
                            this.dateSelect(value);
                        }}
                        buttonStyle={[
                            styles.herderSelectList,
                            {
                                width: sportSB ? width - 20 : (width - 40) * 0.5,
                            },
                        ]}
                    />

                    {/* 全部账户 */}
                    {!sportSB && (
                        <DropDownSelectArray
                            title={translate("请选择游戏类别")}
                            onChange={({ key }) => {
                                this.accountModalKey(key);
                                PiwikEventDataHandle({
                                    eventTitle: "BonusHistory19",
                                    customProperties: {
                                        Bonus_Archived_C_Category: moneyData[key]?.walletProductGroupName,
                                    },
                                });
                            }}
                            realKey="walletProductGroupName"
                            data={moneyData}
                            buttonStyle={[styles.herderSelectList, { width: (width - 40) * 0.5 }]}
                            buttonTextStyle={{
                                flexWrap: "wrap",
                                maxWidth: (width - 40) * 0.5 * 0.7,
                                color: Color.darkGray,
                                fontSize: moneyData[accountModalKey]?.walletProductGroupId == 24 ? 12 : 14,
                            }}
                        />
                    )}
                </RowCenterBetween>

                {Array.isArray(bonusListShow) && bonusListShow.length > 0 ? (
                    bonusListShow.map((item, index) => {
                        let { status = "" } = item;
                        console.log("item", JSON.stringify(item, null, 2));
                        let { color, img, text } = bonusStatusIdObj[item?.bonusStatusId] || bonusStatusIdObj[2];

                        let { bonusRuleType = "", bonusGivenType = "", bonusGiven = "", expiredDate = "" } = item;

                        bonusRuleType = bonusRuleType?.toUpperCase();
                        bonusGivenType = bonusGivenType?.replace(/\s+/g, "").toUpperCase();

                        return (
                            <View style={[styles.bonusList]} key={index}>
                                {/* 标题 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    {/* CXP1-2083 */}
                                    <Text style={[styles.bonusTitle]}>{item?.bonusName || item?.promotionTitle || item?.bonusTitle}</Text>

                                    {GetPromoProductGroupNameMapImg({
                                        productGroup: item?.productGroup,
                                    })}
                                </RowCenterBetween>

                                {/* 预付红利 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <Text style={[styles.bonusMoney, { fontSize: 14 }]}>{GetBonusName({ bonusRuleType, bonusGivenType })}</Text>
                                    <Text style={[styles.bonusMoneyItem]}>{["REWARDSPOINT", "FREESPIN"].includes(bonusGivenType) ? getMoneyFormat(bonusGiven, " ") : getMoneyFormat(bonusGiven)}</Text>
                                </RowCenterBetween>

                                {/* 结束时间 */}
                                <RowCenterBetween style={[styles.bonusRow]}>
                                    <Text style={[styles.bonusMoney]}>
                                        {translate("结束时间：")} {expiredDate ? FormatDate(expiredDate) : translate("无限期")}
                                        {GetBonusGmt()}
                                    </Text>

                                    <RowCenterStart>
                                        <Text style={[styles.bonusListMsg, { color, marginLeft: 5 }]}>{CapitalizeFirstLetter(status)}</Text>

                                        <CustomTooltip
                                            key={this.props?.scrollViewKey}
                                            timeOut={4000}
                                            placement={"top"}
                                            visible={true}
                                            Icon={() => {
                                                return (
                                                    <RowCenterStart>
                                                        {item?.statusTipsMessage && (
                                                            <WarningIcon
                                                                type={"ring"}
                                                                fill={color} />
                                                        )}
                                                        <Text style={[styles.bonusListMsg, { color, marginLeft: 4 }]}>{CapitalizeFirstLetter(status)}</Text>
                                                    </RowCenterStart>
                                                );
                                            }}
                                            containerStyle={{
                                                maxWidth: 0.52 * width,
                                                left: -20,
                                            }}
                                            callBack={() => {
                                                PiwikEventDataHandle({
                                                    eventTitle: "BonusHistory20",
                                                    customProperties: {
                                                        Bonus_C_StatusTooltip: item?.status,
                                                    },
                                                });
                                            }}
                                            text={item?.bonusStatusId == 11 ? "撤回金额结算中" : item?.statusTipsMessage && this.tipMessage(item?.statusTipsMessage.replace(/\\n/g, "\n"))}
                                        />
                                    </RowCenterStart>
                                </RowCenterBetween>
                            </View>
                        );
                    })
                ) : (
                    <NoRecord text={translate("目前没有优惠记录")} />
                )}

                {
                    // Array.isArray(bonusListShow) && bonusListShow.length > pageSize &&
                    // <Pagination
                    //     current={currentPage}
                    //     total={Math.ceil(bonusListShow.length / pageSize)}
                    //     onChange={this.handlePageChange}
                    // />
                }
            </View>
        );
    }
}

const mapStateToProps = state => {};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(BonusFinish);
