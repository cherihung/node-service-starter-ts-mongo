import type { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import { clientErrorHandler } from '../..//helpers/errorHelper';

const requestor = new RetryRequest(PolicyType.handleAll);
requestor.onListen();

/**
 * for handleAll retry policy, we should handle success and error as normal request from upstream
 * failure handling scenario: retry all error; serve upstream error code as is to client
**/
export const handler = async (req: Request, res: Response) => {
  try {
    await requestor.retryHandler.execute(async () => {
      const data = await superagent.get('http://localhost:3000/api/tasks_static');
      const response = JSON.parse(data.text);
      res.json(response);
    });
  } catch (error) {
    clientErrorHandler(error, res)
  }
};

