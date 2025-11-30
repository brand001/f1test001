import PropTypes from "prop-types";
import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import { ColumnCenterCenter, RowStartBetween } from "./CustomView";

//验证码输入框插件
export default class VerificationCodeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: true,
            isFocusedIndex: 0,
            textString: "",
        };
    }

    /**
     * 默认value
     */
    static defaultProps = {
        inputSize: 6,
    };

    static propTypes = {
        inputSize: PropTypes.number,
    };

    /**
     *   初始化 text
     * @param callback
     * @returns {Array}
     */
    renderText(callback) {
        let inputs = [];
        let flag = this.props.err;
        for (let i = 0; i < this.props.inputSize; i++) {
            inputs.push(
                <ColumnCenterCenter
                    style={[
                        styles.textWrap,
                        {
                            borderColor: flag ? "#EB2121" : this.state.textString.length === i ? "#00A6FF" : "#fff",
                        },
                    ]}>
                    <Text style={[styles.text]}>{this.state.textString[i]}</Text>
                </ColumnCenterCenter>,
            );
        }

        return inputs;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.inputRef?.focus()}>
                <ColumnCenterCenter style={[styles.viewBox]}>
                    {/**text*/}
                    <RowStartBetween style={[styles.textBox]}>{this.renderText()}</RowStartBetween>

                    {/**input*/}
                    <TextInput
                        value={this.state.textString}
                        style={styles.intextInputStyle}
                        onChangeText={text => {
                            let value = text.replace(/[^0-9]/g, "");
                            this.setState({
                                textString: value,
                            });
                            this.props.TextInputChange(value);
                        }}
                        underlineColorAndroid="transparent"
                        maxLength={this.props.inputSize}
                        autoFocus={true}
                        caretHidden={true}
                        keyboardType="numeric"
                        selectionColor="transparent"
                    />
                </ColumnCenterCenter>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    viewBox: {
        width: "100%",
        height: 40,
    },
    textBox: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    textWrap: {
        height: 40,
        width: 40,
        borderWidth: 2,
        borderColor: "#fff",
        color: "#000",
        fontSize: 18,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    text: {
        color: "#000",
        fontSize: 18,
        textAlign: "center",
    },
    inputItem: {
        lineHeight: 20,
        width: 80,
        textAlign: "center",
        height: 40,
    },
    intextInputStyle: {
        width: 400,
        height: 40,
        fontSize: 18,
        color: "transparent",
    },
});
