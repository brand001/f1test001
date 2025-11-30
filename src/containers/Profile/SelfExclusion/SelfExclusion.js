import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { useSelector, useDispatch } from "react-redux";

import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { ArrowIcon, CheckedIcon } from "$Components/icons/index.js";
import actions from "$LIB/redux/actions";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";
import { GetSelfExclusionPopup } from "$Utils";
import { ColumnCenterCenter, RowCenterBetween, RowCenterCenter, RowCenterStart } from "$Components/CustomView";
import { useSelfExclusion } from "$Hooks";

const { width } = Dimensions.get("window");

const SelfExclusion = () => {
    const userSetting = useSelector(state => state.userSetting);
    const dispatch = useDispatch();
    const selfExclusions = userSetting?.selfExclusions;

    const {
        activeCheck, // 當前選中的限制天數索引，-1 表示未選擇
        showSubmitButton, // 是否顯示提交按鈕，當用戶已有自我限制時為 false
        dropdownOpen, // 下拉框是否打開的狀態
        isSubmitEnabled, // 是否啟用提交按鈕，當 activeCheck >= 0 時為 true
        limitOptions, // 限制天數選項陣列（7天、90天、永遠）
        onSelect, // 選擇限制天數的回調函數
        setDropdownOpen, // 設置下拉框打開狀態的函數
        onSubmit, // 提交自我限制設置的函數
    } = useSelfExclusion({
        toasts: Toasts,
        selfExclusions,
        onUpdateSelfExclusion: () => dispatch(actions.ACTION_SelfExclusionsAction()),
        onShowSelfExclusionPopup: GetSelfExclusionPopup,
    });

    const renderRow = (rowData, i) => {
        const flag = activeCheck * 1 === i * 1;
        return (
            <RowCenterBetween style={styles.renderRow}>
                <Text style={styles.renderText}>{`${rowData.name}`}</Text>
                {flag && <CheckedIcon fill={Color.theme} width={30} height={30} />}
            </RowCenterBetween>
        );
    };

    const renderButtonText = (rowData) => {
        return `${rowData.name}`;
    };

    const renderSeparator = () => {
        return <View style={styles.separator} />;
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* BANNER */}
                <Image resizeMode="cover" source={ImgMap.SelfExclusionBG} style={styles.bannerImage} />

                {/* 主內容 */}
                <View style={styles.content}>
                    {/* 標題區塊 */}
                    <ColumnCenterCenter style={[styles.inner]}>
                        <Text style={styles.title}>{translate("自我限制")}</Text>
                        <Text style={styles.innerText}>{translate("自我限制內文")}</Text>
                    </ColumnCenterCenter>

                    {/* 限制天數區塊 */}
                    <View style={[styles.inner, styles.limitBlock]}>
                        <Text style={styles.innerTitle}>{translate("登入限制")}</Text>
                        <RowCenterCenter style={styles.ModalDropdownView}>
                            <ModalDropdown
                                defaultValue={translate("选择限制天数")}
                                defaultTextStyle={Color.gray}
                                disabled={!showSubmitButton}
                                textStyle={styles.dropdown_D_text}
                                renderSeparator={renderSeparator}
                                dropdownStyle={styles.dropdown_DX_dropdown}
                                options={limitOptions}
                                renderButtonText={renderButtonText}
                                renderRow={renderRow}
                                onSelect={onSelect}
                                style={styles.modalDropdown}
                                onDropdownWillShow={() => setDropdownOpen(true)}
                                onDropdownWillHide={() => setDropdownOpen(false)}>
                                <RowCenterStart
                                    style={[
                                        styles.limitModalDropdownTextWrap,
                                        !showSubmitButton ? styles.limitModalDropdownTextWrapDisabled : styles.limitModalDropdownTextWrapEnabled,
                                    ]}>
                                    {activeCheck === -1 ? (
                                        <Text style={[styles.limitModalDropdownText, styles.limitModalDropdownTextPlaceholder]}>
                                            {translate("选择限制天数")}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.limitModalDropdownText, styles.limitModalDropdownTextSelected]}>{limitOptions[activeCheck].name}</Text>
                                    )}
                                </RowCenterStart>
                            </ModalDropdown>
                            {/* ICON */}
                            <ArrowIcon fill={Color.gray} width={12} height={12} direction={dropdownOpen && showSubmitButton ? "top" : "bottom"} wrapStyle={styles.expandIcon} />
                        </RowCenterCenter>

                        {/* 警示語 */}
                        <Text style={styles.moneyST}>{translate("开启之后您将在选择日期内无法进行存款及游戏。")}</Text>

                        {/* 提交按鈕 */}
                        {showSubmitButton && (
                            <FilledButton
                                wrapStyle={styles.sumitBtn}
                                onPress={onSubmit}
                                fullWidth={false}
                                text={translate("确定(自我限制)")}
                                enable={isSubmitEnabled}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SelfExclusion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.azureBlue,
    },
    content: {
        marginHorizontal: 15,
        marginTop: -150,
        marginBottom: 150,
    },
    inner: {
        backgroundColor: Color.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
    },
    innerTitle: {
        fontSize: 14,
        color: Color.charcoal,
        marginBottom: 8,
        fontWeight: "bold"
    },
    innerText: {
        fontSize: 14,
        color: Color.charcoal,
        lineHeight: 20,
    },
    title: {
        fontSize: 18,
        color: Color.charcoal,
        fontWeight: "bold",
        marginBottom: 10,
    },
    moneyST: {
        color: Color.vividRed,
        fontSize: 12,
        marginTop: 8,
    },
    ModalDropdownView: {
        height: 45,
        borderRadius: 5,
    },
    dropdown_D_text: {
        paddingBottom: 3,
        fontSize: 14,
        color: Color.charcoal,
        textAlignVertical: "center",
        lineHeight: 45,
        paddingLeft: 15,
    },
    dropdown_DX_dropdown: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        height: 45 * 3,
    },
    limitModalDropdownTextWrap: {
        paddingLeft: 15,
        height: 45,
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
    },
    limitModalDropdownText: {
        fontSize: 14,
        color: Color.charcoal,
    },
    expandIcon: {
        position: "absolute",
        right: 10,
        zIndex: 999,
    },
    sumitBtn: {
        width: "50%",
        marginTop: 20,
    },
    renderRow: {
        width: width - 65,
        height: 45,
        paddingHorizontal: 15,
    },
    renderText: {
        color: Color.black,
        fontWeight: "400"
    },
    bannerImage: {
        width: width,
        height: width / 0.96,
    },
    limitBlock: {
        padding: 20,
    },
    separator: {
        height: 1,
        backgroundColor: Color.lightestGray,
    },
    modalDropdown: {
        zIndex: 10,
        width: width - 60,
        height: 45,
    },
    limitModalDropdownTextWrapEnabled: {
        backgroundColor: Color.white,
        borderColor: Color.softGray,
    },
    limitModalDropdownTextWrapDisabled: {
        backgroundColor: Color.lightSilver,
        borderColor: Color.lightSilver,
    },
    limitModalDropdownTextPlaceholder: {
        color: Color.placeholderGray,
    },
    limitModalDropdownTextSelected: {
        color: Color.gray,
    },
});
