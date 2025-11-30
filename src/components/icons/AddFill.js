import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgAddFill = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 16} height={props?.height || 17} fill="currentColor" viewBox="0 0 16 17" {...props}>
        <Path
            fill="#00A6FF"
            d="M8 .5a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8m3.5 8.667H8.667V12a.667.667 0 1 1-1.333 0V9.167H4.5a.667.667 0 1 1 0-1.333h2.833V5a.667.667 0 1 1 1.333 0v2.833H11.5a.667.667 0 1 1 0 1.334"
        />
    </Svg>
);
export default SvgAddFill;
