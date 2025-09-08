import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
	res.json([]);
});

router.post('/', async (req, res) => {
	res.status(201).json(req.body);
});

router.put('/:id', async (req, res) => {
	res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', async (_req, res) => {
	res.status(204).send();
});

router.post('/:id/preparar', async (req, res) => {
	// TODO: descontar ingredientes do inventário
	res.json({ receitaId: req.params.id, status: 'preparada' });
}); 