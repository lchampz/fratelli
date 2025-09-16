import rateLimit from 'express-rate-limit';

// Rate limiting para autenticação
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 5, // máximo 5 tentativas por IP
	message: {
		message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Rate limiting geral para API
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // máximo 100 requests por IP
	message: {
		message: 'Muitas requisições. Tente novamente em 15 minutos.'
	},
	standardHeaders: true,
	legacyHeaders: false,
});
