import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgUserGuest = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 20} height={props?.height || 21} fill="currentColor" viewBox="0 0 20 21" {...props}>
        <Path
            fill="#fff"
            d="M10.281 9.332a3.861 3.861 0 1 0 0-7.722 3.861 3.861 0 0 0 0 7.722M3.332 15.51a4.63 4.63 0 0 1 4.633-4.633h4.633a4.63 4.63 0 0 1 4.633 4.633v2.316a.773.773 0 0 1-.772.772H4.104a.773.773 0 0 1-.772-.772z"
        />
    </Svg>
);
export default SvgUserGuest;
