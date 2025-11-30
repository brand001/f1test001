import React from "react";
import { ScrollView, Dimensions, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

class CarouselWithPagination extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { activeKey, data, renderCarouselItem, onSnapToItem, activeCarouselIndices } = this.props;

        return (
            <ScrollView style={{ borderRadius: 10 }} showsVerticalScrollIndicator={false}>
                <Carousel
                    key={activeKey}
                    data={data}
                    renderItem={renderCarouselItem}
                    sliderWidth={width}
                    itemWidth={width}
                    onSnapToItem={(index) => onSnapToItem(index, activeKey)}
                    swipeThreshold={1}
                    useScrollView={true}
                    containerCustomStyle={{ marginTop: 16 }}
                />
                <Pagination
                    dotsLength={data.length}
                    activeDotIndex={activeCarouselIndices[activeKey] || 0}
                    containerStyle={styles.paginationContainer}
                    dotStyle={styles.dotStyle}
                    inactiveDotStyle={styles.inactiveDotStyle}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                />
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({

    paginationContainer: {
        paddingVertical: 25,
    },
    dotStyle: {
        backgroundColor: "#00A6FF",
        width: 10,
        height: 10,
        marginHorizontal: -5,
        borderRadius: 1000,
    },
    inactiveDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 1000,
        backgroundColor: "#CDCDD0"
    },
});

export default CarouselWithPagination;



