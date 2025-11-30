import React, { useState } from "react";
import { Image, ActivityIndicator, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ColumnCenterCenter } from "./CustomView";
import { LogoIcon } from "$Components/icons/index.js";
import Color from "./Color";

const NetworkImage = ({
    source = null,
    style,
    resizeMode = "cover",
    resizeMethod = "resize",
    indicatorSize = "small",
    indicatorColor = Color.theme,
    scale = 1,
    showSkeleton = true,
    ...props
}) => {
    const [loading, setLoading] = useState(() => {
        // 初始化 loading 狀態：網絡圖片需要 loading，本地資源不需要
        if (typeof source === "number") return false; // require 是本地資源
        if (typeof source === "object" && source?.uri && typeof source.uri === "string") {
            const isNetwork = source.uri.startsWith("http://") || source.uri.startsWith("https://");
            return isNetwork;
        }
        // string 假設是網絡 URL
        return typeof source === "string";
    });

    // 判斷 source 是否有效
    const isValidSource = () => {
        if (!source) return false;
        if (typeof source === "number") return true;
        if (typeof source === "string") return source.length > 0; // 'https://...'
        if (typeof source === "object") {
            // { uri: 'https://...' } 或 require 的結果
            if (source.uri && typeof source.uri === "string") return source.uri.length > 0;
            if (source.uri) return true; // uri 存在但不是字符串（可能是数字或其他类型）
            return true; // 可能是本地資源對象
        }
        return false;
    };

    // 處理 source，統一格式
    const getImageSource = () => {
        if (typeof source === "string") {
            return { uri: source };
        }
        return source;
    };

    // 判斷是否為網絡圖片（需要 loading）
    const isNetworkImage = () => {
        if (typeof source === "number") return false; // require 是本地資源
        if (typeof source === "string") return true; // string 通常是網絡 URL
        if (typeof source === "object" && source.uri && typeof source.uri === "string") {
            // 檢查是否為網絡 URL
            return source.uri.startsWith("http://") || source.uri.startsWith("https://");
        }
        return false; // 本地資源
    };

    const shouldShowSkeleton = showSkeleton && isNetworkImage() && loading;

    return (
        <View style={[styles.container, style]}>
            {
                isValidSource() &&
                <Image
                    source={getImageSource()}
                    style={[styles.image, style]}
                    resizeMode={resizeMode}
                    resizeMethod={resizeMethod}
                    onLoadStart={() => {
                        if (showSkeleton && isNetworkImage()) {
                            setLoading(true);
                        }
                    }}
                    onLoad={() => {
                        if (showSkeleton && isNetworkImage()) {
                            setLoading(false);
                        }
                    }}
                    {...props}
                />
            }

            {
                shouldShowSkeleton &&
                <ColumnCenterCenter style={styles.loaderContainer}>
                    <LogoIcon fill="#8a8a8a" scale={scale} />
                </ColumnCenterCenter>
            }
        </View>
    );
};

NetworkImage.propTypes = {
    source: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.number
    ]).isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    resizeMode: PropTypes.oneOf(["cover", "contain", "stretch", "center"]),
    indicatorSize: PropTypes.oneOf(["small", "large"]),
    indicatorColor: PropTypes.string
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.3)"
    }
});

export default NetworkImage;