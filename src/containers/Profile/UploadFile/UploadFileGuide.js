import React from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
const { width } = Dimensions.get("window");
import { translate } from "@/locales/translate";
import { UploadFileGuideData } from "./data";
import Styles from "./Styles";

export default class UploadFileGuide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerIndex: 0,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: translate("如何上传您的文件"),
        });
    }

    renderPage(item) {
        return (
            <View key={item.index} style={[Styles.carouselWrap]}>
                <View style={{ flex: 1, height: 120 }}>
                    <Text style={Styles.carouselWrapTitle}>{item.item.title}</Text>
                    <Text style={Styles.carouselInfor}>{item.item.desc}</Text>
                </View>
                <Image resizeMode="stretch" style={[Styles.carouselImg]} source={item.item.imgSrc} />
            </View>
        );
    }

    render() {
        const { bannerIndex } = this.state;

        return (
            <View style={Styles.viewContainer}>
                <ScrollView automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View>
                        {Array.isArray(UploadFileGuideData) && UploadFileGuideData.length > 0 && (
                            <View style={Styles.wrapper}>
                                <Carousel
                                    useScrollView={true}
                                    data={UploadFileGuideData}
                                    renderItem={this.renderPage.bind(this)}
                                    sliderWidth={width - 40}
                                    itemWidth={width - 40}
                                    autoplay={true}
                                    loop={true}
                                    autoplayDelay={500}
                                    autoplayInterval={4000}
                                    onSnapToItem={index => this.setState({ bannerIndex: index })}
                                    enableMomentum={false}
                                    lockScrollWhileSnapping={true}
                                    decelerationRate={"fast"}
                                    scrollEnabled={true}
                                />

                                <Pagination
                                    dotsLength={UploadFileGuideData.length}
                                    activeDotIndex={bannerIndex}
                                    dotStyle={Styles.dotStyle}
                                    inactiveDotStyle={Styles.inactiveDotStyle}
                                    inactiveDotOpacity={1}
                                    inactiveDotScale={0.6}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
