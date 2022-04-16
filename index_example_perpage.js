const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.smashingmagazine.com/articles`);
  await page.waitForSelector('.category__section');
  // await page.waitForSelector('.pagination__current');
  let pageNumberCont = await page.waitForSelector('.pagination__current');
  let currentPage = await pageNumberCont.evaluate(el => el.textContent);
  try {
    // const currentPage = document.querySelectorAll('.pagination__current').text();
    const currentPageNumber = Number(currentPage);
    console.log('currentPageNumber', currentPageNumber);
    browser.close();
    if (currentPageNumber <= 3) {
      await perPage(currentPageNumber);
    }
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
  }
}

async function perPage(pageNumber) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.smashingmagazine.com/articles/page/${pageNumber}`);
  await page.waitForSelector('.category__section');
  try {
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.article--post__title > a')).map((link) => link.href);
    })
    const articles = [];
    for (const link of links) {
      await page.goto(link);
      const title = await page.evaluate(() => {
        const text = Array.from(document.querySelectorAll('.article-header--title')).map((el) => el.textContent);
        return text.toString();
      })
      articles.push({ title });
    }
    console.log('articles', articles);
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
  }
}

scrape();