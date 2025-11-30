import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRafMail = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 8} height={props?.height || 6} fill={props?.fill || "currentColor"} viewBox="0 0 8 6" {...props}>
        <Path
            fill="#fff"
            d="M7.25 6H.75A.75.75 0 0 1 0 5.25V.75A.75.75 0 0 1 .75 0h6.5A.75.75 0 0 1 8 .75v4.5a.75.75 0 0 1-.75.75M.75 2.35v2.9h6.5v-2.9L5.611 3.641q-.077.061-.167.137c-.384.396-.89.65-1.438.722h-.012a2.48 2.48 0 0 1-1.44-.725c-.06-.05-.114-.1-.164-.134l-.627-.492zM4 3.75h.006c.3 0 .717-.346.991-.575l.151-.124.783-.615L7.25 1.388V.75H.75v.638l2.1 1.664c.045.035.1.078.154.126.274.228.687.572.987.572z"
        />
    </Svg>
);
export default SvgRafMail;
