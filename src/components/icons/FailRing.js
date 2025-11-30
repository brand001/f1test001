import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgFailRing = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 20} fill="currentColor" viewBox="0 0 20 20" {...props}>
        <Path
            fillRule="evenodd"
            d="M8.808 2.1a6.897 6.897 0 1 0 0 13.794 6.897 6.897 0 0 0 0-13.794M.661 8.997a8.147 8.147 0 1 1 16.294 0 8.147 8.147 0 0 1-16.294 0m11.026-2.755a.625.625 0 0 1 0 .884L9.754 9.059l1.933 1.933a.625.625 0 1 1-.883.884L8.87 9.943l-1.933 1.933a.625.625 0 1 1-.884-.884L7.987 9.06 6.053 7.126a.625.625 0 1 1 .884-.884L8.87 8.175l1.934-1.933a.625.625 0 0 1 .883 0"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgFailRing;
