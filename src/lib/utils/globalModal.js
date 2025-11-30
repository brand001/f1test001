import React from "react";
import StorageUtil from "$Utils/Storage";

import AnnouncementModal from "@/components/Modals/AnnouncementModal";
import OneWalletTipModal from "@/components/Modals/OneWalletTipModal";
import ShareModal from "@/components/Modals/ShareModal";
import RecommendGamesModal from "@/components/Modals/RecommendGamesModal";
import RecommendRefereeModal from "@/components/Modals/RecommendRefereeModal";
import RegisterSuccessModal from "@/components/Modals/RegisterSuccessModal";
import SuperDoorModal from "@/components/Modals/SuperDoorModal";
import SwipeableCardTipModal from "@/components/Modals/SwipeableCardTipModal";
import UploadModal from "@/components/Modals/UploadModal";
import VipCsCallModal from "@/components/Modals/VipCsCallModal";
import GameWalletModal from "@/components/Modals/GameWalletModal";

const CustomModalComponents = {
    RegisterSuccessModal,
    OneWalletTipModal,
    SuperDoorModal,
    ShareModal,
    UploadModal,
    AnnouncementModal,
    VipCsCallModal,
    RecommendGamesModal,
    RecommendRefereeModal,
    SwipeableCardTipModal,
    GameWalletModal
};

// 全局彈窗實例引用
let globalModalInstance = null;

// 設置全局彈窗實例
export const setGlobalModal = (instance) => {
    console.log("setGlobalModal 被調用，instance:", instance);
    globalModalInstance = instance;
    console.log("globalModalInstance 已設置:", globalModalInstance);
};

// 顯示全局彈窗
const showGlobalModal = (data) => {
    if (!globalModalInstance) {
        console.error("GlobalModal not initialized");
        return Promise.reject(new Error("GlobalModal not initialized"));
    }
    return globalModalInstance.showModal(data);
};

// 關閉所有彈窗
export const hideAllModals = () => {
    console.log("hideAllModals 被調用");
    console.log("globalModalInstance:", globalModalInstance);

    if (!globalModalInstance) {
        console.error("GlobalModal not initialized");
        return;
    }

    if (!globalModalInstance.hideAllModals) {
        console.error("hideAllModals method not available on globalModalInstance");
        return;
    }

    console.log("調用 globalModalInstance.hideAllModals()");
    globalModalInstance.hideAllModals();
};

// 關閉最後一個彈窗
export const hideLastModal = () => {
    if (!globalModalInstance) {
        console.error("GlobalModal not initialized");
        return;
    }
    globalModalInstance.hideLastModal();
};




export const GetGlobalModal = (props) => {
    return new Promise((resolve) => {
        const loadModal = async () => {
            let { name = "", modalData, modalCallBack = () => {}, ...rest } = props;

            // 如果沒有 name 參數，直接使用 showGlobalModal 顯示普通彈窗
            if (!name) {
                return showGlobalModal({
                    ...rest,
                    renderMessage: rest.renderMessage ? ({ hideModalWithAnimation }) => {
                        return rest.renderMessage({ hideModalWithAnimation });
                    } : undefined,
                    onConfirm: () => {
                        if (rest.onConfirm) rest.onConfirm();
                        resolve();
                    },
                    onCancel: () => {
                        if (rest.onCancel) rest.onCancel();
                        resolve();
                    }
                }).then(() => resolve());
            }

            if (name == "OneWalletTipModal") {

                if (!ApiPort.UserLogin) return resolve();

                let { page = "", isToggleBalance = false } = modalData;
                if (page === "Profile" && !isToggleBalance) return resolve();

                let data = await StorageUtil.load(`oneWallet${page}${memberCode}`);
                if (data) return resolve(); // ✅ 确保 `data` 赋值后再判断
            }

            // Import modal components dynamically
            let Modal = CustomModalComponents[name];


            if (!Modal) return resolve();

            // Show modal with custom component
            showGlobalModal({
                renderMessage: ({ hideModalWithAnimation }) => {
                    return (
                        <Modal
                            modalData={modalData}
                            modalCallBack={modalCallBack}
                            onCancel={() => {
                                // 使用動畫關閉方法
                                hideModalWithAnimation();
                                resolve();
                            }}
                            hideModalWithAnimation={hideModalWithAnimation}
                            {...rest}
                        />
                    );
                },
                onConfirm: (params = {}) => {
                    const { hideModalWithAnimation = () => {} } = params;
                    hideModalWithAnimation();
                    resolve();
                },
                onCancel: (params = {}) => {
                    const { hideModalWithAnimation = () => {} } = params;
                    hideModalWithAnimation();
                    resolve();
                },
                ...rest
            }).then(() => resolve());
        };

        loadModal();
    });
};

export const globalModalPadding = 24;