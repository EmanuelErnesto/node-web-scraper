import { BaseException } from "./BaseException";

export class HttpNotFoundException extends BaseException{
  constructor(message: string) {
    super(404, 'Not Found', message);
  }
}