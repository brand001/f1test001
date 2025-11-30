const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'package-lock.json');

// 需要处理的目标包
const targetPackages = [
    '@amityco/react-native-cli-chat-ui-kit',
    '@gpsgate/react-native-eventsource',
    'central-payment-m1',
    'central-payment',
    'central-payment-m23',
    'central-kyc-sumsub',
];

/**
 * 递归处理 dependencies 节点
 */
function removeIntegrity(obj, keyPath = '') {
    if (!obj || typeof obj !== 'object') return;

    const shouldMatch =
        (obj.name && targetPackages.includes(obj.name)) ||
        targetPackages.includes(keyPath) ||
        (obj.resolved &&
            typeof obj.resolved === 'string' &&
            targetPackages.some(tp => obj.resolved.includes(tp)));

    if (shouldMatch && obj.integrity) {
        delete obj.integrity;
        console.log(`Removed integrity from ${keyPath || obj.name}`);
    }

    if (obj.dependencies && typeof obj.dependencies === 'object') {
        for (const [key, value] of Object.entries(obj.dependencies)) {
            removeIntegrity(value, key);
        }
    }
}

/**
 * 处理 packages 节点
 */
function cleanPackages(packages) {
    for (const [pkgPath, pkgData] of Object.entries(packages)) {
        if (!pkgData || typeof pkgData !== 'object') continue;

        const shouldMatch =
            (pkgData.name && targetPackages.includes(pkgData.name)) ||
            targetPackages.some(tp => pkgPath.includes(tp)) ||
            (pkgData.resolved &&
                typeof pkgData.resolved === 'string' &&
                targetPackages.some(tp => pkgData.resolved.includes(tp)));

        if (shouldMatch && pkgData.integrity) {
            delete pkgData.integrity;
            console.log(`Removed integrity from packages["${pkgPath}"]`);
        }
    }
}

/**
 * 主入口
 */
function main() {
    if (!fs.existsSync(filePath)) {
        console.error('❌ package-lock.json 文件不存在');
        process.exit(1);
    }

    let json;
    try {
        json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
        console.error('❌ package-lock.json 解析失败:', err);
        process.exit(1);
    }

    // 处理 dependencies
    if (json.dependencies) {
        for (const [depName, depValue] of Object.entries(json.dependencies)) {
            removeIntegrity(depValue, depName);
        }
    } else {
        removeIntegrity(json);
    }

    // 处理 packages
    if (json.packages && typeof json.packages === 'object') {
        cleanPackages(json.packages);
    }

    // 保存文件
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log('✅ package-lock.json 已更新，integrity 字段已删除（如果存在）');
}

main();
