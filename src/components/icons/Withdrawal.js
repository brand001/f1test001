import * as React from "react";
import Svg, { Rect, G, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";
const SvgWithdrawal = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Rect width={34} height={34} y={0.419} fill="url(#withdrawal_svg__a)" rx={8} />
        <G clipPath="url(#withdrawal_svg__b)">
            <Path
                fill="url(#withdrawal_svg__c)"
                d="M24.877 10.086H10.548a1.33 1.33 0 0 0-1.34 1.34v1.8a1.336 1.336 0 0 0 1.34 1.34h.893v-2.693h12.534v2.69h.893a1.34 1.34 0 0 0 1.34-1.34v-1.8a1.317 1.317 0 0 0-1.331-1.338"
            />
            <Path
                fill="url(#withdrawal_svg__d)"
                d="M14.43 12.774h-2.087v11.184a1.337 1.337 0 0 0 1.34 1.34h.747zm.9 0v12.532h6.413a1.337 1.337 0 0 0 1.34-1.34V12.774zm5.79 10.257-1.8.447v-3.582l1.8-.447z"
            />
        </G>
        <Defs>
            <LinearGradient
                id="withdrawal_svg__a"
                x1={6}
                x2={32.5}
                y1={0.419}
                y2={36.419}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FC96EE" />
                <Stop offset={1} stopColor="#D274FF" />
            </LinearGradient>
            <LinearGradient
                id="withdrawal_svg__c"
                x1={17.708}
                x2={17.708}
                y1={10.085}
                y2={14.566}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
            <LinearGradient
                id="withdrawal_svg__d"
                x1={17.713}
                x2={17.713}
                y1={12.774}
                y2={25.306}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
            <ClipPath id="withdrawal_svg__b">
                <Path fill="#fff" d="M9.208 8.92h17v17h-17z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgWithdrawal;
