import React from "react";
import Svg, { Path } from "react-native-svg";
const SvgAdd = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 21} fill="currentColor" viewBox="0 0 20 21" {...props}>
        <Path d="M10.03 2.544a8.125 8.125 0 0 0-7.07 12.188 8.137 8.137 0 1 0 7.07-12.188m0 18.125a10 10 0 1 1 8.633-5 9.94 9.94 0 0 1-8.632 5m-.937-5.625v-3.437H5.656V9.732h3.437V6.294h1.875v3.438h3.438v1.875h-3.438v3.437z" />
    </Svg>
);
export default SvgAdd;
