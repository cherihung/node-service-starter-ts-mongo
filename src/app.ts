import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import {LOG_FORMAT} from './configs/constants';
import routes from './routes';

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(morgan(LOG_FORMAT));
app.use(cors(corsOptions));
console.log(LOG_FORMAT)
app.use('/', routes);

export default app;