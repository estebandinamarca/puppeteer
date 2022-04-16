const puppeteer = require("puppeteer");

const urls = [
  'https://www.youtube.com/c/inanutshell/videos',
  'https://www.youtube.com/c/HumanistsUK/videos',
];
let videosList = [];

// Block resources
const blockedResources = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'twitter',
  'google-analytics',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
  'googlesyndication',
];

async function scrape(url) {
  console.log('url', url);
  const parentClass = "#dismissible";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Block some resources
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (blockedResources.some(resource => request.includes(resource)))
      request.abort();
    else
      request.continue();
  });

  await page.goto(url);
  await page.waitForSelector(parentClass);
  console.log(await page.title());
  try {
    const videos = await page.evaluate(() => {
      const cardsInit = document.querySelectorAll('#contents:first-child .style-scope:nth-child(2) #contents #dismissible #contents #items .style-scope');
      const cardsArray = [...cardsInit];
      // cardsArray.forEach(card => {
      //   const prev = {};
      //   var titles = card.querySelectorAll('h1');
      //   titles.forEach(title => {
      //     prev.title = title.innerText;
      //   });
      //   var options = card.querySelectorAll('.opciones');
      //   options.forEach(option => {
      //     const followersRaw = option.textContent.toString().replace('Ver Iniciativa', '').replace(/\s/g, '');
      //     if (followersRaw.includes('K')) {
      //       const removeK = followersRaw.replace('K', '');
      //       const toNum = parseFloat(removeK);
      //       prev.followers = toNum * 1000;
      //     } else {
      //       prev.followers = parseFloat(option.innerText);
      //     }
      //   });
      //   cards.push(prev);
      // });
      return cardsArray;
      // cards.push(prev);
    })
    console.log('videos', videos);
    videosList.concat(videos);
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
    console.log('videosList', videosList);
  }
}

async function init() {
  for (const url of urls) {
    await scrape(url);
  }
}

init();