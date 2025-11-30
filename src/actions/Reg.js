// 密码正则
// export const passwordReg = /(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])(?=[\^#$@]*)([a-zA-Z0-9]([\^#$@]*))+$/;
export const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\^\#\$\@]{6,20}$/;

// 新的密码正则 - 8-20字符，必须包含大小写字母和特殊字符（排除空格和句点）
export const newPasswordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])[^\s.]{8,20}$/;
//用户名正则
export const nameReg = /^[a-zA-Z0-9]{6,14}$/;

// 手机号正则
export const phoneReg = /^[1-9][0-9]{8,9}$/;

// 真实姓名正则
export const RealNameReg = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s']{2,50}$/u;

export const LineReg = /^[a-z\.\-_0-9]{4,}$/;

export const alphaNumericOnly = /[^a-zA-Z0-9]/g;

export const facebookReg = /^[A-Za-z\u0E00-\u0E7F0-9. ]{5,50}$/;
export const RealXingReg = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s']{2,50}$/u;
export const RealMingReg = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s']{1,50}$/u;
export const shippingAddress = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s+'0-9#'.,-/&()\s ]{5,100}$/;
export const WalletNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9 ]{0,20}$/;
export const nameTest = RealNameReg;
//銀行卡正則
export const bankTest = /^[0-9]{14,19}$/;

export const zipCodeReg = /[1-9][0-9]{5}/;

//表情
export const emojiReg = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
//特殊字符
export const scReg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;

// 邮箱正则
// export const emailReg =  /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
// export const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{1,}$/;
// export const email_reg = /^[A-Za-z0-9_]+(?:\.[a-zA-Z0-9_\.\-]){0,}@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// export const email_reg_2 = /^[^_.-].*[^/_.-]$/; // 不能以_.-開頭結尾
// export const email_reg_3 = /^[A-Za-z0-9_]+[a-zA-Z0-9_\.\-]{0,}@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const emailReg = /^[A-Za-z0-9][A-Za-z0-9._-]*@[A-Za-z0-9]+([-.][A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;

//身份证正则
export const IdentityCardReg = /^[1-9]\d{5}(19\d{2}|20[0-3]\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

export const QqReg = /^[1-9]\d{4,15}$/;

export const TelegramReg = /^[a-zA-Z0-9_]{5,32}$/;

// 代理码正则
export const affReg = /[^\w\.\/]/gi;

// 邮箱遮挡
export function maskEmail(email) {
    if (!email || !email.includes("@")) {
        return ""; // Fallback for invalid or empty email
    }
    const [localPart, domain] = email.split("@");
    const maskedLocal = `${localPart[0]}******${localPart.slice(-1)}`;
    const maskedDomain = `${domain[0]}******.com`;
    return `${maskedLocal}@${maskedDomain}`;
}

// 手机遮挡
export function maskPhone(phone) {
    const result = phone.slice(0, 3) + "****" + phone.slice(-4);
    return result;
}

// 手机遮挡只显示后4位数
export function maskPhone4(phone) {
    if (!phone) {
        return "";
    }
    const result = "******" + phone.slice(-4);
    return result;
}

export function getName(str) {
    let memberNameX = "";
    if (window.LANGUAGE == "CN") {
        return str.replace(/./g, "*");
    } else {
        if (str.indexOf(" ") != -1) {
            let Namesplit = str.split(" ");
            Namesplit.map((v, i) => {
                memberNameX = memberNameX + v.replace(/^(.).*(.)$/, "$1****") + " ";
            });
        } else {
            memberNameX = str.replace(/^(.).(.).*(.)$/, "$1***$2****");
        }
        return memberNameX;
    }
}



export const _ALLSHARED_recentPlayed_Slot = "_ALLSHARED_recentPlayed_Slot";
