import { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import { ApiRemoteError, clientErrorHandler } from '../../helpers/errorHelper';

const requestor = new RetryRequest(PolicyType.handleResultType);
requestor.onListen();

export type retryResponseType = {
  response?: superagent.Response,
  text: string
}
/**
 * for handleWhenResultType retry policy, we should return either success or error from upstream as result
 * up to the retryHandler for the policy to evaluate
 * failure handling scenario: only retry custom ApiRemoteError instance; directly throw all other upstream error as is
**/
export const handler = async (req: Request, res: Response) => {
  try {
    const data: retryResponseType = await requestor.retryHandler.execute(async () => {
      try {
        // 401 to not retry; 404 to retry
        const resp = await superagent.get('http://localhost:3000/api/tasks_static?code=403');
        return resp;
      } catch (error) {
        // example of only retrying a group of errors by creating them as custom error instances
        if (error.status && error.status >= 300 && error.status < 500) {
          const typedError = new ApiRemoteError(error)
          return typedError
        }
        return error;
      }
    });
    const response = JSON.parse(data.text);
    res.json(response);
  } catch (error) {
    clientErrorHandler(error, res)
  }

};



