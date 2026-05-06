# Acme

Aplicação de exemplo construída com **Next.js (App Router)**, baseada no tutorial oficial.  
Este projeto serve como estudo e prática de boas práticas modernas de desenvolvimento web.

## 🚀 Tecnologias utilizadas
- [Next.js 15](https://nextjs.org/) – framework React com App Router
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/) – ORM para banco de dados
- [PostgreSQL](https://www.postgresql.org/) – banco de dados relacional
- [TailwindCSS](https://tailwindcss.com/) – estilização
- [Zod](https://zod.dev/) – validação de dados
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) – hashing de senhas
- ESLint + Prettier – qualidade e formatação de código

## 📦 Requisitos
- Node.js >= 20
- npm >= 10
- Banco de dados PostgreSQL (local ou via Docker)

## 🔧 Instalação
Clone o repositório e instale as dependências:

```bash
git clone https://github.com/wdwallaceduarte/acme.git
cd acme
npm install

▶️ Scripts disponíveis
npm run dev – inicia o servidor de desenvolvimento

npm run build – gera a build de produção

npm run start – inicia a aplicação em produção

npm run lint – executa o ESLint

npm run format – formata o código com Prettier

npm run type:check – checa os tipos com TypeScript

npm run migrate – aplica migrations do Prisma

npm run seed – popula o banco com dados iniciais

📝 Commits
Este projeto segue o padrão Conventional Commits:

feat: nova funcionalidade

fix: correção de bug

chore: tarefas de manutenção

docs: documentação

refactor: refatoração de código

test: testes
