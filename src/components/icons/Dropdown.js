import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgDropdown = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <Path d="M15.18 11.324H8.208a.703.703 0 0 1-.498-1.2l3.486-3.488a.7.7 0 0 1 .993 0l3.487 3.486a.702.702 0 0 1-.496 1.202M8.208 13.203h6.972a.703.703 0 0 1 .498 1.2l-3.486 3.488a.7.7 0 0 1-.993 0l-3.49-3.488a.704.704 0 0 1 .499-1.2" />
    </Svg>
);
export default SvgDropdown;
