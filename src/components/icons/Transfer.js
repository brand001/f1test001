import * as React from "react";
import Svg, { Rect, G, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";
const SvgRecordes = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Rect width={34} height={34} y={0.419} fill="url(#recordes_svg__a)" rx={8} />
        <G clipPath="url(#recordes_svg__b)">
            <Path
                fill="url(#recordes_svg__c)"
                d="M23.228 23.543H11.016a1.54 1.54 0 0 1-.686-.158 1.9 1.9 0 0 1-.561-.419 2 2 0 0 1-.379-.608 2 2 0 0 1-.141-.742V12.67a2.1 2.1 0 0 1 .462-1.395 1.63 1.63 0 0 1 1.302-.546h12.131a1.92 1.92 0 0 1 1.366.491 1.97 1.97 0 0 1 .511 1.483v8.76a2.3 2.3 0 0 1-.141.805 2.1 2.1 0 0 1-.385.662c-.16.187-.355.339-.574.448-.215.11-.452.167-.693.166m-9.574-6a.71.71 0 0 0-.753.65.707.707 0 0 0 .753.65h5.663l-.931.814a.627.627 0 0 0 0 .962.86.86 0 0 0 1.1 0l2.193-1.924a.7.7 0 0 0 .165-.216.57.57 0 0 0 .08-.29.69.69 0 0 0-.653-.642 1 1 0 0 0-.24-.005zm2.211-4.583a.84.84 0 0 0-.549.2l-2.193 1.907a.62.62 0 0 0-.216.593.72.72 0 0 0 .746.577h7.515a.71.71 0 0 0 .753-.655.71.71 0 0 0-.753-.654H15.48l.934-.816a.612.612 0 0 0 0-.954.83.83 0 0 0-.549-.198"
            />
        </G>
        <Defs>
            <LinearGradient
                id="recordes_svg__a"
                x1={5}
                x2={28.5}
                y1={0.419}
                y2={33.419}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#2CE3FC" />
                <Stop offset={1} stopColor="#32C7F7" />
            </LinearGradient>
            <LinearGradient
                id="recordes_svg__c"
                x1={17.137}
                x2={17.137}
                y1={10.726}
                y2={23.543}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
            <ClipPath id="recordes_svg__b">
                <Path fill="#fff" d="M9.247 9.162h15.78V24.65H9.247z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgRecordes;
