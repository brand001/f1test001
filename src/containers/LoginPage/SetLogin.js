/**
 * 人脸样本采集封装（百度AI-SDK）
 */
import React from "react";
import { View } from "react-native";
import { Actions } from "react-native-router-flux";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import { ArrowIcon } from "$Components/icons/index.js";
import RadioButton from "$Components/RadioButton";
import { ListItem } from "$Components/ListItem";
import StorageUtil from "$Utils/Storage";

import styles from "./style";
class SetLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginType: 0, //0空，1指纹，2九宫格
            userName: this.props.userName,
        };
    }
    componentWillMount() {
        this.getFastLogin();
    }
    componentWillUnmount() {}

    getFastLogin() {
        //ios获取快速登录方式
        let fastLoginKey = "fastLogin" + this.state.userName.toLowerCase();
        StorageUtil.load(fastLoginKey)
            .then(ret => {
                let loginType = 1;
                if (ret == "LoginPattern") {
                    loginType = 2;
                }
                this.setState({ loginType });
            });
    }

    setLogin(key) {
        if (this.state.loginType == key) {
            return;
        }

        const userName = this.state.userName.toLowerCase();
        if (key == 0) {
            this.setState({ loginType: 0 });
            //清除
            let fastLogin = "fastLogin" + userName;
            StorageUtil.remove(fastLogin);
            return;
        }

        if (key == 1) {
            Actions.LoginTouch({
                userName,
                fastChange: true,
                changeBack: () => {
                    this.setState({ loginType: 1 });
                },
            });
        }

        if (key == 2 || key == 3) {
            Actions.LoginPattern({
                userName,
                fastChange: true,
                forgotPass: key == 3,
                changeBack: () => {
                    this.setState({ loginType: 2 });
                },
            });
        }
    }

    render() {
        const { loginType } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "#EFEFF4", padding: 15 }}>
                <View style={styles.setLogin}>
                    <ListItem
                        text={translate("使用指纹辨识登入")}
                        rightComponent={<RadioButton isSelected={loginType == 1} />}
                        onPress={() => {
                            this.setLogin(1);
                        }}
                    />
                    <ListItem
                        text={translate("使用图形密码2")}
                        rightComponent={<RadioButton isSelected={loginType == 2} />}
                        onPress={() => {
                            this.setLogin(2);
                        }}
                    />
                    {loginType == 2 && (
                        <ListItem
                            text={translate("变更图形密码")}
                            isLast={true}
                            rightComponent={<ArrowIcon fill={Color.gray} width={15} height={15} direction="right" />}
                            onPress={() => {
                                this.setLogin(3);
                            }}
                        />
                    )}
                    <ListItem
                        text={translate("关闭所有快速登入功能")}
                        isLast={true}
                        rightComponent={<RadioButton isSelected={loginType == 0} />}
                        onPress={() => {
                            this.setLogin(0);
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default SetLogin;
