import { Router } from 'express';

export const router = Router();

router.get('/estoque', async (_req, res) => {
	res.json({ labels: [], datasets: [] });
});

router.get('/possibilidades', async (_req, res) => {
	res.json([]);
});

router.get('/historico', async (_req, res) => {
	res.json([]);
}); 