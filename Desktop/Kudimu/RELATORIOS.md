# 📊 Sistema de Relatórios e Analytics - Kudimu

**Data**: 14 de Outubro de 2025  
**Status**: ✅ Backend Completo (5 endpoints), 🔄 Frontend Pendente

---

## 🎯 VISÃO GERAL

O sistema de relatórios do Kudimu fornece **analytics completos** para administradores e gestores monitorarem:
- 📈 **Desempenho geral** da plataforma (usuários, campanhas, financeiro)
- 🎯 **Analytics de campanhas** específicas (respostas, progresso, ROI)
- 👤 **Performance de usuários** individuais (reputação, ganhos, atividade)
- 💰 **Relatórios financeiros** (pagamentos, saques, saldo da plataforma)
- 📥 **Exportação CSV** de todos os dados para análise externa

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │  Overview  │  │  Campaign  │  │    User    │  │ Financial  ││
│  │   Stats    │  │  Analytics │  │   Report   │  │   Report   ││
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘│
└─────────┼────────────────┼────────────────┼────────────────┼─────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REPORTS API (Workers)                        │
│  GET /reports/system/overview   ───────────┐                   │
│  GET /reports/campaign/:id      ───────────┤                   │
│  GET /reports/user/:id          ───────────┼──►  D1 Database   │
│  GET /reports/financial         ───────────┤   (Aggregation)   │
│  GET /reports/export/:type      ───────────┘                   │
└─────────────────────────────────────────────────────────────────┘
          │                                         │
          ▼                                         ▼
    ┌──────────┐                             ┌──────────┐
    │   CSV    │                             │   JSON   │
    │  Export  │                             │  Response│
    └──────────┘                             └──────────┘
```

---

## 📡 ENDPOINTS REST

### 1. **System Overview** - Visão Geral da Plataforma

**Rota**: `GET /reports/system/overview`  
**Auth**: Admin only  
**Descrição**: Dashboard principal com estatísticas gerais

**Response**:
```json
{
  "success": true,
  "data": {
    "usuarios": {
      "total": 4,
      "ativos": 4,
      "cidadaos": 2,
      "empresas": 0,
      "reputacao_media": 50,
      "taxa_ativacao": "100.0"
    },
    "campanhas": {
      "total": 1,
      "ativas": 1,
      "encerradas": 0,
      "respostas_esperadas": 100,
      "respostas_coletadas": 15,
      "taxa_conclusao": "15.0"
    },
    "financeiro": {
      "total_pago_aoa": 0,
      "total_sacado_aoa": 3000,
      "total_pendente_aoa": 0,
      "saldo_plataforma_aoa": -3000,
      "total_transacoes_recompensa": 0,
      "total_transacoes_saque": 1
    },
    "graficos": {
      "crescimento_usuarios": [
        { "mes": "2025-10", "total": 4 }
      ],
      "atividade_7_dias": [
        { "dia": "2025-10-14", "respostas": 0, "usuarios_ativos": 1 }
      ],
      "top_usuarios": [
        {
          "id": "user-001",
          "nome": "Maria Santos",
          "reputacao": 50,
          "nivel": "Iniciante",
          "total_respostas": 0
        }
      ],
      "top_campanhas": [
        {
          "id": "campaign-test-001",
          "titulo": "Satisfação com Produtos Angolanos",
          "quantidade_atual": 15,
          "progresso": "15.0"
        }
      ],
      "por_provincia": [
        { "provincia": "Luanda", "total": 4 }
      ]
    }
  }
}
```

---

### 2. **Campaign Analytics** - Análise de Campanha Específica

**Rota**: `GET /reports/campaign/:id`  
**Auth**: Admin only  
**Descrição**: Analytics detalhado de uma campanha

**Response**:
```json
{
  "success": true,
  "data": {
    "campanha": {
      "id": "campaign-test-001",
      "titulo": "Satisfação com Produtos Angolanos",
      "cliente": "Empresa ABC",
      "status": "ativa",
      "data_inicio": "2025-10-01",
      "data_fim": "2025-11-30",
      "quantidade_alvo": 100,
      "quantidade_atual": 15,
      "recompensa_por_resposta": 500
    },
    "estatisticas": {
      "total_participantes": 12,
      "total_respostas": 15,
      "tempo_medio_resposta_segundos": 45,
      "respostas_validadas": 12,
      "respostas_rejeitadas": 3,
      "taxa_aprovacao": 80.0,
      "progresso_percentual": "15.0"
    },
    "financeiro": {
      "custo_projetado_aoa": 50000,
      "custo_real_aoa": 6000,
      "economia_aoa": 44000,
      "total_transacoes": 12,
      "custo_por_resposta_real": 500
    },
    "graficos": {
      "respostas_por_dia": [
        { "dia": "2025-10-14", "total": 5 }
      ],
      "por_regiao": [
        { "regiao": "Luanda", "total": 8 },
        { "regiao": "Benguela", "total": 4 }
      ],
      "por_nivel_reputacao": [
        { "nivel": "Iniciante", "total": 6 },
        { "nivel": "Experiente", "total": 6 }
      ],
      "top_perguntas": [
        {
          "pergunta": "Como você avalia o produto?",
          "tipo": "multipla_escolha",
          "total_respostas": 15
        }
      ]
    }
  }
}
```

---

### 3. **User Performance** - Relatório Individual de Usuário

**Rota**: `GET /reports/user/:id`  
**Auth**: Admin ou próprio usuário  
**Descrição**: Performance e atividade de um usuário

**Response**:
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "user-001",
      "nome": "Admin Relatorios",
      "email": "relatorios@kudimu.ao",
      "perfil": "admin",
      "reputacao": 50,
      "nivel": "Iniciante",
      "saldo_aoa": 0.0,
      "data_cadastro": "2025-10-14T18:24:31.000Z"
    },
    "estatisticas_respostas": {
      "total_respostas": 0,
      "respostas_aprovadas": 0,
      "respostas_rejeitadas": 0,
      "taxa_aprovacao": 0,
      "tempo_medio_resposta_segundos": 0
    },
    "financeiro": {
      "total_ganho_aoa": 0,
      "total_sacado_aoa": 0,
      "saldo_atual_aoa": 0.0,
      "total_recompensas": 0,
      "total_saques": 0,
      "media_por_resposta_aoa": 0
    },
    "campanhas_participadas": [],
    "medalhas": [],
    "graficos": {
      "respostas_por_mes": [],
      "evolucao_reputacao": []
    }
  }
}
```

---

### 4. **Financial Report** - Relatório Financeiro da Plataforma

**Rota**: `GET /reports/financial`  
**Auth**: Admin only  
**Descrição**: Visão financeira completa (receitas, despesas, saques)

**Response**:
```json
{
  "success": true,
  "data": {
    "resumo": {
      "total_pago_aoa": 0,
      "total_sacado_aoa": 3000,
      "total_pendente_aoa": 0,
      "saldo_plataforma_aoa": -3000,
      "total_transacoes_credito": 0,
      "total_transacoes_saque": 1
    },
    "por_metodo_pagamento": [
      {
        "metodo_pagamento": "dados_moveis",
        "total_transacoes": 1,
        "total_valor_aoa": 3000
      }
    ],
    "por_operadora": [
      {
        "operadora": "unitel",
        "total_transacoes": 1,
        "total_valor_aoa": 3000
      }
    ],
    "graficos": {
      "movimentacao_30_dias": [
        {
          "dia": "2025-10-14",
          "creditos_aoa": 0,
          "saques_aoa": 3000
        }
      ],
      "top_usuarios": [
        {
          "id": "user-002",
          "nome": "João Silva",
          "email": "joao@example.com",
          "total_ganho_aoa": 5000,
          "total_sacado_aoa": 3000,
          "saldo_atual_aoa": 2000
        }
      ]
    }
  }
}
```

---

### 5. **CSV Export** - Exportação de Dados em CSV

**Rota**: `GET /reports/export/:type`  
**Tipos**: `campaigns`, `users`, `transactions`  
**Auth**: Admin only  
**Descrição**: Download de dados em formato CSV para análise externa

**Tipos de Exportação**:

#### **Campanhas** (`/reports/export/campaigns`)
```csv
ID,Titulo,Cliente,Status,Data Inicio,Data Fim,Quantidade Alvo,Quantidade Atual,Recompensa AOA
campaign-test-001,"Satisfação com Produtos Angolanos","Empresa ABC",ativa,2025-10-01,2025-11-30,100,15,500
```

#### **Usuários** (`/reports/export/users`)
```csv
ID,Nome,Email,Telefone,Perfil,Reputacao,Nivel,Saldo AOA,Localizacao,Data Cadastro,Ultimo Acesso
user-001,"Admin Relatorios","relatorios@kudimu.ao","+244900111222",admin,50,Iniciante,0.0,"Luanda",2025-10-14T18:24:31.000Z,
```

#### **Transações** (`/reports/export/transactions`)
```csv
ID,Usuario Nome,Usuario Email,Tipo,Metodo,Operadora,Valor AOA,Status,Referencia,Data Criacao,Data Processamento
tx-001,"João Silva","joao@example.com",saque,dados_moveis,unitel,3000,concluido,"UNITEL-TX-20251014-001",2025-10-14,2025-10-14
```

**Response Headers**:
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="campanhas_2025-10-14.csv"
Access-Control-Allow-Origin: *
```

---

## 🐛 BUG FIXES APLICADOS

### 1. **SQL Column Name Mismatch** (CORRIGIDO ✅)

**Problema**: Código usava `q.pergunta` mas schema tinha `q.texto`

**Localizações Corrigidas**:
1. `handleAdminGetAnswers()` (linha 1362)
2. `handleCampaignInsights()` (linha 1494)  
3. `handleReportsCampaign()` (linha 2209)

**Solução**: Alterado para `q.texto as pergunta` em todas as queries

---

### 2. **User Medals Table Missing** (CORRIGIDO ✅)

**Problema**: Query referenciava tabela `user_medals` que não existe

**Solução**: Mudado para usar `activity_logs` com filtro `acao LIKE 'medalha_%'`

---

### 3. **Missing Routes** (CORRIGIDO ✅)

**Problema**: Rotas `/reports/financial` e `/reports/export/:type` não estavam no router

**Solução**: Adicionadas ao `index.ts` junto com funções handler completas

---

## 📊 CASOS DE USO

### 1. **Admin Dashboard Principal**
- Ver total de usuários, campanhas ativas, saldo da plataforma
- Gráficos de crescimento nos últimos meses
- Top usuários por reputação
- Top campanhas por progresso

### 2. **Monitoramento de Campanha**
- Cliente: "Empresa ABC" quer ver progresso da campanha
- Admin acessa `/reports/campaign/campaign-test-001`
- Vê: 15/100 respostas (15%), 80% aprovação, 500 AOA/resposta
- Exporta CSV com todas as respostas para análise detalhada

### 3. **Análise de Usuário**
- Usuário: "João Silva" quer ver seu histórico
- Acessa `/reports/user/user-002`
- Vê: 50 respostas, 5000 AOA ganhos, 3000 AOA sacados, 2000 AOA saldo
- Gráfico de evolução de reputação nos últimos 6 meses

### 4. **Relatório Financeiro Mensal**
- CFO precisa de relatório de despesas
- Admin acessa `/reports/financial`
- Vê: 50.000 AOA pagos, 30.000 AOA sacados, 20.000 AOA saldo
- Breakdown por operadora: Unitel 40%, Movicel 35%, Africell 25%
- Exporta CSV de todas as transações do mês

### 5. **Auditoria e Compliance**
- Auditor externo precisa verificar transações
- Admin exporta: `/reports/export/transactions`
- CSV contém: ID, nome, email, tipo, método, valor, status, referência, datas
- Importa no Excel para análise de compliance

---

## 🔐 SEGURANÇA E PERMISSÕES

### Autenticação
- Todos os endpoints requerem **JWT válido**
- Header: `Authorization: Bearer <token>`

### Autorização
| Endpoint | Permissão | Validação |
|----------|-----------|-----------|
| `/reports/system/overview` | Admin only | `verificarAdmin()` |
| `/reports/campaign/:id` | Admin only | `verificarAdmin()` |
| `/reports/user/:id` | Admin ou próprio usuário | `verificarAdmin()` ou `payload.userId === userId` |
| `/reports/financial` | Admin only | `verificarAdmin()` |
| `/reports/export/:type` | Admin only | `verificarAdmin()` |

### Dados Sensíveis
- ❌ **Senhas** nunca aparecem em relatórios
- ✅ **Emails** apenas para admins
- ✅ **Telefones** apenas para admins
- ✅ **Saldos** apenas para próprio usuário ou admin

---

## 🎨 FRONTEND PENDENTE

### ReportsPage.js (A Implementar)

**Tecnologias Sugeridas**:
- **Chart.js** ou **Recharts** para gráficos
- **React Table** para tabelas de dados
- **date-fns** para manipulação de datas
- **FileSaver.js** para download de CSVs

**Componentes Necessários**:

```jsx
<ReportsPage>
  <Tabs>
    <Tab label="Visão Geral">
      <SystemOverviewDashboard />
      <UserStatsCard />
      <CampaignStatsCard />
      <FinancialStatsCard />
      <LineChart data={crescimentoUsuarios} />
      <BarChart data={atividadeSemanal} />
    </Tab>

    <Tab label="Campanhas">
      <CampaignSelector />
      <CampaignAnalyticsCard />
      <ProgressBar progress={progressoPercentual} />
      <PieChart data={respostasPorRegiao} />
      <LineChart data={respostasPorDia} />
    </Tab>

    <Tab label="Usuários">
      <UserSearch />
      <UserPerformanceCard />
      <BarChart data={respostasPorMes} />
      <LineChart data={evolucaoReputacao} />
    </Tab>

    <Tab label="Financeiro">
      <FinancialSummaryCard />
      <PieChart data={porMetodoPagamento} />
      <BarChart data={porOperadora} />
      <LineChart data={movimentacao30Dias} />
      <ExportButton type="transactions" />
    </Tab>
  </Tabs>
</ReportsPage>
```

**Features**:
- ✅ Filtros por período (hoje, semana, mês, ano, customizado)
- ✅ Refresh automático a cada 5 minutos
- ✅ Botão de exportação CSV em cada seção
- ✅ Tooltips nos gráficos com detalhes
- ✅ Responsive design para mobile
- ✅ Loading states e error handling

---

## 🚀 DEPLOYMENT

**Versão Atual**: `f157fda3-6c1e-42f7-94cd-07a9a062281f`  
**Tamanho**: 94.77 KiB (gzip: 16.91 KiB)  
**Status**: ✅ Deployed e testado

**Testes Realizados**:
- ✅ System overview: 4 users, -3000 AOA saldo
- ✅ Campaign report: 15 respostas, 0 AOA gasto
- ✅ User report: Admin Relatorios, 50 reputação
- ✅ Financial report: 0 pago, 3000 sacado
- ✅ CSV export: campanhas_2025-10-14.csv gerado

---

## 📈 PRÓXIMOS PASSOS

1. **Frontend de Relatórios** (1-2 semanas)
   - Criar `ReportsPage.js`
   - Integrar Chart.js para gráficos
   - Implementar filtros de período
   - Adicionar exportação de PDFs (opcional)

2. **Dashboards em Tempo Real** (opcional)
   - WebSockets para updates live
   - Notificações de eventos importantes
   - Alertas de anomalias (ex: pico de saques)

3. **Analytics Avançados** (futuro)
   - Machine Learning para previsões
   - Segmentação de usuários
   - A/B testing de campanhas
   - Recomendações personalizadas

---

**Documentação Completa**: ✅  
**Backend 100% Funcional**: ✅  
**Frontend Pendente**: 🔄

🎉 **Sistema de Relatórios Backend COMPLETO e TESTADO!**
