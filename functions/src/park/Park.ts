
import { TennisCourtInfoHandler } from "./TennisCourtInfoHandler";
import { TennisCourt} from "./TennisCourt";
import { ParkWeekInfo } from "../interface/timeResult";
import { Webhooks } from "../webhook";
import { logger } from "firebase-functions/v1";

export class Park {
  private readonly tennisCourt = new TennisCourt();
  private tennis = new TennisCourtInfoHandler();
  private webhooks = new Webhooks();

  async findAvailableTennisSlots() {
    
    const bnameLs: ParkWeekInfo[] = [
      {bcdNm: "猿江恩賜公園", bcd: "1040"},
      {bcdNm: "亀戸中央公園", bcd: "1050"},
      {bcdNm: "木場公園", bcd: "1060"},
      {bcdNm: "大島小松川公園", bcd: "1160"},
    ];
    // 当天日期并转换为YYYY-MM-DD的字符串
    const daystart : string  = new Date().toISOString().split("T")[0];

    const result: ParkWeekInfo[] = [];

    // 初期化浏览器
    await this.tennisCourt.initBrowser();
    
    // 获取网球场空位信息
    for (const bname of bnameLs) {    
      logger.debug("gotoHomePage");
      await this.tennisCourt.gotoHomePage(bname.bcd, bname.bcdNm, daystart);
     
      logger.debug("doSearchHome");
      await this.tennisCourt.doSearchHome();
      // 下2周情报
      for (let i = 0; i < 2; i++) {
        logger.debug("getWeekInfoAjax");
        await this.tennisCourt.searchAndReturnWeekResult(i);    
      } 
    }    

    const weekResults = await this.tennisCourt.getWeekInfoResponses();
    result.push(...weekResults); // 使用扩展运算符展平数组

    const info = new Array<string>();

    for (const r of result) {
      // 取得的周情报进行解析
      const result = await this.tennis.parseWeekInfo(r.bcdNm, r.weekList);
      if (result !== "") {
        info.push(result);
      }
    }

    // logger.debug("info",info);
      
    if (info.length !== 0) {
      // 发送消息
      await this.webhooks.sendSimpleMessage("以下是网球场的空位信息：\n" + info.join("\n"));
    }else{
      logger.debug("No data found");
    }

    await this.tennisCourt.closeBrowser();
    logger.debug("closeBrowser");
  }
}

// test
// const park = new Park();
// park.findAvailableTennisSlots();