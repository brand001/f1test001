import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgOtpCs = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 54} height={props?.height || 54} fill={"transparent"} viewBox="0 0 54 54" {...props}>
        <Path
            stroke="#00A6FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M29.446 32.184h-3.53a1.4 1.4 0 0 1-1.4-1.4 1.4 1.4 0 0 1 1.4-1.359h3.53a1.4 1.4 0 0 1 1.4 1.4 1.4 1.4 0 0 1-1.4 1.359M23.816 30.785h-3.489a4.19 4.19 0 0 1-4.188-4.19v-3.5M16.132 27.294a3.217 3.217 0 0 1-3.489-3.145v-2.1a3.216 3.216 0 0 1 3.49-3.145M39.186 27.294a3.217 3.217 0 0 0 3.489-3.145v-2.1a3.216 3.216 0 0 0-3.489-3.145"
        />
        <Path
            stroke="#00A6FF"
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M48.961 48.953v-.1a9.78 9.78 0 0 0-5.627-8.847l-7.679-2.94c-2.058 1.407-4.365 2.815-7.645 2.815a12.54 12.54 0 0 1-8.384-2.8l-8.371 2.937a9.78 9.78 0 0 0-5.63 8.848v.1"
        />
        <Path
            stroke="#00A6FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.132 23.096v-6.29A10.993 10.993 0 0 1 27.305 5.627c6.359 0 11.873 4.89 11.873 11.179v10.456"
        />
        <Path
            stroke="#00A6FF"
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M36.39 20.305v5.24c0 4.826-2.8 10.134-8.73 10.134-5.942 0-8.73-5.324-8.73-10.134v-5.24M18.93 17.505c9.22 0 12.571-2.1 13.97-4.19 0 0 0 4.19 3.49 4.19"
        />
    </Svg>
);
export default SvgOtpCs;
