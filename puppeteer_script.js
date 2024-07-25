const puppeteer = require('puppeteer');

(async () => {
    // 启动无头浏览器
    const browser = await puppeteer.launch({ headless: true }); // 设为 false 以便调试时查看浏览器操作
    const page = await browser.newPage();

    // 访问目标页面 Cookieの設定
    await page.setCookie({
        name: 'bname',
        value: '1040',
        domain: 'kouen.sports.metro.tokyo.lg.jp'
    }, {
        name: 'purpose',
        value: '1000_1030',
        domain: 'kouen.sports.metro.tokyo.lg.jp'
    }, {
        name: 'daystart',
        value: '2024-07-24',
        domain: 'kouen.sports.metro.tokyo.lg.jp'
    });

    await page.goto('https://kouen.sports.metro.tokyo.lg.jp/web/index.jsp', { waitUntil: 'networkidle2' });

     // 等待页面完全加载
    //  await page.waitForSelector('form[name="form1"]');

     // 额外等待一段时间以确保页面稳定
     await new Promise(resolve => setTimeout(resolve, 2000));

    // 进行检索
    await page.evaluate(async () => {
        var form = document.forms['form1'];
        var action = gRsvWOpeInstSrchVacantAction;
        doSearchHome(form, action);
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 获取周信息
    // 执行javascript:doSearch(document.form1, gRsvWOpeInstSrchVacantAjaxAction);代码并返回结果
    await page.evaluate(async () => {
        var form = document.forms['form1'];
        var action = gRsvWOpeInstSrchVacantAjaxAction;
        doSearch(form, action);
    });
  
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 获取画面内容 返回结果
    const jsonText = await page.evaluate(async () => {
            return new Promise((resolve) => {
                resolve(document.body.textContent);
            });
    });

    // convert to json
    const jsonObj = JSON.parse(jsonText);
    console.log('jsonObj:', jsonObj.result[1].timeResult);

    // 关闭浏览器
    await browser.close();

})();
