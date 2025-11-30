import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
const { width } = Dimensions.get("window");
import ImgMap from "$locales/Images";
import { SuccessIcon, RafMailIcon, RafPhoneIcon, RafTurnoverIcon, RafUserIcon, RafDepositThIcon } from "$Components/icons/index";
import FilledButton from "$Components/FilledButton";
import { RowCenterStart } from "$Components/CustomView";
import styles from "./Styles";

const ProgressStepTH = ({ result, totalDeposits, totalBets, isDepositMet, isBetAmountMet, isRegisteredMet, IdentityCardStatus, phoneVerified, goDeposit, Verify }) => {
    if (!result) return null; // 避免 result 為空時渲染錯誤

    const totalDepositRequired = result?.campaignSignUpPreCondition?.totalDepositRequired ?? 0;
    const totalBetAmountRequired = result?.campaignSignUpPreCondition?.totalBetAmountRequired ?? 0;
    return (
        <View>
            {/* 步驟 1：存款 */}
            <StepItem
                stepNumber="1"
                title={`ยอดฝาก ${totalDepositRequired} บาท`}
                isCompleted={isDepositMet}
                isRegisteredMet={isRegisteredMet}
                stepSucess={totalDeposits >= totalDepositRequired}
                currentValue={totalDeposits}
                requiredValue={totalDepositRequired}
                icon={() => {
                    return <RafDepositThIcon
                        width={10}
                        height={10}
                        fill={isDepositMet ? "#00A6FF" : "#999999"}
                        wrapStyle={[styles.verifyIcon, {
                            backgroundColor: isDepositMet ? "#35C95B" : "#CCCCCC",
                        }]}
                    />;
                }}
                onPress={goDeposit}
            />

            {/* 步驟 2：投注 */}
            <StepItem
                stepNumber="2"
                title={`ยอดหมุนเวียน ${totalBetAmountRequired} บาท`}
                isCompleted={isBetAmountMet}
                isRegisteredMet={isRegisteredMet}
                stepSucess={totalBets >= totalBetAmountRequired}
                currentValue={totalBets}
                requiredValue={totalBetAmountRequired}
                icon={() => {
                    return <RafTurnoverIcon
                        width={10}
                        height={10}
                        fill={isBetAmountMet ? "#00A6FF" : "#999999"}
                        wrapStyle={[styles.verifyIcon, {
                            backgroundColor: isBetAmountMet ? "#35C95B" : "#CCCCCC",
                        }]}
                    />;
                }}
            />

            {/* 步驟 3：驗證 */}
            <VerifyStep
                stepNumber="3"
                title={"ยืนยันชื่อจริง & เบอร์โทร"}
                IdentityCardStatus={IdentityCardStatus}
                phoneVerified={phoneVerified}
                isRegisteredMet={isRegisteredMet}
                Verify={Verify}
                verifiedText="ยืนยันเรียบร้อย" //已验证
                notVerifiedText="ยังไม่ได้รับการยืนยัน" //未验证
                buttonText="ยืนยัน" // 进行验证
            />
        </View>
    );
};

//步驟組件
const StepItem = ({ stepNumber, title, isCompleted, isRegisteredMet, stepSucess, icon, currentValue, requiredValue, onPress }) => (
    <RowCenterStart style={styles.pageList}>
        <Text style={styles.num}>{stepNumber}</Text>
        <View style={styles.contentContainer}>
            <Text style={styles.pageapian}>{title}</Text>
            <RowCenterStart style={styles.sVerif}>
                {
                    icon && icon()
                }
                <Text
                    style={[
                        styles.pageapian1,
                        {
                            color: isCompleted ? "#222" : "#666",
                            paddingLeft: 5,
                        },
                    ]}>
                    ({currentValue} / {requiredValue})
                </Text>
            </RowCenterStart>

            {
                (!isCompleted && isRegisteredMet && onPress) &&
                <FilledButton
                    onPress={onPress}
                    wrapStyle={[styles.touchBtn]}
                    text={"ฝากเงิน"}
                    type='small'
                />
            }
        </View>
        <SuccessIcon width={18} height={18} type={stepSucess ? "fill" : "ring"} />
    </RowCenterStart>
);

// 3.電話跟信箱步驟
const VerifyStep = ({ stepNumber, title, isRegisteredMet, IdentityCardStatus, phoneVerified, Verify, verifiedText, notVerifiedText, buttonText }) => {
    return (
        <RowCenterStart style={styles.pageList}>
            <Text style={styles.num}>{stepNumber}</Text>
            <View style={{ width: "80%" }}>
                <Text style={styles.pageapian}>{title}</Text>
                <RowCenterStart style={styles.sVerif}>
                    <RafUserIcon
                        width={10}
                        height={10}
                        fill={IdentityCardStatus ? "#00A6FF" : "#999999"}
                        wrapStyle={[styles.verifyIcon, {
                            backgroundColor: IdentityCardStatus ? "#35C95B" : "#CCCCCC",
                        }]}
                    />
                    <Text style={[styles.pageapian1, { marginHorizontal: 5 }]}>{IdentityCardStatus ? verifiedText : notVerifiedText}</Text>

                    <RafPhoneIcon
                        width={10}
                        height={10}
                        fill={phoneVerified ? "#00A6FF" : "#999999"}
                        wrapStyle={[styles.verifyIcon, {
                            backgroundColor: phoneVerified ? "#35C95B" : "#CCCCCC",
                        }]}
                    />
                    <Text style={[styles.pageapian1, { marginLeft: 5 }]}>{phoneVerified ? verifiedText : notVerifiedText}</Text>
                </RowCenterStart>

                {
                    (!phoneVerified || !IdentityCardStatus) && isRegisteredMet &&
                    <FilledButton
                        onPress={Verify}
                        wrapStyle={styles.touchBtn}
                        text={buttonText}
                        type={"small"}
                    />
                }
            </View>
            <SuccessIcon width={18} height={18} type={!phoneVerified || !IdentityCardStatus ? "ring" : "fill"} />
        </RowCenterStart>
    );
};


export default ProgressStepTH;
