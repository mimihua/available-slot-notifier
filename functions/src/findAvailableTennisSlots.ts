import puppeteer, { Browser, Page } from "puppeteer";

export async function findAvailableTennisSlots() {
  // 启动无头浏览器
  const browser: Browser = await puppeteer.launch({ headless: false }); // 设为 false 以便调试时查看浏览器操作
  const page: Page = await browser.newPage();

  // 访问目标页面并设置 Cookie
  const cookies = [
    {
      name: "bname",
      value: "1040",
      domain: "kouen.sports.metro.tokyo.lg.jp"
    }, {
      name: "purpose",
      value: "1000_1030",
      domain: "kouen.sports.metro.tokyo.lg.jp"
    }, {
      name: "daystart",
      value: "2024-07-24",
      domain: "kouen.sports.metro.tokyo.lg.jp"
    }
  ];
  await page.setCookie(...cookies);

  await page.goto("https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp", { waitUntil: "networkidle2" });

  // 等待页面完全加载
  // await page.waitForSelector('form[name="form1"]');

  // 额外等待一段时间以确保页面稳定
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 进行检索
  await page.evaluate(() => {
    const form = (document.forms as any)["form1"];
    const action = (window as any).gRsvWOpeInstSrchVacantAction;
    (window as any).doSearchHome(form, action);
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 获取周信息
  // 执行javascript:doSearch(document.form1, gRsvWOpeInstSrchVacantAjaxAction);代码并返回结果
  await page.evaluate(() => {
    const form = (document.forms as any)["form1"];
    const action = (window as any).gRsvWOpeInstSrchVacantAjaxAction;
    (window as any).doSearch(form, action);
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  //   获取画面内容 返回结果
  const jsonText: string | null = await page.evaluate(() => {
    return new Promise<string>((resolve) => {
      resolve(document.body?.textContent || "");
    });
  });

  // convert to json
  const jsonObj = JSON.parse(jsonText);
  console.log("jsonObj:", jsonObj.result[1].timeResult);

  // 关闭浏览器
  await browser.close();
}

findAvailableTennisSlots();