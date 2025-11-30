import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgVerificationPhone = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={props?.fill || "currentColor"} viewBox="0 0 24 24" {...props}>
        <Path
            d="M19.95 21q-3.125 0-6.175-1.363t-5.55-3.862-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1a.93.93 0 0 1 .625.237.9.9 0 0 1 .325.563l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.926 1.188 1.787.687.863 1.512 1.663.775.775 1.625 1.438.85.661 1.8 1.212l2.35-2.35a1.4 1.4 0 0 1 .588-.338 1.6 1.6 0 0 1 .712-.062l3.45.7q.35.1.575.363A.88.88 0 0 1 21 15.9v4.05q0 .45-.3.75t-.75.3"
        />
        <Path
            d="M20 3q.425 0 .713.287Q21 3.575 21 4v5a.97.97 0 0 1-.287.713A.97.97 0 0 1 20 10h-5l-2.15 2.15q-.25.25-.55.125T12 11.8V4q0-.425.287-.713A.97.97 0 0 1 13 3zm-6 2v3h5V5z"
        />
    </Svg>
);
export default SvgVerificationPhone;
