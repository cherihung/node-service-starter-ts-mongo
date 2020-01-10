export const defaultSuccessHandler = (req, res) => {
  res.send();
};

export const healthCheckHandler = (req, res) => {
  res.json({
    status: 'healthy',
  });
};

