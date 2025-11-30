import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgDuration = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill="currentColor" viewBox="0 0 24 24" {...props}>
        <Path d="M19.213 13.558H5.253a.989.989 0 0 1 0-1.964h11.49l-2.26-2.259a.981.981 0 0 1 1.388-1.387l3.779 3.778a1.04 1.04 0 0 1 .435.846.93.93 0 0 1-.872.986" />
    </Svg>
);
export default SvgDuration;
