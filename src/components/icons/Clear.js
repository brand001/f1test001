import Color from "$Components/Color";
import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgClear = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={Color.gray || props?.fill} viewBox="0 0 24 24" {...props}>
        <Path
            fillRule="evenodd"
            d="M12 20.43a8 8 0 1 0 0-16 8 8 0 0 0 0 16m2.544-11.4a.737.737 0 0 1 .973 1.103l-2.385 2.386 2.385 2.385a.737.737 0 0 1-.973 1.104l-.01-.007-.055-.05-2.39-2.39-2.394 2.394-.056.05-.005.003a.738.738 0 0 1-.974-1.104l2.386-2.385-2.385-2.386a.737.737 0 0 1 .973-1.104l.01.008.055.049 2.39 2.39 2.394-2.394.056-.049z"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgClear;
