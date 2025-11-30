import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgRecordes = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Path
            fill="url(#recordes_svg__a)"
            d="M26 .42H8a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8v-18a8 8 0 0 0-8-8"
        />
        <Path
            fill="url(#recordes_svg__b)"
            d="m22.959 24.549-2.355-2.22-1.832 1.726-1.832-1.726-1.832 1.726-1.832-1.726-2.356 2.217V12.385a2.1 2.1 0 0 1 2.094-2.094h7.851a2.1 2.1 0 0 1 2.094 2.093zm-8.744-6.414a.561.561 0 1 0-.006 1.121h5.611a.562.562 0 1 0 0-1.12zm0-2.525a.561.561 0 1 0 0 1.122h5.605a.562.562 0 1 0 0-1.121zm0-2.524a.561.561 0 0 0 0 1.121h5.605a.56.56 0 1 0 0-1.122z"
        />
        <Defs>
            <LinearGradient
                id="recordes_svg__a"
                x1={3.4}
                x2={31.178}
                y1={2.391}
                y2={31.869}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#69FFDC" />
                <Stop offset={1} stopColor="#23D9CB" />
            </LinearGradient>
            <LinearGradient
                id="recordes_svg__b"
                x1={16.939}
                x2={16.939}
                y1={10.29}
                y2={24.549}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgRecordes;
