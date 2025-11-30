import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgKycApproved = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 64} height={props?.height || 64} fill={props?.fill || "currentColor"} viewBox="0 0 64 64" {...props}>
        <Path
            fill="url(#kycApproved_svg__a)"
            d="M45.194 6H8.225A4.28 4.28 0 0 0 4 10.225v44.01a4.28 4.28 0 0 0 4.225 4.225h31.687a13.4 13.4 0 0 1-3.169-4.577 15.55 15.55 0 0 1 0-11.267 13 13 0 0 1 2.817-4.929 13.4 13.4 0 0 1 4.577-3.169 14.1 14.1 0 0 1 5.281-1.056V10.225A4.07 4.07 0 0 0 45.194 6M14.21 16.562h10.563a2.113 2.113 0 0 1 0 4.225H14.21a2.113 2.113 0 0 1 0-4.225M29 45.082H14.21a2.113 2.113 0 0 1 0-4.226H29a2.113 2.113 0 0 1 0 4.225m10.21-12.324h-25a2.03 2.03 0 0 1-2.11-2.112 2.27 2.27 0 0 1 2.112-2.112h25a2.27 2.27 0 0 1 2.112 2.112 1.868 1.868 0 0 1-2.116 2.112z"
        />
        <Path
            fill="#0CCC3C"
            d="M49.769 37.335a10.21 10.21 0 1 0 10.21 10.21c.353-5.633-4.22-10.21-10.21-10.21m6.69 9.154-7.042 6.69a1.76 1.76 0 0 1-2.112 0l-3.873-3.873c-.7-.7-.7-1.76 0-2.112.7-.7 1.76-.7 2.112 0l2.817 2.817 5.985-5.633c.7-.7 1.76-.7 2.112 0 .7.351.7 1.407 0 2.111"
        />
        <Defs>
            <LinearGradient
                id="kycApproved_svg__a"
                x1={4}
                x2={56.969}
                y1={10.142}
                y2={62.834}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00A6FF" />
                <Stop offset={1} stopColor="#3D61E9" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgKycApproved;
