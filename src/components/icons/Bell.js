import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgBell = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 17} height={props?.height || 16} fill="currentColor" viewBox="0 0 17 16" {...props}>
        <Path
            fill="#FE0"
            d="M8.5 14.5A1.5 1.5 0 0 1 7 13h3a1.5 1.5 0 0 1-1.5 1.5m4.5-2.25H4a.747.747 0 0 1-.75-.75.73.73 0 0 1 .2-.509l.233-.247A4.48 4.48 0 0 0 4.75 7.375a3.7 3.7 0 0 1 3-3.637V3.25a.75.75 0 0 1 1.5 0v.489a3.7 3.7 0 0 1 3 3.636 4.4 4.4 0 0 0 1.209 3.525l.089.094a.748.748 0 0 1-.55 1.256z"
        />
    </Svg>
);
export default SvgBell;
