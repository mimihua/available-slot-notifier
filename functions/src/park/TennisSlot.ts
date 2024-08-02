import axios from "axios";
import iconv from "iconv-lite";
import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";
import { Result } from "../interface/timeResult";

export class TennisSlot {

  private readonly purposeValue: string = "1000_1030";
  private browser: Browser | undefined;
  private page: Page | undefined;
  static data: any;
  responses: HTTPResponse[] = []; // 存储所有的 response

  public async initBrowser() {
    // 启动无头浏览器
    this.browser = await puppeteer.launch({ headless: false }); // 设为 false 以便调试时查看浏览器操作
    this.page = await this.browser.newPage();
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

    // // 获取当前页面的所有 cookies
    // const currentCookies = await this.page.cookies();
    // console.log("cookies",currentCookies);

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
      }
    });

    // 进行检索
    await this.page.evaluate(() => {
      const form = (document.forms as any)["form1"];
      const action = (window as any).gRsvWOpeInstSrchVacantAction;
      (window as any).doSearchHome(form, action);
      
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // // 获取周信息
    // // 执行javascript:doSearch(document.form1, gRsvWOpeInstSrchVacantAjaxAction);代码并返回结果
    // await this.page.evaluate(() => {
    //   const form = (document.forms as any)["form1"];
    //   const action = (window as any).gRsvWOpeInstSrchVacantAjaxAction;
    //   (window as any).doSearch(form, action);
    // });

    // await new Promise(resolve => setTimeout(resolve, 10000));

    
    //   获取画面内容 返回结果
    // const jsonText: string | null = await this.page.evaluate(() => {
    //   return new Promise<string>((resolve) => {
    //     // resolve(document.body?.textContent || "");
    //     resolve(document.getElementById("weekly")?.textContent || "");
    //   });
    // });
    
    // convert to json
    // const jsonObj = JSON.parse(jsonText);
    
    // const result: Result = jsonObj;

    // console.log("doSearchHome:+++", jsonText);
    // await this.postData();
    
  }
  // 获取所有的 response
  public getResponses(): HTTPResponse[] {
    return this.responses;
  }

  // $.ajax({
  //   url: '/web/rsvWOpeInstSrchVacantAjaxAction.do',
  //   type: 'POST',
  //   dataType: 'json',
  //   data: {
  // displayNo: "prwrc2000",
  // useDay: "20240730",
  // bldCd: "1040",
  // instCd: "10400030",
  // transVacantMode: "11",
  // clearFlag:0,
  //   },
  //   success: function(data) {
  //     console.log(data);
  //   }
  // });

  async postData() {
    const url = "https://kouen.sports.metro.tokyo.lg.jp/web/gRsvWOpeInstSrchVacantAction.do";
    const data = {
      daystart: "20240802",
      bname: "1040"
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Charset": "Shift_JIS", 
        },
        withCredentials: true, // 保持 session
        responseType: "arraybuffer", // 获取原始的二进制数据
      });
      const decodedData = iconv.decode(Buffer.from(response.data), "Shift_JIS");
      console.log("response",decodedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

    // //   获取画面内容 返回结果
    // const jsonText: string | null = await this.page.evaluate(() => {
    //   return new Promise<string>((resolve) => {
    //     resolve(document.body?.textContent || "");
    //   });
    // });

    // // convert to json
    // const jsonObj = JSON.parse(jsonText);

    // const result: Result = jsonObj;

    // console.log("searchAndReturnWeekResult:+++", result);
  }

  public async goNextWeekAndReturnWeekResult() {

    
      
    // return result
  }

  public async getWeekInfoResponses() {
    // 获取所有的 response
    const responses = this.getResponses();    
    let result: Result | null = null;
    for (const response of responses) {
      // const url = response.url();
      // const status = response.status();
      // const headers = response.headers();
      const body = await response.text();
      // console.log(`Response from ${url}:`);
      // console.log(`Status: ${status}`);
      // console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
      // console.log(`Body: ${body}`);
      const jsonObj = JSON.parse(body); 
      result = jsonObj;
    }

    console.log("getWeekInfoResponses:+++", result);

    return result;
  }

  // 关闭浏览器
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}