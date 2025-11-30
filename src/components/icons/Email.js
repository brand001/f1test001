import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgEmail = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={Color.placeholderGray} viewBox="0 0 24 24" {...props}>
        <Path
            fillRule="evenodd"
            d="M4 5.67a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2zm.568 1.5h14.865l-6.61 5.783a1.25 1.25 0 0 1-1.646 0zM3.5 17.108v-8.88l4.736 4.144zm1.06 1.06h14.88l-4.808-4.806-.821.719a2.75 2.75 0 0 1-3.622 0l-.821-.72zm11.204-5.796 4.736 4.736v-8.88z"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgEmail;
