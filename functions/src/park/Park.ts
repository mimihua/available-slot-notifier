
import { TennisCourtInfoHandler } from "./TennisCourtInfoHandler";
import { TennisCourt} from "./TennisCourt";
import { Result } from "../interface/timeResult";
import { Webhooks } from "../webhook";

export class Park {
  private readonly tennisCourt = new TennisCourt();
  private tennis = new TennisCourtInfoHandler();
  private webhooks = new Webhooks();

  async findAvailableTennisSlots() {
    
    const bname = "1040";
    // 当天日期并转换为YYYY-MM-DD的字符串
    const daystart : string  = new Date().toISOString().split("T")[0];

    await this.tennisCourt.initBrowser();
    
    // 获取网球场空位信息
    await this.tennisCourt.gotoHomePage(bname, daystart);
    
    console.log("gotoHomePage");
    
    await this.tennisCourt.doSearchHome();

    console.log("doSearchHome");


    const result: Result | null = await this.tennisCourt.getWeekInfoResponses();

    // 取得的周情报进行解析
    const info = await this.tennis.parseWeekInfo(result);
    
    // console.log(info);

    // 发送消息
    await this.webhooks.sendSimpleMessage(info);
    
    // await this.tennisSlot.searchAndReturnWeekResult();    
    // await this.tennisSlot.goNextWeekAndReturnWeekResult();


    await this.tennisCourt.closeBrowser();
    console.log("closeBrowser");
  }
}

// test
// const park = new Park();
// park.findAvailableTennisSlots();