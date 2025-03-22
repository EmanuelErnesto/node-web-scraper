import { HttpInternalServerException } from "../exceptions/HttpInternalServerException";
import { SchemaSafeParse } from "../exceptions/SchemaSafeParse";
import { ProductIdSchemaType, productIdSchema } from "../domain/schemas/product-id.schema";
import { GetProductByIdService, GetProductByIdServiceFactory } from "../services/GetProductByIdService";
import { BaseException } from "../exceptions/BaseException";
import { CustomApiGatewayProxyEvent } from "../domain/models/interfaces/CustomApiGatewayProxyEvent";
import { APIGatewayProxyResult } from "aws-lambda";
import { ProductModel } from "../domain/models/ProductModel";

class GetProductByIdHandler {
  constructor(
    private readonly getProductByIdService: GetProductByIdService
  ) {}

  public async processEvent(event: CustomApiGatewayProxyEvent): Promise<ProductModel> {
    const { id } = event.pathParameters;

    SchemaSafeParse<ProductIdSchemaType>(productIdSchema, { id });

    return await this.getProductByIdService.execute(id);
  }
}

export async function handler (event: CustomApiGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const instance = GetProductByIdServiceFactory.getServiceInstance();

    const getProductByIdHandler = new GetProductByIdHandler(instance);
  
    const product = await getProductByIdHandler.processEvent(event);
  
     return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' } 
     };
  
    } catch (error) {
      console.error(`GetProductByIdHandlerError: ${error}`);
      
      if(error instanceof BaseException) {
        return {
          statusCode: error.code,
          body: JSON.stringify({ timestamp: error.timestamp, code: error.code, status: error.status, message: error.message, details: error.details ?? [],  }),
          headers: { 'Content-Type': 'application/json'}
        }
      }
      return {
        statusCode: 500,
        body: JSON.stringify(new HttpInternalServerException('Error while trying to get product by id.')),
        headers: { 'Content-Type': 'application/json' }
      }; 
    }
}