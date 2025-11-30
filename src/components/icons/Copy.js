import React from "react";
import Svg, { Path } from "react-native-svg";

import Color from "$Components/Color";
const SvgCopy = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={props?.fill || Color.theme} viewBox="0 0 24 24" {...props}>
        <Path d="M15.98 7.098H5.123A1.1 1.1 0 0 0 4 8.165v11.2a1.1 1.1 0 0 0 1.123 1.067H15.98a1.1 1.1 0 0 0 1.123-1.067v-11.2a1.1 1.1 0 0 0-1.123-1.067m-.374 11.911H5.5V8.52h10.105z" />
        <Path d="M6.904 5.497A1.1 1.1 0 0 1 8.027 4.43h10.854a1.1 1.1 0 0 1 1.123 1.067v11.2a1.1 1.1 0 0 1-1.123 1.067h-.377V5.852h-11.6z" />
        <Path d="M7.465 11.541a.55.55 0 0 1 .561-.533h5.053a.55.55 0 0 1 .561.533v.356a.55.55 0 0 1-.561.533H8.026a.55.55 0 0 1-.561-.533zm0 3.467a.55.55 0 0 1 .561-.533h3.368a.55.55 0 0 1 .561.533v.356a.55.55 0 0 1-.561.533H8.026a.55.55 0 0 1-.561-.533z" />
    </Svg>
);
export default SvgCopy;
