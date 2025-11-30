import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRecordActive = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path fill="#00A6FF" d="M4.288 6.5a4 4 0 0 1 4-4h8.071a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H8.288a4 4 0 0 1-4-4z" />
        <Path stroke="#fff" strokeLinecap="round" strokeWidth={1.5} d="M8.997 6.571h6.651M8.997 10.428h6.651M8.997 14.285h5.123" />
    </Svg>
);
export default SvgRecordActive;
