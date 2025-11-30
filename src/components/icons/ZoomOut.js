import * as React from "react";
import Color from "$Components/Color";
import Svg, { Path } from "react-native-svg";
const SvgZoomOut = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 21} height={props?.height || 21} viewBox="0 0 21 21" fill={Color.white || props?.fill} {...props}>
        <Path
            fillRule="evenodd"
            d="M6.99 2.788c.46 0 .833.373.833.834v3.333c0 .46-.373.833-.833.833H3.657a.833.833 0 0 1 0-1.666h2.5v-2.5c0-.46.373-.834.833-.834M17.831 6.955c0 .46-.373.833-.833.833h-3.334a.833.833 0 0 1-.833-.833V3.622a.833.833 0 1 1 1.667 0v2.5h2.5c.46 0 .833.373.833.833M13.664 17.796a.833.833 0 0 1-.833-.834V13.63c0-.46.373-.833.833-.833h3.334a.833.833 0 1 1 0 1.666h-2.5v2.5c0 .46-.373.834-.834.834M2.823 13.63c0-.461.373-.834.834-.834H6.99c.46 0 .833.373.833.833v3.333a.833.833 0 1 1-1.666 0v-2.5h-2.5a.833.833 0 0 1-.834-.833"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgZoomOut;
