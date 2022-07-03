import { Request, Response } from 'express';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import superagent from 'superagent';

const requestor = new RetryRequest(PolicyType.handleResult);
requestor.onListen();

/**
 * for handleWhenResult retry policy, we need to return the response either success or error
 * up to the retryHandler for the policy to evaluate
**/
export const handler = async (req: Request, res: Response) => {
  try {
    let data = await requestor.retryHandler.execute(async () => {
      try {
        const data = await superagent.get('http://localhost:3000/api/tasks_static');
        return data;
      } catch (error) {
        return error;
      }
    });
    const response = JSON.parse(data.text);
    res.json(response);
  } catch (err) {
    // console.log(err)
    res.status(200).send({ message: 'not found' })
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

