/* 展示 關注(收藏)星 包含點擊   */

import {
    StyleSheet,

    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import { dataIsEqual } from "../../../../lib/js/util";
import React from "react";

import { StarIcon } from "$Components/icons/index";

export default class FavouriteStar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        //指定要監控變化的prop
        this.MonitorProps = ["IsFavourite"];
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //優化效能：只有指定的prop變化時才要重新渲染
    shouldComponentUpdate(nextProps, nextState) {
        return !dataIsEqual(this.props.EventData, nextProps.EventData, this.MonitorProps);
    }

    render() {
        const { EventData, ToggleFavourite } = this.props;
        //console.log('FavouriteStarFavouriteStarFavouriteStar',EventData.IsFavourite)
        return EventData ? (
            <Touch
                style={{ paddingRight: 0, }}
                onPress={() => ToggleFavourite(EventData)}
            >
                <StarIcon
                    width={22}
                    height={22}
                    fill={EventData.IsFavourite ? "#FFEB00" : "transparent"}
                    stroke={EventData.IsFavourite ? "#FFEB00" : "#B0B0B0"}></StarIcon>
            </Touch>
        ) : null;
    }
}
