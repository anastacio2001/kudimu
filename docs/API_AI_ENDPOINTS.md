# API Workers AI - Documentação de Endpoints

Esta documentação descreve os endpoints de inteligência artificial disponíveis na plataforma Kudimu, utilizando Cloudflare Workers AI e Vectorize.

## Configuração

### Modelos Utilizados
- **Embeddings**: `@cf/baai/bge-large-en-v1.5` (1024 dimensões)
- **Análise de Sentimento**: `@cf/huggingface/distilbert-sst-2-int8`

### Bindings Necessários
```toml
[ai]
binding = "kudimu_ai"
model = "@cf/baai/bge-large-en-v1.5"
remote = true

[[vectorize]]
binding = "VECTORIZE"
index_name = "kudimu-respostas-index"
remote = true
```

---

## Endpoints Disponíveis

### 1. Gerar Embedding
Gera um vetor de embedding (1024 dimensões) para um texto fornecido.

**Endpoint**: `POST /ai/embedding`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "texto": "Este é o texto para gerar embedding"
}
```

**Resposta de Sucesso** (200):
```json
{
  "success": true,
  "data": {
    "embedding": [0.123, -0.456, 0.789, ...], // Array com 1024 números
    "dimensoes": 1024,
    "modelo": "@cf/baai/bge-large-en-v1.5",
    "texto_original": "Este é o texto para gerar embedding"
  }
}
```

**Resposta de Erro** (400):
```json
{
  "success": false,
  "error": "Texto é obrigatório para gerar embedding"
}
```

**Uso Prático**:
- Gerar embeddings de respostas de campanhas para busca semântica
- Criar vetores para comparação de similaridade
- Indexar conteúdo para recomendações

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8787/ai/embedding \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Trabalho na área de tecnologia há 5 anos"
  }'
```

---

### 2. Análise de Sentimento
Analisa o sentimento de um texto (positivo, negativo ou neutro).

**Endpoint**: `POST /ai/sentiment`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "texto": "Este produto é excelente! Recomendo muito."
}
```

**Resposta de Sucesso** (200):
```json
{
  "success": true,
  "data": {
    "sentimento": "positivo",
    "score": 0.98,
    "confianca": 0.98,
    "modelo": "@cf/huggingface/distilbert-sst-2-int8",
    "texto_analisado": "Este produto é excelente! Recomendo muito."
  }
}
```

**Possíveis Valores de Sentimento**:
- `"positivo"` - Sentimento positivo (score próximo de 1.0)
- `"negativo"` - Sentimento negativo (score próximo de 0.0)
- `"neutro"` - Sentimento neutro (score próximo de 0.5)

**Resposta de Erro** (400):
```json
{
  "success": false,
  "error": "Texto é obrigatório para análise de sentimento"
}
```

**Uso Prático**:
- Analisar feedback de usuários em campanhas
- Detectar respostas negativas automaticamente
- Gerar relatórios de satisfação

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8787/ai/sentiment \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "O serviço está péssimo e demorado"
  }'
```

---

### 3. Busca Semântica
Encontra respostas semanticamente similares usando embeddings e Vectorize.

**Endpoint**: `POST /ai/search/similar`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "query": "problemas com qualidade do produto",
  "topK": 10,
  "campanha_id": "camp_123"
}
```

**Parâmetros**:
- `query` (string, obrigatório): Texto de busca
- `topK` (number, opcional): Número de resultados (padrão: 10)
- `campanha_id` (string, opcional): Filtrar por campanha específica

**Resposta de Sucesso** (200):
```json
{
  "success": true,
  "data": {
    "query": "problemas com qualidade do produto",
    "total_resultados": 5,
    "resultados": [
      {
        "id": "resp_456",
        "texto": "A qualidade do produto deixou muito a desejar...",
        "similaridade": 0.92,
        "campanha_id": "camp_123",
        "campanha_titulo": "Pesquisa de Satisfação 2024",
        "usuario_nome": "João Silva",
        "data_resposta": "2024-11-01T10:30:00Z"
      },
      {
        "id": "resp_789",
        "texto": "Produto com defeitos de fabricação...",
        "similaridade": 0.87,
        "campanha_id": "camp_123",
        "campanha_titulo": "Pesquisa de Satisfação 2024",
        "usuario_nome": "Maria Santos",
        "data_resposta": "2024-11-02T14:20:00Z"
      }
    ]
  }
}
```

**Uso Prático**:
- Encontrar respostas similares para análise temática
- Identificar padrões em feedback de usuários
- Agrupar reclamações relacionadas

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8787/ai/search/similar \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "falta de capacitação profissional",
    "topK": 5,
    "campanha_id": "camp_123"
  }'
```

---

### 4. Clustering de Respostas Similares
Agrupa automaticamente respostas similares por tema usando embeddings.

**Endpoint**: `POST /ai/cluster/similar-responses`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "campanha_id": "camp_123",
  "threshold": 0.8
}
```

**Parâmetros**:
- `campanha_id` (string, obrigatório): ID da campanha
- `threshold` (number, opcional): Limiar de similaridade 0-1 (padrão: 0.8)

**Resposta de Sucesso** (200):
```json
{
  "success": true,
  "data": {
    "campanha_id": "camp_123",
    "threshold": 0.8,
    "total_clusters": 3,
    "total_respostas_agrupadas": 45,
    "clusters": [
      {
        "cluster_id": 1,
        "tema_principal": "Falta de capacitação profissional",
        "quantidade": 15,
        "similaridade_media": 0.89,
        "respostas": [
          {
            "id": "resp_123",
            "texto": "Falta formação profissional na área...",
            "similaridade": 0.95,
            "usuario_nome": "António Silva"
          },
          {
            "id": "resp_456",
            "texto": "Necessidade de mais cursos técnicos...",
            "similaridade": 0.87,
            "usuario_nome": "Maria Costa"
          }
        ]
      },
      {
        "cluster_id": 2,
        "tema_principal": "Dificuldade em encontrar emprego",
        "quantidade": 18,
        "similaridade_media": 0.85,
        "respostas": [
          {
            "id": "resp_789",
            "texto": "Mercado de trabalho muito competitivo...",
            "similaridade": 0.91,
            "usuario_nome": "João Pedro"
          }
        ]
      },
      {
        "cluster_id": 3,
        "tema_principal": "Salários baixos",
        "quantidade": 12,
        "similaridade_media": 0.82,
        "respostas": [
          {
            "id": "resp_321",
            "texto": "Remuneração não compatível com formação...",
            "similaridade": 0.88,
            "usuario_nome": "Ana Ferreira"
          }
        ]
      }
    ]
  }
}
```

**Uso Prático**:
- Identificar automaticamente temas principais em campanhas
- Gerar relatórios de insights por categoria
- Priorizar ações baseadas em grupos de feedback

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8787/ai/cluster/similar-responses \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "campanha_id": "camp_123",
    "threshold": 0.85
  }'
```

---

## Funções Utilitárias (src/utils/ai.ts)

### gerarEmbedding()
```typescript
import { gerarEmbedding } from './utils/ai';

const embedding = await gerarEmbedding(env.kudimu_ai, "texto para processar");
// Retorna: number[] com 1024 dimensões
```

### gerarEmbeddingsBatch()
```typescript
import { gerarEmbeddingsBatch } from './utils/ai';

const textos = ["texto 1", "texto 2", "texto 3"];
const embeddings = await gerarEmbeddingsBatch(env.kudimu_ai, textos);
// Retorna: number[][] - array de arrays
```

### inserirVectorize()
```typescript
import { inserirVectorize } from './utils/ai';

await inserirVectorize(
  env.VECTORIZE,
  "resp_123",
  embedding,
  { campanha_id: "camp_1", usuario_id: "user_1" }
);
```

### buscaSemantica()
```typescript
import { buscaSemantica } from './utils/ai';

const resultados = await buscaSemantica(
  env.VECTORIZE,
  queryEmbedding,
  10, // topK
  { campanha_id: "camp_1" } // filtro opcional
);
```

### calcularSimilaridade()
```typescript
import { calcularSimilaridade } from './utils/ai';

const similaridade = calcularSimilaridade(embedding1, embedding2);
// Retorna: número entre -1 e 1 (cosseno similarity)
```

### agruparRespostasSimilares()
```typescript
import { agruparRespostasSimilares } from './utils/ai';

const respostas = [
  { id: "1", embedding: [...], texto: "..." },
  { id: "2", embedding: [...], texto: "..." }
];

const grupos = agruparRespostasSimilares(respostas, 0.8);
// Retorna grupos de respostas similares
```

### analisarSentimento()
```typescript
import { analisarSentimento } from './utils/ai';

const resultado = await analisarSentimento(env.kudimu_ai, "texto para analisar");
// Retorna: { sentimento: string, score: number, confianca: number }
```

### detectarSpam()
```typescript
import { detectarSpam } from './utils/ai';

const resultado = await detectarSpam("texto suspeito");
// Retorna: { isSpam: boolean, score: number, razoes: string[] }
```

---

## Criação do Índice Vectorize

Para usar os endpoints de busca semântica e clustering, é necessário criar o índice Vectorize:

```bash
# Criar índice com 1024 dimensões (bge-large-en-v1.5)
npx wrangler vectorize create kudimu-respostas-index \
  --dimensions=1024 \
  --metric=cosine

# Listar índices existentes
npx wrangler vectorize list

# Ver detalhes do índice
npx wrangler vectorize info kudimu-respostas-index
```

---

## Limitações e Considerações

### Desenvolvimento Local
- **Workers AI**: Sempre usa recursos remotos (incorre custos)
- **Vectorize**: Não suporta desenvolvimento local, requer `remote: true`

### Limites de Tamanho
- **Embedding**: Texto limitado a 5000 caracteres
- **Sentimento**: Texto limitado a 1000 caracteres
- **Vetores**: 1024 dimensões (fixo para bge-large-en-v1.5)

### Performance
- **Embeddings**: ~100-200ms por texto
- **Sentimento**: ~50-100ms por texto
- **Busca Vectorize**: ~10-50ms por query
- **Clustering**: Depende do número de respostas (O(n²) no pior caso)

### Custos (Cloudflare Workers AI)
- Embeddings: ~$0.004 por 1M tokens
- Análise de Sentimento: ~$0.004 por 1M tokens
- Vectorize: Incluído no plano Workers Paid

---

## Exemplos de Integração

### Processar Respostas de Campanha
```typescript
// Quando uma nova resposta é submetida
const resposta = await salvarResposta(dados);

// Gerar embedding
const embedding = await gerarEmbedding(env.kudimu_ai, resposta.texto);

// Analisar sentimento
const sentimento = await analisarSentimento(env.kudimu_ai, resposta.texto);

// Detectar spam
const spam = await detectarSpam(resposta.texto);

// Salvar no Vectorize para busca semântica
if (!spam.isSpam) {
  await inserirVectorize(
    env.VECTORIZE,
    resposta.id,
    embedding,
    {
      campanha_id: resposta.campanha_id,
      usuario_id: resposta.usuario_id,
      sentimento: sentimento.sentimento,
      data: new Date().toISOString()
    }
  );
}
```

### Gerar Relatório de Insights
```typescript
// Buscar clusters para uma campanha
const response = await fetch('/ai/cluster/similar-responses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    campanha_id: 'camp_123',
    threshold: 0.8
  })
});

const { clusters } = await response.json();

// Exibir temas principais
clusters.forEach(cluster => {
  console.log(`Tema: ${cluster.tema_principal}`);
  console.log(`Respostas: ${cluster.quantidade}`);
  console.log(`Similaridade: ${cluster.similaridade_media.toFixed(2)}`);
});
```

---

## Troubleshooting

### Erro: "No index was found with name 'kudimu-respostas-index'"
**Solução**: Criar o índice Vectorize usando wrangler:
```bash
npx wrangler vectorize create kudimu-respostas-index --dimensions=1024 --metric=cosine
```

### Erro: "Token de autorização necessário"
**Solução**: Incluir header de autorização:
```
Authorization: Bearer seu-token-jwt
```

### Erro: "Texto muito curto para gerar embedding"
**Solução**: Garantir que o texto tenha pelo menos 10 caracteres.

### Performance lenta em clustering
**Solução**:
- Reduzir o threshold (aumenta performance, reduz precisão)
- Processar em batches menores
- Usar cache para embeddings já calculados

---

## Próximos Passos

1. **Criar índice Vectorize em produção**
   ```bash
   npx wrangler vectorize create kudimu-respostas-index --dimensions=1024 --metric=cosine
   ```

2. **Testar endpoints no Postman/Insomnia**
   - Importar collection dos endpoints
   - Configurar token de autenticação
   - Testar cada endpoint com dados reais

3. **Integrar no frontend**
   - Criar página de insights AI
   - Exibir clusters de respostas
   - Mostrar análise de sentimento em tempo real

4. **Otimizações futuras**
   - Cache de embeddings no D1
   - Processamento em background para campanhas grandes
   - Dashboard de analytics AI

---

## Suporte

Para dúvidas ou problemas:
- Documentação Cloudflare Workers AI: https://developers.cloudflare.com/workers-ai/
- Documentação Vectorize: https://developers.cloudflare.com/vectorize/

---

**Última atualização**: 2025-11-03
**Versão**: 1.0.0
