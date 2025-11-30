import moment from "moment";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { GetAppliedHistory } from "@/actions/CmsApi";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import CustomScrollView from "$Components/CustomScrollView";
import LoadingBone from "$Components/LoadingBone";
import { GetGlobalModal } from "$Utils/globalModal";

import BonusActive from "./BonusActive";
import BonusFinish from "./BonusFinish";
import BonusReady from "./BonusReady";
import BonusReceive from "./BonusReceive";
import styles from "./styles";
import { ColumnCenterCenter, RowCenterBetween } from "$Components/CustomView";
const { width } = Dimensions.get("window");

const TabsList = [
    {
        name: "待开始",
        width: window.LANGUAGE == "CN" ? 0.25 : 0.25,
    },
    {
        name: "进行中",
        width: window.LANGUAGE == "CN" ? 0.25 : 0.32,
    },
    {
        name: "可领取",
        width: window.LANGUAGE == "CN" ? 0.25 : 0.2,
    },
    {
        name: "已完成",
        width: window.LANGUAGE == "CN" ? 0.25 : 0.23,
    },
];

class BonusList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bonusList: [],
            readyBonusList: [], //ready bonus
            loading: false,
            scrollViewKey: 0
        };
    }

    async componentDidMount(flag = false) {
        PiwikEventDataHandle("BonusHistory1");

        await GetGlobalModal({
            name: "OneWalletTipModal",
            modalData: { page: "MyBonus" },
            wrapStyle: { width: "100%" },
        });

        await Promise.all([this.getBonusApplications(flag), this.getReadyBonusApplications()]);
    }

    // 按时间API获取红利
    getBonusApplications = async flag => {
        if (!flag) {
            this.setState({
                loading: true,
            });
        }

        // this.setState({
        //     bonusList: [],
        // })
        const params = {
            startDate: moment().utcOffset(8).subtract(90, "days").format("YYYY-MM-DD"),
            endDate: moment().utcOffset(8).format("YYYY-MM-DD"),
            wallet: 0,
        };

        try {
            const res = await GetAppliedHistory(params);
            this.setState({
                bonusList: res || [],
                loading: false,
            });
        } catch (error) {
            this.setState({
                bonusList: [],
                loading: false,
            });
        }
    };

    // 獲取待開始之優惠
    getReadyBonusApplications = async () => {
        // this.setState({
        //     readyBonusList: []
        // })
        try {
            const res = await fetchRequest(ApiPort.CampaignAssignedClaims, "GET");
            const { isSuccess = false, result = {} } = res;
            const { data = [] } = result;

            this.setState({
                readyBonusList: isSuccess && result?.isSuccess && data?.length ? data : [],
            });
        } catch (error) {
            this.setState({
                readyBonusList: [],
            });
        }
    };

    render() {
        const { bonusList, readyBonusList, loading, scrollViewKey } = this.state;

        const { sportSB, bonusListTabsActive } = this.props;

        let moneyData = JSON.parse(JSON.stringify(this.props?.userInfo?.allBalance)) || [];
        if (moneyData.length > 0) {
            moneyData[0].walletProductGroupName = translate("全部");
        }

        return (
            <View style={[styles.viewContainer, { paddingHorizontal: 0, paddingTop: 0 }]}>
                <RowCenterBetween style={styles.tabs}>
                    {TabsList.map((item, index) => {
                        let flag = bonusListTabsActive === index;
                        return (
                            <ColumnCenterCenter
                                key={index}
                                style={[
                                    styles.tabsList,
                                    {
                                        width: width * item.width,
                                        borderBottomColor: flag ? Color.theme : Color.transparent,
                                    },
                                ]}
                                onPress={() => {
                                    this.props.changeBonusListTabs(index);

                                    PiwikEventDataHandle("BonusHistory" + (index + 1));
                                }}>
                                <Text
                                    style={[
                                        styles.tabsItem,
                                        {
                                            fontWeight: flag ? "600" : "400",
                                            color: flag ? Color.theme : Color.darkGray
                                        },
                                    ]}>
                                    {translate(item.name)}
                                </Text>
                            </ColumnCenterCenter>
                        );
                    })}
                </RowCenterBetween>

                <CustomScrollView
                    onRefresh={async () => {
                        await this.componentDidMount(true);
                    }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true} // 安卓必须加
                    style={styles.viewContainer}
                    getScrollHeight={({ offsetY }) => {
                        this.setState({
                            scrollViewKey: offsetY
                        });
                    }}
                >
                    {loading ? (
                        <LoadingBone />
                    ) : (
                        <>
                            {
                                bonusListTabsActive == 0 &&
                                <BonusReady
                                    {...this.props}
                                    bonusList={readyBonusList}
                                    sportSB={sportSB}
                                    callBack={() => {
                                        Actions.pop();
                                        Actions.jump("Promotion");
                                        this.props.changeBonusListTabs(1);
                                        this.componentDidMount(true);
                                    }}
                                />
                            }

                            {
                                bonusListTabsActive == 1 &&
                                <BonusActive
                                    {...this.props}
                                    bonusList={bonusList}
                                    sportSB={sportSB}
                                    callBack={() => {
                                        this.componentDidMount(true);
                                    }}
                                    moneyData={moneyData}
                                />
                            }

                            {
                                bonusListTabsActive == 2 &&
                                <BonusReceive
                                    {...this.props}
                                    bonusList={bonusList}
                                    callBack={() => {
                                        this.componentDidMount(true);
                                    }}
                                    sportSB={sportSB}
                                />
                            }

                            {
                                bonusListTabsActive == 3 &&
                                <BonusFinish
                                    {...this.props}
                                    moneyData={moneyData}
                                    sportSB={sportSB}
                                    scrollViewKey={scrollViewKey}
                                />}
                        </>
                    )}
                </CustomScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BonusList);
