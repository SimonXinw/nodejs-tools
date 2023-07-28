import puppeteer from "puppeteer"
import { COOKIES_ARR } from "./const.js"

// URL of the page we want to scrape
const url = "https://pre-marvel.alibaba-inc.com/#/ceres/grouping/seller";

// Async function which scrapes the data
async function scrapeData(config) {

  const url = config?.url;

  try {

    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();



    // 转换Cookie格式并设置到Puppeteer中
    for (const cookie of COOKIES_ARR) {
      await page.setCookie(cookie);
    }

    await page.goto(url);

    // 等待某个元素的出现
    await page.waitForSelector('.next-aside-navigation');

    //下面写法等价
    let selectedHeadADom = await page.$('.next-shell-header .next-menu-selectable-single .next-selected a');

    console.log('selectedHeadADom >>>>>>>>>>>>>>', selectedHeadADom)

    let STR_1 = selectedHeadADom.innerText + ' - ';

    // 关闭浏览器
    await browser.close();

  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData({

  url: url
});