import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('UnhandledRejection', () => {
  console.log(
    `🤬UnhandledPromiseRejection is found. Shutting down the server!!...`,
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit();
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is found. Shutting down the server!!...`);
  process.exit(1)
});
