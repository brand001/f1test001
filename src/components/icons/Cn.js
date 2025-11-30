import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
const SvgCn = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20 || props?.width} height={20 || props?.height} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <Mask
            id="cn_svg__a"
            width={20}
            height={20}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "luminance",
            }}>
            <Path fill="#fff" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10" />
        </Mask>
        <G mask="url(#cn_svg__a)">
            <Path fill="#EE1C25" d="M-.312 0H31.25v24.209H-.312z" />
            <Path
                fill="#FF0"
                d="m6.249 6.209 1.763 5.427L3.39 8.281h5.706L4.48 11.635zM11.642 5.288l-.167 1.895-.979-1.63 1.75.744-1.852.426zM13.967 7.513l-.89 1.68-.269-1.882 1.324 1.366-1.873-.327zM14.19 10.866l-1.497 1.172.521-1.828.653 1.787-1.577-1.062zM11.603 12.273l-.088 1.9-1.046-1.589 1.78.672-1.834.502z"
            />
        </G>
    </Svg>
);
export default SvgCn;
