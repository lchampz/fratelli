import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	const adminEmail = 'admin@fratelli.com';
	const testEmail = 'teste@fratelli.com';

	const adminPasswordHash = await bcrypt.hash('admin123', 10);
	const testPasswordHash = await bcrypt.hash('teste123', 10);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			email: adminEmail,
			passwordHash: adminPasswordHash,
		},
	});

	await prisma.user.upsert({
		where: { email: testEmail },
		update: {},
		create: {
			email: testEmail,
			passwordHash: testPasswordHash,
		},
	});

	console.log('Seed concluído: admin e teste criados.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	}); 