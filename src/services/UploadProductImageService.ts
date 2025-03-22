import { S3Client } from "@aws-sdk/client-s3";
import { ProductRepository, ProductRepositoryFactory } from "../repositories/ProductRepository";
import { HttpNotFoundException } from "../exceptions/HttpNotFoundException";
import { ProductThrows } from "../enums/ProductThrows.enum";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { get as httpGetRequest } from 'http';
import { get as httpsGetRequest } from 'https';
import { S3Config } from "../config/S3Config";
import { HttpBadRequestException } from "../exceptions/HttpBadRequestException";

const BUCKET_NAME = process.env.BUCKET_NAME ?? 'nws-products-api-bucket';

export class UploadProductImageService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly s3Client: S3Client
  ) {}

  public async execute(productId: string): Promise<{ imageUrl: string }> {
    const product = await this.productRepository.findById(productId);

    if(!product) {
      throw new HttpNotFoundException(ProductThrows.PRODUCT_NOT_FOUND);
    }

    if(product.imageUrl.includes('amazonaws.com')) {
      throw new HttpBadRequestException(ProductThrows.IMAGE_ALREADY_ON_S3);
    }

    const imageBuffer = await this.getImageBuffer(product.imageUrl);
    const uploadKey = `uploads/product--${product.productId}`

    await this.uploadImageToS3(imageBuffer, uploadKey);

    const newImageUrl = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${uploadKey}`;

    await this.productRepository.updateProductImage(productId, newImageUrl);

    return { imageUrl: newImageUrl};
  }

  private async uploadImageToS3(file: Buffer, uploadKey: string) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      Body: file,
      ContentType: 'image/jpg'
    })

    await this.s3Client.send(command);
  }

  private async getImageBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const data: Uint8Array[] = [];
      const createRequest = url.startsWith('https') ? httpsGetRequest : httpGetRequest

      createRequest(url, async (response) => {
        if(response.statusCode === 200) {
          response.on('data', (chunk: Uint8Array) => {
            data.push(chunk);
          })
          .on('end', () => {
            resolve(Buffer.concat(data))
          })
          .on('error', (err) => {
            reject(err)
          })
          return;
        }
        
        reject(`Request returned with status: ${response.statusCode}`);
      })
    })
  }

}

export class UploadProductImageServiceFactory {
  public static getServiceInstance(): UploadProductImageService {
    const productRepository = ProductRepositoryFactory.getRepositoryInstance();
    const s3Client = S3Config.createS3Client();

    return new UploadProductImageService(productRepository, s3Client);
  }
}