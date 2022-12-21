import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dbConnection from './config/db-config.js';

dbConnection();

const app = express();
app.use(cors());

app.listen(() => console.log('port connected'));
