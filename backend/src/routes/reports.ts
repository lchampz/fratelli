import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const router = Router();

router.get('/stock', requireAuth, async (_req: Request, res: Response) => {
	const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
	res.json(products);
});

router.get('/capability', requireAuth, async (_req: Request, res: Response) => {
	const recipes = await prisma.recipe.findMany({ include: { ingredients: true } });
	const products = await prisma.product.findMany();
	const quantityByProduct: Record<string, number> = Object.fromEntries(
		products.map((p: { id: string; quantity: number }) => [p.id, p.quantity])
	);
	const capability = recipes.map((r: { id: string; name: string; ingredients: { productId: string; amount: number }[] }) => {
		let max = Infinity as number;
		for (const ing of r.ingredients) {
			const available = quantityByProduct[ing.productId] ?? 0;
			const possible = Math.floor(available / ing.amount);
			max = Math.min(max, Number.isFinite(possible) ? possible : 0);
		}
		return { recipeId: r.id, name: r.name, possible: Number.isFinite(max) ? max : 0 };
	});
	res.json(capability);
});

router.get('/history', requireAuth, async (_req: Request, res: Response) => {
	const history = await prisma.consumption.findMany({
		orderBy: { createdAt: 'desc' },
		include: { product: true },
	});
	res.json(history);
}); 