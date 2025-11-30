import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
const SvgStar = props =>
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
        <G clipPath="url(#star_svg__a)">
            <Path
                fill={props?.fill}
                stroke={props?.stroke || props?.fill}
                strokeWidth={props?.strokeWidth || 1.2}
                d="M11.168 3.5a.89.89 0 0 0-1.6 0L7.782 7.175l-3.989.589A.887.887 0 0 0 3.3 9.275l2.894 2.864-.683 4.047a.892.892 0 0 0 1.297.933l3.564-1.902 3.564 1.902a.889.889 0 0 0 1.297-.933l-.686-4.047 2.895-2.864a.888.888 0 0 0-.495-1.511l-3.992-.589z"
            />
        </G>
        <Defs>
            <ClipPath id="star_svg__a">
                <Path fill="#fff" d="M1.365 2h18v16.222h-18z" />
            </ClipPath>
        </Defs>
    </Svg>
    ;
export default SvgStar;
