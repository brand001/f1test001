import { useState } from "react";
import { translate } from "$locales/translate";
import { checkEmail, checkLoginUserName } from "$Utils";
import { alphaNumericOnly } from "@/actions/Reg";
import { PiwikEventDataHandle } from "@/actions/PiwikEventData";

/**
 * 忘记密码/用户名的表单自定义 hook
 * @param {Object} options - 配置选项
 * @param {Object} options.toasts - Toasts 实例，用于显示加载和移除提示
 * @returns {Object} 表单状态和方法
 */
export const useForgetNameForm = ({ toasts }) => {
    // 表单状态
    const [formData, setFormData] = useState({
        forgetType: "password", // 'password' 或 'userName'
        email: "",
        emailError: "",
        userName: "",
        userNameError: "",
        result: null, // null: 不显示, true: 成功, false: 失败
    });

    // 更新表单字段
    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 处理用户名输入
    const onUserNameChange = (value) => {
        const trimmedValue = value.trim().replace(alphaNumericOnly, "");
        const userNameError = checkLoginUserName(trimmedValue) || "";

        updateField("userName", trimmedValue);
        updateField("userNameError", userNameError);
    };

    // 处理邮箱输入
    const onEmailChange = (value) => {
        const trimmedValue = value.trim();
        const emailError = checkEmail(trimmedValue) || "";

        updateField("email", trimmedValue);
        updateField("emailError", emailError);
    };

    // 切换忘记类型（密码/用户名）
    const onForgetTypeChange = (type) => {
        const isPassword = type === "password";

        setFormData(prev => ({
            ...prev,
            forgetType: isPassword ? "password" : "userName",
            email: "",
            emailError: "",
            userName: "",
            userNameError: "",
            result: null,
        }));

        // 发送分析事件
        PiwikEventDataHandle(isPassword ? "forgetPassword2" : "forgetName2");
    };

    // 忘记密码 API 调用
    const forgetPassword = async () => {
        updateField("result", null); // 重置结果状态
        toasts.loading(translate("加载中,请稍候..."), 20);

        try {
            // 获取当前状态值
            const currentData = formData;
            const params = {
                userName: currentData.userName,
                email: currentData.email,
            };

            const data = await window.fetchRequest(window.ApiPort.ForgetPasswordByEmail, "POST", params);
            toasts.removeAll();

            const { isSuccess = false, result = {} } = data;
            const { message = "" } = result;

            updateField("result", isSuccess);

            // 发送分析事件
            PiwikEventDataHandle({
                eventTitle: "forgetPassword1",
                isSuccess: isSuccess ? 2 : 1,
                ...(isSuccess ? {} : {
                    customProperties: {
                        "ForgetPassword_S_Email&Name_ErroMsg": message || "",
                    },
                })
            });
        } catch (error) {
            toasts.removeAll();
            updateField("result", false);
        }
    };

    // 忘记用户名 API 调用
    const forgetUsername = async () => {
        updateField("result", null); // 重置结果状态
        toasts.loading(translate("加载中,请稍候..."), 20);

        try {
            // 获取当前状态值
            const currentData = formData;
            const data = await window.fetchRequest(
                window.ApiPort.ForgetUsernameByEmail + "email=" + currentData.email + "&",
                "POST"
            );
            toasts.removeAll();

            const { isSuccess = false, result = {} } = data;
            const { message = "" } = result;

            updateField("result", isSuccess);

            // 发送分析事件
            PiwikEventDataHandle({
                eventTitle: "forgetName1",
                isSuccess: isSuccess ? 2 : 1,
                ...(isSuccess ? {} : {
                    customProperties: {
                        "ForgetUsername_S_Email_ErroMsg": message || "",
                    },
                })
            });
        } catch (error) {
            toasts.removeAll();
            updateField("result", false);
        }
    };

    // 提交表单
    const onSubmit = () => {
        (formData.forgetType === "password" ? forgetPassword : forgetUsername)();
    };

    // 检查表单是否有效
    const isFormValid = () => {
        const isEmailValid = formData.email.length > 0 && formData.emailError.length <= 0;

        if (formData.forgetType === "password") {
            return isEmailValid && formData.userName.length > 0 && formData.userNameError.length <= 0;
        }

        return isEmailValid;
    };

    // 处理 LiveChat 点击事件
    const onLiveChatClick = () => {
        PiwikEventDataHandle(formData.forgetType === "password" ? "forgetPassword3" : "forgetName3");
    };

    // InfoBar 配置
    const getInfoBarConfig = () => {
        if (formData.result === null) {
            return null; // 不显示
        }

        const isPassword = formData.forgetType === "password";

        if (formData.result === true) {
            // 成功状态
            return {
                type: "success",
                text: isPassword
                    ? translate("已将更新密码链接以邮件方式发送, 请至您的注册邮箱查收")
                    : translate("用户名已成功发送至您的邮箱")
            };
        } else {
            // 失败状态
            return {
                type: "error",
                text: isPassword
                    ? translate("电子邮箱或用户名无效，请重试")
                    : translate("请提供有效信息以便处理您的请求")
            };
        }
    };

    return {
        // 表单状态
        formData,

        // 表单方法
        onUserNameChange,
        onEmailChange,
        onForgetTypeChange,
        onSubmit,
        onLiveChatClick,

        // 计算属性
        isFormValid: isFormValid(),

        // InfoBar 配置
        infoBarConfig: getInfoBarConfig(),

        // 解构的状态（向后兼容）
        forgetType: formData.forgetType,
        email: formData.email,
        emailError: formData.emailError,
        userName: formData.userName,
        userNameError: formData.userNameError,
    };
};
