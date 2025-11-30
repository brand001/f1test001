import React, { useState, useEffect } from "react";
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomCheckbox from "$Components/CustomCheckbox";
import Touch from "react-native-touch-once";
import moment from "moment";
import { ImagesUrl } from "@/images/index";
import { CopyIcon } from "$Components/icons/index";
import { RowCenterStart } from "$Components/CustomView";
import { UpdateMemberSuperdoorShownStatus, CopyText } from "$Utils";
import StorageUtil from "$Utils/Storage";
const { width, height } = Dimensions.get("window");
import { globalModalPadding } from "$Utils/globalModal";

// const modalData = ["www.funvip18.com", "www.funvip18.com", "www.funvip18.com", "www.funvip18.com", "www.funvip18.com"];


const SuperDoor = ({ modalData = [] }) => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // 組件卸載時的清理邏輯
        return () => {
            if (isChecked) {
                UpdateMemberSuperdoorShownStatus();
            }
            StorageUtil.save({ key: "lastCloseSuperdoor", data: moment().format() });
        };
    }, [isChecked]);


    /// https://www.figma.com/design/mieRwlgEqQ3wxP3AdpEltc/-F1M1--Core-platform?node-id=1650-18012&p=f&t=YTdCqjkiDLfb3JBC-0
    const ImgBoxWidth = width * 0.9 - globalModalPadding * 2;
    const ImgBoxHeight = (width * 0.9 - globalModalPadding * 2) * 0.28;

    return (
        <View style={styles.container}>
            <Image
                source={ImagesUrl.SuperDoorBanner}
                style={{
                    width: ImgBoxWidth,
                    height: ImgBoxHeight,
                }}
                resizeMode="stretch" />
            <View style={styles.contentContainer}>
                <Text style={styles.titleText}>尊贵的乐天堂会员们，</Text>
                <Text style={styles.descriptionText}>
                    当您不能访问我们的网站时，您可以使用任意浏览器访问以下链接，来继续享受游戏带给您的愉快体验。乐天堂建议点击复制并收藏这些域名，以便您随时畅享。
                </Text>
                <View style={styles.domainContainer}>
                    <ScrollView>
                        {modalData?.map((item, index) => (
                            <React.Fragment key={`superDoorDomain${index}`}>
                                {index !== 0 && <View style={styles.domainDivider} />}
                                <RowCenterStart style={styles.domainRow}>
                                    <RowCenterStart style={styles.domainRowLeft}>
                                        <Text style={styles.domainText}>{item}</Text>

                                        <CopyIcon
                                            onPress={() => {
                                                CopyText(`https://${item}`, "链接已复制");
                                            }}
                                            width={26}
                                            height={26}
                                        />
                                    </RowCenterStart>
                                    <Touch onPress={() => Linking.openURL(`https://${item}`)} style={styles.domainButton}>
                                        <Text style={styles.domainButtonText}>前往</Text>
                                    </Touch>
                                </RowCenterStart>
                            </React.Fragment>
                        ))}
                    </ScrollView>
                </View>

                <CustomCheckbox
                    isFull={true}
                    isCheck={isChecked}
                    type="medium"
                    text={"7日內不再显示此提示"}
                    onPress={setIsChecked}
                />
            </View>
        </View>
    );
};

export default SuperDoor;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingBottom: 20,
    },
    contentContainer: {
        width: "100%",
        alignSelf: "center",
        maxHeight: "75%",
    },
    titleText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 18,
        paddingVertical: 10,
    },
    descriptionText: {
        color: "#666666",
        fontSize: 15,
    },
    domainContainer: {
        maxHeight: 0.2 * height,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        marginVertical: 10,
    },
    domainDivider: {
        width: "100%",
        borderWidth: 1,
        height: 1,
        borderColor: "#E0E0E0",
    },
    domainRow: {
        width: "90%",
        alignSelf: "center",
        paddingVertical: 5,
    },
    domainRowLeft: {
        flex: 3,
        height: "100%",
    },
    domainText: {
        color: "black",
        marginRight: 6,
    },
    domainButton: {
        borderColor: "#00A6FF",
        borderWidth: 1,
        borderRadius: 8,
    },
    domainButtonText: {
        color: "#00A6FF",
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
});
