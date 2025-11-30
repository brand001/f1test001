import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgRestrict = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 70} height={props?.height || 70} viewBox="0 0 70 70" fill="transparent" {...props}>
        <G filter="url(#restrict_svg__a)">
            <Path
                fill="url(#restrict_svg__b)"
                d="M56 3H14a8 8 0 0 0-8 8v42a8 8 0 0 0 8 8h42a8 8 0 0 0 8-8V11a8 8 0 0 0-8-8"
            />
        </G>
        <Path
            fill="url(#restrict_svg__c)"
            d="M35.015 18.62c1.734-.011 3.452.334 5.048 1.013a13 13 0 0 1 6.923 6.928c.68 1.6 1.025 3.32 1.014 5.058a12.7 12.7 0 0 1-1.014 5.053 13 13 0 0 1-6.923 6.928 12.7 12.7 0 0 1-5.048 1.014 12.93 12.93 0 0 1-9.2-3.8 13.4 13.4 0 0 1-2.786-4.142A12.5 12.5 0 0 1 22 31.62c-.01-1.737.34-3.458 1.028-5.053a13.4 13.4 0 0 1 2.786-4.147 12.9 12.9 0 0 1 9.2-3.8zm5.2 14.688c.487.014.961-.162 1.322-.49a1.64 1.64 0 0 0 .534-1.253 1.5 1.5 0 0 0-.534-1.229 2.02 2.02 0 0 0-1.322-.436H29.781a2.04 2.04 0 0 0-1.322.436 1.5 1.5 0 0 0-.534 1.23 1.61 1.61 0 0 0 .534 1.253c.36.33.834.506 1.322.49z"
        />
        <Defs>
            <LinearGradient
                id="restrict_svg__b"
                x1={11.336}
                x2={91.434}
                y1={6.016}
                y2={105.834}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FF3535" />
                <Stop offset={1} stopColor="#AD1111" />
            </LinearGradient>
            <LinearGradient
                id="restrict_svg__c"
                x1={35}
                x2={35}
                y1={18.619}
                y2={44.614}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgRestrict;
