import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRafTurnover = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 8} height={props?.height || 8} fill={props?.fill || "currentColor"} viewBox="0 0 8 8" {...props}>
        <Path
            fill="#fff"
            d="M6.9.001a1.1 1.1 0 0 1 1.1 1.1v1.4a1.1 1.1 0 0 1-1.1 1.1h-.2v4.093a.3.3 0 0 1-.48.24L5.6 7.47l-.56.419a.4.4 0 0 1-.48 0L4 7.47l-.56.419a.4.4 0 0 1-.48 0L2.4 7.47l-.62.464a.3.3 0 0 1-.48-.24V3.595h-.2A1.1 1.1 0 0 1 0 2.526V1.099a1.1 1.1 0 0 1 1.1-1.1zm-.9 2H2a.1.1 0 0 0-.1.1v4.992l.26-.195a.4.4 0 0 1 .48 0l.56.419.56-.419a.4.4 0 0 1 .48 0l.56.419.56-.419a.4.4 0 0 1 .48 0l.26.195V2.098a.1.1 0 0 0-.1-.1zM4.3 4.713a.3.3 0 0 1 0 .6H3.1a.3.3 0 0 1 0-.6zm.6-1.3a.3.3 0 0 1 0 .6H3.1a.3.3 0 1 1 0-.6zm2-2.817H1.1a.5.5 0 0 0-.5.499v1.4a.5.5 0 0 0 .5.499h.2v-.9a.7.7 0 0 1 .7-.7h4a.7.7 0 0 1 .7.7v.9h.2a.5.5 0 0 0 .5-.478V1.099A.5.5 0 0 0 6.901.6z"
        />
    </Svg>
);
export default SvgRafTurnover;
