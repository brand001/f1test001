import React from "react";
import { Text, StyleSheet } from "react-native";
import { RowCenterStart, RowCenterBetween, RowCenterCenter } from "$Components/CustomView";
import { SuccessIcon, ArrowIcon } from "$Components/icons/index";
import Color from "$Components/Color";
import { translate } from "@/locales/translate";

// 导出 SelectListItem 组件
export function SelectListItem({ text = "", isSelected = false, onPress = () => {} }) {
    return (
        <RowCenterStart style={styles.selectContainer} onPress={onPress}>
            <SuccessIcon width={20} height={20} type={isSelected ? "fill" : "ring"} />
            <Text style={styles.selectText}>{translate(text)}</Text>
        </RowCenterStart>
    );
}

// 导出 ListItem 组件
export function ListItem({
    text = "",
    isLast = false,
    onPress = () => {},
    leftIcon = null,
    rightComponent = null,
}) {
    const RightComponent = rightComponent || <ArrowIcon direction="right" fill={"#666666"} />;

    return (
        <RowCenterBetween
            style={[
                styles.listContainer,
                {
                    borderBottomWidth: isLast ? 0 : 1,
                },
            ]}
            onPress={onPress}>
            {leftIcon ? (
                <RowCenterCenter>
                    {leftIcon}
                    <Text style={styles.listText}>{text}</Text>
                </RowCenterCenter>
            ) : (
                <Text style={styles.listText}>{text}</Text>
            )}
            {RightComponent}
        </RowCenterBetween>
    );
}

const styles = StyleSheet.create({
    selectContainer: {
        borderWidth: 1,
        borderColor: Color.silverGray,
        borderRadius: 8,
        height: 42,
        overflow: "hidden",
        backgroundColor: Color.white,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    selectText: {
        color: Color.black,
        fontWeight: "400",
        fontSize: 14,
        marginLeft: 10,
    },
    listContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
        height: 48,
    },
    listText: {
        color: "#222",
        fontSize: 12,
        fontWeight: "400",
        marginLeft: 8,
    },
});

// 默认导出 SelectListItem（保持向后兼容）
export default SelectListItem;
