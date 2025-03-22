import { CustomApiGatewayProxyEvent } from "../domain/models/interfaces/CustomApiGatewayProxyEvent";
import { productIdSchema, ProductIdSchemaType } from "../domain/schemas/product-id.schema";
import { BaseException } from "../exceptions/BaseException";
import { HttpInternalServerException } from "../exceptions/HttpInternalServerException";
import { SchemaSafeParse } from "../exceptions/SchemaSafeParse";
import { UploadProductImageService, UploadProductImageServiceFactory } from "../services/UploadProductImageService";

class UploadProductImageToS3Handler {
  constructor(
    private readonly updloadProductImageService: UploadProductImageService
  ) {
  }

  public async processEvent(event: CustomApiGatewayProxyEvent): Promise<{ imageUrl: string }> {
    const { id } = event.pathParameters;

    SchemaSafeParse<ProductIdSchemaType>(productIdSchema, { id });

    return await this.updloadProductImageService.execute(id);
  }
}

export async function handler(event: CustomApiGatewayProxyEvent) {
    try {
      const instance = UploadProductImageServiceFactory.getServiceInstance();

      const uploadProductImageToS3Handler = new UploadProductImageToS3Handler(instance);

      const imageUrl = await uploadProductImageToS3Handler.processEvent(event);
    
       return {
        statusCode: 200,
        body: JSON.stringify(imageUrl),
        headers: { 'Content-Type': 'application/json' } 
       };
    
      } catch (error) {
        console.error(`UploadProductImageHandlerError: ${error}`);
        
        if(error instanceof BaseException) {
          return {
            statusCode: error.code,
            body: JSON.stringify({ timestamp: error.timestamp, code: error.code, status: error.status, message: error.message, details: error.details ?? [],  }),
            headers: { 'Content-Type': 'application/json'}
          }
        }
        return {
          statusCode: 500,
          body: JSON.stringify(new HttpInternalServerException('Error while trying to upload image on s3 bucket.')),
          headers: { 'Content-Type': 'application/json' }
        }; 
      }
}