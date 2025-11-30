import React, { createContext, useContext, useState } from "react";
import { setModalOpenState } from "../hook/useModalState";

const GlobalModalContext = createContext();

export const GlobalModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);

    const showModal = (data) => {
        return new Promise((resolve) => {
            const modalId = Date.now() + Math.random(); // 生成唯一 ID
            const newModal = { id: modalId, data, resolve };

            setModals(prev => {
                const newModals = [...prev, newModal];
                // 更新全局 modal 狀態
                setModalOpenState(newModals.length > 0);
                return newModals;
            });
        });
    };

    const hideModal = (modalId = null) => {
        setModals(prev => {
            let newModals;
            if (modalId) {
                // 隱藏指定 modal
                const modalToHide = prev.find(m => m.id === modalId);
                if (modalToHide?.resolve) {
                    modalToHide.resolve();
                }
                newModals = prev.filter(m => m.id !== modalId);
            } else {
                // 隱藏最後一個 modal
                const lastModal = prev[prev.length - 1];
                if (lastModal?.resolve) {
                    lastModal.resolve();
                }
                newModals = prev.slice(0, -1);
            }
            // 更新全局 modal 狀態
            setModalOpenState(newModals.length > 0);
            return newModals;
        });
    };

    const hideAllModals = () => {
        setModals(prev => {
            // 調用所有 modal 的 resolve
            prev.forEach(modal => {
                if (modal.resolve) {
                    modal.resolve();
                }
            });
            // 更新全局 modal 狀態
            setModalOpenState(false);
            return [];
        });
    };

    const hideLastModal = () => {
        setModals(prev => {
            if (prev.length === 0) return prev;

            // 隱藏最後一個 modal
            const lastModal = prev[prev.length - 1];
            if (lastModal?.resolve) {
                lastModal.resolve();
            }
            const newModals = prev.slice(0, -1);
            // 更新全局 modal 狀態
            setModalOpenState(newModals.length > 0);
            return newModals;
        });
    };

    return (
        <GlobalModalContext.Provider value={{
            modals,
            showModal,
            hideModal,
            hideAllModals,
            hideLastModal
        }}>
            {children}
        </GlobalModalContext.Provider>
    );
};

export const useGlobalModal = () => {
    const context = useContext(GlobalModalContext);
    if (!context) {
        throw new Error("useGlobalModal must be used within a GlobalModalProvider");
    }
    return context;
};
