import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgProfile = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path
            stroke="#666"
            strokeWidth={1.5}
            d="M12 3.75a4.821 4.821 0 1 1 0 9.643 4.821 4.821 0 0 1 0-9.643ZM7.286 15.75h9.428a3.55 3.55 0 0 1 3.536 3.536v.428a.514.514 0 0 1-.536.536H4.286a.514.514 0 0 1-.536-.536v-.428a3.55 3.55 0 0 1 3.536-3.536Z"
        />
    </Svg>
);
export default SvgProfile;
