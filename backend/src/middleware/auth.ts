import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ message: 'Token ausente' });
	const token = auth.replace('Bearer ', '');
	try {
		jwt.verify(token, process.env.JWT_SECRET ?? 'devsecret');
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Token inválido' });
	}
} 