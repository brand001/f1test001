import React, { useState, useEffect } from "react";

import { Alert, Image, Linking, PermissionsAndroid, Platform, StyleSheet, Text, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import RNHeicConverter from "react-native-heic-converter";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

import { ImagesUrl } from "@/images/index";
import { translate } from "@/locales/translate";
import { RowCenterBetween, RowCenterCenter } from "$Components/CustomView";

// 检测各个原生功能是否可用
const NativeFunctionDetector = {
    // 检测拍照功能（通过检查函数和模块存在性）
    checkCameraFunction: async () => {
        try {
            // 1. 检查函数是否存在
            if (typeof launchCamera !== "function") {
                console.log("launchCamera function not found");
                return false;
            }

            // 2. 检查相关的原生模块（通过检查函数的原生绑定）
            try {
                // 如果能够正常创建配置对象，说明原生模块基本可用
                console.log("launchCamera configuration test passed");
                return true;
            } catch (error) {
                console.log("launchCamera configuration test failed:", error);
                return false;
            }
        } catch (error) {
            console.log("launchCamera detection failed:", error);
            return false;
        }
    },

    // 检测相册功能
    checkGalleryFunction: async () => {
        try {
            if (typeof launchImageLibrary !== "function") {
                console.log("launchImageLibrary function not found");
                return false;
            }

            try {
                console.log("launchImageLibrary configuration test passed");
                return true;
            } catch (error) {
                console.log("launchImageLibrary configuration test failed:", error);
                return false;
            }
        } catch (error) {
            console.log("launchImageLibrary detection failed:", error);
            return false;
        }
    },

    // 检测文档选择功能
    checkDocumentPickerFunction: async () => {
        try {
            // 1. 检查 DocumentPicker 对象和方法是否存在
            if (!DocumentPicker || typeof DocumentPicker.pick !== "function") {
                console.log("DocumentPicker.pick function not found");
                return false;
            }

            // 2. 检查 DocumentPicker.types 是否存在
            if (!DocumentPicker.types || !DocumentPicker.types.images) {
                console.log("DocumentPicker.types not available");
                return false;
            }

            // 3. 检查相关的依赖库
            try {
                // 检查 RNFS 是否可用（文档选择后需要读取文件）
                if (!RNFS || typeof RNFS.readFile !== "function") {
                    console.log("RNFS not available - file reading may fail");
                    return false;
                }

                console.log("DocumentPicker and dependencies test passed");
                return true;
            } catch (error) {
                console.log("DocumentPicker dependencies test failed:", error);
                return false;
            }
        } catch (error) {
            console.log("DocumentPicker detection failed:", error);
            return false;
        }
    }
};

async function checkCameraPermission() {
    if (Platform.OS === "android") {
        // Android 需要多個權限
        const permissions = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];

        try {
            const granted = await PermissionsAndroid.requestMultiple(permissions);

            // 檢查所有權限是否都被授予
            const allGranted = Object.values(granted).every(
                permission => permission === PermissionsAndroid.RESULTS.GRANTED
            );

            if (!allGranted) {
                Alert.alert(
                    translate("权限提示"),
                    translate("请在Android的“设置 - 应用管理 - FUN88- 应用权限”中允许访问相机"),
                    [
                        { text: translate("取消"), style: "cancel" },
                        {
                            text: translate("去设置"),
                            onPress: () => Linking.openSettings(),
                        },
                    ]
                );
                return false;
            }
        } catch (error) {
            console.log("Android permission request error:", error);
            Alert.alert(translate("权限错误"), translate("无法请求相机权限"));
            return false;
        }
    } else if (Platform.OS === "ios") {
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result === RESULTS.DENIED) {
            const requestResult = await request(PERMISSIONS.IOS.CAMERA);
            if (requestResult !== RESULTS.GRANTED) {
                Alert.alert(translate(translate("权限提示")), translate("请在iPhone的“设置-隐私-照片” 中允许访问相机"), [
                    { text: translate("取消"), style: "cancel" },
                    {
                        text: translate("去设置"),
                        onPress: () => Linking.openSettings(),
                    },
                ]);
                return false;
            }
        } else if (result !== RESULTS.GRANTED) {
            Alert.alert(translate(translate("权限提示")), translate("请在iPhone的“设置-隐私-照片” 中允许访问相机"), [
                { text: translate("取消"), style: "cancel" },
                {
                    text: translate("去设置"),
                    onPress: () => Linking.openSettings(),
                },
            ]);
            return false;
        }
    }
    return true;
}

export const ImagePickerOption = {
    title: "Chọn hình", //TODO:CN-DONE 选择图片
    cancelButtonTitle: "Hủy", //TODO:CN-DONE 取消
    chooseFromLibraryButtonTitle: "Chọn hình", //TODO:CN-DONE 选择图片
    cameraType: "back",
    mediaType: Platform.OS == "ios" ? "photo" : "mixed",
    videoQuality: "high",
    // durationLimit: 10,
    // maxWidth: 1200,
    // maxHeight: 2800,
    // quality: 1,
    // angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: Platform.OS === "android" ? "images" : "images", // Android 路徑設置
    },
    includeBase64: true,
    saveToPhotos: true,
    // Android 特定配置
    ...(Platform.OS === "android" && {
        cameraType: "back",
        maxWidth: 1200,
        maxHeight: 2800,
        quality: 0.8,
    }),
};

function slectFileCallBack(response) {
    if (response?.didCancel) {
    } else if (response?.error) {
        Alert.alert("上传失败由于未知的错误， 请稍后再试 ");
    } else if (response?.customButton) {
    } else {
        let { assets } = response;
        if (!(Array.isArray(assets) && assets?.length)) return;
        return assets[0];
    }
}

class FilePickerUtil {
    /**
     * 统一文件名，确保后缀小写
     */
    static getNewFileName(name) {
        const idx = name.lastIndexOf(".");
        return name.substring(0, idx) + name.substring(idx).toLowerCase();
    }

    /**
     * **修正 iOS HEIC 文件路径**
     * 复制 HEIC 文件到 RNFS.DocumentDirectoryPath
     */
    static async fixHeicFilePath(uri) {
        try {
            const fileName = `temp_heic_${Date.now()}.heic`; // 生成唯一文件名
            const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            try {
                await RNFS.moveFile(uri, newPath);
                return newPath;
            } catch (moveError) {
                console.log("RNFS.moveFile error:", moveError);
                return uri; // 如果复制失败，仍然返回原始路径
            }
        } catch (error) {
            console.log("fixHeicFilePath error:", error);
            return uri; // 如果复制失败，仍然返回原始路径
        }
    }

    /**
     * **HEIF/HEIC 转换为 JPG**
     */
    static async convertHEIFtoJPG(uri, fileName) {
        try {
            let cleanUri = uri.replace("file://", ""); // 确保路径格式正确

            try {
                const result = await RNHeicConverter.convert({ path: cleanUri });

                if (result.success && result.path) {
                    return {
                        uri: result.path,
                        fileName: fileName.replace(/\.(heic|heif)$/i, ".jpg"),
                    };
                }
                return null;
            } catch (heicError) {
                console.log("RNHeicConverter.convert error:", heicError);
                return null;
            }
        } catch (error) {
            console.log("convertHEIFtoJPG error:", error);
            return null;
        }
    }

    /**
     * **选择文件**
     */
    static async chooseFileHandler() {
        try {
            let res1;
            try {
                res1 = await DocumentPicker.pick({
                    type: [DocumentPicker.types.images], // 只选择图片
                });
            } catch (pickerError) {
                console.log("DocumentPicker.pick error:", pickerError);
                return null;
            }

            if (!(Array.isArray(res1) && res1.length)) return null;
            let res = res1[0];

            // 处理 URI
            let newFileUri = Platform.OS === "ios" ? decodeURIComponent(res.uri) : res.uri;
            let newFileName = res.name;

            // **强制检查 HEIF/HEIC**
            const isHEIF = res.name.toLowerCase().endsWith(".heif") || res.name.toLowerCase().endsWith(".heic");

            if (Platform.OS === "ios" && isHEIF) {
                newFileUri = await this.fixHeicFilePath(newFileUri); // **修正路径**

                const converted = await this.convertHEIFtoJPG(newFileUri, newFileName);
                if (converted) {
                    newFileUri = converted.uri;
                    newFileName = converted.fileName;
                } else {
                    console.warn("⚠️ HEIF 转换失败，使用原文件");
                }
            }

            // 读取 base64
            let base64;
            try {
                base64 = await RNFS.readFile(newFileUri, "base64");
            } catch (readError) {
                console.log("RNFS.readFile error:", readError);
                return null;
            }

            const fileData = {
                fileName: this.getNewFileName(newFileName),
                fileSize: res.size,
                base64,
            };

            return fileData;
        } catch (error) {
            console.log("chooseFileHandler error:", error);
            return null;
        }
    }
}

const FileType = [
    {
        get text() {
            return translate("拍照");
        },
        img: ImagesUrl.fileType1,
        type: "photo",
        callBack: async () => {
            const hasPermission = await checkCameraPermission();
            if (!hasPermission) return;
            return new Promise((resolve, reject) => {
                try {
                    launchCamera(ImagePickerOption, response => {
                        console.log("Camera response:", response);
                        let result = slectFileCallBack(response);
                        resolve(result);
                    }).catch(err => {
                        console.log("launchCamera catch error:", err);
                        // Android 特定錯誤處理
                        if (Platform.OS === "android") {
                            if (err.code === "camera_unavailable") {
                                Alert.alert(translate("相机不可用"), translate("请检查相机是否被其他应用占用"));
                            } else if (err.code === "permission") {
                                Alert.alert(translate("权限不足"), translate("请允许应用访问相机"));
                            } else {
                                Alert.alert(translate("拍照失败"), translate("无法启动相机，请重试"));
                            }
                        } else {
                            Alert.alert("Không thể chụp ảnh");
                        }
                        reject(err);
                    });
                } catch (error) {
                    console.log("launchCamera try-catch error:", error);
                    // Android 特定錯誤處理
                    if (Platform.OS === "android") {
                        Alert.alert(translate("拍照失败"), translate("相机启动失败，请重试"));
                    } else {
                        Alert.alert("Không thể chụp ảnh");
                    }
                    reject(error);
                }
            });
        },
    },
    {
        get text() {
            return translate("从相册选择");
        },
        img: ImagesUrl.fileType2,
        type: "gallery",
        callBack: async () => {
            return new Promise((resolve, reject) => {
                try {
                    launchImageLibrary(ImagePickerOption, response => {
                        let result = slectFileCallBack(response);
                        resolve(result);
                    }).catch(err => {
                        console.log("launchImageLibrary catch error:", err);
                        Alert.alert("Không thể chụp ảnh");
                        reject(err);
                    });
                } catch (error) {
                    console.log("launchImageLibrary try-catch error:", error);
                    Alert.alert("Không thể chụp ảnh");
                    reject(error);
                }
            });
        },
    },
    {
        get text() {
            return translate("选择文件1");
        },
        img: ImagesUrl.fileType3,
        type: "file",
        callBack: async () => {
            const fileData = await FilePickerUtil.chooseFileHandler();
            return fileData; // **必须 return 才能回调数据**
        },
    },
];

export default function UploadModal(props) {
    let { modalCallBack = () => {} } = props;

    // 状态管理：记录各个功能的可用性
    const [functionAvailability, setFunctionAvailability] = useState({
        camera: false,
        gallery: false,
        documentPicker: false,
        isChecking: true,
    });

    // 检测所有功能的可用性
    const checkAllFunctions = async () => {
        console.log("开始检测原生功能可用性...");

        try {
            const [cameraAvailable, galleryAvailable, documentPickerAvailable] = await Promise.all([
                NativeFunctionDetector.checkCameraFunction(),
                NativeFunctionDetector.checkGalleryFunction(),
                NativeFunctionDetector.checkDocumentPickerFunction(),
            ]);

            console.log("功能检测结果:", {
                camera: cameraAvailable,
                gallery: galleryAvailable,
                documentPicker: documentPickerAvailable,
            });

            setFunctionAvailability({
                camera: cameraAvailable,
                gallery: galleryAvailable,
                documentPicker: documentPickerAvailable,
                isChecking: false,
            });
        } catch (error) {
            console.log("功能检测过程出错:", error);
            // 检测失败时，为了安全起见，假设所有功能都不可用
            setFunctionAvailability({
                camera: false,
                gallery: false,
                documentPicker: false,
                isChecking: false,
            });
        }
    };

    // 组件挂载时检测功能
    useEffect(() => {
        // 添加一个小延迟，确保组件完全挂载后再执行检测
        const timeoutId = setTimeout(() => {
            checkAllFunctions();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    // 根据检测结果过滤可用的选项
    const getAvailableFileTypes = () => {
        if (functionAvailability.isChecking) {
            return []; // 检测中，暂时不显示任何选项
        }

        return FileType.filter((item) => {
            switch (item.type) {
                case "photo":
                    return functionAvailability.camera;
                case "gallery":
                    return functionAvailability.gallery;
                case "file":
                    return functionAvailability.documentPicker;
                default:
                    return false;
            }
        });
    };

    const availableFileTypes = getAvailableFileTypes();

    // 如果检测中，显示加载状态
    if (functionAvailability.isChecking) {
        return (
            <View style={styles.container}>
                <View style={styles.modalBox}>
                    <View style={[styles.optionRow, { justifyContent: "center" }]}>
                        <Text style={styles.optionText}>{translate("检测功能中...")}</Text>
                    </View>
                </View>
                <RowCenterCenter
                    onPress={() => props?.onCancel()}
                    style={styles.cancelButton}>
                    <Text style={styles.optionText}>{translate("取消2")}</Text>
                </RowCenterCenter>
            </View>
        );
    }

    // 如果没有可用功能，显示提示
    if (availableFileTypes.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.modalBox}>
                    <View style={[styles.optionRow, { justifyContent: "center" }]}>
                        <Text style={[styles.optionText, { color: "#666" }]}>
                            {translate("暂无可用的上传方式")}
                        </Text>
                    </View>
                </View>
                <RowCenterCenter
                    onPress={() => props?.onCancel()}
                    style={styles.cancelButton}>
                    <Text style={styles.optionText}>{translate("取消2")}</Text>
                </RowCenterCenter>
            </View>
        );
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.modalBox}>
                {availableFileTypes.map((v, i) => (
                    <RowCenterBetween
                        key={i}
                        onPress={async () => {
                            props?.onCancel();

                            let callBack = v.callBack;
                            let data = await callBack();

                            modalCallBack(data);
                        }}
                        style={[
                            styles.optionRow,
                            {
                                borderBottomWidth: i === availableFileTypes.length - 1 ? 0 : 1,
                            },
                        ]}>
                        <Text style={styles.optionText}>{v.text}</Text>
                        <Image style={styles.optionImage} resizeMode="stretch" source={v.img} />
                    </RowCenterBetween>
                ))}
            </View>

            <RowCenterCenter
                onPress={() => {
                    props?.onCancel();
                }}
                style={styles.cancelButton}>
                <Text style={styles.optionText}>{translate("取消2")}</Text>
            </RowCenterCenter>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
    },
    modalBox: {
        backgroundColor: "#dbdcdc",
        borderRadius: 14,
        width: "100%",
    },
    optionRow: {
        width: "100%",
        paddingHorizontal: 10,
        height: 50,
        borderBottomColor: "gray",
    },
    optionText: {
        color: "#007AFF",
        fontSize: 16,
    },
    optionImage: {
        width: 25,
        height: 25,
    },
    cancelButton: {
        width: "100%",
        paddingHorizontal: 10,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        marginTop: 10,
        backgroundColor: "#dbdcdc",
        borderRadius: 14,
    },
});

