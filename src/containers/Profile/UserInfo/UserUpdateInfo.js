import { Modal as ModalANTD } from "@ant-design/react-native";
import moment from "moment";
import React from "react";
import { Image, Text, View } from "react-native";
import { DatePicker } from "react-native-common-date-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { FormatDate, DateFormats } from "$Utils";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";
import { GetGlobalModal } from "$Utils/globalModal";
import Color from "$Components/Color";
import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { ArrowIcon, DepositVerifyIcon } from "$Components/icons/index.js";
import InfoBar from "$Components/InfoBar";
import UnderlinedButton from "$Components/UnderlinedButton";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { Toasts } from "$Toasts";

import { ContactArr, DatePickerLocale, GenderArr, UserUpdateInfoDetail, FilterList } from "./../data";
import Styles from "./Styles";
import { RowCenterBetween } from "$Components/CustomView";
import NavBack from "$Components/Nav/NavBack";
import { SelectListItem } from "$Components/ListItem";
import { MIN_AGE } from "@/lib/constants";

class UserUpdateInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "",

            IsCall: true,
            IsSMS: true,
            IsEmail: true,
            IsLine: true,

            IsNonMandatory: false,

            inputError: "",
            isShowPisker: false,

            originalValue: "",

            isSucessSubmit: false,
        };
    }

    componentDidMount(props) {
        let { updateType = "", userInfo } = this.props;
        let { memberInfo = {} } = userInfo || {};

        this.props.navigation.setParams({
            title: translate(UserUpdateInfoDetail[updateType]?.title),
            leftButton: () => (
                <NavBack
                    fill={Color.white}
                    width={15}
                    height={15}
                    direction="left"
                    onPress={this.handleBack}
                />
            ),
        });

        if (updateType === "contact") {
            let OfferContacts = memberInfo?.offerContacts;
            let inputText = memberInfo?.contacts.find(v => v.contactType.toLocaleLowerCase() === "line" || v.contactType.toLocaleLowerCase() == 9)?.contact || "";
            this.setState({
                originalValue: inputText,
                inputText,
            });

            if (OfferContacts) {
                this.setState({
                    IsCall: OfferContacts.isCall,
                    IsSMS: OfferContacts.isSMS,
                    IsEmail: OfferContacts.isEmail,
                    IsLine: OfferContacts.isLine,

                    IsNonMandatory: OfferContacts.isNonMandatory,
                });
            }
        } else {
            let contacts = memberInfo?.contacts;
            let inputText =
                contacts.find(v => v.contactType.toLocaleUpperCase() === updateType.toLocaleUpperCase() || (updateType == "telegram" ? v.contactType.toLocaleLowerCase() == 15 : false))?.contact || "";

            this.setState({
                originalValue: inputText,
                inputText,
            });
        }
    }

    componentWillUnmount() {
        if (this.state.isSucessSubmit) {
            if (this.props.formPage == "bankInfo") {
                this.props?.callBack?.();
            }
            if (this.props.formPage == "Recommend") {
                this.props?.callBack?.();
            }
        } else {

        }

        if (this.props.formPage == "Referee") {// th 时，如果没有验证姓名， 关闭该页面时， 继续出现任务弹窗 1111111
            this.props?.callBack?.(this.state.isSucessSubmit);
        }

        if (this.props.updateType == "deposit") {
            this.props?.callBack?.(this.state.isSucessSubmit);
        }
    }

    handleBack = () => {
        const { fromUploadFile } = this.props;
        if (fromUploadFile && !this.state.isSucessSubmit) {
            GetGlobalModal({
                title: translate("温馨提醒3"),
                message: translate("验证尚未完成，若现在离开，您将需要前往“验证中心”重新开始验证流程。"),
                cancelText: translate("离开2"),
                onCancel: () => {
                    Actions.pop();
                },
                confirmText: translate("继续验证"),
                onConfirm: () => {},
            });
        } else {
            Actions.pop();
        }
    };

    openConfirmPopup = () => {
        GetGlobalModal({
            title: translate("确认提交"),
            message: translate("一旦提交后，无法再进行修改。"),
            cancelText: translate("取消1"),
            onCancel: () => {},
            confirmText: translate("确认1"),
            onConfirm: () => {
                this.submit();
            },
        });
    };

    getParams(updateType) {
        let { inputText = "" } = this.state;
        let params = {};
        if (updateType == "dob") {
            inputText = moment(inputText).format("YYYY-MM-DD");
        }
        if (updateType == "telegram") {
            params = {
                messengerDetails: [
                    {
                        Contact: inputText,
                        ContactTypeId: "15",
                    },
                ],
            };
        } else if (updateType == "contact") {
            if (window.LANGUAGE == "TH") {
                params = {
                    offerContacts: {
                        isCall: this.state.IsCall,
                        isSMS: this.state.IsSMS,
                        isEmail: this.state.IsEmail,
                        IsLine: this.state.IsLine,
                    },
                };
                if (this.state.IsLine && inputText) {
                    params.messengerDetails = [
                        {
                            Contact: inputText,
                            ContactTypeId: 9,
                        },
                    ];
                }
            } else {
                let value1 = {
                    isCall: this.state.IsCall,
                    isSMS: this.state.IsSMS,
                    isEmail: this.state.IsEmail,
                };
                params = {
                    key: "offerContacts",
                    value1: JSON.stringify(value1),
                };
            }
        } else if (updateType == "deposit" || updateType == "firstName") {
            if (window.LANGUAGE == "TH") {
                const index = inputText.indexOf(" "); // 找到第一个空格的位置
                params = {
                    key: "FirstName",
                    value1: index !== -1 ? inputText.slice(0, index) : inputText, // 截取空格前的部分
                    value2: index !== -1 ? inputText.slice(index + 1) : "",
                };
            } else {
                params = {
                    key: "firstName",
                    value1: inputText,
                };
            }
        } else if (updateType == "facebook") {
            params = {
                messengerDetails: [
                    {
                        Contact: inputText,
                        ContactTypeId: "14",
                    },
                ],
            };
        } else {
            if (window.LANGUAGE == "TH" && updateType == "firstName") {
                const index = inputText.indexOf(" "); // 找到第一个空格的位置

                params = {
                    key: updateType,
                    value1: index !== -1 ? inputText.slice(0, index) : inputText, // 截取空格前的部分
                    value2: index !== -1 ? inputText.slice(index + 1) : "",
                };
            } else {
                params = {
                    key: updateType,
                    value1: inputText,
                };
            }
        }

        return params;
    }

    async submit() {
        let { updateType = "" } = this.props;
        let method = updateType == "telegram" || updateType == "facebook" || (window.LANGUAGE == "TH" && updateType == "contact") ? "PUT" : "PATCH";
        let params = this.getParams(updateType);

        Toasts.loading(translate("加载中,请稍候..."), 200);
        fetchRequest(window.ApiPort.Register, method, params)
            .then(async data => {
                Toasts.removeAll();

                if (data.result && (data?.isSuccess || data?.result?.isSuccess)) {
                    this.props.userInfo_updateMemberInfo({});
                    this.setState({
                        isSucessSubmit: true,
                    });
                    if (this.props.onSuccess && this.props.fromUploadFile) {
                        await this.props.onSuccess();
                    } else {
                        Actions.pop();
                    }
                    if (updateType !== "deposit") {
                        let message = translate("更新成功!");
                        Toasts.success(message);
                    }
                } else {
                    let message = data?.result?.message || data?.message || data?.errors[0]?.message;
                    Toasts.fail(message);

                    if (updateType == "deposit") {
                        PiwikEventDataHandle({
                            eventTitle: "AvailabilityProcess1",
                            isSuccess: 1,
                            customProperties: {
                                "KYC_S_RealName": data?.result?.message || "", // 修正 key 格式
                            },
                        });
                    }
                }
            })
            .catch(data => {
                let message = data?.result?.message || data?.message || data?.errors[0]?.message;
                Toasts.fail(message, 1);
            });
    }

    //联系方式选择
    checkContact() {
        const st = this.state;
        let arrs = [st.IsCall, st.IsSMS, st.IsEmail, st.IsLine];
        arrs = arrs.filter(item => {
            return item == true;
        });
        if (st.IsNonMandatory) this.setState({ inputError: "" });
        if (!st.IsNonMandatory) {
            if (arrs.length < 2) {
                this.setState({
                    inputError: translate("请至少选择两个联系方式"),
                });
            } else if (st.IsLine) {
                this.onChangeText(st.inputText);
            } else {
                this.setState({ inputError: "" });
            }
        }
    }

    getBtnStatus() {
        let { updateType = "" } = this.props;
        let { inputError = "", inputText = "" } = this.state;
        let { isInput = false } = UserUpdateInfoDetail[updateType] || {};

        let isFromDeposit = updateType == "deposit";

        if (isInput || isFromDeposit) {
            return Boolean(inputError) == "" && inputText?.length > 0;
        } else if (updateType == "dob") {
            return Boolean(inputText);
        } else if (updateType == "gender") {
            return Boolean(inputText);
        } else if (updateType == "contact") {
            return Boolean(inputError) == "";
        }
    }

    onChangeText(text) {
        let { updateType = "" } = this.props;
        let { regTest = () => {} } = UserUpdateInfoDetail[updateType == "contact" && this.state.IsLine ? "line" : updateType] || {};

        let { value = "", inputError = "" } = regTest({ value: text });
        this.setState({
            inputText: value,
            inputError,
        });
    }

    renderList({ v, i }) {
        const { updateType } = this.props;
        const flag = updateType == "contact" ? this.state[`${v.type}`] : this.state.inputText == v.type;
        return (
            <SelectListItem
                key={i}
                text={v?.text}
                isSelected={flag}
                onPress={() => {
                    this.listOnpress(v);
                }}
            />
        );
    }

    listOnpress(v) {
        let { updateType } = this.props;

        if (updateType == "contact") {
            this.setState(
                {
                    [`${v.type}`]: !this.state[`${v.type}`],
                },
                () => {
                    this.checkContact();
                },
            );
        } else {
            this.setState({
                inputText: v.type,
            });
        }
    }

    render() {
        let { inputText, originalValue, isShowPisker, inputError, contact } = this.state;
        let { updateType = "" } = this.props;
        let {
            inputTitle = "",
            inputTitle2 = "",
            inforText = "",
            isModal = false,
            placeholder = "",
            maxLength = 50,
            regTest = () => {},
            isInput = false,
        } = UserUpdateInfoDetail[updateType == "contact" && this.state.IsLine ? "line" : updateType] || {};
        let disabled = originalValue?.length > 0 && updateType === "contact";
        inputText = disabled ? originalValue[0] + "*********" : inputText;

        let isFromDeposit = updateType == "deposit";

        let RenderInput = () => {
            return (
                <CustomTextInput
                    title={translate(inputTitle)}
                    titleStyle={Styles.inputTitle}
                    // Only TH language need to show inputTitle2
                    title2={window.LANGUAGE === "TH" ? translate(inputTitle2) : undefined}
                    title2Style={Styles.inputTitle2}
                    errorMessage={updateType === "contact" && this.state.IsLine ? "" : translate(inputError)}
                    type={"error"}
                    disabled={disabled}
                    maxLength={maxLength}
                    returnKeyType="done"
                    value={inputText}
                    placeholder={translate(placeholder)}
                    onChangeText={this.onChangeText.bind(this)}
                    placeholderTextColor={"#999999"}
                    autoFocus={true}
                />
            );
        };

        return (
            <View style={Styles.viewContainer}>
                <KeyboardAwareScrollView>
                    {
                        isFromDeposit &&
                        <View style={{ alignItems: "center" }}>
                            <DepositVerifyIcon wrapStyle={Styles.depositImg} />
                            <Text style={Styles.depositText}>{translate("请填写您的真实姓名，该姓名应与您的银行账户姓名相符，以避免存款/取款交易无法处理。")}</Text>
                        </View>
                    }

                    <View style={[Styles.commonWrap]}>
                        {(isInput || isFromDeposit) && RenderInput()}

                        {updateType === "dob" && (
                            <View>
                                <Text style={Styles.inputTitle}>{translate(inputTitle)}</Text>
                                <RowCenterBetween
                                    style={[Styles.listBorder, { borderColor: isShowPisker ? Color.theme : Color.silverGray }]}
                                    onPress={() => {
                                        this.setState({
                                            isShowPisker: true,
                                        });
                                    }}>
                                    <Text
                                        style={{
                                            color: "#999999",
                                            fontWeight: "400",
                                        }}>
                                        {inputText == "" ? translate("请点击选择出生日期") : FormatDate(moment(inputText), { formatType: "dash", timeLevel: "onlyDate" })}
                                    </Text>

                                    <ArrowIcon fill={Color.gray} width={10} height={10} direction={!isShowPisker ? "bottom" : "top"} />
                                </RowCenterBetween>
                            </View>
                        )}

                        {updateType === "gender" && (
                            <View>
                                <Text style={Styles.inputTitle}>{translate(inputTitle)}</Text>

                                {GenderArr.map((v, i) => this.renderList({ v, i }))}
                            </View>
                        )}

                        {updateType === "contact" && (
                            <View>
                                <Text style={Styles.inputTitle}>{translate(inputTitle)}</Text>

                                {ContactArr.filter(FilterList).map((v, i) => this.renderList({ v, i }))}

                                {this.state.IsLine && RenderInput()}

                                {!!inputError && (
                                    <InfoBar
                                        wrapStyle={{
                                            paddingVertical: 8,
                                            paddingLeft: 8,
                                        }}
                                        type={"error"}
                                        textStyle={{ fontSize: 14 }}
                                        text={translate(inputError)}
                                    />
                                )}
                            </View>
                        )}

                        {Boolean(inforText) && !isFromDeposit && <Text style={Styles.tipText}>{translate(inforText)}</Text>}
                    </View>

                    <ModalANTD
                        popup
                        visible={isShowPisker}
                        maskClosable={true}
                        animationType="slide-up"
                        style={{ backgroundColor: "transparent" }}
                        onClose={() => {
                            this.setState({
                                isShowPisker: "",
                            });
                        }}>
                        <View style={Styles.modalBgContainer}>
                            <DatePicker
                                type={DateFormats[window.LANGUAGE].dash}
                                value={inputText == "" ? new Date(moment(new Date()).subtract(MIN_AGE, "year")) : new Date(inputText)}
                                minDate={new Date(1930, 1, 1)}
                                maxDate={new Date(moment(new Date()).subtract(MIN_AGE, "year"))}
                                mode="date"
                                //showToolBar={false}
                                titleText={translate("选择日期")}
                                titleStyle={{
                                    color: "#000",
                                    fontWeight: "700",
                                    fontSize: 16,
                                }}
                                cancelText={translate("取消")}
                                toolBarCancelStyle={{
                                    color: "#00A6FF",
                                    fontWeight: "400",
                                    fontSize: 16,
                                }}
                                confirmText={translate("确定2")}
                                toolBarConfirmStyle={{
                                    color: "#00A6FF",
                                    fontWeight: "700",
                                    fontSize: 16,
                                }}
                                cancel={() => {
                                    this.setState({
                                        isShowPisker: false,
                                    });
                                }}
                                confirm={value => {
                                    this.setState({
                                        inputText: moment(new Date(value)),
                                        isShowPisker: false,
                                    });
                                }}
                                format={DateFormats[window.LANGUAGE].dash}
                                locale={DatePickerLocale}></DatePicker>
                        </View>
                    </ModalANTD>

                    <FilledButton
                        text={updateType == "deposit" ? translate("立即验证3") : translate("提交")}
                        enable={this.getBtnStatus()}
                        onPress={() => {
                            isModal ? this.openConfirmPopup() : this.submit();
                        }}
                        wrapStyle={{ marginBottom: 40 }}
                    />

                    {updateType == "deposit" && (
                        <UnderlinedButton
                            text={translate("跳过验证")}
                            onPress={() => {
                                Actions.pop();
                            }}
                            textDecorationLine={"none"}
                            wrapStyle={{ marginBottom: 20 }}
                        />
                    )}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
});
const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UserUpdateInfo);
