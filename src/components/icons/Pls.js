import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";
const SvgPls = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 25} viewBox="0 0 24 25" fill={props?.fill || Color.theme} {...props}>
        <Path
            d="M20 13.573h-6.857v6.857h-2.286v-6.857H4v-2.286h6.857V4.43h2.286v6.857H20z"
        />
    </Svg>
);
export default SvgPls;
