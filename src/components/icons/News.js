import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SvgNews = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <Path
            fill="url(#news_svg__a)"
            d="M26 .42H8a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8v-18a8 8 0 0 0-8-8"
        />
        <Path
            fill="url(#news_svg__b)"
            d="M18.408 11.333a1.4 1.4 0 1 0-2.781.223 5.31 5.31 0 0 0-3.515 4.971v1.847s0 2.66-.683 2.681a.672.672 0 1 0-.019 1.343h11.195a.671.671 0 1 0 0-1.343c-.7 0-.7-2.663-.7-2.663V16.53a5.17 5.17 0 0 0-3.515-4.975q.017-.113.018-.222m.7 11.73a2.1 2.1 0 0 1-4.194 0z"
        />
        <Defs>
            <LinearGradient
                id="news_svg__a"
                x1={30.498}
                x2={4.182}
                y1={30.441}
                y2={0.419}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#7540DE" />
                <Stop offset={1} stopColor="#C38DFF" />
            </LinearGradient>
            <LinearGradient
                id="news_svg__b"
                x1={13.529}
                x2={24.44}
                y1={9.933}
                y2={23.169}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.71} />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SvgNews;
