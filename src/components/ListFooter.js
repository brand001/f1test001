import React from "react";

import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";

import { translate } from "$locales/translate";
import { ColumnCenterCenter, RowCenterCenter } from "./CustomView";
const { width } = Dimensions.get("window");

const ListFooter = ({
    isEmptyData = false,
    lastPage = false,
    loadingText = translate("加载更多"), // 加載中文字
    emptyText = translate("目前就这些！"), // 沒有更多數據文字
    showDivider = true, // 是否顯示分隔線
    dividerWidth = 38, // 分隔線寬度
    dividerColor = "#BBB", // 分隔線顏色
    textColor = "#BBBBBB", // 文字顏色
    textSize = 14, // 文字大小
    textStyle = {}, // 自定義文字樣式
    loadingSize = "small", // 載入指示器大小
    loadingColor, // 載入指示器顏色
    style = {}, // 外層容器樣式
}) => {
    // 如果沒有數據，則不顯示
    if (isEmptyData) return null;

    // 顯示文字
    const displayText = lastPage ? emptyText : loadingText;

    return (
        <ColumnCenterCenter style={[styles.container, style]}>
            <RowCenterCenter>
                {/* 左側分隔線 */}
                {lastPage && showDivider && (
                    <View
                        style={[
                            styles.divider,
                            {
                                width: dividerWidth,
                                backgroundColor: dividerColor,
                            },
                        ]}
                    />
                )}

                {/* 文字 */}
                <Text
                    style={[
                        styles.text,
                        {
                            color: textColor,
                            fontSize: textSize,
                        },
                        textStyle,
                    ]}>
                    {displayText}
                </Text>

                {/* 右側分隔線 */}
                {lastPage && showDivider && (
                    <View
                        style={[
                            styles.divider,
                            {
                                width: dividerWidth,
                                backgroundColor: dividerColor,
                            },
                        ]}
                    />
                )}
            </RowCenterCenter>

            {/* 載入指示器 */}
            {!lastPage && (
                <View style={styles.activity}>
                    <ActivityIndicator animating size={loadingSize} color={loadingColor} />
                </View>
            )}
        </ColumnCenterCenter>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 16
    },
    divider: {
        height: 0.5,
        backgroundColor: "#BBB",
    },
    text: {
        textAlign: "center",
        marginHorizontal: 8,
    },
    activity: {
        position: "relative",
        width: width,
        marginTop: 16,
        marginBottom: 10,
        alignItems: "center",
    },
});

export default ListFooter;
