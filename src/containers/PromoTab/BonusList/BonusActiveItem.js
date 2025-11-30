import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { getMoneyFormat, GetBonusName, GetPromoProductGroupNameMapImg } from "$Utils";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { ColumnCenterCenter, RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import InfoBar from "$Components/InfoBar";
import Progress from "$Components/Progress";
import SwipeableCard from "$Components/SwipeableCard";

import BonusTimeEnd from "./BonusTimeEnd";
import styles from "./styles";
import { DeleteIcon, WarningIcon } from "$Components/icons/index";

function BonusActiveItem(props) {
    // props
    const { bonusList, drawableHandler, SignupBonusStatus, isTutorial } = props;

    // state
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [cardLayout, setCardLayout] = useState([{ width: 0, height: 135 }]);
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    const cardRefs = useRef(bonusList?.map(() => React.createRef()));

    // methods
    const _getCardLayout = (index, event) => {
        let { width, height } = event?.nativeEvent?.layout || {};
        cardLayout[index] = { width, height };
        setCardLayout(cardLayout);
    };

    return (
        <>
            {bonusList?.length &&
                bonusList?.map((item, index) => {
                    let { bonusStatusId = "", bonusRuleType = "", bonusGivenType = "", bonusGiven = "" } = item;
                    bonusRuleType = bonusRuleType?.toUpperCase();
                    bonusGivenType = bonusGivenType?.replace(/\s+/g, "").toUpperCase();

                    return (
                        <SwipeableCard
                            key={index}
                            isActive={activeCardIndex === index}
                            swipeHandler={isOpen => {
                                if (isOpen) {
                                    setActiveCardIndex(index); // 打开当前的
                                    drawableHandler && drawableHandler();
                                    PiwikEventDataHandle("BonusHistory13");
                                } else {
                                    // 如果当前收起的是已经打开的，才清空
                                    if (activeCardIndex === index) {
                                        setActiveCardIndex(null);
                                    }
                                }
                            }}
                            ableToSwipe={["PRE", "POST"].includes(bonusRuleType)}
                            ref={cardRefs.current[index]}
                            onPress={() => {
                                cardRefs.current.forEach((ref, i) => {
                                    if (i !== index) {
                                        ref.current?.reset();
                                    }
                                });
                            }}>
                            <View style={[styles.bonusList]} onLayout={_getCardLayout.bind(this, index)}>
                                {/* 标题 */}
                                <RowCenterBetween style={styles.bonusRow}>
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

                                {/* 优惠结束 */}
                                {bonusStatusId != 1 && (
                                    <RowCenterBetween style={styles.bonusRow}>
                                        <Text style={[styles.bonusMoney]}>{translate("结束倒数")}</Text>

                                        <BonusTimeEnd
                                            key={item?.bonusId}
                                            timeEnd={item?.expiredDate}
                                            callBack={() => {
                                                props?.callBack();
                                            }}
                                        />
                                    </RowCenterBetween>
                                )}

                                {/* 4: 'M3 审核中',不显示进度条 */}
                                {/* 累计进度 */}
                                <RowCenterBetween style={styles.bonusRow}>
                                    <RowCenterCenter>
                                        <Text style={[styles.bonusMoney]}>
                                            {translate("流水进度")} {"  "}
                                        </Text>
                                        {
                                            (![1, 4, 9].includes(bonusStatusId) && item?.progress != "-") &&
                                            <>
                                                <Text
                                                    style={[
                                                        styles.bonusMoney,
                                                        {
                                                            color: Color.theme,
                                                            fontWeight: "bold",
                                                        },
                                                    ]}>
                                                    {Math.floor(item?.progress?.split("/")[0])}
                                                </Text>
                                                <Text style={[styles.bonusMoney]}> / {Math.floor(item?.progress?.split("/")[1])}</Text>
                                            </>
                                        }
                                    </RowCenterCenter>

                                    {bonusStatusId == 9 ? (
                                        <Text style={[styles.bonusMoney, { color: Color.alertRed }]}>{translate("等待查询") || "等待查询"}</Text>
                                    ) : (
                                        bonusStatusId != 4 && bonusStatusId != 1 && <Text style={[styles.bonusMoney]}>{`${parseInt(item?.percentage || 0)}%`}</Text>
                                    )}

                                    {bonusStatusId == 1 && <Text style={styles.bonusMoney}>{translate("待处理") || "待处理"}</Text>}

                                    {bonusStatusId == 4 && (
                                        <Text titleStyle={styles.statusCheckItem}>{translate("待派发") || "待派发"}</Text>
                                    )}
                                </RowCenterBetween>

                                {/* 累计进度 */}
                                {bonusStatusId == 9 ? (
                                    <InfoBar type="warn" text={translate("此优惠无法进行流水累计，请联系在线客服协助确认")}>
                                        <WarningIcon width={16} height={16} fill={"#83630B"} direction="bottom" />
                                    </InfoBar>
                                ) : bonusStatusId == 4 ? (
                                    <InfoBar type="warn" text={translate("奖金正在审核中，请等待批准")} >
                                        <WarningIcon width={16} height={16} fill={"#83630B"} direction="bottom" />
                                    </InfoBar>
                                ) : (
                                    bonusStatusId != 1 && <Progress width={parseFloat(item?.percentage || 0)} />
                                )}
                            </View>

                            {activeCardIndex === index && (
                                <ColumnCenterCenter
                                    onPress={() => {
                                        if (isTutorial) return;
                                        SignupBonusStatus({ item, index });
                                        cardRefs.current[index]?.current?.reset();

                                        PiwikEventDataHandle({
                                            eventTitle: "BonusHistory14",
                                            customProperties: {
                                                Bonus_C_Cancel_ErrorMsg: "",
                                            },
                                        });
                                    }}
                                    style={[styles.activeDelaate, { height: cardLayout[index]?.height }]}
                                >
                                    <DeleteIcon
                                        fill={Color.white}
                                        width={30}
                                        height={30}
                                    />
                                    <Text style={styles.activeDelaateText}>{translate("取消")}</Text>
                                </ColumnCenterCenter>
                            )}
                        </SwipeableCard>
                    );
                })}
        </>
    );
}

export default BonusActiveItem;
