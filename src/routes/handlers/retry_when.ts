import { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../requestors/retry';
import { clientErrorHandler } from '../../helpers/errorHelper';

const retry = new RetryRequest(PolicyType.handleWhen);
/**
 * for handleWhen retry policy, we should handle success and error as normal request from upstream
 * up to the handler for the policy to evaluate
 * failure handling scenario: only retry error instance Error; serve upstream error code as is to client
**/
export const handler = async (req: Request, res: Response) => {

  try {
    retry.onListen();
    await retry.handler.execute(async () => {
      const data = await superagent.get('http://localhost:3000/api/tasks_retry?code=401');
      const response = JSON.parse(data.text);
      res.json(response);
    });
  } catch (error) {
    clientErrorHandler(error, res)
  }
};


