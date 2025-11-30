import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRecord = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path stroke="#666" strokeWidth={1.5} d="M8 3.75h8.071A3.25 3.25 0 0 1 19.321 7v10a3.25 3.25 0 0 1-3.25 3.25H8A3.25 3.25 0 0 1 4.75 17V7A3.25 3.25 0 0 1 8 3.75Z" />
        <Path stroke="#666" strokeLinecap="round" strokeWidth={1.5} d="M8.709 7.071h6.652M8.709 10.928h6.652M8.709 14.785h5.123" />
    </Svg>
);
export default SvgRecord;
