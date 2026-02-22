

1. 💰 Plano de preços competitivo em Kwanza
2. 🔗 Estrutura técnica do serviço API de Dados
3. 📎 Endpoints sugeridos e regras de acesso
4. 🧾 Preparação para desenvolvimento


---

# 📘 Documento Técnico — Plano de Preços + API de Dados  
*Projeto:* Kudimu Insights  
*Versão:* 1.0  
*Data:* Outubro 2025  
*Responsável:* Ladislau

---

## 💰 Plano de Preços — Kudimu Insights (em Kwanza - AOA)

| Plano | Ideal para | Preço (AOA) | Inclui |
|-------|------------|-------------|--------|
| *Campanha Essencial* | Pequenas empresas, ONGs locais | 100.000 AOA | Até 1.000 respostas, relatório simples |
| *Campanha Avançada* | Produtos, políticas públicas | 300.000–800.000 AOA | Até 10.000 respostas, IA, segmentação |
| *Assinatura Mensal* | Monitoramento contínuo | 250.000–600.000 AOA/mês | Painel + 2 campanhas/mês |
| *API de Dados* | Integração externa | Sob consulta | Token de acesso, limites por volume |
| *Campanha Social (subvencionada)* | Projetos de impacto | 50.000 AOA | Até 500 respostas, validação ética obrigatória |

---

## 🔗 Estrutura Técnica — Serviço API de Dados

### 🎯 Objetivo

Permitir que clientes autorizados acessem dados agregados, segmentados e anonimizados diretamente via API, para integração com seus sistemas internos (dashboards, CRMs, BI).

---

## 🧱 Componentes

- *Autenticação:* via token JWT gerado pelo painel admin  
- *Limites de acesso:* por volume, tipo de dado e tempo  
- *Formato de resposta:* JSON estruturado, com metadados  
- *Segurança:* Cloudflare Access + validação de escopo  
- *Logs:* armazenados em R2 para auditoria

---

## 📦 Tipos de dados disponíveis

| Tipo | Descrição |
|------|-----------|
| Dados agregados | Totais por campanha, região, faixa etária |
| Segmentação | Filtros por perfil, reputação, localização |
| Sentimento | Análise semântica de respostas abertas |
| Previsões | Modelos preditivos gerados por IA |
| Histórico | Resultados anteriores por cliente ou tema

---

## 📎 Endpoints REST (API de Dados)

```plaintext
POST   /api/auth/token               → Gera token de acesso
GET    /api/campaigns                → Lista campanhas disponíveis
GET    /api/campaigns/:id/data       → Dados agregados da campanha
GET    /api/campaigns/:id/segments   → Segmentação por perfil
GET    /api/campaigns/:id/sentiment  → Análise de sentimento
GET    /api/campaigns/:id/predict    → Previsão de aceitação
GET    /api/client/history           → Histórico de campanhas


---

🔐 Regras de acesso

Regra	Valor	
Autorização	Apenas clientes verificados	
Token	Válido por 30 dias	
Limite de requisições	1.000 por mês (plano básico)	
Dados sensíveis	Sempre anonimizados	
Exportação	Permitida via JSON ou CSV	


---

🧾 Preparação para desenvolvimento

1. Banco de dados (Supabase)

• Tabelas: campaigns, answers, reports, segments, clients
• Views para dados agregados e segmentados


2. Cloudflare Workers

• Middleware para autenticação e escopo
• Cache via KV para respostas frequentes
• Logs em R2


3. Painel administrativo

• Geração e revogação de tokens
• Monitoramento de uso da API
• Exportação manual dos dados



## 🎓 Inclusão de Estudantes, Pesquisadores e Profissionais Independentes

### 1. Público-alvo

- Estudantes universitários (licenciatura, mestrado, doutoramento)
- Pesquisadores vinculados a instituições
- Profissionais independentes (consultores, jornalistas, empreendedores)

---

### 2. Estratégias de inclusão

| Estratégia | Descrição |
|------------|-----------|
| Plano Acadêmico | Campanhas com preços reduzidos e validação ética |
| Verificação simplificada | Cadastro com comprovativo institucional (email .edu, declaração, etc.) |
| Campanhas privadas | Dados não públicos, voltados para teses ou projetos internos |
| Suporte técnico | Ajuda na estruturação de perguntas e segmentação |
| Relatório acadêmico | Formato adaptado para uso em teses e artigos científicos |

---

## 💰 Planos Acadêmicos e Profissionais (em Kwanza - AOA)

| Plano | Preço (AOA) | Inclui |
|-------|-------------|--------|
| Plano Estudante | 50.000 AOA | Até 500 respostas, relatório básico, validação ética |
| Plano Pesquisa Acadêmica | 120.000 AOA | Até 1.500 respostas, relatório completo, segmentação |
| Plano Profissional Independente | 180.000 AOA | Até 3.000 respostas, relatório com IA, suporte técnico

> Todos os planos incluem anonimização dos dados, suporte ético e entrega em até 7 dias.

---

## 🧩 Serviços Adicionais Sob Demanda

| Serviço | Descrição | Preço (AOA) |
|--------|-----------|-------------|
| Criação assistida de campanha | Ajuda na estruturação das perguntas e público-alvo | 20.000–50.000 AOA |
| Tradução para línguas locais | Umbundu, Kimbundu, Kikongo | 15.000 AOA por campanha |
| Relatório visual personalizado | Gráficos, mapa de calor, nuvem de palavras | 30.000–80.000 AOA |
| Exportação em formato acadêmico | PDF com estrutura de tese (introdução, método, resultados) | 25.000 AOA |
| Simulação de campanha | Teste com dados fictícios para validação metodológica | 10.000 AOA |
| Suporte técnico 1:1 | Sessão de 30 min com especialista Kudimu | 15.000 AOA

---

## 🔐 Regras técnicas

- Dados anonimizados e protegidos por Cloudflare Access
- Validação ética obrigatória para campanhas acadêmicas
- Relatórios entregues em formato PDF e JSON
- Exportação compatível com LaTeX, Word e Zotero (via CSV)

---

## 📎 Endpoints REST relacionados

```plaintext
POST   /user/request-academic-access
GET    /user/academic-plans
POST   /campaigns/create-academic
GET    /campaigns/:id/report-academic
POST   /support/schedule-session