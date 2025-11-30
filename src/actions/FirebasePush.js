import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import analytics from "@react-native-firebase/analytics";
import { Alert, Linking, PermissionsAndroid, Platform, View } from "react-native";
import PushNotification from "react-native-push-notification";
import { translate } from "@/locales/translate";

//后台或者退出app接收推送
try {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("后台接收的消息" + remoteMessage);
    });
} catch (error) {
    console.log("messaging().setBackgroundMessageHandler error:", error);
}
const FirebasePush = ({ init }) => {
    useEffect(() => {
        requestAndroidPermissions();
        requestUserPermission();

        try {
            PushNotification.createChannel(
                {
                    channelId: "default-channel-id", // 必须与本地通知一致
                    channelName: "Default Channel", // 通知频道名称
                    channelDescription: "A default channel for app notifications", // 描述
                    soundName: "default", // 声音
                    importance: 4, // 通知优先级
                    vibrate: true, // 是否震动
                },
                created => console.log(`Channel created: ${created}`),
            );
        } catch (error) {
            console.log("PushNotification.createChannel error:", error);
        }

        setTimeout(() => {
            messaging().subscribeToTopic(window.DeviceLanguage == 'TH' ? 'f1m2' : 'f1m3');
            getFcmToken();
            try {
                messaging().onMessage(async remoteMessage => {
                    console.log("remoteMessage", remoteMessage);
                    // alert(JSON.stringify(remoteMessage?.data));
                    // 显示本地通知
                    try {
                        PushNotification.localNotification({
                            channelId: "default-channel-id",
                            title: remoteMessage?.notification?.title || "",
                            message: remoteMessage?.notification?.body || "",
                            bigText: remoteMessage?.notification?.body || "", // 显示完整文本
                            data: remoteMessage?.data, // 可选，传递数据
                            playSound: true, // 是否播放声音
                            soundName: "default", // 声音名称
                            vibrate: true, // 震动
                            priority: "high", // 通知优先级
                        });
                    } catch (error) {
                        console.log("PushNotification.localNotification error:", error);
                    }
                });
            } catch (error) {
                console.log("messaging().onMessage error:", error);
            }
        }, 3000);
    }, [init]);

    const requestAndroidPermissions = async () => {
        try {
            // Android 13 及以上需要请求 POST_NOTIFICATIONS 权限
            if (Platform.OS === "android" && Platform.Version >= 33) {
                const permissions = [];
                permissions.push(PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATIONS);
                const granted = await PermissionsAndroid?.requestMultiple(permissions);
                let permissionNeverAskAgain = false;

                for (const permission in granted) {
                    if (granted[permission] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                        //用户之前拒绝，需要提示
                        permissionNeverAskAgain = true;
                    }
                }

                if (permissionNeverAskAgain) {
                    Alert.alert(
                        translate('请求接收通知权限'),
                        translate('接收通知所需权限被拒绝并设置为“不再询问”。请前往“设置”并手动启用它们'),
                        [
                            { text: translate('取消'), style: 'cancel' },
                            { text: translate('打开“设置”'), onPress: () => Linking.openSettings() },
                        ],
                    );
                }
            }
        } catch (err) {}
    };
    async function requestUserPermission() {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            console.log("enabled", enabled + "<<===>>" + authStatus);
            // alert(enabled + '<<===>>' + authStatus)
            if (enabled) {
                console.log("Authorization status:", authStatus);
            }
        } catch (error) {
            console.log("messaging().requestPermission error:", error);
        }
    }

    async function getFcmToken() {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            window.Devicetoken = token || "";
            console.log("token", token);
            // alert(token)
        } catch (error) {
            console.log("getFcmToken error:", error);
        }
    }

    return <View></View>;
};
export default FirebasePush;

