import { DynamoProductEntity } from "../../repositories/ProductRepository";
import { CreateProductDTO } from "../dtos/CreateProductDTO";
import { ProductModel } from "../models/ProductModel";

export class ProductMapper {
  public static mappingFromCreateProductDTOToProductModel(
    {name, price, productUrl, category, ranking, imageUrl }: CreateProductDTO): ProductModel 
    {
    return new ProductModel(name, category, ranking, price,  productUrl, imageUrl);
  }

  public static mappingFromDynamoProductEntityToProductModel(dynamoProductEntity: DynamoProductEntity): ProductModel {
    return {
      productId: dynamoProductEntity.SK.replace('Product#', '').trim(),
      name: dynamoProductEntity.name,
      category: dynamoProductEntity.category,
      price: dynamoProductEntity.price,
      ranking: dynamoProductEntity.ranking,
      productUrl: dynamoProductEntity.productUrl,
      imageUrl: dynamoProductEntity.imageUrl,
      createdAt: dynamoProductEntity.createdAt
    }
  }

  public static mappingFromDynamoProductEntityListToProductModel(dynamoProductList: DynamoProductEntity[]): ProductModel[] {
    const productModelList: ProductModel[] = dynamoProductList.map(product => {
      return this.mappingFromDynamoProductEntityToProductModel(product);
    });

    return productModelList;
    }
}