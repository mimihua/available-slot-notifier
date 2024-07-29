
import { TennisSlot } from "./TennisSlot";

class Park {
  private readonly tennisSlot: TennisSlot = new TennisSlot();
  async findAvailableTennisSlots() {
    
    const bname = "1040";
    // 当天日期并转换为YYYY-MM-DD的字符串
    const daystart : string  = new Date().toISOString().split("T")[0];
    
    // 获取网球场空位信息
    const result = await this.tennisSlot.findAvailableTennisSlots(bname,daystart);
    
    console.log(result);
  }

}

// {
//     "all": 26,
//     "results": [
//         {
//             "bcdNm": "日比谷公園",
//             "bcd": "1000"
//         },
//         {
//             "bcdNm": "芝公園",
//             "bcd": "1010"
//         },
//         {
//             "bcdNm": "猿江恩賜公園",
//             "bcd": "1040"
//         },
//         {
//             "bcdNm": "亀戸中央公園",
//             "bcd": "1050"
//         },
//         {
//             "bcdNm": "木場公園",
//             "bcd": "1060"
//         },
//         {
//             "bcdNm": "祖師谷公園",
//             "bcd": "1070"
//         },
//         {
//             "bcdNm": "東白鬚公園",
//             "bcd": "1090"
//         },
//         {
//             "bcdNm": "浮間公園",
//             "bcd": "1100"
//         },
//         {
//             "bcdNm": "城北中央公園",
//             "bcd": "1110"
//         },
//         {
//             "bcdNm": "赤塚公園",
//             "bcd": "1120"
//         },
//         {
//             "bcdNm": "東綾瀬公園",
//             "bcd": "1130"
//         },
//         {
//             "bcdNm": "舎人公園",
//             "bcd": "1140"
//         },
//         {
//             "bcdNm": "篠崎公園Ａ",
//             "bcd": "1150"
//         },
//         {
//             "bcdNm": "大島小松川公園",
//             "bcd": "1160"
//         },
//         {
//             "bcdNm": "汐入公園",
//             "bcd": "1170"
//         },
//         {
//             "bcdNm": "高井戸公園",
//             "bcd": "1175"
//         },
//         {
//             "bcdNm": "善福寺川緑地",
//             "bcd": "1180"
//         },
//         {
//             "bcdNm": "光が丘公園",
//             "bcd": "1190"
//         },
//         {
//             "bcdNm": "石神井公園Ｂ",
//             "bcd": "1205"
//         },
//         {
//             "bcdNm": "井の頭恩賜公園",
//             "bcd": "1220"
//         },
//         {
//             "bcdNm": "武蔵野中央公園",
//             "bcd": "1230"
//         },
//         {
//             "bcdNm": "小金井公園",
//             "bcd": "1240"
//         },
//         {
//             "bcdNm": "野川公園",
//             "bcd": "1260"
//         },
//         {
//             "bcdNm": "府中の森公園",
//             "bcd": "1270"
//         },
//         {
//             "bcdNm": "東大和南公園",
//             "bcd": "1280"
//         },
//         {
//             "bcdNm": "有明テニスＣ人工芝コート",
//             "bcd": "1360"
//         }
//     ]
// }