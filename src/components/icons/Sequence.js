import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSequence = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <Path stroke="#666" strokeWidth={0.3} d="m17.97 17.529 3.033-3.04-.76-.76-2.171 2.171V6.326h-1.08v10.791a.577.577 0 0 0 .983.407z" />
        <Path d="M14.627 6.33H3.003v1.411h11.624zM11.6 11.116H3.004v1.41H11.6zM14.627 15.902H3.003v1.411h11.624z" />
    </Svg>
);
export default SvgSequence;
