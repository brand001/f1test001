import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgLock = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 16} height={props?.height || 16} fill="currentColor" viewBox="0 0 16 16" {...props}>
        <Path fill="#999" d="M7.999 9.457a1.334 1.334 0 0 1 .5 2.57v1.43h-1v-1.43a1.334 1.334 0 0 1 .5-2.57" />
        <Path
            fillRule="evenodd"
            d="M11.333 7.05H4.666a.867.867 0 0 0-.867.867v4.666c0 .48.388.867.867.867h6.667a.867.867 0 0 0 .866-.867V7.917a.867.867 0 0 0-.866-.867M4.666 5.917a2 2 0 0 0-2 2v4.666a2 2 0 0 0 2 2h6.667a2 2 0 0 0 2-2V7.917a2 2 0 0 0-2-2zM7.999 2.417c-1.197 0-2.167.97-2.167 2.166h-1a3.167 3.167 0 0 1 6.333 0h-1c0-1.196-.97-2.166-2.166-2.166"
            clipRule="evenodd"
        />
        <Path
            fillRule="evenodd"
            d="M10.666 4.084a.5.5 0 0 1 .5.5v1.333a.5.5 0 1 1-1 0V4.584a.5.5 0 0 1 .5-.5M5.332 4.084a.5.5 0 0 1 .5.5V6.25a.5.5 0 0 1-1 0V4.584a.5.5 0 0 1 .5-.5"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgLock;
