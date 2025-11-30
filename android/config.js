//线上数据
const LiveConfig = {
    "CodePushKeyIOS": "dOpBmqieaJEw3pOGkCAEGORfHQyE4ksvOXqog",
    "CodePushKeyAndroid": "OwFaj8xcOf9rGIV2ji4w6tzi3YBD4ksvOXqog",
    "App": "LIVE"
}
window.AppForceUpdate = true

//要和codepush的appName對上，用來防止推錯，只有LIVE代碼需要配置
window.CodePushAppNameIOS = "F1M1-P5-ios";
window.CodePushAppNameAndroid = "F1-M1-P5-android";

export default LiveConfig;

export const lives = () => {
    window.isStaging = 'LIVE'
}