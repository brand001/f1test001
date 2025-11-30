const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'FedevProject';
const BUILD_MODE = 'Debug';
const DERIVED_DATA = 'build';
const PROJECT_FILE = path.join(__dirname, 'ios', `${APP_NAME}.xcodeproj`, 'project.pbxproj');

// 获取 PRODUCT_NAME from project.pbxproj
function getProductNameFromXcodeproj() {
    const pbxContent = fs.readFileSync(PROJECT_FILE, 'utf8');
    const regex = /\bPRODUCT_NAME\s*=\s*(.+?);/g;
    const matches = [...pbxContent.matchAll(regex)];

    for (let match of matches) {
        const name = match[1].replace(/"/g, '').trim();

        // 只接受纯字母或数字组合
        if (/^[a-zA-Z0-9]+$/.test(name)) {
            return name;
        }
    }

    throw new Error(' Valid PRODUCT_NAME not found in project.pbxproj');
}

const PRODUCT_NAME = getProductNameFromXcodeproj();
const BUILD_PRODUCTS_DIR = path.join(
    __dirname,
    DERIVED_DATA,
    'Build',
    'Products',
    `${BUILD_MODE}-iphonesimulator`
);

const APP_PATH = path.join(BUILD_PRODUCTS_DIR, `${PRODUCT_NAME}.app`);
const ZIP_PATH = path.join(BUILD_PRODUCTS_DIR, `${PRODUCT_NAME}.zip`);
const JS_BUNDLE = path.join(__dirname, 'ios', 'main.jsbundle');
const ASSETS_PATH = path.join(__dirname, 'ios', 'assets');
const APP_ASSETS_PATH = path.join(APP_PATH, 'assets');

function run(cmd, label) {
    console.log(`\n ${label}...`);
    execSync(cmd, { stdio: 'inherit' });
}

function assertFile(filePath, desc) {
    if (!fs.existsSync(filePath)) {
        console.error(` Missing: ${desc} (${filePath})`);
        process.exit(1);
    }
}

function cleanBuildDir() {
    const dir = path.join(__dirname, DERIVED_DATA);
    if (fs.existsSync(dir)) {
        console.log(`\n Cleaning build directory: ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

try {
    cleanBuildDir();

    // Step 1: Bundle JS
    run(
        `npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios`,
        'Step 1: Bundling JS'
    );

    // Step 2: Build .app
    run(
        `xcodebuild -workspace ios/${APP_NAME}.xcworkspace -scheme ${APP_NAME} -configuration ${BUILD_MODE} -sdk iphonesimulator -derivedDataPath ${DERIVED_DATA} EXCLUDED_ARCHS=arm64`,
        `Step 2: Building .app (${BUILD_MODE})`
    );

    // Step 3: Copy JS Bundle
    assertFile(JS_BUNDLE, 'main.jsbundle');
    run(`cp "${JS_BUNDLE}" "${APP_PATH}/main.jsbundle"`, 'Step 3: Copying main.jsbundle into .app');

    // Step 4: Copy assets (if exists)
    if (fs.existsSync(ASSETS_PATH)) {
        run(`cp -R "${ASSETS_PATH}" "${APP_ASSETS_PATH}"`, 'Step 4: Copying assets into .app');
    } else {
        console.log('  No assets directory found. Skipping assets copy.');
    }

    // Step 5: Zip .app
    run(`cd "${BUILD_PRODUCTS_DIR}" && zip -r "${ZIP_PATH}" "${PRODUCT_NAME}.app"`, 'Step 5: Zipping .app');


    console.log(`---- Build Successful ----`);
} catch (err) {
    console.error(`\n Build failed: ${err.message}`);
    process.exit(1);
}
