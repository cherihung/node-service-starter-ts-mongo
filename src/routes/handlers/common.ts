export const defaultSuccessHandler = (req: any, res: { send: () => void; }) => {
  res.send();
};

export const healthCheckHandler = (req: any, res: { json: (arg0: { status: string; }) => void; }) => {
  res.json({
    status: 'healthy',
  });
};

