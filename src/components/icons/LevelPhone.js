import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";
const SvgLevelPhone = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 50} height={props?.height || 40} fill={props?.fill || "currentColor"} viewBox="0 0 50 40" {...props}>
        <Mask
            id="levelPhone_svg__a"
            width={32}
            height={34}
            x={9}
            y={3}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "luminance",
            }}
        >
            <Path fill="#fff" d="M41 3.996H9v32.01h32z" />
        </Mask>
        <G fill="#00A6FF" mask="url(#levelPhone_svg__a)">
            <Path d="M35.564 15.508V7.945a3.64 3.64 0 0 0-2.19-3.578 4 4 0 0 0-1.606-.346h-.91l-4.44-.01v-.007q-4.087 0-8.177.019c-.553.002-1.1.12-1.606.346a3.64 3.64 0 0 0-2.19 3.578q.006 6.03 0 12.062-.006 6.03 0 12.062a3.754 3.754 0 0 0 3.942 3.932h13.295a4 4 0 0 0 2.215-.636q.292-.191.541-.435l.016-.015.044-.046a3.8 3.8 0 0 0 1.058-2.7V24.42q.01-4.461.008-8.912m-18.62 10.1V7.948a1.29 1.29 0 0 1 1.453-1.456h7.433l5.357.012v-.017h.435a1.29 1.29 0 0 1 1.452 1.454v18.035h-16.13zm1.326 7.877a1.24 1.24 0 0 1-1.326-1.34v-3.364c0-.086.011-.172.017-.275h16.086c.008.1.022.194.022.289v3.339a1.246 1.246 0 0 1-1.13 1.35 1.3 1.3 0 0 1-.2 0h-.876q-6.294.006-12.586 0z" />
            <Path d="M25.012 29.809a1.244 1.244 0 1 0 1.247 1.25 1.257 1.257 0 0 0-1.247-1.25" />
        </G>
    </Svg>
);
export default SvgLevelPhone;
