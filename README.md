# ROMA — Plataforma Educacional (Backend + Frontend)

O **ROMA** é um sistema full-stack para **gestão educacional**, com autenticação avançada (JWT + 2FA), recuperação de senha por e-mail e **pagamentos via Mercado Pago** (PIX, cartão e boleto).  
Este repositório contém:

- **Backend** (raiz do projeto) — Node.js + Express + Prisma + PostgreSQL
- **Frontend** em `projeto-carbone/` — React + TypeScript + Vite

---

## Sumário

- [Visão geral](#visão-geral)
- [Principais recursos](#principais-recursos)
- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar (desenvolvimento)](#como-rodar-desenvolvimento)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Endpoints (visão rápida)](#endpoints-visão-rápida)
- [Documentação](#documentação)
- [Segurança](#segurança)
- [Deploy](#deploy)
- [Licença](#licença)

---

## Visão geral

O ROMA centraliza fluxos comuns de uma plataforma educacional/e-commerce:
- autenticação e gestão de usuários;
- trilhas/catálogos e áreas do aluno (dependendo do frontend);
- checkout e pagamentos;
- recursos de UX como PWA, tema e i18n (no frontend).

---

## Principais recursos

### Autenticação & conta
- Login/cadastro
- JWT + Refresh Token
- 2FA (TOTP)
- Recuperação e redefinição de senha via e-mail
- Upload de avatar

### Pagamentos (Mercado Pago)
- Preferência de pagamento
- PIX (QR Code)
- Webhook para confirmação
- Página/fluxo de sucesso (frontend)

### Qualidade
- Prisma (migrations, geração de client)
- Documentação separada por guias (setup, deploy, testes, pagamentos)

---

## Stack

**Backend**
- Node.js 18+
- Express
- Prisma ORM
- PostgreSQL
- Nodemailer (e-mail)
- Mercado Pago SDK
- Multer (uploads)

**Frontend (`projeto-carbone/`)**
- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + Testing Library
- i18n (pt-BR / en-US / es-ES)

---

## Estrutura do repositório

```text
roma-backend/
├── server.js                 # servidor alternativo (modo memória/dev)
├── server-prisma.js          # servidor com Prisma/PostgreSQL (recomendado)
├── upload-config.js          # config de upload
├── prisma/                   # schema.prisma e artefatos Prisma
├── middleware/               # auth middleware (JWT)
├── routes/                   # rotas (ex.: pagamento)
├── services/                 # serviços (ex.: email)
├── projeto-carbone/          # frontend (React + Vite)
└── *.md                      # guias (deploy, prisma, testes, pagamentos...)
```

---

## Como rodar (desenvolvimento)

### 1) Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Git

### 2) Clonar
```bash
git clone https://github.com/beatrizaraujow/roma-backend.git
cd roma-backend
```

### 3) Backend (recomendado: Prisma + PostgreSQL)
```bash
npm install
cp .env.example .env
# edite o .env

npx prisma generate
npx prisma migrate dev

npm run dev:prisma
```

Backend:
- API: `http://localhost:3000/api`

### 4) Frontend
```bash
cd projeto-carbone
npm install
cp .env.example .env
npm run dev
```

Frontend:
- Web: `http://localhost:5173`

---

## Variáveis de ambiente

### Backend (`.env`)
Exemplo (baseado no seu README atual):

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/roma_db"
JWT_SECRET="sua-chave-super-segura-aqui"
REFRESH_SECRET="sua-chave-refresh-super-segura"
PORT=3000

# Mercado Pago (opcional, apenas se usar pagamentos)
MP_ACCESS_TOKEN="seu-token-aqui"

# Email (opcional, apenas se usar recuperação)
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-app"
```

### Frontend (`projeto-carbone/.env`)
```env
VITE_API_URL=http://localhost:3000/api
VITE_MP_PUBLIC_KEY=seu-public-key-mercadopago
```

---

## Scripts

### Backend
```bash
npm run dev:prisma    # desenvolvimento com Prisma/PostgreSQL
npm run start:prisma  # produção com Prisma/PostgreSQL

npm run dev           # modo alternativo (memória)
npm start             # modo alternativo (memória)
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
npm test
npm run test:ui
npm run test:coverage
```

---

## Endpoints (visão rápida)

Base URL:
```text
http://localhost:3000/api
```

Autenticação:
- `POST /auth/login`
- `POST /auth/cadastro`
- `POST /auth/recuperar-senha`
- `POST /auth/redefinir-senha`
- `POST /auth/refresh-token`
- `GET  /auth/me` (auth)
- `PUT  /auth/profile` (auth)
- `POST /auth/upload-avatar` (auth)

2FA:
- `POST /auth/2fa/setup` (auth)
- `POST /auth/2fa/verify` (auth)
- `POST /auth/2fa/disable` (auth)

Pagamentos:
- `POST /pagamento/create-preference` (auth)
- `POST /pagamento/create-pix` (auth)
- `GET  /pagamento/status/:id` (auth)
- `POST /pagamento/webhook` (público)

> A lista completa com exemplos de request/response está nos guias e (se você quiser) pode ser extraída para um `docs/api.md` no futuro.

---

## Documentação

Guias do repositório:
- [`QUICK-START.md`](QUICK-START.md) — início rápido
- [`GUIA-INSTALACAO-PRISMA.md`](GUIA-INSTALACAO-PRISMA.md) — setup Prisma
- [`GUIA-PAGAMENTO-COMPLETO.md`](GUIA-PAGAMENTO-COMPLETO.md) — Mercado Pago
- [`GUIA-TESTES-COMPLETO.md`](GUIA-TESTES-COMPLETO.md) — testes
- [`DEPLOY-GITHUB.md`](DEPLOY-GITHUB.md) — deploy/CI
- [`INSTRUCOES-LOGIN.md`](INSTRUCOES-LOGIN.md) — fluxo de login
- Frontend: [`projeto-carbone/README.md`](projeto-carbone/README.md)

---

## Segurança

Recomendações mínimas:
- Use `JWT_SECRET` e `REFRESH_SECRET` fortes (não reutilizar).
- Em produção: HTTPS obrigatório.
- Restrinja CORS para domínios conhecidos.
- Não commitar `.env` (use secrets do provedor).
- Valide uploads (tipo/tamanho) e armazene de forma segura.

Veja também:
- [`SEGURANCA-DEPLOY.md`](SEGURANCA-DEPLOY.md)

---

## Deploy

Resumo:
- Backend: Render/Railway/Heroku com `npm install`, `prisma generate` e `prisma migrate deploy`.
- Frontend: Vercel/Netlify (build do `projeto-carbone/`).

Guia completo:
- [`DEPLOY-GITHUB.md`](DEPLOY-GITHUB.md)

---

## Licença

MIT (ver `LICENSE`, se aplicável no repositório).
