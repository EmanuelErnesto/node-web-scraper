import { APIGatewayProxyResult } from "aws-lambda";
import { CustomApiGatewayProxyEvent } from "../domain/models/interfaces/CustomApiGatewayProxyEvent";
import { ProductModel } from "../domain/models/ProductModel";
import { BaseException } from "../exceptions/BaseException";
import { HttpInternalServerException } from "../exceptions/HttpInternalServerException";
import { GetProductsService, GetProductsServiceFactory } from "../services/GetProductsService";

class GetProductsHandler {
  constructor(
    private readonly getProductsService: GetProductsService
  ) {
  }

  public async processEvent(event: CustomApiGatewayProxyEvent): Promise<ProductModel[]> {

    return await this.getProductsService.execute();
  }
}

export async function handler (event: CustomApiGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const instance = GetProductsServiceFactory.getServiceInstance();

    const getProductsHandler = new GetProductsHandler(instance);
  
     const products = await getProductsHandler.processEvent(event);

     return { 
      statusCode: 200,
      body: JSON.stringify({data: products}),
      headers: { 'Content-Type': 'application/json' }
     };
  
    } catch (error) {
      console.error(`GetProductsHandlerError: ${error}`);
      
      if(error instanceof BaseException) {
        return {
          statusCode: error.code,
          body: JSON.stringify({ code: error.code, status: error.status, timestamp: error.timestamp, message: error.message, details: error.details ?? [],  }),
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