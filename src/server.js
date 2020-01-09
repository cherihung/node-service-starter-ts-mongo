import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();
/* 
set up all your server config here
*/
app.listen(PORT, function () {
  console.log('Server listening on', PORT);
});