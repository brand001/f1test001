import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const SvgContactcs = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 18} height={props?.height || 18} fill="currentColor" viewBox="0 0 18 18" {...props}>
        <Path
            fill="#78909C"
            d="M16 6.312h-.7a6.306 6.306 0 0 0-12.6 0H2a2.01 2.01 0 0 0-2 2.015v1.34a2.01 2.01 0 0 0 2 2.009h.667A1.34 1.34 0 0 0 4 10.338V6.653a5 5 0 0 1 10 0v4.69a4.35 4.35 0 0 1-3.267 4.221 1.3 1.3 0 0 0-1.063-.536H8.333a1.34 1.34 0 0 0 0 2.68h1.334a1.36 1.36 0 0 0 1.233-.804 5.7 5.7 0 0 0 4.433-5.226H16a2.01 2.01 0 0 0 2-2.008V8.327a2.01 2.01 0 0 0-2-2.008z"
        />
        <Rect width={4} height={3} x={7} y={15} fill="#00A6FF" rx={1} />
    </Svg>
);
export default SvgContactcs;
