import PropTypes from "prop-types";
import React, { Component } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

import Circle from "./circle";
import * as helper from "./helper";
import Line from "./line";

// 固定配置
const BoardSize = 300;
const Radius = 30;
const gapPadding = 25; // 圆圈之间间距
const offsetX = 0; // 整体向右移动
const offsetY = 0; // 整体向下移动

export default class GesturePassword extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.lastIndex = -1;
        this.sequence = "";
        this.isMoving = false;
        this.offsetXReal = 0;
        this.offsetYReal = 0;

        const spacing = (BoardSize - gapPadding * 2 - Radius * 2 * 3) / 2;

        let circles = [];
        for (let i = 0; i < 9; i++) {
            let p = i % 3;
            let q = Math.floor(i / 3);
            circles.push({
                isActive: false,
                x: offsetX + gapPadding + Radius + p * (Radius * 2 + spacing),
                y: offsetY + gapPadding + Radius + q * (Radius * 2 + spacing),
            });
        }

        this.state = {
            circles,
            lines: [],
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.frameRef?.measureInWindow((x, y) => {
                this.offsetXReal = x;
                this.offsetYReal = y;
            });
        }, 0);
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: this.onStart.bind(this),
            onPanResponderMove: this.onMove.bind(this),
            onPanResponderRelease: this.onEnd.bind(this),
        });
    }

    render() {
        const color = this.props.status === "wrong" ? this.props.wrongColor : this.props.status === "normal" ? this.props.normalColor : this.props.rightColor;

        return (
            <View ref={ref => (this.frameRef = ref)} style={[styles.frame, this.props.style]}>
                <View style={styles.board} {...this._panResponder.panHandlers}>
                    {this.renderCircles()}
                    {this.renderLines()}
                    <Line ref="line" color={this.props.transparentLine ? "#00000000" : color} />
                </View>
            </View>
        );
    }

    renderCircles() {
        const { status, normalColor, wrongColor, rightColor, innerCircle, outerCircle } = this.props;
        const color = status === "wrong" ? wrongColor : status === "normal" ? normalColor : rightColor;

        return this.state.circles.map((c, i) => (
            <Circle key={`c_${i}`} fill={c.isActive} normalColor={normalColor} color={color} x={c.x} y={c.y} r={Radius} inner={!!innerCircle} outer={!!outerCircle} />
        ));
    }

    renderLines() {
        const { status, wrongColor, rightColor, transparentLine, normalColor } = this.props;
        const color = transparentLine ? "#00000000" : status === "wrong" ? wrongColor : status === "normal" ? normalColor : rightColor;

        return this.state.lines.map((l, i) => <Line key={`l_${i}`} color={color} start={l.start} end={l.end} />);
    }

    setActive(index) {
        const circles = [...this.state.circles];
        circles[index].isActive = true;
        this.setState({ circles });
    }

    resetActive() {
        const circles = this.state.circles.map(c => ({
            ...c,
            isActive: false,
        }));
        this.setState({ circles, lines: [] });
        this.props.onReset && this.props.onReset();
    }

    getTouchChar({ x, y }) {
        for (let i = 0; i < 9; i++) {
            if (helper.isPointInCircle({ x, y }, this.state.circles[i], Radius)) {
                return String(i);
            }
        }
        return false;
    }

    getCrossChar(char) {
        const middles = "13457";
        const last = String(this.lastIndex);
        if (middles.includes(char) || middles.includes(last)) return false;

        const point = helper.getMiddlePoint(this.state.circles[last], this.state.circles[char]);

        for (let i = 0; i < middles.length; i++) {
            const index = middles[i];
            if (helper.isEquals(point, this.state.circles[index])) {
                return String(index);
            }
        }

        return false;
    }

    onStart(e, g) {
        const x = e.nativeEvent.pageX - this.offsetXReal;
        const y = e.nativeEvent.pageY - this.offsetYReal;

        const lastChar = this.getTouchChar({ x, y });
        if (lastChar !== false) {
            this.isMoving = true;
            this.lastIndex = Number(lastChar);
            this.sequence = lastChar;
            this.resetActive();
            this.setActive(this.lastIndex);

            const point = this.state.circles[this.lastIndex];
            this.refs.line.setNativeProps({ start: point, end: point });

            this.props.onStart && this.props.onStart();

            if (this.props.interval > 0) clearTimeout(this.timer);
        }
    }

    onMove(e, g) {
        const x = e.nativeEvent.pageX - this.offsetXReal;
        const y = e.nativeEvent.pageY - this.offsetYReal;

        if (this.isMoving) {
            this.refs.line.setNativeProps({ end: { x, y } });

            let lastChar = null;
            if (!helper.isPointInCircle({ x, y }, this.state.circles[this.lastIndex], Radius)) {
                lastChar = this.getTouchChar({ x, y });
            }

            if (lastChar && !this.sequence.includes(lastChar)) {
                if (!this.props.allowCross) {
                    const crossChar = this.getCrossChar(lastChar);
                    if (crossChar && !this.sequence.includes(crossChar)) {
                        this.sequence += crossChar;
                        this.setActive(Number(crossChar));
                    }
                }

                const lastIndex = this.lastIndex;
                const thisIndex = Number(lastChar);

                this.state.lines.push({
                    start: this.state.circles[lastIndex],
                    end: this.state.circles[thisIndex],
                });

                this.lastIndex = thisIndex;
                this.sequence += lastChar;
                this.setActive(this.lastIndex);

                const point = this.state.circles[this.lastIndex];
                this.refs.line.setNativeProps({ start: point });
            }

            if (this.sequence.length === 9) this.onEnd();
        }
    }

    onEnd(e, g) {
        if (this.isMoving) {
            const password = helper.getRealPassword(this.sequence);
            this.sequence = "";
            this.lastIndex = -1;
            this.isMoving = false;

            const origin = { x: 0, y: 0 };
            this.refs.line.setNativeProps({ start: origin, end: origin });

            this.props.onEnd && this.props.onEnd(password);

            if (this.props.interval > 0) {
                this.timer = setTimeout(() => this.resetActive(), this.props.interval);
            }
        }
    }
}

GesturePassword.propTypes = {
    message: PropTypes.string,
    normalColor: PropTypes.string,
    rightColor: PropTypes.string,
    wrongColor: PropTypes.string,
    status: PropTypes.oneOf(["right", "wrong", "normal"]),
    onStart: PropTypes.func,
    onEnd: PropTypes.func,
    onReset: PropTypes.func,
    interval: PropTypes.number,
    allowCross: PropTypes.bool,
    innerCircle: PropTypes.bool,
    outerCircle: PropTypes.bool,
    transparentLine: PropTypes.bool,
};

GesturePassword.defaultProps = {
    message: "",
    normalColor: "#474747",
    rightColor: "#5FA8FC",
    wrongColor: "#D93609",
    status: "normal",
    interval: 0,
    allowCross: false,
    innerCircle: true,
    outerCircle: true,
    transparentLine: false,
};

const styles = StyleSheet.create({
    frame: {
        width: BoardSize,
        height: BoardSize,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#292B38",
    },
    board: {
        width: BoardSize,
        height: BoardSize,
        position: "absolute",
        left: 0,
        top: 0,
    },
});
