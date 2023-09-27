import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import Logger from './services/logger';

dotenv.config();

const app = express();
const port = process.env.PORT;

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  Logger.info('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/account', routes.account);

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  Logger.info(`Server is listening on port ${port}`);
});
