import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop, ClipPath } from "react-native-svg";
const SvgRafDepositVn = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 16} height={props?.height || 16} fill={props?.fill || "currentColor"} viewBox="0 0 16 24" {...props}>
        <G clipPath="url(#rafDepositVn_svg__a)">
            <Path
                fill="url(#rafDepositVn_svg__b)"
                d="M15.725 9.88a7.94 7.94 0 0 0-3.907-4.96c-.232-.13-.477-.24-.716-.358l.007-.015.122-.111c.427-.364.764-.823.982-1.341q.108-.295.183-.6A1.46 1.46 0 0 0 11.92.934 1.93 1.93 0 0 0 9.863.666c-.051.02-.085.036-.137-.011a2.616 2.616 0 0 0-3.441-.02.11.11 0 0 1-.135.025A2 2 0 0 0 4.936.534a1.54 1.54 0 0 0-1.33 1.688c.092.75.423 1.451.943 2 .109.117.226.229.343.348l-.088.04a8.02 8.02 0 0 0-4.777 6.754 7.3 7.3 0 0 0 .2 2.429 2.976 2.976 0 0 0 2.88 2.206c3.27-.007 6.542 0 9.813 0a2.87 2.87 0 0 0 2.447-1.28c.28-.42.457-.9.519-1.4a7.9 7.9 0 0 0-.161-3.44"
            />
            <Path
                fill="url(#rafDepositVn_svg__c)"
                d="M8.408 12.169V5.762h1.181v7.5H8.52zm-3.438-1.49v-.102q0-.6.142-1.094.141-.498.41-.855.27-.36.654-.551.386-.195.87-.196.478 0 .84.186.36.186.615.532.254.342.405.82.15.474.215 1.055v.327a5.3 5.3 0 0 1-.215 1.035 2.8 2.8 0 0 1-.405.811q-.255.342-.62.527-.362.186-.845.186-.48 0-.864-.2a1.9 1.9 0 0 1-.65-.562 2.6 2.6 0 0 1-.41-.85 3.9 3.9 0 0 1-.142-1.069m1.177-.102v.102q0 .362.064.674.067.312.21.552.141.235.366.37.23.133.547.133.4 0 .659-.176a1.2 1.2 0 0 0 .405-.474q.152-.302.205-.673V10.2a2.2 2.2 0 0 0-.122-.537 1.4 1.4 0 0 0-.24-.435 1 1 0 0 0-.375-.293 1.2 1.2 0 0 0-.523-.107q-.322 0-.546.136-.225.137-.372.376a1.9 1.9 0 0 0-.21.557 3.2 3.2 0 0 0-.068.679m4.277-4.117v.816h-3.28V6.46z"
            />
        </G>
        <Defs>
            <LinearGradient
                id="rafDepositVn_svg__b"
                x1={8.001}
                x2={8.001}
                y1={0}
                y2={15.999}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#fff" />
                <Stop offset={0.599} stopColor="#fff" stopOpacity={0.906} />
                <Stop offset={1} stopColor="#fff" stopOpacity={0.82} />
            </LinearGradient>
            <LinearGradient
                id="rafDepositVn_svg__c"
                x1={7.697}
                x2={7.697}
                y1={5.762}
                y2={13.36}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FFAB5B" />
                <Stop offset={1} stopColor="#FFA65D" />
            </LinearGradient>
            <ClipPath id="rafDepositVn_svg__a">
                <Path fill="#fff" d="M0 0h16.003v15.999H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SvgRafDepositVn;
