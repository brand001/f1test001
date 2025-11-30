/**
 * NOTE:
 * - 依赖只放原始值或稳定引用（ref/memo/callback）
 * - 禁止把临时对象/匿名函数/props对象放进依赖
 */
import { useState, useEffect } from "react";
import { GetGlobalModal } from "$Utils/globalModal";
import StorageUtil from "$Utils/Storage";
import { translate } from "$locales/translate";

/**
 * 安全提问管理的自定义 hook
 * @param {Object} options - 配置选项
 * @param {string|number} options.secretQID - 用户已选择的安全问题 ID
 * @param {string} options.securityAnswer - 用户已有的安全提问答案
 * @param {Function} options.onUpdateMemberInfo - 更新用户信息的 Redux action
 * @param {Object} options.toasts - Toasts 实例，用于显示加载和移除提示
 * @param {Function} options.onNavigateBack - 导航返回的回调函数
 * @returns {Object} 安全提问状态和方法
 */
export const useSecurityQuestion = ({ secretQID, securityAnswer, onUpdateMemberInfo, toasts, onNavigateBack }) => {
    // 表单状态
    const [formData, setFormData] = useState({
        answer: "", // 安全提问答案
        questions: [], // 安全问题列表
        selectedQuestionIndex: 0, // 选中的安全问题索引
        answerError: "", // 答案错误提示
    });

    /**
     * 获取安全问题列表
     * 先从本地存储加载，然后从 API 获取最新数据
     */
    const getSecretQuestions = async () => {
        try {
            // 先从本地存储加载
            const cachedData = await StorageUtil.load("SecurityQuestion");
            if (cachedData) {
                setFormData(prev => ({
                    ...prev,
                    questions: cachedData,
                }));
            }
        } catch (err) {
            // 本地存储加载失败，显示加载提示
            toasts.loading(translate("加载中,请稍候..."));
        }

        try {
            // 从 API 获取最新数据
            const response = await fetchRequest(ApiPort.GetSecretQuestions, "GET");
            toasts.removeAll();

            const { isSuccess = false, result = [] } = response || {};

            if (isSuccess && Array.isArray(result) && result.length) {
                // 查找用户已选择的安全问题索引
                let selectedQuestionIndex = result.findIndex(item => item.id == secretQID);
                selectedQuestionIndex = selectedQuestionIndex === -1 ? 0 : selectedQuestionIndex;

                setFormData(prev => ({
                    ...prev,
                    questions: result,
                    selectedQuestionIndex,
                }));

                // 保存到本地存储
                StorageUtil.save({
                    key: "SecurityQuestion",
                    data: result,
                });
            }
        } catch (error) {
            toasts.removeAll();
        }
    };

    /**
     * 更新安全提问答案
     * @param {string} value - 答案文本
     */
    const onAnswerChange = (value) => {
        const trimmedValue = value.trim();
        setFormData(prev => {
            const answerError = trimmedValue.length > 0 ? "" : translate("请填写您的答案");

            return {
                ...prev,
                answer: trimmedValue,
                answerError,
            };
        });
    };

    /**
     * 选择安全问题
     * @param {number} index - 安全问题索引
     */
    const onQuestionSelect = (index) => {
        setFormData(prev => {
            const isSelected = prev.selectedQuestionIndex === index;
            return {
                ...prev,
                selectedQuestionIndex: isSelected ? -99 : index,
            };
        });
    };

    /**
     * 提交安全提问设置
     */
    const onSubmitSecurityQuestion = async () => {
        const { questions, selectedQuestionIndex, answer } = formData;

        if (!questions[selectedQuestionIndex]) {
            return;
        }

        const memberData = {
            key: "SecretQuestionAnswer",
            value1: questions[selectedQuestionIndex].id + "",
            value2: answer.trim(),
        };

        toasts.loading(translate("加载中,请稍候..."), 200);

        try {
            const response = await fetchRequest(window.ApiPort.Register, "PATCH", memberData);
            toasts.removeAll();
            const { isSuccess = false, result = {}, message = "" } = response || {};
            const { code = "" } = result || {};

            if (isSuccess && code == "MEM00075") {
                // 更新用户信息
                onUpdateMemberInfo();

                // 显示成功模态框
                GetGlobalModal({
                    title: translate("安全提问设置完成"),
                    message: translate("恭喜您，安全提问已经设置完成。日后可透过安全提问进行验证。"),
                    confirmText: translate("确认1"),
                    onConfirm: () => {
                        if (onNavigateBack) {
                            onNavigateBack();
                        }
                    },
                });
            } else {
                toasts.fail(message);
            }
        } catch (error) {
            toasts.removeAll();
        }
    };

    // 组件挂载时获取安全问题列表
    useEffect(() => {
        getSecretQuestions();
    }, []);

    // 计算提交按钮是否可用
    const isSubmitEnabled = formData.answer.length > 0 && formData.selectedQuestionIndex >= 0 && formData.answerError === "";

    // 计算输入框的值：如果用户已有答案则显示已有答案，否则显示当前输入的答案
    const answerValue = securityAnswer || formData.answer;

    // 计算输入框是否禁用：如果用户已有答案则禁用
    const isAnswerDisabled = !!securityAnswer;

    return {
        // 表单状态
        formData,

        // 事件处理方法
        onAnswerChange,
        onQuestionSelect,
        onSubmitSecurityQuestion,

        // 计算属性
        isSubmitEnabled,
        answerValue,
        isAnswerDisabled,

        // 解构的状态（语义化命名）
        answer: formData.answer,
        questions: formData.questions,
        selectedQuestionIndex: formData.selectedQuestionIndex,
        answerError: formData.answerError,
    };
};

