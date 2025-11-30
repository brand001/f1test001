import { useState, useEffect } from 'react';

// 全局 modal 狀態管理
let globalModalState = {
    isAnyModalOpen: false,
    listeners: new Set()
};

// 通知所有監聽器狀態變化
const notifyListeners = () => {
    globalModalState.listeners.forEach(listener => {
        listener(globalModalState.isAnyModalOpen);
    });
};

// 設置 modal 開啟狀態
export const setModalOpenState = (isOpen) => {
    globalModalState.isAnyModalOpen = isOpen;
    notifyListeners();
};

// 獲取當前 modal 狀態
export const getModalOpenState = () => {
    return globalModalState.isAnyModalOpen;
};

/**
 * Hook 用於監聽全局 modal 狀態
 * @returns {[boolean, function]} [isAnyModalOpen, setModalOpenState]
 */
const useModalState = () => {
    const [isAnyModalOpen, setIsAnyModalOpen] = useState(globalModalState.isAnyModalOpen);

    const listener = (newState) => {
        setIsAnyModalOpen(newState);
    };

    // 註冊監聽器
    useEffect(() => {
        globalModalState.listeners.add(listener);
        return () => {
            globalModalState.listeners.delete(listener);
        };
    }, [listener]);

    return [isAnyModalOpen, setModalOpenState];
};

export default useModalState;
export { useModalState };
