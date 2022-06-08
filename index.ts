import express, { NextFunction, Request, Response } from 'express';
import mongo from './helper/mongo';
import routes from './routes';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import reateLimit, { rateLimit } from 'express-rate-limit';

const base = '/etc/letsencrypt/live/zori.ga';
const credentials = {
  key: fs.readFileSync(`${base}/privkey.pem`),
  cert: fs.readFileSync(`${base}/cert.pem`),
  ca: fs.readFileSync(`${base}/chain.pem`)
};

const index = fs.readFileSync('./assets/index.html', 'utf-8');

const app = express();

mongo();

const limiter = rateLimit({
  windowMs: 60000, // 1 min
  max: 150, // 3 times
  standardHeaders: true, // Return RateLimit header
});

app.enable('trust proxy');
app.use(limiter);
app.use((request: Request, response: Response, next: NextFunction) => {
  request.secure ? next() : response.redirect(`https://${request.headers.host}${request.url}`);
});
app.use(cors());
app.use(express.json());
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error !== null) {
    return response.status(400).json({ status: 400, message: 'invalid json' });
  }
  return next();
});
app.get('/', (request, response: Response) => {
  response.set('Content-Type', 'text/html');
  response.send(index);
  response.end();
});
app.use(express.urlencoded({ extended: true }));
app.use(routes);

http.createServer(app).listen(80);
https.createServer(credentials, app).listen(443);