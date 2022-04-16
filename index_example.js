const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.smashingmagazine.com/articles/");
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