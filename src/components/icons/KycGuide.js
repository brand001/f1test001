import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgKycGuide = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 30} height={props?.height || 30} fill={props?.fill || "currentColor"} viewBox="0 0 30 30" {...props}>
        <Path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M25 21.25H7.5a2.5 2.5 0 1 0 0 5H25M22.727 21.975v4.256M15 12v5.175M15 8.325v-.75"
        />
        <Path
            fill="#fff"
            d="M24.013 21.078a1 1 0 1 0 2 0h-2M4.988 23.813h1v-19h-2v19zm2-21v1h16.025v-2H6.988zm18.025 2h-1v16.265h2V4.813zm-2-2v1a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3zm-18.025 2h1a1 1 0 0 1 1-1v-2a3 3 0 0 0-3 3z"
        />
    </Svg>
);
export default SvgKycGuide;
