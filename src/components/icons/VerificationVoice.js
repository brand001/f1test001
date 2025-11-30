import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgVerificationSms = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={props?.fill || "currentColor"} viewBox="0 0 24 24" {...props}>
        <Path
            d="m6 18-2.3 2.3q-.476.475-1.088.212Q2 20.25 2 19.575V4q0-.824.587-1.412A1.93 1.93 0 0 1 4 2h16q.824 0 1.413.587Q22 3.176 22 4v12q0 .824-.587 1.413A1.93 1.93 0 0 1 20 18zm2-7q.424 0 .713-.287A.97.97 0 0 0 9 10a.97.97 0 0 0-.287-.713A.97.97 0 0 0 8 9a.97.97 0 0 0-.713.287A.97.97 0 0 0 7 10q0 .424.287.713Q7.576 11 8 11m4 0q.424 0 .713-.287A.97.97 0 0 0 13 10a.97.97 0 0 0-.287-.713A.97.97 0 0 0 12 9a.97.97 0 0 0-.713.287A.97.97 0 0 0 11 10q0 .424.287.713.288.287.713.287m4 0q.424 0 .712-.287A.97.97 0 0 0 17 10a.97.97 0 0 0-.288-.713A.97.97 0 0 0 16 9a.97.97 0 0 0-.713.287A.97.97 0 0 0 15 10q0 .424.287.713.288.287.713.287"
        />
    </Svg>
);
export default SvgVerificationSms;
