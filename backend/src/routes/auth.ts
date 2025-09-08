import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

export const router = Router();

router.post('/register', async (req: Request, res: Response) => {
	const { email, password } = req.body as { email: string; password: string };
	if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
	const exists = await prisma.user.findUnique({ where: { email } });
	if (exists) return res.status(409).json({ message: 'Usuário já existe' });
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({ data: { email, passwordHash } });
	res.status(201).json({ id: user.id, email: user.email });
});

router.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body as { email: string; password: string };
	if (!email || !password) return res.status(400).json({ message: 'Credenciais inválidas' });
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
	const token = jwt.sign({ sub: user.id, email }, process.env.JWT_SECRET ?? 'devsecret', { expiresIn: '1d' });
	res.json({ token, user: { id: user.id, email: user.email } });
});

router.get('/me', (req: Request, res: Response) => {
	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ message: 'Token ausente' });
	const token = auth.replace('Bearer ', '');
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'devsecret');
		res.json({ user: payload });
	} catch {
		res.status(401).json({ message: 'Token inválido' });
	}
}); 