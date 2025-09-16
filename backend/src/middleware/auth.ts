import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler.js';

export interface AuthRequest extends Request {
	user?: {
		id: string;
		email: string;
	};
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const auth = req.headers.authorization;
	
	if (!auth) {
		return next(new CustomError('Token de acesso ausente', 401));
	}
	
	const token = auth.replace('Bearer ', '');
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		req.user = {
			id: decoded.sub,
			email: decoded.email
		};
		next();
	} catch (err) {
		if (err instanceof jwt.JsonWebTokenError) {
			return next(new CustomError('Token inválido', 401));
		}
		if (err instanceof jwt.TokenExpiredError) {
			return next(new CustomError('Token expirado', 401));
		}
		return next(new CustomError('Erro na autenticação', 401));
	}
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const auth = req.headers.authorization;
	
	if (!auth) {
		return next();
	}
	
	const token = auth.replace('Bearer ', '');
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		req.user = {
			id: decoded.sub,
			email: decoded.email
		};
	} catch (err) {
		// Ignore auth errors for optional auth
	}
	
	next();
} 