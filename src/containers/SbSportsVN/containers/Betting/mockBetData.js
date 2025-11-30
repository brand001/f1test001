const handicapData = [
    [
        {
            oddType: "0",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "win",
            fluxType: "",
            content: [
                "Trong trường hợp hòa (0) cược vào đội thắng và Newcastle là đội thắng cuộc ",
                "Do đó, cược vào Newcastle (0) sẽ thắng"
                // "平手盘（0）时投注获胜的队伍为赢，纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（0）为赢",
            ],
        },
        {
            oddType: "0",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "lose",
            fluxType: "",
            content: [
                "Trong trường hợp hòa (0) cược vào đội thắng thì Tottenham thua",
                "Vì vậy, cược vào Tottenham (0) sẽ thua"
                // "平手盘（0）时投注获胜的队伍为赢，热刺败北",
                // "故投注热刺（0）为输",
            ],
        },
    ],
    [
        {
            oddType: "-0/0.5",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "win",
            fluxType: "",
            content: [
                "Tottenham được chấp, với kết quả cược chấp là 2-0 hoặc 2-0.5 đều là Newcastle thắng ",
                "Vì vậy, cược vào Newcastle (-0/0.5) sẽ thắng",
                // "热刺获得受让分后，让分结果为：2-0或者2-0.5 均为纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（-0/0.5）为赢",
            ],
        },
        {
            oddType: "+0/0.5",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "lose",
            fluxType: "",
            content: [
                "Tottenham được chấp, với kết quả cược chấp là 2-0 hoặc 2-0.5 đều là trận thua của Tottenham",
                "Vì vậy, cược vào Tottenham (+ 0/0.5) sẽ thua"
                // "热刺获得受让分后，让分结果为：2-0或者2-0.5 均为热刺败北",
                // "故投注热刺（+0/0.5）为输",
            ],
        },
    ],
    [
        {
            oddType: "-1",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "win",
            fluxType: "",
            content: [
                "Tottenham được chấp, với kết quả cược chấp là 2-1, Newcastle thắng",
                "Vì vậy, cược vào Newcastle (-1) sẽ thắng"
                // "热刺获得受让分后，让分结果为：2-1，注纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（-1）为赢",
            ],
        },
        {
            oddType: "+1",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "lose",
            fluxType: "",
            content: [
                "Tottenham được chấp, với kết quả cược chấp là 2-1, Tottenham thua",
                "Vì vậy, cược vào Tottenham (+1) sẽ thua"
                // "热刺获得受让分后，让分结果为：2-1，热刺败北",
                // "故投注热刺（+1) 为输",
            ],
        },
    ],
    [
        {
            oddType: "-1.5/2",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "winHalf",
            fluxType: "",
            content: [
                "Tottenham là đội chấp, kết quả cược chấp là 2-1.5 hoặc 2-2, Newcastle sẽ thắng với tỷ lệ 2-1.5 và sẽ hòa với tỷ lệ 2-2; kết quả là Newcastle thắng nửa",
                "Vì vậy, cược vào Newcastle (-1.5/2) sẽ thắng"
                // "热刺获得受让分后，让分结果为：2-1.5或2-2，2-1.5时， 纽卡斯尔联获胜；2-2时为和局；一半赛果为纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（-1.5/2）为赢",
            ],
        },
        {
            oddType: "+1.5/2",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "loseHalf",
            fluxType: "",
            content: [
                "Tottenham được chấp, kết quả cược chấp là 2-1.5 hoặc 2-2, Tottenham sẽ thua với tỷ lệ 2-1.5, sẽ hòa với tỷ lệ 2-2; kết quả là Tottenham thua nửa",
                "Vì vậy, cược vào Tottenham (+ 1.5/2) sẽ thua nửa"
                // "热刺获得受让分后，让分结果为：2-1.5或2-2，2-1.5时 热刺败北；2-2时为和局；一半赛果为热刺败北",
                // "故投注热刺（+1.5/2）为输一半",
            ],
        },
    ],
];

const ouData = [
    [
        {
            oddType: "Tài 1.5", //大1.5
            odd: "1.79",
            teamName: " ",
            imgType: "win",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, nhiều hơn tỷ lệ cược 1.5",
                "Vì vậy cược (Tài 1.5) sẽ thắng"
                // "进球数为2，大于1.5", "故投注（大1.5）赢"
            ],
        },
        {
            oddType: "Xỉu 1.5", //小1.5
            odd: "1.79",
            teamName: " ",
            imgType: "lose",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, nhiều hơn tỷ lệ cược 1.5 ",
                "Vì vậy cược vào (Xỉu 1.5) sẽ thua hết"
                // "进球数为2，大于1.5", "故投注（小1.5）输"
            ],
        },
    ],
    [
        {
            oddType: "Tài 1.5/2", //大1.5/2
            odd: "1.79",
            teamName: " ",
            imgType: "winHalf",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 1.5 là thắng, với 2 là hòa, kết quả là thắng nửa ",
                "Vì vậy cược (Tài 1.5/2) sẽ thắng nửa"
                // "进球数为2，大于投注项1.5为赢，等于投注项2为打和； 一半的结果为赢",
                // "故投注（大1.5/2）为赢一半",
            ],
        },
        {
            oddType: "Xỉu 1.5/2", //小1.5/2
            odd: "1.79",
            teamName: " ",
            imgType: "loseHalf",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 1.5 là thua và với 2 là hòa",
                "Vì vậy, cược vào (Xỉu 1.5/2) sẽ thua nửa"
                // "进球数为2，大于投注项1.5为输，等于投注项2为打和；一半的结果为输",
                // "故投注（小1.5/2）为输一半",
            ],
        },
    ],
    [
        {
            oddType: "Tài 2", //大2
            odd: "1.79",
            teamName: " ",
            imgType: "returnPrincipal",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 2 là hòa và được hoàn tiền", "Vì vậy, cược (Tài 2) sẽ hòa và được hoàn lại tiền vốn"
                // "进球数为2，等于投注项2为打和，和局退款",
                // "故投注（大2）为退回本金",
            ],
        },
        {
            oddType: "Xỉu 2", //小2
            odd: "1.79",
            teamName: " ",
            imgType: "returnPrincipal",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 2 là hòa và được hoàn tiền",
                "Vì vậy, cược (Xỉu 2) sẽ hòa và được hoàn lại tiền vốn"
                // "进球数为2，等于投注项2为打和，和局退款",
                // "故投注（小2）为退回本金",
            ],
        },
    ],
    [
        {
            oddType: "Tài 2/2.5", //大2/2.5
            odd: "1.79",
            teamName: " ",
            imgType: "loseHalf",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 2 là hòa và với 2.5 là thua ", "Vậy cược Tài (2/2.5) sẽ thua nửa"
                // "进球数为2，等于投注项2为打和，小于投注2.5为输； 一半的结果为输",
                // "故投注（大2/2.5）为输一半",
            ],
        },
        {
            oddType: "Xỉu 2/2.5", //小2/2.5
            odd: "1.79",
            teamName: " ",
            imgType: "winHalf",
            fluxType: "",
            content: [
                "Tổng số bàn thắng là 2, so với tỷ lệ cược 2.5 là thắng và với 2 là hòa", "Vì vậy, cược vào (Xỉu 2/2.5) sẽ thắng nửa"
                // "进球数为2，等于投注项2为打和，小于投注2.5为赢； 一半的结果为赢",
                // "故投注（小2/2.5）为赢一半",
            ],
        },
    ],
];

const singleData = [
    [
        {
            oddType: "Đ.Nhà Thắng", //主胜
            odd: "1.79",
            teamName: " ",
            imgType: "win",
            fluxType: "",
            content: [
                "Newcastle thắng 2 bàn, kết quả là thắng ",
                "Vì vậy, cược vào (Đội Nhà Thắng) sẽ thắng"
                // "纽卡斯尔联赢2球，获胜", "故投注（主胜）为赢"
            ],
        },
        {
            oddType: "Hoà", //和局
            odd: "1.79",
            teamName: " ",
            imgType: "lose",
            fluxType: "",
            content: [
                "Newcastle thắng 2 bàn, không hòa ",
                "Vì vậy, cược vào (Hòa) sẽ thua"
                // "纽卡斯尔联赢2球，非和局", "故投注（和局）为输"
            ],
        },
        {
            oddType: "Đ.Khách Thắng", //客胜
            odd: "1.79",
            teamName: " ",
            imgType: "lose",
            fluxType: "",
            content: [
                "Tottenham thua 2 bàn và kết quả là thua ",
                "Vì vậy, cược vào (Đội Khách thắng) sẽ thua"
                // "热刺输2球，败北", "故投注（客胜）为输"
            ],
        },
    ],
];

const cornerData = [
    [
        {
            oddType: "-1.5",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "win",
            fluxType: "",
            content: [
                "Tottenham được chấp, kết quả cược chấp phạt góc là 7-6.5, và Newcastle thắng",
                "Vì vậy, cược vào Newcastle (-1.5) sẽ thắngVậy, cược Newcastle United (-1.5) sẽ thắng"
                // "热刺获得受让分后，角球让分结果为：7-6.5，纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（-1.5）为赢",
            ],
        },
        {
            oddType: "+1.5",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "lose",
            fluxType: "",
            content: [
                "Tottenham được chấp, kết quả cược chấp phạt góc là 7-6.5, Tottenham bị đánh bại"
                // "热刺获得受让分后，角球让分结果为：7-6.5，热刺败北"
            ],
        },
    ],
    [
        {
            oddType: "-1.5/2",
            odd: "1.79",
            teamName: "Newcastle", //纽卡斯尔联
            imgType: "winHalf",
            fluxType: "",
            content: [
                "Tottenham được chấp, kết quả cược chấp phạt góc là 7-6.5 hoặc 7-7; Newcastle sẽ thắng với tỷ lệ 7-6.5 và sẽ hòa với tỷ lệ 7-7, kết quả là Newcastle thắng nửa",
                "Vì vậy, cược vào Newcastle (-1.5/2) sẽ thắng nửa"
                // "热刺获得受让分后，角球让分结果为：7-6.5或7-7；7-6.5时 纽卡斯尔联获胜；7-7时为和局；一半的赛果为纽卡斯尔联获胜",
                // "故投注纽卡斯尔联（-1.5）为赢",
            ],
        },
        {
            oddType: "+1.5/2",
            odd: "1.79",
            teamName: "Tottenham", //热刺
            imgType: "loseHalf",
            fluxType: "",
            content: [
                "Tottenham được chấp, kết quả cược chấp phạt góc là 7-6.5 hoặc 7-7; Newcastle sẽ thắng với tỷ lệ 7-6.5 và sẽ hòa với tỷ lệ 7-7, kết quả là Tottenham thua nửa",
                "Vì vậy, cược vào cược vào Tottenham (+1.5/2) sẽ thua nửa"

                // "热刺获得受让分后，角球让分结果为：7-6.5或7-7；7-6.5时 纽卡斯尔联获胜；7-7时为和局；一半的赛果为热刺败北",
            ],
        },
    ],
];

const oeData = [
    [
        {
            oddType: "Lẻ", //单
            odd: "1.79",
            fluxType: "up",
            teamName: " ",
            imgType: "lose",
            content: [
                "Tổng số bàn thắng là 2, là số chẵn ", "Vì vậy, cược vào (Lẻ) sẽ thua"
                // "进球数为2，为双数.", "故投注（单）为输"
            ],
        },
        {
            oddType: "Chẵn", //双
            odd: "1.45",
            fluxType: "down",
            teamName: " ",
            imgType: "win",
            content: [
                "Tổng số bàn thắng là 2, là số chẵn ", "Vì vậy, cược vào (Chẵn) sẽ thắng"
                // "进球数为2，为双数.", "故投注（双）为赢"
            ],
        },
    ],
];

const csData = [
    [
        {
            oddType: "2-0",
            odd: "1.79",
            fluxType: "up",
            teamName: " ",
            imgType: "win",
            content: [
                "Kết quả trận đấu trùng khớp với tỉ lệ đặt cược ", "Vì vậy, cược (2-0) sẽ thắng"
                // "赛果与投注项完全一致", "故投注（2-0）为赢"
            ],
        },
        {
            oddType: "Tỉ Số Khác", //其他比分
            odd: "1.79",
            fluxType: "",
            teamName: " ",
            imgType: "lose",
            content: [
                "Cược Tỉ Số Khác chỉ thắng khi kết quả trận đấu không khớp với bất kỳ tỉ lệ cược đã cho.", "Hiện đang có tỷ lệ cược trùng khớp với kết quả trận đấu, vì vậy cược (Tỉ Số Khác) sẽ thua"
                // "仅当赛果与所有比分选项不一致时，投注‘其他比分’为赢； 当前有与比赛比分一致的投注项", "故投注（其他比分）为输"
            ],
        },
        {
            oddType: "0-2",
            odd: "1.45",
            fluxType: "down",
            teamName: " ",
            imgType: "lose",
            content: [
                "Kết quả trận đấu không trùng khớp với tỉ lệ đặt cược",
                "Vì vậy cược (0-2) sẽ thua"
                // "投注比分与赛果比分不一致", "故投注（0-2）为输"
            ],
        },
    ],
];

export { handicapData, ouData, singleData, cornerData, oeData, csData };
