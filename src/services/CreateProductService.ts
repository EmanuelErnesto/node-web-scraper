import { CreateProductDTO } from "../domain/dtos/CreateProductDTO";
import { ProductMapper } from "../domain/mappers/ProductMapper";
import { ProductModel } from "../domain/models/ProductModel";
import { HttpBadRequestException } from "../exceptions/HttpBadRequestException";
import { ProductRepository, ProductRepositoryFactory } from "../repositories/ProductRepository";

export class CreateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute(createProductDTO: CreateProductDTO): Promise<ProductModel> {

    const productNameAlreadyExists = await this.productRepository.findByName(createProductDTO.name);

    if(productNameAlreadyExists) {
      if(productNameAlreadyExists.ranking === createProductDTO.ranking) {
          throw new HttpBadRequestException(`
          A product with name: ${createProductDTO.name} 
          and ranking: ${createProductDTO.ranking} already exists in the database.
          `);
      }
      productNameAlreadyExists.ranking = createProductDTO.ranking;
    }

    const product = ProductMapper.mappingFromCreateProductDTOToProductModel(createProductDTO);

    await this.productRepository.create(product);

    return product;
  }
}

export class CreateProductServiceFactory {
  public static getServiceInstance() {
    const productRepository = ProductRepositoryFactory.getRepositoryInstance();
    
    const serviceInstance = new CreateProductService(productRepository);

    return serviceInstance;
  }
}