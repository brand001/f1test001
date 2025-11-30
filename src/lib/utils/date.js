// 存放有关时间的公共方法
import moment from "moment";
/**
 *获取当前日期前后N天的日期
 *
 * @export
 * @param {int 正负整数} AddDayCount   10,-10等
 * @returns
 */
export function GetDateStr(AddDayCount) {
    return moment().add(AddDayCount, "days").format("YYYY-MM-DD");
}
