import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgVerificationMail = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 24} height={props?.height || 24} fill={props?.fill || "currentColor"} viewBox="0 0 24 24" {...props}>
        <Path
            d="M4 20q-.824 0-1.412-.587A1.93 1.93 0 0 1 2 18V6q0-.824.587-1.412A1.93 1.93 0 0 1 4 4h16q.824 0 1.413.588Q22 5.175 22 6v12q0 .824-.587 1.413A1.93 1.93 0 0 1 20 20zm8-7.175q.124 0 .262-.037a1 1 0 0 0 .263-.113L19.6 8.25a.83.83 0 0 0 .4-.725.82.82 0 0 0-.425-.75q-.425-.25-.875.025L12 11 5.3 6.8q-.45-.274-.875-.013Q4 7.05 4 7.525q0 .25.1.438.1.187.3.287l7.075 4.425a1.04 1.04 0 0 0 .525.15"
        />
    </Svg>
);
export default SvgVerificationMail;
