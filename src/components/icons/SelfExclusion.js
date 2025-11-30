import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSelfExclusion = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 18} height={props?.height || 18} fill="currentColor" viewBox="0 0 18 18" {...props}>
        <Path
            fill="#78909C"
            d="M3.566 0h10.868A3.566 3.566 0 0 1 18 3.566v10.868A3.566 3.566 0 0 1 14.434 18H3.566A3.566 3.566 0 0 1 0 14.434V3.566A3.566 3.566 0 0 1 3.566 0m0 1.337a2.23 2.23 0 0 0-2.229 2.229v10.868a2.23 2.23 0 0 0 2.229 2.229h10.868a2.23 2.23 0 0 0 2.229-2.229V3.566a2.23 2.23 0 0 0-2.229-2.229z"
            opacity={0.9}
        />
        <Path
            fill="#00A6FF"
            d="M6.21 3.857a.712.712 0 0 1 .818.792v8.234a.712.712 0 0 1-.818.792.713.713 0 0 1-.818-.792V4.649a.712.712 0 0 1 .818-.792"
            opacity={0.5}
        />
        <Path
            fill="#00A6FF"
            d="M4.286 10.856A1.938 1.938 0 1 0 6.222 9a1.9 1.9 0 0 0-1.936 1.856"
        />
        <Path
            fill="#00A6FF"
            d="M11.744 3.857a.712.712 0 0 1 .819.792v8.234a.71.71 0 0 1-.819.792.712.712 0 0 1-.818-.792V4.65a.71.71 0 0 1 .815-.792z"
            opacity={0.5}
        />
        <Path
            fill="#00A6FF"
            d="M9.817 8.285a1.938 1.938 0 1 0 1.937-1.856 1.9 1.9 0 0 0-1.937 1.856"
        />
    </Svg>
);
export default SvgSelfExclusion;
