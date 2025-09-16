import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	
	res.on('finish', () => {
		const duration = Date.now() - start;
		const logData = {
			method: req.method,
			url: req.url,
			status: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
			userAgent: req.get('User-Agent'),
			timestamp: new Date().toISOString()
		};
		
		if (res.statusCode >= 400) {
			console.error('Request Error:', logData);
		} else {
			console.log('Request:', logData);
		}
	});
	
	next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('Error occurred:', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
		timestamp: new Date().toISOString()
	});
	
	next(err);
};
