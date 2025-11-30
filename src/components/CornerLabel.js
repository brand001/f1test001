/*
  修改自react-native-smart-corner-label套件
*/
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { translate } from "@/locales/translate";
import { ColumnCenterCenter } from "./CustomView";
import { HotIcon, StarIcon } from "./icons/index";
import Color from "./Color";

export default class CornerLabel extends Component {
    static defaultProps = {
        alignment: false,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

        this._labelHeight = Math.sqrt(Math.pow(props.cornerRadius, 2) / 2);
        this._labelWidth = this._labelHeight * 2;
        let originOffset = Math.sqrt(Math.pow(this._labelHeight / 2, 2) / 2);
        let labelHorizontalPosition = -this._labelWidth / 2 + originOffset;
        let labelVerticalPosition = -this._labelHeight / 2 + originOffset;
        if (props.alignment == "left") {
            this._labelPosition = {
                left: labelHorizontalPosition,
                top: labelVerticalPosition,
            };
            this._labelTransform = { transform: [{ rotate: "-45deg" }] };
        } else {
            this._labelPosition = {
                right: labelHorizontalPosition,
                top: labelVerticalPosition,
            };
            this._labelTransform = { transform: [{ rotate: "45deg" }] };
        }
    }

    render() {
        let {
            type = "",
            slope = false,
            gradient = false,
            wrapStyle = {},
            textStyle = {},
            containerStyle = {},
            borderRadius = 8,
            iconSize = 14
        } = this.props;


        const LabelObj = {
            HOT: {
                gradienttrue: {
                    color: ["#FFA640", "#E97F05"],
                    Icon: () => {
                        return <HotIcon width={iconSize} height={iconSize}></HotIcon>;
                    },
                },
                gradientfalse: {
                    color: "#FDB454",
                    Icon: translate("热"),
                }

            },
            COMING: {
                gradienttrue: {
                    color: ["#FF4141", "#CC0000"],
                    Icon: translate("敬请期待"),
                },
                gradientfalse: {
                    color: "#FF4141",
                    Icon: translate("敬请期待"),
                }
            },
            NEW: {
                gradienttrue: {
                    color: ["#FF4E64", "#D40000"],
                    Icon: () => {
                        return <StarIcon fill={Color.white} width={iconSize} height={iconSize}></StarIcon>;
                    },
                },
                gradientfalse: {
                    color: "#FF4141",
                    Icon: translate("新"),
                }

            },
            asdf: {

            }
        };

        const styles = StyleSheet.create({
            container: {
                position: "absolute",
                //transform: [{rotate: '45deg'}],
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
                borderBottomRightRadius: borderRadius,
                left: 0,
                top: 0
            },
            text: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 12,
            },
            labelRow: {
                height: "auto",
                paddingVertical: 2,
                paddingHorizontal: window.LANGUAGE == "CN" ? 4 : 2,
                borderRadius: 4,
            },
            textRow: {
                fontSize: window.LANGUAGE == "CN" ? 10 : 8,
                fontWeight: "500",
            },
        });


        if (!Boolean(type)) return;

        type = type?.toLocaleUpperCase();
        if (!Object.keys(LabelObj).includes(type)) return;

        let tempData = LabelObj[type][`gradient${gradient + ""}`];
        if (!(type && tempData && Array.isArray(Object.keys(tempData)) && Object.keys(tempData).length > 0)) return null;

        let { color = "", Icon = "" } = tempData;
        const labelContent = (
            <ColumnCenterCenter style={[{ height: 24, backgroundColor: color }, slope ? null : styles.labelRow, wrapStyle]}>
                {
                    typeof Icon === "function" ? <Icon /> : (
                        Icon?.$$typeof === Symbol.for("react.element") ?
                            Icon
                            :
                            <Text style={[styles.text, slope ? null : styles.textRow, textStyle]}>{Icon}</Text>
                    )
                }

            </ColumnCenterCenter>
        );

        if (slope) {
            return <View style={[styles.container, this._labelPosition, this._labelTransform, { width: this._labelWidth, height: this._labelHeight }]}>{labelContent}</View>;
        }

        if (gradient) {
            return <LinearGradient
                colors={color}
                style={[styles.container, {
                    width: 24,
                    height: 24,
                    ...containerStyle,
                }]}>
                {labelContent}
            </LinearGradient>;
        }

        return labelContent;
    }
}
