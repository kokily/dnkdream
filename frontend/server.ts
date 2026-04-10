import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 4000;

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get(/.*/, (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend Server is running on ${port} (Typescript)`);
});