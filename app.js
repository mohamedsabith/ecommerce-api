import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import mongodbConnection from './config/db-config.js';

const app = express();
mongodbConnection();

// Sets the middlewares.
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Attempts to find the empty URL on this server.
app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
