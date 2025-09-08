import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const router = Router();

router.get('/', requireAuth, async (_req: Request, res: Response) => {
	const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
	res.json(products);
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
	const { name, quantity } = req.body as { name: string; quantity?: number };
	if (!name) return res.status(400).json({ message: 'Nome é obrigatório' });
	const created = await prisma.product.create({ data: { name, quantity: quantity ?? 0 } });
	res.status(201).json(created);
});

router.put('/:id', requireAuth, async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, quantity } = req.body as { name?: string; quantity?: number };
	try {
		const updated = await prisma.product.update({ where: { id }, data: { name, quantity } });
		res.json(updated);
	} catch {
		res.status(404).json({ message: 'Produto não encontrado' });
	}
});

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await prisma.product.delete({ where: { id } });
		res.status(204).send();
	} catch {
		res.status(404).json({ message: 'Produto não encontrado' });
	}
}); 