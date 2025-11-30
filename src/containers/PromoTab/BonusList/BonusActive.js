import _ from "lodash";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { SignupBonusStatus } from "./../PromotionStatus.js";
import { translate } from "@/locales/translate";
import DropDownSelectArray from "$Components/DropDownSelectArray";
import { GetGlobalModal } from "$Utils/globalModal";
import NoRecord from "$Components/NoRecord";
import { Toasts } from "$Toasts";
import { FormatDate } from "$Utils";
import StorageUtil from "$Utils/Storage";
import BonusActiveItem from "./BonusActiveItem";
import Disclaimer from "./Disclaimer";
import { BonusActiveDropDownSelect } from "./DropDownSelectTip";
import styles from "./styles";

const pageSize = 50;

class BonusActive extends React.Component {
    constructor(props) {
        super(props);
        let categories = this.props.sportSB ? this.props.moneyData.findIndex(v => v?.walletProductGroupCode == "SB") : 0;
        this.state = {
            categories: categories, // 當前選中的錢包
            bonusList: this.props?.bonusList || [],
            LateralMovement: 0,
            cancelBonusModal: false, // 重要提示 - 再次確認是否取消優惠
            cancelBonusType: "", // 欲取消的 bonus type
            cancelBonusKey: null, // 欲取消的 bonus index
            cancellationEligibilityData: null,
            currentPage: 1,
        };
    }

    componentDidMount() {
        this.filterBonusList();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.bonusList, this.props.bonusList)) {
            this.filterBonusList();
        }
    }

    //计算总数
    getTotal = list => {
        let total = 0;
        list.forEach(item => {
            const bonusGiven = item.bonusGiven;
            if (bonusGiven) {
                const upBonusGiven = bonusGiven.toUpperCase().replace(/\¥/gi, "").replace(/\,/gi, "");
                total = total + parseFloat(upBonusGiven);
            }
        });
        return total;
    };
    //筛选显示list
    bonusListShow = bonusList => {
        // const { bonusList } = this.props
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

        const bonusListShow = bonusList?.filter(v => {
            const isShow = v.bonusStatusId == 1 || v.bonusStatusId == 3 || v.bonusStatusId == 4 || v.bonusStatusId == 9;
            return isShow;
        });

        return bonusListShow;
    };

    // 錢包類別
    categories = (categories = 0) => {
        this.setState({ categories }, () => {
            this.filterBonusList();
        });
    };

    filterBonusList = () => {
        // 從當前的 bonus list 篩選
        const { categories } = this.state;
        const { bonusList, moneyData } = this.props;

        const wallet = moneyData[categories]?.walletProductGroupCode;
        const filterData = categories == 0 ? bonusList : bonusList?.filter(item => item.productGroup == wallet);
        const bonusListShow = this.bonusListShow(filterData);

        this.setState({ bonusList: bonusListShow }, () => {
            this.openTutorial();
        });
    };

    getCancellationEligibility = ({ item, index }) => {
        // 確認取消資格
        const { playerBonusId, bonusRuleType } = item;

        this.setState({ cancelBonusKey: index });

        if (bonusRuleType?.toUpperCase() == "POST") {
            this.setState({
                cancelBonusModal: true,
                cancelBonusType: "POST", // POST bonus -> 已累计的有效流水捋会失效
            });
            return;
        }

        Toasts.loading(translate("加载中,请稍候..."), 30);
        const url = ApiPort.CancellationEligibility + `playerBonusId=${playerBonusId}&`;
        fetchRequest(url, "GET")
            .then(res => {
                Toasts.removeAll();
                const result = res?.result;
                if (res?.isSuccess) {
                    this.setState({
                        cancellationEligibilityData: result,
                        cancelBonusModal: true,
                    });
                } else {
                    const { moneyData } = this.props;

                    let { errorCode = "", data = {} } = result;
                    let { productGroupName = "", productVendors = [] } = data;

                    let name = Array.isArray(productVendors) && productVendors.length == 1 ? productVendors[0] : productGroupName;

                    //   Add the vendor name in the content when only one vender under the unsettle.
                    // If it has several vendor under the unsettle, it will display category name.
                    //  当未结算的供应商只有一个时，在内容中添加供应商名称。
                    //  如果未结算的供应商有多个，则显示类别名称。

                    const cancelFailedMsg = errorCode == "BP00120" ? `${name}\n${translate("尚有投注未结算，请稍后再试")}` : errorCode == "BP10015" && "目前账户余额低于已获得的预付红利";

                    {
                        /* 取消優惠 失敗 */
                    }
                    if (cancelFailedMsg) {
                        GetGlobalModal({
                            title: translate("取消失败") || "取消失败",
                            message: cancelFailedMsg,
                            confirmText: translate("我知道了"),
                            onConfirm: () => {},
                        });
                    } else {
                        Toasts.fail(translate("取消失败"), 1.5);
                    }
                }
            })
            .catch(err => {
                Toasts.fail("网络故障，请稍后再试", 1.5);
            })
            .finally(() => {
                //  Toasts.removeAll()
            });
    };

    postCancellation = () => {
        // 取消 bonus
        PiwikEventDataHandle("BonusHistory15");
        const { cancelBonusKey, bonusList } = this.state;
        const { playerBonusId } = bonusList[cancelBonusKey] || [];

        this.setState({ cancelBonusModal: false });

        Toasts.loading(translate("加载中,请稍候..."), 30);

        const url = ApiPort.Cancellation + `playerBonusId=${playerBonusId}&Remark=Remark&`;
        fetchRequest(url, "POST")
            .then(res => {
                if (res && res?.isSuccess) {
                    this.state.bonusList.splice(cancelBonusKey, 1);
                    this.setState({
                        bonusList: this.state.bonusList,
                    });
                    Toasts.success(translate("已取消"), 2000, () => {
                        this.props?.callBack();
                    });
                } else {
                    Toasts.fail(translate("取消失败"), 2);
                }
            })
            .catch(err => {
                Toasts.fail("网络故障，请稍后再试", 1.5);
            })
            .finally(() => {
                Toasts.removeAll();
            });
    };

    openTutorial = async () => {
        let key = `bonusActiveTutorialO${memberCode}`;
        let data = await StorageUtil.load(key);
        if (data) return;
        if (this.state.bonusList?.length) {
            GetGlobalModal({
                name: "SwipeableCardTipModal",
                wrapStyle: { width: "100%" },
                position: "top",
                modalData: {
                    modalChildren: <BonusActiveItem
                        bonusList={[this.state.bonusList[0]]}
                        sportSB={this.props.sportSB}
                        isTutorial={true}
                    />,
                    direction: "top",
                },
                modalCallBack: () => {
                    StorageUtil.save({
                        key,
                        data: true
                    });
                },
                allowSwipeable: true,
            });
        }
    };


    handlePageChange = pageNumber => {
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const {
            bonusList,
            cancelBonusModal,
            cancelBonusType,
            cancellationEligibilityData,

            currentPage,
        } = this.state;
        const { sportSB, moneyData } = this.props;

        const { applyAmount, bonusGivenAmount, pullbackAmount, unlockAmount, winningAmount, isTurnoverProgress } = cancellationEligibilityData || {};

        // 获取当前页的数据
        const startIndex = (currentPage - 1) * pageSize;

        return (
            <View>
                {/* <Text onPress={() => {
                    this.setState({
                        cancelBonusModal: true
                    })
                }}>123123</Text> */}
                {/* 重要提示 */}
                <BonusActiveDropDownSelect
                    modalVisible={cancelBonusModal}
                    closeModal={() => {
                        this.setState({
                            cancelBonusType: "",
                            cancelBonusModal: false,
                        });
                    }}
                    confirm={() => {
                        this.setState({
                            cancelBonusModal: false,
                        });

                        PiwikEventDataHandle("BonusHistory16");
                    }}
                    cancelBonusType={cancelBonusType}
                    isTurnoverProgress={isTurnoverProgress}
                    winningAmount={winningAmount}
                    bonusGivenAmount={bonusGivenAmount}
                    pullbackAmount={pullbackAmount}
                    onPress={this.postCancellation.bind(this)}
                />

                {/* 全部账户 */}
                {Boolean(!sportSB && this.props?.bonusList?.length) && (
                    <DropDownSelectArray
                        title={translate("请选择游戏类别")}
                        realKey="walletProductGroupName"
                        data={moneyData}
                        onChange={({ key }) => {
                            this.categories(key);

                            PiwikEventDataHandle({
                                eventTitle: "BonusHistory11",
                                customProperties: {
                                    Bonus_C_FilterCategory: moneyData[key]?.walletProductGroupName,
                                },
                            });
                        }}
                        callBack={() => {
                            PiwikEventDataHandle("BonusHistory12");
                        }}
                        buttonStyle={[styles.herderSelectList]}
                    />
                )}

                {Array.isArray(bonusList) && bonusList?.length > 0 ? (
                    <>
                        <Text style={[styles.timeTop, { marginTop: 10 }]}>
                            {translate("最后更新时间")} {FormatDate(new Date())}
                        </Text>
                        {/* bonus list */}
                        <BonusActiveItem
                            bonusList={bonusList}
                            SignupBonusStatus={({ item, index }) => {
                                //https://arcadie.atlassian.net/browse/CXF1-7603
                                let { bonusCategory } = item;
                                bonusCategory = bonusCategory?.replace(/\s+/g, "").toUpperCase();
                                if (bonusCategory == "SIGNUPBONUS") {
                                    SignupBonusStatus({
                                        productGroup: item?.productGroup,
                                        callBack: () => {
                                            this.getCancellationEligibility({ item, index });
                                        },
                                    });
                                } else {
                                    this.getCancellationEligibility({ item, index });
                                }
                            }}
                            callBack={this.props?.callBack.bind(this)}
                        />

                        {
                            // bonusList?.length > pageSize &&
                            // <Pagination
                            //     current={currentPage}
                            //     total={Math.ceil(bonusList?.length / pageSize)}
                            //     onChange={this.handlePageChange}
                            // />
                        }
                        <Disclaimer
                            text={[
                                `1. ${translate("在您完成{可得彩金}的彩金条件后，请点击【可领取】以获取彩金")}`,
                                `2. ${translate("未在时间内完成彩金条件，已派发的{预付彩金}将自动撤销")}`,
                                `3. ${translate("有效流水将优先用于满足彩金优惠流水需求, 剩余的有效流水将随后计入您的返水")}`,
                            ]} />
                    </>
                ) : (
                    <NoRecord text={translate("目前没有优惠记录")} />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(BonusActive);
