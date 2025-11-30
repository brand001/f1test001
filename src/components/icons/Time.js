import Color from "$Components/Color";
import * as React from "react";
import Svg, { G, Path, Circle, Defs, ClipPath } from "react-native-svg";
const SvgTime = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width} height={props?.height} fill="transparent" viewBox="0 0 24 24" >
        <G clipPath="url(#time_svg__a)">
            <Path fill={props?.fill || Color.darkGray} d="M12.5 7.43H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            <Circle cx={12} cy={12.43} r={9.25} stroke={props.stroke || Color.darkGray} strokeWidth={1.5} />
        </G>
        <Defs>
            <ClipPath id="time_svg__a">
                <Path fill="#fff" d="M0 .67h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgTime;
