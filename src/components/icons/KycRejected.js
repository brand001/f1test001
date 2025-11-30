import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgKycRejected = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 64} height={props?.height || 64} fill={props?.fill || "currentColor"} viewBox="0 0 64 64" {...props}>
        <Path
            fill="url(#kycRejected_svg__a)"
            d="M36.667 53.385a15.65 15.65 0 0 1 2.872-16.154A13.7 13.7 0 0 1 44.205 34a14.4 14.4 0 0 1 5.385-1.077V10.308A4.365 4.365 0 0 0 45.282 6H8.308A4.365 4.365 0 0 0 4 10.308V54.1a4.365 4.365 0 0 0 4.308 4.308H39.9a29 29 0 0 1-3.233-5.023M14.051 16.41h10.77a2.154 2.154 0 1 1 0 4.308h-10.77a2.154 2.154 0 1 1 0-4.308m0 12.564h24.77a2.154 2.154 0 1 1 0 4.308h-24.77c-1.077-.718-2.154-1.436-2.154-2.872.003-.718 1.077-1.436 2.154-1.436m14.718 15.795H14.051a2.154 2.154 0 1 1 0-4.308h14.718a2.153 2.153 0 1 1 0 4.308"
        />
        <Path
            fill="#EB2121"
            d="M50.305 37.59a9.887 9.887 0 0 0-9.692 9.692 9.692 9.692 0 1 0 9.692-9.692m4.667 13.282a1.016 1.016 0 0 1-1.436 1.436l-3.59-3.59-3.59 3.59a1.015 1.015 0 0 1-1.436-1.436l3.59-3.59-3.59-3.59a1.015 1.015 0 0 1 1.436-1.436l3.59 3.59 3.59-3.59a1.015 1.015 0 0 1 1.436 1.436l-3.59 3.59z"
        />
        <Defs>
            <LinearGradient
                id="kycRejected_svg__a"
                x1={4}
                x2={56.914}
                y1={10.14}
                y2={63.029}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00A6FF" />
                <Stop offset={1} stopColor="#3D61E9" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgKycRejected;
