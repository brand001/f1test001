const fs = require("fs");
const path = require("path");

const isDeleteMode = process.argv.includes("delete");

const IMG_EXTS = [".png", ".jpg", ".jpeg", ".gif"]; // 不包括 .svg
const CODE_EXTS = [".js", ".jsx", ".ts", ".tsx"];
const IGNORE_DIRS = ["central-payment"];

const walk = (dir, exts) => {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        const relative = path.relative("src", filePath).replace(/\\/g, "/");
        const isIgnored = IGNORE_DIRS.some(ignored => relative.startsWith(ignored));

        if (isIgnored) return;

        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath, exts));
        } else if (exts.includes(path.extname(file).toLowerCase())) {
            results.push(filePath);
        }
    });

    return results;
};

const imgFiles = walk("src", IMG_EXTS);
const codeFiles = walk("src", CODE_EXTS).map(file => fs.readFileSync(file, "utf8"));

const usedImages = new Set();

imgFiles.forEach(imgPath => {
    const relativePath = path.relative("src", imgPath).replace(/\\/g, "/").toLowerCase();
    const shortName = path.basename(relativePath).toLowerCase();

    const isUsed = codeFiles.some(code =>
        code.toLowerCase().includes(relativePath) || code.toLowerCase().includes(shortName)
    );

    if (isUsed) {
        usedImages.add(imgPath);
    }
});

const unused = imgFiles.filter(img => !usedImages.has(img));

console.log(isDeleteMode ? "🧹 正在删除未使用图片：" : "🔍 未使用的图片如下：");

unused.forEach(img => {
    console.log(isDeleteMode ? "❌ 删除：" : "❗", img);
    if (isDeleteMode) {
        try {
            fs.unlinkSync(img);
        } catch (err) {
            console.error("⚠️ 删除失败:", img, err);
        }
    }
});

console.log(isDeleteMode
    ? `✅ 已删除 ${unused.length} 张未使用图片`
    : `ℹ️ 共发现 ${unused.length} 张未使用图片（未删除）`
);
