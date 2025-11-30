import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const SvgSmartActive = props => (
    <Svg xmlns="http://www.w3.org/2000/svg"width={24} height={24} viewBox="0 0 24 24" fill="transparent" {...props}>
        <Path fill="#fff" stroke="#00A6FF" strokeWidth={1.4} d="M11.297 4.226c.712.879.822 1.482 1.148 2.361 0 0-1.757.366-2.754.062-.93-.173-2.382-1.25-1.903-2.546.565-1.529 2.58-1.023 3.509.123Z" />
        <Path
            fill="#fff"
            stroke="#00A6FF"
            strokeWidth={1.4}
            d="M13.21 4.226c-.713.879-.823 1.482-1.149 2.361 0 0 1.757.366 2.754.062.93-.173 2.382-1.25 1.903-2.546-.565-1.529-2.579-1.023-3.508.123Z"
        />
        <Rect width={17.107} height={3.703} x={3.7} y={6.892} fill="#00A6FF" stroke="#00A6FF" strokeWidth={1.4} rx={0.8} />
        <Path
            fill="#00A6FF"
            stroke="#00A6FF"
            strokeWidth={1.4}
            d="M4.82 18.1v-5.79c0-.84 0-1.26.164-1.58a1.5 1.5 0 0 1 .656-.656c.32-.163.74-.163 1.58-.163h10.066c.84 0 1.26 0 1.581.163a1.5 1.5 0 0 1 .656.656c.163.32.163.74.163 1.58v5.79c0 .84 0 1.26-.163 1.581a1.5 1.5 0 0 1-.656.656c-.32.163-.74.163-1.58.163H7.22c-.84 0-1.26 0-1.581-.163a1.5 1.5 0 0 1-.656-.656c-.163-.32-.163-.74-.163-1.581Z"
        />
        <Path fill="#fff" d="M12.773 19.84V7.38a.52.52 0 0 0-1.039 0v12.46a.52.52 0 1 0 1.039 0" />
        <Path fill="#fff" d="M18.483 9.976H6.023a.52.52 0 1 0 0 1.038h12.46a.52.52 0 0 0 0-1.038" />
    </Svg>
);
export default SvgSmartActive;
