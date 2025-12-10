import * as puppeteer from 'puppeteer';
import { Product } from 'src/interface/Product';

export async function scrapingAmazonBestSellers(): Promise<Product[]> {
  console.log('INICIANDO SCRAPING...');

  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto('https://www.amazon.com.br/bestsellers', { waitUntil: 'domcontentloaded' });
  await page.setViewport({ width: 1080, height: 1024 });

  const PRODUCT_CONTAINER_SELECTOR = '[data-a-carousel-options]';
  const productsCarousel = await page.$$(PRODUCT_CONTAINER_SELECTOR);
  const topProducts: Product[] = [];

  try {
    for (const product of productsCarousel) {

      const category = await product.$eval(".a-carousel-heading", item =>
        item.textContent?.trim().split("em ")[1] ?? null
      )

      const productCards = await product.$$(".a-carousel-card");

      for (let index = 0; index < productCards.length; index++) {
        if (index >= 3) break;
        const card = productCards[index];

        const productId = await card.$eval('[data-asin]', item => item.getAttribute('data-asin')) ?? 'Produto sem data-asin';

        const productName = await card.$eval("a span div", item =>
          item.textContent?.trim() ?? 'Produto sem nome'
        );

        const productPrice = await card.$eval(".a-color-price", item =>
          item.textContent?.trim() ?? 0
        ).catch(() => 0);

        const parsedPrice =
          productPrice
            ? parseFloat(
              productPrice.replace("R$", "").replace(".", "").replace(",", ".").trim()
            )
            : 0.00;

        const productUrl = await card.$eval("a", item =>
          item.getAttribute("href") ?? 'Produto sem URL'
        );

        if (productName) {
          topProducts.push({
            productId: productId,
            category: category ?? 'Categoria desconhecida',
            name: productName,
            price: parsedPrice,
            url: `https://www.amazon.com.br${productUrl}`,
          });
        }
      }

    }
    console.log("RESULTADO FINAL:", topProducts);
    console.log('SCRAPING FINALIZADO.');
    await browser.close();
    return topProducts;

  } catch (error) {
    console.log("ERRO DURANTE A EXTRAÇÃO:", error);
    await browser.close();
  }
}
