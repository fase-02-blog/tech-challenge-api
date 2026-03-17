# Tech Challenge Fase 02: Blog Dinâmico - Profissional API

Este projeto faz parte da Fase 02 do Tech Challenge da FIAP. Consiste em uma API REST desenvolvida em Node.js e TypeScript para gerenciamento de postagens (Posts), com persistência em PostgreSQL, validação robusta e pipeline de CI.

## 🛠️ Stack Tecnológica
*   **Runtime**: Node.js v20+
*   **Linguagem**: TypeScript
*   **Framework**: Express
*   **Banco de Dados**: PostgreSQL 15
*   **ORM**: Prisma 5.11.0
*   **Validação**: Zod
*   **Testes**: Jest & Supertest
*   **Containerização**: Docker & Docker Compose
*   **CI/CD**: GitHub Actions

## 🏗️ Arquitetura
A aplicação segue uma estrutura modular simples e eficaz:
*   `src/posts/`: Domínio principal contendo Controller, Service, Repository e Schemas.
*   `prisma/`: Definições do banco de dados e migrations.
*   `http/`: Arquivo `.http` para testes rápidos de endpoints.
*   `docs/`: Documentação de BDD e Plano Ágil.
*   `.github/`: Workflows de automação (CI).

## 🚀 Como Rodar o Projeto

### Pré-requisitos
*   Docker e Docker Compose instalados.
*   Node.js instalado (opcional, se rodar fora do Docker).

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd challenge-fase-02
```

### 2. Subir o ambiente com Docker
Este comando sobe o banco de dados PostgreSQL:
```bash
docker compose up -d
```

### 3. Instalar dependências e rodar Migrations
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Iniciar a aplicação
```bash
npm run dev
```
A API estará disponível em `http://localhost:3000`.

## 🧪 Testes e Qualidade

### Executar Testes de Integração
Os testes de integração utilizam o banco de dados e garantem o funcionamento completo das rotas.
```bash
npm test
```

### Linter (Qualidade de Código)
```bash
npm run lint
```

## 📖 Documentação de Endpoints (BDD)
Os cenários de uso (Happy Paths e Failures) estão detalhados em especificações BDD:
*   [Cenários de Sucesso](./docs/bdd/cenarios-sucesso.md)
*   [Cenários de Falha](./docs/bdd/cenarios-falha.md)

## 🚢 Pipeline de entrega (CI)
O projeto conta com um workflow do GitHub Actions configurado em `.github/workflows/ci.yml` que executa automaticamente em cada `push` para a `main` as etapas de:
1.  Check-out do código.
2.  Instalação de dependências.
3.  Prisma Generate.
4.  Linting.
5.  Build.
6.  Migrations em base de teste.
7.  Execução de Testes de Integração.

## 👥 Desenvolvedor
*   **Vinicius** - Aluno FIAP
