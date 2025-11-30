import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgKycPending = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 64} height={props?.height || 64} fill={props?.fill || "currentColor"} viewBox="0 0 64 64" {...props}>
        <Path
            fill="url(#kycPending_svg__a)"
            d="M32 34.83q3.626 0 6.188-2.562 2.562-2.563 2.562-6.188 0-3.626-2.562-6.187Q35.625 17.33 32 17.33q-3.626 0-6.187 2.563-2.563 2.562-2.563 6.187t2.563 6.188T32 34.83m0 22.5q-9.124-2.313-14.562-10T12 30.08V14.83l20-7.5 20 7.5v15.25q0 9.563-5.437 17.25-5.439 7.687-14.563 10m0-5.25a18 18 0 0 0 6.531-3.719 29.6 29.6 0 0 0 4.969-5.718 26 26 0 0 0-5.594-2.094A24.5 24.5 0 0 0 32 39.83q-3 0-5.906.719a26 26 0 0 0-5.594 2.094 29.6 29.6 0 0 0 4.969 5.718A18 18 0 0 0 32 52.081"
        />
        <Defs>
            <LinearGradient
                id="kycPending_svg__a"
                x1={12}
                x2={62.304}
                y1={11.28}
                y2={57.52}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#00A6FF" />
                <Stop offset={1} stopColor="#3D61E9" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgKycPending;
