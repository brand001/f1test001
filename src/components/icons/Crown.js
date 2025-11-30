import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
const SvgCrown = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill={props?.fill} viewBox="0 0 20 20" {...props}>
        <G clipPath="url(#crown_svg__a)">
            <Path
                d="M10.948 5.953a1.114 1.114 0 0 0-.583-2.061 1.112 1.112 0 0 0-.583 2.061L8.19 9.146a.888.888 0 0 1-1.35.298L4.365 7.458a1.117 1.117 0 0 0-.889-1.783c-.614 0-1.111.498-1.111 1.114s.497 1.115 1.111 1.115h.02l1.269 7.004a1.78 1.78 0 0 0 1.75 1.466h7.7c.858 0 1.594-.616 1.75-1.466l1.27-7.004h.019c.614 0 1.111-.5 1.111-1.115 0-.616-.497-1.114-1.111-1.114a1.112 1.112 0 0 0-.889 1.783L13.89 9.444a.888.888 0 0 1-1.35-.298z"
            />
        </G>
        <Defs>
            <ClipPath id="crown_svg__a">
                <Path fill="#fff" d="M2.365 3h16v14.265h-16z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgCrown;
