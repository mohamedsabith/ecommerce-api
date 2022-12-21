import express from 'express';
import mongodbConnection from './config/db-config.js';

const app = express();
mongodbConnection();

export default app;
