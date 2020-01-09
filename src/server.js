import express from 'express';

const PORT = process.env.PORT;
const app = express();

app.listen(PORT, function () {
  console.log('Server listening on', PORT);
});