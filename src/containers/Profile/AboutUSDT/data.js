import ImageMap from "@/locales/Images";
import { translate } from "@/locales/translate";
import React from "react";
import { Dimensions } from "react-native";
import { ImagesUrl } from "@/images/index";

const { width, height } = Dimensions.get("window");
import { Usdt7Icon, Usdt8Icon, Usdt9Icon } from "@/components/icons/index";

export const FaqDataTHVN = [
    {
        get text() {
            return translate("FUN88 在某些情况下需要进行 KYC 检查以遵守反洗钱法。");
        }
    },
    {
        get text() {
            return translate("不要将所有资金存入加密货币，并以法定货币提取所有资金。");
        }
    },
    {
        get text() {
            return translate("FUN88 对任何资金损失不负任何责任。如果您使用了无效的钱包地址或无效的网络地址，请在进行USDT交易之前进行检查。");
        }
    },
];

export const FaqDataCN = [
    {
        id: "8479",
        title: "什么是加密货币？",
        body: "<div class=\"usdtApiFaq\"><p>加密货币是一种使用区块链技术，来确保交易安全及快速稳定地转移资金，而创建发行的加密货币。</p></div>",
    },
    {
        id: "8480",
        title: "什么是泰达币?",
        body: "<div class=\"usdtApiFaq\"><p>USDT是一种将加密货币与法定货币美元挂钩的虚拟货币，以开放的区块链为底层技术，具有安全性和透明度，由 Tether 公司推出，Tether 将现金转换为数字货币，锚定于美元、欧元和日元等国家法币的价格，因此定价相对稳定。目前FUN88乐天堂支持TRC20以及ER20协议。</p></div>",
    },
    {
        id: "8575",
        title: "如何购买加密/虚拟货币？",
        body: "<div class=\"usdtApiFaq\"><style>.usdtApiFaq a{color:#1c8eff!important}</style><p>乐天使推荐以下第三方平台，可到其网站或APP开户购买加密/虚拟货币哦。更多第三平台的操作详情可以直接到以下的第三方平台官网查询。</p><p>虎符: <a href=\"https://hoo.com/\" target=\"_blank\">https://hoo.com/</a></p><p>币赢: <a href=\"https://www.coinwcn.com/\" target=\"_blank\">https://www.coinwcn.com/</a></p><p>币汇: <a href=\"https://www.coinhui.net/\" target=\"_blank\">https://www.coinhui.net/</a></p><p>&nbsp;</p><p>&nbsp;</p></div>",
    },
    {
        id: "8810",
        title: "为什么使用加密货币？",
        body: "<div class=\"usdtApiFaq\"><p>点对点支付，无需经过银行等任何中间机构，钱直接给对方，大大降低了交易费率。<br />加密货币安全性高，能够保障客户资金隐私。<br />大额单笔转账，额度无上限，到账迅速。<br />24小时随时交易，可以随意和外汇资金兑换.</p></div>",
    },
    {
        id: "8811",
        title: "加密货币的汇率是固定的吗？",
        body: "<div class=\"usdtApiFaq\"><p>加密货币兑换汇率是按照实时汇率随时变动。</p></div>",
    },
    {
        id: "8818",
        title: "转账后订单迟迟未显示成功怎么办？",
        body: "<div class=\"usdtApiFaq\"><p>加密货币转账需要区块全部确认，才会判定转账成功。您可以先查看钱包的转账详情页面是否已显示转账完成，<br />若未完成，请耐心等待；<br />若已完成，系统在检测到打币后会及时响应并更改订单状态。<br />若已完成，网站还未到账金额，请联系在线客服提供相应转账凭证寻求协助。</p></div>",
    },
    {
        id: "8819",
        title: "支付成功了，订单显示失败怎么处理？",
        body: "<div class=\"usdtApiFaq\"><p>产生这种情况的原因是：1、支付金额不对 2、订单超时 3、币价突然波动过大，系统停止处理。请联系平台或在线客服进行处理。</p></div>",
    },
    {
        id: "8820",
        title: "加密货币交易是否会产生手续费用？",
        body: "<div class=\"usdtApiFaq\"><p>部分平台会产生交易费用，供应商页面将显示交易金额+手续费，您在转账时请输入总金额即可。</p></div>",
    },
];

export const Advantage = [
    {
        get title() {
            return translate("匿名买卖");
        },
        get icon() {
            return ImageMap.anonymous;
        }
    },
    {
        get title() {
            return translate("24小时");
        },
        get icon() {
            return ImageMap.hoursAll;
        }
    },
    {
        get title() {
            return translate("价格稳定");
        },
        get icon() {
            return ImageMap.price;
        }
    },
    {
        get title() {
            return translate("快速到账");
        },
        get icon() {
            return ImageMap.speedUp;
        }
    },
    {
        get title() {
            return translate("不受银行监管");
        },
        get icon() {
            return ImageMap.supervision;
        }
    },
    {
        get title() {
            return translate("额度无上限");
        },
        get icon() {
            return ImageMap.quota;
        }
    },
];


export const UsdtInfor = [
    {
        get title() {
            return translate("极速虚拟币");
        },
        get text() {
            return [
                translate("以实时兑换率来进行交易"),
                translate("您的专属存款二维码和钱包地址， 可储存于第三方平台重复使用"),
                translate("您无需浏览乐天堂的泰达币存款页面， 亦能直接从第三方平台直接进行存款"),
                translate("您的交易单号会在您的泰达币入账后才产生"),
                translate("您可以随时随地进行存款"),
            ];
        },
    },
    {
        get title() {
            return translate("虚拟币支付");
        },
        get text() {
            return [
                translate("以锁定的交易时间内的兑换率来进行交易"),
                translate("每次您提交存款交易请求时， 所产生的二维码和收款地址仅限一次使用"),
                translate("您需要浏览乐天堂的泰达币 存款页面才能进行存款"),
                translate("一旦完成提交存款后， 您即可获得交易单号"),
                translate("您必须在交易限定的时间内完成存款"),
            ];
        },
    },
];
export const Prompt = [
    {
        get title() {
            return translate("安全有保障");
        },
        get description() {
            return translate("与银行卡等传统支付方式相比，玩家不需要给出自己的姓名或卡号即可完成加密货币交易，避免了敏感信息泄漏。");
        },
        icon: Usdt7Icon,
    },
    {
        get title() {
            return translate("交易速度快");
        },
        get description() {
            return translate("加密货币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间将被缩短。");
        },
        icon: Usdt8Icon,
    },
    {
        get title() {
            return translate("高度匿名性");
        },
        get description() {
            return translate("不由央行或当局发行，不受银行监管，玩家可以随心所欲地使用存放在自己加密钱包里的资金。");
        },
        icon: Usdt9Icon,
    },
];
//https://www.figma.com/design/3oV3NkT2Yyertopt0AFb4E/%E2%9E%A1%EF%B8%8F--F1M2--Requirement-File-01?node-id=5878-17857&t=mQt46hZBsnvlqzMD-0
export const tableHeader = ["三种USDT", "OMNI", "ERC20协议", "TRC20协议"];
// https://www.figma.com/design/zGkDC6N5XjSmScF7YGcYH7/%E2%9E%A1%EF%B8%8F--F1M3--Requirement-File-01?node-id=2248-8122&t=9tCwdN8N8hLZHX93-0
export const GuideTHVN = {
    Deposit: {
        get titile() {
            return translate("泰达币存款教程");
        },
        content: [
            {
                get title() {
                    return translate("快速付款");
                },
                get content() {
                    return [
                        {
                            imgs: window.LANGUAGE == "VN" ? "https://cache.f6838.com/video/M3-Deposit-Payment1.mp4" : "https://cache.f6838.com/video/M2-Deposit-Payment1.mp4",
                        },
                    ];
                }
            },
            {
                get title() {
                    return translate("定期付款");
                },
                get content() {
                    return [
                        {
                            imgs: window.LANGUAGE == "VN" ? "https://cache.f6838.com/video/M3-Deposit-Payment2.mp4" : "https://cache.f6838.com/video/M2-Deposit-Payment2.mp4",
                        },
                    ];
                }
            },
        ],
        tabWidth: width / 2,
    },
    Withdrawal: {
        get titile() {
            return translate("泰达币提款教程");
        },
        content: [
            {
                title: "如何添加钱包地址？",
                get content() {
                    return [
                        {
                            imgs: window.LANGUAGE == "VN" ? "https://cache.f6838.com/video/M3-Withdraw-Update.mp4" : "https://cache.f6838.com/video/M2-Withdraw.mp4",
                        }
                    ];
                }
            }
        ],
        tabWidth: width
    }
};

export const GuideCN = {
    Deposit: {
        get titile() {
            return translate("泰达币存款教程");
        },
        content: [
            {
                title: "极速虚拟币\n支付",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTChannelStep1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTChannelStep2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTChannelStep3,
                    }
                ]
            },
            {
                title: "虚拟币\n支付1",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTInvoiceStep1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTInvoiceStep2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTInvoiceStep3,
                    },
                ]
            },
            {
                title: "虚拟币\n支付2",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTOtc1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOtc2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOtc3,
                    },
                ]
            },
            {
                title: "币赢\n交易所",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW3,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW4,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW5,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW6,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW7,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW8,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTCoinW9,
                    },
                ]
            },
            {
                title: "火币\n交易所",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi3,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi4,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi5,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi6,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi7,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTHuobi8,
                    },
                ]
            },
            {
                title: "OKX\n交易所",
                content: [
                    {
                        imgs: ImagesUrl.aboutUSDTOKX1,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOKX2,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOKX3,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOKX4,
                    },
                    {
                        imgs: ImagesUrl.aboutUSDTOKX5,
                    },
                ]
            },
            {
                title: "币安\n交易所",
                content:
                    [
                        {
                            imgs: ImagesUrl.aboutUSDTBinance1,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTBinance2,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTBinance3,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTBinance4,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTBinance5,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTBinance6,
                        },
                    ]
            }
        ],
        tabWidth: 100,
    },
    Withdrawal: {
        get titile() {
            return translate("泰达币提款教程");
        },
        content: [
            {
                title: "如何提款泰达币?",
                content:
                    [
                        {
                            imgs: ImagesUrl.aboutUSDTCCWGuideImg6,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTCCWGuideImg5,
                        },
                    ]
            },
            {
                title: "如何添加钱包地址？",
                content:
                    [
                        {
                            imgs: ImagesUrl.aboutUSDTCCWGuideImg3,
                        },
                        {
                            imgs: ImagesUrl.aboutUSDTCCWGuideImg4,
                        },
                    ]
            }
        ],
        tabWidth: width / 2
    }

};

export const TableData = [
    {
        type: `地址样式${"\n"}（谨防充错）`,
        first: "数字1或3开头,例如183hmJGRu",
        second: "数字0或小写x开头，例如 0xbd7e4b",
        third: "大写字母T开头，例如： T9zp14nm",
    },
    {
        type: "使用情况",
        first: "比特币网络",
        second: "以太坊网络",
        third: "波场网络",
    },
    {
        type: "网络拥堵情况",
        first: "偶尔拥堵",
        second: "经常拥堵",
        third: "基本不拥堵",
    },
    {
        type: "日常转账速度",
        first: "慢 (0.6-2小时 不等）",
        second: "中等 （几分钟到十几分钟不等）",
        third: "快 （几秒钟到几 分钟不等）",
    },
    {
        type: "手续费",
        first: "最高 转账手续费和BTC一致，平台提现一般收2-20USDT不等",
        second: "一般 钱包转账手续费与ETH一致，平台提现一般收1-5USDT 不等",
        third: "无 钱包转账0手续费，平台提现时有可能收取少量手续费",
    },
    {
        type: "安全性",
        first: "最高",
        second: "高",
        third: "低于前两者"
    },
    {
        type: "使用建议",
        first: "大额低频走比特币网络",
        second: "中等额度走 ETC网络",
        third: "小额高频走 波场网络",
    },
];

// ERC-20 vs TRC-20 比较表格数据（用于非 CN 语言）
export const comparisonTableHeader = [
    {
        get text() {
            return translate("Network");
        }
    },
    "ERC-20",
    "TRC-20"
];

export const comparisonTableData = [
    {
        get type() {
            return translate("รูปแบบที่อยู่กระเป๋าเงิน");
        },
        get erc20() {
            return translate("เริ่มต้นด้วย \"0x\" (เช่น 0xbd7e4b)");
        },
        get trc20() {
            return translate("เริ่มต้นด้วย \"T\" (เช่น T9zp14nm)");
        }
    },
    {
        get type() {
            return translate("ความปลอดภัย");
        },
        get erc20() {
            return translate("สูง");
        },
        get trc20() {
            return translate("ปานกลาง");
        }
    },
    {
        get type() {
            return translate("ค่าธรรมเนียมธุรกรรม");
        },
        get erc20() {
            return translate("สูง");
        },
        get trc20() {
            return translate("ต่ำ");
        }
    },
];
