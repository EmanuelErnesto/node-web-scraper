import { WebScraper } from ".";
import { CreateProductDTO } from "../domain/dtos/CreateProductDTO";

export class AmazonCrawler {
  public static async getProductsData(url: string = 'https://www.amazon.com.br/bestsellers') {

    const browser = await WebScraper.initBrowser();
    const page = await WebScraper.createPage(browser);
  
    await WebScraper.accessUrl(page, url);
  
    await page.waitForSelector('ol.a-carousel');

    const products: CreateProductDTO[] = await page.evaluate(() => {

      const productListOl = document.querySelector('ol.a-carousel') as Element;
      const productElements = Array.from(productListOl.querySelectorAll('li.a-carousel-card')).slice(0, 3);
  
      return productElements.map((element, index) => {
        const categoryElement = document.querySelector('div.a-carousel-header-row h2.a-carousel-heading.a-inline-block')
        const category = categoryElement?.textContent?.toLowerCase().replace('mais vendidos em', '').trim() ?? 'Categoria não disponível.';
  
        const imgElement = element.querySelector('img.p13n-product-image');
        const imageUrl = imgElement?.getAttribute('src')?.trim() ?? 'Imagem não disponível';
       
        const name = imgElement?.getAttribute('alt')?.trim() ?? 'Nome não disponível';
          
        const productUrlElement = element.querySelector('div.p13n-sc-uncoverable-faceout a.a-link-normal[role="link"]');
        const rawUrl = productUrlElement?.getAttribute('href')?.trim() ?? '';
  
        const productUrl = rawUrl.startsWith('http') ? rawUrl : `https://www.amazon.com.br${rawUrl}`;
  
        const priceElement = element.querySelector('span._cDEzb_p13n-sc-price_3mJ9Z');
        const priceText = priceElement?.textContent?.trim() ?? '0';
        const price = Number(priceText.replace(/[^\d,]/g, '').replace(',', '.')).valueOf() || 0;
  
        const product: CreateProductDTO = {
          name, 
          productUrl, 
          price, 
          ranking: (index + 1),
          category, 
          imageUrl
        }
        return product;
      });
    });

    await WebScraper.closeBrowser(browser);

    return products;
  }
}