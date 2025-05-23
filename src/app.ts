import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleWares/globalErrorHandler';
import NotFound from './app/middleWares/notFound';
import router from './app/routes';

const app: Application = express();

//PARSER
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173']
}));

//application route
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send(`Hello World!! from ${a}`);
};
app.get('/', test);

app.use(globalErrorHandler);

//NOT FOUND
app.use(NotFound);

export default app;
