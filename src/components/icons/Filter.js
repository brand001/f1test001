import Color from "$Components/Color";
import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgFilter = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={Color.white || props?.fill} viewBox="0 0 24 24" {...props}>
        <Path d="m5.6 5.189 5.185 6.48a1.6 1.6 0 0 1 .35 1v5.32l1.6-1.2v-4.12a1.6 1.6 0 0 1 .351-1l5.186-6.48zm0-1.6h12.672a1.6 1.6 0 0 1 1.249 2.6l-5.185 6.48v4.12a1.6 1.6 0 0 1-.64 1.28l-1.6 1.2a1.6 1.6 0 0 1-2.56-1.28v-5.32L4.35 6.189a1.6 1.6 0 0 1 1.249-2.6" />
    </Svg>
);
export default SvgFilter;
