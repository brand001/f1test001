export function timeout_fetch(fetch_promise, timeout = 30000, message = "网络请求超时，请检查网络连接后重试") {
    let timeout_fn = null;

    const timeout_promise = new Promise((_, reject) => {
        timeout_fn = () => reject(message);
    });

    const abortable_promise = Promise.race([fetch_promise, timeout_promise]);

    setTimeout(timeout_fn, timeout);

    return abortable_promise;
}
