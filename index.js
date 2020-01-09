import '@babel/register';
import 'core-js/stable';
import 'regenerator-runtime';

import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App listening on :${PORT}!`))