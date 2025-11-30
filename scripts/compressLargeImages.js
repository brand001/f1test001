const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const chalk = require("chalk");

// 支持的图片格式
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

// 大小阈值 (500KB)
const SIZE_THRESHOLD = 500 * 1024;

// 忽略的目录
const IGNORED_DIRS = ["node_modules", "build", "dist", ".git"];

// 压缩配置
const COMPRESSION_CONFIG = {
    jpeg: { quality: 80, mozjpeg: true },
    png: { quality: 80, compressionLevel: 9 },
    webp: { quality: 80 }
};

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// 查找大图片
async function findLargeImages(dir) {
    const largeImages = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (IGNORED_DIRS.some(ignored => filePath.includes(ignored))) {
            continue;
        }

        if (stat.isDirectory()) {
            const subResults = await findLargeImages(filePath);
            largeImages.push(...subResults);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext) && stat.size > SIZE_THRESHOLD) {
                let dimensions;
                try {
                    dimensions = await sharp(filePath).metadata();
                } catch (err) {
                    dimensions = { width: "N/A", height: "N/A" };
                }

                largeImages.push({
                    path: filePath,
                    size: stat.size,
                    dimensions
                });
            }
        }
    }

    return largeImages;
}

// 压缩图片
async function compressImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    try {
        // 创建备份文件
        const backupPath = filePath + ".backup";
        fs.copyFileSync(filePath, backupPath);

        let sharpInstance = sharp(filePath);
        const metadata = await sharpInstance.metadata();

        // 根据文件类型选择压缩方法
        switch (ext) {
            case ".jpg":
            case ".jpeg":
                sharpInstance = sharpInstance.jpeg(COMPRESSION_CONFIG.jpeg);
                break;
            case ".png":
                sharpInstance = sharpInstance.png(COMPRESSION_CONFIG.png);
                break;
            case ".webp":
                sharpInstance = sharpInstance.webp(COMPRESSION_CONFIG.webp);
                break;
        }

        // 如果图片尺寸特别大，考虑调整大小
        if (metadata.width > 2000 || metadata.height > 2000) {
            sharpInstance = sharpInstance.resize(2000, 2000, {
                fit: "inside",
                withoutEnlargement: true
            });
        }

        // 压缩并保存
        await sharpInstance.toBuffer().then(data => {
            fs.writeFileSync(filePath, data);
        });

        const newStats = fs.statSync(filePath);
        const newSize = newStats.size;
        const savedSize = originalSize - newSize;
        const savedPercentage = ((savedSize / originalSize) * 100).toFixed(2);

        // 删除备份文件
        fs.unlinkSync(backupPath);

        return {
            path: filePath,
            originalSize,
            newSize,
            savedSize,
            savedPercentage
        };
    } catch (error) {
        console.error(chalk.red(`压缩失败 ${filePath}:`), error);
        // 发生错误时恢复备份
        const backupPath = filePath + ".backup";
        if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, filePath);
            fs.unlinkSync(backupPath);
        }
        return null;
    }
}

async function main() {
    console.log(chalk.bold("\n🔍 扫描大于1MB的图片...\n"));

    const largeImages = await findLargeImages(process.cwd());

    if (largeImages.length === 0) {
        console.log(chalk.green("✨ 没有发现大于1MB的图片！"));
        return;
    }

    console.log(chalk.yellow.bold(`\n发现 ${largeImages.length} 个大图片：\n`));

    largeImages.sort((a, b) => b.size - a.size).forEach((image, index) => {
        console.log(chalk.yellow(`${index + 1}. ${image.path}`));
        console.log(chalk.gray(`   大小: ${formatSize(image.size)}`));
        console.log(chalk.gray(`   尺寸: ${image.dimensions.width}x${image.dimensions.height}`));
        console.log("");
    });

    console.log(chalk.bold("\n🔨 开始压缩图片...\n"));

    const results = [];
    for (const image of largeImages) {
        const result = await compressImage(image.path);
        if (result) {
            results.push(result);
        }
    }

    if (results.length > 0) {
        console.log(chalk.green.bold(`\n✅ 成功压缩 ${results.length} 个图片：\n`));

        let totalSaved = 0;
        results.forEach((result, index) => {
            totalSaved += result.savedSize;
            console.log(chalk.yellow(`${index + 1}. ${result.path}`));
            console.log(chalk.gray(`   压缩前: ${formatSize(result.originalSize)}`));
            console.log(chalk.gray(`   压缩后: ${formatSize(result.newSize)}`));
            console.log(chalk.gray(`   节省:   ${formatSize(result.savedSize)} (${result.savedPercentage}%)`));
            console.log("");
        });

        console.log(chalk.green.bold(`总共节省空间: ${formatSize(totalSaved)}`));
    }
}

main().catch(error => {
    console.error(chalk.red("Error:"), error);
    process.exit(1);
}); 