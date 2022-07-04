import type { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import { clientErrorHandler } from '../..//helpers/errorHelper';

const requestor = new RetryRequest(PolicyType.handleResult);
requestor.onListen();

/**
 * for handleWhenResult retry policy, we should return either success or error from upstream as result
 * up to the retryHandler for the policy to evaluate
 * failure handling scenario: only retry 404; directly throw all other upstream error as is
**/
export const handler = async (req: Request, res: Response) => {
  try {
    const data = await requestor.retryHandler.execute(async () => {
      try {
        // 401 to not retry; 404 to retry
        const data = await superagent.get('http://localhost:3000/api/tasks_static?code=404');
        return data;
      } catch (error) {
        return error;
      }
    });

    const response = JSON.parse(data.text);
    res.json(response);

  } catch (error) {
    clientErrorHandler(error, res)
  }
};


// export const handler = async (req: Request, res: Response) => {
//   try {
//     await requestor.retryHandler.execute(() => {
//       return superagent.get('http://localhost:3000/api/tasks_static')
//         .then((data) => {
//           return data;
//         })
//         .catch((err) => {
//           return err
//         })
//     });
//   } catch (err) {
//     // console.log(err)
//     res.status(200).send({ message: 'not found' })
//   }
// };

