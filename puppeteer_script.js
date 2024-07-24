const puppeteer = require('puppeteer');

(async () => {
    // 启动无头浏览器
    const browser = await puppeteer.launch({ headless: false }); // 设为 false 以便调试时查看浏览器操作
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

    // 执行JavaScript代码并捕捉错误
    await page.evaluate(async () => {
        var form = document.forms['form1'];
        var action = gRsvWOpeInstSrchVacantAction;
        doSearchHome(form, action);
        // // 返回执行后的结果，假设结果在某个特定元素中
        // return new Promise((resolve) => {
        //         // const resultElement = document.querySelector('table#week-info'); // 根据实际情况调整选择器
        //         const resultElement = document.querySelectorAll('table[id="week-info"]');
        //         resolve(resultElement ? resultElement : 'No result');
        // });
    });
    
    // await new Promise(resolve => setTimeout(resolve, 5000));
    await page.waitForSelector('#week-info');

    const resultElement = await page.evaluate(() => {
        const resultElement = document.querySelector('table#week-info'); // 根据实际情况调整选择器
        // const resultElement = document.querySelectorAll('table[id="week-info"]');
        return resultElement ? resultElement : 'No result';
    });

    console.log('Result:', resultElement);
    // try {
    // } catch (error) {
    //     console.error('Error executing JavaScript XXXX:', error);
    // }
    

    // 关闭浏览器
    await browser.close();

})();
