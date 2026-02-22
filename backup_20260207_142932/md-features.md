# 📘 md-features.md
**Projeto:** Kudimu Insights  
**Versão:** 1.0  
**Responsável:** Ladislau  
**Objetivo:** Consolidar todas as funcionalidades técnicas da plataforma Kudimu Insights, com foco em pesquisa, sondagem e inteligência coletiva com IA integrada.

---

## 🧱 Arquitetura e Stack

| Camada         | Tecnologia                     | Função                                      |
|----------------|--------------------------------|---------------------------------------------|
| Front-end      | Cloudflare Pages + React       | Interface web responsiva                    |
| Mobile         | React Native (Expo)            | App Android/iOS                             |
| Back-end       | Cloudflare Workers             | Lógica de negócio, APIs, autenticação       |
| Banco de dados | D1 (SQL)                       | Usuários, campanhas, respostas, recompensas |
| Armazenamento  | R2                             | Relatórios, imagens, arquivos               |
| Sessões/cache  | KV (Key-Value)                 | Tokens, sessões, dados temporários          |
| IA             | Workers AI + Vectorize         | Embeddings, análise semântica, segmentação  |
| Segurança      | Cloudflare Zero Trust + Access | Proteção de rotas e dados sensíveis         |

---

## 🔄 Fluxos Técnicos

### 1. Cadastro e Autenticação
- Login via email, telefone ou social login (Google, TikTok, Facebook)
- Verificação OTP
- Sessão gerenciada via KV
- Tokens JWT para autenticação

### 2. Distribuição de Campanhas
- Workers filtram campanhas por perfil, reputação e localização
- Front-end exibe campanhas disponíveis com filtros

### 3. Envio e Validação de Respostas
- Validação automática: tempo, coerência, duplicidade
- Armazenamento em `answers`
- IA gera embeddings e envia para Vectorize

### 4. Análise com IA
- Workers AI processa respostas abertas
- Vectorize agrupa por similaridade semântica
- Dados agregados geram relatórios visuais

### 5. Recompensas
- Registro em `rewards`
- Saldo atualizado em `users`
- Integração futura com wallet ou operadoras móveis

---

## 🗂️ Estrutura de Dados (D1)

### Tabelas principais:

- `users`: dados do usuário, reputação, saldo, perfil
- `campaigns`: campanhas ativas, metas, recompensas
- `questions`: perguntas por campanha
- `answers`: respostas por usuário
- `rewards`: histórico de pagamentos
- `reports`: relatórios gerados por IA

---

## 🧠 IA e Análise de Dados

| Etapa         | Ferramenta              | Função                                      |
|---------------|-------------------------|---------------------------------------------|
| Coleta        | Workers + D1            | Armazenar respostas                         |
| Validação     | Workers + regras        | Detectar spam, inconsistência               |
| Limpeza       | Workers AI              | Padronização e correção                     |
| Embeddings    | Workers AI + Vectorize  | Vetorização semântica                       |
| Segmentação   | Vectorize + filtros     | Agrupamento por perfil e região             |
| Análise       | Workers AI              | Estatística, correlação, previsão           |
| Relatórios    | Workers + R2            | Gráficos, mapas, dashboards                 |
| Entrega       | API + painel            | Acesso seguro ao cliente                    |

---

## 🛡️ Sistema de Reputação

- Pontuação por participação, qualidade e engajamento
- Níveis: Explorador, Analista, Líder, Embaixador
- Validação automática com IA
- Feedback e contestação de rejeições
- Gamificação ética e missões sociais

---

## 📈 Escalabilidade e Performance

- Workers distribuem carga globalmente
- KV e R2 otimizam leitura e escrita
- IA executada em edge
- Banco D1 replicável com backup automático

---

## 📱 Requisitos de UX

- Interface leve e responsiva
- Suporte offline parcial (PWA)
- Idioma: português (futuro suporte a kimbundu, umbundu)
- Inclusão de usuários com baixa literacia digital

---

## 🔐 Segurança e Conformidade

- Cloudflare Access para rotas administrativas
- Tokens JWT
- Criptografia de dados sensíveis
- Logs e auditoria via Workers + R2
- Política de privacidade adaptada à LGPD Angola

---

## 📊 Painel Administrativo

- Gestão de campanhas, usuários e recompensas
- Visualização de dados em tempo real
- Exportação de relatórios (PDF, CSV, JSON)
- Simulações e testes sandbox
- Configurações avançadas e personalização

---

## 📎 Endpoints REST (Admin)

```
POST   /admin/campaigns/create
GET    /admin/campaigns/:id
PUT    /admin/campaigns/:id/edit
POST   /admin/campaigns/:id/approve
GET    /admin/users/:id
GET    /admin/reports/:id
GET    /admin/rewards/:userId
POST   /admin/notifications/send
```

---

## 🌍 Adaptação ao Mercado Angolano

- Segmentação por província, zona urbana/rural, faixa etária
- Recompensas em dados móveis ou benefícios locais
- Validação por telefone ou WhatsApp
- IA treinada com expressões locais e emojis

---

## 💰 Modelo de Negócio

| Segmento      | Valor gerado                        | Monetização                                |
|---------------|-------------------------------------|---------------------------------------------|
| Empresas      | Dados para produtos e campanhas     | Venda de relatórios, assinatura             |
| Governos/ONGs | Diagnóstico social                  | Projetos sob demanda                        |
| Usuários      | Recompensa por participação         | Pagamento por resposta, sistema de pontos   |

---

## 📎 Endpoints REST (Usuário)

```
POST   /auth/register
POST   /auth/verify
GET    /user/profile
GET    /user/reputation
POST   /user/request-verification
GET    /admin/verification-requests
POST   /admin/approve-verification
```

---

