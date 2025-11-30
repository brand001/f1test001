import React from "react";
import Color from "$Components/Color";
import { RefreshIcon } from "$Components/icons/index.js";
import NavBack from "$Components/Nav/NavBack";

export default function GamePageNavLeft(props) {
    let {
        title = "",
        onLeft = () => {},
        refreshCallBack = () => {},
        action = "back",
        showRefresh = false
    } = props;

    return (
        <NavBack
            onPress={onLeft}
            title={title}
            action={action}
        >
            {
                showRefresh &&
                <RefreshIcon
                    fill={Color.white}
                    width={14}
                    height={14}
                    onPress={refreshCallBack}
                />
            }

        </NavBack>
    );
}