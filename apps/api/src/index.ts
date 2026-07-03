import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect } from '@arcant/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import { Request, Response } from 'express';

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running successfully on Render!' });
});

import botRoutes from './routes/bot.routes';
import serverRoutes from './routes/server.routes';
import templateRoutes from './routes/template.routes';

app.use('/api/bots', botRoutes);
app.use('/api/server', serverRoutes);
app.use('/api/templates', templateRoutes);

dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`[API] Server is listening on port ${port}`);
  });
}).catch(console.error);
