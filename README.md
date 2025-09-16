# Fratelli - Sistema de Gestão de Receitas

Sistema completo para gestão de produtos, receitas e controle de estoque para produção de alimentos.

## 🚀 Funcionalidades

- **Autenticação**: Sistema seguro de login/registro com JWT
- **Gestão de Produtos**: CRUD completo com controle de estoque
- **Gestão de Receitas**: Criação e preparação de receitas
- **Controle de Consumo**: Rastreamento automático de consumo de ingredientes
- **Relatórios**: Dashboard com métricas e gráficos
- **Soft Delete**: Auditoria completa com exclusão lógica
- **Paginação**: Performance otimizada para grandes volumes de dados

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM e migrações
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **express-rate-limit** - Rate limiting

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Hook Form** + **Zod** - Formulários e validação
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos
- **Sonner** - Notificações

### DevOps
- **Docker** + **Docker Compose**
- **ESLint** + **Prettier** - Qualidade de código
- **Jest** - Testes

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (ou usar Docker)

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <repository-url>
cd fratelli
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example backend/.env
# Edite o arquivo .env com suas configurações
```

### 3. Instale as dependências
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 4. Configure o banco de dados
```bash
# Com Docker
docker-compose up -d db

# Execute as migrações
npm run db:migrate

# Popule o banco com dados iniciais
npm run db:seed
```

### 5. Execute o projeto

#### Desenvolvimento
```bash
# Executa backend e frontend simultaneamente
npm run dev

# Ou execute separadamente
npm run dev:backend  # http://localhost:3000
npm run dev:frontend # http://localhost:5173
```

#### Produção com Docker
```bash
# Build e execução completa
docker-compose up -d

# Acesse:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5433
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Testes do backend
npm --prefix backend run test

# Testes em modo watch
npm --prefix backend run test:watch
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Executa backend e frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Build
npm run build            # Build completo

# Docker
npm run start            # Inicia com Docker
npm run stop             # Para containers

# Qualidade de código
npm run lint             # Verifica linting
npm run lint:fix         # Corrige problemas de linting
npm run format           # Formata código
npm run format:check     # Verifica formatação

# Banco de dados
npm run db:migrate       # Executa migrações
npm run db:seed          # Popula banco
npm run db:studio        # Abre Prisma Studio
```

## 📁 Estrutura do Projeto

```
fratelli/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── middleware/      # Middlewares (auth, validation, etc)
│   │   ├── routes/          # Rotas da API
│   │   ├── lib/             # Utilitários
│   │   └── tests/           # Testes
│   ├── prisma/              # Schema e migrações
│   └── Dockerfile
├── frontend/                # App React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── store/           # Estado global (Zustand)
│   │   └── lib/             # Utilitários
│   └── Dockerfile
├── docker-compose.yml       # Orquestração de containers
└── README.md
```

## 🔒 Segurança

- **JWT** com expiração configurável
- **Rate limiting** para prevenir ataques
- **Validação robusta** de entrada
- **Hash seguro** de senhas (bcrypt)
- **CORS** configurado
- **Headers de segurança** no frontend
- **Soft delete** para auditoria

## 📊 API Endpoints

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário

### Produtos
- `GET /products` - Listar produtos (paginado)
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto (soft delete)

### Receitas
- `GET /recipes` - Listar receitas (paginado)
- `POST /recipes` - Criar receita
- `POST /recipes/:id/prepare` - Preparar receita
- `DELETE /recipes/:id` - Remover receita (soft delete)

### Relatórios
- `GET /reports/consumption` - Relatório de consumo
- `GET /reports/stock` - Relatório de estoque

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma issue no GitHub.
