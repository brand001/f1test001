import Color from "$Components/Color";
import React from "react";

import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
const SvgClose = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={Color.white || props?.fill} viewBox="0 0 24 24" {...props}>
        <G clipPath="url(#close_svg__a)">
            <Path d="m19 6.84-1.41-1.41L12 11.02 6.41 5.43 5 6.84l5.59 5.59L5 18.02l1.41 1.41L12 13.84l5.59 5.59L19 18.02l-5.59-5.59z" />
        </G>
        <Defs>
            <ClipPath id="close_svg__a">
                <Path fill="#fff" d="M0 .67h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgClose;
