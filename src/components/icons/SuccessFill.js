import React from "react";
import Svg, { Path } from "react-native-svg";

import Color from "$Components/Color";
const SvgSuccessFill = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 21} viewBox="0 0 20 21" {...props}>
        {/* Background circle */}
        <Path
            fillRule="evenodd"
            fill={props?.fill || Color.vividGreen}
            d="M10 20.67c5.523 0 10-4.478 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10"
            clipRule="evenodd"
        />
        {/* Checkmark */}
        <Path
            fill={props?.checkColor || Color.white}
            d="M15.707 8.877a1 1 0 0 0-1.414-1.415L8.5 13.255l-2.793-2.793a1 1 0 0 0-1.414 1.415l3.5 3.5a1 1 0 0 0 1.414 0z"
        />
    </Svg>
);
export default SvgSuccessFill;
