import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgKingClub = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Path
            fill="url(#kingClub_svg__a)"
            d="M26 .42H8a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8v-18a8 8 0 0 0-8-8"
        />
        <Path
            fill="url(#kingClub_svg__b)"
            d="M23.894 25.42H10.112a1.08 1.08 0 0 1-.828-.4 1.27 1.27 0 0 1-.277-.935l.877-8.879a1.08 1.08 0 0 1 1.08-.987H12.4v-.266a4.605 4.605 0 1 1 9.21 0v.266h1.454a1.083 1.083 0 0 1 1.08.987l.85 8.88a1.26 1.26 0 0 1-.274.933 1.1 1.1 0 0 1-.826.4m-10.117-7.73a.736.736 0 0 0-.777.776 3.844 3.844 0 0 0 3.888 3.886 3.843 3.843 0 0 0 3.886-3.886.778.778 0 0 0-1.556 0 2.332 2.332 0 0 1-4.663 0 .735.735 0 0 0-.778-.777M17 11.02a2.96 2.96 0 0 0-2.98 2.933v.266h5.96v-.266A2.96 2.96 0 0 0 17 11.02"
        />
        <Defs>
            <LinearGradient
                id="kingClub_svg__a"
                x1={3.4}
                x2={31.178}
                y1={2.391}
                y2={31.869}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FF98B5" />
                <Stop offset={1} stopColor="#EF3A75" />
            </LinearGradient>
            <LinearGradient
                id="kingClub_svg__b"
                x1={17.001}
                x2={17.001}
                y1={9.348}
                y2={25.419}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgKingClub;
