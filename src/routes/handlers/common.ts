import { Request, Response } from 'express';

export const defaultSuccessHandler = (req: Request, res: Response) => {
  res.send();
};

export const healthCheckHandler = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
  });
};


