/**
 * @format
 */

// import 'node-libs-react-native-buffer4/globals';
import { AppRegistry } from "react-native";

if (typeof global !== 'undefined') {
    global.isRNApp = true;
}
if (typeof window !== 'undefined') {
    window.isRNApp = true;
}

import { name as appName } from "./app.json";
import App from "./src/App";

AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;
