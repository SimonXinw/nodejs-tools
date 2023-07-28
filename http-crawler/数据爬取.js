import axios from 'axios'
import fs from 'fs'
import cheerio from "cheerio"
import puppeteer from "puppeteer"

import { COOKIES_ARR } from "./const.js"

// URL of the page we want to scrape
const url = "https://pre-marvel.alibaba-inc.com/#/ceres/grouping/seller";

// Async function which scrapes the data
async function scrapeData() {
  try {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 添加Cookie

    // 转换Cookie格式并设置到Puppeteer中
    for (const cookie of COOKIES_ARR) {
      await page.setCookie(cookie);
    }

    await page.goto('https://pre-marvel.alibaba-inc.com/#/ceres/grouping/seller');

    // 等待页面加载完毕
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 等待某个元素的出现
    await page.waitForSelector('.next-menu-item-inner');

    // 等待一段时间
    await page.waitForTimeout(5000);

    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".plainlist ul li");
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { name: "", iso3: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("a").text();
      country.iso3 = $(el).children("span").text();
      // Populate countries array with country data
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();