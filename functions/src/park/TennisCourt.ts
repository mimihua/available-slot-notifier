import puppeteer,{ Browser, HTTPResponse, Page } from "puppeteer";
import { Result } from "../interface/timeResult";
import * as logger from "firebase-functions/logger";

export class TennisCourt {

  private readonly purposeValue: string = "1000_1030";
  private browser: Browser | undefined;
  private page: Page | undefined;
  responses: HTTPResponse[] = []; // 存储所有的 response
  responsesMonth: HTTPResponse[] = []; // 存储所有的 response

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
  }

  // 访问目标页面
  public async gotoHomePage(bnameValue: string, daystartValue: string) {
    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }
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

  // 执行检索
  public async doSearchHome() {

    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }

    // 监听所有的 response 并存储到数组中
    this.page.on("response", (response) => {
      if (response.url().includes("rsvWOpeInstSrchVacantAjaxAction.do")) {
        this.responses.push(response);
        logger.debug(`rsvWOpeInstSrchVacantAjaxAction.url(): ${response.url()}`);
      }else if(response.url().includes("rsvWOpeInstSrchMonthVacantAjaxAction.do")){
        this.responsesMonth.push(response);
        logger.debug(`rsvWOpeInstSrchMonthVacantAjaxAction.url(): ${response.url()}`);
      }
    });

    // 进行检索
    
    await this.page.evaluate(() => {
      const form = (document.forms as any)["form1"];
      const action = (window as any).gRsvWOpeInstSrchVacantAction;
      (window as any).doSearchHome(form, action);
      return new Promise<string>((resolve) => {
        resolve(document.body?.textContent || "");
      });
    });

    await new Promise(resolve => setTimeout(resolve, 10000));  
    


  }
  // 获取所有的 response
  public getResponses(): HTTPResponse[] {
    return this.responses;
  }
   
  // 次週>> javascript:getWeekInfoAjax(3, 0, 0);
  public async searchAndReturnWeekResult() {

    if (!this.page) {
      throw new Error("Browser is not initialized.");
    }

    // 进行检索
    await this.page.evaluate(() => {
      (window as any).getWeekInfoAjax(3, 0, 0);
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

  }

  public async goNextWeekAndReturnWeekResult() {   
      
    // return result
  }

  public async getWeekInfoResponses() {
    // 获取所有的 response
    const responses = this.getResponses();    
    let result: Result | null = null;
    for (const response of responses) {
      const body = await response.text();
      const jsonObj = JSON.parse(body); 
      result = jsonObj;
      console.log("getWeekInfoResponses");
    }
    return result;
  }

  // 关闭浏览器
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}