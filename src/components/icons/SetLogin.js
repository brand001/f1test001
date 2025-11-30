import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSetLogin = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 18} height={props?.height || 19} fill="currentColor" viewBox="0 0 18 19" {...props}>
        <Path
            fill="#859AA5"
            d="M14.703.333a1.99 1.99 0 0 1 2.006 1.98v13.192a1.99 1.99 0 0 1-2.006 1.98h-10.7a1.99 1.99 0 0 1-2.006-1.98V2.312A1.99 1.99 0 0 1 4.007.333zm0 1.32h-10.7a.664.664 0 0 0-.669.66v13.192a.664.664 0 0 0 .67.66h10.7a.665.665 0 0 0 .668-.66V2.312a.666.666 0 0 0-.669-.66"
        />
        <Path
            fill="#00A6FF"
            d="M10.759 12.206a.593.593 0 1 1 0 1.187H7.95a.593.593 0 1 1 0-1.187zm1.336-1.979a.593.593 0 1 1 0 1.187H6.613a.593.593 0 0 1-.234-1.149.6.6 0 0 1 .234-.038zm-2.74-5.871a2.573 2.573 0 1 1-2.608 2.573 2.59 2.59 0 0 1 2.607-2.573m0 1.187a1.385 1.385 0 1 0 1.4 1.385 1.395 1.395 0 0 0-1.4-1.385"
        />
    </Svg>
);
export default SvgSetLogin;
