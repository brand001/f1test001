import React from "react";

import { Text, View } from "react-native";


import { SuccessIcon, RafMailIcon, RafPhoneIcon, RafTurnoverIcon, RafDepositCnIcon } from "$Components/icons/index";
import { RowCenterStart } from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
import styles from "./Styles";

const ProgressStepCN = ({ result, dateRegister, totalDeposits, totalBets, isDepositMet, isRegisteredMet, isBetAmountMet, isVerificationMet, emailVerified, phoneVerified, goDeposit, Verify }) => {
    if (!result) return null; // 避免 result 為空時渲染錯誤

    const totalDepositRequired = result?.campaignSignUpPreCondition?.totalDepositRequired ?? 0;
    const totalBetAmountRequired = result?.campaignSignUpPreCondition?.totalBetAmountRequired ?? 0;

    return (
        <View>
            {/* 步驟 1：存款 */}
            <StepItem
                stepNumber="1"
                title={"注册满一个月"}
                isCompleted={isRegisteredMet}
                currentValue={totalDeposits}
                dateRegister={dateRegister}
            />

            {/* 步驟 2 */}
            <DepositBetStep
                stepNumber="2"
                title={`总存款金额满${totalDepositRequired} 元并达 ${totalBetAmountRequired} 流水`}
                totalDepositRequired={totalDepositRequired}
                totalBetAmountRequired={totalBetAmountRequired}
                isRegisteredMet={isRegisteredMet}
                isDepositMet={isDepositMet}
                isBetAmountMet={isBetAmountMet}
                totalDeposits={totalDeposits}
                totalBets={totalBets}
                depositText="存款"
                betText="流水"
                onVerify={goDeposit}
                buttonText="马上存款"
            />

            {/* 步驟 3 */}
            <VerifyStep
                stepNumber="3"
                title={"验证邮箱和手机"}
                isRegisteredMet={isRegisteredMet}
                isVerificationMet={isVerificationMet}
                emailVerified={emailVerified}
                phoneVerified={phoneVerified}
                Verify={Verify}
                verifiedText="已验证"
                notVerifiedText="未验证"
                buttonText="进行验证"
            />
        </View>
    );
};

//步驟組件
const StepItem = ({ stepNumber, title, isCompleted, dateRegister }) => (
    <RowCenterStart style={styles.pageList}>
        <Text style={styles.num}>{stepNumber}</Text>
        <View style={styles.contentContainer}>
            <Text style={styles.pageapian}>{title}</Text>
            <RowCenterStart style={styles.sVerif}>
                <Text style={[styles.pageapian1]}>
                    您注册于
                    {dateRegister && typeof dateRegister === "string" ? `${dateRegister.split("T")[0].replace("-", "年").replace("-", "月")}日` : ""}
                </Text>
            </RowCenterStart>
        </View>
        <SuccessIcon width={18} height={18} type={isCompleted ? "fill" : "ring"} />
    </RowCenterStart>
);

// 2.存款和投注驗證步驟
const DepositBetStep = ({
    stepNumber,
    title,
    isDepositMet,
    isBetAmountMet,
    isRegisteredMet,
    totalDeposits,
    totalBets,
    totalDepositRequired,
    totalBetAmountRequired,
    depositText,
    betText,
    onVerify,
    buttonText,
}) => (
    <RowCenterStart style={styles.pageList}>
        <Text style={styles.num}>{stepNumber}</Text>
        <View style={{ width: "80%" }}>
            <Text style={styles.pageapian}>{title}</Text>
            <RowCenterStart style={styles.sVerif}>
                {/* 存款 */}
                <RafDepositCnIcon
                    width={10}
                    height={10}
                    fill={isDepositMet ? "#00A6FF" : "#999999"}
                    wrapStyle={[styles.verifyIcon, {
                        backgroundColor: isDepositMet ? "#35C95B" : "#CCCCCC",
                    }]}
                />

                <Text style={[styles.pageapian1, { marginHorizontal: 5 }]}>
                    {depositText}: ({totalDeposits}/{totalDepositRequired})
                </Text>

                {/* 流水 */}
                <RafTurnoverIcon
                    width={10}
                    height={10}
                    fill={isBetAmountMet ? "#00A6FF" : "#999999"}
                    wrapStyle={[styles.verifyIcon, {
                        backgroundColor: isBetAmountMet ? "#35C95B" : "#CCCCCC",
                    }]}
                />
                <Text style={[styles.pageapian1, { marginLeft: 5 }]}>
                    {betText}: ({totalBets}/{totalBetAmountRequired})
                </Text>
            </RowCenterStart>

            {
                (!isDepositMet && isRegisteredMet && onVerify) &&
                <FilledButton
                    onPress={onVerify}
                    wrapStyle={styles.touchBtn}
                    type='small'
                    text={buttonText}
                />
            }
        </View>
        <SuccessIcon width={18} height={18} type={isDepositMet && isBetAmountMet ? "fill" : "ring"} />
    </RowCenterStart>
);

// 3.電話跟信箱步驟
const VerifyStep = ({ stepNumber, title, isRegisteredMet, isVerificationMet, emailVerified, phoneVerified, Verify, verifiedText, notVerifiedText, buttonText }) => (
    <RowCenterStart style={styles.pageList}>
        <Text style={styles.num}>{stepNumber}</Text>
        <View style={{ width: "80%" }}>
            <Text style={styles.pageapian}>{title}</Text>
            <RowCenterStart style={styles.sVerif}>
                <RafMailIcon
                    width={10}
                    height={10}
                    fill={emailVerified ? "#00A6FF" : "#999999"}
                    wrapStyle={[styles.verifyIcon, {
                        backgroundColor: emailVerified ? "#35C95B" : "#CCCCCC",
                    }]}
                />
                <Text style={[styles.pageapian1, { marginHorizontal: 5 }]}>{emailVerified ? verifiedText : notVerifiedText}</Text>
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
                (!isVerificationMet && isRegisteredMet) &&
                <FilledButton
                    onPress={Verify}
                    text={buttonText}
                    wrapStyle={styles.touchBtn}
                    type='small'
                />
            }
        </View>
        <SuccessIcon width={18} height={18} type={isVerificationMet ? "fill" : "ring"} />
    </RowCenterStart>
);



export default ProgressStepCN;
