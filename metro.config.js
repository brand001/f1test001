/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    resolver: {
        extraNodeModules: {
            ...require("node-libs-react-native-buffer4"),
            "$SBCN": path.resolve(__dirname, "src/containers/SbSports/SbSportsCN"),
            "$SBVN": path.resolve(__dirname, "src/containers/SbSports/SbSportsVN"),
            "$Components": path.resolve(__dirname, "src/components"),
            "$Utils": path.resolve(__dirname, "src/lib/utils"),
            "@": path.resolve(__dirname, "src"),
            "@Context": path.resolve(__dirname, "src/contexts"),
            "$Toasts": path.resolve(__dirname, "src/components/Toasts"),
            "$locales": path.resolve(__dirname, "src/locales"),
            "$LIB": path.resolve(__dirname, "src/lib"),
            "$Hooks": path.resolve(__dirname, "src/hook"),
            "$ALLSHARED": path.resolve(__dirname, "shared/allshared"),
            "$ALLSHARED_CONSTANTS": path.resolve(__dirname, "shared/allshared/constants"),
            "$ALLSHARED_UTILS": path.resolve(__dirname, "shared/allshared/utils"),
            "$ALLSHARED_HELPERS": path.resolve(__dirname, "shared/allshared/helpers"),
            "$ALLSHARED_UI": path.resolve(__dirname, "shared/allshared/APP/components"),
            "$ALLSHARED_API": path.resolve(__dirname, "shared/allshared/api"),
            "$ALLSHARED_CONTEXTS": path.resolve(__dirname, "shared/allshared/contexts"),
            "$ALLSHARED_CONFIG": path.resolve(__dirname, "shared/allshared/DESK/config"),
            "$ALLSHARED_HOOKS": path.resolve(__dirname, "shared/allshared/hooks"),
            "$SHAREDCONFIG": path.resolve(__dirname, "sharedconfig"),
            "$SHARED": path.resolve(__dirname, "shared/f1shared"),
            "$SHARED_CONSTANTS": path.resolve(__dirname, "shared/f1shared/constants"),
            "$SHARED_UTILS": path.resolve(__dirname, "shared/f1shared/utils"),
            "$SHARED_HELPERS": path.resolve(__dirname, "shared/f1shared/helpers"),
        },
    },
};
