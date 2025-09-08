import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import { router as authRouter } from './routes/auth.js';
import { router as productsRouter } from './routes/products.js';
import { router as recipesRouter } from './routes/recipes.js';
import { router as reportsRouter } from './routes/reports.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
	res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/recipes', recipesRouter);
app.use('/reports', reportsRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
	console.log(`API running at http://localhost:${PORT}`);
}); 