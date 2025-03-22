import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ProductModel } from "../domain/models/ProductModel";
import { ProductMapper } from "../domain/mappers/ProductMapper";
import { DynamoDBConfig } from "../config/DynamoDBConfig";

export type DynamoProductEntity =  {
  PK: string;
  SK: string;
  productId: string;
  name: string;
  category: string;
  ranking: number;
  price: number;
  productUrl: string;
  imageUrl: string;
  createdAt: string;
}

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE ?? 'ProductsTable';

export class ProductRepository {
  private static instance: ProductRepository;
  
  private constructor(private readonly dynamoClient: DynamoDBDocumentClient) {}

  public static getInstance(dynamoClient: DynamoDBDocumentClient): ProductRepository {
    if(!this.instance) {
      this.instance = new ProductRepository(dynamoClient);
    }

    return this.instance;
  }

  public async create(data: ProductModel): Promise<void> {
    const productItem: DynamoProductEntity = {
      PK: 'Product',
      SK: `Product#${data.productId}`,
      ...data
    }

    const command = new PutCommand({
      TableName: PRODUCTS_TABLE,
      Item: productItem,
    })

    await this.dynamoClient.send(command);
  }

  public async findAll(): Promise<ProductModel[]> {
    const command = new QueryCommand({
      TableName: PRODUCTS_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ":pk": 'Product',
        ":sk": 'Product#'
      }
    });

    const response = await this.dynamoClient.send(command);

    if(!response.Items) {
      return [];
    }

    const products: DynamoProductEntity[] = response.Items as DynamoProductEntity[];

    const productModelList = ProductMapper.mappingFromDynamoProductEntityListToProductModel(products); 

    return productModelList;
  }

  public async findById(id: string): Promise<ProductModel | null> {
    const command = new GetCommand({
      TableName: PRODUCTS_TABLE,
      Key: {
        PK: 'Product',
        SK: `Product#${id}`
      }
    });

    const response = await this.dynamoClient.send(command);

    if(!response.Item) {
      return null;
    }

    const { SK, name, category, createdAt, imageUrl, price, ranking, productUrl  }: DynamoProductEntity = response.Item as DynamoProductEntity;

    return { 
      productId: SK.replace('Product#', '').trim(),
      name,
      category,
      price,
      ranking,
      productUrl,
      imageUrl,
      createdAt
    };
  }

  public async findByName(productName: string): Promise<ProductModel | null> {
    const command = new QueryCommand({
      TableName: PRODUCTS_TABLE,  
      IndexName: 'NameIndex',
      KeyConditionExpression: '#name = :name',
    ExpressionAttributeNames: {
      '#name': 'name'  
    },
    ExpressionAttributeValues: {
      ':name': productName 
    }
    });

    const response = await this.dynamoClient.send(command);

    if(!response.Items || response.Items.length === 0) {
      return null;
    }

    const { SK, name, category, createdAt, imageUrl, price, ranking, productUrl  }: DynamoProductEntity = response.Items[0] as DynamoProductEntity;

    return { 
      productId: SK.replace('Product#', '').trim(),
      name,
      category,
      price,
      ranking,
      productUrl,
      imageUrl,
      createdAt
    };
  }

  public async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: PRODUCTS_TABLE,
      Key: {
        PK: 'Product',
        SK: `Product#${id}`
      }
    });

    await this.dynamoClient.send(command);
  }

  public async updateProductImage(productId: string, imageUrl: string): Promise<{imageUrl: string}> {
    const command = new UpdateCommand({
      TableName: PRODUCTS_TABLE,
      Key: {
        PK: 'Product',
        SK: `Product#${productId}`,
      },
      ExpressionAttributeValues: {
        ':imageUrl': imageUrl,
      },
      UpdateExpression: 'SET imageUrl = :imageUrl'
    });

    await this.dynamoClient.send(command);

    return { imageUrl };
  }


}

export class ProductRepositoryFactory {
  static getRepositoryInstance() {
    const dynamoDBClient = DynamoDBConfig.createDynamoDBClient();

    return ProductRepository.getInstance(dynamoDBClient);
  }
}