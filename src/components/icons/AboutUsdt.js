import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgAboutUsdt = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 18} height={props?.height || 18} fill="currentColor" viewBox="0 0 18 18" {...props}>
        <Path
            fill="#78909C"
            d="M9 18A9 9 0 1 0 9 .001 9 9 0 0 0 9 18m0-1.359A7.641 7.641 0 1 1 9 1.359a7.641 7.641 0 0 1 0 15.282"
        />
        <Path
            fill="#00A6FF"
            d="M12.557 7.344V5.67h-7.27v1.673h2.678v1.093c-2.178.092-3.818.5-3.818.982s1.64.89 3.818.982v3.507h1.91V10.4c2.17-.094 3.8-.5 3.8-.982s-1.633-.888-3.8-.982V7.342zm.3 1.976c0 .319-1.267.587-2.98.66h-.234l-.235.007h-.977l-.348-.01H7.97c-1.72-.073-3-.342-3-.663s1.277-.59 3-.663v1.015a19 19 0 0 0 1.91-.001V8.654c1.713.074 2.981.342 2.981.66z"
        />
    </Svg>
);
export default SvgAboutUsdt;
