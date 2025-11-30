import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgBankCard = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 18} height={props?.height || 18} fill="currentColor" viewBox="0 0 18 18" {...props}>
        <Path
            fill="#78909C"
            d="M15.75 15.91H2.25A2.25 2.25 0 0 1 0 13.66V3.537a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 18 3.536V13.66a2.25 2.25 0 0 1-2.25 2.25m-13.5-1.124h13.5c.62 0 1.124-.504 1.124-1.125V5.786H1.125v7.875c0 .62.504 1.125 1.125 1.125M15.75 2.41H2.25c-.622 0-1.125.503-1.125 1.125V4.66h15.75V3.536c0-.622-.504-1.125-1.125-1.125"
        />
        <Path
            stroke="#00A6FF"
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M3.964 8.893h3.643M3.964 11.464h1.071"
        />
    </Svg>
);
export default SvgBankCard;
