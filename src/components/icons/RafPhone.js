import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRafPhone = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 5} height={props?.height || 8} fill={props?.fill || "currentColor"} viewBox="0 0 5 8" {...props}>
        <Path
            fill="#fff"
            d="M4.25 8H.75A.75.75 0 0 1 0 7.25V.75A.75.75 0 0 1 .75 0h3.5A.75.75 0 0 1 5 .75v6.5a.75.75 0 0 1-.75.75M2.5 6.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M.938.75A.19.19 0 0 0 .75.938v4.874A.19.19 0 0 0 .938 6h3.125a.19.19 0 0 0 .187-.188V.938A.19.19 0 0 0 4.063.75z"
        />
    </Svg>
);
export default SvgRafPhone;
