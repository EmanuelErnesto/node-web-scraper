import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ProductThrows } from "../enums/ProductThrows.enum";
import { HttpNotFoundException } from "../exceptions/HttpNotFoundException";
import { ProductRepository, ProductRepositoryFactory } from "../repositories/ProductRepository";
import { S3Config } from "../config/S3Config";

export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepository, 
    private readonly s3Client: S3Client
  ) {}

  public async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if(!product) {
      throw new HttpNotFoundException(ProductThrows.PRODUCT_NOT_FOUND);
    }

    if(product.imageUrl.includes('amazonaws.com')) {
      const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME ?? 'nws-products-api-bucket',
        Key: `uploads/product--${product.productId}`,
      })

      await this.s3Client.send(command);
    }

    await this.productRepository.delete(id);

  }
}

export class DeleteProductServiceFactory {
  public static getServiceInstance(): DeleteProductService {
    const productRepository = ProductRepositoryFactory.getRepositoryInstance();
    const s3Client = S3Config.createS3Client();

    return new DeleteProductService(productRepository, s3Client);
  }
}