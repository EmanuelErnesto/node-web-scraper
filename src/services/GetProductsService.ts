  import { ProductModel } from "../domain/models/ProductModel";
  import { ProductRepository, ProductRepositoryFactory } from "../repositories/ProductRepository";

  export class GetProductsService {
    constructor(private readonly productRepository: ProductRepository) {}

    public async execute(): Promise<ProductModel[]> {
      return await this.productRepository.findAll();
    }
  }

  export class GetProductsServiceFactory {
    public static getServiceInstance() {
      const productRepository = ProductRepositoryFactory.getRepositoryInstance();

      return new GetProductsService(productRepository);
    }
  }