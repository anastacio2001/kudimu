# 🔗 Documentação Técnica Interna - API de Dados Kudimu

> **CONFIDENCIAL**: Este documento é para uso interno e implementação quando o serviço for solicitado.

## 🎯 Objetivo

Permitir que clientes autorizados acessem dados agregados, segmentados e anonimizados diretamente via API, para integração com seus sistemas internos (dashboards, CRMs, BI).

---

## 🧱 Arquitetura Técnica

### Componentes Principais

- **Autenticação**: JWT tokens com scopes específicos
- **Rate Limiting**: Por cliente, endpoint e período
- **Caching**: Redis/KV para respostas frequentes
- **Logs**: Cloudflare R2 para auditoria completa
- **Segurança**: Cloudflare Access + validação de escopo
- **Database**: Views otimizadas para agregação

### Stack Tecnológico

```
Frontend: React (painel de controle)
Backend: Cloudflare Workers (TypeScript)
Database: Cloudflare D1 (SQLite)
Cache: Cloudflare KV
Storage: Cloudflare R2 (logs, exports)
Auth: JWT + custom middleware
```

---

## 📦 Endpoints da API (Implementação)

### Autenticação

```http
POST /api/auth/token
Content-Type: application/json

{
  "client_id": "kudimu_client_123",
  "client_secret": "sk_live_abc123..."
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 2592000,
  "scope": "campaigns:read data:read segments:read"
}
```

### Campanhas

```http
GET /api/campaigns
Authorization: Bearer {token}
Content-Type: application/json

Query Parameters:
- status: active|completed|all
- limit: 1-100 (default: 20)
- offset: number (pagination)

Response:
{
  "campaigns": [
    {
      "id": "camp_123",
      "title": "Pesquisa Mobilidade Urbana",
      "status": "completed",
      "total_responses": 1250,
      "created_at": "2025-01-15T10:00:00Z",
      "completed_at": "2025-02-15T18:30:00Z",
      "available_data": ["aggregated", "segments", "sentiment"]
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

### Dados Agregados

```http
GET /api/campaigns/{id}/data
Authorization: Bearer {token}
Content-Type: application/json

Query Parameters:
- format: json|csv
- include: responses,demographics,timeline,sentiment

Response:
{
  "campaign_id": "camp_123",
  "title": "Pesquisa Mobilidade Urbana",
  "total_responses": 1250,
  "completion_rate": 0.89,
  "avg_completion_time": 240,
  "demographics": {
    "age_distribution": {
      "18-25": 340,
      "26-35": 450,
      "36-45": 460
    },
    "gender_distribution": {
      "male": 620,
      "female": 630
    },
    "location_distribution": {
      "luanda": 680,
      "benguela": 320,
      "huambo": 250
    }
  },
  "response_summary": {
    "question_1": {
      "type": "multiple_choice",
      "question": "Qual seu meio de transporte principal?",
      "responses": {
        "taxi": 450,
        "candongueiro": 380,
        "carro_proprio": 320,
        "moto": 100
      }
    }
  },
  "sentiment_analysis": {
    "overall_sentiment": 0.72,
    "positive": 0.68,
    "neutral": 0.24,
    "negative": 0.08
  },
  "timeline": {
    "daily_responses": [
      {"date": "2025-01-15", "count": 45},
      {"date": "2025-01-16", "count": 67}
    ]
  }
}
```

### Segmentação

```http
GET /api/campaigns/{id}/segments
Authorization: Bearer {token}

Query Parameters:
- by: age|gender|location|profession|income
- filter: JSON object with filters

Response:
{
  "campaign_id": "camp_123",
  "segmentation_by": "age",
  "segments": [
    {
      "segment": "18-25",
      "count": 340,
      "percentage": 0.272,
      "avg_sentiment": 0.78,
      "top_responses": {
        "question_1": {"taxi": 180, "candongueiro": 120}
      }
    },
    {
      "segment": "26-35", 
      "count": 450,
      "percentage": 0.36,
      "avg_sentiment": 0.71,
      "top_responses": {
        "question_1": {"carro_proprio": 200, "taxi": 150}
      }
    }
  ]
}
```

### Análise de Sentimento

```http
GET /api/campaigns/{id}/sentiment
Authorization: Bearer {token}

Response:
{
  "campaign_id": "camp_123",
  "overall_sentiment": {
    "score": 0.72,
    "confidence": 0.89,
    "distribution": {
      "very_positive": 0.15,
      "positive": 0.53,
      "neutral": 0.24,
      "negative": 0.06,
      "very_negative": 0.02
    }
  },
  "by_question": [
    {
      "question_id": 2,
      "question": "Como avalia o transporte público?",
      "sentiment_score": 0.45,
      "themes": [
        {"theme": "price", "sentiment": 0.8, "mentions": 234},
        {"theme": "quality", "sentiment": 0.3, "mentions": 189},
        {"theme": "accessibility", "sentiment": 0.6, "mentions": 156}
      ]
    }
  ],
  "word_cloud": [
    {"word": "barato", "frequency": 45, "sentiment": 0.8},
    {"word": "demora", "frequency": 38, "sentiment": 0.2},
    {"word": "seguro", "frequency": 32, "sentiment": 0.9}
  ]
}
```

### Previsões (AI)

```http
GET /api/campaigns/{id}/predict
Authorization: Bearer {token}

Query Parameters:
- model: acceptance|completion|sentiment
- scenario: JSON object with scenario parameters

Response:
{
  "campaign_id": "camp_123",
  "prediction_type": "acceptance",
  "model_version": "v2.1",
  "confidence": 0.87,
  "prediction": {
    "expected_responses": 1450,
    "completion_rate": 0.82,
    "timeline": {
      "50%_completion": "2025-02-01",
      "80%_completion": "2025-02-10", 
      "100%_completion": "2025-02-15"
    }
  },
  "factors": [
    {"factor": "reward_amount", "impact": 0.68},
    {"factor": "question_count", "impact": -0.34},
    {"factor": "topic_interest", "impact": 0.45}
  ]
}
```

### Histórico do Cliente

```http
GET /api/client/history
Authorization: Bearer {token}

Query Parameters:
- from: ISO 8601 date
- to: ISO 8601 date
- include: campaigns|usage|exports

Response:
{
  "client_id": "kudimu_client_123",
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-02-28T23:59:59Z"
  },
  "summary": {
    "total_campaigns": 8,
    "total_api_calls": 1250,
    "data_exported": "125MB",
    "top_endpoints": [
      {"/api/campaigns": 450},
      {"/api/campaigns/*/data": 380}
    ]
  },
  "campaigns": [
    {
      "id": "camp_123",
      "title": "Pesquisa Mobilidade",
      "created_at": "2025-01-15T10:00:00Z",
      "api_calls": 89,
      "data_exported": "15MB"
    }
  ],
  "api_usage": {
    "calls_remaining": 750,
    "reset_date": "2025-03-01T00:00:00Z",
    "overage_charges": 0
  }
}
```

---

## 🔐 Regras de Segurança e Acesso

### Autenticação JWT

```javascript
// Payload do Token
{
  "iss": "kudimu-api",
  "sub": "client_123",
  "aud": "api.kudimu.ao",
  "exp": 1640995200,
  "iat": 1640908800,
  "scope": "campaigns:read data:read segments:read",
  "client_tier": "enterprise",
  "rate_limit": {
    "requests_per_month": 10000,
    "requests_per_minute": 100
  }
}
```

### Rate Limiting

| Plano | Requests/Mês | Requests/Minuto | Burst |
|-------|--------------|-----------------|-------|
| Básico | 1.000 | 10 | 20 |
| Profissional | 10.000 | 50 | 100 |
| Enterprise | 100.000 | 200 | 500 |
| Custom | Negociável | Negociável | Negociável |

### Dados Anonimizados

- **PII Removido**: Nomes, telefones, emails, endereços
- **IDs Hasheados**: user_id → hash SHA-256
- **Agregação Mínima**: Grupos com menos de 5 respostas são omitidos
- **Geo-fencing**: Coordenadas limitadas a nível de cidade/distrito

---

## 📊 Schema do Banco de Dados

### Tabelas Principais

```sql
-- Clientes API
CREATE TABLE api_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'professional', 'enterprise', 'custom')),
  client_secret_hash TEXT NOT NULL,
  rate_limit_month INTEGER DEFAULT 1000,
  rate_limit_minute INTEGER DEFAULT 10,
  scopes JSON DEFAULT '["campaigns:read"]',
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tokens JWT ativos
CREATE TABLE api_tokens (
  jti TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  scopes JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES api_clients(id)
);

-- Log de requisições
CREATE TABLE api_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  bytes_transferred INTEGER,
  user_agent TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES api_clients(id)
);

-- Cache de dados agregados
CREATE TABLE api_cache (
  cache_key TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSON NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Views Otimizadas

```sql
-- View para dados agregados
CREATE VIEW campaign_aggregated_data AS
SELECT 
  c.id as campaign_id,
  c.title,
  COUNT(r.id) as total_responses,
  AVG(r.completion_time_seconds) as avg_completion_time,
  COUNT(r.id) * 1.0 / c.target_participants as completion_rate,
  AVG(r.sentiment_score) as avg_sentiment
FROM campaigns c
LEFT JOIN responses r ON c.id = r.campaign_id
WHERE r.status = 'completed'
GROUP BY c.id, c.title, c.target_participants;

-- View para segmentação demográfica
CREATE VIEW demographic_segments AS
SELECT 
  r.campaign_id,
  u.age_group,
  u.gender,
  u.province,
  COUNT(*) as response_count,
  AVG(r.sentiment_score) as avg_sentiment
FROM responses r
JOIN users u ON r.user_id = u.id
WHERE r.status = 'completed'
GROUP BY r.campaign_id, u.age_group, u.gender, u.province;
```

---

## 🚀 Implementação Cloudflare Workers

### Estrutura do Projeto

```
src/
├── handlers/
│   ├── auth.ts           # Autenticação JWT
│   ├── campaigns.ts      # Endpoints de campanhas
│   ├── data.ts          # Dados agregados
│   ├── segments.ts      # Segmentação
│   └── analytics.ts     # Previsões e análises
├── middleware/
│   ├── auth.ts          # Verificação de tokens
│   ├── rateLimit.ts     # Rate limiting
│   └── logging.ts       # Logs para R2
├── services/
│   ├── database.ts      # Queries otimizadas
│   ├── cache.ts         # Cloudflare KV
│   └── ai.ts           # Workers AI para previsões
├── types/
│   └── api.ts          # TypeScript interfaces
└── index.ts            # Entry point
```

### Middleware de Rate Limiting

```typescript
// src/middleware/rateLimit.ts
export async function rateLimitMiddleware(
  request: Request,
  env: Env,
  clientId: string
): Promise<Response | null> {
  const minute = Math.floor(Date.now() / 60000);
  const monthKey = `rate_limit:${clientId}:month:${new Date().getMonth()}`;
  const minuteKey = `rate_limit:${clientId}:minute:${minute}`;
  
  const [monthCount, minuteCount] = await Promise.all([
    env.KV.get(monthKey),
    env.KV.get(minuteKey)
  ]);
  
  const client = await getClientById(env, clientId);
  
  if (parseInt(monthCount || '0') >= client.rate_limit_month) {
    return new Response(JSON.stringify({
      error: 'Monthly rate limit exceeded',
      limit: client.rate_limit_month,
      reset: 'Next month'
    }), { status: 429 });
  }
  
  if (parseInt(minuteCount || '0') >= client.rate_limit_minute) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      limit: client.rate_limit_minute,
      reset: 60 - (Date.now() % 60000) / 1000
    }), { status: 429 });
  }
  
  // Increment counters
  await Promise.all([
    env.KV.put(monthKey, String(parseInt(monthCount || '0') + 1), {
      expirationTtl: 60 * 60 * 24 * 32 // 32 days
    }),
    env.KV.put(minuteKey, String(parseInt(minuteCount || '0') + 1), {
      expirationTtl: 60 // 1 minute
    })
  ]);
  
  return null; // Continue processing
}
```

### Cache Strategy

```typescript
// src/services/cache.ts
export async function getCachedData(
  env: Env,
  cacheKey: string
): Promise<any | null> {
  const cached = await env.KV.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

export async function setCachedData(
  env: Env,
  cacheKey: string,
  data: any,
  ttl: number = 3600 // 1 hour default
): Promise<void> {
  await env.KV.put(cacheKey, JSON.stringify(data), {
    expirationTtl: ttl
  });
}
```

---

## 🧾 Checklist de Implementação

### Fase 1: Infraestrutura Base
- [ ] Configurar Cloudflare Workers
- [ ] Setup Cloudflare D1 database
- [ ] Configurar Cloudflare KV para cache
- [ ] Setup Cloudflare R2 para logs
- [ ] Implementar autenticação JWT

### Fase 2: Endpoints Core
- [ ] POST /api/auth/token
- [ ] GET /api/campaigns
- [ ] GET /api/campaigns/:id/data
- [ ] Middleware de rate limiting
- [ ] Sistema de logs

### Fase 3: Análises Avançadas
- [ ] GET /api/campaigns/:id/segments
- [ ] GET /api/campaigns/:id/sentiment
- [ ] Integração com Workers AI
- [ ] Cache inteligente

### Fase 4: Funcionalidades Premium
- [ ] GET /api/campaigns/:id/predict
- [ ] GET /api/client/history
- [ ] Export para CSV
- [ ] Dashboard administrativo

### Fase 5: Produção
- [ ] Documentação completa
- [ ] Testes automatizados
- [ ] Monitoramento e alertas
- [ ] Processo de onboarding de clientes

---

## 💰 Modelo de Preços

### Planos Sugeridos

| Plano | Preço/Mês | Requests | Recursos |
|-------|------------|----------|----------|
| **Básico** | $99 | 1.000 | Dados básicos, JSON |
| **Profissional** | $299 | 10.000 | + Segmentação, CSV |
| **Enterprise** | $999 | 100.000 | + IA, Previsões, SLA |
| **Custom** | Sob consulta | Ilimitado | Tudo + Suporte dedicado |

### Recursos por Plano

- **Básico**: Dados agregados, autenticação básica
- **Profissional**: + Segmentação demográfica, exports CSV
- **Enterprise**: + Análise de sentimento, previsões AI, SLA 99.9%
- **Custom**: + Endpoints personalizados, integração dedicada

---

## 📞 Processo de Vendas

### Qualificação do Lead
1. **Empresa/Organização**: Nome, setor, tamanho
2. **Uso pretendido**: BI, CRM, dashboards, pesquisa
3. **Volume esperado**: Campanhas/mês, requests/mês
4. **Integração**: Sistemas existentes, formato preferido

### Demonstração Técnica
1. **Sandbox account**: 30 dias, 100 requests grátis
2. **Demo personalizada**: Casos de uso específicos
3. **Documentação**: Guias de integração
4. **Suporte**: Canal Slack/Discord durante trial

### Implementação
1. **Onboarding**: Call técnica inicial
2. **Credentials**: client_id + client_secret
3. **Integração assistida**: Até 5h de consultoria
4. **Go-live**: Monitoramento primeiro mês

---

*Este documento deve ser atualizado conforme evolução dos requisitos e feedback dos clientes.*