export interface ErrorDetails {
  field: string | number;
  message: string;
}

export class BaseException extends Error{
  code: number;
  status: string;
  timestamp: string;
  details?: ErrorDetails[];

  constructor(code: number, status: string, message: string){
    super(message);
    this.code = code;
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}