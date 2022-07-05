import { Response } from 'express';
import superagent from 'superagent';
import type { retryResponseType } from '../routes/handlers/retry_result_type';

export function clientErrorHandler(error: any, res: Response) {
  const statusCode = error.response?.statusCode || error.statusCode || 503;
  // console.log(error);
  res.status(statusCode).send({
    message: 'error occurred'
  })
}

export class ApiRemoteError implements retryResponseType {
  response: superagent.Response;
  text: string;

  constructor(error: superagent.ResponseError) {
    this.response = error.response;
    this.text = error.response.text;
  }
}