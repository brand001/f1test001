import * as React from "react";
import Svg, { Path } from "react-native-svg";
import Color from "$Components/Color";
const SvgBackTop = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 25 25" fill={Color.theme || 'transparent'} {...props}>
        <Path
            d="M5.379 13.79a.56.56 0 0 0 0 .8l.919.918a.563.563 0 0 0 .8-.009l4.392-4.552v11.66a.566.566 0 0 0 .569.562h1.312a.564.564 0 0 0 .563-.563V10.944l4.4 4.552a.556.556 0 0 0 .8.01l.919-.92a.565.565 0 0 0 0-.8l-6.938-6.953a.56.56 0 0 0-.8 0zm-1.1-9.184h16.873a.564.564 0 0 0 .563-.562V2.732a.564.564 0 0 0-.562-.562H4.277a.564.564 0 0 0-.562.562v1.312a.564.564 0 0 0 .562.563z"
        />
    </Svg>
);
export default SvgBackTop;
