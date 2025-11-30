import Color from "$Components/Color";
import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgArrowLine = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 12} height={props?.height || 13} fill={props?.fill || Color.white} viewBox="0 0 12 13" {...props}>
        <Path fill="#fff" d="M9.131 6.8H0V5.3h9.131l-4.2-4.2L6 .05l6 6-6 6L4.931 11z" />
    </Svg>
);
export default SvgArrowLine;
