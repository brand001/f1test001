import Config, { lives } from './android/config';

window.CodePushKeyIOS = Config.CodePushKeyIOS;
window.CodePushKeyAndroid = Config.CodePushKeyAndroid;


if (Config.App === 'ST' || __DEV__ === true) {
    //测试环境
    window.isStaging = "ST";
    // window.CodePushAppNameIOS = "f1m3-st-ios";
    // window.CodePushAppNameAndroid = "f1m3-st-android";
    // window.CodePushKeyIOS = 'kglJy8YixzJo1soveyCM8etK82sY4ksvOXqst';
    // window.CodePushKeyAndroid = '2MhaJSLJUP2euCRPiHoiO4THBzvO4ksvOXqst';
    // lives()
} else {
    lives();
}



