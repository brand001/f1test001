import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgDiamondClub = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Path
            fill="url(#diamondClub_svg__a)"
            d="M26 .42H8a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8v-18a8 8 0 0 0-8-8"
        />
        <Path
            fill="url(#diamondClub_svg__b)"
            d="M17 24.373a.83.83 0 0 1-.619-.27l-7.2-8.051a.68.68 0 0 1-.067-.841l2.4-3.66a.82.82 0 0 1 .686-.355h9.6a.82.82 0 0 1 .687.355l2.4 3.66a.685.685 0 0 1-.067.842l-7.2 8.05a.83.83 0 0 1-.62.27m-2.971-10.354a.795.795 0 0 0 0 1.589h5.942a.795.795 0 0 0 0-1.59z"
        />
        <Defs>
            <LinearGradient
                id="diamondClub_svg__a"
                x1={3.4}
                x2={31.178}
                y1={2.391}
                y2={31.869}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FFE5AA" />
                <Stop offset={1} stopColor="#FFA816" />
            </LinearGradient>
            <LinearGradient
                id="diamondClub_svg__b"
                x1={17}
                x2={17}
                y1={11.196}
                y2={24.373}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgDiamondClub;
