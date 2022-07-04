import type { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import { clientErrorHandler } from '../../helpers/errorHelper';

const requestor = new RetryRequest(PolicyType.handleType);
requestor.onListen();

/**
 * for handleType retry policy, we need to throw the upstream error
 * up to the retryHandler for the policy to evaluate
 * failure handling scenario: only retry Error instance error; serve upstream error code as is to client
 * useful to not try SyntaxError or ReferenceError
**/
export const handler = async (req: Request, res: Response) => {

  try {
    await requestor.retryHandler.execute(async () => {
      const data = await superagent.get('http://localhost:3000/api/tasks_static?code=403');
      const response = JSON.parse(data.text);
      res.json(response);
    });
  } catch (error) {
    clientErrorHandler(error, res)
  }
};


