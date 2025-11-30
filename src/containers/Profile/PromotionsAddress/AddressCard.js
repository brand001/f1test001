import React, { useRef, useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import SwipeableCard from "$Components/SwipeableCard";
import { RowCenterBetween, RowCenterCenter, RowCenterStart, ColumnCenterCenter } from "$Components/CustomView";
import { EditIcon, DeleteIcon } from "$Components/icons/index";
import Color from "$Components/Color";
import { translate } from "@/locales/translate";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { maskName } from "$Utils";
const { width } = Dimensions.get("window");

// 全局 ref 管理
const cardRefs = [];

const AddressCard = ({
    starLength,
    addressData,
    onDeleteAddress,
    onEditAddress,
    drawableHandler,
    isTutorial
}) => {
    const [cardLayout, setCardLayout] = useState([{ width: 0, height: 135 }]);
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    const cardRefs = useRef(addressData?.map(() => React.createRef()));

    const _getCardLayout = (index, event) => {
        let { width, height } = event?.nativeEvent?.layout || {};
        cardLayout[index] = { width, height };
        setCardLayout(cardLayout);
    };

    const handleSwipe = (isOpen, index) => {
        if (isOpen) {
            setActiveCardIndex(index);
            drawableHandler && drawableHandler();
            PiwikEventDataHandle("AddressSwipeOpen");
        } else {
            // 如果当前收起的是已经打开的，才清空
            if (activeCardIndex === index) {
                setActiveCardIndex(null);
            }
        }
    };

    const handleEdit = (value) => {
        onEditAddress({
            addressData: value
        });
    };

    const handleDelete = (value) => {
        if (isTutorial) return;
        onDeleteAddress({ addressId: value.addressId, isPop: false });
        cardRefs.current[addressData.findIndex(addr => addr.addressId === value.addressId)]?.current?.reset();
    };

    const handleCardPress = (index) => {
        // 重置其他卡片的狀態
        cardRefs.current.forEach((ref, i) => {
            if (i !== index) {
                ref.current?.reset();
            }
        });
    };

    let showCommas = window.LANGUAGE == "CN" ? " " : ", ";
    return (
        <>
            {addressData?.length &&
                addressData?.map((value, index) => {
                    let {
                        recipientName,
                        isPrimary,
                        phoneNumber,
                        province,
                        district,
                        city,
                        address,
                        zipCode,
                        addressLabel
                    } = value;

                    zipCode = zipCode.slice(0, 2) + "*".repeat(3);

                    return (
                        <SwipeableCard
                            key={index}
                            isActive={activeCardIndex === index}
                            swipeHandler={(isOpen) => handleSwipe(isOpen, index)}
                            ableToSwipe={true}
                            ref={cardRefs.current[index]}
                            onPress={() => handleCardPress(index)}
                            style={{ width: width - 32 }}
                        >
                            <View
                                style={styles.listBox}
                                onLayout={_getCardLayout.bind(this, index)}
                            >
                                <RowCenterBetween>
                                    <RowCenterStart style={{ width: "80%" }}>
                                        <Text style={styles.addressAcont1} numberOfLines={1}>
                                            {addressLabel}
                                        </Text>

                                        {index == 0 && (
                                            <RowCenterCenter style={styles.primaryBadge}>
                                                <Text style={styles.defulTxt}>
                                                    {translate("默认address")}
                                                </Text>
                                            </RowCenterCenter>
                                        )}
                                    </RowCenterStart>

                                    <EditIcon
                                        onPress={() => handleEdit(value)}
                                        width={24}
                                        height={24}
                                        fill={Color.silverGray}
                                    />
                                </RowCenterBetween>

                                <RowCenterStart style={{ marginVertical: 8 }}>
                                    <Text style={styles.recipientName}>
                                        {maskName(recipientName)}
                                    </Text>
                                    <Text style={styles.phoneNumber}>
                                        + {window.DefaultConfig?.countryCallingCode} {"*".repeat(starLength || 0)} {phoneNumber.slice(-4)} {/* starLength: {starLength} */}
                                    </Text>
                                </RowCenterStart>

                                <Text style={styles.addressAcont} numberOfLines={2}>
                                    {`${province.replace(/\d/g, "*")}${showCommas}${district.replace(/\d/g, "*")}${showCommas}${city.replace(/\d/g, "*")}${showCommas}${address.replace(/\d/g, "*")}, ${zipCode}`}
                                </Text>
                            </View>

                            {activeCardIndex === index && (
                                <ColumnCenterCenter
                                    onPress={() => handleDelete(value)}
                                    style={[styles.activeDelete, { height: cardLayout[index]?.height || 135 }]}
                                >
                                    <DeleteIcon
                                        fill={Color.white}
                                        width={30}
                                        height={30}
                                    />
                                    <Text style={styles.activeDeleteText}>
                                        {translate("刪除")}
                                    </Text>
                                </ColumnCenterCenter>
                            )}
                        </SwipeableCard>
                    );
                })}
        </>
    );
};

export default AddressCard;


const styles = StyleSheet.create({
    listBox: {
        backgroundColor: "#fff",
        borderRadius: 6,
        marginBottom: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        width: width - 30,
    },
    defulTxt: {
        fontSize: 12,
        color: "#F0A800",
        fontWeight: "400",
    },
    addressAcont1: {
        color: "#222",
        fontSize: 14,
        fontWeight: "600",
    },
    addressAcont: {
        fontSize: 14,
        color: "#666",
        fontWeight: "400",
    },
    activeDelete: {
        width: 60,
        backgroundColor: Color.alertRed,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    activeDeleteText: {
        color: Color.white,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 5,
    },
    primaryBadge: {
        backgroundColor: "#F5F5F5",
        height: 24,
        paddingHorizontal: 6,
        marginLeft: 8,
        borderRadius: 6
    },
    recipientName: {
        fontSize: 14,
        fontWeight: "400",
        color: "#222",
        marginRight: 8,
        maxWidth: "70%"
    },
    phoneNumber: {
        fontSize: 14,
        fontWeight: "400",
        color: "#999"
    }
});
