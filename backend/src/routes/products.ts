import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { paginationMiddleware, createPaginationResponse } from '../middleware/pagination.js';
import { validateProduct, handleValidationErrors } from '../middleware/validation.js';
import { CustomError } from '../middleware/errorHandler.js';

export const router = Router();

router.get('/', requireAuth, paginationMiddleware(), async (req: Request, res: Response, next) => {
	try {
		const { skip, limit, sortBy, sortOrder } = req.pagination!;
		
		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where: { deletedAt: null },
				skip,
				take: limit,
				orderBy: { [sortBy]: sortOrder },
			}),
			prisma.product.count({ where: { deletedAt: null } })
		]);

		const response = createPaginationResponse(
			products,
			total,
			req.pagination!.page,
			req.pagination!.limit
		);

		res.json({
			success: true,
			...response
		});
	} catch (error) {
		next(error);
	}
});

router.post('/', requireAuth, validateProduct, handleValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, quantity } = req.body as { name: string; quantity?: number };
		
		const created = await prisma.product.create({ 
			data: { name, quantity: quantity ?? 0 },
			select: { id: true, name: true, quantity: true, createdAt: true }
		});
		
		res.status(201).json({
			success: true,
			message: 'Produto criado com sucesso',
			data: created
		});
	} catch (error) {
		next(error);
	}
});

router.put('/:id', requireAuth, validateProduct, handleValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { name, quantity } = req.body as { name?: string; quantity?: number };
		
		const updated = await prisma.product.update({ 
			where: { id }, 
			data: { name, quantity },
			select: { id: true, name: true, quantity: true, updatedAt: true }
		});
		
		res.json({
			success: true,
			message: 'Produto atualizado com sucesso',
			data: updated
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes('Record to update not found')) {
			return next(new CustomError('Produto não encontrado', 404));
		}
		next(error);
	}
});

router.delete('/:id', requireAuth, async (req: Request, res: Response, next) => {
	try {
		const { id } = req.params;
		
		// Soft delete
		await prisma.product.update({
			where: { id },
			data: { deletedAt: new Date() }
		});
		
		res.json({
			success: true,
			message: 'Produto removido com sucesso'
		});
	} catch (error) {
		if (error instanceof Error && error.message.includes('Record to update not found')) {
			return next(new CustomError('Produto não encontrado', 404));
		}
		next(error);
	}
}); 