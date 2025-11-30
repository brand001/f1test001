import React from "react";

import ProgressStepCN from "./ProgressStepCN";
import ProgressStepTH from "./ProgressStepTH";
import ProgressStepVN from "./ProgressStepVN";

const ProgressStep = props => {
    // 根據當前語言選擇相應的組件
    const language = window.LANGUAGE || "VN";

    switch (language) {
    case "CN":
        return <ProgressStepCN {...props} />;
    case "TH":
        return <ProgressStepTH {...props} />;
    case "VN":
        return <ProgressStepVN {...props} />;
    default:
        return <ProgressStepVN {...props} />;
    }
};

export default ProgressStep;
