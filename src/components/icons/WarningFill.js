import React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgWarning = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 21} viewBox="0 0 20 21" {...props}>
        <G clipPath="url(#warning_svg__a)">
            {/* Background circle */}
            <Path
                fillRule="evenodd"
                fill={props?.fill || Color.red}
                d="M20 10.67c0 5.522-4.477 10-10 10s-10-4.478-10-10 4.477-10 10-10 10 4.477 10 10"
                clipRule="evenodd"
            />
            {/* Exclamation mark */}
            <Path
                fill={props?.checkColor || Color.white}
                d="M10 12.67a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m1 2a1 1 0 1 0-2 0v.5a1 1 0 1 0 2 0"
            />
        </G>
        <Defs>
            <ClipPath id="warning_svg__a">
                <Path fill="#fff" d="M0 .67h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgWarning;
