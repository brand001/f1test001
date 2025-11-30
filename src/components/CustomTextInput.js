import React, { forwardRef, useState, useImperativeHandle } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

import Color from "$Components/Color";
import InfoBar from "$Components/InfoBar";

import { UserIcon, PasswordIcon, PhoneIcon, EmailIcon, CodeIcon, PasswordEye, SearchIcon } from "$Components/icons/index.js";
import { RowStartBetween } from "./CustomView";

const IconMap = {
    user: UserIcon,
    password: PasswordIcon,
    phone: PhoneIcon,
    email: EmailIcon,
    code: CodeIcon,
    search: SearchIcon
};

const CustomTextInput = forwardRef((props, ref) => {
    const {
        title = undefined,
        title2 = undefined, // Add second title prop
        renderTitle = () => {
            return null;
        },
        titleStyle = {},
        title2Style = {}, // Add style for second title



        leftIconName = undefined,
        leftIconFill = Color.placeholderGray,

        renderOutLeft = null,
        renderInnerLeft = null,
        renderLeft = null,


        renderRight = () => {
            return null;
        },


        value = undefined,
        placeholder = undefined,
        placeholderTextColor = Color.placeholderGray,

        disabled = false,
        maxLength = undefined,
        textContentType = undefined,
        keyboardType = undefined,
        onChangeText = () => {},
        onFocus = () => {},
        onBlur = () => {},
        children = null,
        multiline = undefined,
        autoFocus = false,

        returnKeyType = undefined,
        onSubmitEditing = () => {},
        underlineColorAndroid = undefined,

        type = "error",
        errorMessage = undefined,
        hasError = false,
        infoBarPosition = "bottom",

        wrapStyle = {},
        containerStyle = {},
        inputStyle = {},

        showEyes = false,

        ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    const [isSecureTextEntry, setIsSecureTextEntry] = useState(showEyes);

    const textInputRef = React.useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            try {
                // 確保 textInputRef 存在且不是 null
                if (textInputRef && textInputRef.current && typeof textInputRef.current.focus === "function") {
                    // 添加額外檢查確保不會調用自身
                    const nativeFocus = textInputRef.current.focus;
                    if (nativeFocus && nativeFocus !== ref?.current?.focus) {
                        nativeFocus.call(textInputRef.current);
                    }
                }
            } catch (error) {
                console.error("focus error:", error);
            }
        },
        blur: () => {
            try {
                // 確保 textInputRef 存在且不是 null
                if (textInputRef && textInputRef.current && typeof textInputRef.current.blur === "function") {
                    // 添加額外檢查確保不會調用自身
                    const nativeBlur = textInputRef.current.blur;
                    if (nativeBlur && nativeBlur !== ref?.current?.blur) {
                        nativeBlur.call(textInputRef.current);
                    }
                }
            } catch (error) {
                console.error("blur error:", error);
            }
        },
        isFocused: () => isFocused
    }));

    const handleSubmitEditing = () => {
        try {
            if (typeof onSubmitEditing === "function") {
                onSubmitEditing();
            }
        } catch (error) {
            console.error("onSubmitEditing error:", error);
        }
    };

    const handleFocus = () => {
        if (!disabled) {
            try {
                onFocus();
            } catch (error) {
                console.error("onFocus error:", error);
            }
            setIsFocused(true);
        }
    };

    const handleBlur = () => {
        if (!disabled) {
            try {
                onBlur();
            } catch (error) {
                console.error("onBlur error:", error);
            }
            setIsFocused(false);
        }
    };

    const handleChangeText = (text) => {
        try {
            if (!disabled && typeof onChangeText === "function") {
                onChangeText(text);
            }
        } catch (error) {
            console.error("onChangeText error:", error);
        }
    };

    const toggleSecureEntry = () => {
        try {
            setIsSecureTextEntry(!isSecureTextEntry);
        } catch (error) {
            console.error("toggleSecureEntry error:", error);
        }
    };

    let isRenderLeft = typeof renderOutLeft === "function" || renderOutLeft?.$$typeof === Symbol.for("react.element");

    let tagProps = {
        style: [
            styles.inputWrap,
            {
                paddingTop: multiline ? 15 : 0,
            },

            (Boolean(errorMessage) || hasError) && styles.errorInput,
            disabled && styles.disabledInput,
            {
                width: isRenderLeft ? "84%" : "100%",
            },
            wrapStyle,
            isFocused && !disabled && !Boolean(errorMessage) && !hasError && styles.focusedInput,
        ],
        someOtherProp: "value",
    };

    let Tag = isRenderLeft ? View : React.Fragment;
    let Icon = IconMap[leftIconName] || null;

    return (
        <View style={[styles.container, containerStyle]}>
            {Boolean(title) && <Text style={[styles.title, titleStyle, title2 && { marginBottom: 0 }]}>{title}</Text>}
            {Boolean(title2) && <Text style={[styles.title, title2Style]}>{title2}</Text>}

            {typeof renderTitle === "function"
                ? renderTitle()
                : renderTitle?.$$typeof === Symbol.for("react.element")
                    ? renderTitle
                    : null}

            {Boolean(errorMessage) && !disabled && infoBarPosition == "top" && <InfoBar type={type} wrapStyle={{ marginBottom: 6 }} text={errorMessage} />}

            <RowStartBetween {...(isRenderLeft ? { style: styles.renderLeftBox } : tagProps)}>
                {Boolean(leftIconName) && <Icon style={[styles.img, disabled && styles.disabledImg]} fill={leftIconFill} />}
                {
                    typeof renderInnerLeft === "function"
                        ? renderInnerLeft()
                        : renderInnerLeft?.$$typeof === Symbol.for("react.element")
                            ? renderInnerLeft
                            : null
                }

                {
                    typeof renderOutLeft === "function"
                        ? renderOutLeft()
                        : renderOutLeft?.$$typeof === Symbol.for("react.element")
                            ? renderOutLeft
                            : null
                }

                <Tag {...(isRenderLeft ? tagProps : {})}>
                    <TextInput
                        ref={textInputRef}
                        value={value}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        style={[styles.textInput, multiline && styles.textMultilineInput, disabled && styles.disabledText, inputStyle, {

                        }]}
                        {...(disabled ? { editable: false } : {})}
                        maxLength={maxLength}
                        keyboardType={keyboardType}
                        textContentType={multiline ? undefined : textContentType}
                        onChangeText={handleChangeText}
                        returnKeyType={multiline ? "default" : returnKeyType}
                        underlineColorAndroid={underlineColorAndroid}
                        onSubmitEditing={handleSubmitEditing}
                        secureTextEntry={isSecureTextEntry}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoFocus={autoFocus}
                        {...(multiline ? { multiline: true } : {})}
                    />

                    {typeof renderRight === "function"
                        ? renderRight()
                        : renderRight?.$$typeof === Symbol.for("react.element")
                            ? renderRight
                            : null}

                    {showEyes && (
                        <View style={styles.eyesBtn}>
                            <PasswordEye
                                type={!isSecureTextEntry}
                                onPress={toggleSecureEntry}
                            />
                        </View>
                    )}
                </Tag>
            </RowStartBetween >

            {Boolean(errorMessage) && !disabled && infoBarPosition == "bottom" && <InfoBar type={type} wrapStyle={{ marginTop: 6 }} text={errorMessage} />}

            {
                Boolean(multiline && maxLength && maxLength > 0) && (
                    <Text style={styles.multilineText}>
                        {(value || "").length}/{maxLength}
                    </Text>
                )
            }

            {children}
        </View >
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        width: "100%",
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: Color.charcoal,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Color.silverGray,
        borderRadius: 8,
        height: 42,
        overflow: "hidden",
        backgroundColor: Color.white,
    },
    disabledInput: {
        backgroundColor: Color.lightSilver,
    },
    focusedInput: {
        borderColor: Color.theme,
    },
    errorInput: {
        borderColor: Color.alertRed,
    },
    textInput: {
        fontSize: 14,
        fontWeight: "400",
        color: Color.darkGray,
        height: 42,
        flex: 1,
        backgroundColor: Color.transparent,
        paddingHorizontal: 10,
    },
    textMultilineInput: {
        textAlignVertical: "top",
        height: 100,
    },
    disabledText: {
        color: Color.gray,
    },
    img: {
        width: 22,
        height: 22,
        marginLeft: 12,
    },
    disabledImg: {},
    placeholderTextColor: {
        color: Color.placeholderGray,
    },
    multilineText: {
        fontSize: 12,
        fontWeight: "400",
        color: Color.gray,
        textAlign: "right",
        marginTop: 10,
    },
    eyesBtn: {
        position: "absolute",
        right: 15,
    },
});

export default CustomTextInput;
