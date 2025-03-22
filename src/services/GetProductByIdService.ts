import { ProductModel } from "../domain/models/ProductModel";
import { ProductThrows } from "../enums/ProductThrows.enum";
import { HttpNotFoundException } from "../exceptions/HttpNotFoundException";
import { ProductRepository, ProductRepositoryFactory } from "../repositories/ProductRepository";

export class GetProductByIdService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute(id: string): Promise<ProductModel> {
    const product = await this.productRepository.findById(id);

    if(!product) {
      throw new HttpNotFoundException(ProductThrows.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}

export class GetProductByIdServiceFactory {
  public static getServiceInstance() {
    const productRepository = ProductRepositoryFactory.getRepositoryInstance();
    
    return new GetProductByIdService(productRepository);
  }
}