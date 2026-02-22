# Estrutura do Projeto Kudimu

## 📁 Estrutura de Diretórios

```
kudimu/
├── src/                          # Código fonte da aplicação
│   ├── components/               # Componentes React reutilizáveis
│   │   ├── AdminLayout.js       # Layout para páginas admin
│   │   ├── ClientLayout.js      # Layout para páginas cliente
│   │   ├── NotificationButton.js
│   │   └── ...
│   ├── pages/                    # Páginas principais da aplicação
│   │   ├── AdminDashboard.js    # Dashboard do administrador
│   │   ├── AdminUsers.js        # Gestão de usuários
│   │   ├── AdminAnswers.js      # Validação de respostas
│   │   ├── ClientDashboard.js   # Dashboard do cliente
│   │   ├── ClientCampaigns.js   # Campanhas do cliente
│   │   ├── ClientBudgetManagement.js
│   │   └── ClientAIInsights.js
│   ├── screens/                  # Telas de autenticação e onboarding
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   └── ...
│   ├── config/                   # Configurações
│   │   └── api.js               # Configuração centralizada de API
│   ├── services/                 # Serviços e integrações
│   ├── utils/                    # Funções utilitárias
│   ├── styles/                   # Estilos CSS e Tailwind
│   ├── index.ts                  # Backend Cloudflare Workers
│   └── App.js                    # Componente raiz React
│
├── public/                       # Arquivos públicos
│   ├── manifest.json
│   └── service-worker.js
│
├── docs/                         # Documentação organizada
│   ├── api/                      # Documentação de API
│   ├── guides/                   # Guias de desenvolvimento
│   └── archive/                  # Documentação antiga (arquivada)
│
├── scripts/                      # Scripts utilitários
├── package.json
├── wrangler.toml                 # Configuração Cloudflare Workers
├── webpack.config.js
├── tailwind.config.js
└── README.md                     # Documentação principal

```

## 🎯 Tipos de Usuário (Personas)

### 1. **Admin** (`tipo_usuario: 'admin'`)
- **Email**: admin@kudimu.ao
- **Senha**: admin123
- **Função**: Gerenciar sistema completo
- **Rotas**: `/admin/*`
- **Páginas**:
  - `/admin` - AdminDashboard
  - `/admin/users` - AdminUsers (gestão de todos os usuários)
  - `/admin/campaigns` - AdminCampaigns (aprovar/rejeitar)
  - `/admin/answers` - AdminAnswers (validar respostas)
  - `/admin/analytics` - AdminAnalytics
- **Permissões**:
  - ✅ Gerenciar usuários (todos os tipos)
  - ✅ Aprovar/rejeitar campanhas
  - ✅ Validar respostas de pesquisas
  - ✅ Ver analytics global
  - ✅ Criar campanhas (para testes)
- **Dados**:
  - `saldo_pontos`: Sim (para testes)
  - `reputacao`: Sim
  - `saldo_creditos`: Não

### 2. **Cliente** (`tipo_usuario: 'cliente'`)
- **Email**: joao@empresaxyz.ao
- **Senha**: cliente123
- **Função**: Empresário/Organização que PAGA para criar pesquisas
- **Rotas**: `/client/*`
- **Páginas**:
  - `/client/dashboard` - ClientDashboard
  - `/client/campaigns` - ClientCampaigns (suas campanhas)
  - `/client/budget` - ClientBudgetManagement (gestão de orçamento)
  - `/client/ai-insights` - ClientAIInsights (insights de IA)
  - `/client/analytics` - ClientCampaignAnalytics
  - `/client/reports` - ClientReports (exportar dados)
- **Permissões**:
  - ✅ Criar campanhas (PAGA por elas)
  - ✅ Ver resultados de suas próprias campanhas
  - ✅ Gerenciar orçamento
  - ✅ Exportar dados/relatórios
  - ❌ NÃO pode responder pesquisas
  - ❌ NÃO tem acesso a área admin
- **Dados**:
  - `saldo_creditos`: Sim (em Kwanzas - dinheiro real)
  - `plano`: 'starter' | 'business' | 'enterprise'
  - `saldo_pontos`: Não (não responde pesquisas)
  - `reputacao`: Não (não é respondente)

### 3. **Respondente** (`tipo_usuario: 'respondente'`)
- **Email**: maria@gmail.com
- **Senha**: usuario123
- **Função**: Usuário normal que RESPONDE pesquisas e GANHA recompensas
- **Rotas**: `/campaigns`, `/my-rewards`, `/ranking`
- **Páginas**:
  - `/campaigns` - Lista de campanhas disponíveis para responder
  - `/my-rewards` - Histórico de pontos e resgates
  - `/ranking` - Ranking de respondentes
- **Permissões**:
  - ✅ Responder campanhas disponíveis
  - ✅ Ganhar pontos por respostas
  - ✅ Trocar pontos por prêmios
  - ✅ Ver ranking e seu progresso
  - ❌ NÃO pode criar campanhas
  - ❌ NÃO pode pagar por campanhas
  - ❌ NÃO tem acesso a área admin ou cliente
- **Dados**:
  - `saldo_pontos`: Sim (ganha respondendo)
  - `reputacao`: Sim (sistema de ranking)
  - `nivel`: 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Diamante'
  - `saldo_creditos`: Não (não paga por campanhas)

## 🔧 Arquivos de Configuração Principais

### Backend (Cloudflare Workers)
- **Arquivo**: `src/index.ts` (3,968 linhas)
- **Porta**: 8787
- **Modo**: DEV_MODE=true (dados MOCK)
- **Endpoints**: 13 endpoints implementados
- **Comando**: `npx wrangler@3.78.12 dev --port 8787 --local`

### Frontend (React + Webpack)
- **Porta**: 9000
- **Framework**: React 19.2.0
- **Bundler**: Webpack 5
- **Comando**: `npx webpack serve --mode=development --port 9000`

### Configuração de API
- **Arquivo**: `src/config/api.js`
- **Centraliza**: URLs de API, configurações de desenvolvimento/produção

## 📋 Documentação Atual (37 arquivos .md)

### ✅ Manter (Essenciais)
1. **README.md** - Documentação principal do projeto
2. **ESTRUTURA_PROJETO.md** - Este arquivo (estrutura e organização)
3. **DOCUMENTACAO_API_INTERNA.md** - Referência de endpoints
4. **VALIDACAO_PERMISSOES.md** - Sistema de autenticação e permissões

### 📦 Arquivar (Histórico/Progresso)
- ALINHAMENTO_BACKEND_FRONTEND.md
- ANALISE_BACKEND_FRONTEND.md
- ANALISE_ERROS_ADMIN_CLIENTE.md
- CORRECAO_LANDING_PAGE.md
- CORRECOES_ADMIN_CLIENT.md
- ENDPOINTS_IMPLEMENTADOS.md
- ERROS_CORRIGIDOS.md
- GUIA_TESTE_COMPLETO.md
- GUIA_TESTE_TELAS.md
- IMPLEMENTATION_PROGRESS.md
- LANDING_PAGE_PROGRESS.md
- LIMPEZA_CONCLUIDA.md
- PRIORIDADES_ALTAS_CONCLUIDAS.md
- PROBLEMAS_ENCONTRADOS.md
- PROGRESSO.md
- PROGRESSO_REDESIGN.md
- PROXIMOS_PASSOS.md

### 🗑️ Remover (Duplicados/Obsoletos)
- md-features.md (arquivo de teste)
- Serviços.md (informação já documentada)
- RESUMO_EXECUTIVO.md (consolidar no README)

## 🚀 Comandos Principais

### Desenvolvimento
```bash
# Backend (Terminal 1)
cd /Users/UTENTE1/Desktop/kudimu-main/dados_kudimu/kudimu-master/Desktop/Kudimu
npx wrangler@3.78.12 dev --port 8787 --local

# Frontend (Terminal 2)
cd /Users/UTENTE1/Desktop/kudimu-main/dados_kudimu/kudimu-master/Desktop/Kudimu
npx webpack serve --mode=development --port 9000
```

### Testes
```bash
npm test                    # Executar testes com Vitest
npm run test:ui             # Interface de testes
npm run test:coverage       # Relatório de cobertura
```

### Build & Deploy
```bash
npm run build              # Build de produção
npm run deploy             # Deploy para Cloudflare Pages
```

## 🔐 Sistema de Autenticação

### Formato de Token
```
jwt-{tipo_usuario}-{id}
```
Exemplos:
- `jwt-admin-admin-001`
- `jwt-cliente-cliente-001`
- `jwt-respondente-respondente-001`

### Helpers de Permissão (backend)
- `requireAuth()` - Requer qualquer usuário autenticado
- `requireAdmin()` - Requer tipo_usuario === 'admin'
- `requireClientOrAdmin()` - Requer tipo_usuario === 'cliente' OU 'admin'

### Componentes de Rota (frontend)
- `<AdminRoute>` - Protege rotas admin (apenas tipo_usuario === 'admin')
- `<ClientRoute>` - Protege rotas cliente (apenas tipo_usuario === 'cliente')
- `<UserRoute>` - Protege rotas de respondente (apenas tipo_usuario === 'respondente')
- `<ProtectedRoute>` - Protege qualquer rota autenticada

## 💰 Sistema Dual: Créditos vs Pontos

### Para CLIENTES (Empresários)
```javascript
{
  tipo_usuario: 'cliente',
  saldo_creditos: 50000,     // Em Kwanzas (dinheiro real)
  plano: 'business',         // starter | business | enterprise
  // ❌ SEM saldo_pontos
  // ❌ SEM reputacao
}
```
**Como funciona:**
- Cliente PAGA com dinheiro real (Express Payment, etc.)
- Recebe créditos em sua conta
- Usa créditos para criar campanhas
- 1 campanha = X créditos (baseado em recompensa × meta_participantes)

### Para RESPONDENTES (Usuários)
```javascript
{
  tipo_usuario: 'respondente',
  saldo_pontos: 750,         // Pontos ganhos respondendo
  reputacao: 150,            // Score de qualidade
  nivel: 'Bronze',           // Iniciante → Bronze → Prata → Ouro → Diamante
  // ❌ SEM saldo_creditos
}
```
**Como funciona:**
- Respondente RESPONDE pesquisas
- Ganha pontos por cada resposta validada
- Acumula reputação baseado em qualidade
- Troca pontos por prêmios (produtos, dinheiro, etc.)

## 📊 Estado Atual do Projeto

### ✅ Concluído
- [x] Backend com 13 endpoints funcionando
- [x] Sistema de autenticação JWT
- [x] Validação de permissões por tipo de usuário
- [x] Separação clara de personas (Admin, Cliente, Respondente)
- [x] Sistema dual: Créditos (clientes) vs Pontos (respondentes)
- [x] Validação requireClientOrAdmin em criação de campanhas
- [x] Padronização: tipo_usuario em todo código
- [x] AdminLayout com navegação persistente
- [x] ClientLayout com navegação persistente
- [x] Todas as páginas admin conectadas ao backend
- [x] Todas as páginas cliente conectadas ao backend
- [x] Centralização de configuração de API
- [x] Testes de endpoints (100% pass rate)

### 🔄 Em Progresso
- [ ] Criar UserLayout para respondentes
- [ ] Implementar tela /my-rewards (histórico de pontos)
- [ ] Implementar tela /ranking (ranking de respondentes)
- [ ] Resolver erros 403 no NotificationButton
- [ ] Implementar debounce em filtros de busca
- [ ] Otimizações de performance

### 📝 Próximos Passos
1. Criar UserLayout para respondentes (similar a ClientLayout e AdminLayout)
2. Implementar rotas exclusivas de respondente (/my-rewards, /ranking)
3. Testar navegação completa dos 3 tipos de usuário
4. Implementar sistema de pagamento para clientes (Express Payment)
5. Implementar sistema de troca de pontos para respondentes
6. Adicionar testes unitários para componentes
7. Melhorar tratamento de erros
8. Implementar sistema de cache

---

**Última atualização**: 7 de fevereiro de 2026  
**Versão**: 2.0 - Refatoração completa de personas
