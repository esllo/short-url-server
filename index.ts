import express, { NextFunction, Request, Response } from 'express';
import mongo from './helper/mongo';
import routes from './routes';
import cors from 'cors';

const app = express();

mongo();

app.use(cors());
app.use(express.json());
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error !== null) {
    return response.status(400).json({ status: 400, message: 'invalid json' });
  }
  return next();
});
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(5082, () => {
  console.log('listen');
});
