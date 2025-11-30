import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgSort = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 20} fill={Color.white || props?.fill} viewBox="0 0 20 20" {...props}>
        <Path
            fillRule="evenodd"
            d="M14.185 6.097a.73.73 0 0 1 1.46 0v7.428l1.165-1.165a.728.728 0 0 1 1.03 1.029l-2.355 2.36a.761.761 0 0 1-1.3-.539zM11.705 5.421H2.627a.827.827 0 0 0 0 1.654h9.078a.827.827 0 1 0 0-1.654m-2.69 4.254H2.627a.827.827 0 1 0 0 1.655h6.388a.827.827 0 1 0 0-1.655m2.69 4.255H2.627a.827.827 0 0 0 0 1.654h9.078a.827.827 0 1 0 0-1.654"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgSort;
