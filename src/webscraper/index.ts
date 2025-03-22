import puppeteer, { Browser, Page } from "puppeteer";

export class WebScraper {
  public static async initBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: ['--start-maximized']
    });
  }

  public static async createPage(browser: Browser): Promise<Page> {
    return await browser.newPage();
  }

  public static async accessUrl(page: Page, url: string): Promise<void> {
    await page.setViewport({width: 1920, height: 1080});
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public static async closeBrowser(browser: Browser): Promise<void> {
    await browser.close();
  }
}


