import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
const SvgVn = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20 || props?.width} height={20 || props?.height} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <Mask
            id="vn_svg__a"
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
        <G mask="url(#vn_svg__a)">
            <Path fill="#DA251D" d="M25 0H-5v20h30z" />
            <Path fill="#FF0" d="M10 4 6.47 14.85l9.24-6.7H4.29l9.24 6.7z" />
        </G>
    </Svg>
);
export default SvgVn;
