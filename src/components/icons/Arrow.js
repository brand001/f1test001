import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgArrow = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 8} height={props?.height || 12} fill="currentColor" viewBox="0 0 8 12" {...props}>
        <Path d="M7.396 1.493 3.198 5.7l4.198 4.208L6.104 11.2l-5.5-5.5 5.5-5.5z" />
    </Svg>
);
export default SvgArrow;
