import Color from "$Components/Color";
import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgZoomIn = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 21} height={props?.height || 21} viewBox="0 0 21 21" fill={Color.white || props?.fill} {...props}>
        <Path
            fillRule="evenodd"
            d="M4.202 7.524a.833.833 0 0 1-.834-.834V3.357c0-.46.373-.833.834-.833h3.333a.833.833 0 0 1 0 1.666h-2.5v2.5c0 .46-.373.834-.833.834M13.376 3.357c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833V6.69a.833.833 0 0 1-1.667 0v-2.5h-2.5a.833.833 0 0 1-.833-.833M17.543 12.531c.46 0 .833.373.833.833v3.334c0 .46-.373.833-.833.833h-3.334a.833.833 0 0 1 0-1.666h2.5v-2.5c0-.46.373-.834.834-.834M8.368 16.698c0 .46-.373.833-.833.833H4.202a.833.833 0 0 1-.834-.833v-3.334a.833.833 0 1 1 1.667 0v2.5h2.5c.46 0 .833.374.833.834"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgZoomIn;
