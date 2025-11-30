import Color from "$Components/Color";
import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRefresh = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width || 16} height={props?.height || 16} fill={props?.fill || Color.white} viewBox="0 0 16 16" {...props}>
        <Path
            d="M8.056 16q-3.383 0-5.718-2.32T.002 8t2.336-5.68T8.056 0q1.878 0 3.557.827a7.45 7.45 0 0 1 2.778 2.346V.8a.75.75 0 0 1 .242-.573.8.8 0 0 1 .564-.227q.348 0 .577.227.228.226.228.573v4.747q0 .426-.268.707a.92.92 0 0 1-.698.28h-4.779a.76.76 0 0 1-.578-.24.8.8 0 0 1-.227-.56q0-.348.227-.575a.79.79 0 0 1 .578-.226h3.436a6.4 6.4 0 0 0-2.362-2.44A6.3 6.3 0 0 0 8.056 1.6q-2.685 0-4.564 1.867T1.612 8t1.88 4.533T8.056 14.4q1.905 0 3.503-1.013a6 6 0 0 0 2.349-2.747.74.74 0 0 1 .31-.36.86.86 0 0 1 .469-.147q.456 0 .697.32.243.321.054.72A7.8 7.8 0 0 1 12.5 14.68Q10.498 16 8.056 16"
        />
    </Svg>
);
export default SvgRefresh;
