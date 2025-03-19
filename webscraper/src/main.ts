import { GetProducts } from "./get-product-data";
import { IProduct } from "./interfaces/product.interface";

export async function bootstrap() {
  const products: IProduct[] = await GetProducts('https://www.amazon.com.br/bestsellers');

  console.log('Três primeiros produtos mais vendidos na Amazon:');
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${JSON.stringify(product)}`);
  });
} 

bootstrap();
