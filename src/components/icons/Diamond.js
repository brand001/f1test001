import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
const SvgDiamond = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill={props?.fill} viewBox="0 0 20 20" {...props}>
        <G clipPath="url(#diamond_svg__a)">
            <Path
                d="M6.012 3.056a.75.75 0 0 1 .603-.306h7.5c.238 0 .463.112.603.306l3.5 4.75a.754.754 0 0 1-.046.95l-7.25 8a.75.75 0 0 1-1.113 0l-7.25-8a.75.75 0 0 1-.047-.95zM7.215 4.3a.25.25 0 0 0-.065.328l1.793 2.988-4.6.384a.251.251 0 0 0 0 .5l6 .5h.041l6-.5a.251.251 0 0 0 0-.5l-4.597-.381 1.794-2.988a.25.25 0 0 0-.066-.328.254.254 0 0 0-.334.031l-2.816 3.047-2.815-3.05a.254.254 0 0 0-.335-.031"
            />
        </G>
        <Defs>
            <ClipPath id="diamond_svg__a">
                <Path fill="#fff" d="M2.365 2h16v16h-16z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgDiamond;
