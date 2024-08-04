import puppeteer,{ Browser, Page } from "puppeteer";
import { ParkWeekInfo, Result } from "../interface/timeResult";
import * as logger from "firebase-functions/logger";
import { Env } from "../env";

export class TennisCourt {

  private readonly purposeValue: string = "1000_1030";
  private browser: Browser | undefined;
  private page: Page | undefined;
  weekJsonTextLs: string[] = []; // 存储所有的 response
  monthJsonTextLs: string[] = []; // 存储所有的 response

  // key park ID?, value json texct
  parkJsonTextMap: Map<string, string> = new Map<string, string>();
  currentParkId = "";

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // private PCR = require("puppeteer-chromium-resolver");

  public async initBrowser() {
    
    // const options = {};
    // eslint-disable-next-line new-cap
    // const stats = await this.PCR(options);

    // 启动无头浏览器
    this.browser = await puppeteer.launch({ 
      headless: true,// 设为 false 以便调试时查看浏览器操作
      // 古いヘッドレスモード（パフォーマンスがいい）
      // headless: "shell",
      // args: [
      //   "--disable-gpu",
      //   "--disable-dev-shm-usage",
      //   "--disable-setuid-sandbox",
      //   "--no-first-run",
      //   "--no-sandbox",
      //   "--no-zygote",
      //   "--single-process",
      // ],
      // 起動ブラウザのパスを指定
      // executablePath: stats.executablePath
    }); 
    this.page = await this.browser?.newPage();
    
    // 监听所有的 response 并存储到数组中
    this.page.on("response", async (response) => {
      if (response.url().includes("rsvWOpeInstSrchVacantAjaxAction.do")) {
        const text = await response.text(); // 等待 Promise 解析
        this.weekJsonTextLs.push(text);
        this.parkJsonTextMap.set(this.currentParkId, text);
        logger.debug(`rsvWOpeInstSrchVacantAjaxAction.url(): ${response.url()}`);
      }else if(response.url().includes("rsvWOpeInstSrchMonthVacantAjaxAction.do")){
        const text = await response.text(); // 等待 Promise 解析
        this.monthJsonTextLs.push(text);
        logger.debug(`rsvWOpeInstSrchMonthVacantAjaxAction.url(): ${response.url()}`);
      }
    });
  }

  // 访问目标页面
  public async gotoHomePage(bnameValue: string,  bname: string,daystartValue: string) {
    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }
    this.currentParkId = bname;
    // 访问目标页面并设置 Cookie
    const cookies = [
      {
        name: "bname", 
        value: bnameValue,
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }, {
        name: "purpose",
        value: this.purposeValue,
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }, {
        name: "daystart",
        value: daystartValue,
        domain: "kouen.sports.metro.tokyo.lg.jp"
      }
    ];
    await this.page.setCookie(...cookies);

    await this.page.goto("https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp", { waitUntil: "networkidle2" });

    // 额外等待一段时间以确保页面稳定
    await new Promise(resolve => setTimeout(resolve, 2000));

  }

  // index画面执行检索
  public async doSearchHome() {

    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }

    // 进行检索  
    await this.page.evaluate(() => {
      const form = (document.forms as any)["form1"];
      const action = (window as any).gRsvWOpeInstSrchVacantAction;
      (window as any).doSearchHome(form, action);
      return new Promise<string>((resolve) => {
        resolve(document.body?.textContent || "");
      });
    });

    // use env SEARCH_WAIT_TIME
    await new Promise(resolve => setTimeout(resolve, Env.searchWaitTime));
    
  }

  // 获取所有的 response
  public getWeekJsonTextLs(): string[] {
    return this.weekJsonTextLs;
  }
  
  public getParkJsonTextMap(): Map<string, string> {
    return this.parkJsonTextMap;
  }
   
  // 次週>> javascript:getWeekInfoAjax(3, 0, 0);
  public async searchAndReturnWeekResult(i: number) {

    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }
    this.currentParkId = this.currentParkId.concat(i.toString());
    console.log("searchAndReturnWeekResult--currentParkId",this.currentParkId);
    // 进行检索
    await this.page.evaluate(() => {
      // getWeekInfoAjax(4, 0, 0) ? 4还是3 的意思？？？
      (window as any).getWeekInfoAjax(4, 0, 0);
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

  }

  public async getWeekInfoResponses() {
    // 获取所有的 response
    const responses = this.getParkJsonTextMap();    

    // responses的内容
    console.log("getWeekInfoResponses--responses",responses.size);

    const result: ParkWeekInfo[] = [];

    responses.forEach((value, key) => {
      const jsonObj: Result = JSON.parse(value);
      result.push({ bcdNm: key, bcd: "", weekList: jsonObj });
    });

    // for (const response of responses) {
    //   const jsonObj = JSON.parse(response.keys().next().value);
    //   result.push(jsonObj);
    //   console.log("getWeekInfoResponses--result",result.length);
    // }
    return result;
  }

  // 关闭浏览器
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}