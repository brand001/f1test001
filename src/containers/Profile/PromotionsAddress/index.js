import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Actions } from "react-native-router-flux";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { AddIcon, WarningIcon } from "$Components/icons/index";
import InfoBar from "$Components/InfoBar";
import AddressCard from "./AddressCard";
import StorageUtil from "$Utils/Storage";
import { usePromotionsAddress } from "@/hook/usePromotionsAddress";

/**
 * 促銷地址列表組件
 * 
 * 顯示用戶的促銷地址列表，支持新增、編輯和刪除地址
 * 首次有地址時會顯示滑動刪除的教程提示
 */
const PromotionsAddress = () => {
    // 從 usePromotionsAddress hook 獲取的狀態和方法
    const {
        addressData, // 地址數據列表（已排序，默認地址在前）
        getAddress, // 獲取地址列表的方法
        showDeleteConfirmModal, // 顯示刪除確認模態框的方法 @param {Object} params - 刪除參數對象 @param {string} params.addressId - 要刪除的地址 ID @param {boolean} params.shouldPop - 是否在刪除後返回上一頁，默認為 false
        getMemberCode, // 獲取會員代碼的方法 @returns {string} 會員代碼
        MaxAddressLength, // 最大地址數量限制
        StarLengthMap, // 星號長度映射表（根據語言返回對應的星號長度） @type {Object} { CN: 6, TH: 5, VN: 5 }
    } = usePromotionsAddress();

    /**
     * 處理地址數據並顯示教程
     * 
     * 當有地址數據且用戶尚未看過教程時，顯示滑動刪除的教程提示
     */
    useEffect(() => {
        const onHandleAddressData = async () => {
            if (!(Array.isArray(addressData) && addressData.length > 0)) return;

            // 如果有地址數據，顯示教程
            const memberCode = window.memberCode;
            //onGetMemberCode();
            const tutorialStorageKey = `addressTutorialO${memberCode}`;
            const hasShownTutorial = await StorageUtil.load(tutorialStorageKey);
            if (hasShownTutorial) return;

            GetGlobalModal({
                name: "SwipeableCardTipModal",
                position: "top",
                wrapStyle: { width: "100%" },
                modalData: {
                    modalChildren: <AddressCard
                        addressData={[addressData[0]]}
                        onDeleteAddress={showDeleteConfirmModal}
                        isTutorial={true}
                    />,
                    direction: "bottom",
                    text: "左滑可删除地址"
                },
                modalCallBack: () => {
                    StorageUtil.save({
                        key: tutorialStorageKey,
                        data: true
                    });
                },
                allowSwipeable: true,
            });
        };

        onHandleAddressData();
    }, [addressData?.length]);

    return (
        <View style={styles.viewContainer}>
            <ScrollView>
                <InfoBar
                    type={"warn"}
                    size="large"
                    wrapStyle={{ marginVertical: 15, alignItems: "center" }}
                    text={translate("收货地址用于寄送实体奖励，优先使用默认地址")}
                >
                    <WarningIcon width={16} height={16} fill={"#83630B"} direction="bottom" type="ring" />
                </InfoBar>

                {Array.isArray(addressData) && addressData.length > 0 && (
                    <AddressCard
                        starLength={StarLengthMap[window.LANGUAGE]}
                        addressData={addressData}
                        onDeleteAddress={showDeleteConfirmModal}
                        onEditAddress={({ addressData: editAddressData }) => {
                            // 處理手機號碼格式（移除國家代碼前綴）
                            editAddressData.phoneNumber = editAddressData?.phoneNumber?.includes("-")
                                ? editAddressData?.phoneNumber.split("-")[1]
                                : editAddressData?.phoneNumber;

                            Actions.Newaddress({
                                addressData: editAddressData,
                                types: "edit",
                                showDeleteConfirmModal: showDeleteConfirmModal,
                                getAddress: getAddress,
                            });
                            PiwikEventDataHandle("ShipmentFormAccount6");
                        }}
                    />
                )}

                {
                    Array.isArray(addressData) && addressData.length < MaxAddressLength &&
                    (
                        <FilledButton
                            outlined={true}
                            text={translate("新增收货地址")}
                            onPress={() => {
                                Actions.Newaddress({
                                    types: "add",
                                    showDeleteConfirmModal: showDeleteConfirmModal,
                                    getAddress: getAddress,
                                    isPrimary: !Boolean(Array.isArray(addressData) && addressData.length > 0),
                                });

                                PiwikEventDataHandle("ShipmentFormAccount1");
                            }}
                            wrapStyle={{ marginBottom: 16 }}>
                            <AddIcon
                                type='ring'
                                fill={Color.theme}
                                wrapStyle={{ marginRight: 10 }} />
                        </FilledButton>
                    )
                }

                <Text style={{
                    fontSize: 12,
                    color: "#666",
                    fontWeight: "400",
                    textAlign: "center"
                }}>{translate("最多可以添加 {X} 个收货地址", { X: MaxAddressLength })}</Text>
            </ScrollView>
        </View>
    );
};

export default PromotionsAddress;

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        paddingHorizontal: 15,
    },
});
