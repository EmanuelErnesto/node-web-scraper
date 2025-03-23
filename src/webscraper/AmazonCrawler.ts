import { WebScraper } from ".";
import { CreateProductDTO } from "../domain/dtos/CreateProductDTO";

export class AmazonCrawler {
  private static category: string;

  public static async getProductsData(url: string = 'https://www.amazon.com.br/bestsellers') {

    const browser = await WebScraper.initBrowser();
    const page = await WebScraper.createPage(browser);
  
    await WebScraper.accessUrl(page, url);
  
    await page.waitForSelector('ol.a-carousel');

    this.category = await page.$eval('div.a-carousel-header-row h2.a-carousel-heading.a-inline-block', cat => {
      return cat
      ?.textContent
      ?.toLowerCase()
      .replace('mais vendidos em', '')
      .trim() ?? 'Categoria não disponível.';
    })

    const products: CreateProductDTO[] = await page.$$eval('li.a-carousel-card', (productElements) => {
      return productElements.slice(0, 3).map((element, index) => {        
        
        const imgElement = element.querySelector('img.p13n-product-image')
        const imageUrl = imgElement?.getAttribute('src')?.trim() ?? 'Imagem não disponível';
        
        const name = imgElement?.getAttribute('alt')?.trim() ?? 'Nome não disponível';
        
        const productUrlElement = element.querySelector('div.p13n-sc-uncoverable-faceout a.a-link-normal[role="link"]');
        const rawUrl = productUrlElement?.getAttribute('href')?.trim() ?? '';
        const productUrl = rawUrl.startsWith('http') ? rawUrl : `https://www.amazon.com.br${rawUrl}`;
        
        const priceElement = element.querySelector('span._cDEzb_p13n-sc-price_3mJ9Z');
        const priceText = priceElement?.textContent?.trim() ?? '0';
        const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;        
    
        return {
          name,
          productUrl,
          price,
          ranking: index + 1,
          category: this.category,
          imageUrl,
        };
      });
    });
    

    await WebScraper.closeBrowser(browser);

    return products;
  }
}