import type { Request, Response } from 'express';
import superagent from 'superagent';
import { BreakerRequest, BreakerType } from '../../requestors/breaker';
import { clientErrorHandler } from '../../helpers/errorHelper';
import { BrokenCircuitError } from 'cockatiel';

const breaker = new BreakerRequest(BreakerType.sampling);
// keep breaker listening across multiple requests, no Event.once
// and would need to call breaker.onListenDispose() to remove listeners
breaker.onListen();
/**
 * for sampling breaker policy, break if more than threshold of requests fail in a specified time window:
 * failure handling scenario: if failed during breaker triggered event, then return a success 200, do not throw to client
**/
export const handler = async (req: Request, res: Response) => {
  try {
    await breaker.handler.execute(async () => {
      const data = await superagent.get('http://localhost:3000/api/tasks_breaker');
      const response = JSON.parse(data.text);
      res.json(response);
    });
  } catch (error) {
    // return 200, do not send error back to client
    if (error instanceof BrokenCircuitError) {
      console.log('breaker induced error')
      res.status(200).json({ 'message': 'success no data' })
      return;
    }
    clientErrorHandler(error, res)
  }
};

