import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoDBConfig {
  public static createDynamoDBClient() {
    const client = new DynamoDBClient({});

    const dynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

    return dynamoDBDocumentClient;
  }
}