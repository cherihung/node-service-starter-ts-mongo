import { Request, Response } from 'express';
import { RetryRequest, PolicyType } from '../../helpers/retryHelpers';
import superagent from 'superagent';

const requestor = new RetryRequest(PolicyType.handleAll);
requestor.onListen();

export const handler = async (req: Request, res: Response) => {
  try {
    await requestor.retryHandler.execute(async () => {
      const data = await superagent.get('http://localhost:3000/api/tasks_static');
      const response = JSON.parse(data.text);
      res.json(response);
    });
  } catch (error) {
    //    console.log('error', error)
    res.status(200).send({ message: 'not found' })
  }
};

