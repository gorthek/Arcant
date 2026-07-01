import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully on Render!' });
});

app.listen(port, () => {
  console.log(`[API] Server is listening on port ${port}`);
});
