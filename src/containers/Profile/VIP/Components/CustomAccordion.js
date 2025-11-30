import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, LayoutAnimation, Platform, UIManager } from "react-native";
import { RowCenterBetween, RowCenterStart } from "$Components/CustomView";
import { ArrowIcon } from "$Components/icons/index";
import Color from "$Components/Color";

const { width } = Dimensions.get("window");

class CustomAccordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSections: [],
        };

        this.rotationValues = props.FAQ.map(() => new Animated.Value(0));
    }

    componentDidMount() {
        // 启用 LayoutAnimation
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental?.(true);
        }
    }

    toggleSection = sectionIndex => {
        const { activeSections } = this.state;
        const isActive = activeSections.includes(sectionIndex);

        // 配置动画
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // 箭头旋转动画
        Animated.timing(this.rotationValues[sectionIndex], {
            toValue: isActive ? 0 : 1,
            duration: 300,
            useNativeDriver: true
        }).start();

        if (activeSections.includes(sectionIndex)) {
            this.setState({
                activeSections: activeSections.filter(index => index !== sectionIndex),
            });
        } else {
            this.setState({
                activeSections: [...activeSections, sectionIndex],
            });
        }
    };

    renderHeader = (section, index, isActive) => {
        const rotateZ = this.rotationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"]
        });

        return (
            <RowCenterBetween style={[styles.faqHeader, isActive ? styles.active : styles.inactive]}>
                <Text style={styles.faqHeaderText}>{section.title}</Text>
                <Animated.View style={{ transform: [{ rotateZ }] }}>
                    <ArrowIcon direction="bottom" fill={Color.gray}/>
                </Animated.View>
            </RowCenterBetween>
        );
    };

    renderContent = section => {
        return (
            <View style={styles.faqContent}>
                <Text style={styles.faqContentText}>{section.content}</Text>
            </View>
        );
    };

    render() {
        const { title = "", FAQ } = this.props;
        const { activeSections } = this.state;

        return (
            <View style={styles.container}>
                <RowCenterStart>
                    <Text style={styles.faqTitle}>{title}</Text>
                </RowCenterStart>
                {FAQ.map((section, index) => (
                    <View key={index} style={styles.sectionContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => this.toggleSection(index)}
                        >
                            {this.renderHeader(section, index, activeSections.includes(index))}
                        </TouchableOpacity>
                        {activeSections.includes(index) && this.renderContent(section, index)}
                    </View>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        maxWidth: width - 5,
        marginHorizontal: 15,
        marginTop: 25,
        marginBottom: 30,
    },
    sectionContainer: {
        marginBottom: 10,
    },
    faqTitle: {
        color: "#ABA79D",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 10,
        paddingLeft: 15,
    },
    faqHeader: {
        backgroundColor: "#2D2F33",
        padding: 15,
        marginTop: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    faqHeaderText: {
        color: "#D6D1C2",
        fontWeight: "bold",
        fontSize: 14,
        width: "85%",
    },
    faqContent: {
        backgroundColor: "#2D2F33",
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        lineHeight: 18,
    },
    faqContentText: {
        color: "#D6D1C2",
        fontSize: 12,
        width: "95%",
        paddingVertical: 15,
    },
    inactive: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    active: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});

export default CustomAccordion;
