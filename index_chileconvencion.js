const puppeteer = require("puppeteer");

async function scrape() {
  const url = "https://plataforma.chileconvencion.cl/m/iniciativa_popular";
  const parentClass = "#iniciativas";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(parentClass);
  try {
    const iniciativas = await page.evaluate(() => {
      let cards = [];
      const cardsInit = document.querySelectorAll('.card');
      const cardsArray = [...cardsInit];
      cardsArray.forEach(card => {
        const prev = {};
        var titles = card.querySelectorAll('h1');
        titles.forEach(title => {
          prev.title = title.innerText;
        });
        var options = card.querySelectorAll('.opciones');
        options.forEach(option => {
          const followersRaw = option.textContent.toString().replace('Ver Iniciativa', '').replace(/\s/g, '');
          if (followersRaw.includes('K')) {
            const removeK = followersRaw.replace('K', '');
            const toNum = parseFloat(removeK);
            prev.followers = toNum * 1000;
          } else {
            prev.followers = parseFloat(option.innerText);
          }
        });
        cards.push(prev);
      });
      return cards.sort((a, b) => (a.followers > b.followers) ? 1 : -1).reverse();
    })
    console.log('iniciativas', iniciativas);
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
  }
}

scrape();