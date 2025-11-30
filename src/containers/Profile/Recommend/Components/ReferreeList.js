import React from "react";

/**
 * 推薦好友列表組件
 * @param {Array} referreeList - 推薦好友列表數據
 * @param {Object} ReferreeListStatus - 狀態配置對象
 *
 */
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import Color from "$Components/Color";
import NoRecord from "$Components/NoRecord";
import { FormatDate } from "$Utils";
import { ColumnCenterCenter, RowCenterStart } from "$Components/CustomView";
import { ImagesUrl } from "@/images/index";
import RafNumberTag from "$Components/RafNumberTag";

const { width } = Dimensions.get("window");

const ReferreeList = ({ referreeList = [] }) => {
    //M2獎金列表狀態
    const ReferreeListStatus = {
        1: {
            text: "กำลังดำเนินการ", // 處理中
            color: "#F0A800",
        },
        2: {
            text: "สำเร็จ", // 成功
            color: "#0CCC3C",
        },
        3: {
            text: "กำลังดำเนินการ", // 處理中
            color: "#F0A800",
        },
        4: {
            text: "กำลังดำเนินการ", // 處理中
            color: "#F0A800",
        },
        5: {
            text: "ไม่สำเร็จ", // 失敗
            color: "#EB2121",
        },
    };

    //標題數據
    const titles = [
        { id: "registerDate", text: "ววันที่สมัคร" },
        { id: "transactionId", text: "วหมายเลขธุรกรรม" },
        { id: "bonus", text: "วโบนัส" },
        { id: "status", text: "วสถานะ" },
    ];

    //Value數據
    const List = [
        { id: "registerDate", getValue: item => FormatDate(item?.dateRegister, { timeLevel: "onlyDate" }) },
        {
            id: "transactionId",
            getValue: item => item?.refereeTierDetail?.referrerTransactionID || "-",
        },
        {
            id: "bonus",
            getValue: item => `฿ ${item?.refereeTierDetail?.referrerPayoutAmount}`,
        },
        {
            id: "status",
            getValue: item => ReferreeListStatus[item?.refereeTierDetail?.referrerPayoutStatus]?.text,
            getStyle: item => ({
                color: ReferreeListStatus[item?.refereeTierDetail?.referrerPayoutStatus]?.color,
            }),
        },
    ];

    const ListTitles = () => {
        return (
            <View style={{ marginLeft: 20 }}>
                {titles.map(title => (
                    <Text key={title.id} style={styles.listTitle}>
                        {title.text}
                    </Text>
                ))}
            </View>
        );
    };

    const ListData = ({ item }) => {
        return (
            <View style={{ marginLeft: 15 }}>
                {List.map(dataItem => (
                    <Text key={dataItem.id} style={[styles.listText, dataItem.getStyle ? dataItem.getStyle(item) : null]}>
                        {dataItem.getValue(item)}
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <>
            <Text style={styles.titles}>เพื่อนที่แนะนำ</Text>
            {Array.isArray(referreeList) && referreeList.length > 0 ? (
                referreeList.map((item, index) => {
                    return (
                        <RowCenterStart key={index} style={styles.container}>
                            <ColumnCenterCenter style={styles.innerIcon}>
                                <RafNumberTag
                                    number={index + 1}
                                    colors={["#6DCAFF", "#00A6FF"]}
                                />
                            </ColumnCenterCenter>

                            <View>
                                <Image resizeMode="stretch" source={ImagesUrl.posinoQueleaReferreeListPhoto} style={styles.photoIcon} />
                            </View>

                            {/* 列表標題區塊 */}
                            <ListTitles />

                            {/* 列表值區塊 */}
                            <ListData item={item} />
                        </RowCenterStart>
                    );
                })
            ) : (
                <NoRecord text={"ไม่พบข้อมูล"} textStyle={styles.noRecordTxt} wrapStyle={styles.noRecord} imgStyle={{ width: 68, height: 68 }} />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        height: 117,
        width: width - 30,
        paddingRight: 15,
        paddingLeft: 25,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    innerIcon: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 36,
        height: 40,
    },
    titles: {
        fontSize: 14,
        color: Color.charcoal,
        fontWeight: "500",
        marginBottom: 15,
    },
    photoIcon: {
        width: 65,
        height: 65,
        marginLeft: 15,
    },
    listTitle: {
        fontSize: 12,
        color: Color.gray,
        marginBottom: 8,
    },
    listText: {
        fontSize: 14,
        color: "#3C3C3C",
        marginBottom: 8,
    },
    noRecord: {
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
        paddingHorizontal: 0,
    },
    noRecordTxt: {
        fontSize: 14,
        color: Color.gray,
    },
});

export default ReferreeList;
