import Color from "$Components/Color";
import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgChecked = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={props?.fill || Color.theme} viewBox="0 0 24 24" {...props}>
        <Path d="m16.577 8.094-6.166 6.165-2.265-2.265a.28.28 0 0 0-.4 0l-.663.663a.28.28 0 0 0 0 .4l3.13 3.125a.28.28 0 0 0 .4 0l7.027-7.027a.28.28 0 0 0 0-.4l-.663-.663a.28.28 0 0 0-.4.002" />
    </Svg>
);
export default SvgChecked;
