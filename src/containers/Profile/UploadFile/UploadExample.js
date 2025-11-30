import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
const { width, height } = Dimensions.get("window");
import { SuccessIcon, FailIcon } from "$Components/icons/index";

import { UploadExampleData } from "./data";
import { translate } from "@/locales/translate";

class UploadExample extends React.Component {
    componentDidMount() {
        this.props.navigation.setParams({
            title: `${this.props.pageTitle}`,
        });
    }

    render() {
        // #D90000
        let docTypeId = this.props.docTypeId;
        const getData = UploadExampleData[`docTypeId_${docTypeId}`] || [];
        const isVN = window.LANGUAGE == "VN";
        const isTH = window.LANGUAGE == "TH";
        const isCN = window.LANGUAGE == "CN";

        // Calculate image width based on docTypeId and language
        const getImageWidth = () => {
            if (docTypeId == 4) {
                if (isTH) return width * 0.8;
                if (isCN) return width;
                return width * 0.6; // VN and others
            } else {
                if (isCN) return width;
                return width * 0.8; // TH, VN and others
            }
        };

        return (
            <ScrollView style={styles.root}>
                {getData &&
                    getData.map((x, xIdx) => {
                        return (
                            <View style={[styles.wrap]} key={xIdx}>
                                <View
                                    style={{
                                        alignItems: "center",
                                        width: "100%",
                                    }}>
                                    <AutoHeightImage
                                        resizeMode="stretch"
                                        width={getImageWidth()}
                                        source={x.imgSrc}
                                        style={{ marginBottom: 15 }}
                                    />
                                    {/* {
                                        xIdx == 0 && docTypeId == 5 && window.LANGUAGE == "TH" && <SuccessIcon
                                            width={40}
                                            height={40}
                                            wrapStyle={{
                                                marginTop: -40,
                                                marginBottom: 20
                                            }}
                                        />
                                    }

                                    {
                                        xIdx == 1 && docTypeId == 5 && window.LANGUAGE == "TH" &&
                                        <FailIcon
                                            width={40}
                                            height={40}
                                            wrapStyle={{
                                                marginTop: -40,
                                                marginBottom: 20
                                            }}
                                        />
                                    } */}
                                </View>
                                <>
                                    {x.texts.length > 0 &&
                                        x.texts.map((y, yIdx) => {
                                            return (
                                                <Text key={yIdx} style={styles.text}>
                                                    {y}
                                                </Text>
                                            );
                                        })}
                                </>
                            </View>
                        );
                    })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#EFEFF4",
        paddingHorizontal: 15,
        paddingVertical: 16,
    },
    wrap: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingBottom: 24,
        marginBottom: 16,
        paddingTop: 15,
        paddingHorizontal: 24,
    },
    text: {
        color: "#222",
        fontSize: 12,
        marginBottom: 5,
    },
});

export default UploadExample;
