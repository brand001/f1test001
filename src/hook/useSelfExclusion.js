/**
 * NOTE:
 * - 依赖只放原始值或稳定引用（ref/memo/callback）
 * - 禁止把临时对象/匿名函数/props对象放进依赖
 */
import { useState, useEffect } from "react";
import { translate } from "$locales/translate";

// 自我限制天数选项数据
const SELF_EXCLUSION_LIMIT_OPTIONS = [
    {
        get name() {
            return translate("7 天内无法进行存款及游戏");
        },
        setting: "SevenDays",
        betLimitDayRange: 7,
    },
    {
        get name() {
            return translate("90 天内无法进行存款及游戏");
        },
        setting: "NinetyDays",
        betLimitDayRange: 90,
    },
    {
        get name() {
            return translate("永远");
        },
        setting: "Permanent",
        betLimitDayRange: 99999,
    },
];

/**
 * 自我限制管理的自定义 hook
 * @param {Object} options - 配置选项
 * @param {Object} options.toasts - Toasts 实例，用于显示加载和移除提示
 * @param {Object} options.selfExclusions - 用户自我限制数据（从 Redux 获取）
 * @param {Function} options.onUpdateSelfExclusion - 更新自我限制数据的 Redux action
 * @param {Function} options.onShowSelfExclusionPopup - 显示自我限制弹窗的回调函数
 * @returns {Object} 自我限制状态和方法
 */
export const useSelfExclusion = ({
    toasts,
    selfExclusions,
    onUpdateSelfExclusion,
    onShowSelfExclusionPopup,
}) => {
    // 限制天数选项数据
    const limitOptions = SELF_EXCLUSION_LIMIT_OPTIONS;
    // 表单状态
    const [formData, setFormData] = useState({
        activeCheck: -1, // 当前选中的限制天数索引
        showSubmitButton: true, // 是否显示提交按钮
        dropdownOpen: false, // 下拉框是否打开
    });

    // 组件挂载时初始化
    useEffect(() => {
        if (!selfExclusions) return;

        const { status, betLimitDayRange } = selfExclusions;
        const showSubmitButton = !Boolean(status);

        setFormData(prev => ({
            ...prev,
            showSubmitButton,
        }));

        if (!showSubmitButton) {
            const selfExcludeDuration = betLimitDayRange > 0 ? betLimitDayRange : 99999;

            if (selfExcludeDuration) {
                const activeCheckIndex = SELF_EXCLUSION_LIMIT_OPTIONS.findIndex(
                    v => v.betLimitDayRange == selfExcludeDuration
                );

                if (activeCheckIndex !== -1) {
                    setFormData(prev => ({
                        ...prev,
                        activeCheck: activeCheckIndex,
                    }));
                }
            }
        }
    }, [selfExclusions]);

    // 选择限制天数
    const onSelect = (key) => {
        setFormData(prev => ({
            ...prev,
            activeCheck: key,
        }));
    };

    // 设置下拉框打开状态
    const setDropdownOpen = (isOpen) => {
        setFormData(prev => ({
            ...prev,
            dropdownOpen: isOpen,
        }));
    };

    // 检查是否可以提交
    const isSubmitEnabled = formData.activeCheck >= 0;

    // 提交自我限制设置
    const onSubmit = async () => {
        const { activeCheck } = formData;
        if (activeCheck < 0) return;

        try {
            const selectedOption = SELF_EXCLUSION_LIMIT_OPTIONS[activeCheck];
            if (!selectedOption) return;

            const { setting, betLimitDayRange } = selectedOption;
            const memberData = {
                setting,
                isEnabled: true,
                limitAmount: "",
                betLimitDayRange,
            };

            toasts.loading(translate("设置中,请稍候..."), 2000);

            const res = await window.fetchRequest(window.ApiPort.SelfExclusions, "PUT", memberData);
            toasts.removeAll();

            const { isSuccess = false } = res || {};
            if (isSuccess) {
                toasts.success(translate("个人限制设置成功！"));

                setFormData(prev => ({
                    ...prev,
                    showSubmitButton: false,
                }));

                // 更新 Redux 状态
                if (onUpdateSelfExclusion) {
                    onUpdateSelfExclusion();
                }

                // 添加延迟确保 Redux 更新完成
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 显示自我限制弹窗
                if (onShowSelfExclusionPopup) {
                    await onShowSelfExclusionPopup();
                }
            } else {
                toasts.fail(translate("设置失败！"));
            }
        } catch (error) {
            toasts.removeAll();
            toasts.fail(translate("系统忙碌中，请稍后再试"));
            console.log(error);
        }
    };

    return {
        // 表单状态
        formData,

        // 事件处理方法
        onSelect,
        setDropdownOpen,
        onSubmit,

        // 计算属性
        isSubmitEnabled,

        // 限制选项数据
        limitOptions,

        // 解构的状态（向后兼容）
        activeCheck: formData.activeCheck,
        showSubmitButton: formData.showSubmitButton,
        dropdownOpen: formData.dropdownOpen,
    };
};

