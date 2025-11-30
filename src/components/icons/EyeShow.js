import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import Color from "$Components/Color";

const EyeShow = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill={Color.placeholderGray} {...props}>
        <G clipPath="url(#eyeShow_svg__a)">
            <Path
                d="M11.91 14.88a2.237 2.237 0 1 1 2.237-2.237 2.244 2.244 0 0 1-2.238 2.237m0-5.752a3.515 3.515 0 1 0 0 7.03 3.515 3.515 0 0 0 0-7.03m.08 8.596c-3.229 0-5.577-1.63-7.238-5.081 1.661-3.435 4.01-5.08 7.237-5.08s5.576 1.645 7.238 5.08c-1.662 3.434-4.011 5.08-7.238 5.08m8.595-5.592c-1.901-4-4.761-6.007-8.596-6.007s-6.694 2.014-8.596 5.99a1.15 1.15 0 0 0 0 1.024q2.853 5.992 8.596 5.992c3.835 0 6.695-2.014 8.596-5.992a1.23 1.23 0 0 0 0-1.007"
            />
        </G>
        <Defs>
            <ClipPath id="eyeShow_svg__a">
                <Path fill="#fff" d="M0 .67h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default EyeShow;
