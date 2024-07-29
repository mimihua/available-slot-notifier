import puppeteer, { Browser, Page } from "puppeteer";
import { Result } from "../interface/timeResult";

export class TennisSlot {
  private static instance: TennisSlot;

  private readonly purpose: string = "1000_1030";
  private browser: Browser | undefined;
  private page: Page | undefined;

  private constructor() {
    // 私有构造函数
  }  

  public static async getInstance(): Promise<TennisSlot> {
    if (!TennisSlot.instance) {
      TennisSlot.instance = new TennisSlot();
      this.instance.initBrowser();
    }
    return TennisSlot.instance;
  }

  private async initBrowser() {
    // 启动无头浏览器
    this.browser = await puppeteer.launch({ headless: true }); // 设为 false 以便调试时查看浏览器操作
    this.page = await this.browser.newPage();
  }

  public async gotoHomePage(bname: string, daystart: string) {
    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }
    // 访问目标页面并设置 Cookie
    const cookies = [
      {
        name: bname,  // TODO bname的位置写错了
        value: "1040",
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }, {
        name: "purpose",
        value: this.purpose,
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }, {
        name: daystart,
        value: "2024-07-29",
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }
    ];
    await this.page.setCookie(...cookies);

    await this.page.goto("https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp", { waitUntil: "networkidle2" });

    // 额外等待一段时间以确保页面稳定
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  public static async searchAndReturnWeekResult() {

    // return result
  }

  public static async goNextWeekAndReturnWeekResult() {
      
    // return result
  }


  async findAvailableTennisSlots() {

    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }

    // 进行检索
    await this.page.evaluate(() => {
      const form = (document.forms as any)["form1"];
      const action = (window as any).gRsvWOpeInstSrchVacantAction;
      (window as any).doSearchHome(form, action);
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 获取周信息
    // 执行javascript:doSearch(document.form1, gRsvWOpeInstSrchVacantAjaxAction);代码并返回结果
    await this.page.evaluate(() => {
      const form = (document.forms as any)["form1"];
      const action = (window as any).gRsvWOpeInstSrchVacantAjaxAction;
      (window as any).doSearch(form, action);
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    //   获取画面内容 返回结果
    const jsonText: string | null = await this.page.evaluate(() => {
      return new Promise<string>((resolve) => {
        resolve(document.body?.textContent || "");
      });
    });

    // convert to json
    const jsonObj = JSON.parse(jsonText);

    const result: Result = jsonObj;

    console.log(result);


    // 次週>> javascript:getWeekInfoAjax(3, 0, 0);

  }
  
  // 关闭浏览器
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
