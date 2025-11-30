import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgProfileActive = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path
            fill="#00A6FF"
            d="M6.428 8.572a5.57 5.57 0 1 0 11.137 0 5.57 5.57 0 0 0-11.136 0zM16.711 14.999H7.285A4.3 4.3 0 0 0 3 19.284v.428a1.26 1.26 0 0 0 1.286 1.286h15.428A1.26 1.26 0 0 0 21 19.712v-.428a4.297 4.297 0 0 0-4.285-4.285z"
        />
        <Path stroke="#fff" strokeLinecap="round" strokeWidth={1.5} d="M9.299 9.75s2.643 3.16 5.399 0" />
    </Svg>
);
export default SvgProfileActive;
