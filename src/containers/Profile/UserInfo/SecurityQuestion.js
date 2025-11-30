import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { Actions } from "react-native-router-flux";

import CustomTextInput from "$Components/CustomTextInput";
import FilledButton from "$Components/FilledButton";
import { SelectListItem } from "$Components/ListItem";
import actions from "$LIB/redux/actions/index";
import { translate } from "$locales/translate";
import { useSecurityQuestion } from "$Hooks";
import { Toasts } from "$Toasts";

import Styles from "./Styles";

const SecurityQuestion = () => {
    const userInfo = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const { memberInfo = {} } = userInfo;
    const { secretQID, securityAnswer, securityQuestion = "" } = memberInfo;

    const {
        questions,
        selectedQuestionIndex,
        answerError,
        answerValue,
        isAnswerDisabled,
        isSubmitEnabled,
        onAnswerChange,
        onQuestionSelect,
        onSubmitSecurityQuestion,
    } = useSecurityQuestion({
        secretQID,
        securityAnswer,
        onUpdateMemberInfo: () => dispatch(actions.ACTION_UserInfo_updateMemberInfo({})),
        toasts: Toasts,
        onNavigateBack: () => {
            Actions.pop();
        },
    });

    return (
        <View style={Styles.viewContainer}>
            <KeyboardAwareScrollView>
                <View style={[Styles.commonWrap, { marginBottom: 10, paddingTop: 15 }]}>
                    <Text style={[Styles.SecurityQuestionTitle]}>{translate("安全提问")}</Text>
                    {securityQuestion ? (
                        <SelectListItem
                            text={securityQuestion}
                            isSelected={true}
                            onPress={() => {}}
                        />
                    ) : (
                        questions.map((item, index) => {
                            const isSelected = selectedQuestionIndex === index;
                            return (
                                <SelectListItem
                                    key={index}
                                    text={item.localizedName}
                                    isSelected={isSelected}
                                    onPress={() => {
                                        onQuestionSelect(index);
                                    }}
                                />
                            );
                        })
                    )}
                </View>

                <View style={[Styles.commonWrap, { marginTop: 10 }]}>
                    <CustomTextInput
                        errorMessage={answerError}
                        title={translate("安全提问答案")}
                        placeholder={translate("您的答案")}
                        titleStyle={Styles.inputTitle}
                        value={answerValue}
                        maxLength={50}
                        disabled={isAnswerDisabled}
                        onChangeText={value => {
                            onAnswerChange(value);
                        }}
                    />
                </View>

                <FilledButton
                    text={translate("提交")}
                    enable={isSubmitEnabled}
                    onPress={onSubmitSecurityQuestion}
                    wrapStyle={{ marginBottom: 40 }}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

export default SecurityQuestion;
