import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Dimensions, Animated, TouchableWithoutFeedback, View, Image, Easing, TouchableOpacity } from "react-native";
import { RootSiblingPortal } from "react-native-root-siblings";
import { useGlobalModal } from "../../contexts/GlobalModalContext";
import { CloseIcon, WarningIcon, CtcIcon, LBIcon } from "$Components/icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    RowCenterCenter,
    ColumnCenterCenter
} from "$Components/CustomView";
import FilledButton from "$Components/FilledButton";
const { width, height } = Dimensions.get("window");
import { globalModalPadding } from "$Utils/globalModal";


const IconMap = {
    warning: () => <WarningIcon width={50} height={50} fill="#F5B200" checkColor="#6B4D00" />,
    CTC: () => <CtcIcon width={50} height={50} />,
    LB: () => <LBIcon width={50} height={50} />,
    QD: () => <LBIcon width={50} height={50} />,
};



const MODALWIDTH = width * 0.8;


const GlobalModal = ({ modalId, modal, hideModal }) => {
    // 動畫值 - 使用更穩定的初始值
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // 根據位置獲取初始滑動值，添加緩衝區避免邊界抖動
    const getInitialSlideValue = (position) => {
        const buffer = 50; // 添加緩衝區
        switch (position) {
            case "top":
                return -(height + buffer); // 從螢幕上方滑入，添加緩衝區
            case "bottom":
                return height + buffer; // 從螢幕下方滑入，添加緩衝區
            case "left":
                return -(width + buffer); // 從螢幕左側滑入，添加緩衝區
            case "right":
                return width + buffer; // 從螢幕右側滑入，添加緩衝區
            default:
                return 0;
        }
    };

    // 根據位置獲取滑動變換
    const getSlideTransform = (position) => {
        switch (position) {
            case "top":
            case "bottom":
                return [{ translateY: slideAnim }];
            case "left":
            case "right":
                return [{ translateX: slideAnim }];
            default:
                return [];
        }
    };

    // 帶動畫的隱藏函數
    const hideModalWithAnimation = () => {
        const { position = "center", onCancel } = modal?.data || {};
        const slideToValue = getInitialSlideValue(position);

        const animations = [
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(backdropAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            })
        ];

        // 根據位置添加不同的隱藏動畫
        if (position === "center") {
            animations.push(
                Animated.timing(scaleAnim, {
                    toValue: 0.7,
                    duration: 300,
                    easing: Easing.in(Easing.back(1.2)),
                    useNativeDriver: true,
                })
            );
        } else {
            // 側邊滑出動畫 - 使用更明顯的退出動畫
            animations.push(
                Animated.timing(slideAnim, {
                    toValue: slideToValue,
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                })
            );
        }

        Animated.parallel(animations).start(() => {
            hideModal(modalId);
        });
    };

    useEffect(() => {
        if (modal) {
            const { position = "center" } = modal.data || {};
            const initialSlideValue = getInitialSlideValue(position);

            // 重置動畫值，確保初始狀態正確
            fadeAnim.setValue(0);
            scaleAnim.setValue(position === "center" ? 0.8 : 1);
            slideAnim.setValue(initialSlideValue);
            backdropAnim.setValue(0);

            // 顯示動畫 - 使用更流暢的進入動畫
            const animations = [
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ];

            // 根據位置添加不同的動畫效果
            if (position === "center") {
                // center 位置使用更平滑的縮放動畫
                animations.push(
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.out(Easing.back(1.05)),
                        useNativeDriver: true,
                    })
                );
            } else {
                // 側邊滑入動畫 - 使用更平滑的緩動曲線
                animations.push(
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    })
                );
            }

            Animated.parallel(animations).start();
        }
    }, [modal, fadeAnim, scaleAnim, slideAnim]);

    if (!modal) {
        return null;
    }

    const { data } = modal;
    let {
        title = "",
        titleStyle = {},
        message = "",
        messageStyle = {},
        confirmText = "",
        iconName = "",
        cancelText = "",
        allowMask = false,
        showCloseIcon = false,
        allowKeyboardAwareScrollView = false,
        renderMessage = null,
        onConfirm = () => {},
        onCancel = () => {},
        wrapStyle = {
            width: MODALWIDTH,
        },
        position = "center",
        maskOffset = {}, // 新增：遮罩偏移
        useDrawerModal = false,
        allowSwipeable = false // 暫時未使用，保留供未來擴展
    } = data;

    let useNormalModal = title || showCloseIcon;


    cancelText = cancelText || data?.noBtnTxt;
    confirmText = confirmText || data?.okBtnTxt;
    onConfirm = onConfirm || data?.okFunction;
    onCancel = onCancel || data?.noFunction;
    message = message || data?.children;
    iconName = iconName || data?.childrenIconType;


    const MaskContainer = ({ children }) => {
        // 並列平行關係：兩個參數獨立工作
        // allowMask: 控制是否點擊遮罩關閉
        // allowSwipeable: 控制是否攔截觸摸事件（為滑動預留）

        const overlayStyle = [
            styles.overlay,
            maskOffset,
            {
                opacity: backdropAnim
            }
        ];

        if (allowMask) {
            // 允許點擊遮罩關閉
            return (
                <TouchableWithoutFeedback onPress={hideModalWithAnimation}>
                    <Animated.View style={overlayStyle}>
                        <View style={{}}>{children}</View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            );
        }

        // 不允許點擊遮罩關閉，返回純 View
        return <Animated.View style={overlayStyle}>{children}</Animated.View>;
    };


    // Position mapping for better readability
    const positionMap = {
        justifyContent: {
            center: "center",
            top: "flex-start",
            bottom: "flex-end",
            left: "center",
            right: "center"
        },
        alignItems: {
            center: "center",
            top: "center",
            bottom: "center",
            left: "flex-start",
            right: "flex-end"
        }
    };

    const KeyboardAwareModalContent = ({ children }) => (
        allowKeyboardAwareScrollView ?
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: positionMap.justifyContent[position] || "center",
                    alignItems: positionMap.alignItems[position] || "center"
                }}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ ...wrapStyle, justifyContent: "center", alignItems: "center" }}>
                    {children}
                </View>
            </KeyboardAwareScrollView>
            :
            <View style={{ ...wrapStyle, justifyContent: "center", alignItems: "center" }}>
                {children}
            </View >

    );

    const SwipeableContent = ({ children }) => (
        allowSwipeable ?
            <>
                {children}
            </>
            :
            (
                allowMask ? <TouchableOpacity
                    onPress={() => {}}
                    activeOpacity={1}
                    style={{ width: "100%" }}
                >
                    {children}
                </TouchableOpacity>
                    :
                    <View style={{ width: "100%" }}>
                        {children}
                    </View>
            )

    );

    const ModalViewContent = ({ children }) => (
        allowMask ?
            <TouchableOpacity
                style={[styles.modalContent]}
                onPress={() => {}}
                activeOpacity={1}
            >
                {children}
            </TouchableOpacity>
            :
            <View style={[styles.modalContent]}>
                {children}
            </View>
    );



    // 位置對應的樣式映射
    const positionStyles = {
        "center": {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },
        "top": {
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column"
        },
        "bottom": {
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "column"
        },
        "left": {
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "row"
        },
        "right": {
            justifyContent: useDrawerModal ? "flex-end" : "center",
            alignItems: "flex-end",
            flexDirection: "row"
        },
    };
    return (
        <RootSiblingPortal>
            <MaskContainer>
                {
                    Boolean(renderMessage) && !useNormalModal
                        ?
                        <Animated.View
                            style={[{
                                height: "100%",
                                width: "100%",
                                ...positionStyles[position],
                            }, {
                                opacity: fadeAnim,
                                transform: position === "center"
                                    ? [{ scale: scaleAnim }]
                                    : getSlideTransform(position)
                            }]}
                        >
                            <KeyboardAwareModalContent>
                                <SwipeableContent>
                                    {renderMessage({ hideModalWithAnimation })}
                                </SwipeableContent>
                            </KeyboardAwareModalContent>
                        </Animated.View>
                        :
                        <Animated.View
                            style={[{
                                width: "100%",
                                height: "100%",
                                ...positionStyles[position]
                            }, {
                                opacity: fadeAnim,
                                transform: position === "center"
                                    ? [{ scale: scaleAnim }]
                                    : getSlideTransform(position)
                            }]}
                        >
                            <KeyboardAwareModalContent>
                                <ModalViewContent>
                                    {showCloseIcon && (
                                        <RowCenterCenter
                                            style={styles.closeIconContainer}
                                            onPress={hideModalWithAnimation}
                                        >
                                            <CloseIcon fill="#999" />
                                        </RowCenterCenter>
                                    )}

                                    {title && (
                                        <ColumnCenterCenter style={styles.modalHeader}>
                                            <Text style={[styles.title, titleStyle]}>
                                                {title}
                                            </Text>
                                        </ColumnCenterCenter>
                                    )}

                                    {iconName && IconMap[iconName] && IconMap[iconName]()}


                                    {renderMessage ? (
                                        <ColumnCenterCenter style={{ width: "100%" }}>
                                            {(() => {
                                                // 處理不同類型的 renderMessage
                                                if (typeof renderMessage === "function") {
                                                    const result = renderMessage({ hideModalWithAnimation });
                                                    return result || null;
                                                } else if (React.isValidElement(renderMessage)) {
                                                    return renderMessage;
                                                } else {
                                                    return null;
                                                }
                                            })()}
                                        </ColumnCenterCenter>
                                    ) : (
                                        <ColumnCenterCenter style={styles.modalBody}>
                                            {(() => {
                                                // 處理不同類型的 message
                                                if (typeof message === "function") {
                                                    const result = message({ hideModalWithAnimation });
                                                    return result || null;
                                                } else if (typeof message === "string") {
                                                    return (
                                                        <Text style={[styles.message, messageStyle]}>
                                                            {message}
                                                        </Text>
                                                    );
                                                } else if (React.isValidElement(message)) {
                                                    return message;
                                                } else {
                                                    return null;
                                                }
                                            })()}
                                        </ColumnCenterCenter>
                                    )}

                                    <ColumnCenterCenter style={styles.buttonContainer}>
                                        {
                                            confirmText &&
                                            <FilledButton
                                                text={confirmText}
                                                onPress={() => {
                                                    if (onConfirm) {
                                                        onConfirm({
                                                            hideModalWithAnimation
                                                        });
                                                    }
                                                    hideModalWithAnimation();
                                                }}
                                                wrapStyle={[styles.confirmButton, { marginBottom: cancelText ? 8 : 0 }]}
                                            />
                                        }

                                        {cancelText && (
                                            <FilledButton
                                                text={cancelText}
                                                outlined={true}
                                                onPress={() => {
                                                    if (onCancel) {
                                                        onCancel({
                                                            hideModalWithAnimation
                                                        });
                                                    }
                                                    hideModalWithAnimation();
                                                }}
                                                wrapStyle={[styles.cancelButton, { marginBottom: 0 }]}
                                            />
                                        )}
                                    </ColumnCenterCenter>
                                </ModalViewContent>
                            </KeyboardAwareModalContent>
                        </Animated.View>
                }

            </MaskContainer>
        </RootSiblingPortal>
    );
};



const styles = StyleSheet.create({
    // 遮罩層樣式
    overlay: {
        width,
        height,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 9999,
    },
    // 彈窗容器
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: globalModalPadding,
        position: "relative",
        width: "100%",
        // 添加陰影效果
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    // 關閉按鈕
    closeIconContainer: {
        position: "absolute",
        right: 16,
        top: 16,
        padding: 4,
        zIndex: 1,
    },
    // 標題樣式
    title: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    // 標題容器樣式
    modalHeader: {
        // ColumnCenterCenter 已包含 flex 布局
    },
    // 消息樣式
    message: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        fontWeight: "400",
        marginHorizontal: 10,
    },
    // 消息容器樣式
    modalBody: {
        marginTop: 16,
        marginBottom: 20,
        width: "100%",
    },
    // 按鈕容器
    buttonContainer: {
        width: "100%",
    },
    confirmButton: {
        marginBottom: 8,
        minWidth: 120,
    },
    cancelButton: {
        marginBottom: 8,
        minWidth: 120,
    },
});

// 多個 Modal 容器組件
const GlobalModalContainer = () => {
    const { modals, hideModal } = useGlobalModal();

    return (
        <>
            {modals.map((modal) => (
                <GlobalModal
                    key={modal.id}
                    modalId={modal.id}
                    modal={modal}
                    hideModal={hideModal}
                />
            ))}
        </>
    );
};

export default GlobalModalContainer;