import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";
const SvgFriend = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 34} height={props?.height || 35} fill="currentColor" viewBox="0 0 34 35" {...props}>
        <G clipPath="url(#friend_svg__a)">
            <Path
                fill="url(#friend_svg__b)"
                d="M26 .42H8a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8v-18a8 8 0 0 0-8-8"
            />
            <G clipPath="url(#friend_svg__c)">
                <Path
                    fill="url(#friend_svg__d)"
                    d="M9 21.35q0-.619.318-1.137t.846-.79a10.8 10.8 0 0 1 2.29-.846 10 10 0 0 1 2.364-.282q1.2 0 2.364.282a10.8 10.8 0 0 1 2.29.845q.528.273.846.791t.318 1.136v.582q0 .6-.427 1.028a1.4 1.4 0 0 1-1.027.427h-8.728a1.4 1.4 0 0 1-1.027-.427A1.4 1.4 0 0 1 9 21.93zm12.69 2.036q.201-.328.3-.7.101-.373.1-.755v-.727q0-.8-.445-1.536-.446-.736-1.263-1.264a9.2 9.2 0 0 1 3.272 1.018q.655.364 1 .81.346.444.346.972v.727q0 .6-.427 1.028a1.4 1.4 0 0 1-1.028.427zm-6.872-5.818q-1.2 0-2.054-.855a2.8 2.8 0 0 1-.855-2.054q0-1.2.854-2.055a2.8 2.8 0 0 1 2.055-.854q1.2 0 2.055.854.855.855.854 2.055 0 1.2-.854 2.054-.855.855-2.055.855m7.273-2.91q0 1.2-.855 2.055t-2.054.855q-.2 0-.51-.046a4 4 0 0 1-.509-.1q.492-.582.755-1.29.264-.71.264-1.473t-.264-1.473a4.3 4.3 0 0 0-.755-1.291q.255-.09.51-.118.254-.027.509-.027 1.2 0 2.054.854.855.855.855 2.055"
                />
            </G>
        </G>
        <Defs>
            <LinearGradient
                id="friend_svg__b"
                x1={3.4}
                x2={31.178}
                y1={2.391}
                y2={31.869}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#97C7FE" />
                <Stop offset={1} stopColor="#4268F9" />
            </LinearGradient>
            <LinearGradient
                id="friend_svg__d"
                x1={17}
                x2={17}
                y1={11.749}
                y2={23.386}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
            <ClipPath id="friend_svg__a">
                <Path fill="#fff" d="M0 .42h34v34H0z" />
            </ClipPath>
            <ClipPath id="friend_svg__c">
                <Path fill="#fff" d="M9 9.75h16v16H9z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgFriend;
