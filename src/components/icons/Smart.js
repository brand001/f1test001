import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const SvgSmart = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path stroke="#666" strokeWidth={1.4} d="M11.079 4.963c.686.846.792 1.427 1.106 2.274 0 0-1.692.352-2.652.059C8.636 7.13 7.239 6.091 7.7 4.844c.544-1.472 2.484-.985 3.379.119Z" />
        <Path stroke="#666" strokeWidth={1.4} d="M12.921 4.963c-.686.846-.792 1.427-1.106 2.274 0 0 1.692.352 2.652.059.897-.166 2.294-1.205 1.833-2.452-.544-1.472-2.484-.985-3.379.119Z" />
        <Path fill="#666" d="M12.682 7.473h-1.363V21.3h1.362z" />
        <Rect width={16.425} height={3.515} x={3.788} y={7.556} stroke="#666" strokeWidth={1.4} rx={0.8} />
        <Path
            stroke="#666"
            strokeWidth={1.4}
            d="M4.842 10.437v7.8c0 .84 0 1.26.163 1.58a1.5 1.5 0 0 0 .656.656c.32.163.74.163 1.58.163h9.518c.84 0 1.26 0 1.581-.163a1.5 1.5 0 0 0 .656-.656c.163-.32.163-.74.163-1.58v-7.8"
        />
    </Svg>
);
export default SvgSmart;
