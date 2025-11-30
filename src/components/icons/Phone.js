import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgPhone = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={Color.placeholderGray} viewBox="0 0 24 24" {...props}>
        <Path d="M9 4.92a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5zM11 18.92a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" />
        <Path
            fillRule="evenodd"
            d="M5 3.67a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm2-.5h10a.5.5 0 0 1 .5.5v12.25h-11V3.67a.5.5 0 0 1 .5-.5m-.5 14.25h11v4.25a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5z"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgPhone;
