import { APIGatewayProxyResult } from "aws-lambda";
import { productIdSchema, ProductIdSchemaType } from "../domain/schemas/product-id.schema";
import { BaseException } from "../exceptions/BaseException";
import { HttpInternalServerException } from "../exceptions/HttpInternalServerException";
import { SchemaSafeParse } from "../exceptions/SchemaSafeParse";
import { DeleteProductService, DeleteProductServiceFactory } from "../services/DeleteProductService";
import { CustomApiGatewayProxyEvent } from "../domain/models/interfaces/CustomApiGatewayProxyEvent";

class DeleteProductHandler {
  constructor(
    private readonly deleteProductService: DeleteProductService
  ) {}

  public async processEvent(event: CustomApiGatewayProxyEvent) {
    const { id } = event.pathParameters;

    SchemaSafeParse<ProductIdSchemaType>(productIdSchema, { id } );

    await this.deleteProductService.execute(id);
  }
}

export async function handler (event: CustomApiGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const instance = DeleteProductServiceFactory.getServiceInstance();

    const deleteProductHandler = new DeleteProductHandler(instance);
  
    await deleteProductHandler.processEvent(event);
  
    return  {
      statusCode: 204,
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    };
  
    } catch (error) {
      console.error(`DeleteProductHandlerError: ${error}`);
      
      if(error instanceof BaseException) {
        return {
          statusCode: error.code,
          body: JSON.stringify({ timestamp: error.timestamp, code: error.code, status: error.status, message: error.message, details: error.details ?? [],  }),
          headers: { 'Content-Type': 'application/json'}
        }
      }
      
      const response = new HttpInternalServerException('Error while trying to delete product by id.')

      return {
        statusCode: 500,
        body: JSON.stringify({
          timestamp: response.timestamp,
          code: response.code,
          status: response.status,
          message: response.message
        }),
        headers: { 'Content-Type': 'application/json' }
      }; 
    }
}