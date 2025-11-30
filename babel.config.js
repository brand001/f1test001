const plugins = [
    "@babel/plugin-proposal-optional-chaining",
    [
        "module-resolver",
        {
            root: ["./"],
            extensions: [".js"],
            alias: {
                $Deposits: "central-payment/Deposit/M2",
                $DepositsM3: "central-payment/Deposit/M3",

                $CentralPayment: "central-payment",

                $StyleSheets: "central-payment/StyleSheet/App/M2/F1",
                $StyleSheetsM3: "central-payment/StyleSheet/App/M3/F1",

                $Components: "./src/components",
                $Utils: "./src/lib/utils",
                $Rreducers: "./src/reducers",
                $LIB: "./src/lib",
                $SBCN: "./src/containers/SbSportsCN",
                $SBVN: "./src/containers/SbSportsVN",
                "@": "./src",
                "@Context": "./src/contexts",
                $Toasts: "./src/components/Toasts",
                $locales: "./src/locales",
                $Hooks: "./src/hook",

                "@shared": "./node_modules/central-payment-m1/shared",
                "@images": "./node_modules/central-payment-m1/shared/assets/images",


                "@shared23": "./node_modules/central-payment-m23/shared",
                "@images23": "./node_modules/central-payment-m23/shared/assets/images",

                "$ALLSHARED": "./shared/allshared",
                "$ALLSHARED_CONSTANTS": "./shared/allshared/constants",
                "$ALLSHARED_UTILS": "./shared/allshared/utils",
                "$ALLSHARED_HELPERS": "./shared/allshared/helpers",
                "$ALLSHARED_UI": "./shared/allshared/APP/components",
                "$ALLSHARED_API": "./shared/allshared/api",
                "$ALLSHARED_CONTEXTS": "./shared/allshared/contexts",
                "$ALLSHARED_CONFIG": "./shared/allshared/DESK/config",
                "$ALLSHARED_HOOKS": "./shared/allshared/hooks",
                "$SHAREDCONFIG": "./sharedconfig",

                "$SHARED": "./shared/f1shared",
                "$SHARED_CONSTANTS": "./shared/f1shared/constants",
                "$SHARED_UTILS": "./shared/f1shared/utils",
                "$SHARED_HELPERS": "./shared/f1shared/helpers",
            },
        },
    ],
    "react-native-reanimated/plugin",
];
if (process.env.NODE_ENV === "production") {
    plugins.push("transform-remove-console");
}

module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins,
};
