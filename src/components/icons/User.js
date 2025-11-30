import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgUser = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={Color.placeholderGray} viewBox="0 0 24 24" {...props}>
        <Path
            fillRule="evenodd"
            d="M8.618 13.639a6 6 0 1 1 6.768.001c1.79.575 3.03 1.614 3.86 2.845 1.245 1.844 1.504 4.017 1.504 5.42a.75.75 0 0 1-1.5 0c0-1.264-.241-3.09-1.247-4.58-.921-1.366-2.548-2.543-5.51-2.66a6 6 0 0 1-.982 0c-2.965.116-4.592 1.294-5.514 2.66-1.006 1.49-1.247 3.316-1.247 4.58a.75.75 0 0 1-1.5 0c0-1.403.259-3.576 1.503-5.42.832-1.232 2.074-2.271 3.865-2.846m2.935-.477a14 14 0 0 1 .899 0 4.5 4.5 0 1 0-.9 0"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgUser;
