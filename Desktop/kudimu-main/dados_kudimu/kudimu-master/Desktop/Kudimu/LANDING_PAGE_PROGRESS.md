# 🎨 Landing Page Moderna - Kudimu Insights

## 📋 Status: EM DESENVOLVIMENTO

Esta é a nova Landing Page React com Tailwind CSS, incluindo todos os serviços do documento técnico.

## 🏗️ Estrutura Planejada

### 1. Hero Section ✅
- Gradient animado
- Stats (10k usuários, 500 campanhas, 95% satisfação)
- CTAs principais

### 2. Serviços Section ✅
- **Empresas** - Campanhas até 10k respostas, IA preditiva
- **Governos & ONGs** - Políticas públicas, campanhas sociais
- **Académicos** - Planos especiais 50k-180k AOA
- **Cidadãos** - Gratuito, recompensas, gamificação

### 3. API de Dados (NOVO!) 🔄
- Endpoints REST
- Autenticação JWT
- Dados agregados e segmentados
- Limites por volume

### 4. Preços Section 🔄
Baseado no documento `Serviços.md`:

#### Campanhas
- **Essencial**: 100.000 AOA (até 1k respostas)
- **Avançada**: 300k-800k AOA (até 10k respostas, IA)
- **Social**: 50.000 AOA (subvencionada, até 500 respostas)

#### Assinaturas
- **Mensal**: 250k-600k AOA/mês (painel + 2 campanhas)
- **API de Dados**: Sob consulta

#### Planos Académicos
- **Estudante**: 50.000 AOA (até 500 respostas)
- **Pesquisa**: 120.000 AOA (até 1.5k respostas)
- **Profissional**: 180.000 AOA (até 3k respostas)

#### Serviços Adicionais
- Criação assistida: 20k-50k AOA
- Tradução línguas locais: 15k AOA
- Relatório visual: 30k-80k AOA
- Formato académico: 25k AOA
- Simulação: 10k AOA
- Suporte 1:1: 15k AOA

### 5. Como Funciona 🔄
- **Para Empresas**: 3 passos (criar, segmentar, insights)
- **Para Usuários**: 3 passos (cadastrar, responder, ganhar)

### 6. Diferenciais 🔄
- IA adaptada ao contexto africano
- Sistema de reputação
- Recompensas diversas
- Infraestrutura global
- Mobile first
- Impacto social

### 7. Resultados Reais 🔄
- Case studies
- Testemunhos
- Métricas de sucesso

### 8. Impacto Social 🔄
- 10k+ usuários
- Inclusão digital
- Dados confiáveis
- Protagonismo local

### 9. API Documentation (NOVO!) 🔄
```
POST /api/auth/token
GET  /api/campaigns
GET  /api/campaigns/:id/data
GET  /api/campaigns/:id/segments
GET  /api/campaigns/:id/sentiment
GET  /api/campaigns/:id/predict
GET  /api/client/history
```

### 10. Footer 🔄
- Links rápidos
- Recursos
- Contato
- Social

## 🎯 Próximos Passos

1. ✅ Criar estrutura base com Hero e Serviços
2. 🔄 Adicionar seção de Preços com todas as tabelas
3. 🔄 Criar seção API de Dados
4. 🔄 Adicionar serviços adicionais
5. 🔄 Implementar animações Framer Motion
6. 🔄 Testar responsividade
7. 🔄 Integrar com App.js

## 📦 Componentes Necessários

- ✅ Button, Card, Badge (já criados)
- 🔄 PricingCard (criar)
- 🔄 ServiceCard (criar)
- 🔄 TestimonialCard (criar)
- 🔄 APIEndpointCard (criar)

---

*Última atualização: 15 de Outubro de 2025*
