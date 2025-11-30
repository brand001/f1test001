module.exports = {
    dependencies: {
        "react-native-vision-camera": {
            platforms: {
                android: null, // 禁用Android，版本不兼容错误
            },
        },
        "@react-native-community/push-notification-ios": {
            platforms: {
                android: null,
            },
        },
        "react-native-push-notification": {
            platforms: {
                ios: null,
            },
        },
        'jcore-react-native': {
            platforms: {
                ios: null,
            },
        },
        'jpush-react-native': {
            platforms: {
                ios: null,
            },
        },
        '@react-native-firebase/analytics': {
            platforms: {
                ios: null,
            },
        },
    },
    assets: ['./assets/fonts/'],
};
