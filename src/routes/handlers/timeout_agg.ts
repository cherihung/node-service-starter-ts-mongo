import type { Request, Response } from 'express';
import superagent from 'superagent';
import { TimeoutRequest, PolicyType } from '../../requestors/timeout';
import { clientErrorHandler } from '../../helpers/errorHelper';

const timeout = new TimeoutRequest(PolicyType.aggressive, 1000);

/**
 * for Aggressive timeout policy
 */

const getData = async (signal: AbortSignal) => {
  const data = await superagent.get('http://localhost:3000/api/tasks_timeout');
  console.log('handler aborted', signal.aborted)
  return data;
}

export const handler = async (req: Request, res: Response) => {
  timeout.onListen();
  try {
    const data = await timeout.handler.execute(async ({ signal }) => await getData(signal));
    const response = JSON.parse(data.text);
    res.json(response)
  } catch (error) {
    clientErrorHandler(error, res)
  }
}