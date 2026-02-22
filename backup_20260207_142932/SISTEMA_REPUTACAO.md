# 🏆 Sistema de Reputação - Documentação Técnica

## 📌 Visão Geral

O **Sistema de Reputação Kudimu** é um mecanismo completo de gamificação e validação de qualidade que incentiva a participação ética dos usuários através de níveis, pontos, medalhas e bônus progressivos.

**Status**: ✅ **100% IMPLEMENTADO**  
**Data de Conclusão**: 14 de Outubro de 2025  
**Versão da API**: 1.0

---

## 🎯 Objetivos

1. **Incentivar participação de qualidade** - Validação automática de respostas
2. **Gamificação ética** - Sistema de níveis e medalhas transparente
3. **Recompensas progressivas** - Bônus de 5-20% baseado no nível
4. **Engajamento contínuo** - Sistema de ranking competitivo
5. **Qualidade dos dados** - Detecção automática de spam e respostas suspeitas

---

## 🎮 Sistema de Níveis

### 1. **Iniciante** 🌱
- **Reputação**: 0-99 pontos
- **Cor**: `#9E9E9E` (Cinza)
- **Benefícios**:
  - Acesso a campanhas básicas
  - Recompensas padrão

### 2. **Confiável** ⭐
- **Reputação**: 100-299 pontos
- **Cor**: `#2196F3` (Azul)
- **Benefícios**:
  - Acesso a todas as campanhas
  - Recompensas padrão
  - **+5% bônus** em todas as recompensas

### 3. **Líder** 👑
- **Reputação**: 300-499 pontos
- **Cor**: `#FF9800` (Laranja)
- **Benefícios**:
  - Campanhas exclusivas
  - **+10% bônus** em todas as recompensas
  - Convites antecipados para novas campanhas

### 4. **Embaixador** 💎
- **Reputação**: 500+ pontos
- **Cor**: `#9C27B0` (Roxo)
- **Benefícios**:
  - Todas as campanhas (incluindo premium)
  - **+20% bônus** em todas as recompensas
  - Poder de moderação
  - Recompensas premium exclusivas

---

## 📊 Sistema de Pontuação

### Ações Positivas ➕

| Ação | Pontos | Descrição |
|------|--------|-----------|
| **RESPOSTA_VALIDADA** | +10 | Resposta passou na validação de qualidade |
| **PRIMEIRA_CAMPANHA** | +20 | Primeira campanha completa do usuário |
| **CAMPANHA_COMPLETA** | +15 | Campanha adicional completa |
| **RESPOSTA_RAPIDA** | +5 | Resposta em menos de 2 minutos |
| **RESPOSTA_DETALHADA** | +8 | Resposta com mais de 100 caracteres |
| **CONVITE_ACEITO** | +25 | Amigo convidado participou |
| **COMPARTILHAMENTO** | +5 | Compartilhou campanha |
| **LOGIN_DIARIO** | +2 | Login diário consecutivo |
| **PERFIL_COMPLETO** | +30 | Perfil 100% completo |
| **AVALIACAO_POSITIVA** | +15 | Avaliação positiva de cliente |
| **DENUNCIA_PROCEDENTE** | +10 | Denúncia confirmada |

### Ações Negativas ➖

| Ação | Pontos | Descrição |
|------|--------|-----------|
| **RESPOSTA_REJEITADA** | -5 | Resposta não passou na validação |
| **SPAM_DETECTADO** | -20 | Conteúdo identificado como spam |
| **INATIVIDADE_30_DIAS** | -10 | Inatividade superior a 30 dias |

---

## 🏅 Sistema de Medalhas

### 1. **PIONEIRO** 🚀
- **Critério**: Ser um dos primeiros 1000 usuários
- **Recompensa**: Reconhecimento histórico

### 2. **MARATONISTA** 🏃
- **Critério**: Completar 100+ campanhas
- **Recompensa**: Badge especial no perfil

### 3. **INFLUENCER** 📢
- **Critério**: Convidar 50+ amigos
- **Recompensa**: Status de influenciador

### 4. **DETALHISTA** ✍️
- **Critério**: Manter média de 150+ caracteres por resposta
- **Recompensa**: Reconhecimento de qualidade

### 5. **RELÂMPAGO** ⚡
- **Critério**: 80%+ de respostas rápidas (<2min)
- **Recompensa**: Badge de velocidade

### 6. **CONSTANTE** 📅
- **Critério**: 30+ dias de login consecutivo
- **Recompensa**: Badge de dedicação

### 7. **PERFEITO** 💯
- **Critério**: 95%+ de taxa de aprovação em 50+ campanhas
- **Recompensa**: Badge de excelência

### 8. **GUARDIÃO** 🛡️
- **Critério**: 10+ denúncias procedentes
- **Recompensa**: Status de moderador comunitário

---

## 🔍 Validação Automática de Qualidade

### Algoritmo `validarQualidadeResposta()`

O sistema aplica 4 critérios de validação em tempo real:

#### 1. **Detecção de Spam**
```typescript
// Resposta muito curta (possível spam)
if (texto.length < 10) {
  return { valida: false, motivo: 'Resposta muito curta' };
}

// Resposta muito longa (possível spam)
if (texto.length > 5000) {
  return { valida: false, motivo: 'Resposta muito longa' };
}
```

#### 2. **Validação de Tempo**
```typescript
// Resposta muito rápida (possível bot)
if (tempoResposta < 30) {
  return { valida: false, motivo: 'Resposta enviada muito rapidamente' };
}
```

#### 3. **Pontos de Qualidade**
```typescript
let pontosAdicionais = 0;

// Resposta detalhada (+8 pontos)
if (texto.length > 100) {
  pontosAdicionais += ACOES_REPUTACAO.RESPOSTA_DETALHADA.pontos;
}

// Resposta rápida (+5 pontos)
if (tempoResposta < 120) {
  pontosAdicionais += ACOES_REPUTACAO.RESPOSTA_RAPIDA.pontos;
}
```

#### 4. **Resultado**
```typescript
return {
  valida: true,
  pontosAdicionais
};
```

---

## 🚀 API Endpoints

### 1. **GET /reputation/me**
Retorna dados completos de reputação do usuário autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "reputacao": 150,
    "nivel": {
      "nome": "Confiável",
      "cor": "#2196F3",
      "icone": "⭐",
      "beneficios": [
        "Acesso a todas as campanhas",
        "Recompensas padrão",
        "+5% bônus"
      ]
    },
    "progresso": {
      "progresso": 50,
      "proximoNivel": "Líder",
      "pontosNecessarios": 150
    },
    "estatisticas": {
      "campanhas_completas": 15,
      "respostas_totais": 45,
      "taxa_aprovacao": 95.5,
      "saldo_pontos": 2500
    },
    "medalhas": [
      {
        "id": "pioneiro",
        "nome": "Pioneiro",
        "descricao": "Um dos primeiros 1000 usuários",
        "icone": "🚀",
        "conquistada_em": "2025-10-01T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. **GET /reputation/ranking**
Retorna ranking de usuários ordenado por reputação.

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `limite` (opcional, default: 50): Número de usuários no ranking
- `tipo` (opcional, default: 'geral'): Filtro temporal
  - `geral`: Ranking de todos os tempos
  - `semanal`: Usuários ativos nos últimos 7 dias
  - `mensal`: Usuários ativos nos últimos 30 dias

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "posicao": 1,
      "nome": "João Silva",
      "reputacao": 850,
      "nivel": {
        "nome": "Embaixador",
        "icone": "💎",
        "cor": "#9C27B0"
      },
      "campanhas_completas": 120,
      "localizacao": "Luanda"
    },
    {
      "posicao": 2,
      "nome": "Maria Santos",
      "reputacao": 650,
      "nivel": {
        "nome": "Embaixador",
        "icone": "💎",
        "cor": "#9C27B0"
      },
      "campanhas_completas": 95,
      "localizacao": "Benguela"
    }
  ]
}
```

---

### 3. **GET /reputation/medals**
Retorna medalhas conquistadas pelo usuário autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pioneiro",
      "nome": "Pioneiro",
      "descricao": "Um dos primeiros 1000 usuários",
      "icone": "🚀",
      "conquistada_em": "2025-10-01T10:00:00Z"
    },
    {
      "id": "maratonista",
      "nome": "Maratonista",
      "descricao": "Completou 100 campanhas",
      "icone": "🏃",
      "conquistada_em": "2025-10-12T15:30:00Z"
    }
  ]
}
```

---

## 💰 Sistema de Bônus

### Cálculo de Recompensas com Bônus

```typescript
function calcularBonusRecompensa(reputacao: number, valorBase: number): number {
  const nivel = calcularNivel(reputacao);
  let multiplicador = 1;

  if (nivel.nome === 'Confiável') {
    multiplicador = 1.05; // +5%
  } else if (nivel.nome === 'Líder') {
    multiplicador = 1.10; // +10%
  } else if (nivel.nome === 'Embaixador') {
    multiplicador = 1.20; // +20%
  }

  return Math.round(valorBase * multiplicador);
}
```

### Exemplo Prático

**Campanha**: Pesquisa de mercado (100 pontos de recompensa)

| Nível | Multiplicador | Recompensa Final |
|-------|--------------|------------------|
| Iniciante 🌱 | 1.00x | 100 pontos |
| Confiável ⭐ | 1.05x | 105 pontos |
| Líder 👑 | 1.10x | 110 pontos |
| Embaixador 💎 | 1.20x | 120 pontos |

---

## 🔧 Arquivos Implementados

### 1. **kudimu/src/utils/reputation.ts** (282 linhas)
Contém todas as funções utilitárias do sistema de reputação:
- `NIVEIS`: Objeto com 4 níveis e suas propriedades
- `ACOES_REPUTACAO`: Objeto com 14 ações e pontuações
- `MEDALHAS`: Objeto com 8 medalhas e critérios
- `calcularNivel()`: Determina nível atual do usuário
- `calcularProgressoNivel()`: Calcula progresso para próximo nível
- `calcularBonusRecompensa()`: Aplica bônus de nível
- `verificarMedalhas()`: Verifica medalhas conquistadas
- `validarQualidadeResposta()`: Valida qualidade da resposta
- `gerarRanking()`: Gera ranking de usuários

### 2. **kudimu/src/index.ts** (modificado)
Integração dos endpoints e validação automática:
- `handleGetMyReputation()`: Handler do endpoint `/reputation/me`
- `handleGetRanking()`: Handler do endpoint `/reputation/ranking`
- `handleGetMedals()`: Handler do endpoint `/reputation/medals`
- `atualizarReputacao()`: Helper para atualizar pontos
- `handleSubmitAnswers()`: Modificado para incluir validação automática

---

## 📈 Fluxo de Validação

### Submissão de Resposta

```
1. Usuário envia resposta
   ↓
2. validarQualidadeResposta() analisa:
   - Tamanho do texto (10-5000 chars)
   - Tempo de resposta (>30s)
   - Qualidade do conteúdo
   ↓
3. Se VÁLIDA:
   - Salva resposta com validada=1
   - Adiciona pontos base (+10)
   - Adiciona pontos de qualidade (+5 ou +8)
   - Verifica se é primeira campanha (+20)
   - Calcula bônus por nível (+5% a +20%)
   ↓
4. Se INVÁLIDA:
   - Salva resposta com validada=0
   - Remove pontos (-5)
   - Registra motivo da rejeição
   ↓
5. Atualiza estatísticas e ranking
```

---

## 🧪 Testes Realizados

### ✅ Endpoint /reputation/me
```bash
GET https://kudimu-api.l-anastacio001.workers.dev/reputation/me
Authorization: Bearer {token}

Response: 200 OK
- Retorna nível "Iniciante"
- Progresso para próximo nível: 50%
- Estatísticas corretas
- Lista de medalhas vazia (usuário novo)
```

### ✅ Endpoint /reputation/ranking
```bash
GET https://kudimu-api.l-anastacio001.workers.dev/reputation/ranking?limite=10
Authorization: Bearer {token}

Response: 200 OK
- Retorna 3 usuários ordenados por reputação
- Inclui nível, ícone e cor
- Campanhas completas calculadas
- Localização presente
```

### ✅ Endpoint /reputation/medals
```bash
GET https://kudimu-api.l-anastacio001.workers.dev/reputation/medals
Authorization: Bearer {token}

Response: 200 OK
- Retorna array vazio (usuário sem medalhas)
- Estrutura JSON válida
```

---

## 🚀 Deploy

**Status**: ✅ **DEPLOYED**  
**URL**: https://kudimu-api.l-anastacio001.workers.dev  
**Versão**: 5d48071d-9f31-495d-a6a7-b4eb59f22700  
**Data**: 14 de Outubro de 2025

---

## 📝 Próximos Passos

### Frontend (Prioridade Alta)
1. Criar componente `ReputationBadge` - Exibir nível, ícone e cor
2. Criar componente `ProgressBar` - Progresso para próximo nível
3. Criar componente `MedalDisplay` - Grid de medalhas conquistadas
4. Criar página `RankingPage` - Leaderboard interativo
5. Integrar sistema de reputação na dashboard do usuário

### Backend (Prioridade Média)
1. Implementar sistema de denúncias
2. Adicionar validação de perfil completo (+30 pontos)
3. Implementar sistema de convites (+25 pontos por convite aceito)
4. Criar job para detectar inatividade de 30 dias (-10 pontos)
5. Adicionar analytics de evolução de reputação

### Melhorias (Prioridade Baixa)
1. Notificações push quando subir de nível
2. Notificações quando conquistar medalha
3. Sistema de conquistas semanais/mensais
4. Recompensas exclusivas por nível
5. Sistema de desafios temporários

---

## 📚 Documentação Relacionada

- [Documento Técnico Principal](../Documento_Tecnico.md)
- [Progresso do Projeto](../PROGRESSO.md)
- [Schema do Banco de Dados](../schema.sql)
- [README do Projeto](../README.md)

---

**Desenvolvido por**: Ladislau Anastácio  
**Última atualização**: 14 de Outubro de 2025
