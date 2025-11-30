import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
const SvgTh = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20 || props?.width} height={20 || props?.height} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <Mask
            id="th_svg__a"
            width={20}
            height={20}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "luminance",
            }}>
            <Path fill="#fff" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10" />
        </Mask>
        <G mask="url(#th_svg__a)">
            <Path fill="#A51931" d="M30 0H0v20h30z" />
            <Path fill="#F4F5F8" d="M30 3.75H0v12.5h30z" />
            <Path fill="#2D2A4A" d="M30 6.25H0v7.5h30z" />
        </G>
    </Svg>
);
export default SvgTh;
