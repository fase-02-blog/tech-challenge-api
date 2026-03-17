import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { postRouter } from './posts/postRoutes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/posts', postRouter);

// Tratador de erro global (deve ser o último middleware)
app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'JSON malformado ou inválido' });
  }
  
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

export default app;
