import type { Request, Response } from 'express';
import superagent from 'superagent';
import { RetryRequest, PolicyType } from '../../requestors/retry';
import { clientErrorHandler } from '../../helpers/errorHelper';

const retry = new RetryRequest(PolicyType.handleResult);

/**
 * for handleWhenResult retry policy, we should return either success or error from upstream as result
 * up to the handler for the policy to evaluate
 * failure handling scenario: only retry 404; directly throw all other upstream error as is
**/
export const handler = async (req: Request, res: Response) => {
  try {
    retry.onListen();
    const data = await retry.handler.execute(async () => {
      try {
        // 404 to retry
        const resp = await superagent.get('http://localhost:3000/api/tasks_retry');
        return resp;
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
//     await retry.handler.execute(() => {
//       return superagent.get('http://localhost:3000/api/tasks_retry')
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

