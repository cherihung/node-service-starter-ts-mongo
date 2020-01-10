import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import {LOG_LEVEL} from './configs/constants.js';
import routes from './routes/';

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(morgan(LOG_LEVEL));
app.use(cors(corsOptions));

app.use('/', routes);

export default app;
