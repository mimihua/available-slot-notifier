import { Result } from "../interface/timeResult";
import Holidays from "date-holidays";

export class TennisCourtInfoHandler {

  // 日本祝日情报
  private holidays = new Holidays("JP", "ja");

  // Class implementation goes here
  async parseWeekInfo(bcdNm: string, weekInfo?: Result): Promise<string> {

    // 创建一个list用于存储信息
    const info = new Array<string>();

    // 无数据时返回
    if (!weekInfo) return "No data found";

    // 时间点的情报处理
    weekInfo.result.forEach((result) => {
      // １７時 以后的时间点
      if (result.tzoneNo >= 50) {
        const timeResult = result.timeResult;
        timeResult.forEach((time) => {
          //  YYYYMMDD类型的日期判断周末
          const date = time.useDay.toString();
          const year = parseInt(date.substring(0, 4), 10);
          const month = parseInt(date.substring(4, 6), 10) - 1; // Convert to zero-based month
          const day = parseInt(date.substring(6, 8), 10);
          const week = new Date(year, month, day).getDay();
          const isHoliday = this.holidays.isHoliday(new Date(year, month, day));
          const weekday = new Date(year, month, day).toLocaleDateString("ja-JP-u-ca-japanese", { weekday: "short" });

          if (isHoliday && time.alt === "空き") {
            // 日期，星期，祝日，空き
            info.push(bcdNm + "  " + result.tzoneName + time.useDay.toString() + "  " + "祝日" + time.alt);

          } else if ((week === 0 || week === 6) && time.alt === "空き") {

            info.push(bcdNm + "  " + result.tzoneName + time.useDay.toString() + "  " + weekday + "  " + time.alt);

          }
          // １９時 以后的时间点
          else if (result.tzoneNo == 60 && week >= 3 && week <= 5 && time.alt === "空き") {        
            info.push(bcdNm + "  " + result.tzoneName + time.useDay.toString() + "  " 
            + weekday + time.alt);
          }
        });
      }
    });

    // 返回string类型并用换行符的信息
    return info.length > 0 ? info.join("\n") : "";
  }

}