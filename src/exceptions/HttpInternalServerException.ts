import { BaseException } from "./BaseException";

export class HttpInternalServerException extends BaseException {
  constructor(message: string) {
    super(500, 'Internal Server', message);
  }
}