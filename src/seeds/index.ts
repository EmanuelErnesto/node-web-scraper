import { CreateProductDTO } from "../domain/dtos/CreateProductDTO";
import { CreateProductService, CreateProductServiceFactory } from "../services/CreateProductService";
import { AmazonCrawler } from "../webscraper/AmazonCrawler";

export async function ProductSeed () {
  const productDTOList: CreateProductDTO[] = await AmazonCrawler.getProductsData();
      const createProductService: CreateProductService = CreateProductServiceFactory.getServiceInstance();

        await Promise.all(
          productDTOList.map(async (product, index) => {
            try {
              const productInserted = await createProductService.execute(product);
              console.log(`Product ${index + 1} 
                Inserted with data:
                ${JSON.stringify(productInserted)}`);

            } catch (error) {
              console.error(`${ProductSeed.name}: An error has occurred while tried to ingest row ${index + 1} on dynamodb. ${error}`);
            }
          })
        );
}  

ProductSeed();