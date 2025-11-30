import React from "react";
import { Text } from "react-native";

import { translate } from "@/locales/translate";

import styles from "./styles";

class BonusTimeEnd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeOut: "-",
        };
        this.timeInterval = null;
    }

    componentDidMount() {
        this.startTimer();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.timeEnd !== this.props.timeEnd) {
            this.startTimer();
        }
    }

    componentWillUnmount() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    }

    startTimer = () => {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }

        const { timeEnd } = this.props;
        if (!timeEnd) return;

        let timeOut = `00 ${translate("天")} 00:00`;
        let times = (new Date(timeEnd).getTime() - new Date().getTime()) / 1000;

        if (times < 1) {
            this.setState({ timeOut });
            return;
        }

        this.timeInterval = setInterval(() => {
            times -= 1;
            let d = Math.floor(times / (60 * 60 * 24));
            let h = Math.floor((times / (60 * 60)) % 24);
            let m = Math.floor((times / 60) % 60);
            let s = Math.floor(times % 60);

            if (d < 1) d = "00";
            if (h < 10) h = "0" + h;
            if (m < 10) m = "0" + m;
            if (s < 10) s = "0" + s;

            timeOut = `${d} ${translate("天")} ${h}:${m}`;
            this.setState({ timeOut });

            if (d === "00" && h === "00" && m === "00" && s === "00") {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
                this.setState({ timeOut: "00:00:00" });

                this?.props?.callBack?.();
            }
        }, 1000);
    };

    render() {
        return <Text style={[styles.timeEnd]}>{this.state.timeOut}</Text>;
    }
}

export default BonusTimeEnd;
