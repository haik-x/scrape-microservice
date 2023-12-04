const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

async function doRequest(link, price, previousPrice, productDiscount) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.setCacheEnabled(false);
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    
    // Force a reload without using the cache
    await page.reload({ waitUntil: 'networkidle0', ignoreCache: true });

    const productName = await page.$eval('.ui-pdp-title', (element) => element.textContent);
    //console.log(productName);

    const productPrice = await page.$eval('[itemprop="price"]', (element) => element.getAttribute('content'));

    /*if (productPrice !== price) {
      previousPrice = price;
      if (productPrice < previousPrice) {
        productDiscount = (previousPrice * 100) / productPrice;
      } else {
        productDiscount = 0;
      }
    }*/

    const productImg = await page.$eval('img.ui-pdp-image.ui-pdp-gallery__figure__image', (element) => element.getAttribute('src'));

    // Add new Product to Json
    const infoProducts = {
      precio: productPrice,
      descuento: previousPrice,
      precioAnterior: previousPrice ? previousPrice : productPrice,
      nombreProducto: productName,
      link: link,
      linkImg: productImg,
    };

    return infoProducts;
  } catch (error) {
    console.error('Error in doRequest:', error);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { doRequest };
