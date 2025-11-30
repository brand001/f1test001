// utils/MathUtils.js
import { NativeModules, Platform, PermissionsAndroid, Alert, Linking, Clipboard } from "react-native";
import JPush from "jpush-react-native";


class JPushConfig {
    static async init() { // 初始化
        try {
            // JPush.init({
            //     appKey: 'c2646ed14b46db9823a18331',  // android and ios 記得要去原生修改
            //     channel:"app",
            //     production: true, // 生產
            // });
            JPush.init();
        } catch (error) {
            console.log("JPush.init error:", error);
        }

        // 请求 Android 权限
        if (Platform.OS === "android") {
            await this.requestAndroidPermissions();
        }

        // iOS 清除应用启动时的 badge 数字
        if (Platform.OS === "ios") {
            try {
                JPush.setBadge({ badge: 0, appBadge: 0 });
            } catch (error) {
                console.log("JPush.setBadge error:", error);
            }
        }

        //连接状态
        this.connectListener = result => {
            console.log("connectListener:" + JSON.stringify(result));
        };
        try {
            JPush.addConnectEventListener(this.connectListener);
        } catch (error) {
            console.log("JPush.addConnectEventListener error:", error);
        }

        //通知回调
        this.notificationListener = result => {
            console.log("notificationListener:" + JSON.stringify(result));
            // alert(JSON.stringify(result))
        };
        try {
            JPush.addNotificationListener(this.notificationListener);
        } catch (error) {
            console.log("JPush.addNotificationListener error:", error);
        }

        //本地通知回调
        this.localNotificationListener = result => {
            console.log("localNotificationListener:" + JSON.stringify(result));
        };
        try {
            JPush.addLocalNotificationListener(this.localNotificationListener);
        } catch (error) {
            console.log("JPush.addLocalNotificationListener error:", error);
        }

        //自定义消息回调
        this.customMessageListener = result => {
            console.log("customMessageListener:" + JSON.stringify(result));
        };
        try {
            JPush.addCustomMessageListener(this.customMessageListener);
        } catch (error) {
            console.log("JPush.addCustomMessageListener error:", error);
        }

        //应用内消息回调
        try {
            JPush.pageEnterTo("HomePage"); // 进入首页，当页面退出时请调用 JPush.pageLeave('HomePage')
        } catch (error) {
            console.log("JPush.pageEnterTo error:", error);
        }

        this.inappMessageListener = result => {
            console.log("inappMessageListener:" + JSON.stringify(result));
            // alert(JSON.stringify(result))
        };
        try {
            JPush.addInappMessageListener(this.inappMessageListener);
        } catch (error) {
            console.log("JPush.addInappMessageListener error:", error);
        }

        //tag alias事件回调
        this.tagAliasListener = result => {
            console.log("tagAliasListener:" + JSON.stringify(result));
        };
        try {
            JPush.addTagAliasListener(this.tagAliasListener);
        } catch (error) {
            console.log("JPush.addTagAliasListener error:", error);
        }

        //手机号码事件回调
        this.mobileNumberListener = result => {
            console.log("mobileNumberListener:" + JSON.stringify(result));
        };
        try {
            JPush.addMobileNumberListener(this.mobileNumberListener);
        } catch (error) {
            console.log("JPush.addMobileNumberListener error:", error);
        }

        try {
            JPush.setLoggerEnable(true);
        } catch (error) {
            console.log("JPush.setLoggerEnable error:", error);
        }

        // 根据平台获取 deviceToken 或 Registration ID
        if (Platform.OS === "ios") {
            // iOS 上获取 APNs 的 deviceToken
            try {
                JPush.getRegistrationID((id) => {
                    console.log("iOS Device Token (Registration ID): ", JSON.stringify(id));
                    // alert(`iOS Device Token (Registration ID): ${JSON.stringify(id)}`)
                    if (typeof id === "object" && id?.registerID) {
                        window.Devicetoken = id?.registerID;
                    }
                });
            } catch (error) {
                console.log("JPush.getRegistrationID (iOS) error:", error);
            }
        } else {
            // Android 上获取 Registration ID
            try {
                JPush.getRegistrationID((id) => {
                    console.log("Android Device Token (Registration ID): ", JSON.stringify(id));
                    // alert(`Android Device Token (Registration ID): ${JSON.stringify(id)}`)
                    if (typeof id === "object" && id?.registerID) {
                        window.Devicetoken = id?.registerID;
                    }
                });
            } catch (error) {
                console.log("JPush.getRegistrationID (Android) error:", error);
            }
        }
    }

    // 请求 Android 权限
    static requestAndroidPermissions = async() => {
        try {
            const permissions = [
                // PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ];

            // Android 13 及以上需要请求 POST_NOTIFICATIONS 权限
            if (Platform.OS === "android" && Platform.Version >= 33) {
                permissions.push(PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS);
            }

            const granted = await PermissionsAndroid?.requestMultiple(permissions);
            console.log("granted", granted);

            const deniedPermissions = [];
            let permissionNeverAskAgain = false;

            // 检查每个权限的结果
            for (const permission in granted) {
                if (granted[permission] === PermissionsAndroid.RESULTS.DENIED) {
                    deniedPermissions.push(permission);
                } else if (granted[permission] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    permissionNeverAskAgain = true;
                    console.log(`Permission ${permission} is set to "never ask again"`);
                }
            }

            if (permissionNeverAskAgain) {
                Alert.alert(
                    "请求接收通知权限",
                    "接收通知所需权限被拒绝并设置为\"不再询问\"。请前往\"设置\"并手动启用它们",
                    [
                        { text: "取消", style: "cancel" },
                        { text: "打开\"设置\"", onPress: () => Linking.openSettings() },
                    ],
                );
            } else if (deniedPermissions.length > 0) {
                // Alert.alert('Permissions Denied', 'Some permissions were denied. The app may not function correctly.');
            } else {
                console.log("All requested permissions granted");
            }

        } catch (err) {
            console.warn("Permission request error:", err);
        }
    };

    static jpushOnOff = (lang) => {
        try {
            if (lang == "CN") {
                JPush.resumePush();
            } else {
                JPush.stopPush();
            }
        } catch (error) {
            console.log("JPush.jpushOnOff error:", error);
        }
    };
}

// Export the class
export default JPushConfig;
window.JPushConfig = JPushConfig;
