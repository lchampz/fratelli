import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	// Criar usuários
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

	// Criar produtos de confeitaria
	const produtos = [
		{ name: 'Farinha de Trigo', quantity: 5000, pricePerGram: 0.003 },
		{ name: 'Açúcar Refinado', quantity: 3000, pricePerGram: 0.004 },
		{ name: 'Manteiga', quantity: 2000, pricePerGram: 0.025 },
		{ name: 'Ovos', quantity: 120, pricePerGram: 0.008 },
		{ name: 'Leite', quantity: 2000, pricePerGram: 0.002 },
		{ name: 'Chocolate em Pó', quantity: 1500, pricePerGram: 0.015 },
		{ name: 'Fermento em Pó', quantity: 500, pricePerGram: 0.020 },
		{ name: 'Baunilha', quantity: 200, pricePerGram: 0.150 },
		{ name: 'Coco Ralado', quantity: 800, pricePerGram: 0.012 },
		{ name: 'Amêndoas', quantity: 1000, pricePerGram: 0.035 },
		{ name: 'Avelãs', quantity: 600, pricePerGram: 0.040 },
		{ name: 'Cacau em Pó', quantity: 1200, pricePerGram: 0.018 },
		{ name: 'Creme de Leite', quantity: 1500, pricePerGram: 0.008 },
		{ name: 'Leite Condensado', quantity: 1000, pricePerGram: 0.010 },
		{ name: 'Gelatina', quantity: 300, pricePerGram: 0.080 },
		{ name: 'Corante Alimentício', quantity: 100, pricePerGram: 0.200 },
		{ name: 'Açúcar de Confeiteiro', quantity: 800, pricePerGram: 0.006 },
		{ name: 'Margarina', quantity: 1500, pricePerGram: 0.012 },
		{ name: 'Óleo de Soja', quantity: 1000, pricePerGram: 0.005 },
		{ name: 'Sal', quantity: 200, pricePerGram: 0.001 },
	];

	for (const produto of produtos) {
		const existingProduct = await prisma.product.findFirst({
			where: { name: produto.name }
		});
		
		if (existingProduct) {
			await prisma.product.update({
				where: { id: existingProduct.id },
				data: { 
					quantity: produto.quantity,
					pricePerGram: produto.pricePerGram
				}
			});
		} else {
			await prisma.product.create({
				data: produto,
			});
		}
	}

	// Criar receitas
	const receitas = [
		{
			name: 'Bolo de Chocolate',
			ingredients: [
				{ name: 'Farinha de Trigo', amount: 300 },
				{ name: 'Açúcar Refinado', amount: 200 },
				{ name: 'Chocolate em Pó', amount: 100 },
				{ name: 'Ovos', amount: 3 },
				{ name: 'Leite', amount: 200 },
				{ name: 'Óleo de Soja', amount: 100 },
				{ name: 'Fermento em Pó', amount: 15 },
			],
		},
		{
			name: 'Cupcake de Baunilha',
			ingredients: [
				{ name: 'Farinha de Trigo', amount: 200 },
				{ name: 'Açúcar Refinado', amount: 150 },
				{ name: 'Manteiga', amount: 100 },
				{ name: 'Ovos', amount: 2 },
				{ name: 'Leite', amount: 100 },
				{ name: 'Baunilha', amount: 5 },
				{ name: 'Fermento em Pó', amount: 10 },
			],
		},
		{
			name: 'Torta de Morango',
			ingredients: [
				{ name: 'Farinha de Trigo', amount: 250 },
				{ name: 'Açúcar Refinado', amount: 100 },
				{ name: 'Manteiga', amount: 150 },
				{ name: 'Ovos', amount: 2 },
				{ name: 'Creme de Leite', amount: 300 },
				{ name: 'Gelatina', amount: 20 },
			],
		},
		{
			name: 'Brigadeiro Gourmet',
			ingredients: [
				{ name: 'Leite Condensado', amount: 400 },
				{ name: 'Chocolate em Pó', amount: 50 },
				{ name: 'Manteiga', amount: 20 },
				{ name: 'Avelãs', amount: 30 },
			],
		},
		{
			name: 'Pão de Mel',
			ingredients: [
				{ name: 'Farinha de Trigo', amount: 400 },
				{ name: 'Açúcar Refinado', amount: 150 },
				{ name: 'Mel', amount: 200 },
				{ name: 'Ovos', amount: 2 },
				{ name: 'Leite', amount: 150 },
				{ name: 'Canela', amount: 10 },
				{ name: 'Fermento em Pó', amount: 15 },
			],
		},
	];

	for (const receita of receitas) {
		const createdRecipe = await prisma.recipe.create({
			data: { name: receita.name },
		});

		// Adicionar ingredientes
		for (const ingrediente of receita.ingredients) {
			const produto = await prisma.product.findFirst({
				where: { name: ingrediente.name },
			});

			if (produto) {
				await prisma.recipeIngredient.create({
					data: {
						recipeId: createdRecipe.id,
						productId: produto.id,
						amount: ingrediente.amount,
					},
				});
			}
		}
	}

	// Criar histórico de consumo
	const consumos = [
		{ productName: 'Farinha de Trigo', amount: 500, reason: 'Produção de bolos' },
		{ productName: 'Açúcar Refinado', amount: 300, reason: 'Preparação de doces' },
		{ productName: 'Chocolate em Pó', amount: 200, reason: 'Brigadeiros gourmet' },
		{ productName: 'Ovos', amount: 24, reason: 'Produção diária' },
		{ productName: 'Leite', amount: 1000, reason: 'Receitas diversas' },
		{ productName: 'Manteiga', amount: 400, reason: 'Cupcakes e tortas' },
		{ productName: 'Creme de Leite', amount: 600, reason: 'Tortas especiais' },
		{ productName: 'Leite Condensado', amount: 800, reason: 'Brigadeiros' },
		{ productName: 'Coco Ralado', amount: 200, reason: 'Doces tropicais' },
		{ productName: 'Amêndoas', amount: 150, reason: 'Decorações' },
	];

	for (const consumo of consumos) {
		const produto = await prisma.product.findFirst({
			where: { name: consumo.productName },
		});

		if (produto) {
			await prisma.consumption.create({
				data: {
					productId: produto.id,
					amount: consumo.amount,
					reason: consumo.reason,
					createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
				},
			});
		}
	}

	console.log('🌱 Seed concluído:');
	console.log('👥 Usuários: admin e teste criados');
	console.log('📦 Produtos: 20 ingredientes de confeitaria');
	console.log('🍰 Receitas: 5 receitas populares');
	console.log('📊 Histórico: 10 movimentações de estoque');
}

main()
	.catch((e) => {
		console.error(e);
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	}); 