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

## 🎯 Tipos de Usuário

### 1. **Admin** (`tipo_usuario: 'admin'`)
- **Email**: admin@kudimu.ao
- **Senha**: admin123
- **Rotas**: `/admin/*`
- **Páginas**:
  - `/admin` - AdminDashboard
  - `/admin/users` - AdminUsers
  - `/admin/campaigns` - AdminCampaigns
  - `/admin/answers` - AdminAnswers
  - `/admin/analytics` - AdminAnalytics

### 2. **Cliente** (`tipo_usuario: 'cliente'`)
- **Email**: joao@empresaxyz.ao
- **Senha**: cliente123
- **Rotas**: `/client/*`
- **Páginas**:
  - `/client/dashboard` - ClientDashboard
  - `/client/campaigns` - ClientCampaigns
  - `/client/budget` - ClientBudgetManagement
  - `/client/ai-insights` - ClientAIInsights
  - `/client/reports` - Relatórios

### 3. **Usuário Normal** (`tipo_usuario: 'usuario'`)
- **Email**: maria@gmail.com
- **Senha**: usuario123
- **Rotas**: `/campaigns`, `/dashboard`
- **Função**: Responder pesquisas

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
- `jwt-usuario-usuario-001`

### Helpers de Permissão (backend)
- `requireAuth()` - Requer qualquer usuário autenticado
- `requireAdmin()` - Requer tipo_usuario === 'admin'
- `requireClientOrAdmin()` - Requer cliente ou admin

### Componentes de Rota (frontend)
- `<AdminRoute>` - Protege rotas admin
- `<UserRoute>` - Protege rotas de usuário
- `<ProtectedRoute>` - Protege qualquer rota autenticada

## 📊 Estado Atual do Projeto

### ✅ Concluído
- [x] Backend com 13 endpoints funcionando
- [x] Sistema de autenticação JWT
- [x] Validação de permissões
- [x] AdminLayout com navegação persistente
- [x] ClientLayout com navegação persistente
- [x] Todas as páginas admin conectadas ao backend
- [x] Todas as páginas cliente conectadas ao backend
- [x] Centralização de configuração de API
- [x] Testes de endpoints (100% pass rate)

### 🔄 Em Progresso
- [ ] Resolver erros 403 no NotificationButton
- [ ] Implementar debounce em filtros de busca
- [ ] Otimizações de performance

### 📝 Próximos Passos
1. Testar navegação completa de todos os tipos de usuário
2. Implementar página de relatórios (/client/reports)
3. Adicionar testes unitários para componentes
4. Melhorar tratamento de erros
5. Implementar sistema de cache

---

**Última atualização**: 7 de fevereiro de 2026
