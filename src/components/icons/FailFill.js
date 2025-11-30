import Color from "$Components/Color";
import React from "react";

import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
const SvgFailFill = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 21} viewBox="0 0 20 21" {...props}>
        <G clipPath="url(#fail_svg__a)">
            {/* Background circle */}
            <Path
                fillRule="evenodd"
                fill={props?.fill || Color.alertRed}
                d="M20 10.67c0 5.522-4.477 10-10 10s-10-4.478-10-10 4.477-10 10-10 10 4.477 10 10"
                clipRule="evenodd"
            />
            {/* X mark */}
            <Path
                fill={props?.checkColor || Color.white}
                d="M5.757 14.911a1 1 0 0 1 0-1.414l2.829-2.829-2.829-2.828a1 1 0 1 1 1.414-1.414L10 9.255l2.828-2.828a1 1 0 1 1 1.414 1.414l-2.828 2.828 2.829 2.829a1 1 0 1 1-1.415 1.414L10 12.084 7.17 14.912a1 1 0 0 1-1.414 0"
            />
        </G>
        <Defs>
            <ClipPath id="fail_svg__a">
                <Path fill="#fff" d="M0 .67h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgFailFill;
