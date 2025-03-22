import { BaseException } from "./BaseException";

export class HttpBadRequestException extends BaseException {
  constructor(message: string) {
    super(400, 'Bad Request', message);
  }
}