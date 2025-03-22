import { BaseException, ErrorDetails } from "./BaseException";

export class HttpUnprocessableEntityException extends BaseException {

  constructor(details: ErrorDetails[], message: string = 'Validation Error') {
    super(422, 'Unprocessable Entity', message)
    this.details = details;
  }
}