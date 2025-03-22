import { randomUUID } from "crypto";
import { formatInTimeZone } from 'date-fns-tz';

export class ProductModel {
  productId: string;
  name: string;
  category: string;
  ranking: number;
  price: number;
  productUrl: string;
  imageUrl: string;
  createdAt: string;

  constructor(name: string, category: string, ranking: number, price: number, productUrl: string, imageUrl: string, productId?: string) {
    this.productId = productId ?? randomUUID();
    this.name = name;
    this.category = category;
    this.ranking = ranking;
    this.price = price;
    this.productUrl = productUrl;
    this.imageUrl = imageUrl;
    this.createdAt = formatInTimeZone(new Date(), 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
  }
}