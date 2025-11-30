import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRafUser = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 7} height={props?.height || 9} fill={props?.fill || "currentColor"} viewBox="0 0 7 9" {...props}>
        <Path
            fill="#fff"
            d="M3.115 3.738a1.87 1.87 0 1 0 0-3.738 1.87 1.87 0 0 0 0 3.738m0-3.115a1.246 1.246 0 1 1 0 2.492 1.246 1.246 0 0 1 0-2.492M4.013 4.36H2.217A2.22 2.22 0 0 0 0 6.576a1.52 1.52 0 0 0 1.52 1.52h3.19a1.523 1.523 0 0 0 1.52-1.52 2.22 2.22 0 0 0-2.217-2.218m.696 3.115H1.521a.9.9 0 0 1-.898-.898 1.596 1.596 0 0 1 1.594-1.595h1.796a1.596 1.596 0 0 1 1.595 1.595.9.9 0 0 1-.899.898"
        />
    </Svg>
);
export default SvgRafUser;
