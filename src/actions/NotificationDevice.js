import { Clipboard, NativeEventEmitter, NativeModules, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import StorageUtil from "$Utils/Storage";
let isNativeEvent = false;
let mac = "";
const { Openinstall } = NativeModules;

export const NotificationDevice = (membercode = "") => {
    IosNotificationClick();
    DeviceInfo.getMacAddress &&
        DeviceInfo.getMacAddress().then(res => {
            mac = res || "";
        });
    setTimeout(() => {
        //延迟获取，防止拿不到
        GetDeviceToken();
    }, 5000);

    setTimeout(() => {
        if (window.Devicetoken == "") {
            return;
        }
        BindNotificationDevice(membercode);
        TagMemberSubscription(membercode);
    }, 6000);
};
const BindNotificationDevice = (membercode = "") => {
    let data = {
        Os: Platform.OS == "ios" ? "iOS" : "Android",
        OsVersionCode: (DeviceInfo.getVersion && DeviceInfo.getVersion()) || "",
        OsVersionNumber: (DeviceInfo.getSystemVersion && DeviceInfo.getSystemVersion()) || "",
        DeviceModel: (DeviceInfo.getModel && DeviceInfo.getModel()) || "",
        SerialNumber: "",
        DeviceManufacturer: Platform.OS == "ios" ? "iOS" : "Android",
        PushNotificationPlatform: Platform.OS == "ios" ? "itcxapi" : (window.DeviceLanguage == "CN" ? "jiguang" : "firebase"),
        DeviceToken: window.Devicetoken,
        Imei: "",
        MacAddress: mac,
        MemberCode: membercode,
        PackageName: DeviceInfo?.getBundleId?.() || "",
    };
    fetchRequest(ApiPort.BindNotificationDevice, "POST", data)
        .then(res => {})
        .catch(() => {});
};
const TagMemberSubscription = (membercode = "") => {
    if (!membercode) {
        return;
    }
    let data = {
        Topics: "",
        PushNotificationPlatform: Platform.OS == "ios" ? "itcxapi" : (window.DeviceLanguage == "CN" ? "jiguang" : "firebase"),
        DeviceToken: window.Devicetoken,
        PackageName: DeviceInfo?.getBundleId?.() || "",
        Imei: "",
        MacAddress: mac,
        MemberCode: membercode,
        SerialNumber: "",
        Os: Platform.OS == "ios" ? "iOS" : "Android",
    };
    fetchRequest(ApiPort.TagMemberSubscription, "PATCH", data)
        .then(res => {})
        .catch(error => {});
};
//缓存获取token
const GetDeviceToken = () => {
    StorageUtil.load("storageDeviceToken")
        .then(token => {
            if (token) {
                window.Devicetoken = token;
            } else {
                // 没有缓存token，从设备获取
                if (Platform.OS == "ios") {
                    Openinstall &&
                        Openinstall.getDevicetoken &&
                        Openinstall.getDevicetoken(token => {
                            if (token) {
                                SetDeviceToken(token);
                            }
                        });
                } else {
                    //Android使用极光或firebase拿token，会在window.Devicetoken中
                    SetDeviceToken(window.Devicetoken);
                }
            }
        });
};
//防止token重复，写入缓存
const SetDeviceToken = (token = "") => {
    if (!token) {
        return;
    }
    window.Devicetoken = token;
    StorageUtil.save({
        key: "storageDeviceToken",
        data: token,
    });
};

//ios监听推送点击
const IosNotificationClick = () => {
    if (isNativeEvent || Platform.OS == "android") {
        return;
    }
    isNativeEvent = true;

    try {
        const eventEmitter = new NativeEventEmitter(Openinstall);
        eventEmitter.addListener("NotificationClick", data => {
            console.log("Notification clicked:", data);
            // alert('onNotificationClick====>' + JSON.stringify(data))
            // if (data.push_type === 'amity') {

            // }
        });
    } catch (error) {
        console.log("Native Event Error");
    }
};
