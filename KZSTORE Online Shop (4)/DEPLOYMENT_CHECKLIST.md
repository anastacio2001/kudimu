# 🚀 Guia Completo de Deploy - KZSTORE

## ✅ Status Atual da Aplicação

### **API sendo usada:**
- ✅ **Supabase REST API** (todos os produtos, pedidos, clientes)
- ✅ **Supabase Auth** (autenticação de usuários)
- ❌ **Edge Functions NÃO estão sendo usadas** (não precisa fazer deploy delas)

### **O que funciona:**
1. ✅ Sistema de produtos (CRUD completo)
2. ✅ Sistema de pedidos
3. ✅ Sistema de clientes
4. ✅ Sistema de afiliados
5. ✅ Produtos em destaque
6. ✅ Sistema de reviews (preparado)
7. ✅ Flash Sales
8. ✅ Sistema de tickets

---

## 📋 Migrations que você precisa aplicar

### **1. Migration de Produtos em Destaque**
Arquivo: `/supabase/migrations/add_featured_products.sql`

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_featured_order ON products(is_featured, featured_order DESC) WHERE is_featured = true;

COMMENT ON COLUMN products.is_featured IS 'Indica se o produto deve aparecer na seção de destaque da homepage';
COMMENT ON COLUMN products.featured_order IS 'Ordem de exibição dos produtos em destaque (maior = primeiro)';
```

### **2. Migration do Sistema de Reviews**
Arquivo: `/supabase/migrations/create_reviews_system.sql`

Execute TODO o conteúdo do arquivo no SQL Editor do Supabase.

### **3. Migration do Sistema de Afiliados** (se ainda não aplicou)
Arquivo: `/supabase/migrations/create_affiliates_system_fixed.sql`

Execute TODO o conteúdo do arquivo no SQL Editor do Supabase.

---

## 🔧 Como Aplicar as Migrations

### **Opção 1: Via Supabase Dashboard** (Recomendado)

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione** seu projeto
3. **Vá em SQL Editor** (menu lateral)
4. **Clique em "New Query"**
5. **Copie** o conteúdo de cada migration
6. **Cole** no editor
7. **Clique em "Run"** (ou Ctrl+Enter)
8. **Repita** para cada migration

### **Opção 2: Via CLI do Supabase**

```bash
cd "KZSTORE Online Shop (4)"

# Login no Supabase (se ainda não fez)
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Aplicar todas as migrations
supabase db push
```

---

## 📦 Verificar se há Produtos no Banco

Execute no SQL Editor:

```sql
-- Ver quantos produtos existem
SELECT COUNT(*) as total FROM products;

-- Ver produtos atuais
SELECT id, nome, categoria, preco_aoa, estoque, is_featured
FROM products
LIMIT 10;
```

### **Se NÃO houver produtos:**

Use o arquivo `/supabase/migrations/check_and_add_products.sql` que tem:
- SQL para verificar estrutura
- SQL comentado para adicionar 10 produtos de teste
- Descomente a seção `INSERT INTO products` e execute

OU

Vá no **Painel Admin** da sua aplicação:
1. Login como admin
2. Painel Admin → Produtos
3. Clique em "Adicionar Produto"
4. Preencha os dados manualmente

---

## 🌟 Configurar Produtos em Destaque

Depois que tiver produtos no banco:

1. **Acesse** Painel Admin → Produtos
2. **Clique** na **estrela** ⭐ dos produtos que deseja destacar
3. **Máximo recomendado**: 4 produtos
4. **Os produtos** aparecerão na homepage na seção "Produtos em Destaque"

---

## ⭐ Sistema de Avaliações

### **Tabela já criada:** `reviews`

**Para adicionar reviews de teste:**

```sql
INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, verified_purchase)
VALUES
  ('SEU_PRODUCT_ID', 'João Silva', 'joao@email.com', 5, 'Excelente!', 'Produto muito bom!', true),
  ('SEU_PRODUCT_ID', 'Maria Costa', 'maria@email.com', 4, 'Bom', 'Recomendo!', true);
```

**Substitua** `SEU_PRODUCT_ID` pelo ID real do produto.

**Para pegar IDs dos produtos:**
```sql
SELECT id, nome FROM products LIMIT 5;
```

---

## 🔍 Verificação Pós-Deploy

### **1. Verificar Tabelas Criadas**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'reviews', 'affiliates', 'affiliate_campaigns', 'affiliate_clicks', 'affiliate_conversions', 'affiliate_payments')
ORDER BY table_name;
```

**Deve retornar 7 tabelas.**

### **2. Verificar Colunas de Produtos**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('is_featured', 'featured_order')
ORDER BY column_name;
```

**Deve retornar 2 colunas.**

### **3. Ver Produtos em Destaque**

```sql
SELECT nome, is_featured, featured_order 
FROM products 
WHERE is_featured = true 
ORDER BY featured_order DESC;
```

---

## 🐛 Problemas Comuns

### **"Não vejo produtos na homepage"**

**Causa 1**: Não há produtos no banco
- **Solução**: Adicione produtos via Admin Panel ou SQL

**Causa 2**: Não há produtos marcados como destaque
- **Solução**: Marque produtos no Admin Panel (clique na estrela ⭐)

**Causa 3**: Migration não foi aplicada
- **Solução**: Execute migration `add_featured_products.sql`

### **"Reviews não aparecem"**

**Causa**: Tabela `reviews` não existe
- **Solução**: Execute migration `create_reviews_system.sql`

### **"Afiliados não funcionam"**

**Causa**: Tabelas de afiliados não existem
- **Solução**: Execute migration `create_affiliates_system_fixed.sql`

---

## 📊 Checklist de Deploy Completo

- [ ] Migration de produtos em destaque aplicada
- [ ] Migration de reviews aplicada
- [ ] Migration de afiliados aplicada (se usar)
- [ ] Produtos cadastrados no banco
- [ ] 4 produtos marcados como destaque
- [ ] Reviews de teste adicionadas (opcional)
- [ ] Código deployado no Vercel
- [ ] Teste de navegação na homepage
- [ ] Teste de adicionar produto ao carrinho
- [ ] Teste de criar pedido
- [ ] Teste de login/registro

---

## 🎯 Resultado Esperado

### **Homepage deve mostrar:**
1. ✅ Banner principal
2. ✅ Categorias de produtos
3. ✅ **Seção "Produtos em Destaque"** com 4 produtos marcados ⭐
4. ✅ Rodapé com links

### **Página de Produto deve mostrar:**
1. ✅ Imagens do produto
2. ✅ Preço e descrição
3. ✅ Botão adicionar ao carrinho
4. ✅ Botão de compartilhar
5. ✅ **Seção de avaliações** (reviews)

### **Painel Admin deve ter:**
1. ✅ Tab "Produtos" com coluna "Destaque" (estrela ⭐)
2. ✅ Tab "Afiliados" (se migration foi aplicada)
3. ✅ Possibilidade de marcar/desmarcar produtos como destaque

---

## 🚀 Deploy Automático

O código já está no GitHub e o Vercel faz deploy automático a cada push.

**Ver status do deploy:**
- Acesse: https://vercel.com/seu-usuario/kudimu
- Ou check GitHub Actions se configurou

---

## 📞 Suporte

Se encontrar erros:
1. **Abra** o console do navegador (F12)
2. **Veja** mensagens de erro
3. **Check** os logs do Supabase (Dashboard > Logs)
4. **Verifique** se todas as migrations foram aplicadas

---

**Último update:** $(date)
**Branch:** main
**Commit:** 9d2850eb

✅ **Tudo pronto para uso!**
