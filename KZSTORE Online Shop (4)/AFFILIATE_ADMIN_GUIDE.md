# Guia do Admin - Sistema de Afiliados

## 🎯 Como Aprovar Afiliados

### Passo a Passo

1. **Acessar Painel Admin**
   - Faça login com conta de administrador
   - Clique no ícone de usuário > **Painel Admin**

2. **Navegar para Afiliados**
   - No painel admin, clique na aba **"Afiliados"**
   - Você verá estatísticas gerais no topo:
     - Total de afiliados
     - Pendentes de aprovação
     - Aprovados
     - Rejeitados
     - Comissões pendentes de pagamento

3. **Ver Afiliados Pendentes**
   - Use o filtro **"Status"** > selecione **"Pendente"**
   - Ou use a busca para encontrar por nome/email
   - Lista mostra:
     - Nome do afiliado
     - Email
     - Data de registro
     - Taxa de comissão atual
     - Ações disponíveis

4. **Aprovar um Afiliado**
   - Clique no botão **"Aprovar"** (ícone verde) na linha do afiliado
   - Modal de confirmação abre mostrando:
     - Dados do afiliado
     - Campo para ajustar taxa de comissão (padrão: 10%)
   - Revise as informações
   - Ajuste a comissão se necessário (ex: 15% para afiliado VIP)
   - Clique em **"Confirmar Aprovação"**
   - Afiliado recebe status "Aprovado" e pode começar a criar campanhas

5. **Rejeitar um Afiliado**
   - Clique no botão **"Rejeitar"** (ícone vermelho)
   - Confirme a ação
   - Afiliado recebe status "Rejeitado" e não pode acessar o painel

## 📊 Dashboard de Afiliados

### Estatísticas Visíveis

**Cartões de Resumo:**
- **Total de Afiliados**: Todos os afiliados cadastrados
- **Pendentes**: Aguardando aprovação
- **Aprovados**: Ativos no sistema
- **Rejeitados**: Não aprovados
- **Comissão Pendente**: Total a pagar para afiliados

**Tabela de Afiliados:**
| Coluna | Descrição |
|--------|-----------|
| Nome | Nome completo do afiliado |
| Email | Email de contato |
| Código | Código único do afiliado (gerado automaticamente) |
| Status | Pendente / Aprovado / Rejeitado / Suspenso |
| Taxa | Porcentagem de comissão (ex: 10%) |
| Vendas | Total de vendas geradas |
| Cliques | Total de cliques nos links |
| Receita | Valor total em vendas |
| Comissão | Valor ganho pelo afiliado |
| Registro | Data de cadastro |
| Ações | Aprovar / Rejeitar / Editar |

## 🔧 Gestão de Afiliados

### Ajustar Taxa de Comissão

1. Clique no botão **"Editar"** (ícone de lápis)
2. Digite nova taxa de comissão (ex: 15.00 para 15%)
3. Confirme a alteração
4. Taxa é atualizada para vendas futuras

### Filtros Disponíveis

**Por Status:**
- Todos
- Pendente
- Aprovado
- Rejeitado
- Suspenso

**Por Data:**
- Últimos 7 dias
- Últimos 30 dias
- Último ano
- Período customizado

**Busca:**
- Buscar por nome
- Buscar por email
- Buscar por código

### Exportar Dados

1. Clique no botão **"Exportar"** (ícone de download)
2. Selecione formato:
   - CSV (para Excel)
   - JSON (para sistemas)
3. Arquivo é baixado com todos os dados visíveis

## 💰 Gestão de Comissões

### Ver Comissões Pendentes

Na tabela, coluna **"Comissão"** mostra:
- Verde: Comissão paga
- Amarelo: Comissão pendente
- Cinza: Sem comissões

### Pagar Comissões

1. Identifique afiliados com comissão pendente
2. Clique em **"Pagar"** na linha do afiliado
3. Sistema atualizará status para "Pago"
4. Registro é salvo em `affiliate_payments`

**Importante:** O pagamento real deve ser feito externamente (transferência bancária, etc). O botão apenas atualiza o status no sistema.

## 🚨 Ações Administrativas

### Suspender Afiliado

Para afiliados que violam termos:
1. Clique em **"Suspender"**
2. Afiliado não pode mais criar campanhas
3. Links existentes continuam funcionando (para não afetar vendas)
4. Status muda para "Suspenso"

### Reativar Afiliado

1. Filtre por status "Suspenso"
2. Clique em **"Reativar"**
3. Status volta para "Aprovado"
4. Afiliado pode voltar a criar campanhas

### Deletar Afiliado

**Cuidado:** Esta ação é permanente!
1. Clique em **"Deletar"** (ícone de lixeira)
2. Confirme com senha de admin
3. Todos os dados do afiliado são removidos
4. Campanhas e conversões são mantidas (para histórico)

## 📈 Monitoramento e Relatórios

### Métricas Importantes

**Performance de Afiliados:**
- Taxa de conversão (Vendas / Cliques)
- Ticket médio por venda
- ROI (Receita / Comissão paga)

**Top Performers:**
- Afiliados com mais vendas
- Afiliados com maior receita
- Afiliados com melhor taxa de conversão

### Alertas

Sistema alerta quando:
- ⚠️ Muitos afiliados pendentes (>10)
- ⚠️ Comissões pendentes acumuladas (>10.000 Kz)
- ⚠️ Afiliado com 0 vendas em 30 dias (inativo)

## 🎯 Boas Práticas

### Critérios de Aprovação

**Aprovar se:**
- ✅ Email corporativo ou profissional
- ✅ Nome completo fornecido
- ✅ Perfil em redes sociais relevante
- ✅ Experiência em marketing digital

**Rejeitar se:**
- ❌ Email temporário (temp mail, 10minutemail, etc)
- ❌ Nome incompleto ou falso
- ❌ Histórico de fraude
- ❌ Sem presença online

### Taxas de Comissão Sugeridas

| Categoria | Taxa Sugerida |
|-----------|---------------|
| Afiliado Novo | 5-8% |
| Afiliado Regular | 10-12% |
| Afiliado VIP | 15-20% |
| Influenciador | 20-30% |
| Parceiro Estratégico | 30-40% |

### Tempo de Resposta

- ⏱️ Responder aprovações em até 24-48 horas
- ⏱️ Pagamento de comissões: mensal
- ⏱️ Mínimo para saque: 5.000 Kz

## 🔒 Segurança

### Detectar Fraudes

**Sinais de Alerta:**
- 🚩 Muitos cliques sem conversões
- 🚩 Cliques do mesmo IP repetidamente
- 🚩 Vendas imediatamente após clique (pode ser o próprio afiliado)
- 🚩 Padrão de cliques não natural (bots)

**Ação Recomendada:**
1. Suspender afiliado temporariamente
2. Investigar padrão de cliques
3. Se fraude confirmada: deletar e bloquear
4. Se legítimo: reativar e pedir desculpas

### Prevenção

- ✅ Verificar email antes de aprovar
- ✅ Monitorar métricas regularmente
- ✅ Configurar limite de comissão diária (ex: 50.000 Kz)
- ✅ Validar vendas antes de marcar comissão como paga

## 📞 Suporte ao Afiliado

### Tickets Comuns

**"Não consigo criar campanha"**
- Verificar se está aprovado
- Verificar se não está suspenso
- Limpar cache do navegador

**"Link não está rastreando"**
- Verificar se link tem parâmetro ?ref=CODIGO
- Verificar se código está correto
- Testar link em navegador anônimo

**"Comissão não aparece"**
- Venda pode estar pendente de confirmação
- Verificar se ordem foi paga
- Atualizar dashboard (botão refresh)

## 📚 Recursos Adicionais

### SQL Queries Úteis

**Ver top 10 afiliados:**
```sql
SELECT name, email, total_sales, total_revenue, total_commission
FROM affiliates
WHERE status = 'approved'
ORDER BY total_revenue DESC
LIMIT 10;
```

**Ver campanhas mais performáticas:**
```sql
SELECT ac.name, a.name as affiliate, ac.clicks, ac.conversions, ac.revenue
FROM affiliate_campaigns ac
JOIN affiliates a ON ac.affiliate_id = a.id
ORDER BY ac.conversions DESC
LIMIT 20;
```

**Comissões pendentes por afiliado:**
```sql
SELECT a.name, a.email, a.pending_commission
FROM affiliates a
WHERE a.pending_commission > 0
ORDER BY a.pending_commission DESC;
```

---

**Dúvidas?** Entre em contato com o suporte técnico.
