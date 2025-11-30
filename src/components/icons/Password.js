import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";

const SvgPassword = props => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={Color.placeholderGray} viewBox="0 0 24 24" {...props}>
        <Path d="M13.4 16.92a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <Path
            fillRule="evenodd"
            d="M6.25 11.42V9.512c0-.988.216-2.43 1.058-3.649C8.18 4.6 9.666 3.67 11.992 3.67s3.814.931 4.691 2.193c.846 1.218 1.067 2.66 1.067 3.65v1.907H18a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3zm1.5-1.907c0-.814.185-1.918.792-2.796.575-.833 1.585-1.548 3.45-1.548s2.88.715 3.46 1.55c.61.878.798 1.982.798 2.793v1.907h-8.5zM18 12.919H6a1.5 1.5 0 0 0-1.5 1.5v5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1.5-1.5"
            clipRule="evenodd"
        />
    </Svg>
);
export default SvgPassword;
