import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';

const app: Application = express();

//PARSER
app.use(express.json());
app.use(cors());

//application route
app.use('/api/v1/students', StudentRoutes);

const getAControler = (req: Request, res: Response) => {
  res.send('Hello World!!');
};
app.get('/', getAControler);

export default app;
