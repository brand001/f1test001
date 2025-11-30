import React from "react";

import { ImagesUrl } from "@/images/index";
import ImgMap from "$locales/Images";
import { translate } from "$locales/translate";
import { KycRejectedIcon, KycPendingIcon, KycApprovedIcon, KycVerifyingIcon } from "$Components/icons/index.js";

export const UploadExampleData = {
    docTypeId_1: [
        // 身份证
        {
            get imgSrc() {
                return ImgMap.uploadExample1;
            },
            get texts() {
                return [translate("• 聚焦在相片上，且敏锐度高。"), translate("• 若背景较为杂乱，则图片须在最上层。"), translate("• 身份证背景纹理清晰可见。"), translate("• 完美的灯光条件，无阴影遮挡。")];
            },
        },
        {
            get imgSrc() {
                return ImgMap.uploadExample2;
            },
            get texts() {
                return [translate("• 证件文字与照片模糊不清晰无法辩识。"), translate("• 背景花纹纹理不清晰。"), translate("• 光线充足，照片上不能有阴影。")];
            },
        },
    ],
    docTypeId_2: [
        // address
        {
            get imgSrc() {
                return ImgMap.uploadExample3;
            },
            get texts() {
                return [translate("• 照片清晰完整。"), translate("• 必须显示该文件的完整信息。"), translate("• 该文件应有效且未过期。")];
            },
        },
        {
            get imgSrc() {
                return ImgMap.uploadExample4;
            },
            get texts() {
                return [translate("• 模糊或不完整的照片。"), translate("• 遮挡住了部分信息。"), translate("• 翻转或镜像了的照片。")];
            },
        },
    ],
    docTypeId_3: [
        // 手持身份证
        {
            get imgSrc() {
                return ImgMap.uploadExample5;
            },
            get texts() {
                return [
                    translate("• 脸部及证件信息清晰无遮挡。"),
                    translate("• 拍照时将手机或相机对焦在证件上。\n\n乐天使提醒: 在手机荧幕上对着画面中的身份证按下对焦使证件文字清晰，也将使你的验证比别人更早"),
                    translate("• 完美的灯光。"),
                ];
            },
        },
        {
            get imgSrc() {
                return ImgMap.uploadExample6;
            },
            get texts() {
                return [
                    translate("• 证件距离镜头太远，无法辨别证件信息。"),
                    translate("• 脸部模糊，照片歪斜。"),
                    translate("• 证件遮挡脸部。"),
                    translate("• 不允许证件颠倒，较常发生在自拍上。\n\n乐天使提醒: 在手机荧幕上对着画面中的身份证按下对焦使证件文字清晰，也将使你的验证比别人更早"),
                ];
            },
        },
    ],
    docTypeId_4: [
        // depo1
        {
            get imgSrc() {
                return ImgMap.uploadExample9;
            },
            get texts() {
                return [translate("• 照片清晰完整。"), translate("• 必须显示该文件的完整信息。"), translate("• 该文件应有效且未过期。")];
            },
        },
        {
            get imgSrc() {
                return ImgMap.uploadExample10;
            },
            get texts() {
                return [translate("• 模糊或不完整的照片。"), translate("• 遮挡住了部分信息。"), translate("• 翻转或镜像了的照片。")];
            },
        },
    ],
    docTypeId_5: [
        // bankOwner1
        {
            get imgSrc() {
                return ImgMap.uploadExample7;
            },
            get texts() {
                return [translate("• 照片清晰完整。"), translate("• 必须显示该文件的完整信息。"), translate("• 该文件应有效且未过期。")];
            },
        },
        {
            get imgSrc() {
                return ImgMap.uploadExample8;
            },
            get texts() {
                return [translate("• 模糊或不完整的照片。"), translate("• 遮挡住了部分信息。"), translate("• 翻转或镜像了的照片。")];
            },
        },
    ],
};

export const UploadFileGuideData = [
    {
        get title() {
            return translate("步骤") + "1";
        },
        get desc() {
            return translate("选择要上传的文件。确保您的文件小于 7MB，格式为 .JPG，JPEG 或 .PNG。请查看文档示例以查看您的文件是否受支持。");
        },
        get imgSrc() {
            return ImgMap.uploadGuide_1;
        }
    },
    {
        get title() {
            return translate("步骤") + "2";
        },
        get desc() {
            return translate("上传文件后，点击“提交”。您最多可以尝试3次提交文件。");
        },
        get imgSrc() {
            return ImgMap.uploadGuide_2;
        }
    },
    {
        get title() {
            return translate("步骤") + "3";
        },
        get desc() {
            return translate("当您提交文件后，我们的系统将对其进行验证，完成后您将会受到通知。");
        },
        get imgSrc() {
            return ImgMap.uploadGuide_3;
        }
    },
    {
        get title() {
            return translate("步骤") + "4";
        },
        get desc() {
            return translate("一旦您的文件获得批准，我们的系统自动验证您的账户。如果您的文件被拒，您可以再尝试一次。");
        },
        get imgSrc() {
            return ImgMap.uploadGuide_4;
        }
    },
];


export const UploadfileName = {
    get type1() {
        return translate("身份证明");
    },
    get type2() {
        return translate("地址证明");
    },
    get type3() {
        return translate("实时人脸识别证明");
    },
    get type4() {
        return translate("存款证明");
    },
    get type5() {
        return translate("银行账户证明");
    },
};

export const UploadfileGuideName = {
    get type4() {
        return translate("存款证明示例");
    },
    get type5() {
        return translate("银行账户证明示例");
    },
};


export const UploadFileStatusData2 = {
    pending: {
        get description() {
            return translate("审核中1");
        },
        icon: KycVerifyingIcon,
    },
    approve: {
        get description() {
            return translate("验证成功1");
        },
        icon: KycApprovedIcon,
    },
    reject: {
        get description() {
            return translate("验证不通过");
        },
        icon: KycRejectedIcon,
    },
};

export const KycStatusTranslation = {
    No: {
        get title() {
            return translate("身份验证");
        },
        get description() {
            return translate("解锁更多存款方式并加速到账");
        },
        get button() {
            return translate("开始验证");
        },
        icon: KycPendingIcon,
    },
    Pending: {
        get title() {
            return translate("身份验证");
        },
        get description() {
            return translate("为了保障您的账户安全，请完成身份验证");
        },
        get button() {
            return translate("立即验证2");
        },
        icon: KycPendingIcon,
    },
    Approved: {
        get title() {
            return translate("身份验证");
        },
        get description() {
            return translate("验证成功1");
        },
        icon: KycApprovedIcon,
    },
    Verifying: {
        get title() {
            return translate("身份验证");
        },
        get description() {
            return translate("审核中1");
        },
        icon: KycVerifyingIcon,
    },
    Rejected: {
        get title() {
            return translate("身份验证");
        },
        get description() {
            return translate("验证不通过，请重新验证");
        },
        get button() {
            return translate("重新验证2");
        },
        icon: KycRejectedIcon,
    },
};

// Helper function to generate consistent button colors
export const getSumsubColors = () => {
    return {
        // === 背景 ===
        backgroundCommon: "#f5f5f5",
        bottomSheetBackground: "#ffffff",
        bottomSheetHandle: "#D1D6E1",
        backgroundNeutral: "#EDEDED",

        // === 文字 ===
        contentStrong: "#222222",
        contentWeak: "#222222",
        contentNeutral: "#222222",
        contentLink: "#00A6FF",
        contentInfo: "#00A6FF",
        contentSuccess: "#00A6FF",

        // === 欄位 ===
        fieldBackground: "#EDEDED",
        fieldContent: "#222222",
        fieldPlaceholder: "#94A0B8",
        fieldTint: "#00A6FF",

        // === Primary 按鈕 ===
        primaryButtonBackground: "#00A6FF",
        primaryButtonContent: "#FFFFFF",
        primaryButtonBackgroundDisabled: "#D4D7DD",
        primaryButtonContentDisabled: "#999999",
        primaryButtonContentHighlighted: "#FFFFFF",
        primaryButtonBackgroundHighlighted: "#0088CC",

        // === Secondary 按鈕 ===
        secondaryButtonBackground: "#f5f5f5",
        secondaryButtonContent: "#00A6FF",
        secondaryButtonContentDisabled: "#66B8FF",
        secondaryButtonContentHighlighted: "#0088CC",
        secondaryButtonBackgroundHighlighted: "#E6F3FF",

        // === 導覽列 / 提示 / List ===
        navigationBarItem: "#94A0B8",
        alertTint: "#00A6FF",
        toolbarTint: "#5C6B8A",
        listSeparator: "#D1D6E1",
        listSelectedItemBackground: "#EDEDED",
    };
};