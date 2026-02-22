# Guia de Deploy - Sistema de Afiliados

## ✅ Alterações Implementadas

### 1. Frontend
- ✅ **AffiliatePanel.tsx**: Painel completo para afiliados
  - Registro de novos afiliados
  - Verificação de status de aprovação
  - Dashboard com estatísticas (cliques, vendas, taxa de conversão)
  - Criação e gestão de campanhas
  - Rastreamento de comissões
  
- ✅ **AffiliateManagement.tsx**: Painel administrativo
  - Aprovação/rejeição de afiliados
  - Busca e filtros por status
  - Ajuste de taxa de comissão
  - Estatísticas gerais
  
- ✅ **Integração no App.tsx**: Rota 'affiliate' adicionada
- ✅ **Integração no AdminPanel.tsx**: Tab 'Afiliados' adicionada
- ✅ **Integração no Header.tsx**: Link "Programa de Afiliados" no menu do usuário
- ✅ **ProductDetailPage.tsx**: Botão de compartilhar adicionado

### 2. Database Schema
- ✅ **Migration criada**: `/supabase/migrations/create_affiliates_system.sql`

## 🚀 Passos para Deploy

### Passo 1: Aplicar Migration no Supabase

Você tem 2 opções para aplicar a migration:

#### Opção A: Via Supabase Dashboard (Recomendado)
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole o conteúdo de `/supabase/migrations/create_affiliates_system.sql`
6. Clique em **Run** ou pressione `Ctrl+Enter`
7. Verifique se não há erros

#### Opção B: Via CLI do Supabase
```bash
cd "KZSTORE Online Shop (4)"

# Se ainda não instalou o Supabase CLI:
npm install -g supabase

# Login no Supabase
supabase login

# Link ao projeto (substitua YOUR_PROJECT_ID)
supabase link --project-ref YOUR_PROJECT_ID

# Aplicar migration
supabase db push
```

### Passo 2: Verificar Tabelas Criadas

Execute no SQL Editor do Supabase para verificar:

```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'affiliate%';

-- Deve retornar:
-- affiliates
-- affiliate_campaigns
-- affiliate_clicks
-- affiliate_conversions
-- affiliate_payments
```

### Passo 3: Testar o Sistema

#### 3.1 Como Usuário
1. Faça login na plataforma
2. Clique no menu do usuário (canto superior direito)
3. Selecione **"Programa de Afiliados"**
4. Preencha o formulário de registro
5. Status ficará como "Pendente de Aprovação"

#### 3.2 Como Admin
1. Faça login com conta admin
2. Acesse o **Painel Admin**
3. Clique na aba **"Afiliados"**
4. Veja a lista de afiliados pendentes
5. Clique em **"Aprovar"** para aprovar um afiliado
6. Ajuste a taxa de comissão se necessário (padrão: 10%)

#### 3.3 Após Aprovação
1. Afiliado verá dashboard com:
   - Estatísticas (cliques, vendas, conversão)
   - Formulário para criar campanhas
   - Lista de campanhas com links
   - Rastreamento de comissões
   
2. Criar campanha:
   - Clique em **"+ Nova Campanha"**
   - Preencha nome e descrição
   - Selecione produto (opcional - para campanha geral, deixe em branco)
   - Sistema gera link único automaticamente
   - Copie e compartilhe o link

3. Compartilhar produtos:
   - Vá em qualquer página de produto
   - Clique no botão **"Compartilhar"** (ícone de share)
   - Use Web Share API ou copie o link

## 📊 Estrutura do Sistema

### Fluxo de Trabalho
```
1. Usuário se registra como afiliado
   ↓
2. Admin aprova/rejeita
   ↓
3. Afiliado cria campanhas
   ↓
4. Afiliado compartilha links
   ↓
5. Sistema rastreia cliques/conversões
   ↓
6. Admin vê estatísticas e paga comissões
```

### Tabelas do Banco
1. **affiliates**: Dados do afiliado (código, status, comissões)
2. **affiliate_campaigns**: Campanhas criadas (nome, link, produto)
3. **affiliate_clicks**: Rastreamento de cliques nos links
4. **affiliate_conversions**: Vendas realizadas via afiliados
5. **affiliate_payments**: Histórico de pagamentos de comissões

### Segurança (RLS Policies)
- ✅ Afiliados só veem seus próprios dados
- ✅ Admins têm acesso total
- ✅ Sistema gera códigos únicos automaticamente
- ✅ Validação de status antes de mostrar dashboard

## 🔧 Configurações Opcionais

### Taxa de Comissão Padrão
No arquivo `create_affiliates_system.sql`, linha 10:
```sql
commission_rate DECIMAL(5,2) DEFAULT 10.00
```
Altere `10.00` para a porcentagem desejada antes de aplicar a migration.

### Notificações por Email
Para implementar notificações quando afiliado é aprovado:

```sql
CREATE OR REPLACE FUNCTION notify_affiliate_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Adicionar lógica de envio de email aqui
    -- Exemplo: chamar edge function de email
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_affiliate_approved
AFTER UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION notify_affiliate_approval();
```

## ✅ Checklist de Deploy

- [ ] Migration aplicada no Supabase
- [ ] Tabelas criadas verificadas
- [ ] Frontend deployado no Vercel (já enviado para GitHub)
- [ ] Teste de registro de afiliado
- [ ] Teste de aprovação admin
- [ ] Teste de criação de campanha
- [ ] Teste de botão compartilhar em produtos
- [ ] Verificar RLS policies funcionando
- [ ] Configurar taxa de comissão desejada
- [ ] (Opcional) Configurar notificações por email

## 📝 Próximos Passos (Melhorias Futuras)

1. **Relatórios Avançados**
   - Gráficos de performance por período
   - Export de dados em CSV/Excel
   - Comparação entre campanhas

2. **Sistema de Pagamentos**
   - Integração com gateway de pagamento
   - Solicitação de saque de comissões
   - Histórico detalhado de pagamentos

3. **Gamificação**
   - Níveis de afiliado (Bronze, Prata, Ouro)
   - Bônus por metas atingidas
   - Ranking de top afiliados

4. **Marketing Tools**
   - Banners pré-criados para compartilhar
   - Emails templates para afiliados
   - Landing pages customizadas

## 🐛 Troubleshooting

### Erro: "Tabela já existe"
- Solução: Drop as tabelas antigas antes de aplicar migration
```sql
DROP TABLE IF EXISTS affiliate_payments CASCADE;
DROP TABLE IF EXISTS affiliate_conversions CASCADE;
DROP TABLE IF EXISTS affiliate_clicks CASCADE;
DROP TABLE IF EXISTS affiliate_campaigns CASCADE;
DROP TABLE IF EXISTS affiliates CASCADE;
```

### Erro: "Permission denied for table affiliates"
- Solução: Verificar RLS policies aplicadas corretamente
```sql
-- Ver policies existentes
SELECT * FROM pg_policies WHERE tablename LIKE 'affiliate%';
```

### Erro: "Cannot read property 'email' of null"
- Solução: Usuário não está logado. Faça login antes de acessar painel de afiliados

### Botão compartilhar não aparece
- Solução: Limpar cache do navegador e recarregar página
- Verificar se Web Share API é suportada (funciona em mobile e HTTPS)

## 📞 Suporte

Se encontrar problemas durante o deploy:
1. Verifique os logs do Supabase (Dashboard > Logs)
2. Verifique console do navegador (F12)
3. Verifique que todas as migrations foram aplicadas
4. Confirme que RLS policies estão ativas

---

**Deploy realizado em:** $(date)
**Branch:** main
**Commit:** 7f3a5280
