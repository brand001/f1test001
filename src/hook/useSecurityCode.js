
/**
 * NOTE:
 * - 依赖只放原始值或稳定引用（ref/memo/callback）
 * - 禁止把临时对象/匿名函数/props对象放进依赖
 */
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { translate } from "$locales/translate";
import { CopyText, LiveChatOpenGlobe } from "$Utils";
import StorageUtil from "$Utils/Storage";
import { GetGlobalModal } from "$Utils/globalModal";
import CountdownUtil from "$Utils/CountdownUtil";

// 安全码状态常量
const CODE_STATUS = {
    ACTIVE: "active",      // 有效状态，显示安全码和倒计时
    EXPIRED: "expired",    // 已过期状态
};

/**
 * 安全码管理的自定义 hook
 * @param {Object} options - 配置选项
 * @param {Object} options.toasts - Toasts 实例，用于显示加载和移除提示
 * @returns {Object} 安全码状态和方法
 */
export const useSecurityCode = ({ toasts }) => {
    // 表单状态
    const [formData, setFormData] = useState({
        securityCode: "", // 安全码对象，包含 passcode 和 expiredDateTime，空字符串表示未创建
        remainingTimeText: "", // 剩余时间文本（格式：MM:SS），用于显示倒计时
        isSubmitEnabled: true, // 倒计时是否激活，true 表示可以创建新安全码，false 表示倒计时进行中需禁用按钮
        showReuseWarning: false, // 是否显示"安全码仍可使用"的警告提示（从存储加载的有效安全码会显示此提示）
        codeStatus: CODE_STATUS.ACTIVE, // 安全码状态：ACTIVE（有效）、EXPIRED（已过期）
    });

    const countdownRef = useRef(null); // 倒计时实例
    const startCountdownRef = useRef(null); // 存储 startCountdown 函数引用

    // 开始倒计时
    const startCountdown = (countdownNum) => {
        countdownRef.current?.clear();

        countdownRef.current = new CountdownUtil(
            countdownNum,
            formattedTime => {
                // 直接使用 setFormData，避免依赖 updateField
                setFormData(prev => ({
                    ...prev,
                    remainingTimeText: formattedTime,
                }));
            },
            () => {
                countdownRef.current?.clear();
                setFormData(prev => ({
                    ...prev,
                    isSubmitEnabled: true,
                    codeStatus: CODE_STATUS.EXPIRED,
                    showReuseWarning: false,
                }));
            },
        );

        countdownRef.current.start();
    };

    // 更新 ref，保持函数引用最新
    startCountdownRef.current = startCountdown;

    // 从存储中加载安全码（内部方法）
    const loadSecurityCodeFromStorage = async () => {
        try {
            const res = await StorageUtil.load("securityCode");
            const { expiredDateTime } = res || {};
            const countdownNum = moment(expiredDateTime).diff(moment(new Date()), "seconds");

            if (countdownNum > 0) {
                // 直接使用 setFormData，避免依赖 updateField
                setFormData(prev => ({
                    ...prev,
                    securityCode: res,
                    isSubmitEnabled: false, // 倒计时进行中，禁用按钮
                    showReuseWarning: true, // 从存储加载的有效安全码，显示警告提示
                    codeStatus: CODE_STATUS.ACTIVE, // 从存储加载的有效安全码，状态为 ACTIVE
                }));
                startCountdownRef.current?.(countdownNum);
            }
        } catch (err) {
            console.log(err);
        }
    };



    // 显示错误模态框（内部方法）
    const showErrorModal = () => {
        GetGlobalModal({
            title: translate("无法生成安全码"),
            iconName: "warning",
            message: translate("抱歉，我们目前无法生成安全码。 请稍后重试或联系在线客服寻求帮助"),
            cancelText: translate("关闭(安全码)"),
            onCancel: () => {},
            confirmText: translate("在线客服(安全码)"),
            onConfirm: () => {
                LiveChatOpenGlobe();
            },
        });
    };

    // 生成新的安全码
    const onGenerateCode = async () => {
        setFormData(prev => {
            if (!prev.isSubmitEnabled) return prev;
            return { ...prev, isSubmitEnabled: false };
        });

        toasts.loading(translate("加载中,请稍候..."), 200);

        try {
            // 使用与原始代码一致的 API 调用方式
            const res = await fetchRequest(ApiPort.Generate, "POST");
            toasts.removeAll();

            const { isSuccess = false, result: data = null } = res || {};

            if ((isSuccess && data?.isSuccess)) {
                const { expiredDateTime } = data;
                const countdownNum = moment(expiredDateTime).diff(moment(new Date()), "seconds");

                // 直接使用 setFormData，避免依赖 updateField
                setFormData(prev => ({
                    ...prev,
                    securityCode: data,
                    codeStatus: CODE_STATUS.ACTIVE,
                    isSubmitEnabled: false, // API 获取到 code 后，倒计时进行中，禁用按钮
                    showReuseWarning: false, // 新生成的安全码，不显示警告提示
                }));
                startCountdownRef.current?.(countdownNum);

                // 保存安全码到本地存储
                StorageUtil.save({
                    key: "securityCode",
                    data: data,
                });
            } else {
                // API 失败时恢复 isSubmitEnabled，允许用户重试
                setFormData(prev => ({
                    ...prev,
                    isSubmitEnabled: true,
                }));
                showErrorModal();
            }
        } catch (error) {
            toasts.removeAll();
            // API 失败时恢复 isSubmitEnabled，允许用户重试
            setFormData(prev => ({
                ...prev,
                isSubmitEnabled: true,
            }));
            showErrorModal();
        }
    };

    // 复制安全码
    const onCopyCode = (codeText) => {
        setFormData(prev => {
            if (prev.codeStatus === CODE_STATUS.EXPIRED) {
                return prev;
            }
            CopyText(codeText);
            return prev;
        });
    };

    // 组件挂载时加载安全码
    useEffect(() => {
        loadSecurityCodeFromStorage();

        // 清理倒计时
        return () => {
            countdownRef.current?.clear();
        };
        // loadSecurityCodeFromStorage 依赖为空，是稳定的，只需要在挂载时执行一次
    }, []);

    return {
        // 表单状态
        formData,

        // 事件处理方法
        onGenerateCode,
        onCopyCode,

        // 解构的状态（向后兼容）
        securityCode: formData.securityCode,
        remainingTimeText: formData.remainingTimeText,
        isSubmitEnabled: formData.isSubmitEnabled,
        showReuseWarning: formData.showReuseWarning,
        codeStatus: formData.codeStatus,

        // 导出 CODE_STATUS 常量
        CODE_STATUS,
    };
};

