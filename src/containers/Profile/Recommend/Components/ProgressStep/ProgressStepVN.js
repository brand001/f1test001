import React from "react";

import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Touch from "react-native-touch-once";
const { width } = Dimensions.get("window");
import ImgMap from "$locales/Images";
import { SuccessIcon, RafMailIcon, RafPhoneIcon, RafTurnoverIcon, RafDepositVnIcon } from "$Components/icons/index";
import { RowCenterStart } from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
import styles from "./Styles";

const ProgressStepVN = ({ result, totalDeposits, totalBets, isDepositMet, isBetAmountMet, emailVerified, phoneVerified, goDeposit, Verify, isVerificationMet }) => {
    if (!result) return null; // 避免 result 為空時渲染錯誤

    const totalDepositRequired = result?.campaignSignUpPreCondition?.totalDepositRequired ?? 0;
    const totalBetAmountRequired = result?.campaignSignUpPreCondition?.totalBetAmountRequired ?? 0;

    return (
        <View>
            {/* 步驟 1：存款 */}
            <StepItem
                stepNumber="1"
                title={`Tiền gửi tháng này ${totalDepositRequired} đ`}
                isCompleted={isDepositMet}
                currentValue={totalDeposits}
                requiredValue={totalDepositRequired}
                icon={() => {
                    return <RafDepositVnIcon
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
                title={`Doanh thu tháng này ${totalBetAmountRequired} đ`}
                isCompleted={isBetAmountMet}
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
                title={"Xác Thực Email và Số Điện Thoại"}
                emailVerified={emailVerified}
                phoneVerified={phoneVerified}
                isVerificationMet={isVerificationMet}
                Verify={Verify}
                verifiedText="Đã Xác Thực" //已验证
                notVerifiedText="Chưa Xác Thực" //未验证
                buttonText="Xác Thực Ngay" // 进行验证
            />
        </View>
    );
};

//步驟組件
const StepItem = ({ stepNumber, title, isCompleted, currentValue, requiredValue, icon, checkIcon, uncheckIcon, onPress }) => (
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
                (!isCompleted && onPress) &&
                <FilledButton
                    onPress={onPress}
                    wrapStyle={styles.touchBtn}
                    text={"Xác Thực Ngay"}
                    type='small'
                />
            }
        </View>
        <SuccessIcon width={18} height={18} type={isCompleted ? "fill" : "ring"} />
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
                (!emailVerified || !phoneVerified) &&
                <FilledButton
                    onPress={Verify}
                    wrapStyle={styles.touchBtn}
                    text={buttonText}
                    type='small'
                />
            }
        </View>
        <SuccessIcon width={18} height={18} type={isVerificationMet ? "fill" : "ring"} />
    </RowCenterStart>
);


export default ProgressStepVN;
