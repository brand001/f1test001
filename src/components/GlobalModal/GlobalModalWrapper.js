import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useGlobalModal } from "../../contexts/GlobalModalContext";
import { setGlobalModal } from "$Utils/globalModal";
import GlobalModal from "./index";

const GlobalModalWrapper = forwardRef((props, ref) => {
    const { showModal, hideModal, hideAllModals, hideLastModal } = useGlobalModal();

    // 設置全局實例
    useEffect(() => {
        setGlobalModal({ showModal, hideModal, hideAllModals, hideLastModal });
    }, [showModal, hideModal, hideAllModals, hideLastModal]);

    // 暴露方法給父組件（向後兼容）
    useImperativeHandle(ref, () => ({
        showModal,
        hideModal,
        hideAllModals,
        hideLastModal
    }));

    return <GlobalModal {...props} />;
});

GlobalModalWrapper.displayName = "GlobalModalWrapper";

export default GlobalModalWrapper;
