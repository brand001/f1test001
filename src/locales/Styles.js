import cnStyles from "./styles/cn";
import thStyles from "./styles/th";
import vnStyles from "./styles/vn";

const styles = { CN: cnStyles, TH: thStyles, VN: vnStyles };

const styleMap = new Proxy(
    {},
    {
        get(target, prop) {
            return (styles[window.LANGUAGE] || cnStyles)?.[prop] || {};
        },
    },
);

export default styleMap;
