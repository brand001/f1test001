import _ from "lodash";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { FormatDate, GetBonusGmt } from "$Utils";
import { ErrorCodeHandler } from "./../PromotionStatus.js";
import { translate } from "@/locales/translate";
import NoRecord from "$Components/NoRecord";
import BonusReadyItem from "./BonusReadyItem";
import Disclaimer from "./Disclaimer";
import styles from "./styles";

class BonusReady extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bonusList: this.props?.bonusList || [],
        };
    }

    componentDidMount() {
        this.bonusListShow();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.bonusList, this.props.bonusList)) {
            this.bonusListShow();
        }
    }

    //筛选显示list
    bonusListShow = () => {
        const now = moment();
        const bonusListShow = this.props?.bonusList?.filter(item => {
            const isShow =
                item.claimEndDateUtc && moment.utc(item.claimEndDateUtc).add(8, "hours").isAfter(now) && (this.props.sportSB ? item?.productGroups.map(v => v.productGroup).includes("SB") : true);
            return isShow;
        });
        return bonusListShow;
    };

    checkIsExpriy = expiredDate => {
        const now = moment();
        if (moment.utc(expiredDate).add(8, "hours").isBefore(now)) {
            ErrorCodeHandler({
                result: {
                    errorCode: "CP30015",
                },
                okFuntion: () => {
                    this.bonusListShow();
                },
            });
        } else {
        }
        return moment.utc(expiredDate).add(8, "hours").isBefore(now);
    };

    render() {
        const { sportSB, callBack } = this.props;
        const bonusListShow = this.bonusListShow();
        return (
            <View>
                {Array.isArray(bonusListShow) && bonusListShow.length > 0 ? (
                    <>
                        <Text style={styles.timeTop}>
                            {translate("最后更新时间: ")}
                            {FormatDate(moment(bonusListShow[0]?.updatedDateUtc).add(8, "h").utc())}{" "}
                            {GetBonusGmt()}
                        </Text>
                        {/* bonus list */}
                        <BonusReadyItem bonusList={bonusListShow} checkIsExpriy={this.checkIsExpriy} sportSB={sportSB} callBack={callBack} />
                        <Disclaimer text={[`${translate("请在优惠申请结束时间内，点击“开始优惠”进行优惠流水倍数累计，否则此优惠将无效并自动从页面移除")}`]} />
                    </>
                ) : (
                    <NoRecord text={translate("目前没有优惠记录")} />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => { };
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(BonusReady);
