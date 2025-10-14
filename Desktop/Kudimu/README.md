# 🌍 Kudimu Insights - Plataforma de Pesquisas e Insights de Mercado

> Conectando empresas e cidadãos através de pesquisas pagas em Angola

## 📋 Visão Geral

Kudimu Insights é uma plataforma inovadora que permite:
- **Empresas/Governos**: Criar campanhas de pesquisa para obter insights valiosos
- **Cidadãos**: Responder pesquisas e ganhar recompensas em pontos/dinheiro
- **IA**: Análise automática de dados e geração de relatórios

## 🏗️ Arquitetura

### Backend (Cloudflare Workers)
- **API REST**: https://kudimu-api.l-anastacio001.workers.dev
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (arquivos)
- **IA**: Workers AI para análise de dados
- **Autenticação**: JWT com Web Crypto API

### Frontend (React + Webpack)
- **Landing Page**: Marketing institucional
- **App React**: Interface de usuário interativa
- **Build**: Webpack 5 com hot reload
- **Deploy**: Cloudflare Pages

## 🚀 Início Rápido

### Pré-requisitos
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/anastacio2001/mixetora-platform.git
cd Kudimu

# Instale as dependências
npm install

# Configure as variáveis de ambiente (em wrangler.jsonc)
JWT_SECRET="sua-chave-secreta"
```

### Desenvolvimento

```bash
# Inicie o frontend
npm run dev
# Acesse: http://localhost:9000/app.html

# Inicie a API localmente (em outro terminal)
cd kudimu
wrangler dev
# Acesse: http://localhost:8787
```

### Build e Deploy

```bash
# Build de produção
npm run build

# Deploy do frontend (Cloudflare Pages)
npm run deploy

# Deploy da API (Cloudflare Workers)
cd kudimu
wrangler deploy
```

## 📂 Estrutura do Projeto

```
Kudimu/
├── src/                          # Frontend
│   ├── app.js                    # Aplicação React principal
│   ├── index.js                  # Entry point React
│   ├── index.html                # Template HTML React
│   ├── landing.html              # Landing page institucional
│   ├── landing.css               # Estilos da landing page
│   ├── landing.js                # Lógica da landing page
│   ├── style.css                 # Estilos globais
│   └── services/
│       └── apiService.js         # Cliente API
│
├── kudimu/                       # Backend API
│   ├── src/
│   │   ├── index.ts              # Worker principal
│   │   └── utils/
│   │       ├── crypto.ts         # Funções de criptografia
│   │       └── validation.ts     # Validações
│   ├── wrangler.jsonc            # Config Cloudflare Workers
│   └── package.json              # Dependências backend
│
├── schema.sql                    # Schema D1 Database
├── webpack.config.js             # Configuração Webpack
├── package.json                  # Dependências frontend
└── README.md                     # Este arquivo
```

## 🗄️ Database Schema

### Tabelas Principais

**users** - Usuários da plataforma
- id, nome, email, senha_hash, telefone, localizacao
- perfil (cidadao/empresa/governo/admin)
- reputacao, saldo_pontos, nivel

**campaigns** - Campanhas de pesquisa
- id, titulo, descricao, cliente_id
- tema, tipo, recompensa_por_resposta
- quantidade_alvo, quantidade_atual, status

**questions** - Perguntas das campanhas
- id, campanha_id, texto, tipo
- opcoes (JSON), obrigatoria, ordem

**answers** - Respostas dos usuários
- id, usuario_id, campanha_id, pergunta_id
- resposta (JSON/texto), validada

**rewards** - Recompensas pagas
- id, usuario_id, campanha_id
- valor, tipo, status, metodo_pagamento

## 🔐 API Endpoints

### Autenticação
```
POST   /auth/register  - Cadastro de novo usuário
POST   /auth/login     - Login (retorna JWT)
GET    /auth/me        - Dados do usuário logado
POST   /auth/logout    - Logout
```

### Campanhas
```
GET    /campaigns           - Listar campanhas (pública)
GET    /campaigns/:id       - Detalhes da campanha
POST   /campaigns           - Criar campanha (autenticado)
```

### Respostas
```
POST   /answers             - Enviar respostas
GET    /answers/me          - Histórico de respostas
```

### Recompensas
```
GET    /rewards/me          - Histórico de recompensas
```

## 🧪 Testes

### Teste Manual - Registro
```powershell
$body = @{
    nome="João Silva"
    email="joao@teste.com"
    senha="senha123"
    telefone="+244923456789"
    localizacao="Luanda"
    perfil="cidadao"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://kudimu-api.l-anastacio001.workers.dev/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Teste Manual - Login
```powershell
$body = @{
    email="joao@teste.com"
    senha="senha123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://kudimu-api.l-anastacio001.workers.dev/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $response.data.token
```

### Teste Manual - Listar Campanhas
```powershell
Invoke-RestMethod -Uri "https://kudimu-api.l-anastacio001.workers.dev/campaigns?status=ativa" `
    -Method GET
```

## 📊 Status Atual - **20% COMPLETO** ✅🔄

### ✅ FASE 1: Fundação (CONCLUÍDA)
- [x] Landing page institucional (10 seções)
- [x] Schema D1 completo (10 tabelas)
- [x] API REST básica (auth, campanhas, respostas)
- [x] Autenticação JWT segura
- [x] Frontend React com integração básica
- [x] Build system (Webpack) configurado

### 🚧 EM DESENVOLVIMENTO (0%)
*Nenhuma tarefa em andamento no momento*

### ❌ PENDENTE (80% do projeto)

#### **Fase 2: Inteligência e Análise** (Crítico)
- [ ] Integração Workers AI (análise de sentimentos)
- [ ] Vectorize para agrupamento semântico
- [ ] Sistema de reputação completo (níveis, gamificação)
- [ ] Validação automática de respostas
- [ ] Geração de relatórios com IA

#### **Fase 3: Gestão e Administração** (Crítico)
- [ ] Painel administrativo completo
- [ ] Dashboard analytics em tempo real
- [ ] Sistema de aprovação de campanhas
- [ ] Gestão de usuários e permissões
- [ ] Logs e auditoria

#### **Fase 4: Pagamentos e Recompensas** (Alta prioridade)
- [ ] Sistema de pagamentos (Multicaixa Express)
- [ ] Conversão pontos → dinheiro
- [ ] Wallet virtual
- [ ] Recompensas em dados móveis

#### **Fase 5: Mobile e Expansão** (Média prioridade)
- [ ] App mobile (Expo/React Native)
- [ ] PWA com suporte offline
- [ ] Notificações push
- [ ] Multi-idioma (Kimbundu, Umbundu)

#### **Fase 6: Infraestrutura Avançada** (Média prioridade)
- [ ] KV Store (cache e sessões)
- [ ] R2 Storage (arquivos e PDFs)
- [ ] Cloudflare Access (Zero Trust)
- [ ] Sistema de notificações (Email, SMS, WhatsApp)
- [ ] API externa para clientes
- [ ] Deploy Cloudflare Pages

#### **Fase 7: Qualidade e Testes** (Baixa prioridade)
- [ ] Testes automatizados (Vitest, Playwright)
- [ ] CI/CD pipeline
- [ ] Ambiente de staging
- [ ] Compliance LGPD Angola

### 📅 Roadmap Detalhado
📄 **Ver**: [`PROGRESSO.md`](./PROGRESSO.md) para análise completa e cronograma

### ⏱️ Estimativa Total
**15-20 semanas** (3-5 meses) para implementação completa do documento técnico

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 19.2.0
- Webpack 5
- Babel
- CSS3 com animações

### Backend
- Cloudflare Workers (Serverless)
- TypeScript
- Web Crypto API
- Fetch API nativa

### Database & Storage
- Cloudflare D1 (SQLite)
- Cloudflare R2 (Object Storage)
- Workers AI

## 🌐 Links Importantes

- **API Produção**: https://kudimu-api.l-anastacio001.workers.dev
- **Frontend Dev**: http://localhost:9000/app.html
- **Landing Page**: http://localhost:9000/
- **Documentação Técnica**: `Documento_Tecnico.md`

## 👥 Equipe

- **Desenvolvedor**: Anastácio
- **Projeto**: Kudimu Insights Platform
- **Ano**: 2025

## 📄 Licença

Este projeto é privado e confidencial.

---

**Kudimu Insights** - Transformando opiniões em insights valiosos 🚀
