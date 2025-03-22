import { S3Client } from "@aws-sdk/client-s3";

export class S3Config {
  public static createS3Client() {
    const client = new S3Client();

    return client;
  }
}