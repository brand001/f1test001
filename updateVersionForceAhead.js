// updateVersionForceAhead.js, 提前判断api是否能使用
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URLSearchParams } = require('url');

// 1. 解析命令行第一个参数（用 & 连接）
const rawArgs = process.argv[2] || '';
const params = new URLSearchParams(rawArgs);

const token = params.get('token') || '';

if (!token) {
    console.error('❌ token platform 是必须的， 示例: \n "token=xxxxx"');
    process.exit(1);
}


// 2. 构造请求体
let payload = JSON.stringify({
    data: { apiTest: '123qwe' }
});

// 3. HTTPS 请求配置
const options = {
    hostname: 'strapi.fun88.biz',
    path: '/api/download-app-m1',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token.split('uud0823ndnd')[0]}`,
        'Content-Length': Buffer.byteLength(payload),
    }
};

// 4. 发起请求并处理错误（最多重试 3 次）
function sendRequest(retries) {
    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log('🎉✅ 测试成功，返回：\n', body);
            } else {
                console.log(`➡️ 调用 API失败，剩余重试次数：${retries - 1}`);
                console.error('⚠️ 请求失败');
                console.error(`   status: ${res.statusCode}`);
                console.error('   response:', body);
                if (retries > 1) {
                    sendRequest(retries - 1);
                } else {
                    console.error('❌ 已达到最大重试次数，停止调用');
                    process.exit(1);
                }
            }
        });
    });

    req.on('error', (err) => {
        console.log(`➡️ 调用 API失败，剩余重试次数：${retries - 1}`);
        console.error('❌ 请求出错：', err);
        if (retries > 1) {
            sendRequest(retries - 1);
        } else {
            console.error('❌ 已达到最大重试次数，停止调用');
            process.exit(1);
        }
    });

    req.write(payload);
    req.end();
}

// 启动第一次调用
sendRequest(3);
