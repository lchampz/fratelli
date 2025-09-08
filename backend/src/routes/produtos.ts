import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
	res.json([]);
});

router.post('/', async (req, res) => {
	// TODO: criar produto
	res.status(201).json(req.body);
});

router.put('/:id', async (req, res) => {
	// TODO: atualizar produto
	res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', async (req, res) => {
	// TODO: remover produto
	res.status(204).send();
}); 