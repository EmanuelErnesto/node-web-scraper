import { APIGatewayProxyEvent } from "aws-lambda";

export interface CustomApiGatewayProxyEvent extends APIGatewayProxyEvent {
  pathParameters: {
    id: string
  }
}