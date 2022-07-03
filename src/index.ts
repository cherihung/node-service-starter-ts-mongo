import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { connect as mongodbConnect } from './database';
import { LOG_FORMAT, PORT } from './configs/constants';
import routes from './routes';

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(morgan(LOG_FORMAT));
app.use(cors(corsOptions));

app.use('/', routes);

// mongodbConnect().catch((err) => {
//   console.log(err)
// })

app.listen(PORT, () => console.log(`App listening on :${PORT}!`));
