import _ from "lodash";
import React from "react";
import { Image, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { getMoneyFormat, GetPromoProductGroupNameMapImg } from "$Utils";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import NoRecord from "$Components/NoRecord";
import actions from "$LIB/redux/actions/index";
import { Toasts } from "$Toasts";
import FilledButton from "$Components/FilledButton";

import BonusTimeEnd from "./BonusTimeEnd";
import { BonusReceiveeDropDownSelect } from "./DropDownSelectTip";
import { CheckedIcon } from "$Components/icons/index";
import styles from "./styles";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";

class BonusReceive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            successModel: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.bonusList, this.props.bonusList)) {
            this.bonusListShow();
        }
    }

    bonusClaim = playerBonusId => {
        const data = {
            playerBonusId,
        };

        Toasts.loading(translate("加载中,请稍候..."), 50);
        fetchRequest(ApiPort.BonusClaim, "POST", data)
            .then(res => {
                Toasts.removeAll();
                if (res?.isSuccess && res?.result?.isClaimed) {
                    this.successModalHandler(true);
                    this.props?.callBack();
                    this.props.userInfo_getBalance();
                } else {
                    Toasts.fail(res?.message || res?.result?.message || "领取失败", 1.5);
                }
            })
            .catch(() => {
                Toasts.removeAll();
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
        // 6: 'M3 完成'
        // 7: 'M3 领取'
        // 8: 'M3 已过期'
        // 9: 'M3 等待查询'

        const { sportSB } = this.props;

        const bonusListShow = this.props?.bonusList?.filter(v => {
            const isShow = v.bonusStatusId == 7 && (sportSB ? v.productGroup == "SB" : true);
            return isShow;
        });
        return bonusListShow;
    };

    successModalHandler = (successModel = false) => {
        PiwikEventDataHandle("BonusHistory18");
        this.setState({
            successModel,
        });
    };

    render() {
        const { successModel } = this.state;

        //筛选显示
        const bonusListShow = this.bonusListShow();
        return (
            <View>
                {/* <Text
                    onPress={() => {
                        this.setState({
                            successModel: true,
                        });
                    }}>
                    123123
                </Text> */}
                {/* 红利领取成功 */}
                <BonusReceiveeDropDownSelect
                    modalVisible={successModel}
                    closeModal={this.successModalHandler.bind(this, false)}
                    isToggleBalance={this.props?.userInfo?.isToggleBalance}
                    goLockedBalance={() => {
                        this.successModalHandler(false);
                        Actions.LockedBalance();
                    }}
                    onPress={this.successModalHandler}
                />

                {Array.isArray(bonusListShow) && bonusListShow.length > 0 ? (
                    bonusListShow.map((item, index) => {
                        return (
                            <View style={[styles.bonusList, { paddingBottom: 0 }]} key={index}>
                                {/* 标题 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <Text style={[styles.bonusTitle]}>{item?.bonusName || item?.promotionTitle || item?.bonusTitle}</Text>

                                    {GetPromoProductGroupNameMapImg({
                                        productGroup: item?.productGroup,
                                    })}
                                </RowCenterBetween>

                                {/* 预付红利 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <Text style={[styles.bonusMoney, { fontSize: 14 }]}>{translate("可得彩金2") || "可得红利"}</Text>
                                    <Text style={[styles.bonusMoneyItem]}>{getMoneyFormat(item?.bonusGiven)}</Text>
                                </RowCenterBetween>

                                {/* 优惠结束 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <Text style={[styles.bonusMoney]}>{translate("结束倒数")}</Text>
                                    <BonusTimeEnd
                                        key={item?.bonusId}
                                        timeEnd={item?.expiredDate}
                                        callBack={() => {
                                            this.props?.callBack();
                                        }}
                                    />
                                </RowCenterBetween>

                                {/* 累计进度 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={[styles.bonusMoney]}>
                                            {translate("流水进度") || "流水进度"} {" "}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.bonusMoney,
                                                {
                                                    color: Color.theme,
                                                    fontWeight: "bold",
                                                },
                                            ]}>
                                            {getMoneyFormat(item?.progress?.split("/")[0])}
                                        </Text>
                                        <Text style={[styles.bonusMoney]}> / {getMoneyFormat(item?.progress?.split("/")[1])}</Text>
                                    </View>

                                    <RowCenterStart>
                                        <CheckedIcon width={28} height={28} />
                                        <Text style={[styles.bonusMoney, { color: Color.theme, marginLeft: 4 }]}>{translate("已完成2") || "已完成"}</Text>
                                    </RowCenterStart>
                                </RowCenterBetween>

                                {/* 领取 */}
                                <FilledButton
                                    text={translate("领取彩金")}
                                    onPress={() => {
                                        this.bonusClaim(item?.playerBonusId);
                                        PiwikEventDataHandle("BonusHistory17");
                                    }}
                                    wrapStyle={styles.receiveBtn}
                                    variant="light"
                                    type="xlarge"
                                />
                            </View>
                        );
                    })
                ) : (
                    <NoRecord text={translate("目前没有优惠记录")} />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    Balance: state.Balance,
    userInfo: state.userInfo,
});
const mapDispatchToProps = {
    userInfo_getBalance: actions.ACTION_UserInfo_getBalanceAll,
};
export default connect(mapStateToProps, mapDispatchToProps)(BonusReceive);
