import Color from "$Components/Color";
import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSearch = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={Color.white || props?.fill} viewBox="0 0 24 24" {...props}>
        <Path
            fillRule="evenodd"
            d="M16.596 10.977a6.049 6.049 0 1 1-12.098 0 6.049 6.049 0 0 1 12.098 0m-1.261 5.836a7.549 7.549 0 1 1 1.049-1.049q.045.034.085.074l4.314 4.314a.75.75 0 0 1-1.06 1.06L15.407 16.9a1 1 0 0 1-.073-.086"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgSearch;
