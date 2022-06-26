import mongoose from 'mongoose';

mongoose.connection.on('connecting', () => {
  console.log('Mongo connecting')
});

mongoose.connection.on('connected', () => {
  console.log('Mongo connected');
});

mongoose.connection.on('disconnecting', () => {
  console.log('Mongo disconnecting');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongo disconnected');
});

export const connect = async () => {

  const url = process.env.MONGO_CONNECTION_STRING;
  console.info("MONGO_CONNECTION_STRING:" + process.env.MONGO_CONNECTION_STRING);

  await mongoose.connect(url)
}

export const disconnect = async () => {

  if (!mongoose.connection) {
    return;
  }

  await mongoose.disconnect();

};
