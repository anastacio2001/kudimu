# 🔧 Código Base para Implementação da API

> Estruturas prontas para implementação quando o serviço for solicitado.

## 🔐 Sistema de Autenticação JWT

### Token Generator
```typescript
// src/services/auth.ts
import jwt from '@tsndr/cloudflare-worker-jwt'

interface ClientCredentials {
  client_id: string;
  client_secret: string;
}

interface TokenPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  scope: string[];
  client_tier: string;
  rate_limit: {
    requests_per_month: number;
    requests_per_minute: number;
  };
}

export async function generateAPIToken(
  env: Env,
  credentials: ClientCredentials
): Promise<string | null> {
  // Verificar client_secret
  const client = await env.kudimu_db
    .prepare('SELECT * FROM api_clients WHERE id = ? AND client_secret_hash = ?')
    .bind(credentials.client_id, await hashSecret(credentials.client_secret))
    .first();

  if (!client || !client.active) {
    throw new Error('Invalid credentials');
  }

  const payload: TokenPayload = {
    iss: 'kudimu-api',
    sub: credentials.client_id,
    aud: 'api.kudimu.ao',
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    iat: Math.floor(Date.now() / 1000),
    scope: JSON.parse(client.scopes),
    client_tier: client.tier,
    rate_limit: {
      requests_per_month: client.rate_limit_month,
      requests_per_minute: client.rate_limit_minute
    }
  };

  return await jwt.sign(payload, env.JWT_SECRET);
}

export async function verifyAPIToken(
  env: Env,
  token: string
): Promise<TokenPayload | null> {
  try {
    const isValid = await jwt.verify(token, env.JWT_SECRET);
    if (!isValid) return null;

    const { payload } = jwt.decode(token);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

async function hashSecret(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

## 📊 Handlers dos Endpoints

### Autenticação
```typescript
// src/handlers/auth.ts
export async function handleTokenRequest(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), { status: 405 });
  }

  try {
    const body = await request.json() as ClientCredentials;
    
    if (!body.client_id || !body.client_secret) {
      return new Response(JSON.stringify({
        error: 'Missing client_id or client_secret'
      }), { status: 400 });
    }

    const token = await generateAPIToken(env, body);
    
    return new Response(JSON.stringify({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 2592000, // 30 days
      scope: 'campaigns:read data:read segments:read'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Invalid credentials'
    }), { 
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
```

### Dados de Campanhas
```typescript
// src/handlers/campaigns.ts
export async function handleCampaignData(
  request: Request,
  env: Env,
  campaignId: string,
  clientId: string
): Promise<Response> {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const include = url.searchParams.get('include')?.split(',') || ['responses', 'demographics'];

  // Check cache first
  const cacheKey = `campaign_data:${campaignId}:${include.join(',')}`;
  const cachedData = await getCachedData(env, cacheKey);
  
  if (cachedData) {
    return formatResponse(cachedData, format);
  }

  // Build query based on included data
  const data: any = {
    campaign_id: campaignId,
    generated_at: new Date().toISOString()
  };

  // Base campaign info
  const campaign = await env.kudimu_db
    .prepare('SELECT * FROM campaigns WHERE id = ?')
    .bind(campaignId)
    .first();

  if (!campaign) {
    return new Response(JSON.stringify({
      error: 'Campaign not found'
    }), { status: 404 });
  }

  data.title = campaign.title;
  data.status = campaign.status;

  // Get aggregated responses
  if (include.includes('responses')) {
    const responseStats = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(*) as total_responses,
          AVG(completion_time_seconds) as avg_completion_time,
          AVG(sentiment_score) as avg_sentiment
        FROM responses 
        WHERE campaign_id = ? AND status = 'completed'
      `)
      .bind(campaignId)
      .first();

    data.total_responses = responseStats.total_responses;
    data.avg_completion_time = responseStats.avg_completion_time;
    data.completion_rate = responseStats.total_responses / (campaign.target_participants || 1);
  }

  // Get demographics
  if (include.includes('demographics')) {
    const demographics = await env.kudimu_db
      .prepare(`
        SELECT 
          u.age_group,
          u.gender,
          u.province,
          COUNT(*) as count
        FROM responses r
        JOIN users u ON r.user_id = u.id
        WHERE r.campaign_id = ? AND r.status = 'completed'
        GROUP BY u.age_group, u.gender, u.province
        HAVING COUNT(*) >= 5
      `)
      .bind(campaignId)
      .all();

    data.demographics = processDemographics(demographics.results);
  }

  // Get response summary for each question
  if (include.includes('responses')) {
    const questions = JSON.parse(campaign.questions || '[]');
    data.response_summary = {};

    for (const question of questions) {
      const responses = await env.kudimu_db
        .prepare(`
          SELECT response_data
          FROM responses 
          WHERE campaign_id = ? AND status = 'completed'
        `)
        .bind(campaignId)
        .all();

      data.response_summary[`question_${question.id}`] = {
        type: question.type,
        question: question.question,
        responses: aggregateResponses(responses.results, question.id)
      };
    }
  }

  // Cache for 1 hour
  await setCachedData(env, cacheKey, data, 3600);

  return formatResponse(data, format);
}

function processDemographics(demographics: any[]): any {
  const result = {
    age_distribution: {},
    gender_distribution: {},
    location_distribution: {}
  };

  demographics.forEach(demo => {
    // Age
    if (!result.age_distribution[demo.age_group]) {
      result.age_distribution[demo.age_group] = 0;
    }
    result.age_distribution[demo.age_group] += demo.count;

    // Gender
    if (!result.gender_distribution[demo.gender]) {
      result.gender_distribution[demo.gender] = 0;
    }
    result.gender_distribution[demo.gender] += demo.count;

    // Location
    if (!result.location_distribution[demo.province]) {
      result.location_distribution[demo.province] = 0;
    }
    result.location_distribution[demo.province] += demo.count;
  });

  return result;
}

function aggregateResponses(responses: any[], questionId: number): any {
  const aggregated = {};
  
  responses.forEach(response => {
    const data = JSON.parse(response.response_data);
    const answer = data.find((r: any) => r.pergunta_id === questionId);
    
    if (answer) {
      const value = answer.resposta;
      aggregated[value] = (aggregated[value] || 0) + 1;
    }
  });

  return aggregated;
}

function formatResponse(data: any, format: string): Response {
  if (format === 'csv') {
    const csv = convertToCSV(data);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="campaign_${data.campaign_id}_data.csv"`,
        ...corsHeaders
      }
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
```

### Segmentação
```typescript
// src/handlers/segments.ts
export async function handleSegmentation(
  request: Request,
  env: Env,
  campaignId: string
): Promise<Response> {
  const url = new URL(request.url);
  const segmentBy = url.searchParams.get('by') || 'age';
  const filter = url.searchParams.get('filter');

  let whereClause = 'WHERE r.campaign_id = ? AND r.status = "completed"';
  const params = [campaignId];

  if (filter) {
    try {
      const filterObj = JSON.parse(filter);
      if (filterObj.province) {
        whereClause += ' AND u.province = ?';
        params.push(filterObj.province);
      }
      if (filterObj.gender) {
        whereClause += ' AND u.gender = ?';
        params.push(filterObj.gender);
      }
    } catch (e) {
      return new Response(JSON.stringify({
        error: 'Invalid filter format'
      }), { status: 400 });
    }
  }

  const segments = await env.kudimu_db
    .prepare(`
      SELECT 
        u.${segmentBy} as segment,
        COUNT(*) as count,
        AVG(r.sentiment_score) as avg_sentiment,
        r.response_data
      FROM responses r
      JOIN users u ON r.user_id = u.id
      ${whereClause}
      GROUP BY u.${segmentBy}
      HAVING COUNT(*) >= 5
      ORDER BY count DESC
    `)
    .bind(...params)
    .all();

  const totalResponses = segments.results.reduce((sum, seg) => sum + seg.count, 0);

  const processedSegments = segments.results.map(segment => ({
    segment: segment.segment,
    count: segment.count,
    percentage: segment.count / totalResponses,
    avg_sentiment: segment.avg_sentiment,
    top_responses: extractTopResponses(segment.response_data)
  }));

  return new Response(JSON.stringify({
    campaign_id: campaignId,
    segmentation_by: segmentBy,
    total_responses: totalResponses,
    segments: processedSegments
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

function extractTopResponses(responseData: string): any {
  // Extract and aggregate top responses for this segment
  // Implementation depends on response data structure
  return {};
}
```

### Análise de Sentimento
```typescript
// src/handlers/sentiment.ts
export async function handleSentimentAnalysis(
  request: Request,
  env: Env,
  campaignId: string
): Promise<Response> {
  // Get all text responses for sentiment analysis
  const responses = await env.kudimu_db
    .prepare(`
      SELECT response_data, sentiment_score
      FROM responses 
      WHERE campaign_id = ? AND status = 'completed'
        AND sentiment_score IS NOT NULL
    `)
    .bind(campaignId)
    .all();

  if (!responses.results.length) {
    return new Response(JSON.stringify({
      error: 'No sentiment data available for this campaign'
    }), { status: 404 });
  }

  const sentimentScores = responses.results.map(r => r.sentiment_score);
  const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

  // Calculate distribution
  const distribution = {
    very_positive: sentimentScores.filter(s => s >= 0.8).length / sentimentScores.length,
    positive: sentimentScores.filter(s => s >= 0.6 && s < 0.8).length / sentimentScores.length,
    neutral: sentimentScores.filter(s => s >= 0.4 && s < 0.6).length / sentimentScores.length,
    negative: sentimentScores.filter(s => s >= 0.2 && s < 0.4).length / sentimentScores.length,
    very_negative: sentimentScores.filter(s => s < 0.2).length / sentimentScores.length
  };

  // Use Workers AI for detailed analysis
  const detailedAnalysis = await analyzeWithWorkersAI(env, responses.results);

  return new Response(JSON.stringify({
    campaign_id: campaignId,
    overall_sentiment: {
      score: avgSentiment,
      confidence: 0.89, // Calculate based on variance
      distribution
    },
    by_question: detailedAnalysis.byQuestion,
    themes: detailedAnalysis.themes,
    word_cloud: detailedAnalysis.wordCloud
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function analyzeWithWorkersAI(env: Env, responses: any[]): Promise<any> {
  // Use Cloudflare Workers AI for advanced sentiment analysis
  // This is a placeholder - implement with actual Workers AI
  return {
    byQuestion: [],
    themes: [],
    wordCloud: []
  };
}
```

## 🛡️ Middleware de Rate Limiting

```typescript
// src/middleware/rateLimit.ts
export async function checkRateLimit(
  env: Env,
  clientId: string,
  limits: { monthly: number; minute: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  const currentMonth = new Date().getMonth();

  const monthKey = `rate_limit:${clientId}:month:${currentMonth}`;
  const minuteKey = `rate_limit:${clientId}:minute:${currentMinute}`;

  const [monthCount, minuteCount] = await Promise.all([
    env.KV.get(monthKey),
    env.KV.get(minuteKey)
  ]);

  const monthUsed = parseInt(monthCount || '0');
  const minuteUsed = parseInt(minuteCount || '0');

  // Check limits
  if (monthUsed >= limits.monthly) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(now).setMonth(new Date(now).getMonth() + 1)
    };
  }

  if (minuteUsed >= limits.minute) {
    return {
      allowed: false,
      remaining: limits.minute - minuteUsed,
      resetTime: (currentMinute + 1) * 60000
    };
  }

  // Increment counters
  await Promise.all([
    env.KV.put(monthKey, String(monthUsed + 1), {
      expirationTtl: 60 * 60 * 24 * 32 // 32 days
    }),
    env.KV.put(minuteKey, String(minuteUsed + 1), {
      expirationTtl: 60 // 1 minute
    })
  ]);

  return {
    allowed: true,
    remaining: limits.monthly - monthUsed - 1,
    resetTime: new Date(now).setMonth(new Date(now).getMonth() + 1)
  };
}
```

## 📝 Sistema de Logs

```typescript
// src/middleware/logging.ts
export async function logAPIRequest(
  env: Env,
  request: Request,
  response: Response,
  clientId: string,
  responseTime: number
): Promise<void> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    client_id: clientId,
    method: request.method,
    url: request.url,
    status: response.status,
    response_time_ms: responseTime,
    user_agent: request.headers.get('User-Agent'),
    ip: request.headers.get('CF-Connecting-IP'),
    bytes: response.headers.get('Content-Length') || '0'
  };

  // Store in database
  await env.kudimu_db
    .prepare(`
      INSERT INTO api_logs (
        client_id, endpoint, method, status_code, 
        response_time_ms, bytes_transferred, user_agent, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      clientId,
      new URL(request.url).pathname,
      request.method,
      response.status,
      responseTime,
      parseInt(logEntry.bytes),
      logEntry.user_agent,
      logEntry.ip
    )
    .run();

  // Also store in R2 for long-term analysis
  const logKey = `api-logs/${new Date().toISOString().slice(0, 10)}/${clientId}/${Date.now()}.json`;
  await env.R2.put(logKey, JSON.stringify(logEntry));
}
```

## 🗃️ SQL Schemas Prontos

```sql
-- Schema completo para API
-- Executar quando implementar o serviço

-- Tabela de clientes API
CREATE TABLE IF NOT EXISTS api_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'professional', 'enterprise', 'custom')),
  client_secret_hash TEXT NOT NULL,
  rate_limit_month INTEGER DEFAULT 1000,
  rate_limit_minute INTEGER DEFAULT 10,
  scopes JSON DEFAULT '["campaigns:read"]',
  webhook_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tokens ativos (para revogação)
CREATE TABLE IF NOT EXISTS api_tokens (
  jti TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  scopes JSON NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES api_clients(id)
);

-- Logs de requisições
CREATE TABLE IF NOT EXISTS api_logs (
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
CREATE TABLE IF NOT EXISTS api_cache (
  cache_key TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSON NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Views otimizadas
CREATE VIEW IF NOT EXISTS api_usage_stats AS
SELECT 
  client_id,
  DATE(timestamp) as date,
  COUNT(*) as requests,
  AVG(response_time_ms) as avg_response_time,
  SUM(bytes_transferred) as total_bytes
FROM api_logs
GROUP BY client_id, DATE(timestamp);

CREATE VIEW IF NOT EXISTS campaign_api_data AS
SELECT 
  c.id as campaign_id,
  c.title,
  c.status,
  COUNT(r.id) as total_responses,
  AVG(r.completion_time_seconds) as avg_completion_time,
  AVG(r.sentiment_score) as avg_sentiment,
  COUNT(r.id) * 1.0 / NULLIF(c.target_participants, 0) as completion_rate
FROM campaigns c
LEFT JOIN responses r ON c.id = r.campaign_id AND r.status = 'completed'
GROUP BY c.id, c.title, c.status, c.target_participants;
```

## 🎯 Index Principal

```typescript
// src/index.ts
import { handleTokenRequest } from './handlers/auth';
import { handleCampaignData, handleCampaignList } from './handlers/campaigns';
import { handleSegmentation } from './handlers/segments';
import { handleSentimentAnalysis } from './handlers/sentiment';
import { verifyAPIToken } from './services/auth';
import { checkRateLimit } from './middleware/rateLimit';
import { logAPIRequest } from './middleware/logging';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    try {
      // Authentication endpoint (no auth required)
      if (url.pathname === '/api/auth/token') {
        const response = await handleTokenRequest(request, env);
        await logAPIRequest(env, request, response, 'anonymous', Date.now() - startTime);
        return response;
      }

      // All other endpoints require authentication
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({
          error: 'Missing or invalid authorization header'
        }), { status: 401 });
      }

      const token = authHeader.substring(7);
      const payload = await verifyAPIToken(env, token);
      
      if (!payload) {
        return new Response(JSON.stringify({
          error: 'Invalid or expired token'
        }), { status: 401 });
      }

      // Rate limiting
      const rateLimitResult = await checkRateLimit(env, payload.sub, payload.rate_limit);
      if (!rateLimitResult.allowed) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          remaining: rateLimitResult.remaining,
          reset_time: rateLimitResult.resetTime
        }), { status: 429 });
      }

      // Route to handlers
      let response: Response;

      if (url.pathname === '/api/campaigns') {
        response = await handleCampaignList(request, env, payload.sub);
      } else if (url.pathname.startsWith('/api/campaigns/')) {
        const parts = url.pathname.split('/');
        const campaignId = parts[3];
        const action = parts[4];

        switch (action) {
          case 'data':
            response = await handleCampaignData(request, env, campaignId, payload.sub);
            break;
          case 'segments':
            response = await handleSegmentation(request, env, campaignId);
            break;
          case 'sentiment':
            response = await handleSentimentAnalysis(request, env, campaignId);
            break;
          default:
            response = new Response(JSON.stringify({
              error: 'Endpoint not found'
            }), { status: 404 });
        }
      } else {
        response = new Response(JSON.stringify({
          error: 'Endpoint not found'
        }), { status: 404 });
      }

      // Log request
      await logAPIRequest(env, request, response, payload.sub, Date.now() - startTime);

      return response;

    } catch (error) {
      const errorResponse = new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), { status: 500 });

      await logAPIRequest(env, request, errorResponse, 'error', Date.now() - startTime);
      return errorResponse;
    }
  }
};
```

---

## 📋 Scripts de Setup

### Configuração inicial de cliente
```bash
# setup-client.sh
#!/bin/bash

CLIENT_NAME=$1
CLIENT_TIER=${2:-"basic"}

if [ -z "$CLIENT_NAME" ]; then
  echo "Usage: ./setup-client.sh <client_name> [tier]"
  exit 1
fi

CLIENT_ID="kudimu_$(date +%s)"
CLIENT_SECRET=$(openssl rand -hex 32)
SECRET_HASH=$(echo -n "$CLIENT_SECRET" | sha256sum | cut -d' ' -f1)

echo "Creating API client: $CLIENT_NAME"
echo "Client ID: $CLIENT_ID"
echo "Client Secret: $CLIENT_SECRET"
echo ""

# Insert into database (placeholder)
echo "INSERT INTO api_clients (id, name, tier, client_secret_hash) VALUES ('$CLIENT_ID', '$CLIENT_NAME', '$CLIENT_TIER', '$SECRET_HASH');"
```

### Monitoramento
```typescript
// scripts/monitor-api.ts
export async function generateAPIReport(env: Env): Promise<any> {
  const stats = await env.kudimu_db.prepare(`
    SELECT 
      client_id,
      DATE(timestamp) as date,
      COUNT(*) as requests,
      AVG(response_time_ms) as avg_response_time,
      SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors
    FROM api_logs 
    WHERE timestamp >= datetime('now', '-7 days')
    GROUP BY client_id, DATE(timestamp)
    ORDER BY date DESC, requests DESC
  `).all();

  return {
    period: 'Last 7 days',
    total_requests: stats.results.reduce((sum, row) => sum + row.requests, 0),
    avg_response_time: stats.results.reduce((sum, row) => sum + row.avg_response_time, 0) / stats.results.length,
    error_rate: stats.results.reduce((sum, row) => sum + row.errors, 0) / stats.results.reduce((sum, row) => sum + row.requests, 0),
    by_client: stats.results
  };
}
```

---

**Esta estrutura está pronta para implementação rápida quando um cliente solicitar o serviço da API!** 🚀